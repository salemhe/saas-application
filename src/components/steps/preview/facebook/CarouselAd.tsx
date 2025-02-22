import Image from 'next/image';
import { mockUser, commonStyles } from '../../../../../utils/addUtils';

interface FacebookCarouselAdProps {
  primaryText: string;
  headline: string;
  cta: string;
  media: string[];
}

export default function FacebookCarouselAd({primaryText, headline, cta, media}: FacebookCarouselAdProps) {
  return (
    <div className={`${commonStyles.adContainer} bg-white`}>
      <div className={commonStyles.header}>
        <Image src={mockUser.avatar} alt={mockUser.name} width={32} height={32} className={commonStyles.avatar} />
        <div>
          <span className={commonStyles.username}>{mockUser.name}</span>
          <p className="text-xs text-gray-500">Sponsored</p>
        </div>
      </div>
      <div className="p-2">
        <p className="text-sm mb-2">{primaryText}</p>
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto">
          {media.map((image, i) => (
            <div key={i} className="flex-shrink-0 w-[200px] mr-1 last:mr-0">
              <Image src={image || "/test.jpg"} alt='carousel media' width={200} height={200} className='object-cover size-52' />
            </div>
          ))}
        </div>
      </div>
      <div className="p-2">
        <h3 className="font-bold text-lg mb-1">{headline}</h3>
        <button className={`${commonStyles.cta} w-full`}>{cta}</button>
      </div>
    </div>
  );
}

