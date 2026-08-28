import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ImagePlus,
  Loader2,
  Trash2,
} from 'lucide-react';
import PageHeader from '@/admin/components/ui/PageHeader';
import {
  useCreateCategoryMutation,
  useGetAdminCategoryByIdQuery,
  useUpdateCategoryMutation,
} from '@/services/categoriesApi';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function AdminCategoryFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { data: categoryData, isLoading: categoryLoading } =
    useGetAdminCategoryByIdQuery(id, { skip: !isEditing });
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [existingImage, setExistingImage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const category = categoryData?.data?.category;
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (!category) {
      return;
    }

    setName(category.name);
    setIsActive(category.isActive);
    setExistingImage(category.image || '');
  }, [category]);

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl],
  );

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors((current) => ({
        ...current,
        image: 'Only JPG, JPEG, PNG and WEBP images are allowed',
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors((current) => ({
        ...current,
        image: 'Image must be 5MB or smaller',
      }));
      return;
    }

    setErrors((current) => ({ ...current, image: '' }));
    clearPreview();
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const validate = () => {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Category name is required';
    }

    if (!selectedFile && !existingImage) {
      nextErrors.image = 'Category image is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('isActive', String(isActive));

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      if (isEditing) {
        await updateCategory({ id, formData }).unwrap();
      } else {
        await createCategory(formData).unwrap();
      }

      navigate('/admin/categories');
    } catch (error) {
      setSubmitError(error?.data?.message || 'Failed to save category');
    }
  };

  if (isEditing && categoryLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const displayImage = previewUrl || existingImage;

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Category' : 'Add Category'}
        description="Create or update product categories for the public shop and navigation."
        action={
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {submitError && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {submitError}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => ({ ...current, name: '' }));
            }}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            placeholder="Solar Panels"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category Image *
          </label>
          <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            {displayImage ? (
              <div className="relative">
                <img
                  src={displayImage}
                  alt="Category preview"
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white p-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Replace Image
                  </button>
                  {(previewUrl || existingImage) && (
                    <button
                      type="button"
                      onClick={() => {
                        clearPreview();
                        setExistingImage('');
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-3 px-6 py-12 text-slate-500 transition hover:bg-slate-100/70"
              >
                <ImagePlus className="h-10 w-10 text-slate-400" />
                <span className="text-sm font-medium">
                  Click to upload category image
                </span>
                <span className="text-xs text-slate-400">
                  JPG, PNG or WEBP up to 5MB
                </span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handleFile(file);
              }
              event.target.value = '';
            }}
          />
          {errors.image && (
            <p className="mt-1 text-xs text-red-600">{errors.image}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            id="categoryActive"
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
          />
          <label htmlFor="categoryActive" className="text-sm font-medium text-slate-700">
            Category is active on the website
          </label>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:from-amber-300 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Create Category'}
          </button>
          <Link
            to="/admin/categories"
            className="inline-flex items-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
