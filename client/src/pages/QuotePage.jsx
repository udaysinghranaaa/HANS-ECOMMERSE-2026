import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

export default function QuotePage() {
  const { openEnquiryModal } = useEnquiryModal();

  useEffect(() => {
    openEnquiryModal({ enquiryType: 'quote' });
  }, [openEnquiryModal]);

  return (
    <div className="bg-gray-50">
      <section className="border-b border-gray-200 bg-gradient-to-br from-solar-700 via-solar-600 to-emerald-700">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
            Solar Quote
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Get a Quote
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            Request a customised solar quote for your home, business or
            industrial project.
          </p>
          <Button
            size="lg"
            variant="white"
            className="mt-8"
            onClick={() => openEnquiryModal({ enquiryType: 'quote' })}
          >
            Open Quote Form
          </Button>
        </div>
      </section>
    </div>
  );
}
