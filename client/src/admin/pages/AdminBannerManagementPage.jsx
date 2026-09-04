import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Link2,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react';
import PageHeader from '@/admin/components/ui/PageHeader';
import StatusBadge from '@/admin/components/ui/StatusBadge';
import {
  useDeleteHomepageBannerMutation,
  useGetAdminHomepageBannersQuery,
  useUpdateHomepageBannerMutation,
  useUploadHomepageBannerMutation,
} from '@/services/homepageBannerApi';
import { useGetAdminCategoriesQuery } from '@/services/categoriesApi';
import { useGetAdminProductsQuery } from '@/services/productsApi';
import { getBannerCtaLabel, getBannerLinkPreview } from '@/utils/bannerLink';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BANNER_SLOTS = [1, 2, 3, 4];
const LINK_TYPES = [
  { value: 'none', label: 'No Link' },
  { value: 'category', label: 'Category' },
  { value: 'product', label: 'Product' },
  { value: 'url', label: 'Custom Link' },
];

const validateBannerFile = (file) => {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Only JPG, JPEG, PNG and WEBP images are allowed.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be 5MB or smaller.';
  }

  return null;
};

function BannerLinkFields({
  linkType,
  linkTargetId,
  linkUrl,
  onLinkTypeChange,
  onLinkTargetChange,
  onLinkUrlChange,
  categories,
  products,
  disabled = false,
}) {
  return (
    <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <Link2 className="h-4 w-4 text-solar-600" />
        Banner Link
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Link Type
        </label>
        <select
          value={linkType}
          disabled={disabled}
          onChange={(event) => onLinkTypeChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-solar-400 focus:ring-2 focus:ring-solar-100 disabled:opacity-60"
        >
          {LINK_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {linkType === 'category' && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Select Category
          </label>
          <select
            value={linkTargetId}
            disabled={disabled}
            onChange={(event) => onLinkTargetChange(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-solar-400 focus:ring-2 focus:ring-solar-100 disabled:opacity-60"
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {linkType === 'product' && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Select Product
          </label>
          <select
            value={linkTargetId}
            disabled={disabled}
            onChange={(event) => onLinkTargetChange(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-solar-400 focus:ring-2 focus:ring-solar-100 disabled:opacity-60"
          >
            <option value="">Choose a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {linkType === 'url' && (
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Custom Link URL
          </label>
          <input
            type="url"
            value={linkUrl}
            disabled={disabled}
            onChange={(event) => onLinkUrlChange(event.target.value)}
            placeholder="https://example.com or /contact"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-solar-400 focus:ring-2 focus:ring-solar-100 disabled:opacity-60"
          />
        </div>
      )}

      {linkType !== 'none' && (linkTargetId || linkUrl) ? (
        <div className="rounded-lg border border-solar-100 bg-white px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Website preview
          </p>
          <p className="mt-1 text-sm font-semibold text-solar-800">
            CTA: {getBannerCtaLabel({ linkType })}
          </p>
          <p className="mt-0.5 break-all text-xs text-slate-600">
            Opens:{' '}
            {getBannerLinkPreview({
              linkType,
              linkTargetId,
              linkUrl,
              categories,
              products,
            }) || 'Selected destination'}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function BannerSlotCard({
  position,
  banner,
  categories,
  products,
  onUpload,
  onUpdateLink,
  onDelete,
  isUploading,
  isUpdatingLink,
  isDeleting,
}) {
  const desktopFileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);
  const [previewDesktopUrl, setPreviewDesktopUrl] = useState('');
  const [previewMobileUrl, setPreviewMobileUrl] = useState('');
  const [selectedDesktopFile, setSelectedDesktopFile] = useState(null);
  const [selectedMobileFile, setSelectedMobileFile] = useState(null);
  const [localError, setLocalError] = useState('');
  const [isDraggingDesktop, setIsDraggingDesktop] = useState(false);
  const [isDraggingMobile, setIsDraggingMobile] = useState(false);
  const [linkType, setLinkType] = useState(banner?.linkType || 'none');
  const [linkTargetId, setLinkTargetId] = useState(banner?.linkTargetId || '');
  const [linkUrl, setLinkUrl] = useState(banner?.linkUrl || '');

  useEffect(() => {
    setLinkType(banner?.linkType || 'none');
    setLinkTargetId(banner?.linkTargetId || '');
    setLinkUrl(banner?.linkUrl || '');
  }, [banner?.linkType, banner?.linkTargetId, banner?.linkUrl, banner?.updatedAt]);

  useEffect(() => {
    return () => {
      if (previewDesktopUrl) {
        URL.revokeObjectURL(previewDesktopUrl);
      }
      if (previewMobileUrl) {
        URL.revokeObjectURL(previewMobileUrl);
      }
    };
  }, [previewDesktopUrl, previewMobileUrl]);

  const clearDesktopPreview = useCallback(() => {
    if (previewDesktopUrl) {
      URL.revokeObjectURL(previewDesktopUrl);
    }
    setPreviewDesktopUrl('');
    setSelectedDesktopFile(null);
    if (desktopFileInputRef.current) {
      desktopFileInputRef.current.value = '';
    }
  }, [previewDesktopUrl]);

  const clearMobilePreview = useCallback(() => {
    if (previewMobileUrl) {
      URL.revokeObjectURL(previewMobileUrl);
    }
    setPreviewMobileUrl('');
    setSelectedMobileFile(null);
    if (mobileFileInputRef.current) {
      mobileFileInputRef.current.value = '';
    }
  }, [previewMobileUrl]);

  const handleDesktopFile = (file) => {
    const errorMessage = validateBannerFile(file);
    if (errorMessage) {
      setLocalError(errorMessage);
      clearDesktopPreview();
      return;
    }

    setLocalError('');
    clearDesktopPreview();
    setSelectedDesktopFile(file);
    setPreviewDesktopUrl(URL.createObjectURL(file));
  };

  const handleMobileFile = (file) => {
    const errorMessage = validateBannerFile(file);
    if (errorMessage) {
      setLocalError(errorMessage);
      clearMobilePreview();
      return;
    }

    setLocalError('');
    clearMobilePreview();
    setSelectedMobileFile(file);
    setPreviewMobileUrl(URL.createObjectURL(file));
  };

  const appendLinkFields = (formData) => {
    formData.append('linkType', linkType);
    if (linkType === 'url' && linkUrl) {
      formData.append('linkUrl', linkUrl);
    } else if (linkType !== 'none' && linkTargetId) {
      formData.append('linkTargetId', linkTargetId);
    }
  };

  const validateLinkSelection = () => {
    if (linkType === 'none') {
      return true;
    }

    if (linkType === 'url') {
      if (!linkUrl.trim()) {
        setLocalError('Please enter a custom banner link URL.');
        return false;
      }

      return true;
    }

    if (!linkTargetId) {
      setLocalError('Please select a category or product for the banner link.');
      return false;
    }

    return true;
  };

  const handlePublish = async () => {
    if (!selectedDesktopFile && !selectedMobileFile) {
      if (!banner) {
        setLocalError('Desktop banner image is required.');
        desktopFileInputRef.current?.click();
      }
      return;
    }

    if (!selectedDesktopFile && !banner) {
      setLocalError('Desktop banner image is required.');
      return;
    }

    if (!validateLinkSelection()) {
      return;
    }

    setLocalError('');

    const formData = new FormData();
    if (selectedDesktopFile) {
      formData.append('image', selectedDesktopFile);
    }
    if (selectedMobileFile) {
      formData.append('mobileImage', selectedMobileFile);
    }
    formData.append('title', `Banner ${position}`);
    appendLinkFields(formData);

    try {
      await onUpload(position, formData);
      clearDesktopPreview();
      clearMobilePreview();
    } catch (error) {
      setLocalError(error?.data?.message || 'Failed to publish banner.');
    }
  };

  const handleSaveLink = async () => {
    if (!banner) {
      return;
    }

    if (!validateLinkSelection()) {
      return;
    }

    setLocalError('');

    try {
      await onUpdateLink(position, {
        linkType,
        linkTargetId: linkType === 'none' || linkType === 'url' ? null : linkTargetId,
        linkUrl: linkType === 'url' ? linkUrl.trim() : null,
      });
    } catch (error) {
      setLocalError(error?.data?.message || 'Failed to update banner link.');
    }
  };

  const displayDesktopImage = previewDesktopUrl || banner?.imageUrl;
  const displayMobileImage = previewMobileUrl || banner?.mobileImageUrl;

  const renderBannerPreview = ({
    label,
    recommendedSize,
    displayImage,
    isDragging,
    onDragOver,
    onDragLeave,
    onDrop,
    onChoose,
  }) => (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">Recommended size: {recommendedSize}</p>
      </div>
      <div
        className={`overflow-hidden rounded-xl border bg-slate-50 ${
          isDragging ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={`${label} ${position}`}
            className="block h-36 w-full object-cover object-center sm:h-40"
          />
        ) : (
          <div className="flex h-36 flex-col items-center justify-center px-4 text-center sm:h-40">
            <ImagePlus className="h-7 w-7 text-slate-400" />
            <p className="mt-2 text-sm text-slate-500">
              Drag and drop or choose an image
            </p>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onChoose}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        <Upload className="h-3.5 w-3.5" />
        {displayImage ? `Replace ${label}` : `Choose ${label}`}
      </button>
    </div>
  );

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

      <div className="space-y-4">
        {renderBannerPreview({
          label: 'Desktop Banner',
          recommendedSize: '1920 × 560 px',
          displayImage: displayDesktopImage,
          isDragging: isDraggingDesktop,
          onDragOver: (event) => {
            event.preventDefault();
            setIsDraggingDesktop(true);
          },
          onDragLeave: () => setIsDraggingDesktop(false),
          onDrop: (event) => {
            event.preventDefault();
            setIsDraggingDesktop(false);
            const file = event.dataTransfer.files?.[0];
            if (file) {
              handleDesktopFile(file);
            }
          },
          onChoose: () => desktopFileInputRef.current?.click(),
        })}

        {renderBannerPreview({
          label: 'Mobile Banner',
          recommendedSize: '1080 × 700 px',
          displayImage: displayMobileImage,
          isDragging: isDraggingMobile,
          onDragOver: (event) => {
            event.preventDefault();
            setIsDraggingMobile(true);
          },
          onDragLeave: () => setIsDraggingMobile(false),
          onDrop: (event) => {
            event.preventDefault();
            setIsDraggingMobile(false);
            const file = event.dataTransfer.files?.[0];
            if (file) {
              handleMobileFile(file);
            }
          },
          onChoose: () => mobileFileInputRef.current?.click(),
        })}
      </div>

      <BannerLinkFields
        linkType={linkType}
        linkTargetId={linkTargetId}
        linkUrl={linkUrl}
        onLinkTypeChange={(value) => {
          setLinkType(value);
          setLinkTargetId('');
          setLinkUrl('');
          setLocalError('');
        }}
        onLinkTargetChange={(value) => {
          setLinkTargetId(value);
          setLocalError('');
        }}
        onLinkUrlChange={(value) => {
          setLinkUrl(value);
          setLocalError('');
        }}
        categories={categories}
        products={products}
        disabled={isUploading || isUpdatingLink}
      />

      {localError && (
        <p className="mt-3 text-sm text-red-600">{localError}</p>
      )}

      <input
        ref={desktopFileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            handleDesktopFile(file);
          }
        }}
      />

      <input
        ref={mobileFileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            handleMobileFile(file);
          }
        }}
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          disabled={(!selectedDesktopFile && !selectedMobileFile) || isUploading}
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
          <>
            <button
              type="button"
              disabled={isUpdatingLink}
              onClick={handleSaveLink}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-solar-200 bg-solar-50 px-4 py-2.5 text-sm font-semibold text-solar-800 hover:bg-solar-100 disabled:opacity-60"
            >
              {isUpdatingLink ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving link...
                </>
              ) : (
                'Save Link Settings'
              )}
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={() => onDelete(position)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </>
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
  const { data: categoriesData } = useGetAdminCategoriesQuery();
  const { data: productsData } = useGetAdminProductsQuery();

  const [uploadBanner] = useUploadHomepageBannerMutation();
  const [updateBanner] = useUpdateHomepageBannerMutation();
  const [deleteBanner] = useDeleteHomepageBannerMutation();
  const [uploadingPosition, setUploadingPosition] = useState(null);
  const [updatingLinkPosition, setUpdatingLinkPosition] = useState(null);
  const [deletingPosition, setDeletingPosition] = useState(null);

  const categories = categoriesData?.data?.categories ?? [];
  const products = productsData?.data?.products ?? [];

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

  const handleUpdateLink = async (position, payload) => {
    setGlobalError('');
    setSuccessMessage('');
    setUpdatingLinkPosition(position);

    try {
      await updateBanner({ position, ...payload }).unwrap();
      setSuccessMessage(`Banner ${position} link updated successfully.`);
    } catch (updateError) {
      setGlobalError(
        updateError?.data?.message || `Failed to update banner ${position} link.`,
      );
      throw updateError;
    } finally {
      setUpdatingLinkPosition(null);
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
        description="Manage four independent homepage banner slots. Optionally link each banner to a category or product."
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
            categories={categories}
            products={products}
            onUpload={handleUpload}
            onUpdateLink={handleUpdateLink}
            onDelete={handleDelete}
            isUploading={uploadingPosition === position}
            isUpdatingLink={updatingLinkPosition === position}
            isDeleting={deletingPosition === position}
          />
        ))}
      </div>
    </div>
  );
}
