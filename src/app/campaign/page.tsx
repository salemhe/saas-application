"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import Sidebar from "@/components/Sidebar";

function Page() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state
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
        setLoading(false);  // Hide loader after 3 seconds
      }, 2000);
    }
  }, [authenticated]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 flex justify-center items-center">
        {loading ? (
          <div className="w-16 h-16 border-4 border-dashed border-blue-500 animate-spin border-t-transparent rounded-full"></div>
        ) : (
          <div className="max-w-4xl w-full mx-auto text-center">
            <h1 className="text-2xl font-semibold">Campaign Content</h1>
            <p className="mt-4 text-gray-600">This is the content for Campaign.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Page;