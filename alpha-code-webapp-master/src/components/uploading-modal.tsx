import React from 'react';
import UpLoadingState from './uploading-state';
import { toast } from 'sonner'
import { XIcon } from 'lucide-react'

interface UploadingModalProps {
  open: boolean;
  progress?: number; // 0-100
  message?: string;
  onClose?: () => void;
}

const UploadingModal: React.FC<UploadingModalProps> = ({ open, progress = 0, message, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center h-screen justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative max-h-[calc(100vh-4rem)] overflow-y-auto">
        {onClose && (
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
            onClick={() => { onClose(); toast.info('Đã hủy tải lên') }}
            aria-label="Đóng"
          >
            <XIcon className="w-5 h-5" />
          </button>
        )}
        <UpLoadingState message={message} />
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-600 mt-1">{progress}%</div>
        </div>
        {onClose && (
          <div className="mt-6">
            <button
              className="mb-2 w-full py-2 rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50 text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm"
              onClick={() => { onClose(); toast('Đã hủy tải lên') }}
              type="button"
            >
              <XIcon className="w-5 h-5" />
              <span>Hủy tải lên</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadingModal;
