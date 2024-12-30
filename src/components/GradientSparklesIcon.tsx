import { IoSparklesSharp } from 'react-icons/io5';
const GradientSparklesIcon = () => {
  return (
    <div className="relative flex gap-6 mb-4">
      <svg width="0" height="0">
        <defs>
          <linearGradient id="sparkles-gradient" x1="0%"  y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5a5acb" />
            <stop offset="100%" stopColor="#8080ff" />
          </linearGradient>
        </defs>
      </svg>
      <IoSparklesSharp className="w-20 h-20 text-medium  text-[#8080ff]" fill="url(#sparkles-gradient)"/>
      {/* <HiSparkles className="w-12 h-12 text-medium  text-[#8080ff]" fill="url(#sparkles-gradient)"/> */}
    </div>
  );
};

export default GradientSparklesIcon;