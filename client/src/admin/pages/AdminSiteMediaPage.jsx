import { useCallback, useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, Upload } from 'lucide-react';
import PageHeader from '@/admin/components/ui/PageHeader';
import {
  useGetAdminSiteMediaQuery,
  useUploadSiteMediaMutation,
} from '@/services/siteMediaApi';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const SITE_MEDIA_RECOMMENDED_SIZES = {
  logo: '400 × 120 px',
  'about-us': '1200 × 900 px',
  office: '1200 × 900 px',
  ...Object.fromEntries(
    Array.from({ length: 11 }, (_, index) => [
      `gallery-${index + 1}`,
      '800 × 600 px',
    ]),
  ),
};

const validateImageFile = (file) => {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Only JPG, JPEG, PNG and WEBP images are allowed.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be 5MB or smaller.';
  }

  return null;
};

function SiteMediaUploadCard({ asset, onUpload, isUploading }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [localError, setLocalError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [previewUrl]);

  const handleFile = (file) => {
    const errorMessage = validateImageFile(file);
    if (errorMessage) {
      setLocalError(errorMessage);
      clearPreview();
      return;
    }

    setLocalError('');
    clearPreview();
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handlePublish = async () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    setLocalError('');

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('alt', asset.alt || '');

    try {
      await onUpload(asset.key, formData);
      clearPreview();
    } catch (error) {
      setLocalError(error?.data?.message || 'Failed to upload image.');
    }
  };

  const displayImage = previewUrl || asset.imageUrl;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{asset.label}</h3>
        {SITE_MEDIA_RECOMMENDED_SIZES[asset.key] ? (
          <p className="mt-1 text-xs text-slate-500">
            Recommended size: {SITE_MEDIA_RECOMMENDED_SIZES[asset.key]}
          </p>
        ) : null}
        <p className="text-sm text-slate-500">
          {asset.storedImageUrl ? 'Cloudinary image saved' : 'Using fallback image'}
        </p>
      </div>

      <div
        className={`overflow-hidden rounded-xl border bg-slate-50 ${
          isDragging ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200'
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file) {
            handleFile(file);
          }
        }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={asset.alt}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 px-4 text-center text-slate-500">
            <ImagePlus className="h-8 w-8 text-slate-400" />
            <p className="text-sm">Drag and drop or choose an image</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            handleFile(file);
          }
        }}
      />

      {localError && (
        <p className="mt-3 text-sm text-red-600">{localError}</p>
      )}

      <button
        type="button"
        onClick={handlePublish}
        disabled={isUploading}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            {selectedFile ? 'Publish Image' : 'Choose Image'}
          </>
        )}
      </button>
    </article>
  );
}

const sectionTitles = {
  brand: 'Brand',
  gallery: 'Installation Gallery',
  about: 'About Us',
  office: 'Office',
};

export default function AdminSiteMediaPage() {
  const { data, isLoading, error } = useGetAdminSiteMediaQuery();
  const [uploadSiteMedia] = useUploadSiteMediaMutation();
  const [uploadingKey, setUploadingKey] = useState(null);
  const [feedback, setFeedback] = useState('');

  const assets = data?.data?.assets ?? [];

  const handleUpload = async (key, formData) => {
    setUploadingKey(key);
    setFeedback('');

    try {
      await uploadSiteMedia({ key, formData }).unwrap();
      setFeedback('Site image uploaded to Cloudinary successfully.');
    } finally {
      setUploadingKey(null);
    }
  };

  const groupedAssets = assets.reduce((groups, asset) => {
    const section = asset.section || 'other';
    if (!groups[section]) {
      groups[section] = [];
    }
    groups[section].push(asset);
    return groups;
  }, {});

  return (
    <div>
      <PageHeader
        title="Site Images"
        description="Upload logo, gallery, about us and office images to Cloudinary."
      />

      {feedback && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {feedback}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error?.data?.message || 'Failed to load site images.'}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading site images...
        </div>
      ) : (
        Object.entries(groupedAssets).map(([section, sectionAssets]) => (
          <section key={section} className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              {sectionTitles[section] ?? section}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sectionAssets.map((asset) => (
                <SiteMediaUploadCard
                  key={asset.key}
                  asset={asset}
                  onUpload={handleUpload}
                  isUploading={uploadingKey === asset.key}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
