
/* =======================
   Data model for the menu
   ======================= */

// components/topbar/nav.config.js

export const NAV_ITEMS = [
  { type: "link", label: "Start", href: "/start" },

  {
    type: "menu",
    label: "Products",
    align: "start",          // 'start' | 'end' | 'center' (optional)
    singleColumn: true,     // force single column if true (optional)
    columns: [
      {
        title: "Products",
        links: [
           { label: "iLearn ", href: "/" },
          { label: "SquizMe (Coming Soon)", href: "/squizme" },
          { label: "SocioConclave (Coming Soon)", href: "/conclave" }         
        ],
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
        links: [{ label: "Guides", href: "/guides" }],
      },
      {
        title: "Community",
        links: [{ label: "GitHub", href: "https://github.com/ilearnwithai" }],
      },
    ],
  },
];
