"use client";

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Header from "@/components/header"
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase"; // Adjust import path as needed

import proimage from "@/assets/proimage.png"
import image1 from "@/assets/image1.png"
import Screenshot from "@/assets/Screenshot.png"
import Tiger from "@/assets/Tiger.png"
import iPhone16Pro from "@/assets/iPhone16Pro.png"
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Image from "next/image";

import { User, Camera,  Mail, Ellipsis, Edit2, ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,

  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ProfileComponent() {
  const [userData, setUserData] = useState<any>(null);
  
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
          const userData = userDoc.data();
          setUserData(userData);
          // Ensure that we always use the profileImage from Firestore if it exists
          setProfileImage(userData.profileImage || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
  



  
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {isEditing ? (
          <div className="flex flex-col mt-12 lg:gap-6 gap-[74px] pr-6 pl-6 pt-6 p-0">
            <div className="flex gap-4">
              <ChevronLeft onClick={() => setIsEditing(false)} className="w-6 h-6 mt-0.5 cursor-pointer "/>
              <h2  className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
            </div>
            <div className="flex flex-col w-full justify-between md:flex-row lg:flex-row">
              <div className="w-full flex md:hidden lg:hidden ">
                <Image
                  width={628}
                  height={328}
                  src={proimage}
                  alt="Profile Background"
                  className="w-full object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="space-y-4 w-full p-2">
                <div className="relativ flex-col mb-4 w- space-y-4 h-">
                  {/* Profile Picture */}
                  {profileImage || (userData && userData.profileImage) ? (
                    <Image
                      width={128}
                      height={128}
                      src={profileImage || userData.profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border- border-blue- shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={64} className="text-blue-500" />
                    </div>
                  )}
                  {/* Edit Profile Picture */}
                  <label className=" flex gap-4  cursor-pointer text-center ">
                    <Camera size={16} className=" w-6 h-6 text-gray-600" />
                    <span className="">Change Profile</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="w-full ">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={!userData ? "Mr. Alvert Flore" : userData.name}
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
              <div className="w-full hidden md:flex lg:flex">
                  <Image
                    width={628}
                    height={328}
                    src={iPhone16Pro}
                    alt="Profile Background"
                    className="w-full object-cover "
                  />
              </div>
            </div>
            <div className="w-full bottom-0 gap- justify-between flex">
              <Image
                width={328}
                height={228}
                src={image1}
                alt="Profile Background"
                className="w-full h-16 lg:h-[220px]"
                style={{ objectFit: "fill" }}
              />
              <Image
                width={328}
                height={228}
                src={Screenshot}
                alt="Profile Background"
                className="w-full h-16 lg:h-[220px]"
                style={{ objectFit: "fill" }}
              />
              <Image
                width={328}
                height={228}
                src={Tiger}
                alt="Profile Background"
                className="w-full h-16 lg:h-[220px]"
                style={{ objectFit: "fill" }}
              />
            </div>

          </div>
        ) : (
          <>
            {loading ? (
              <div className="flex-1 p-6 flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-dashed border-blue-500 animate-spin border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row items-center mt-12 gap-6 p-6 ">
                {/* Left Image Section */}
                <div className="w-full lg:w-1/3">
                  <Image
                    width={628}
                    height={328}
                    src={proimage}
                    alt="Profile Background"
                    className="w-full object-cover rounded-lg shadow-md"
                  />
                </div>

                {/* Profile Overview Card */}
                <div className="w-full lg:w-2/3 rounded-lg mt-2 p-6">
                  <div className="flex justify-between">
                    <div className="flex gap-4">
                      <div className="relative mb-4 w-32 h-32">
                        {/* Profile Picture */}
                        {profileImage || (userData && userData.profileImage) ? (
                          <Image
                            width={128}
                            height={128}
                            src={profileImage || userData.profileImage}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border- border-blue- shadow-lg"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={64} className="text-blue-500" />
                          </div>
                        )}
                        {/* Edit Profile Picture */}
                        {/* <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600">
                          <Camera size={16} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label> */}
                      </div>
                      <div className="flex flex-col justify-center ">
                        <h1 className="text-2xl font-bold text-gray-800">{userData?.name || "Mr. Alvert Flore"}</h1>
                        <p className="text-sm text-gray-500">
                          Joined {userData.createdAt ? userData.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}
                        </p>

                      </div>
                    </div>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Ellipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                          // side={isMobile ? "bottom" : "right"}
                          align="end"
                          sideOffset={4}
                        >
                        
                          <DropdownMenuItem onClick={() => setIsEditing(!isEditing)}>
                            <Edit2 />
                            Edit Profile
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {/* User Info */}
                  <div className="mt-4">
                    <div className="mt-4 space-y-2">
                      {/* Address */}
                      {/* <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-blue-500" />
                        <span className="text-gray-600">4517 Washington Ave, Manchester, Kentucky 39495</span>
                      </div> */}
                      {/* Phone */}
                      {/* <div className="flex items-center gap-2">
                        <Phone size={16} className="text-blue-500" />
                        <span className="text-gray-600">+62 124 2123 8925</span>
                      </div> */}
                      {/* Email */}
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-blue-500" />
                        <span className="text-gray-600">{userData?.email || "alvertflore925@gmail.com"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
  </SidebarInset>
  </SidebarProvider>

  );
}
