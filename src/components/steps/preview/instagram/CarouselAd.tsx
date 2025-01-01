import Image from 'next/image';
import { mockUser, commonStyles } from '../../../../../utils/addUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InstagramCarouselAdProps {
  media: string[];
  cta: string;
  primaryText: string;
  headline: string;
}

export default function InstagramCarouselAd({media, cta, primaryText, headline}: InstagramCarouselAdProps) {
  return (
    <div className={commonStyles.adContainer}>
      <div className={commonStyles.header}>
        <Image src={mockUser.avatar} alt={mockUser.name} width={32} height={32} className={commonStyles.avatar} />
        <span className={commonStyles.username}>{mockUser.name}</span>
      </div>
      <div className={`${commonStyles.content} relative`}>
        <Image src={media[0]} alt="Ad" width={400} height={400} />
        <div className="absolute inset-y-0 left-0 flex items-center">
          <ChevronLeft className="text-white bg-black bg-opacity-50 rounded-full p-1" size={24} />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <ChevronRight className="text-white bg-black bg-opacity-50 rounded-full p-1" size={24} />
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        </div>
        <div className={commonStyles.overlay}>
          <h3 className={commonStyles.title}>{headline}</h3>
          <p className={commonStyles.description}>{primaryText}</p>
          <button className={commonStyles.cta}>{cta}</button>
        </div>
      </div>
    </div>
  );
}

