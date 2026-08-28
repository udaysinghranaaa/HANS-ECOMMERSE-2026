const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Products', path: '/admin/products', icon: 'Package' },
  { label: 'Categories', path: '/admin/categories', icon: 'Layers' },
  { label: 'Enquiries', path: '/admin/enquiries', icon: 'MessageSquare' },
  { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
];

export { navItems };

export const getPageTitle = (pathname) => {
  const item = navItems.find((nav) => nav.path === pathname);
  return item?.label ?? 'Admin';
};
