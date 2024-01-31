import Link from "next/link";

const mobileMenuLinks = [
  {
    name: "home",
    link: "/",
    isWriter: false,
    isEditor: false,
    isAdmin: false,
    isOwner: false,
  },
  {
    name: "Stories",
    link: "/Stories",
    isWriter: false,
    isEditor: false,
    isAdmin: false,
    isOwner: false,
  },
  {
    name: "Vaults",
    link: "/Vaults",
    isWriter: false,
    isEditor: false,
    isAdmin: false,
    isOwner: false,
  },
];

const linkStyles = `py-2 px-3 hover:bg-blue-800 bg-blue-700 cursor-pointer`;

function MobileMenu({ setProfileMenuOpen, profileMenuOpen }: any) {
  return (
    <div className={`${profileMenuOpen ? "border-l-2 border-blue-900" : ""}`}>
      <p
        className={`${linkStyles} border-b-2 border-blue-900 `}
        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
      >
        Picture
      </p>
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
