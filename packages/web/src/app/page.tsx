import Navigation from '@/components/ui/navigation';
import Hero from './landing-page/hero';
import Features from './landing-page/features';
import Testimonials from './landing-page/testimonials';
import Integrations from './landing-page/integrations';
import Footer from './landing-page/footer';

export default function Home() {
  return (
    <div className="w-full h-full">
      <Navigation />
      <div className="flex flex-col">
        <Hero />
        <div className="flex flex-col items-center py-14 px-4">
          <h2 className="text-3xl md:text-4xl w-auto md:w-[40rem] text-center font-semibold">
            We solve space shortages with{' '}
            <span className="text-violet-700">flexible, on-demand storage solutions</span>
          </h2>
          <p className="text-neutral-500 w-auto md:w-[40rem] text-center mt-5">
            Manage warehouse space efficiently with our platform, offering flexible, on-demand
            storage solutions to meet your business needs.
          </p>
        </div>
        <Features />
        <Testimonials />
        <Integrations />
        <Footer />
      </div>
    </div>
  );
}
