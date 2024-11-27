"use client"
import ArrowIcon from '@/assets/arrow-right.svg';
import { useRouter } from 'next/navigation';

export const Hero = () => {
  const route = useRouter()
  return (
    <section className="pt-16 pb-20 md:pt-24 md:pb-28 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-hidden">
      <div className="container text-center">
        <div className="mx-auto max-w-2xl">
          {/* Tagline */}
          <div className="text-sm inline-block border border-[#222]/10 px-4 py-2 rounded-lg tracking-tight">
            Latest version is here ⚡
          </div>
          {/* Heading */}
          <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6 md:text-7xl">
            Revolutionize Your Marketing
          </h1>
          {/* Description */}
          <p className="text-xl text-[#010D3E] tracking-tight mt-6">
           Harness the power of AI to effortlessly create, manage, and optimize your marketing campaigns across multiple platforms—all in one app.
          </p>
          {/* Buttons */}
          <div className="flex justify-center gap-4 items-center mt-10">
            <button onClick={() => route.push('/auth?mode=signup')}  className="btn btn-primary px-6 py-3 text-lg font-thin">
              Get for free
            </button>
            <button className="btn btn-text flex items-center gap-2">
              <span>Learn more</span>
              <ArrowIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
