// TopBar.jsx
import React, { useEffect, useRef, useState } from "react";

/* =======================
   Small, focused atoms
   ======================= */

function LogoLink() {
  return (
    <a
      href="/docs"
      className="relative justify-center cursor-pointer space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground bg-alternative dark:bg-muted hover:bg-selection border-strong hover:border-stronger focus-visible:outline-brand-600 data-[state=open]:bg-selection data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover flex shrink-0 items-center w-fit !bg-transparent !border-none !shadow-none"
    >
      <img
        alt="Supabase wordmark"
        loading="eager"
        width="96"
        height="18"
        decoding="async"
        className="hidden dark:block !m-0"
        src="/docs/supabase-dark.svg"
        style={{ color: "transparent" }}
      />
      <img
        alt="Supabase wordmark"
        loading="eager"
        width="96"
        height="18"
        decoding="async"
        className="block dark:hidden !m-0"
        src="/docs/supabase-light.svg"
        style={{ color: "transparent" }}
      />
      <span className="font-mono text-sm font-medium text-brand-link mb-px">
        DOCS
      </span>
    </a>
  );
}

function SearchButton() {
  return (
    <button
      type="button"
      title="Search"
      className="px-4 py-2 whitespace-nowrap border-input text-sm font-medium hover:bg-accent hover:text-accent-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group flex-grow md:w-44 xl:w-56 h-[30px] rounded-md pl-1.5 md:pl-2 pr-1 flex items-center justify-between bg-surface-100/75 text-foreground-lighter border hover:bg-opacity-100 hover:border-strong focus-visible:!outline-4 focus-visible:outline-offset-1 focus-visible:outline-brand-600 transition"
      aria-haspopup="dialog"
      aria-expanded="false"
      aria-controls="command-menu-dialog-content"
    >
      <div className="flex items-center space-x-2 text-foreground-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <p className="flex text-sm pr-2">
          Search<span className="hidden xl:inline ml-1"> docs...</span>
        </p>
      </div>
      <div className="hidden md:flex items-center space-x-1">
        <div
          aria-hidden
          className="md:flex items-center justify-center h-full px-1 border rounded bg-surface-300 gap-0.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-command"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <span className="text-[12px]">K</span>
        </div>
      </div>
    </button>
  );
}

function MobileHamburger() {
  return (
    <button
      type="button"
      title="Menu"
      className="relative justify-center cursor-pointer items-center space-x-2 text-center font-regular ease-out duration-200 outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border dark:bg-muted hover:bg-selection hover:border-stronger focus-visible:outline-brand-600 data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover flex lg:hidden border-default bg-surface-100/75 text-foreground-light rounded-md min-w-[30px] w-[30px] h-[30px] data-[state=open]:bg-overlay-hover/30"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-menu"
      >
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    </button>
  );
}

function DashboardButton() {
  return (
    <a
      href="https://supabase.com/dashboard"
      target="_blank"
      rel="noreferrer noopener"
      className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-brand-400 dark:bg-brand-500 hover:bg-brand/80 dark:hover:bg-brand/50 text-foreground border-brand-500/75 dark:border-brand/30 hover:border-brand-600 dark:hover:border-brand focus-visible:outline-brand-600 data-[state=open]:bg-brand-400/80 dark:data-[state=open]:bg-brand-500/80 data-[state=open]:outline-brand-600 text-xs px-2.5 py-1 h-[30px]"
      data-size="tiny"
    >
      <span className="truncate">Dashboard</span>
    </a>
  );
}

function UserAvatarButton() {
  return (
    <button
      type="button"
      title="User menu"
      className="flex relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 outline-none outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border dark:bg-muted hover:bg-selection focus-visible:outline-brand-600 text-foreground-light border-default w-[30px] min-w-[30px] h-[30px] hover:border-strong bg-transparent rounded-full overflow-hidden"
      aria-haspopup="menu"
      aria-expanded="false"
    >
      <img
        alt="user"
        loading="lazy"
        decoding="async"
        className="object-cover object-center"
        sizes="30px"
        src="/docs/_next/image?url=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F14027317%3Fv%3D4&w=96&q=75"
        style={{ height: "100%", width: "100%", inset: 0, color: "transparent" }}
      />
    </button>
  );
}

/* =======================
   Reusable dropdown
   ======================= */

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    function listener(e) {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    }
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

function ChevronDown({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-chevron-down ${className}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Dropdown({ label, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative h-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`group inline-flex items-center justify-center text-sm focus:outline-none focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none hover:bg-accent data-[state=open]:bg-accent/50 data-[active]:bg-accent/50 w-max p-2 bg-transparent border-0 border-b-2 border-transparent font-normal rounded-none text-foreground-light hover:text-foreground h-full focus-visible:rounded !shadow-none outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-brand-600`}
      >
        {label}
        <ChevronDown className={`relative top-[1px] ml-1 h-3 w-3 transition duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute left-0 top-full mt-2 min-w-[16rem] bg-background/90 backdrop-blur border shadow-lg rounded-md p-3 z-50">
          {children}
        </div>
      )}
    </div>
  );
}

/* =======================
   Primary navigation
   ======================= */

function PrimaryNav({ items }) {
  return (
    <nav
      aria-label="Main"
      className="relative z-10 flex-1 items-center w-full flex justify-start h-full"
    >
      <ul
        className="group flex flex-1 list-none items-center justify-center px-6 space-x-2 h-[var(--header-height)]"
        dir="ltr"
      >
        {items.map((item) => (
          <li key={item.label} className="text-sm relative h-full">
            {item.type === "link" ? (
              <a
                href={item.href}
                className="inline-flex items-center justify-center text-sm focus:outline-none focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none hover:bg-accent data-[state=open]:bg-accent/50 data-[active]:bg-accent/50 group w-max p-2 bg-transparent border-0 border-b-2 border-transparent font-normal rounded-none text-foreground-light hover:text-foreground h-full focus-visible:rounded !shadow-none outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-brand-600"
              >
                {item.label}
              </a>
            ) : (
              <Dropdown label={item.label}>
                {/* Simple 2-column grid for dropdown content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.columns.map((col) => (
                    <div key={col.title}>
                      <div className="text-xs uppercase tracking-wide text-foreground-muted mb-1">
                        {col.title}
                      </div>
                      <ul className="space-y-1">
                        {col.links.map((l) => (
                          <li key={l.label}>
                            <a
                              href={l.href}
                              className="text-sm text-foreground-light hover:text-foreground inline-flex items-center gap-2 py-1"
                            >
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Dropdown>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* =======================
   Data model for the menu
   ======================= */

const NAV_ITEMS = [
  { type: "link", label: "Start", href: "/docs/guides/getting-started" },
  {
    type: "menu",
    label: "Products",
    columns: [
      {
        title: "Databases",
        links: [
          { label: "Postgres", href: "/docs/guides/database" },
          { label: "Edge Functions", href: "/docs/guides/functions" },
        ],
      },
      {
        title: "Auth & Realtime",
        links: [
          { label: "Auth", href: "/docs/guides/auth" },
          { label: "Realtime", href: "/docs/guides/realtime" },
        ],
      },
    ],
  },
  {
    type: "menu",
    label: "Build",
    columns: [
      { title: "SDKs", links: [{ label: "JavaScript", href: "/docs/reference/javascript" }] },
      { title: "CLI", links: [{ label: "Supabase CLI", href: "/docs/guides/cli" }] },
    ],
  },
  {
    type: "menu",
    label: "Manage",
    columns: [
      { title: "Projects", links: [{ label: "Dashboard", href: "https://supabase.com/dashboard" }] },
      { title: "Security", links: [{ label: "Policies (RLS)", href: "/docs/guides/auth/row-level-security" }] },
    ],
  },
  {
    type: "menu",
    label: "Reference",
    columns: [
      { title: "API", links: [{ label: "REST", href: "/docs/reference/rest" }] },
      { title: "SQL", links: [{ label: "SQL Reference", href: "/docs/reference/sql" }] },
    ],
  },
  {
    type: "menu",
    label: "Resources",
    columns: [
      { title: "Learn", links: [{ label: "Guides", href: "/docs/guides" }] },
      { title: "Community", links: [{ label: "GitHub", href: "https://github.com/supabase" }] },
    ],
  },
];

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
              <SearchButton />
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
