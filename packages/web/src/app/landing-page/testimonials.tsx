import Image from 'next/image';

function Testimonials() {
  return (
    <section id="testimonials" className="mb-10 bg-[#F9FAFB] py-2 md:p-10 pb-20 scroll-m-20">
      <div className="flex flex-col">
        <p className="mb-4 text-base text-violet-700 self-center text-start bg-violet-100 px-5 py-2 rounded-xl flex flex-row items-center">
          <span className="bg-violet-700 w-2 h-2 rounded-full mr-2" />
          TESTIMONIALS
        </p>
        <h2 className="text-slate-700 text-2xl font-bold md:text-5xl lg:text-4xl md:mb-4 self-center mt-2">
          Why People <span className="text-violet-700">Choose Us</span>
        </h2>
        <div className="md:flex-row justify-center gap-8 mt-5 md:px-20 px-4 flex flex-col">
          <div className="py-6 px-5 md:w-[35rem] w-fit bg-white border border-neutral-100 rounded-3xl text-center flex justify-center items-center flex-col gap-y-5 hover:border-violet-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <Image
              width={100}
              height={100}
              src="/pfp-1.png"
              alt="James Lee"
              className="rounded-full"
            />
            <p className="text-neutral-500 font-light">
              “ Matchmaker has completely transformed how we engage with potential customers on
              social media. The tool’s ability to monitor relevant conversations and automatically
              generate thoughtful responses has saved us countless hours. We&apos;ve seen a
              noticeable increase in our customer engagement since we started using Matchmaker. “
            </p>
            <div className="w-full h-[0.2rem] bg-violet-200 rounded-full" />
            <p className="text-slate-700 font-medium text-lg">James Lee</p>
          </div>
          <div className="py-6 px-5 md:w-[35rem] w-fit bg-white border border-neutral-100 rounded-3xl text-center flex justify-center items-center flex-col gap-y-5 hover:border-violet-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <Image
              width={100}
              height={100}
              src="/pfp-2.png"
              alt="James Lee"
              className="rounded-full"
            />
            <p className="text-neutral-500 font-light">
              “ As a small business owner, I needed a way to connect with my target audience without
              spending all day on social media. Matchmaker’s smart targeting and contextually
              relevant responses have made it easy to jump into conversations that matter. It’s like
              having a full-time social media manager on autopilot. “
            </p>
            <div className="w-full h-[0.2rem] bg-violet-200 rounded-full mt-auto" />
            <p className="text-slate-700 font-medium text-lg">Emily Davis</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
