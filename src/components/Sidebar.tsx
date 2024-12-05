"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Image from "next/image";
import {
  Home,
  LayoutDashboard,
  StickyNote,
  Calendar,
  Layers,
  Flag,
  Settings,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  PlusCircle,
  LogOut,
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
  { icon: <LayoutDashboard size={20} />, text: "Dashboard", href: "/dashboard", active: true },
  { icon: <StickyNote size={20} />, text: "Projects", href: "/projects", alert: true },
  { icon: <Calendar size={20} />, text: "Calendar", href: "/calendar" },
  { icon: <Layers size={20} />, text: "Tasks", href: "/tasks" },
  { icon: <Flag size={20} />, text: "Reporting", href: "/reporting" },
  { icon: <Settings size={20} />, text: "Settings", href: "/settings" },
  { icon: <PlusCircle size={20} />, text: "Upgrade", href: "/upgrade" },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [userData, setUserData] = useState<any>(null); // State to store user data
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
      setLoading(false); // Stop loading regardless of success/failure
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is signed in:", user);
        fetchUserData(user.uid); // Fetch user data with correct UID
      } else {
        console.log("No user is signed in.");
        setUserData(null); // Clear state if no user
      }
    });
  
    return () => unsubscribe(); // Cleanup listener
  }, []);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      router.push("/")
      // Redirect to login page or show a logout confirmation
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <SidebarContext.Provider value={{ expanded }}>
      <aside className={`h-screen transition-all duration-300 z-10  fixed md:static flex flex-col bg-white shadow-sm border-r`}>
        <div className="p-4 flex justify-between items-center">
          <Image src={Logo} alt="SaaS Logo" height={40} width={40} />
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
            aria-label="Toggle Sidebar"
          >
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <SidebarItem key={item.text} {...item} />
          ))}
        </nav>
        {/* {auth.currentUser && (
          <UserProfile userData={userData} expanded={expanded} />
        )} */}

        {loading ? (
          <p>Loading user data...</p>
        ) : userData ? (
          <div onClick={() => router.push("/profile")} className="cursor-pointer border-t p-3 flex items-center">
            {userData.profileImage ? (
              <Image
                src={userData.profileImage}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
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
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Open dropdown"
              >
                <MoreVertical size={20} />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 -mt-10 ml-6 bg-white border rounded-md shadow-md z-10">
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
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
      </aside>
    </SidebarContext.Provider>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  active?: boolean;
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
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
      >
        {icon}
        {expanded && <span className="ml-3">{text}</span>}
        {alert && <span className="absolute right-2 w-2 h-2 rounded-full bg-indigo-400"></span>}
      </li>
    </Link>
  );
};

export default Sidebar
