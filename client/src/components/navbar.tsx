import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavbarProps {
  showSearch?: boolean;
  currentUser?: {
    name: string;
    avatar: string;
  };
  onSearchChange?: (value: string) => void;
  onProfileClick?: () => void;
}

export default function Navbar({
  showSearch = true,
  currentUser = {
    name: "You",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
  },
  onSearchChange,
  onProfileClick,
}: NavbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleProfileClick = () => {
    onProfileClick?.();
    // Navigate to profile page
    navigate("/profile");
  };

  const handleLogoClick = () => {
    // Navigate to home if we're authenticated, otherwise to landing
    if (location.pathname === "/home") {
      // Refresh or scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/home");
    }
  };

  // Determine page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/home":
        return "Find New Match";
      case "/profile":
        return "My Profile";
      case "/settings":
        return "Settings";
      case "/hints":
        return "Hints";
      case "/chats":
        return "Messages";
      default:
        return "Snugglr";
    }
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200/80 dark:border-slate-800/80 px-6 lg:px-10 py-3 bg-background-light dark:bg-background-dark flex-shrink-0 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          aria-label="Go to home"
        >
          <div className="h-8 w-8 text-primary">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold hidden sm:block">Snugglr</h2>
        </button>

        {/* Page Title on Mobile */}
        <h1 className="text-lg font-bold sm:hidden">{getPageTitle()}</h1>
      </div>

      <div className="flex flex-1 justify-end gap-3 lg:gap-4 items-center">
        {/* Search Bar */}
        {showSearch && (
          <label className="relative hidden md:block max-w-md flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
              search
            </span>
            <input
              className="form-input flex w-full min-w-0 resize-none overflow-hidden rounded-full border-2 border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary h-10 placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-10 pr-4 text-sm font-normal"
              placeholder="Search & Explore"
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </label>
        )}

        {/* Mobile Search Button */}
        {showSearch && (
          <button
            className="flex md:hidden h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-slate-300/70 dark:hover:bg-slate-700/70 transition-colors"
            aria-label="Search"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
        )}

        {/* Notifications removed - now in Home sidebar */}

        {/* Profile Avatar */}
        <button
          onClick={handleProfileClick}
          className="h-10 w-10 bg-center bg-no-repeat aspect-square bg-cover rounded-full cursor-pointer hover:ring-2 hover:ring-primary transition-all flex-shrink-0"
          style={{ backgroundImage: `url(${currentUser.avatar})` }}
          aria-label="Profile"
        />
      </div>

      {/* No backdrop needed since notifications dropdown is removed */}
    </header>
  );
}
