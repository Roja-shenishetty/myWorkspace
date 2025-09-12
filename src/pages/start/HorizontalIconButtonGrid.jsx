import React from "react";
import { HorizontalIconTitleButton } from "./HorizontalIconTitleButton";

const GridWrapper = ({ children }) => (
  <div className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
    {children}
  </div>
);

export default function HorizontalIconButtonGrid({ items, data = {}, onChange }) {
  const selectedTitle = data.selectedTitle || "";
  console.log("Selected Title is",selectedTitle)
  const handleSelect = title => {
    onChange({ selectedTitle: title });
  };

  return (
    <GridWrapper>
      {items?.map((item, index) => (
        <HorizontalIconTitleButton
          key={`${item.title}-${index}`} // Unique key
          title={item.title}
          description={item.description}
          svgIcon={item.svg}
          selected={selectedTitle === item.title}
          onClick={() => handleSelect(item.title)}
        />
      ))}
    </GridWrapper>
  );
}
