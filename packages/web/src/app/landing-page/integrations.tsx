import Image from 'next/image';

function Integrations() {
  return (
    <section id="integrations" className="p-2 px-4 md:p-10 pb-20 scroll-m-10">
      <div className="flex flex-col">
        <p className="mb-4 text-base text-violet-700 self-center text-start bg-violet-100 px-5 py-2 rounded-xl flex flex-row items-center">
          <span className="bg-violet-700 w-2 h-2 rounded-full mr-2" />
          INTEGRATIONS
        </p>
        <h2 className="text-slate-700 text-2xl font-bold md:text-5xl md:mb-4 self-center mt-2 text-center md:w-auto w-[18rem]">
          Integrating <span className="text-violet-700">Platforms You Love</span>
        </h2>
        <p className="text-neutral-500 w-auto md:w-[30rem] text-center self-center text-base mt-2">
          Effortlessly connect Matchmaker with your go-to social media platforms to streamline
          engagement and drive results.
        </p>
        <div className="flex flex-row items-center justify-center">
          <Image width={700} height={800} src="/social.png" alt="social" />
        </div>
      </div>
    </section>
  );
}

export default Integrations;
