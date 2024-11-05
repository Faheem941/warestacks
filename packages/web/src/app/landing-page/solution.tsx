import Image from 'next/image';

const features = [
  {
    title: 'Unified & Space Sharing Platform',
    description:
      'Centralized dashboard offers warehouse space sharing and management of inventory, orders, and workflows across locations.',
    imgSrc: '/feature1.svg',
  },
  {
    title: 'Automated Inventory Management',
    description:
      'Automated Inventory Management with AI-driven predictive analytics optimizes stock levels, while real-time data enables automatic replenishment orders.',
    imgSrc: '/feature3.svg',
  },
  {
    title: 'Analytics and Reporting',
    description:
      'Performance Metrics provide detailed analytics on warehouse KPIs, with customizable reports tailored to specific business needs.',
    imgSrc: '/feature2.svg',
  },
  {
    title: 'Optimized Order Fulfillment',
    description:
      'Smart Routing optimizes picking routes to save time and labor, while Distributed Order Management assigns orders to the warehouse based on location, inventory, and capacity.',
    imgSrc: '/feature4.svg',
  },
  {
    title: 'Seamless Integration',
    description:
      'ERP Integration streamlines operations by connecting with existing systems, while API Connectivity links CRM, e-commerce, and shipping platforms.',
    imgSrc: '/feature5.svg',
  },
  {
    title: 'Real-Time Data Synchronization',
    description:
      'Instant Updates provide real-time visibility into inventory, orders, and performance, while Data Consistency reduces errors across all warehouses.',
    imgSrc: '/feature6.svg',
  },
];

function Solution() {
  return (
    <section
      id="features"
      className="bg-primary py-20 w-full items-center flex justify-center flex-col"
    >
      <p className="bg-secondary px-5 py-2 text-primary w-fit rounded-xl font-medium">
        THE SOLUTION
      </p>
      <h2 className="text-white md:text-6xl text-3xl mt-4 md:w-[50rem] text-center font-semibold md:leading-[4.5rem]">
        Transform Your Operations <span className="text-secondary">Empower Your Business</span>
      </h2>
      <p className="text-white font-light text-opacity-90 md:text-xl md:w-[30rem] mt-4 text-center">
        A unified, scalable, and sustainable platform designed for the modern business.
      </p>
      <div className="max-w-[100rem] w-full h-auto md:px-14 px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {features.map((feature) => (
          <div
            key={Math.random()}
            className="bg-white bg-opacity-10 w-auto rounded-3xl px-6 py-5 flex-col gap-y-2 flex items-start border border-transparent hover:border-secondary transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative">
              <Image
                src={feature.imgSrc}
                alt={feature.title}
                width={100}
                height={100}
                className="h-12 w-full"
              />
            </div>
            <h3 className="text-white text-2xl font-semibold mt-5">{feature.title}</h3>
            <p className="text-white text-opacity-80 font-light">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Solution;
