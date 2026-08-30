import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from 'lucide-react';
import { useSubmitContactEnquiryMutation } from '@/services/enquiriesApi';

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name is too long'),
  phone: z
    .string()
    .trim()
    .min(10, 'Enter a valid phone number')
    .max(20, 'Phone number is too long')
    .regex(/^[\d+\s()-]+$/, 'Enter a valid phone number'),
  email: z.string().trim().email('A valid email is required'),
  message: z
    .string()
    .trim()
    .min(10, 'Please describe your requirement')
    .max(2000, 'Message is too long'),
});

export default function ContactEnquiryForm({
  idPrefix = 'contact',
  enquiryType = 'contact',
  productName = '',
  showHeader = true,
  compactSuccess = false,
  title = 'Send Us Your Requirement',
  description = 'Fill in your details and our team will reach out shortly.',
  titleId,
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitContactEnquiry] = useSubmitContactEnquiryMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      await submitContactEnquiry({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim().toLowerCase(),
        message: values.message.trim(),
        enquiryType,
        ...(productName ? { productName } : {}),
      }).unwrap();

      reset();
      setIsSubmitted(true);
    } catch (error) {
      setError('root', {
        message:
          error?.data?.message ||
          'Unable to submit your enquiry. Please try again.',
      });
    }
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
    reset();
  };

  const fieldId = (name) => `${idPrefix}-${name}`;

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
      {isSubmitted ? (
        <div
          className={`flex flex-col items-center justify-center text-center ${compactSuccess ? 'min-h-[320px]' : 'min-h-[420px]'}`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h2 className="mt-6 text-2xl font-bold text-charcoal sm:text-3xl">
            Thank you for visiting Hans Solar, North India&apos;s No. 1 Solar
            Company.
          </h2>
          <p className="mt-3 max-w-md text-base text-charcoal-light">
            Our team will contact you within the next few hours.
          </p>
          <button
            type="button"
            onClick={handleSendAnother}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-solar-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-solar-700"
          >
            Send Another Enquiry
          </button>
        </div>
      ) : (
        <>
          {showHeader && (
            <div className="mb-8">
              <h2
                id={titleId}
                className="text-2xl font-bold text-charcoal"
              >
                {title}
              </h2>
              <p className="mt-2 text-sm text-charcoal-light sm:text-base">
                {description}
              </p>
            </div>
          )}

          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={fieldId('name')}
                  className="mb-2 block text-sm font-medium text-charcoal"
                >
                  Name
                </label>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-solar-600"
                    aria-hidden
                  />
                  <input
                    id={fieldId('name')}
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-charcoal outline-none transition placeholder:text-gray-400 focus:border-solar-400 focus:ring-2 focus:ring-solar-100"
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={fieldId('phone')}
                  className="mb-2 block text-sm font-medium text-charcoal"
                >
                  Phone
                </label>
                <div className="relative">
                  <Phone
                    className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-solar-600"
                    aria-hidden
                  />
                  <input
                    id={fieldId('phone')}
                    type="tel"
                    autoComplete="tel"
                    placeholder="Your phone number"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-charcoal outline-none transition placeholder:text-gray-400 focus:border-solar-400 focus:ring-2 focus:ring-solar-100"
                    {...register('phone')}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor={fieldId('email')}
                className="mb-2 block text-sm font-medium text-charcoal"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-solar-600"
                  aria-hidden
                />
                <input
                  id={fieldId('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-charcoal outline-none transition placeholder:text-gray-400 focus:border-solar-400 focus:ring-2 focus:ring-solar-100"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={fieldId('message')}
                className="mb-2 block text-sm font-medium text-charcoal"
              >
                Requirement / Message
              </label>
              <div className="relative">
                <MessageSquare
                  className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-solar-600"
                  aria-hidden
                />
                <textarea
                  id={fieldId('message')}
                  rows={5}
                  placeholder="Tell us about your solar requirement, system size, location or any questions..."
                  className="w-full resize-y rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-charcoal outline-none transition placeholder:text-gray-400 focus:border-solar-400 focus:ring-2 focus:ring-solar-100"
                  {...register('message')}
                />
              </div>
              {errors.message && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.message.message}
                </p>
              )}
            </div>

            {errors.root && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errors.root.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-solar-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-solar-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Enquiry
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
