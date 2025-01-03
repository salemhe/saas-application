"use client";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "../../../../firebase";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const CreateCampaign = dynamic(() => import("@/components/CreateCampaign"), {
  loading: () => <Skeleton className="w-full h-[400px]" />,
});

const Page = () => {
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

  // Simulate loader timeout for 1 second before content renders
  useEffect(() => {
    if (authenticated) {
      setTimeout(() => {
        setLoading(false); // Hide loader after 1 second
      }, 1000);
    }
  }, [authenticated]);

  return (
    <main className="flex-1 p-4 md:p-16">
      <button
        className="size-10 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center mb-2"
        onClick={() => router.back()}
      >
        <ArrowLeft size={24} className="text-gray-600" />
      </button>
      {loading ? (
        <div className="flex flex-col gap-4 p-4 max-w-[900px] w-full mx-auto">
          <div className="grid max-w-[900px]">
            <div className="min-h-[100vh] animate-pulse flex-1 rounded-xl bg-white" />
            {/* <div className="gap-4 flex flex-col">
                  <div className="w-full h-9 animate-pulse rounded-xl bg-gray-100" />
                  <div className="w-full h-9 animate-pulse rounded-xl bg-gray-100" />
                  <div className="w-full h-9 animate-pulse rounded-xl bg-gray-100" />
                  <div className="w-full h-9 animate-pulse rounded-xl bg-gray-100" />
                  <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
                </div> */}
          </div>
        </div>
      ) : (
        <div className="max-w-[900px] w-full mx-auto">
          <CreateCampaign />
        </div>
      )}
    </main>
  );
};

export default Page;
