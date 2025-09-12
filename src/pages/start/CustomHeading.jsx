
export default function CustomHeading({ title, textSize = "text-xl md:text-2xl" }) {
  return (
    <section
      className="min-h-20 py-4 pb-3 sm:pb-5 flex justify-start w-full"
      role="region"
      aria-labelledby="hear-about-label"
    >
      <div className="w-full" style={{ opacity: 1 }}>
        <h5
          id="hear-about-label"
          className={`font-medium text-left ${textSize}`}
        >
          {title}
        </h5>
      </div>
    </section>
  );
}
