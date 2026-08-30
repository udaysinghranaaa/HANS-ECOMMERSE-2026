import { Outlet } from 'react-router-dom';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { ProductSearchProvider } from '@/context/ProductSearchContext';
import { EnquiryModalProvider } from '@/context/EnquiryModalContext';

export default function PublicLayout() {
  return (
    <ProductSearchProvider>
      <EnquiryModalProvider>
        <div className="flex min-h-screen flex-col bg-white">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </EnquiryModalProvider>
    </ProductSearchProvider>
  );
}
