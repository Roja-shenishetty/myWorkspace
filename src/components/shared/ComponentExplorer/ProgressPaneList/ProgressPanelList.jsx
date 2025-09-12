import React from "react";
import ProgressPanelListItem from "./ProgressPanelListItem";

const ProgressPanelList = ({ items }) => {
  return (
    <div className="progressPanel_list__iKZJi">
      {items.map((item, index) => (
        <ProgressPanelListItem
          key={item.id}
          {...item}
          isFirst={index === 0}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};

export default ProgressPanelList;
