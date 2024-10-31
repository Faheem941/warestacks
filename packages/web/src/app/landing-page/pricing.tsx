import Image from 'next/image';

function Pricing() {
  return (
    <div className="bg-[#0B0F13] py-28 w-full items-center flex justify-center flex-col">
      <h2 className="text-white text-6xl mt-4 w-[50rem] text-center font-semibold leading-[4.5rem]">
        Affordable Pricing Plans to Fit <span className="text-secondary">Every Budget</span>
      </h2>
      <p className="text-white font-light text-opacity-90 text-xl w-[40rem] mt-4 text-center">
        Find the perfect plan for your business, balancing cost-effectiveness with essential
        features for growth.
      </p>
      <div className="max-w-[100rem] w-full h-auto px-14 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white bg-opacity-10 w-auto h-fit rounded-3xl px-6 py-6 flex-col gap-y-2 flex items-start">
          <h3 className="text-white text-2xl font-semibold">Basic</h3>
          <p className="text-white text-opacity-80">
            Ideal small businesses or startups with minimal warehousing needs.
          </p>
          <p className="text-white text-3xl mt-3">
            £49 <span className="text-white text-opacity-70">/</span>{' '}
            <span className="text-white text-opacity-70 text-lg">month</span>
          </p>
          <button
            type="button"
            className="text-white w-full border py-3 border-secondary rounded-xl mt-2 font-light"
          >
            Get Started
          </button>
          <div className="h-[1px] bg-white bg-opacity-20 w-full mt-4" />
          <div className=" flex flex-col mt-5 gap-y-4">
            <div className="flex flex-row items-center">
              <Image src="/tick.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-white font-light ml-3 text-sm">
                Access to core platform features including warehouse registration, search, and
                booking.
              </p>
            </div>
            <div className="flex flex-row items-center">
              <Image src="/tick.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-white font-light ml-3 text-sm">
                Basic dashboard with real-time inventory management.
              </p>
            </div>
            <div className="flex flex-row items-center">
              <Image src="/tick.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-white font-light ml-3 text-sm">
                Ability to manage up to 2 warehouse locations.
              </p>
            </div>
            <div className="flex flex-row items-center">
              <Image src="/tick.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-white font-light ml-3 text-sm">
                Standard customer support (email support with a 48-hour response time).
              </p>
            </div>
          </div>
        </div>
        <div className="bg-secondary w-auto h-fit rounded-3xl px-6 py-6 flex-col gap-y-2 flex items-start">
          <h3 className="text-primary text-2xl font-semibold">Professional</h3>
          <p className="text-primary text-opacity-80">
            Medium-sized businesses with growing warehousing and advanced tools.
          </p>
          <p className="text-primary text-3xl mt-3">
            £149 <span className="text-primary text-opacity-70">/</span>{' '}
            <span className="text-primary text-opacity-70 text-lg">month</span>
          </p>
          <button
            type="button"
            className="text-white w-full border py-3 border-transparent bg-primary rounded-xl mt-2 font-light"
          >
            Get Started
          </button>
          <div className="h-[1px] bg-primary bg-opacity-20 w-full mt-4" />
          <div className=" flex flex-col mt-5 gap-y-5">
            <div className="flex flex-row items-center">
              <Image
                src="/tick2.svg"
                width={50}
                height={50}
                className="w-8 h-8 stroke-black fill-black"
                alt="tick"
              />
              <p className="text-primary font-light ml-3 text-sm">
                All features of the Basic Plan.
              </p>
            </div>
            <div className="flex flex-row items-center">
              <Image src="/tick2.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-primary font-light ml-3 text-sm">
                Enhanced dashboard with advanced analytics and reporting tools.
              </p>
            </div>
            <div className="flex flex-row items-center">
              <Image src="/tick2.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-primary font-light ml-3 text-sm">
                Ability to manage up to 5 warehouse locations.
              </p>
            </div>
            <div className="flex flex-row items-center">
              <Image src="/tick2.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-primary font-light ml-3 text-sm">
                Priority customer support (email and phone support with a 24-hour response time).
              </p>
            </div>
            <div className="flex flex-row items-center">
              <Image src="/tick2.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-primary font-light ml-3 text-sm">
                Access to premium search filters and booking options.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-primary w-auto h-fit rounded-3xl px-6 py-6 flex-col gap-y-2 flex items-start">
          <h3 className="text-white text-2xl font-semibold">Enterprise</h3>
          <p className="text-white text-opacity-80">
            Large enterprises with extensive warehousing requirements and a need for full platform
            customization and integration.
          </p>
          <p className="text-white text-3xl mt-3">
            £499 <span className="text-white text-opacity-70">/</span>{' '}
            <span className="text-white text-opacity-70 text-lg">month</span>
          </p>
          <button
            type="button"
            className="text-primary bg-secondary w-full border py-3 border-secondary rounded-xl mt-2 font-light"
          >
            Get Started
          </button>
          <div className="h-[1px] bg-white bg-opacity-20 w-full mt-4" />
          <div className=" flex flex-col mt-5 gap-y-6">
            <div className="flex flex-row items-center">
              <Image src="/tick.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-white font-light ml-3 text-sm">
                All features of the Professional Plan.
              </p>
            </div>
            <div className="flex flex-row items-center">
              <Image src="/tick.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-white font-light ml-3 text-sm">
                Unlimited warehouse locations management.
              </p>
            </div>
            <div className="flex flex-row items-center">
              <Image src="/tick.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-white font-light ml-3 text-sm">
                Integration capabilities with existing ERP, CRM, and other business systems.
              </p>
            </div>
            <div className="flex flex-row items-center">
              <Image src="/tick.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-white font-light ml-3 text-sm">
                Customizable dashboards and tailored reporting tools.
              </p>
            </div>
            <div className="flex flex-row items-center">
              <Image src="/tick.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-white font-light ml-3 text-sm">
                Dedicated account manager and premium customer support (24/7 support with a 2-hour
                response time).
              </p>
            </div>
            <div className="flex flex-row items-center">
              <Image src="/tick.svg" width={50} height={50} className="w-8 h-8" alt="tick" />
              <p className="text-white font-light ml-3 text-sm">
                Access to the marketplace for buying/selling spare warehouse capacity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
