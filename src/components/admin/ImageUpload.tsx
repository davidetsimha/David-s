import { forwardRef, type HTMLAttributes } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  onUpload?: (url: string) => void;
  label?: string;
}

export const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(
  ({ value, onUpload, label = 'Upload Image', className = '', ...props }, ref) => {
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      // Placeholder for actual upload implementation
      console.log('File dropped:', e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <p className="block text-sm font-medium text-gray-700 mb-1.5 ps-0.5">{label}</p>
        )}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative border-2 border-dashed border-gray-200 rounded-lg
            hover:border-gold-400 transition-colors cursor-pointer overflow-hidden"
        >
          {value ? (
            <div className="relative aspect-video">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity
                flex items-center justify-center">
                <p className="text-white text-sm font-medium">Click to change</p>
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-gray-400">
              <div className="p-3 rounded-full bg-gray-100 mb-3">
                {value ? <ImageIcon className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
              </div>
              <p className="text-sm font-medium">Drop image here or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onUpload) {
                // Placeholder: create object URL for preview
                onUpload(URL.createObjectURL(file));
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';
