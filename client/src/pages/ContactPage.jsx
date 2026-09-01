import { Mail, MapPin } from 'lucide-react';
import ContactEnquiryForm from '@/components/contact/ContactEnquiryForm';
import { contactInfo, corporateOffice } from '@/constants/homeContent';

export default function ContactPage() {
  return (
    <div className="bg-gray-50">
      <section className="border-b border-gray-200 bg-gradient-to-br from-solar-700 via-solar-600 to-emerald-700">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
            Get in Touch
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Contact HANS Solar
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
            Share your solar requirement and our experts will guide you with
            products, quotes and installation support.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
          <aside className="space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-charcoal">
                North India&apos;s Trusted Solar Partner
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-light sm:text-base">
                From rooftop systems to commercial installations, HANS Solar
                delivers premium products and professional guidance across North
                India.
              </p>

              <div className="mt-6 space-y-4">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-solar-200 hover:bg-solar-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-solar-100 text-solar-700">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                      Email
                    </span>
                    <span className="mt-0.5 block text-sm font-medium text-charcoal">
                      {contactInfo.email}
                    </span>
                  </span>
                </a>

                <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-solar-100 text-solar-700">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-charcoal-light">
                      Corporate Office
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-charcoal">
                      {corporateOffice.address}
                    </span>
                    <a
                      href={corporateOffice.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-solar-700 hover:text-solar-800"
                    >
                      Get Directions
                    </a>
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <iframe
                title="HANS Solar office location"
                src={corporateOffice.embedUrl}
                className="h-56 w-full sm:h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>

          <ContactEnquiryForm idPrefix="contact" enquiryType="contact" />
        </div>
      </div>
    </div>
  );
}
