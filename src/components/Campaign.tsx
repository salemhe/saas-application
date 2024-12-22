import { PieChart, Paintbrush, Megaphone, LineChart } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitterSquare, FaYoutube } from "react-icons/fa";

const AdsRunningSection = () => {
  return (
    <div className="p-4 md:p-16 sm:p-8 ">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Text Section */}
        <div className="md:w-1/2 text-left mt-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Ads Running Section</h1>
          <p className="text-gray-600 text-sm md:text-base max-w-lg">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat, quas? Lorem ipsum dolor sit amet.
          </p>
        </div>

        {/* Grid Section */}
        <div 
          className="mt-6 grid grid-cols-1 sm:grid-cols-2  md:grid-cols-2 gap-4 md:w-1/2"
          >
          {/* Analyze */}
          <div className="p-4 bg-[#EDF2FF] rounded-lg text-center shadow-sm hover:shadow-lg h-36 md:h-32 transition-all duration-200">
            <div className="text-[#5A67D8] text-3xl mb-2">
              <PieChart />
            </div>
            <h3 className="font-semibold text-gray-800">Analyze</h3>
            <p className="text-sm text-gray-600">Understand your audience better.</p>
          </div>

          {/* Design */}
          <div className="p-4 bg-[#E6FFFA] rounded-lg text-center shadow-sm hover:shadow-lg h-36 md:h-28 transition-all duration-200">
            <div className="text-[#319795] text-3xl mb-2">
              <Paintbrush />
            </div>
            <h3 className="font-semibold text-gray-800">Design</h3>
            <p className="text-sm text-gray-600">Create stunning visuals easily.</p>
          </div>

          {/* Launch */}
          <div className="p-4 bg-[#FFF5EB] rounded-lg text-center shadow-sm hover:shadow-lg h-36 md:h-28 transition-all duration-200">
            <div className="text-[#D69E2E] text-3xl mb-2">
              <Megaphone />
            </div>
            <h3 className="font-semibold text-gray-800">Launch</h3>
            <p className="text-sm text-gray-600">Deploy your ads effectively.</p>
          </div>

          {/* Measure */}
          <div className="p-4 bg-[#FFE4E6] rounded-lg text-center shadow-sm hover:shadow-lg h-36 md:h-32 transition-all duration-200">
            <div className="text-[#E53E3E] text-3xl mb-2">
              <LineChart />
            </div>
            <h3 className="font-semibold text-gray-800">Measure</h3>
            <p className="text-sm text-gray-600">Track your campaign's success.</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        {/* Section Title */}
        <h2 className="text-3xl font-bold">Ad Platforms</h2>

        {/* Social Media Icons */}
        <div className="flex mt-6 gap-8">
          <a href="/" className="text-[#E4405F]" aria-label="Instagram">
            <FaInstagram size={30} />
          </a>
          <a href="/" className="text-[#1877F2]" aria-label="Facebook">
            <FaFacebook size={30} />
          </a>
          <a href="/" className="text-[#FF0000]" aria-label="YouTube">
            <FaYoutube size={30} />
          </a>
          <a href="/" className="text-[#1DA1F2]" aria-label="Twitter">
            <FaTwitterSquare size={30} />
          </a>
        </div>

        {/* Description */}
        <p className="text-base text-gray-900 mt-8">Additional Platforms Include</p>
        <p className="mt-2">
          <span className="text-purple-600 underline font-semibold">Billboard</span>
          <span className="mx-1">and</span>
          <span className="text-purple-600 underline font-semibold">Radio</span>
        </p>
      </div>
    </div>
  );
};

export default AdsRunningSection;






