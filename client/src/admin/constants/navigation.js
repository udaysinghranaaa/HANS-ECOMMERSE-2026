const navSections = [
  {
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
      { label: 'Products', path: '/admin/products', icon: 'Package' },
      { label: 'Categories', path: '/admin/categories', icon: 'Layers' },
      { label: 'Enquiries', path: '/admin/enquiries', icon: 'MessageSquare' },
      { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
    ],
  },
  {
    section: 'Homepage',
    items: [
      {
        label: 'Banner Management',
        path: '/admin/homepage/banners',
        icon: 'Image',
      },
      {
        label: 'Site Images',
        path: '/admin/homepage/site-images',
        icon: 'Image',
      },
      {
        label: 'Festival / Sale',
        path: '/admin/festivals',
        icon: 'Sparkles',
      },
    ],
  },
];

const navItems = navSections.flatMap(({ items }) => items);

export { navItems, navSections };

export const getPageTitle = (pathname) => {
  const item = navItems.find((nav) => nav.path === pathname);
  return item?.label ?? 'Admin';
};
