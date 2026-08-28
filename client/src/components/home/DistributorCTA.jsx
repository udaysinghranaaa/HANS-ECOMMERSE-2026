import Button from '@/components/ui/Button';

export default function DistributorCTA() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-solar-700 via-solar-600 to-solar-800 px-6 py-14 sm:px-10 sm:py-16 lg:px-16">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-solar-500/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Grow Your Business with HANS Solar
            </h2>
            <p className="mt-4 text-base leading-relaxed text-solar-50 sm:text-lg">
              Partner with HANS Solar and build a successful solar business with
              trusted products and reliable support.
            </p>
            <Button
              to="/distributor"
              variant="white"
              size="lg"
              className="mt-8"
            >
              Become a Distributor
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
