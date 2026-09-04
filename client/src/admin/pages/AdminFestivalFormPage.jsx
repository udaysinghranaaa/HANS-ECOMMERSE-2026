import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
} from 'lucide-react';
import PageHeader from '@/admin/components/ui/PageHeader';
import {
  useAssignFestivalProductsMutation,
  useCreateFestivalMutation,
  useGetAdminFestivalByIdQuery,
  useRemoveFestivalProductMutation,
  useUpdateFestivalMutation,
} from '@/services/festivalsApi';
import { useGetAdminProductsQuery } from '@/services/productsApi';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const toDateTimeLocalValue = (isoString) => {
  if (!isoString) {
    return '';
  }

  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

const getDefaultDateTimeLocal = (date = new Date()) => {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

const getDefaultCreateForm = () => ({
  name: '',
  title: '',
  description: '',
  startsAt: getDefaultDateTimeLocal(new Date(Date.now() - 60_000)),
  endsAt: getDefaultDateTimeLocal(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  ),
  discountPercent: '',
  productSelectionMode: 'all',
  isEnabled: true,
  priority: '0',
});

export default function AdminFestivalFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { data: festivalData, isLoading: festivalLoading } =
    useGetAdminFestivalByIdQuery(id, { skip: !isEditing });
  const { data: productsData } = useGetAdminProductsQuery(undefined);

  const [createFestival, { isLoading: isCreating }] = useCreateFestivalMutation();
  const [updateFestival, { isLoading: isUpdating }] = useUpdateFestivalMutation();
  const [assignProducts, { isLoading: isAssigningBatch }] =
    useAssignFestivalProductsMutation();
  const [removeProduct] = useRemoveFestivalProductMutation();

  const [form, setForm] = useState(getDefaultCreateForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const festival = festivalData?.data?.festival;
  const allProducts = productsData?.data?.products ?? [];
  const activeProducts = useMemo(
    () => allProducts.filter((product) => product.isActive),
    [allProducts],
  );
  const isSubmitting = isCreating || isUpdating;
  const isSpecificMode = form.productSelectionMode === 'specific';
  const allActiveSelected =
    activeProducts.length > 0 &&
    activeProducts.every((product) => selectedProductIds.includes(product.id));

  useEffect(() => {
    if (!festival) {
      return;
    }

    setForm({
      name: festival.name,
      title: festival.title,
      description: festival.description,
      startsAt: toDateTimeLocalValue(festival.startsAt),
      endsAt: toDateTimeLocalValue(festival.endsAt),
      discountPercent: String(festival.discountPercent ?? ''),
      productSelectionMode: festival.applyToAllProducts ? 'all' : 'specific',
      isEnabled: festival.isEnabled,
      priority: String(festival.priority ?? 0),
    });
    setSelectedProductIds(
      festival.applyToAllProducts
        ? []
        : (festival.products ?? []).map((product) => product.id),
    );
    setImagePreview(festival.imageUrl || '');
  }, [festival]);

  useEffect(
    () => () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    },
    [imagePreview],
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleProductSelectionMode = (mode) => {
    updateField('productSelectionMode', mode);

    if (mode === 'all') {
      setSelectedProductIds([]);
      return;
    }

    if (isEditing && festival?.products?.length) {
      setSelectedProductIds(festival.products.map((product) => product.id));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors((current) => ({
        ...current,
        image: 'Only JPG, JPEG, PNG and WEBP images are allowed.',
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors((current) => ({
        ...current,
        image: 'Image must be 5MB or smaller.',
      }));
      return;
    }

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((current) => ({ ...current, image: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Festival name is required';
    }

    if (!form.title.trim()) {
      nextErrors.title = 'Festival title is required';
    }

    if (!form.description.trim()) {
      nextErrors.description = 'Description is required';
    }

    if (!form.startsAt) {
      nextErrors.startsAt = 'Start date/time is required';
    }

    if (!form.endsAt) {
      nextErrors.endsAt = 'End date/time is required';
    }

    if (form.startsAt && form.endsAt && new Date(form.endsAt) <= new Date(form.startsAt)) {
      nextErrors.endsAt = 'End must be after start';
    }

    const discount = Number(form.discountPercent);
    if (!Number.isFinite(discount) || discount <= 0 || discount >= 100) {
      nextErrors.discountPercent = 'Festival discount must be between 1 and 99';
    }

    if (!isEditing && !imageFile) {
      nextErrors.image = 'Festival artwork is required';
    }

    if (isSpecificMode && selectedProductIds.length === 0) {
      nextErrors.productSelectionMode =
        'Select at least one product or choose All Products';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildFormData = () => {
    const formData = new FormData();
    const startsAtValue = form.startsAt
      ? new Date(form.startsAt)
      : new Date(Date.now() - 60_000);
    const endsAtValue = form.endsAt
      ? new Date(form.endsAt)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    formData.append('name', form.name.trim());
    formData.append('title', form.title.trim());
    formData.append('description', form.description.trim());
    formData.append('startsAt', startsAtValue.toISOString());
    formData.append('endsAt', endsAtValue.toISOString());
    formData.append('discountPercent', form.discountPercent);
    formData.append(
      'applyToAllProducts',
      String(form.productSelectionMode === 'all'),
    );
    formData.append('isEnabled', String(form.isEnabled));
    formData.append('priority', form.priority || '0');

    if (imageFile) {
      formData.append('image', imageFile);
    }

    return formData;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        await updateFestival({ id, formData: buildFormData() }).unwrap();

        if (isSpecificMode) {
          const assignedIds = (festival?.products ?? []).map((product) => product.id);
          const idsToRemove = assignedIds.filter(
            (productId) => !selectedProductIds.includes(productId),
          );

          await Promise.all(
            idsToRemove.map((productId) =>
              removeProduct({ festivalId: id, productId }).unwrap(),
            ),
          );

          if (selectedProductIds.length > 0) {
            await assignProducts({
              festivalId: id,
              productIds: selectedProductIds,
            }).unwrap();
          }
        }

        setSuccessMessage('Festival updated successfully');
      } else {
        const result = await createFestival(buildFormData()).unwrap();
        const festivalId = result.data.festival.id;

        if (isSpecificMode && selectedProductIds.length > 0) {
          await assignProducts({
            festivalId,
            productIds: selectedProductIds,
          }).unwrap();
        }

        navigate(`/admin/festivals/${festivalId}/edit`);
      }
    } catch (error) {
      setSubmitError(error?.data?.message || 'Failed to save festival');
    }
  };

  const toggleSelectedProduct = (productId) => {
    setSelectedProductIds((current) =>
      current.includes(productId)
        ? current.filter((item) => item !== productId)
        : [...current, productId],
    );
    setErrors((current) => ({ ...current, productSelectionMode: '' }));
  };

  const handleSelectAllProducts = () => {
    setSelectedProductIds(activeProducts.map((product) => product.id));
    setErrors((current) => ({ ...current, productSelectionMode: '' }));
  };

  const handleDeselectAllProducts = () => {
    setSelectedProductIds([]);
  };

  if (isEditing && festivalLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Festival / Sale' : 'Create Festival / Sale'}
        description="Set festival details, discount, product scope and schedule."
        action={
          <Link
            to="/admin/festivals"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Festival / Sale
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
              Festival Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="Diwali"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Title / Heading *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="Diwali Solar Sale is Live"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Festival Discount (%) *
            </label>
            <input
              type="number"
              min="1"
              max="99"
              value={form.discountPercent}
              onChange={(event) => updateField('discountPercent', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="20"
            />
            <p className="mt-1 text-xs text-slate-500">
              Applied from each product&apos;s original price across the website.
            </p>
            {errors.discountPercent && (
              <p className="mt-1 text-xs text-red-600">{errors.discountPercent}</p>
            )}
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Product Selection *
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm">
                <input
                  type="radio"
                  name="productSelectionMode"
                  checked={form.productSelectionMode === 'all'}
                  onChange={() => handleProductSelectionMode('all')}
                  className="text-amber-500 focus:ring-amber-400"
                />
                <span>
                  <span className="block font-semibold text-slate-900">All Products</span>
                  <span className="text-xs text-slate-500">
                    Every active product joins the sale
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm">
                <input
                  type="radio"
                  name="productSelectionMode"
                  checked={form.productSelectionMode === 'specific'}
                  onChange={() => handleProductSelectionMode('specific')}
                  className="text-amber-500 focus:ring-amber-400"
                />
                <span>
                  <span className="block font-semibold text-slate-900">Specific Products</span>
                  <span className="text-xs text-slate-500">
                    Choose selected products only
                  </span>
                </span>
              </label>
            </div>
            {errors.productSelectionMode && (
              <p className="mt-1 text-xs text-red-600">{errors.productSelectionMode}</p>
            )}

            {isSpecificMode && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Select Products
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {selectedProductIds.length} of {activeProducts.length} active
                      products selected
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllProducts}
                      disabled={allActiveSelected || activeProducts.length === 0}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllProducts}
                      disabled={selectedProductIds.length === 0}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                  {activeProducts.length === 0 ? (
                    <p className="text-sm text-slate-500">No active products available.</p>
                  ) : (
                    activeProducts.map((product) => (
                      <label
                        key={product.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(product.id)}
                          onChange={() => toggleSelectedProduct(product.id)}
                          className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                        />
                        <span className="text-sm text-slate-800">{product.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(event) => updateField('startsAt', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
            {errors.startsAt && (
              <p className="mt-1 text-xs text-red-600">{errors.startsAt}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              The festival appears on the website only after this start time. Use now
              or earlier for an immediate live sale.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={(event) => updateField('endsAt', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
            {errors.endsAt && (
              <p className="mt-1 text-xs text-red-600">{errors.endsAt}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Priority
            </label>
            <input
              type="number"
              min="0"
              value={form.priority}
              onChange={(event) => updateField('priority', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="0"
            />
            <p className="mt-1 text-xs text-slate-500">
              Higher priority wins when multiple festivals are active.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-7">
            <input
              id="isEnabled"
              type="checkbox"
              checked={form.isEnabled}
              onChange={(event) => updateField('isEnabled', event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
            />
            <label htmlFor="isEnabled" className="text-sm font-medium text-slate-700">
              Festival is enabled
            </label>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Short Description / Offer Text *
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            placeholder="Celebrate Diwali with special solar offers."
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Festival Image / Artwork {!isEditing && '*'}
          </label>
          <p className="mb-2 text-xs text-slate-500">
            Recommended size: 1400 × 1050 px
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Festival preview"
                className="block h-52 w-full object-cover sm:h-64"
              />
            ) : (
              <div className="flex h-52 flex-col items-center justify-center sm:h-64">
                <ImagePlus className="h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm text-slate-500">Upload festival artwork</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleImageChange}
            className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-700 hover:file:bg-amber-100"
          />
          {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isAssigningBatch}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:from-amber-300 hover:to-orange-400 disabled:opacity-60"
        >
          {(isSubmitting || isAssigningBatch) && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {isEditing ? 'Save Festival' : 'Create Festival'}
        </button>
      </form>

      {isEditing && !isSpecificMode && (
        <section className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800">
          <h3 className="font-semibold text-emerald-900">All Products Selected</h3>
          <p className="mt-2">
            Every active product in your catalog will appear in the festival section and
            receive the {form.discountPercent || festival?.discountPercent || '—'}%
            festival discount while this sale is active.
          </p>
        </section>
      )}
    </div>
  );
}
