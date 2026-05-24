import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const getFileType = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['jpg','jpeg','png','gif','bmp','webp','svg'].includes(ext)) return 'image';
  if (['mp4','webm','ogg','mov'].includes(ext)) return 'video';
  if (ext === 'pdf') return 'pdf';
  if (['txt','csv','json','xml','md','log'].includes(ext)) return 'text';
  return 'other';
};

export default function FilePreviewModal({ file, publicUrl, onClose }) {
  const [textContent, setTextContent] = useState(null);
  const [textLoading, setTextLoading] = useState(false);
  const [textError, setTextError] = useState(null);

  const type = getFileType(file.filename);

  useEffect(() => {
    if (type === 'text') {
      setTextLoading(true);
      setTextError(null);
      fetch(publicUrl)
        .then(r => {
          if (!r.ok) throw new Error('Failed to load');
          return r.text();
        })
        .then(setTextContent)
        .catch(() => setTextError('Could not load file content'))
        .finally(() => setTextLoading(false));
    }
  }, [publicUrl, type]);

  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium dark:text-gray-100 truncate">{file.filename}</span>
            {file.size ? <span className="text-xs text-gray-400 dark:text-gray-500">({formatSize(file.size)})</span> : null}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none ml-4">&times;</button>
        </div>
        <div className="flex-1 overflow-auto p-5 flex items-center justify-center bg-gray-100 dark:bg-gray-900/50">
          {type === 'image' && (
            <img src={publicUrl} alt={file.filename} className="max-w-full max-h-[70vh] object-contain rounded" />
          )}
          {type === 'video' && (
            <video src={publicUrl} controls className="max-w-full max-h-[70vh] rounded" />
          )}
          {type === 'pdf' && (
            <iframe src={publicUrl} title={file.filename} className="w-full h-[70vh] rounded" />
          )}
          {type === 'text' && (
            <div className="w-full h-[70vh] overflow-auto bg-white dark:bg-gray-800 rounded p-4">
              {textLoading && <p className="text-sm text-gray-400">Loading...</p>}
              {textError && <p className="text-sm text-red-400">{textError}</p>}
              {textContent !== null && (
                <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">{textContent}</pre>
              )}
            </div>
          )}
          {type === 'other' && (
            <div className="text-center py-8">
              <p className="text-gray-400 dark:text-gray-500 mb-3">Preview not available for this file type</p>
              <a href={publicUrl} target="_blank" rel="noreferrer"
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700">
                Open File
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
