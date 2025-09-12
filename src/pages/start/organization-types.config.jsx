// JSON array of organization type data with title and SVG icon
export const organizationTypeItems = [
  {
    title: "School",
    id: "school",
    description: "For managing educational institutions providing primary and secondary education",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-school">
        <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"></path>
        <path d="M16 8.54V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4.54"></path>
        <path d="M12 22V12"></path>
        <path d="M4 12h16"></path>
        <path d="M4 16h16"></path>
        <path d="M4 20h16"></path>
        <path d="M4 8h16"></path>
        <path d="M6 4h12"></path>
      </svg>
    )
  },
  {
    title: "University",
    id: "university",
    description: "For managing higher education institutions offering undergraduate and postgraduate programs",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap">
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
        <path d="M22 10v6"></path>
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
      </svg>
    )
  },
  {
    title: "Training Institute",
    id: "training-institute",
    description: "For managing specialized institutions providing professional training and skill development",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-check">
        <path d="M14 22h2a2 2 0 0 0 2-2V7.5L13.169 2.95a1 1 0 0 0-.338-.271l-6.177-2.69a1 1 0 0 0-.73.019L4 3.5"></path>
        <path d="M2 18.5V22a2 2 0 0 0 2 2h1.5"></path>
        <path d="M2 13.5V2a2 2 0 0 1 2-2h1.5"></path>
        <path d="M22 13.5v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1z"></path>
        <path d="m9 10 2 2 4-4"></path>
      </svg>
    )
  },
  {
    title: "Coaching Center",
    id: "coaching-center",
    description: "For managing educational centers providing exam preparation and academic support",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-marked">
        <path d="M14 22h2a2 2 0 0 0 2-2V7.5L13.169 2.95a1 1 0 0 0-.338-.271l-6.177-2.69a1 1 0 0 0-.73.019L4 3.5"></path>
        <path d="M2 18.5V22a2 2 0 0 0 2 2h1.5"></path>
        <path d="M2 13.5V2a2 2 0 0 1 2-2h1.5"></path>
        <path d="M22 13.5v7a2 2 0 0 1-2 2h-1.5"></path>
        <path d="M22 10V2a2 2 0 0 0-2-2h-1.5"></path>
        <path d="M12 12v9"></path>
        <path d="M8 16h8"></path>
      </svg>
    )
  },
  {
    title: "Society / Colony",
    id: "society",
    description: "For managing residential communities, housing societies, and local associations",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
        <path d="M3 11l9-9 9 9"></path>
        <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"></path>
        <path d="M9 22v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"></path>
      </svg>
    )
  },
  {
    title: "Virtual School",
    id: "virtual-school",
    description: "For managing online educational institutions providing remote learning experiences",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor">
        <rect width="20" height="12" x="2" y="3" rx="2"></rect>
        <path d="M8 21h8"></path>
        <path d="M12 17v4"></path>
        <path d="m17 8 5-5"></path>
        <path d="M17 3h5v5"></path>
      </svg>
    )
  },
  {
    title: "Religious Institute",
    id: "religious-institute",
    description: "For managing religious organizations and spiritual educational institutions",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-church">
        <path d="M12 2v10"></path>
        <path d="M12 22v-5"></path>
        <path d="M3 22h18"></path>
        <path d="M6 12h12"></path>
        <path d="M9 2h6"></path>
        <path d="M9 8h6"></path>
        <path d="M9 18h6"></path>
        <path d="M3 22 6 2"></path>
        <path d="M18 22 15 2"></path>
      </svg>
    )
  },
  {
    title: "Company",
    id: "company",
    description: "For managing corporate organizations and business entities",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building">
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
        <path d="M10 6h4"></path>
        <path d="M10 10h4"></path>
        <path d="M10 14h4"></path>
        <path d="M10 18h4"></path>
      </svg>
    )
  },
  {
    title: "Family Group",
    id: "family-group",
    description: "For managing family units and small private groups for personal organization",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  },
  {
    title: "School Alumnus",
    id: "school-alumnus",
    description: "For managing school alumni associations and graduate networks",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-medal">
        <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.97l8.46-3.07a2 2 0 0 1 2.61.46l4.48 6.86"></path>
        <path d="M9.73 17l4.41-7.64a2 2 0 0 1 2.3-1.07l8.58 3.07a2 2 0 0 1 .73 3.26l-2.39 3.1"></path>
        <path d="m15 18.5 3.5 3.5"></path>
        <path d="m15 15.5 6 6"></path>
        <path d="m18 18-3-3"></path>
        <circle cx="18.5" cy="5.5" r="2.5"></circle>
      </svg>
    )
  }
];