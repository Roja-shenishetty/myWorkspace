export const HorizontalIconTitleButton = ({ title, description, svgIcon, selected, onClick }) => {
  return (
    <div className="flex min-h-[5.5rem] sm:min-h-[5.625rem]">
      <button
        aria-label={title}
        tabIndex={0}
        onClick={() => {
          console.log(`${title} clicked`);
          onClick(title);
        }}
        className={`transition duration-200 w-full h-full cursor-pointer group stack items-center border rounded-t-[18px] rounded-b-[16px]
          border-gray-alpha-300 outline-none focus-visible:ring-ring focus-visible:ring-offset-2 ring-ring ring-offset-2
          hover:border-gray-alpha-950 focus-visible:border-gray-alpha-950
          hover:bg-saffron-lite transition-colors duration-300
          ${selected ? "border-blue-600 bg-blue-100 font-semibold" : ""}
        `}
        style={{ "--tw-ring-offset-color": "white" }}
      >
        <div className="stack gap-2 w-full">
          <div className="flex flex-col overflow-hidden flex-1 stack gap-1 sm:gap-2 items-start justify-start duration-200 w-full pt-3.5 sm:pt-[0.425rem] pb-3 px-3.5 sm:pb-1 sm:px-5">
            <div className="transition duration-200 [&_svg]:w-[1.125rem] [&_svg]:h-[1.125rem]">{svgIcon}</div>
            <div className="text-left">
              <p className="text-sm font-medium mt-2.5">{title}</p>
              {description && (
                <p className="text-xs mt-2.5 mb-1.5">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
