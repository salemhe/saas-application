"use client";

import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase"; // Adjust import path as needed
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  linkWithPopup,
  unlink,
} from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { User, Link2Off, Camera } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa";

export default function ProfileComponent() {
  const [userData, setUserData] = useState<any>(null);
  const [linkedAccounts, setLinkedAccounts] = useState({
    facebook: false,
    google: false,
  });
  const [profileImage, setProfileImage] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Fetch user document from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setProfileImage(userDoc.data().profileImage || ""); 
        }

        // Check linked providers
        const providerData = user.providerData;
        setLinkedAccounts({
          facebook: providerData.some(
            (provider) => provider.providerId === "facebook.com"
          ),
          google: providerData.some(
            (provider) => provider.providerId === "google.com"
          ),
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const linkSocialAccount = async (providerName: "facebook" | "google") => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const provider =
        providerName === "facebook"
          ? new FacebookAuthProvider()
          : new GoogleAuthProvider();

      await linkWithPopup(user, provider);

      // Update Firestore with additional account info
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        [`${providerName}LinkedAt`]: new Date(),
      });

      // Update local state
      setLinkedAccounts((prev) => ({
        ...prev,
        [providerName]: true,
      }));

      alert(
        `${providerName.charAt(0).toUpperCase() + providerName.slice(1)} account linked successfully!`
      );
    } catch (error) {
      console.error(`Error linking ${providerName} account:`, error);
      alert(`Failed to link ${providerName} account`);
    }
  };

  const unlinkSocialAccount = async (providerName: "facebook" | "google") => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const providerId =
        providerName === "facebook" ? "facebook.com" : "google.com";

      await unlink(user, providerId);

      // Update Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        [`${providerName}LinkedAt`]: null,
      });

      // Update local state
      setLinkedAccounts((prev) => ({
        ...prev,
        [providerName]: false,
      }));

      alert(
        `${providerName.charAt(0).toUpperCase() + providerName.slice(1)} account unlinked successfully!`
      );
    } catch (error) {
      console.error(`Error unlinking ${providerName} account:`, error);
      alert(`Failed to unlink ${providerName} account`);
    }
  };

  
  const updateProfile = async () => {
   const user = auth.currentUser;
   if (!user) return;
 
   try {
     const userDocRef = doc(db, "users", user.uid);
     await updateDoc(userDocRef, {
       name: userData.name,
       profileImage: profileImage, // Saving the base64 image string
     });
 
     alert("Profile updated successfully!");
   } catch (error) {
     console.error("Error updating profile:", error);
     alert("Failed to update profile");
   }
 };
 
 
  

  // Handle the image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
   const file = event.target.files?.[0];
   if (file) {
     const reader = new FileReader();
     reader.onloadend = async () => {
       const newProfileImage = reader.result as string;
       setProfileImage(newProfileImage);  // Immediately update state with the new image
       
       // Save the image to Firestore immediately
       const user = auth.currentUser;
       if (user) {
         const userDocRef = doc(db, "users", user.uid);
         await updateDoc(userDocRef, {
           profileImage: newProfileImage,  // Save base64 image string
         });
 
         // Optionally: Fetch the updated user data from Firestore after update to ensure synchronization
         const userDoc = await getDoc(userDocRef);
         if (userDoc.exists()) {
           setUserData(userDoc.data());
         }
       }
     };
     reader.readAsDataURL(file);
   }
 };
 

   //loader timeout for 3 seconds before content renders
   useEffect(() => {
    if (!userData) {
      setTimeout(() => {
        setLoading(false);  
      }, 2000);
    }
  }, [userData]);

  return (
   <div className="flex">
  <Sidebar />
  <div className="flex-1 p-6 overflow-x-visible ml-24 md:ml-0 mx-auto max-w-4xl">
  {loading ? (
          <div className="w-16 h-16 border-4 border-dashed border-blue-500 animate-spin border-t-transparent rounded-full"></div>
        ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Profile Overview Card */}
      <div className="md:col-span-1 bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl">
        <div className="relative mx-auto mb-4 w-32 h-32">
          {profileImage || userData.profileImage ? (
            <Image
              width={128}
              height={128}
              src={profileImage || userData.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md"
            />
          ) : (
            <div className="bg-blue-100 w-32 h-32 rounded-full flex items-center justify-center">
              <User size={64} className="text-blue-500" />
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition">
            <Camera size={16} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {userData.name || "User Profile"}
        </h1>
        <p className="text-gray-500 mb-4">{userData.email}</p>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Edit Profile Card */}
      <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {isEditing ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={userData.name || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="Enter your name"
                />
              </div>
              <button
                onClick={updateProfile}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-[1.02]"
              >
                Save Changes
              </button>
            </div>
          </>
        ) : (
          /* Linked Accounts Section */
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Linked Accounts</h2>
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
            </div>
          </div>
        )}
      </div>
    </div>
        )}
  </div>
</div>

  );
}
