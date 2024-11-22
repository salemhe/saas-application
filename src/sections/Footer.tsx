import logo from '@/assets/logosaas.png';
import Image from 'next/image';
import SocialX from '@/assets/social-x.svg';
import SocialInsta from '@/assets/social-insta.svg';
import SocialLinkedin from '@/assets/social-linkedin.svg';
import SocialPin from '@/assets/social-pin.svg';
import SocialYoutube from '@/assets/social-youtube.svg'

export const Footer = () => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center">
      <div className="container">
        {/* Logo with Gradient */}
        <div className="inline-flex relative">
          <div className="absolute inset-0 blur-sm bg-gradient-to-r from-[#F87BFF] via-[#FB92CF] to-[#2FD8FE] z-0"></div>
          <Image src={logo} alt="SaaS logo" height={40} className="relative z-10" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Features</a>
          <a href="#" className="hover:text-white">Help</a>
          <a href="#" className="hover:text-white">Pricing</a>
        </nav>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mt-6">
          <a href="#" aria-label="Facebook">
            <SocialX className="h-6 w-6 hover:opacity-80" />
          </a>
          <a href="#" aria-label="Instagram">
            <SocialInsta className="h-6 w-6 hover:opacity-80" />
          </a>
          <a href="#" aria-label="LinkedIn">
            <SocialLinkedin className="h-6 w-6 hover:opacity-80" />
          </a>
          <a href="#" aria-label="Pinterest">
            <SocialPin className="h-6 w-6 hover:opacity-80" />
          </a>
          <a href="#" aria-label="Pinterest">
            <SocialYoutube className="h-6 w-6 hover:opacity-80" />
          </a>
        </div>

        {/* Footer Text */}
        <p className="mt-6">&copy; 2024 MarketingAI, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};
