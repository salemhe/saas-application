import { mockUser, commonStyles } from '../../../../../utils/addUtils';
// import { Play } from 'lucide-react';

interface FacebookVideoAdProps {
  primaryText: string;
  headline: string;
  cta: string;
  media: string[];
}

export default function FacebookVideoAd({primaryText, headline, cta, media}: FacebookVideoAdProps) {
  return (
    <div className={`${commonStyles.adContainer} bg-white`}>
      <div className={commonStyles.header}>
        <img src={mockUser.avatar} alt={mockUser.name} className={commonStyles.avatar} />
        <div>
          <span className={commonStyles.username}>{mockUser.name}</span>
          <p className="text-xs text-gray-500">Sponsored</p>
        </div>
      </div>
      <div className="p-2">
        <p className="text-sm mb-2">{primaryText}</p>
      </div>
      <div className="relative">
        <div className="bg-gray-200 h-[225px] flex items-center justify-center">
          {/* <Play size={48} className="text-gray-500" /> */}
          <video src={media[0]} className='h-full w-full bg-black' controls loop>

          </video>
        </div>
        <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-1 rounded">0:30</div>
      </div>
      <div className="p-2">
        <h3 className="font-bold text-lg mb-1">{headline}</h3>
        <button className={`${commonStyles.cta} w-full`}>{cta}</button>
      </div>
    </div>
  );
}

