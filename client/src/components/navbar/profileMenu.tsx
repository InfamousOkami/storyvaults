import { logOut } from "@/lib/redux/features/auth-slice";
import { AppDispatch } from "@/lib/redux/store";
import Link from "next/link";
import { useDispatch } from "react-redux";

const profileMenuLinks = [
  {
    name: "profile",
    link: "/profile",
    isWriter: false,
    isEditor: false,
    isAdmin: false,
    isOwner: false,
  },
  {
    name: "My Stories",
    link: "/MyStories",
    isWriter: true,
    isEditor: true,
    isAdmin: true,
    isOwner: true,
  },
  {
    name: "My Editing Stories",
    link: "/EditorStories",
    isWriter: false,
    isEditor: true,
    isAdmin: true,
    isOwner: true,
  },
  {
    name: "My Vaults",
    link: "/MyVaults",
    isWriter: false,
    isEditor: false,
    isAdmin: false,
    isOwner: false,
  },
  {
    name: "Settings",
    link: "/settings",
    isWriter: false,
    isEditor: false,
    isAdmin: false,
    isOwner: false,
  },
];

function ProfileMenu() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      {profileMenuLinks.map((link, i) => (
        <Link key={link.name} href={link.link}>
          <p
            className={`py-2 px-3 hover:bg-blue-800 bg-blue-700 cursor-pointer border-b-2 border-blue-900`}
          >
            {link.name}
          </p>
        </Link>
      ))}
      <p
        className="py-2 px-3 hover:bg-blue-800 bg-blue-700 cursor-pointer`"
        onClick={() => dispatch(logOut())}
      >
        Logout
      </p>
    </div>
  );
}

export default ProfileMenu;
