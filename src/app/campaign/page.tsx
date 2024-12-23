// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { onAuthStateChanged } from "firebase/auth";
// import { 
//   auth, 
//   // db 
// } from "../../../firebase";
// import { AppSidebar } from "@/components/app-sidebar"
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar"
// import Header from "../../components/header"
// import Campaign from "@/components/Campaign";
// // import { Link2Off } from "lucide-react";
// // import { FaFacebook, FaGoogle } from "react-icons/fa";
// import {
//   FacebookAuthProvider,
//   GoogleAuthProvider,
//   linkWithPopup,
//   unlink,
// } from "firebase/auth";
// import { 
//   doc, 
//   updateDoc, 
//   // getDoc
//  } from "firebase/firestore";

// function Page() {
//   const [authenticated, setAuthenticated] = useState(false);
//   // const [linkedAccounts, setLinkedAccounts] = useState({
//   //   facebook: false,
//   //   google: false,
//   // });
//   const [loading, setLoading] = useState(true); 
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setAuthenticated(true); // User is logged in
//       } else {
//         setAuthenticated(false); // User is not logged in
//         router.push("/auth?mode=login"); // Redirect to login page
//       }
//     });

//     // Cleanup subscription on unmount
//     return () => unsubscribe();
//   }, [router]);

//   // Simulate loader timeout for 3 seconds before content renders
//   useEffect(() => {
//     if (authenticated) {
//       setTimeout(() => {
//         setLoading(false);  // Hide loader after 3 seconds
//       }, 2000);
//     }
//   }, [authenticated]);

//   // useEffect(() => {
//   //   const fetchUserData = async () => {
//   //     const user = auth.currentUser;
//   //     if (!user) return;
  
//   //     try {
//   //       // Check linked providers
//   //       const providerData = user.providerData;
//   //       setLinkedAccounts({
//   //         facebook: providerData.some(
//   //           (provider) => provider.providerId === "facebook.com"
//   //         ),
//   //         google: providerData.some(
//   //           (provider) => provider.providerId === "google.com"
//   //         ),
//   //       });
//   //     } catch (error) {
//   //       console.error("Error fetching user data:", error);
//   //     }
//   //   };
  
//   //   fetchUserData();
//   // }, []);
  

//   // const linkSocialAccount = async (providerName: "facebook" | "google") => {
//   //   const user = auth.currentUser;
//   //   if (!user) return;

//   //   try {
//   //     const provider =
//   //       providerName === "facebook"
//   //         ? new FacebookAuthProvider()
//   //         : new GoogleAuthProvider();

//   //     await linkWithPopup(user, provider);

//   //     // Update Firestore with additional account info
//   //     const userDocRef = doc(db, "users", user.uid);
//   //     await updateDoc(userDocRef, {
//   //       [`${providerName}LinkedAt`]: new Date(),
//   //     });

//   //     // Update local state
//   //     setLinkedAccounts((prev) => ({
//   //       ...prev,
//   //       [providerName]: true,
//   //     }));

//   //     alert(
//   //       `${providerName.charAt(0).toUpperCase() + providerName.slice(1)} account linked successfully!`
//   //     );
//   //   } catch (error) {
//   //     console.error(`Error linking ${providerName} account:`, error);
//   //     alert(`Failed to link ${providerName} account`);
//   //   }
//   // };

//   // const unlinkSocialAccount = async (providerName: "facebook" | "google") => {
//   //   const user = auth.currentUser;
//   //   if (!user) return;

//   //   try {
//   //     const providerId =
//   //       providerName === "facebook" ? "facebook.com" : "google.com";

//   //     await unlink(user, providerId);

//   //     // Update Firestore
//   //     const userDocRef = doc(db, "users", user.uid);
//   //     await updateDoc(userDocRef, {
//   //       [`${providerName}LinkedAt`]: null,
//   //     });

//   //     // Update local state
//   //     setLinkedAccounts((prev) => ({
//   //       ...prev,
//   //       [providerName]: false,
//   //     }));

//   //     alert(
//   //       `${providerName.charAt(0).toUpperCase() + providerName.slice(1)} account unlinked successfully!`
//   //     );
//   //   } catch (error) {
//   //     console.error(`Error unlinking ${providerName} account:`, error);
//   //     alert(`Failed to unlink ${providerName} account`);
//   //   }
//   // };

//   return (
//     <SidebarProvider>
//     <AppSidebar />
//     <SidebarInset>
//       <Header />
//       <main className="flex-1">
//         {loading ? (
//           <div className="flex-1 p-6 flex justify-center items-center">
//             <div className="w-16 h-16 border-4 border-dashed border-blue-500 animate-spin border-t-transparent rounded-full"></div>
//           </div>
//         ) : (
//           <div className="max-w-[900px] w-full mx-auto ">
//             {/* <h2 className="text-2xl font-semibold text-gray-800 mb-4">Linked Accounts</h2>
//             <div className="space-y-4">
//               {[ 
//                 { 
//                   provider: "facebook", 
//                   icon: <FaFacebook size={24} className="text-blue-600" />,
//                   name: "Facebook" 
//                 },
//                 { 
//                   provider: "google", 
//                   icon: <FaGoogle size={24} className="text-red-500" />,
//                   name: "Google" 
//                 }
//               ].map(({ provider, icon, name }) => (
//                 <div 
//                   key={provider}
//                   className="flex justify-between items-center bg-gray-100 p-4 rounded-lg transition duration-300 hover:bg-gray-200"
//                 >
//                   <div className="flex items-center space-x-4">
//                     {icon}
//                     <span className="text-sm  md:text-lg text-gray-700">{name} Account</span>
//                   </div>
//                   {linkedAccounts[provider as 'facebook' | 'google'] ? (
//                     <button
//                       onClick={() => unlinkSocialAccount(provider as 'facebook' | 'google')}
//                       className="flex items-center text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
//                     >
//                       <Link2Off size={20} className="mr-2" />
//                       Unlink
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => linkSocialAccount(provider as 'facebook' | 'google')}
//                       className={`
//                         ${provider === 'facebook' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}
//                         text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.05]
//                       `}
//                     >
//                       Link
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div> */}
//             <Campaign />
//           </div>
//         )}
//       </main>
//     </SidebarInset>
//     </SidebarProvider>
//   );
// }

// export default Page;




"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "../../components/header";
import Campaign from "@/components/Campaign";
// import { Link2Off } from "lucide-react";
// import { FaFacebook, FaGoogle } from "react-icons/fa";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  linkWithPopup,
  unlink,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { LinkCampaign } from "@/components/LinkCampaign";

function Page() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true); // User is logged in
      } else {
        setAuthenticated(false); // User is not logged in
        router.push("/auth?mode=login"); // Redirect to login page
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  // Simulate loader timeout for 3 seconds before content renders
  useEffect(() => {
    if (authenticated) {
      setTimeout(() => {
        setLoading(false); // Hide loader after 3 seconds
      }, 3000);
    }
  }, [authenticated]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1">
          {loading ? (
            <div className="flex flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
                <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
                <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
              </div>
              <div className="min-h-[100vh] animate-pulse flex-1 rounded-xl bg-gray-100" />
            </div>
          ) : (
            <div className="max-w-[900px] w-full mx-auto">
              {/* <h2 className="text-2xl font-semibold text-gray-800 mb-4">Linked Accounts</h2>
              <div className="space-y-4">
                {[ 
                  { 
                    provider: "facebook", 
                    icon: <FaFacebook size={24} className="text-blue-600" />,
                    name: "Facebook" 
                  },
                  { 
                    provider: "google", 
                    icon: <FaGoogle size={24} className="text-red-500" />,
                    name: "Google" 
                  }
                ].map(({ provider, icon, name }) => (
                  <div 
                    key={provider}
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg transition duration-300 hover:bg-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      {icon}
                      <span className="text-sm  md:text-lg text-gray-700">{name} Account</span>
                    </div>
                    {linkedAccounts[provider as 'facebook' | 'google'] ? (
                      <button
                        onClick={() => unlinkSocialAccount(provider as 'facebook' | 'google')}
                        className="flex items-center text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
                      >
                        <Link2Off size={20} className="mr-2" />
                        Unlink
                      </button>
                    ) : (
                      <button
                        onClick={() => linkSocialAccount(provider as 'facebook' | 'google')}
                        className={`
                          ${provider === 'facebook' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}
                          text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.05]
                        `}
                      >
                        Link
                      </button>
                    )}
                  </div>
                ))}
              </div> */}
              <Campaign />
              {/* <LinkCampaign /> */}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Page;
