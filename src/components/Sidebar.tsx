"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Image from "next/image";
import {
  Home,
  LayoutDashboard,
  StickyNote,
  Search,
  Sparkles,
  SmartphoneNfc,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  PlusCircle,
  LogOut,
  Settings,
} from "lucide-react";

import Logo from "@/assets/logosaas.png";
import Link from "next/link";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";

const SidebarContext = createContext<{ expanded: boolean } | undefined>(undefined);

const menuItems = [
  { icon: <Home size={20} />, text: "Home", href: "/", alert: true },
  { icon: <LayoutDashboard size={20} />, text: "Dashboard", href: "/dashboard" },
  { icon: <StickyNote size={20} />, text: "Projects", href: "/projects", alert: true },
  { icon: <Search size={20} />, text: "Billboard", href: "/billboard" },
  { icon: <Sparkles size={20} />, text: "AI-Generator", href: "/ai-generator" },
  { icon: <SmartphoneNfc size={20} />, text: "Campaign", href: "/campaign" },
  { icon: <Settings size={20} />, text: "Settings", href: "/settings" },
  { icon: <PlusCircle size={20} />, text: "Upgrade", href: "/upgrade" },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <aside
        className={`min-h-screen ${expanded ? "w-72" : "w-20"} transition-all duration-300 z-10 fixed top-0 left-0 flex flex-col bg-white text-black shadow-xl border-r`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo with hover effect */}
            {expanded && <Image src={Logo} alt="Logo" height={40} width={40} />}
          </div>
          {/* Toggle Button */}
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            aria-label="Toggle Sidebar"
          >
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Profile Section */}
        {loading ? (
          <div className="cursor-pointer border-b p-3 flex items-center justify-between hover:bg-gray-100 transition-colors mb-4">
            <p>Loading user data...</p>
          </div>
        ) : userData ? (
          <div
            onClick={() => router.push("/profile")}
            className="cursor-pointer border-b p-3 flex items-center justify-between hover:bg-gray-100 transition-colors mb-4"
          >
            {userData.profileImage ? (
              <Image
                src={userData.profileImage}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="bg-gray-500 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {userData.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
            {expanded && (
              <div className="ml-3">
                <h4 className="font-semibold">{userData.name || "User Name"}</h4>
                <p className="text-xs text-gray-600">{userData.email}</p>
              </div>
            )}
            <div className="ml-auto relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="p-2 rounded-full hover:bg-gray-200"
                aria-label="Open dropdown"
              >
                <MoreVertical size={20} />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 -mt-10 ml-6 bg-white border rounded-md shadow-md z-10 w-max">
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-200 w-full"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>No user data available.</p>
        )}

        {/* Sidebar Menu */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem key={item.text} {...item} />
          ))}
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  alert?: boolean;
}

const SidebarItem = ({ icon, text, href, alert = false }: SidebarItemProps) => {
  const pathname = usePathname();
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("SidebarContext must be used within a SidebarProvider");
  }

  const { expanded } = context;

  // Determine if the current route matches the item's href
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <li
        className={`relative flex items-center py-2 px-3 rounded-md cursor-pointer group transition-colors ${
          isActive
            ? "bg-[#d7e0ff] text-white"
            : "hover:bg-gray-100 text-gray-800"
        } mb-2`}
      >
        
        <span
          className={`transition-colors ${
            isActive ? "text-[#5a5acb]" : "text-gray-800"
          }`}
        >
          {icon}
        </span>

        {expanded && (
          <span
            className={`ml-3 transition-colors ${
              isActive ? "text-[#5a5acb]" : "text-gray-800"
            }`}
          >
            {text}
          </span>
        )}

        {!expanded && (
          <div
            className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-md px-2 py-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            {text}
          </div>
        )}

        {alert && <span className="absolute right-2 w-2 h-2 rounded-full bg-indigo-500"></span>}
      </li>
    </Link>
  );
};

export default Sidebar;


