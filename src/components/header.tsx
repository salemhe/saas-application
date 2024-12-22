"use client"
import React, { useEffect, useState } from 'react'
 import {
   SidebarTrigger,
 } from "@/components/ui/sidebar"
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
function Header() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fetchUserData = async (uid: string) => {
  
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        console.error("User document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
    });
    
    return () => unsubscribe();
  }, []);

  return (
   <header className="flex h-16  items-center gap-2 w-full bg-white z-10 border-b border-gray-100  md:pr-64 group-has-[[data-collapsible=icon]]/sidebar-wrapper:pr-12 transition-[width,height] ease-linear fixed group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
   <div className="flex items-center justify-between gap- px-4 w-full">
     <SidebarTrigger className="-ml-1" />
     
     {loading ? (
          <div className="cursor-pointer border-b p-3 flex items-center justify-between transition-colors mb-4">
            <p>Loading user data...</p>
          </div>
        ) : userData ? (
          <div
            onClick={() => router.push("/profile")}
            className="cursor-pointer  flex items-center justify-between transition-colors "
          >
            {userData.profileImage ? (
              <Image
                src={userData.profileImage}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full w-10 h-10"
              />
            ) : (
              <div className="bg-gray-500 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {userData.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p>No user data available.</p>
        )}
   </div>
 </header>
  )
}

export default Header