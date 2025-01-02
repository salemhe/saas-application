import React from "react";

interface FacebookFeedAdProps {
  media: string[];
  primaryText: string;
  headline: string;
  cta: string;
  link: string;
}

const FacebookFeedAd: React.FC<FacebookFeedAdProps> = ({
  media,
  primaryText,
  headline,
  cta,
  link,
}) => {
  return (
    <div className="w-full max-w-md border rounded-lg shadow-lg p-4 bg-white">
      <p className="text-sm text-gray-700">{primaryText}</p>
      <div className="mt-2 aspect-video rounded overflow-hidden">
        <img src={media[0]} alt="Ad Media" className="w-full h-full object-cover" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{headline}</h3>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded"
      >
        {cta}
      </a>
    </div>
  );
};

export default FacebookFeedAd;
