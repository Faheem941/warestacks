import { memo } from 'react';
import SubSection from '@/components/ui/subsection';

function Features() {
  return (
    <section id="features" className="mb-10">
      <SubSection
        highlightTitle="Intelligent"
        title="Keyword Monitoring"
        subHeader="FEATURES"
        imgPath="/first-feature.png"
      >
        <p className="text-font self-center md:self-start mt-2 md:text-lg lg:text-xl leading-normal font-normal text-start text-neutral-500">
          Automatically monitor social media platforms for conversations relevant to your business
        </p>
        <ul className="marker:text-primary list-outside list-disc ml-6 mt-4">
          <li className="text-font self-center md:self-start mt-2 md:text-lg lg:text-xl leading-normal font-normal text-start text-neutral-500">
            <span className="text-slate-700 font-semibold">Multi-Platform Coverage: </span>Track
            conversations across various social media channels like Reddit, Twitter, and more,
            ensuring you never miss a relevant discussion.
          </li>
        </ul>
        <br />
        <ul className="marker:text-primary list-outside list-disc ml-6">
          <li className="text-font self-center md:self-start mt-2 md:text-lg lg:text-xl leading-normal font-normal text-start text-neutral-500">
            <span className="text-slate-700 font-semibold">Real-Time Alerts: </span>Get instant
            notifications when specific keywords or phrases are mentioned, allowing you to engage at
            the right moment.
          </li>
        </ul>
      </SubSection>
      <SubSection
        highlightTitle="AI"
        title="Relevant Responses & Targeting"
        isReversed
        subHeader="FEATURES"
        imgPath="/second-feature.png"
      >
        <p className="text-font self-center md:self-start mt-2 md:text-lg lg:text-xl leading-normal font-normal text-start text-neutral-500">
          Generate natural, on-point responses while reaching the right audience for maximum impact.
        </p>
        <ul className="marker:text-primary list-outside list-disc ml-6 mt-4">
          <li className="text-font self-center md:self-start mt-2 md:text-lg lg:text-xl leading-normal font-normal text-start text-neutral-500">
            <span className="text-slate-700 font-semibold">Tone & Style Matching: </span>Ensure that
            your responses seamlessly blend into conversations by matching the tone, style, and
            context of ongoing discussions.
          </li>
        </ul>
        <br />
        <ul className="marker:text-primary list-outside list-disc ml-6">
          <li className="text-font self-center md:self-start mt-2 md:text-lg lg:text-xl leading-normal font-normal text-start text-neutral-500">
            <span className="text-slate-700 font-semibold">Automated Audience Targeting: </span>
            Engage the most relevant users by targeting based on location, demographics, and
            interests, ensuring your content reaches those most likely to convert.
          </li>
        </ul>
      </SubSection>
    </section>
  );
}

export default memo(Features);
