import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react';
import PageHeader from '@/admin/components/ui/PageHeader';
import StatusBadge from '@/admin/components/ui/StatusBadge';
import {
  useDeleteHomepageBannerMutation,
  useGetAdminHomepageBannersQuery,
  useUploadHomepageBannerMutation,
} from '@/services/homepageBannerApi';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BANNER_SLOTS = [1, 2, 3, 4];

const validateBannerFile = (file) => {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Only JPG, JPEG, PNG and WEBP images are allowed.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be 5MB or smaller.';
  }

  return null;
};

function BannerSlotCard({
  position,
  banner,
  onUpload,
  onDelete,
  isUploading,
  isDeleting,
}) {
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
    const errorMessage = validateBannerFile(file);
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
    formData.append('title', `Banner ${position}`);

    try {
      await onUpload(position, formData);
      clearPreview();
    } catch (error) {
      setLocalError(error?.data?.message || 'Failed to publish banner.');
    }
  };

  const displayImage = previewUrl || banner?.imageUrl;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Banner {position}
          </h3>
          <p className="text-sm text-slate-500">
            {banner ? banner.title : 'No banner uploaded yet'}
          </p>
        </div>
        <StatusBadge active={Boolean(banner?.isActive)} label={banner ? 'Active' : 'Empty'} />
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
            alt={`Banner ${position}`}
            className="block h-44 w-full object-cover object-center sm:h-52"
          />
        ) : (
          <div className="flex h-44 flex-col items-center justify-center px-4 text-center sm:h-52">
            <ImagePlus className="h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm text-slate-500">
              Drag and drop or choose an image
            </p>
          </div>
        )}
      </div>

      {localError && (
        <p className="mt-3 text-sm text-red-600">{localError}</p>
      )}

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

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Upload className="h-4 w-4" />
          {banner ? 'Replace Banner' : 'Choose Image'}
        </button>

        <button
          type="button"
          disabled={!selectedFile || isUploading}
          onClick={handlePublish}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            'Publish Banner'
          )}
        </button>

        {banner && (
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onDelete(position)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        )}
      </div>
    </article>
  );
}

export default function AdminBannerManagementPage() {
  const [successMessage, setSuccessMessage] = useState('');
  const [globalError, setGlobalError] = useState('');

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAdminHomepageBannersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [uploadBanner] = useUploadHomepageBannerMutation();
  const [deleteBanner] = useDeleteHomepageBannerMutation();
  const [uploadingPosition, setUploadingPosition] = useState(null);
  const [deletingPosition, setDeletingPosition] = useState(null);

  const slots = data?.data?.slots ?? BANNER_SLOTS.map((position) => ({
    position,
    banner: null,
  }));

  const handleUpload = async (position, formData) => {
    setGlobalError('');
    setSuccessMessage('');
    setUploadingPosition(position);

    try {
      await uploadBanner({ position, formData }).unwrap();
      setSuccessMessage(`Banner ${position} updated successfully.`);
    } catch (uploadError) {
      setGlobalError(
        uploadError?.data?.message || `Failed to publish banner ${position}.`,
      );
      throw uploadError;
    } finally {
      setUploadingPosition(null);
    }
  };

  const handleDelete = async (position) => {
    setGlobalError('');
    setSuccessMessage('');
    setDeletingPosition(position);

    try {
      await deleteBanner(position).unwrap();
      setSuccessMessage(`Banner ${position} removed successfully.`);
    } catch (deleteError) {
      setGlobalError(
        deleteError?.data?.message || `Failed to remove banner ${position}.`,
      );
    } finally {
      setDeletingPosition(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="font-medium">Unable to load banner management data.</p>
        <p className="mt-1 text-sm">{error?.data?.message || 'Please try again.'}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homepage Banner Management"
        description="Manage four independent homepage banner slots. Updating one banner does not affect the others."
      />

      {successMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {globalError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{globalError}</p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {slots.map(({ position, banner }) => (
          <BannerSlotCard
            key={position}
            position={position}
            banner={banner}
            onUpload={handleUpload}
            onDelete={handleDelete}
            isUploading={uploadingPosition === position}
            isDeleting={deletingPosition === position}
          />
        ))}
      </div>
    </div>
  );
}
