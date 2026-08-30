import Button from '@/components/ui/Button';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

export default function ContactCTA() {
  const { openEnquiryModal } = useEnquiryModal();

  return (
    <section className="border-y border-gray-100 bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
          <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Ready to Switch to Solar?
          </h2>
          <p className="mt-4 text-base text-charcoal-light sm:text-lg">
            Talk to our solar experts and find the right solution for your
            energy needs.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/contact" size="lg">
              Contact Us
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => openEnquiryModal({ enquiryType: 'quote' })}
            >
              Get a Quote
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
