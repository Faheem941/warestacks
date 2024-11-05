import { memo } from 'react';
import SubSection from '@/components/ui/subsection';

function Features() {
  return (
    <section id="key-benefit" className="mb-10">
      <SubSection
        highlightTitle="Optimize"
        title="Efficiency, Minimize Costs"
        isReversed
        subHeader="KEY BENEFIT"
        imgPath="/second-feature.png"
      >
        <p className="text-font self-center md:self-start mt-2 md:text-lg lg:text-xl leading-normal font-normal text-start text-neutral-500">
          Streamline multi-warehouse management with centralized control, reducing costs and
          improving operational efficiency.
        </p>
        <ul className="marker:text-primary list-outside list-disc ml-6 mt-4">
          <li className="text-font self-center md:self-start mt-2 md:text-lg lg:text-xl leading-normal font-normal text-start text-neutral-500">
            <span className="text-slate-700 font-semibold">Seamless Operations Alignment: </span>
            Ensure smooth multi-warehouse operations by standardizing workflows and reducing
            inconsistencies across locations.
          </li>
        </ul>
        <br />
        <ul className="marker:text-primary list-outside list-disc ml-6">
          <li className="text-font self-center md:self-start mt-2 md:text-lg lg:text-xl leading-normal font-normal text-start text-neutral-500">
            <span className="text-slate-700 font-semibold">Targeted Inventory Optimization: </span>
            Manage stock efficiently by tracking location-specific demands, minimizing overstocking,
            and avoiding costly stockouts.
          </li>
        </ul>
      </SubSection>
    </section>
  );
}

export default memo(Features);
