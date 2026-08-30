import { useEffect } from 'react';
import { X } from 'lucide-react';
import ContactEnquiryForm from '@/components/contact/ContactEnquiryForm';

const modalTitles = {
  contact: {
    title: 'Send Us Your Requirement',
    description: 'Fill in your details and our team will reach out shortly.',
  },
  distributor: {
    title: 'Become a Distributor',
    description:
      'Share your details and our team will contact you about partnering with HANS Solar.',
  },
  product: {
    title: 'Enquire Now',
    description: 'Fill in your details and our team will reach out shortly.',
  },
  quote: {
    title: 'Get a Quote',
    description:
      'Request a customised solar quote for your home, business or industrial project.',
  },
};

export default function ContactEnquiryModal({
  isOpen,
  enquiryType = 'contact',
  productName = '',
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const copy = modalTitles[enquiryType] ?? modalTitles.contact;
  const title =
    enquiryType === 'product' && productName
      ? `Enquire About ${productName}`
      : enquiryType === 'quote' && productName
        ? `Get a Quote for ${productName}`
        : copy.title;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close enquiry form"
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-enquiry-modal-title"
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-charcoal shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50"
        >
          <X className="h-5 w-5" />
        </button>

        <ContactEnquiryForm
          idPrefix={`modal-${enquiryType}`}
          enquiryType={enquiryType}
          productName={productName}
          showHeader
          compactSuccess
          title={title}
          description={copy.description}
          titleId="contact-enquiry-modal-title"
        />
      </div>
    </div>
  );
}
