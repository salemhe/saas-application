"use client";
import ArrowRight from '@/assets/arrow-right.svg';
import starImage from '@/assets/star.png';
import springImage from '@/assets/spring.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const CallToAction = () => {
  const route = useRouter()
  return (
    <section className="bg-gradient-to-b from-white to-[#d2dcff] py-24 overflow-x-clip relative">
      <div className="container">
        <div className="section-heading relative">
          <h2 className="section-title">Sign Up for Free Today</h2>
          <p className="section-description mt-5">
            Unlock your marketing potential with an app that streamlines ad creation, tracks performance, and boosts results effortlessly.
          </p>

          {/* Images with Correct Layout */}
          <Image
            src={starImage}
            alt="Star Decoration"
            width={360}
            height={360}
            className="absolute -left-[350px] -top-[137px] pointer-events-none"
          />
          <Image
            src={springImage}
            alt="Spring Decoration"
            width={360}
            height={360}
            className="absolute -right-[331px] -top-[19px] pointer-events-none"
          />
        </div>

        <div className="flex gap-2 mt-10 justify-center">
          <button onClick={() => route.push('/auth?mode=signup')} className="btn btn-primary">Get for Free</button>
          <button className="btn btn-text flex items-center gap-1">
            <span>Learn More</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
