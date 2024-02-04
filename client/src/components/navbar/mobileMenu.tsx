"use client";
import Link from "next/link";
import { mobileMenuLinks } from "./menuLinks";
import { useAppSelector } from "@/lib/redux/store";

const linkStyles = `py-2 px-3 hover:bg-blue-800 bg-blue-700 cursor-pointer`;

function MobileMenu({ setProfileMenuOpen, profileMenuOpen }: any) {
  const token = useAppSelector((state) => state.token);

  return (
    <div className={`${profileMenuOpen ? "border-l-2 border-blue-900" : ""}`}>
      {token ? (
        <p
          className={`${linkStyles} border-b-2 border-blue-900 `}
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        >
          Profile
        </p>
      ) : (
        <Link href="/login">
          <p
            className={`py-2 px-3 hover:bg-blue-800 bg-blue-700 cursor-pointer border-b-2 border-blue-900 `}
          >
            Log In
          </p>
        </Link>
      )}
      {mobileMenuLinks.map((link, i) => (
        <Link key={link.name} href={link.link}>
          <p
            className={`${linkStyles} ${
              i === mobileMenuLinks.length - 1
                ? ``
                : `border-b-2 border-blue-900`
            }`}
          >
            {link.name}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default MobileMenu;