'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

function Hero() {
  const router = useRouter();

  return (
    <div id="hero" className="w-full h-[70vh] items-start z-10 bg-violet-100 relative">
      <div className="z-0">
        <Image
          loading="eager"
          src="/hero.png"
          className="w-full h-[70vh] absolute top-0 object-cover"
          width={800}
          height={1100}
          alt=""
        />
      </div>
      <div className="bg-violet-200 absolute top-0 z-10 w-full h-full opacity-70" />
      <div className="flex flex-col items-center p-4 pt-10 md:p-20 justify-between z-20">
        <div className="flex flex-col z-30 justify-center items-center mt-10">
          <h1 className="text-2xl md:text-5xl relative font-semibold text-slate-700 dark:text-white font-sans tracking-tight md:text-start text-center">
            Global <span className="text-violet-800">Warehouse Management</span> Simplified
          </h1>
          <p className="w-auto md:w-[35rem] text-black text-center mt-5">
            Efficiently manage your warehouse, reduce costs, and maximize space utilization across a
            global network.
          </p>
          <div className="w-auto md:w-[40rem] bg-white h-fit shadow-lg p-4 mt-10 rounded-2xl flex flex-row gap-x-4">
            <Input
              variant="large"
              id="location"
              label="Enter a location"
              placeholder="Bradford, West Yorkshire"
            />
            <Button text="Search" variant="lg" onClick={() => router.push('/listing')} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
