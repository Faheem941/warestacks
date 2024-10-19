import Image from 'next/image';
import { memo, ReactNode } from 'react';

interface SubSectionProps {
  title: string;
  children: ReactNode;
  isReversed?: boolean;
  imgPath: string;
  imgWidth?: number;
  imgHeight?: number;
  subHeader?: string;
  highlightTitle?: string;
}

function SubSection({
  title,
  children,
  isReversed = false,
  imgWidth = 800,
  imgHeight = 800,
  imgPath,
  subHeader = undefined,
  highlightTitle = undefined,
}: SubSectionProps) {
  if (!isReversed) {
    return (
      <div className="md:container ml-0 mr-0 md:ml-auto md:mr-auto flex flex-col md:flex-row py-10 md:pt-20 md:pb-5 text-center md:text-start gap-8">
        <div className="flex flex-col md:w-2/3 px-4 self-center">
          {subHeader ? (
            <p className="mb-4 text-base text-violet-700 self-start text-start bg-violet-100 px-5 py-2 rounded-xl flex flex-row items-center">
              <span className="bg-violet-700 w-2 h-2 rounded-full mr-2" />
              {subHeader}
            </p>
          ) : (
            <div />
          )}

          <h2 className="text-slate-700 text-2xl font-bold md:text-5xl lg:text-4xl md:mb-4 self-start text-start">
            {highlightTitle ? <span className="text-violet-700">{highlightTitle} </span> : <div />}
            {title}
          </h2>
          {children}
        </div>
        <div className="md:w-2/3 px-4">
          <Image
            className="image"
            loading="eager"
            src={imgPath}
            width={imgWidth}
            height={imgHeight}
            alt=""
          />
        </div>
      </div>
    );
  }

  return (
    <div className="md:container ml-0 mr-0 md:ml-auto md:mr-auto flex flex-col-reverse md:flex-row py-10 md:pt-20 md:pb-5 text-center md:text-start gap-8">
      <div className="md:w-2/3 px-4">
        <Image
          className="image"
          loading="eager"
          src={imgPath}
          width={imgWidth}
          height={imgHeight}
          alt=""
        />
      </div>
      <div className="flex flex-col md:w-2/3 px-4 self-center">
        {subHeader ? (
          <p className="mb-4 text-base text-violet-700 self-start text-start bg-violet-100 px-5 py-2 rounded-xl flex flex-row items-center">
            <span className="bg-violet-700 w-2 h-2 rounded-full mr-2" />
            {subHeader}
          </p>
        ) : (
          <div />
        )}
        <h2 className="text-slate-700 text-2xl font-bold md:text-5xl lg:text-4xl md:mb-4 self-start text-start">
          {highlightTitle ? <span className="text-violet-700">{highlightTitle} </span> : <div />}
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

export default memo(SubSection);
