"use client";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import ProfileMenu from "./profileMenu";
import MobileMenu from "./mobileMenu";
import { mobileMenuLinks } from "./menuLinks";
import Link from "next/link";
import { useAppSelector } from "@/lib/redux/store";

function Navbar() {
  const token = useAppSelector((state) => state.token);
  const user = useAppSelector((state) => state.user);

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

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <div
      className={`bg-blue-600 w-full py-3 px-2 flex justify-between items-center shadow-sm shadow-blue-800 drop-shadow-lg`}
    >
      <div className="flex gap-5">
        <div className="w-[140px]">
          <p className="text-gray-50 font-bold text-2xl">
            <Link href="/">
              Story
              <span className="text-blue-900">Vaults</span>
            </Link>
          </p>
        </div>

        {/* pages */}
        <div className="hidden md:flex gap-3 text-lg text-white ">
          {mobileMenuLinks.map((link) => (
            <Link key={link.name} href={link.link}>
              <p className="hover:text-gray-800">{link.name}</p>
            </Link>
          ))}
        </div>
      </div>
      {/* Logo */}

      {/* User Links */}
      {token ? (
        <>
          <div
            className="hidden md:flex justify-end items-center gap-2 w-[140px] cursor-pointer"
            onClick={toggleProfileMenu}
          >
            <div className="rounded-full bg-black w-8 h-8 " />
            <p className="text-white">{user.username}</p>
          </div>
          <div className="hidden text-white md:block absolute right-0 top-14">
            {profileMenuOpen && (
              <div ref={profileMenuRef} className="relative  w-fit text-center">
                <ProfileMenu closeMenus={toggleMenus} />
              </div>
            )}
          </div>
        </>
      ) : (
        <Link
          className="hidden md:block text-white text-lg hover:text-blue-950"
          href="/login"
        >
          Log In
        </Link>
      )}

      {/* Mobile Menu */}
      <div className="md:hidden" onClick={toggleMenus}>
        <Bars3Icon width={30} height={30} className="text-white" />
      </div>
      <div className="absolute right-0 top-14 flex text-white md:hidden">
        {profileMenuOpen && (
          <div ref={profileMenuRef} className="relative  w-fit text-center">
            <ProfileMenu closeMenus={toggleMenus} />
          </div>
        )}
        {menuOpen && (
          <div ref={menuRef} className="relative  w-fit text-center">
            <MobileMenu
              setProfileMenuOpen={setProfileMenuOpen}
              profileMenuOpen={profileMenuOpen}
              closeMenus={toggleMenus}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
