export default function MobileHamburger() {
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