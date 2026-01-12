import { forwardRef, useState, type HTMLAttributes } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage, deleteImage } from '../../services/storage.service';

interface ImageUploadProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  onUpload?: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  folder?: 'products' | 'gallery' | 'events' | 'creations';
}

export const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(
  ({ value, onUpload, onRemove, label = 'Upload Image', folder = 'products', className = '', ...props }, ref) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = async (file: File) => {
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        setError('Le fichier doit être une image');
        return;
      }

      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }

      setError(null);
      setIsUploading(true);

      const result = await uploadImage(file, folder);

      setIsUploading(false);

      if (result.success && result.url) {
        onUpload?.(result.url);
      } else {
        setError(result.error || 'Erreur lors de l\'upload');
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    const handleRemove = async () => {
      if (value) {
        // Essayer de supprimer du storage (ne pas bloquer si ça échoue)
        await deleteImage(value);
        onRemove?.();
      }
    };

    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <p className="block text-sm font-medium text-gray-700 mb-1.5 ps-0.5">{label}</p>
        )}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`relative border-2 border-dashed rounded-lg transition-colors cursor-pointer overflow-hidden
            ${error ? 'border-red-300' : 'border-gray-200 hover:border-gold-400'}
            ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          {value ? (
            <div className="relative aspect-video">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity
                flex items-center justify-center gap-3">
                <label className="px-3 py-1.5 bg-white rounded-md text-sm font-medium cursor-pointer
                  hover:bg-gray-100 transition-colors">
                  Changer
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                    className="hidden"
                  />
                </label>
                {onRemove && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-gray-400">
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-2" />
                  <p className="text-sm font-medium">Upload en cours...</p>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-gray-100 mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">Glissez une image ou cliquez pour uploader</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 5MB</p>
                </>
              )}
            </div>
          )}
          {!value && !isUploading && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';
