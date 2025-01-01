import Image from 'next/image';
import { mockUser, commonStyles } from '../../../../../utils/addUtils';
import { ChevronUp } from 'lucide-react';

interface InstagramVideoAdProps {
  media: string[];
  cta: string;
  headline: string;
}

export default function InstagramStoriesAd({media, cta, headline}: InstagramVideoAdProps) {
  return (
    <div className={`${commonStyles.adContainer} h-[640px] w-[360px]`}>
      <div className="relative h-full">
        <Image src="/placeholder.svg?height=640&width=360" alt="Story" layout="fill" objectFit="cover" />
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center">
          <Image src={media[0]} alt={mockUser.name} width={32} height={32} className="rounded-full border-2 border-white mr-2" />
          <span className="text-white font-semibold">{mockUser.name}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
          <h3 className="text-white font-bold mb-2">{headline}</h3>
          <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold flex items-center justify-center mx-auto">
            <ChevronUp className="mr-1" size={16} />
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
}

