export default function UserAvatarButton({userId="227505054"}) {
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
        src={"https://avatars.githubusercontent.com/u/"+userId+"?v=4&w=96&q=75"}
        style={{ height: "100%", width: "100%", inset: 0, color: "transparent" }}
      />
    </button>
  );
}