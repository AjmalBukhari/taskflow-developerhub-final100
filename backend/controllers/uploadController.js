const multer = require('multer');
const path = require('path');
const fs = require('fs');
const supabase = require('../config/supabase');
const AppError = require('../utils/appError');

const BASE_UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(BASE_UPLOAD_DIR, req.user.id);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

exports.uploadAttachment = async (req, res, next) => {
  try {
    const { data: task, error } = await supabase
      .from('tasks')
      .select('id, attachments')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .eq('isDeleted', false)
      .single();
    if (error || !task) return next(AppError('Task not found or access denied', 404));
    if (!req.file) return next(AppError('No file uploaded', 400));

    const existingIds = task.attachments || [];
    if (existingIds.length > 0) {
      const { data: existingFiles } = await supabase
        .from('uploadFiles')
        .select('filename')
        .in('id', existingIds);
      const existingNames = (existingFiles || []).map(f => f.filename);
      if (existingNames.includes(req.file.originalname)) {
        fs.unlinkSync(req.file.path);
        return next(AppError(`File "${req.file.originalname}" already exists. Rename and try again.`, 400));
      }
    }

    const relativePath = `uploads/${req.user.id}/${req.file.filename}`;
    const { data: fileRecord, error: insertError } = await supabase
      .from('uploadFiles')
      .insert({
        filename: req.file.originalname,
        filepath: relativePath,
        user_id: req.user.id,
        task_id: req.params.id,
        size: req.file.size
      })
      .select()
      .single();
    if (insertError) return next(AppError(insertError.message, 400));

    const attachments = [...existingIds, fileRecord.id];
    await supabase.from('tasks').update({ attachments }).eq('id', req.params.id);

    res.status(201).json({ status: 'success', message: 'File uploaded', data: fileRecord });
  } catch (err) {
    next(err);
  }
};

exports.getAttachments = async (req, res, next) => {
  try {
    const { data: task } = await supabase
      .from('tasks')
      .select('id, attachments')
      .eq('id', req.params.taskId)
      .or(`user_id.eq.${req.user.id}`)
      .eq('isDeleted', false)
      .single();
    if (!task) return next(AppError('Task not found or access denied', 404));

    const ids = task.attachments || [];
    if (ids.length === 0) return res.json({ status: 'success', data: [] });

    const { data: files, error } = await supabase
      .from('uploadFiles')
      .select('*')
      .in('id', ids);
    if (error) return next(AppError(error.message, 400));

    res.json({ status: 'success', data: files });
  } catch (err) {
    next(err);
  }
};

exports.downloadAttachment = async (req, res, next) => {
  try {
    const { data: fileRecord, error } = await supabase
      .from('uploadFiles')
      .select('*')
      .eq('id', req.params.attachmentId)
      .single();
    if (error || !fileRecord) return next(AppError('File not found', 404));

    const { data: task } = await supabase
      .from('tasks')
      .select('id, user_id')
      .eq('id', fileRecord.task_id)
      .eq('isDeleted', false)
      .single();
    if (!task || (task.user_id !== req.user.id && fileRecord.user_id !== req.user.id))
      return next(AppError('Access denied', 403));

    const filePath = path.join(BASE_UPLOAD_DIR, '..', fileRecord.filepath);
    if (!fs.existsSync(filePath)) return next(AppError('File not found on disk', 404));
    res.download(filePath, fileRecord.filename);
  } catch (err) {
    next(err);
  }
};

exports.previewAttachment = async (req, res, next) => {
  try {
    const { data: fileRecord, error } = await supabase
      .from('uploadFiles')
      .select('*')
      .eq('id', req.params.attachmentId)
      .single();
    if (error || !fileRecord) return next(AppError('File not found', 404));

    const { data: task } = await supabase
      .from('tasks')
      .select('id, user_id')
      .eq('id', fileRecord.task_id)
      .eq('isDeleted', false)
      .single();
    if (!task || (task.user_id !== req.user.id && fileRecord.user_id !== req.user.id))
      return next(AppError('Access denied', 403));

    const filePath = path.join(BASE_UPLOAD_DIR, '..', fileRecord.filepath);
    if (!fs.existsSync(filePath)) return next(AppError('File not found on disk', 404));
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
};

exports.removeAttachment = async (req, res, next) => {
  try {
    const { data: fileRecord, error: fetchError } = await supabase
      .from('uploadFiles')
      .select('*')
      .eq('id', req.params.attachmentId)
      .single();
    if (fetchError || !fileRecord) return next(AppError('File not found', 404));

    const { data: task } = await supabase
      .from('tasks')
      .select('id, attachments')
      .eq('id', fileRecord.task_id)
      .eq('user_id', req.user.id)
      .eq('isDeleted', false)
      .single();
    if (!task) return next(AppError('Task not found or access denied', 404));

    const filePath = path.join(BASE_UPLOAD_DIR, '..', fileRecord.filepath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await supabase.from('uploadFiles').delete().eq('id', req.params.attachmentId);

    const attachments = (task.attachments || []).filter(id => id !== req.params.attachmentId);
    await supabase.from('tasks').update({ attachments }).eq('id', fileRecord.task_id);

    res.json({ status: 'success', message: 'Attachment removed' });
  } catch (err) {
    next(err);
  }
};

exports.copyFilesForShare = async (task, recipientId) => {
  const ids = task.attachments || [];
  if (ids.length === 0) return [];

  const { data: sourceFiles } = await supabase
    .from('uploadFiles')
    .select('*')
    .in('id', ids);

  if (!sourceFiles || sourceFiles.length === 0) return [];

  const destDir = path.join(BASE_UPLOAD_DIR, recipientId);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const newIds = [];
  for (const file of sourceFiles) {
    const srcPath = path.join(BASE_UPLOAD_DIR, '..', file.filePath);
    const newStoredName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.filename);
    const destPath = path.join(destDir, newStoredName);
    if (fs.existsSync(srcPath)) fs.copyFileSync(srcPath, destPath);

    const { data: newRecord } = await supabase
      .from('uploadFiles')
      .insert({
        filename: file.filename,
        filepath: `uploads/${recipientId}/${newStoredName}`,
        user_id: recipientId,
        task_id: task.id,
        size: file.size
      })
      .select()
      .single();

    if (newRecord) newIds.push(newRecord.id);
  }
  return newIds;
};

exports.deleteUserFolder = (userId) => {
  const userDir = path.join(BASE_UPLOAD_DIR, userId);
  if (fs.existsSync(userDir)) fs.rmSync(userDir, { recursive: true, force: true });
};

exports.createUserFolder = (userId) => {
  const userDir = path.join(BASE_UPLOAD_DIR, userId);
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
};

exports.upload = upload;
