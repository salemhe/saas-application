"use client";
import ArrowRight from "@/assets/arrow-right.svg";
import Logo from "@/assets/logosaas.png";
import Image from "next/image";
import MenuIcon from "@/assets/menu.svg";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useState, useEffect } from "react";

export const Header = () => {
  const route = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true); // User is logged in
      } else {
        setAuthenticated(false); // User is not logged in
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  

  // if (!authenticated) {
  //   return null; // Avoid rendering the component until redirection completes
  // }

  return (
    <header className="sticky top-0 backdrop-blur-sm z-20">
      {/* Top Bar */}
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
          Streamline your marketing and maximize results.
        </p>
        <div
          onClick={() => route.push("/auth?mode=signup")}
          className="inline-flex gap-1 cursor-pointer items-center"
        >
          <p className="text-white">Get started for free</p>
          <ArrowRight className="h-4 w-4 inline-flex justify-center items-center text-white" />
        </div>
      </div>

      {/* Main Navbar */}
      <div className="py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Image src={Logo} alt="Saas Logo" height={40} width={40} />

            {/* Hamburger Menu for Mobile */}
            <div
              className="md:hidden cursor-pointer"
              onClick={toggleMenu}
            >
              <MenuIcon className={`h-5 w-5 ${isMenuOpen ? 'text-white' : 'text-black'}`} />
            </div>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden md:flex gap-6 text-black/60 items-center">
              <a href="#">About</a>
              <a href="#">Features</a>
              <a href="#">Help</a>
              {!authenticated ?
                ( <div className="flex items-center gap-4">  
                  <button
                    onClick={() => route.push("/auth?mode=login")}
                    className="btn btn-text"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => route.push("/auth?mode=signup")}
                    className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight"
                  >
                    Get for free
                  </button> 
                  </div>
                ) : (
                  <a href="/dashboard">Dashboard</a>
                )

              }
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu (visible when menu is open) */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden absolute top-0 left-0 w-full h-screen bg-black text-white py-4 text-left transition-transform duration-[700ms] ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between px-6 mb-8">
          <Image src={Logo} alt="Logo" height={40} width={40} />
          {/* Close button */}
          <button
            onClick={toggleMenu}
            className="text-white text-xl"
          >
            &times;
          </button>
        </div>

        <nav className="flex flex-col px-6 space-y-6 pt-10">
          <a href="#" className="text-white text-lg">About</a>
          <a href="#" className="text-white text-lg">Features</a>
          <a href="#" className="text-white text-lg">Help</a>

          {/* Buttons for login and signup */}
          <button
            onClick={() => route.push("/auth?mode=login")}
            className="bg-white text-black px-6 py-2 rounded-lg font-medium tracking-tight"
          >
            Login
          </button>
          <button
            onClick={() => route.push("/auth?mode=signup")}
            className="bg-white text-black px-6 py-2 rounded-lg font-medium tracking-tight"
          >
            Get for free
          </button>
        </nav>
      </div>
    </header>
  );
};



