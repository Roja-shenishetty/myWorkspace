
/* =======================
   Data model for the menu
   ======================= */

// components/topbar/nav.config.js

export const NAV_ITEMS = [
  { type: "link", label: "Start", href: "/docs/guides/getting-started" },

  {
    type: "menu",
    label: "Products",
    align: "start",          // 'start' | 'end' | 'center' (optional)
    singleColumn: true,     // force single column if true (optional)
    columns: [
      {
        title: "Products",
        links: [
          { label: "Squizme", href: "/squizme" },
          { label: "Conclave", href: "/conclave" },
          { label: "LMS", href: "/lms" },
        ],
      },     
    ],
  },

  {
    type: "menu",
    label: "Build",
    align: "center",
    columns: [
      {
        title: "SDKs",
        links: [{ label: "JavaScript", href: "/docs/reference/javascript" }],
      },
      {
        title: "CLI",
        links: [{ label: "Supabase CLI", href: "/docs/guides/cli" }],
      },
    ],
  },

  {
    type: "menu",
    label: "Manage",
    align: "end",
    columns: [
      {
        title: "Projects",
        links: [{ label: "Dashboard", href: "https://supabase.com/dashboard" }],
      },
      {
        title: "Security",
        links: [
          { label: "Policies (RLS)", href: "/docs/guides/auth/row-level-security" },
        ],
      },
    ],
  },

  {
    type: "menu",
    label: "Reference",
    columns: [
      {
        title: "API",
        links: [{ label: "REST", href: "/docs/reference/rest" }],
      },
      {
        title: "SQL",
        links: [{ label: "SQL Reference", href: "/docs/reference/sql" }],
      },
    ],
  },

  {
    type: "menu",
    label: "Resources",
    singleColumn: true, // make this one a single-column menu
    columns: [
      {
        title: "Learn",
        links: [{ label: "Guides", href: "/docs/guides" }],
      },
      {
        title: "Community",
        links: [{ label: "GitHub", href: "https://github.com/supabase" }],
      },
    ],
  },
];
