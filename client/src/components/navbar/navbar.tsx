"use client";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import ProfileMenu from "./profileMenu";
import MobileMenu from "./mobileMenu";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideMenu =
        menuRef.current && !menuRef.current.contains(event.target as Node);
      const isOutsideProfileMenu =
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node);

      if (menuOpen && isOutsideMenu) {
        setMenuOpen(false);
      }

      if (profileMenuOpen && isOutsideProfileMenu) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen, profileMenuOpen, menuRef, profileMenuRef]);

  const toggleMenus = () => {
    if (menuOpen || profileMenuOpen) {
      setMenuOpen(false);
      setProfileMenuOpen(false);
    } else {
      setMenuOpen(!menuOpen);
    }
  };

  return (
    <div
      className={`bg-blue-600 w-full py-3 px-2 flex justify-between items-center`}
    >
      {/* Logo */}
      <div>
        <p className="text-gray-50 font-bold text-2xl">
          Story
          <span className="text-blue-900">Vaults</span>
        </p>
      </div>

      {/* pages */}
      <div className="hidden md:block"> pages</div>

      {/* User Links */}
      <div className="hidden md:block">user</div>

      {/* Mobile Menu */}
      <div className="md:hidden" onClick={toggleMenus}>
        <Bars3Icon width={30} height={30} className="text-white" />
      </div>
      <div className="absolute right-0 top-14 flex text-white md:hidden">
        {profileMenuOpen && (
          <div ref={profileMenuRef} className="relative  w-fit text-center">
            <ProfileMenu />
          </div>
        )}
        {menuOpen && (
          <div ref={menuRef} className="relative  w-fit text-center">
            <MobileMenu
              setProfileMenuOpen={setProfileMenuOpen}
              profileMenuOpen={profileMenuOpen}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
