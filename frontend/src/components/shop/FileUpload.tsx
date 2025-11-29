import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, File, Loader2, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import shopApi from '../../utils/shopApi';

interface FileUploadProps {
  onUpload: (urls: string[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  existingFiles?: string[];
  onRemove?: (url: string) => void;
}

interface UploadedFile {
  file: File;
  preview: string;
  url?: string;
  uploading: boolean;
  error?: string;
}

export default function FileUpload({
  onUpload,
  multiple = false,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
  maxFiles = 10,
  existingFiles = [],
  onRemove,
}: FileUploadProps) {
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(async (fileList: FileList) => {
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      if (!multiple && files.length + newFiles.length >= 1) break;
      if (files.length + newFiles.length >= maxFiles) break;

      const file = fileList[i];

      if (file.size > maxSize) {
        console.error(`File ${file.name} is too large`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      newFiles.push({ file, preview, uploading: true });
    }

    setFiles((prev) => [...prev, ...newFiles]);

    for (const fileData of newFiles) {
      try {
        const res = await shopApi.uploadImage(fileData.file);
        if (res.success && res.data) {
          setFiles((prev) =>
            prev.map((f) =>
              f.preview === fileData.preview
                ? { ...f, url: res.data?.url, uploading: false }
                : f
            )
          );
          onUpload([res.data.url]);
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.preview === fileData.preview
                ? { ...f, uploading: false, error: res.error || 'Upload failed' }
                : f
            )
          );
        }
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.preview === fileData.preview
              ? { ...f, uploading: false, error: 'Upload failed' }
              : f
          )
        );
      }
    }
  }, [files.length, maxFiles, maxSize, multiple, onUpload]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (preview: string) => {
    setFiles((prev) => prev.filter((f) => f.preview !== preview));
    URL.revokeObjectURL(preview);
  };

  const removeExisting = (url: string) => {
    onRemove?.(url);
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? theme === 'dark'
              ? 'border-electric-blue bg-electric-blue/10'
              : 'border-accent-blue bg-accent-blue/10'
            : theme === 'dark'
              ? 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <Upload className={`w-10 h-10 mx-auto mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <p className={`font-medium mb-1 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Drop files here or click to upload
        </p>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {accept.includes('image') ? 'PNG, JPG, GIF up to ' : 'Files up to '}
          {(maxSize / 1024 / 1024).toFixed(0)}MB
        </p>
      </div>

      <AnimatePresence>
        {(existingFiles.length > 0 || files.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingFiles.map((url, i) => (
              <motion.div
                key={`existing-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative aspect-square rounded-xl overflow-hidden border ${
                  theme === 'dark' ? 'border-slate-600' : 'border-gray-200'
                }`}
              >
                {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img src={url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                  }`}>
                    <File className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); removeExisting(url); }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}

            {files.map((fileData) => (
              <motion.div
                key={fileData.preview}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative aspect-square rounded-xl overflow-hidden border ${
                  fileData.error
                    ? 'border-red-500'
                    : theme === 'dark' ? 'border-slate-600' : 'border-gray-200'
                }`}
              >
                {fileData.file.type.startsWith('image/') ? (
                  <img src={fileData.preview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                  }`}>
                    <File className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                {fileData.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}

                {fileData.url && !fileData.uploading && (
                  <div className="absolute bottom-2 right-2 p-1 rounded-full bg-green-500 text-white">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                {fileData.error && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-500 text-xs font-medium px-2 text-center">
                      {fileData.error}
                    </span>
                  </div>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(fileData.preview); }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
