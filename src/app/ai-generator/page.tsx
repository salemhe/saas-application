"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import Sidebar from "@/components/Sidebar"
import Chatbot from "@/components/Chatbot"





function Page() {
   const [authenticated, setAuthenticated] = useState(false);
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

  

  if (!authenticated) {
    return null; // Avoid rendering the component until redirection completes
  }
  return (
    <div className="flex md:flex lg:flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 flex justify-center items-center">
        <div className="max-w-[900px] w-full mx-auto text-center">
          {/* Billboard Content goes here */}
          <Chatbot />
          {/* <h1 className="text-2xl font-semibold">AI-Generator Content</h1>
          <p className="mt-4 text-gray-600">This is the content for ai-generator.</p> */}
        </div>
      </main>
    </div>
  )
}

export default Page


