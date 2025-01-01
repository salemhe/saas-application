import Image from 'next/image';
import { mockUser, commonStyles } from '../../../../../utils/addUtils';

interface FacebookImageAdProps {
  primaryText: string;
  headline: string;
  cta: string;
  media: string[];
}

const FacebookImageAd = ({ primaryText, headline, cta, media }: FacebookImageAdProps) => {
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
      <Image src={media[0]} alt="Ad" width={400} height={400} />
      <div className="p-2">
        <h3 className="font-bold text-lg mb-1">{headline}</h3>
        <button className={`${commonStyles.cta} w-full`}>{cta}</button>
      </div>
    </div>
  );
}

export default FacebookImageAd;