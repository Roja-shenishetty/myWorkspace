// JSON array of user account type data with title and SVG icon
export const userAccountTypeItems = [
  {
    title: "Teacher",
    id: "teacher",
    description: "For educators who want to create and manage courses",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open">
        <path d="M14 22h2a2 2 0 0 0 2-2V7.5L13.169 2.95a1 1 0 0 0-.338-.271l-6.177-2.69a1 1 0 0 0-.73.019L4 3.5"></path>
        <path d="M2 18.5V22a2 2 0 0 0 2 2h1.5"></path>
        <path d="M2 13.5V2a2 2 0 0 1 2-2h1.5"></path>
        <path d="M22 13.5v7a2 2 0 0 1-2 2h-1.5"></path>
        <path d="M22 10V2a2 2 0 0 0-2-2h-1.5"></path>
      </svg>
    )
  },
  {
    title: "Anonymous Student",
    id: "anonymous-student",
    description: "For students who want to learn without creating a full account",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-question">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M18 21v-4"></path>
        <path d="M16 19h4"></path>
      </svg>
    )
  },
  {
    title: "Student",
    id: "student",
    description: "For registered students who want to enroll in courses and track progress",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    )
  },
  {
    title: "Guest",
    id: "guest",
    description: "For temporary access to explore courses and content",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <polyline points="16 11 18 13 22 9"></polyline>
      </svg>
    )
  }
];