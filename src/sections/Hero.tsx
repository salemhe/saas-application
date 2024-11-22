// import ArrowIcon from '@/assets/arrow-right.svg'
// import cogImage from '@/assets/cog.png'
// import cylinderImage from '@/assets/cylinder.png'
// import noodleImage from '@/assets/noodle.png'
// import Image from 'next/image'

// export const Hero = () => {
//   return <section className='pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip'>
//     <div className='container'>
//       <div className='md:flex items-center'>
//         <div className='md:w-[478px]'>
//             <div className="tag">Latest version is here</div>
//             <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80]  text-transparent bg-clip-text mt-6" >Pathway to productivity</h1>
//             <p className="text-xl text-[#010D3E] tracking-tight mt-6">
//               Celebrate the joy of accomplishment with an app designed to track 
//               your progres, motiavte your efforts, and celebrate your success.
//             </p>
//             <div className="flex gap-1 items-center mt-[30px]">
//               <button className="btn btn-primary">Get for free</button>
//               <button className="btn btn-text gap-1"> 
//                 <span>Learn more</span>
//                 <ArrowIcon className='h-5 w-5'/>
//               </button>
//             </div>
//         </div>

//         <div className='mt-20 md:mt-0 md:h-[648px] md:flex-1 relative'>
//           <Image src={cogImage} alt='Cog image' className='md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0'/>
//           <Image src={cylinderImage} width={220} height={220} alt='cylinder image ' className='hidden md:block -top-8 -left-32 md:absolute' />
//           <Image src={noodleImage} width={220} alt='Noodle image' className='hidden lg:block  absolute top-[524px] left-[448px] rotate-[30deg]'  />
//         </div>
//       </div>


//     </div>
//   </section>;
// };


import ArrowIcon from '@/assets/arrow-right.svg';

export const Hero = () => {
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
            <button className="btn btn-primary px-6 py-3 text-lg font-semibold">
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
