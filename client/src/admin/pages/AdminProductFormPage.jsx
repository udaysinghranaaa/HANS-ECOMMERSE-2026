import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Video,
} from 'lucide-react';
import PageHeader from '@/admin/components/ui/PageHeader';
import { useGetAdminCategoriesQuery } from '@/services/categoriesApi';
import {
  useCreateProductMutation,
  useGetAdminProductByIdQuery,
  useUpdateProductMutation,
} from '@/services/productsApi';
import { stripMediaUrl } from '@/utils/format';
import {
  getYouTubeEmbedUrl,
  getYouTubeWatchUrl,
  isYouTubeVideoUrl,
} from '@/utils/video';
import ProductVideo from '@/components/shop/ProductVideo';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
const MAX_IMAGES = 5;

const emptySpecRow = () => ({ key: '', value: '' });

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAdminCategoriesQuery();
  const { data: productData, isLoading: productLoading } =
    useGetAdminProductByIdQuery(id, { skip: !isEditing });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '0',
    warranty: '',
    isActive: true,
    isTrending: false,
    isGovernmentSubsidy: false,
    isOnSale: false,
    saleDiscountPercent: '',
  });
  const [specRows, setSpecRows] = useState([emptySpecRow()]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [existingVideoUrl, setExistingVideoUrl] = useState('');
  const [newVideoFile, setNewVideoFile] = useState(null);
  const [newVideoPreview, setNewVideoPreview] = useState('');
  const [videoMode, setVideoMode] = useState('none');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [removeVideo, setRemoveVideo] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const categories = categoriesData?.data?.categories ?? [];
  const product = productData?.data?.product;
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (!product) {
      return;
    }

    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      categoryId: product.categoryId,
      stock: String(product.stock ?? 0),
      warranty: product.warranty,
      isActive: product.isActive,
      isTrending: product.isTrending ?? false,
      isGovernmentSubsidy: product.isGovernmentSubsidy ?? false,
      isOnSale: product.isOnSale ?? false,
      saleDiscountPercent:
        product.saleDiscountPercent != null
          ? String(product.saleDiscountPercent)
          : '',
    });

    const specs = product.specifications
      ? Object.entries(product.specifications).map(([key, value]) => ({
          key,
          value: String(value),
        }))
      : [emptySpecRow()];

    setSpecRows(specs.length > 0 ? specs : [emptySpecRow()]);
    setExistingImages(product.images ?? []);

    const productVideoUrl = product.videoUrl ?? '';
    setExistingVideoUrl(productVideoUrl);
    setRemoveVideo(false);
    setNewVideoFile(null);
    setNewVideoPreview('');

    if (isYouTubeVideoUrl(productVideoUrl)) {
      setVideoMode('youtube');
      setYoutubeLink(getYouTubeWatchUrl(productVideoUrl) || productVideoUrl);
    } else if (productVideoUrl) {
      setVideoMode('upload');
      setYoutubeLink('');
    } else {
      setVideoMode('none');
      setYoutubeLink('');
    }
  }, [product]);

  useEffect(
    () => () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
      if (newVideoPreview) {
        URL.revokeObjectURL(newVideoPreview);
      }
    },
    [newImagePreviews, newVideoPreview],
  );

  const totalImages = existingImages.length + newImageFiles.length;

  const specificationsObject = useMemo(() => {
    const specs = {};
    specRows.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) {
        specs[key.trim()] = value.trim();
      }
    });
    return specs;
  }, [specRows]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Product title is required';
    }

    if (!form.description.trim()) {
      nextErrors.description = 'Description is required';
    }

    if (!form.price || Number(form.price) <= 0) {
      nextErrors.price = 'Enter a valid price';
    }

    if (!form.categoryId) {
      nextErrors.categoryId = 'Select a category';
    }

    if (!form.warranty.trim()) {
      nextErrors.warranty = 'Warranty information is required';
    }

    if (totalImages === 0) {
      nextErrors.images = 'Add at least one product image';
    }

    if (totalImages > MAX_IMAGES) {
      nextErrors.images = `Maximum ${MAX_IMAGES} images allowed`;
    }

    if (form.isOnSale) {
      const salePercent = Number(form.saleDiscountPercent);
      if (!form.saleDiscountPercent || Number.isNaN(salePercent)) {
        nextErrors.saleDiscountPercent = 'Enter a valid sale discount percentage';
      } else if (salePercent <= 0 || salePercent >= 100) {
        nextErrors.saleDiscountPercent = 'Sale discount must be between 1 and 99';
      }
    }

    if (videoMode === 'youtube' && youtubeLink.trim()) {
      if (!getYouTubeEmbedUrl(youtubeLink.trim())) {
        nextErrors.youtubeLink = 'Enter a valid YouTube video link';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleImageSelection = (fileList) => {
    const files = Array.from(fileList);
    const validFiles = [];

    for (const file of files) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setErrors((current) => ({
          ...current,
          images: 'Only JPG, JPEG, PNG and WEBP images are allowed',
        }));
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setErrors((current) => ({
          ...current,
          images: 'Each image must be 5MB or smaller',
        }));
        return;
      }

      validFiles.push(file);
    }

    if (totalImages + validFiles.length > MAX_IMAGES) {
      setErrors((current) => ({
        ...current,
        images: `You can upload up to ${MAX_IMAGES} images total`,
      }));
      return;
    }

    setErrors((current) => ({ ...current, images: '' }));
    setNewImageFiles((current) => [...current, ...validFiles]);
    setNewImagePreviews((current) => [
      ...current,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeExistingImage = (imageUrl) => {
    setExistingImages((current) => current.filter((image) => image !== imageUrl));
  };

  const removeNewImage = (index) => {
    setNewImageFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setNewImagePreviews((current) => {
      const next = [...current];
      URL.revokeObjectURL(next[index]);
      next.splice(index, 1);
      return next;
    });
  };

  const handleVideoSelection = (file) => {
    if (!file) {
      return;
    }

    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      setErrors((current) => ({
        ...current,
        video: 'Only MP4, WEBM and MOV videos are allowed',
      }));
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setErrors((current) => ({
        ...current,
        video: 'Video must be 50MB or smaller',
      }));
      return;
    }

    if (newVideoPreview) {
      URL.revokeObjectURL(newVideoPreview);
    }

    setErrors((current) => ({ ...current, video: '' }));
    setNewVideoFile(file);
    setNewVideoPreview(URL.createObjectURL(file));
    setRemoveVideo(false);
    setVideoMode('upload');
    setYoutubeLink('');
  };

  const handleVideoModeChange = (mode) => {
    setVideoMode(mode);
    setErrors((current) => ({ ...current, video: '', youtubeLink: '' }));
    setRemoveVideo(false);

    if (mode === 'none') {
      setNewVideoFile(null);
      if (newVideoPreview) {
        URL.revokeObjectURL(newVideoPreview);
        setNewVideoPreview('');
      }
      setYoutubeLink('');
      if (existingVideoUrl || newVideoFile) {
        setRemoveVideo(true);
      }
      setExistingVideoUrl('');
    }

    if (mode === 'upload') {
      setYoutubeLink('');
    }

    if (mode === 'youtube') {
      setNewVideoFile(null);
      if (newVideoPreview) {
        URL.revokeObjectURL(newVideoPreview);
        setNewVideoPreview('');
      }
    }
  };

  const clearUploadedVideo = () => {
    setNewVideoFile(null);
    if (newVideoPreview) {
      URL.revokeObjectURL(newVideoPreview);
      setNewVideoPreview('');
    }
    setExistingVideoUrl('');
    setRemoveVideo(true);
    setVideoMode('none');
  };

  const appendVideoFields = (formData) => {
    if (videoMode === 'upload' && newVideoFile) {
      formData.append('video', newVideoFile);
      return;
    }

    if (videoMode === 'youtube') {
      formData.append('videoLink', youtubeLink.trim());
      return;
    }

    if (removeVideo || videoMode === 'none') {
      formData.append('removeVideo', 'true');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('description', form.description.trim());
    formData.append('price', form.price);
    formData.append('categoryId', form.categoryId);
    formData.append('stock', form.stock);
    formData.append('warranty', form.warranty.trim());
    formData.append('specifications', JSON.stringify(specificationsObject));
    formData.append('isActive', String(form.isActive));
    formData.append('isTrending', String(form.isTrending));
    formData.append('isGovernmentSubsidy', String(form.isGovernmentSubsidy));
    formData.append('isOnSale', String(form.isOnSale));
    if (form.isOnSale) {
      formData.append('saleDiscountPercent', form.saleDiscountPercent);
    }

    newImageFiles.forEach((file) => {
      formData.append('images', file);
    });

    if (isEditing) {
      formData.append(
        'existingImages',
        JSON.stringify(existingImages.map(stripMediaUrl)),
      );
      appendVideoFields(formData);

      try {
        await updateProduct({ id, formData }).unwrap();
        setSuccessMessage('Product updated successfully');
        navigate('/admin/products');
      } catch (error) {
        setSubmitError(error?.data?.message || 'Failed to update product');
      }

      return;
    }

    appendVideoFields(formData);

    try {
      await createProduct(formData).unwrap();
      setSuccessMessage('Product created successfully');
      navigate('/admin/products');
    } catch (error) {
      setSubmitError(error?.data?.message || 'Failed to create product');
    }
  };

  if (isEditing && productLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Product' : 'Add Product'}
        description="Create or update solar products for the public shop catalogue."
        action={
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {submitError && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {submitError}
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {successMessage}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Title *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="HANS Power 400W Mono Panel"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Category *
            </label>
            <select
              value={form.categoryId}
              onChange={(event) => updateField('categoryId', event.target.value)}
              disabled={categoriesLoading}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Price (INR) *
            </label>
            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(event) => updateField('price', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="18500"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Stock
            </label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(event) => updateField('stock', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div className="flex items-center gap-3 pt-7">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => updateField('isActive', event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
              Product is active on the shop
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
          <h3 className="text-sm font-semibold text-slate-800">
            Featured on Homepage
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Control where this product appears on the home page. Both can be enabled.
          </p>
          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.isTrending}
                onChange={(event) =>
                  updateField('isTrending', event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
              />
              <span className="text-sm font-medium text-slate-700">
                Trending Product
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.isGovernmentSubsidy}
                onChange={(event) =>
                  updateField('isGovernmentSubsidy', event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
              />
              <span className="text-sm font-medium text-slate-700">
                Government Subsidy Product
              </span>
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
          <h3 className="text-sm font-semibold text-slate-800">On Sale</h3>
          <p className="mt-1 text-xs text-slate-500">
            Highlight promotional products with a visible sale badge on the shop
            and product pages.
          </p>
          <label className="mt-4 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.isOnSale}
              onChange={(event) => {
                updateField('isOnSale', event.target.checked);
                if (!event.target.checked) {
                  updateField('saleDiscountPercent', '');
                  setErrors((current) => ({
                    ...current,
                    saleDiscountPercent: '',
                  }));
                }
              }}
              className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
            />
            <span className="text-sm font-medium text-slate-700">On Sale</span>
          </label>

          {form.isOnSale && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sale Discount (%) *
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={form.saleDiscountPercent}
                onChange={(event) =>
                  updateField('saleDiscountPercent', event.target.value)
                }
                className="w-full max-w-xs rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                placeholder="20"
              />
              {errors.saleDiscountPercent && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.saleDiscountPercent}
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Description *
          </label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            placeholder="Describe the product features, use cases and benefits."
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Warranty *
          </label>
          <textarea
            rows={3}
            value={form.warranty}
            onChange={(event) => updateField('warranty', event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            placeholder="25-year performance warranty, 10-year product warranty"
          />
          {errors.warranty && (
            <p className="mt-1 text-xs text-red-600">{errors.warranty}</p>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Specifications
            </label>
            <button
              type="button"
              onClick={() => setSpecRows((current) => [...current, emptySpecRow()])}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-amber-600 hover:bg-amber-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add row
            </button>
          </div>
          <div className="space-y-3">
            {specRows.map((row, index) => (
              <div key={`spec-${index}`} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  type="text"
                  value={row.key}
                  onChange={(event) =>
                    setSpecRows((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, key: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="Specification name"
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={(event) =>
                    setSpecRows((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, value: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="Value"
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
                <button
                  type="button"
                  onClick={() =>
                    setSpecRows((current) =>
                      current.length === 1
                        ? [emptySpecRow()]
                        : current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="text-sm font-semibold text-slate-700">
              Product Images * ({totalImages}/{MAX_IMAGES})
            </label>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={totalImages >= MAX_IMAGES}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ImagePlus className="h-4 w-4 text-amber-600" />
              Add Images
            </button>
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            multiple
            className="hidden"
            onChange={(event) => {
              handleImageSelection(event.target.files);
              event.target.value = '';
            }}
          />

          {totalImages === 0 ? (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-slate-600 transition hover:border-amber-300 hover:bg-amber-50/40"
            >
              <ImagePlus className="h-10 w-10 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                Click to upload product images
              </span>
              <span className="text-xs text-slate-500">
                JPG, PNG or WEBP up to 5MB each. Maximum {MAX_IMAGES} images.
              </span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {existingImages.map((imageUrl) => (
                <div
                  key={imageUrl}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <img
                    src={imageUrl}
                    alt="Existing product"
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(imageUrl)}
                    className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-red-600 opacity-0 shadow transition group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {newImagePreviews.map((previewUrl, index) => (
                <div
                  key={previewUrl}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <img
                    src={previewUrl}
                    alt="New product upload"
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-red-600 opacity-0 shadow transition group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.images && (
            <p className="mt-2 text-xs text-red-600">{errors.images}</p>
          )}
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            Product Video
          </label>
          <p className="mb-4 text-xs text-slate-500">
            Optional. Upload a video file or paste a YouTube link.
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { id: 'none', label: 'No Video' },
              { id: 'upload', label: 'Upload File' },
              { id: 'youtube', label: 'YouTube Link' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleVideoModeChange(option.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  videoMode === option.id
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <input
            ref={videoInputRef}
            type="file"
            accept={ACCEPTED_VIDEO_TYPES.join(',')}
            className="hidden"
            onChange={(event) => {
              handleVideoSelection(event.target.files?.[0]);
              event.target.value = '';
            }}
          />

          {videoMode === 'upload' && (
            <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
              {newVideoPreview || (existingVideoUrl && !isYouTubeVideoUrl(existingVideoUrl)) ? (
                <div>
                  <video
                    controls
                    className="aspect-video w-full bg-slate-900"
                    src={newVideoPreview || existingVideoUrl}
                  />
                  <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white p-3">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
                    >
                      <Video className="h-4 w-4 text-amber-600" />
                      Replace Video
                    </button>
                    <button
                      type="button"
                      onClick={clearUploadedVideo}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Video
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-3 px-6 py-12 text-slate-600 transition hover:bg-amber-50/40"
                >
                  <Video className="h-10 w-10 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    Click to upload product video
                  </span>
                  <span className="text-xs text-slate-500">
                    MP4, WEBM or MOV up to 50MB
                  </span>
                </button>
              )}
            </div>
          )}

          {videoMode === 'youtube' && (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <label
                  htmlFor="youtube-link"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  YouTube Video URL
                </label>
                <input
                  id="youtube-link"
                  type="url"
                  value={youtubeLink}
                  onChange={(event) => {
                    setYoutubeLink(event.target.value);
                    setErrors((current) => ({ ...current, youtubeLink: '' }));
                    setRemoveVideo(false);
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
                {errors.youtubeLink && (
                  <p className="mt-1 text-xs text-red-600">{errors.youtubeLink}</p>
                )}
              </div>

              {getYouTubeEmbedUrl(youtubeLink) && (
                <ProductVideo
                  videoUrl={youtubeLink}
                  title="YouTube preview"
                />
              )}
            </div>
          )}

          {errors.video && (
            <p className="mt-2 text-xs text-red-600">{errors.video}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:from-amber-300 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Product'}
          </button>
          <Link
            to="/admin/products"
            className="inline-flex items-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
