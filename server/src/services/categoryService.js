import prisma from '../config/prisma.js';
import config from '../config/index.js';

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

  return categories.map(formatCategory);
};

export const getAdminCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { products: true } },
    },
  });

  return categories.map((category) => ({
    ...formatCategory(category),
    productCount: category._count.products,
  }));
};

const formatCategory = (category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  image: category.image,
  isActive: category.isActive,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export const getCategoryBySlug = async (slug) => {
  const category = await prisma.category.findUnique({ where: { slug } });
  return category ? formatCategory(category) : null;
};
