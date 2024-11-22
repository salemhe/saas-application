// import productImage from '@/assets/product-image.png';
// import pyramidImage from '@/assets/pyramid.png';
// import tubeImage from '@/assets/tube.png';
// import Image from 'next/image';

// export const ProductShowcase = () => {
//   return (
//     <section className="bg-gradient-to-b from-[#fff] to-[#D2DCFF] py-24 overflow-x-clip">
//       <div className="container">
//         {/* Text Section */}
//         <div className="section-heading">
//           <div className="flex justify-center">
//             <div className="tag">Boost your productivity</div>
//           </div>
//           <h2 className="section-title mt-5">
//             A more effective way to track progress
//           </h2>
//           <p className="section-description mt-5">
//             Effortlessly turn your ideas into a fully functional, responsive SaaS website in just minutes with this template.
//           </p>
//         </div>

//         {/* Image Section */}
//         <div className="relative mt-10">
//           <Image src={productImage} alt="Product Image" className="mx-auto" />
//           <Image
//             src={pyramidImage}
//             alt="Pyramid image"
//             height={262}
//             width={262}
//             className="hidden md:block absolute -right-36 -top-32"
//           />
//           <Image
//             src={tubeImage}
//             alt="Tube image"
//             height={248}
//             className="hidden md:block absolute bottom-24 -left-36"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };



import productImage from '@/assets/product-image.png';
import Image from 'next/image';

export const ProductShowcase = () => {
  return (
    <section className="bg-gradient-to-b from-[#fff] to-[#D2DCFF] py-24 overflow-x-clip">
      <div className="container">
        {/* Text Section */}
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Boost your productivity</div>
          </div>
          <h2 className="section-title mt-5">
            A More Effective Way to Manage Campaigns
          </h2>
          <p className="section-description mt-5">
          Create, launch, and track campaigns effortlessly with AI-powered tools for ad copy, visuals, and automation.
          </p>
        </div>

        {/* Image Section */}
        <div className="relative mt-10">
          <Image src={productImage} alt="Product Image" className="mx-auto" />
        </div>
      </div>
    </section>
  );
};
