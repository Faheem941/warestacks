import Image from 'next/image';

const problemData = [
  {
    title: 'Operational Challenges',
    description:
      'Fragmented operations in multi-warehouse businesses cause productivity loss, while inventory inefficiencies lead to costly stock issues and $1.77 trillion in lost sales annually.',
    imgSrc: '/prob2.svg',
  },
  {
    title: 'Space Inefficiencies',
    description:
      'Underutilized warehouse space is a missed revenue opportunity, while data discrepancies and delayed information result in poor decision-making and increased operational costs.',
    imgSrc: '/prob3.svg',
  },
  {
    title: 'Sustainable Logistics Pressure',
    description:
      'The environmental impact of these inefficiencies is no longer sustainable, with logistics companies facing mounting pressure to reduce their carbon footprints',
    imgSrc: '/prob1.svg',
  },
];

function Problem() {
  return (
    <div className="w-full items-center flex justify-center md:px-14 px-4">
      <div className="bg-white border border-neutral-100 md:max-w-[100rem] w-full h-auto md:px-14 px-4 py-10 rounded-3xl relative bottom-24 shadow-xl flex flex-col">
        <p className="bg-secondary px-5 py-2 text-primary w-fit rounded-xl font-medium">
          THE PROBLEM
        </p>
        <div className="flex md:flex-row flex-col mt-4">
          <h2 className="text-header-color md:text-3xl text-xl md:w-[45rem] font-semibold">
            Fragmented Operations, Inventory Inefficiencies, Missed Opportunities
          </h2>
          <p className="md:w-[45rem] text-body font-light content-center md:text-base text-sm">
            The warehouse management industry faces costly inefficiencies, with outdated systems and
            fragmented processes hindering productivity and growth.
          </p>
        </div>
        <div className="flex mt-8 md:flex-row flex-col justify-between items-start">
          {problemData.map((prob) => (
            <div className="flex flex-col md:w-96 gap-y-2" key={Math.random()}>
              <Image
                src={prob.imgSrc}
                alt={prob.title}
                width={500}
                height={500}
                className="h-60 w-full"
              />
              <h3 className="text-header-color md:text-xl text-base font-semibold">{prob.title}</h3>
              <p className="text-body font-light md:text-base text-sm">{prob.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Problem;
