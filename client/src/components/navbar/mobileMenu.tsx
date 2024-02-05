"use client";
import Link from "next/link";
import { mobileMenuLinks } from "./menuLinks";
import { useAppSelector } from "@/lib/redux/store";

const linkStyles = `py-2 px-3 hover:bg-blue-800 bg-blue-700 cursor-pointer`;

function MobileMenu({ setProfileMenuOpen, profileMenuOpen }: any) {
  const token = useAppSelector((state) => state.token);
  const user = useAppSelector((state) => state.user);

  return (
    <div className={`${profileMenuOpen ? "border-l-2 border-blue-900" : ""}`}>
      {token ? (
        <div
          className={`${linkStyles} py-1 border-b-2 border-blue-900 flex gap-1 justify-center items-center`}
        >
          <div className="rounded-full bg-black w-8 h-8 " />
          <p onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
            {user.username}
          </p>
        </div>
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
