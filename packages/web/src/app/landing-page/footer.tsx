'use client';

import Button from '@/components/ui/button';

function Footer() {
  return (
    <section id="footer" className="px-4 md:px-20 bg-violet-700 mt-10">
      <div className="flex flex-col">
        <div className="flex bg-white md:flex-row flex-col justify-between w-full shadow-xl md:p-10 md:py-14 p-5 border border-violet-700 rounded-[3rem] items-center md:px-20 -mt-24">
          <p className="text-2xl md:text-5xl text-slate-700 font-semibold md:mb-0 mb-3">
            Be Part Of Early Testers
          </p>
          <div>
            <Button
              text="Sign Up!"
              variant="xl"
              onClick={() => {
                window.location.href = '/auth';
              }}
            />
          </div>
        </div>
        <div className="flex flex-row mt-20 justify-center text-center">
          <p className="text-white text-sm md:text-xl">
            Copyright © 2024 DWMS. All Rights Reserved.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Footer;
