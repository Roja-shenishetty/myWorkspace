import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "./Dropdown";

function isExternal(href) {
  return /^https?:\/\//i.test(href);
}

export default function PrimaryNav({ items = [] }) {
  return (
    <nav aria-label="Main" className="relative z-10 flex-1 items-center w-full flex justify-start h-full">
      <ul className="group flex flex-1 list-none items-center justify-center px-6 space-x-2 h-[var(--header-height)]" dir="ltr">
        {items.map((item) => (
          <li key={item.label} className="text-sm relative h-full">
            {item.type === "link" ? (
              isExternal(item.href) ? (
                <a
                  href={item.href}
                  target={item.target || "_self"}
                  rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center justify-center text-sm hover:bg-accent w-max p-2 bg-transparent border-0 border-b-2 border-transparent font-normal rounded-none text-foreground-light hover:text-foreground h-full focus-visible:rounded transition-all focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-brand-600"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  to={item.href.startsWith("/") ? item.href.replace(/^\//, "") : item.href}
                  className="inline-flex items-center justify-center text-sm hover:bg-accent w-max p-2 bg-transparent border-0 border-b-2 border-transparent font-normal rounded-none text-foreground-light hover:text-foreground h-full focus-visible:rounded transition-all focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-brand-600"
                >
                  {item.label}
                </Link>
              )
            ) : (
              <Dropdown
                label={item.label}
                align={item.align || "start"}
                singleColumn={!!item.singleColumn}
                panelClassName={item.panelClassName}
                buttonClassName={item.buttonClassName}
              >
                <div className={item.singleColumn ? "" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                  {item.columns?.map((col) => (
                    <div key={col.title || Math.random()}>
                      {col.title ? (
                        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                          {col.title}
                        </div>
                      ) : null}

                      <ul className="space-y-1">
                        {col.links?.map((l) => {
                          const inner = l.icon ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="shrink-0">{l.icon}</span>
                              <span>{l.label}</span>
                            </span>
                          ) : (
                            l.label
                          );

                          return (
                            <li key={l.label}>
                              {isExternal(l.href) ? (
                                <a
                                  href={l.href}
                                  target={l.target || "_self"}
                                  rel={l.target === "_blank" ? "noopener noreferrer" : undefined}
                                  className="block px-2 py-1 rounded text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition"
                                >
                                  {inner}
                                </a>
                              ) : (
                                <Link
                                  to={l.href.startsWith("/") ? l.href.replace(/^\//, "") : l.href}
                                  className="block px-2 py-1 rounded text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition"
                                >
                                  {inner}
                                </Link>
                              )}
                            </li>
                          );
                        })}
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
