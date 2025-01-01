import React from "react";

interface InstagramFeedAdProps {
  media: string[];
  primaryText: string;
  cta: string;
  link: string;
}

const InstagramFeedAd: React.FC<InstagramFeedAdProps> = ({
  media,
  primaryText,
  cta,
  link,
}) => {
  return (
    <div className="w-full max-w-sm border rounded-lg shadow-md p-4">
      <div className="aspect-square rounded-lg overflow-hidden">
        <img src={media[0]} alt="Instagram Feed Ad" className="w-full h-full object-cover" />
      </div>
      <p className="mt-4 text-sm text-gray-700">{primaryText}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block px-4 py-2 bg-pink-600 text-white rounded"
      >
        {cta}
      </a>
    </div>
  );
};

export default InstagramFeedAd;
