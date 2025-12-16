/* =======================
   Small, focused atoms
   ======================= */

export default function LogoLink({imageFileName='/app-logo.svg', linkUrl="/", appName='iLearn'}) {
  return (
    <a
      href={linkUrl}
      className="relative justify-center cursor-pointer space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all 
      outline-0 
      focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground bg-alternative dark:bg-muted hover:bg-selection border-strong hover:border-stronger 
      focus-visible:outline-brand-600 data-[state=open]:bg-selection 
      data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover 
      flex shrink-0 
      items-center w-fit 
      !bg-transparent !border-none !shadow-none"
    >
     <img src={imageFileName} alt="Logo" />
      <span className="font-mono text-sm font-medium text-brand-link mb-px">
        {appName}
      </span>
    </a>
  );
}