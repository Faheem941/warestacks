import Navigation from '@/components/ui/navigation';
import BetaModal from '@/components/ui/betaModal';
import Features from './landing-page/features';
import Footer from './landing-page/footer';
import Hero from './landing-page/hero';
import Pricing from './landing-page/pricing';
import Problem from './landing-page/problem';
import Solution from './landing-page/solution';

export default function Home() {
  return (
    <div className="w-full h-full">
      <Navigation />
      <div className="flex flex-col">
        <Hero />
        <div className="flex flex-col items-center py-14 px-4 bg-[#1AA47F] bg-opacity-5 pb-36">
          <h2 className="text-3xl md:text-4xl w-auto md:w-[40rem] text-center font-semibold text-header-color">
            We solve space shortages with{' '}
            <span className="text-primary">flexible, on-demand storage solutions</span>
          </h2>
          <p className="text-neutral-500 w-auto md:w-[40rem] text-center mt-5">
            Manage warehouse space efficiently with our platform, offering flexible, on-demand
            storage solutions to meet your business needs.
          </p>
        </div>
        <Problem />
        <Solution />
        <Pricing />
        <Features />
        <Footer />
      </div>
      <BetaModal />
    </div>
  );
}
