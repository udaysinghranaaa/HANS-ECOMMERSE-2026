import prisma from '../config/prisma.js';
import ApiError from '../utils/ApiError.js';
import {
  deleteCategoryImageFile,
  persistUploadedImage,
} from '../utils/fileUpload.js';
import { toAbsoluteMediaUrl } from '../utils/mediaUrl.js';

const DEFAULT_CATEGORIES = [
  {
    name: 'Solar Panels',
    slug: 'solar-panels',
    description: 'High-efficiency solar panels for residential and commercial use.',
    image: '/uploads/categories/solar-panels.jpg',
  },
  {
    name: 'Solar Inverters',
    slug: 'solar-inverters',
    description: 'Reliable inverters for every solar installation requirement.',
    image: '/uploads/categories/solar-inverters.jpg',
  },
  {
    name: 'Solar Batteries',
    slug: 'solar-batteries',
    description: 'Energy storage solutions for backup and load management.',
    image: '/uploads/categories/solar-batteries.jpg',
  },
  {
    name: 'Solar Accessories',
    slug: 'solar-accessories',
    description: 'Mounting, cabling and essential solar system components.',
    image: '/uploads/categories/solar-accessories.jpg',
  },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formatCategory = (category, { productCount } = {}) => {
  const formatted = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: toAbsoluteMediaUrl(category.image, category.updatedAt, { width: 1200 }),
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };

  if (productCount !== undefined) {
    formatted.productCount = productCount;
  } else if (category._count?.products !== undefined) {
    formatted.productCount = category._count.products;
  }

  return formatted;
};

const buildUniqueSlug = async (name, excludeId = null) => {
  const baseSlug = slugify(name);

  if (!baseSlug) {
    throw new ApiError(400, 'Category name must contain valid characters');
  }

  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug } });

    if (!existing || existing.id === excludeId) {
      return slug;
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

export const ensureDefaultCategories = async () => {
  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
  }
};

export const getPublicCategories = async () => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  return categories.map((category) => formatCategory(category));
};

export const getPublicCategoryBySlug = async (slug) => {
  const category = await prisma.category.findFirst({
    where: { slug, isActive: true },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return formatCategory(category, {
    productCount: category._count.products,
  });
};

export const getAdminCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { products: true } },
    },
  });

  return categories.map((category) => formatCategory(category));
};

export const getAdminCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true } },
    },
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return formatCategory(category);
};

export const createCategory = async ({
  name,
  description = '',
  isActive = true,
  imageFile,
}) => {
  if (!name?.trim()) {
    throw new ApiError(400, 'Category name is required');
  }

  if (!imageFile) {
    throw new ApiError(400, 'Category image is required');
  }

  const slug = await buildUniqueSlug(name.trim());
  const { url: image, publicId: imagePublicId } = await persistUploadedImage(
    imageFile,
    'categories',
  );

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      slug,
      description: description.trim(),
      image,
      imagePublicId,
      isActive,
    },
    include: {
      _count: { select: { products: true } },
    },
  });

  return formatCategory(category);
};

export const updateCategory = async (
  id,
  { name, description, isActive, imageFile, removeImage = false },
) => {
  const existingCategory = await prisma.category.findUnique({ where: { id } });

  if (!existingCategory) {
    throw new ApiError(404, 'Category not found');
  }

  let image = existingCategory.image;
  let imagePublicId = existingCategory.imagePublicId;
  let slug = existingCategory.slug;

  if (name !== undefined && name.trim() !== existingCategory.name) {
    if (!name.trim()) {
      throw new ApiError(400, 'Category name is required');
    }

    slug = await buildUniqueSlug(name.trim(), id);
  }

  if (removeImage && image) {
    await deleteCategoryImageFile(image, imagePublicId);
    image = '';
    imagePublicId = null;
  }

  if (imageFile) {
    if (existingCategory.image) {
      await deleteCategoryImageFile(existingCategory.image, existingCategory.imagePublicId);
    }

    const uploaded = await persistUploadedImage(imageFile, 'categories');
    image = uploaded.url;
    imagePublicId = uploaded.publicId;
  }

  if (!image) {
    throw new ApiError(400, 'Category image is required');
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name.trim(), slug } : {}),
      ...(description !== undefined ? { description: description.trim() } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      image,
      imagePublicId,
    },
    include: {
      _count: { select: { products: true } },
    },
  });

  return formatCategory(category);
};

export const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true } },
    },
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (category._count.products > 0) {
    throw new ApiError(
      400,
      'Cannot delete a category that has products assigned. Reassign or delete those products first.',
    );
  }

  await prisma.category.delete({ where: { id } });

  if (category.image) {
    await deleteCategoryImageFile(category.image, category.imagePublicId);
  }

  return { message: 'Category deleted successfully' };
};

export const getCategoryBySlug = async (slug) => {
  const category = await prisma.category.findUnique({ where: { slug } });
  return category ? formatCategory(category) : null;
};
