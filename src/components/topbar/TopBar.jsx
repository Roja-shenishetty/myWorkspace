

import { NAV_ITEMS } from "./nav.config";
import PrimaryNav from "./PrimaryNav";
import LogoLink from "./atoms/LogoLink";
import SearchButton from "./atoms/SearchButton";
import MobileHamburger from "./atoms/MobileHamburger";
import { DashboardButton } from "./atoms/DashboardButton";
import UserAvatarButton from "./atoms/UserAvatarButton";

/* =======================
   Top bar container
   ======================= */

export default function TopBar() {
  return (
    <div className="hidden lg:sticky w-full lg:flex top-0 left-0 right-0 z-50">
      <nav
        aria-label="top bar"
        className="w-full z-40 flex flex-col border-b backdrop-blur backdrop-filter bg bg-opacity-75"
      >
        <div className="w-full px-5 lg:pl-10 flex justify-between h-[var(--header-height)] gap-3">
          {/* Left: Logo + Primary Nav */}
          <div className="hidden lg:flex h-full items-center justify-center gap-2">
            <LogoLink />
            <div className="flex relative gap-2 justify-start items-end w-full h-full">
              <PrimaryNav items={NAV_ITEMS} />
            </div>
          </div>

          {/* Middle/Right: mobile logo + search + hamburger */}
          <div className="w-full grow lg:w-auto flex gap-3 justify-between lg:justify-end items-center h-full">
            <div className="lg:hidden">
              <LogoLink />
            </div>
            <div className="flex gap-2 items-center">
              {/* <SearchButton /> */}
              <MobileHamburger />
            </div>
          </div>

          {/* Right: desktop buttons */}
          <div className="hidden lg:flex items-center justify-end gap-3">
            <DashboardButton />
            <UserAvatarButton />
          </div>
        </div>
      </nav>
    </div>
  );
}