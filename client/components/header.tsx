"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  MapPin,
  Castle,
  Users,
  User,
  LogIn,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const session = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = session.data?.user
    ? [
        { name: "Map", icon: MapPin, href: "/map" },
        // { name: "Castles", icon: Castle, href: "/castles" },
        { name: "Heroes", icon: Users, href: "/heroes" },
        {
          name: "Sign out",
          icon: LogOut,
          onClick: () => signOut(),
          href: "#",
        },
      ]
    : [
        {
          name: "Sign In",
          icon: LogIn,
          href: "/login",
        },
        { name: "Sign Up", icon: User, href: "/register" },
      ];

  const logoSrc = mounted
    ? `/elementium-logo${theme === "dark" ? "-dark" : "-light"}.png`
    : "/elementium-logo-light.png";

  return (
    <header className=" shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <img src={logoSrc} alt="Elementium Logo" className="h-8" />
            </Link>
          </div>
          <nav className="hidden md:block">
            <ul className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={item.onClick}
                    className="flex items-center text-primary px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 transition duration-150 ease-in-out"
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={theme !== "light"}
                  onCheckedChange={() =>
                    setTheme(theme === "light" ? "dark" : "light")
                  }
                />
                <Moon className="h-4 w-4" />
              </li>
            </ul>
          </nav>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                  setIsMenuOpen(false);
                }}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500 transition duration-150 ease-in-out"
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-3 py-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
