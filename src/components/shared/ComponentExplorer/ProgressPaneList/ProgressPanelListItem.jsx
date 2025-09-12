import React from "react";

const ProgressPanelListItem = ({ label, checked, active, onClick, isFirst, isLast }) => {
  return (
    <div>
      <button
        className={`progressPanel_devButton__TM_DL`}
        onClick={onClick}
        style={{ cursor: onClick ? "pointer" : "default" }}
      >
        <div
          className={`progressPanelListItem_root__gx1OT progressPanelListItem_progress__kE9qE progressPanelListItem_hasTheme__BC0Xe ${active ? "progressPanelListItem_active__b2RyG" : ""}`}
          style={active ? { backgroundColor: "#fff", color: "rgb(8, 18, 41)" } : {}}
        >
          <div className="progressPanelListItem_iconWrapper__2Cjyw">
            {!isFirst && <span className="progressPanelListItem_dotStart__eRudi" style={{ borderColor: "rgb(8, 18, 41)" }} />}
            
            <span
              className="progressPanelListItem_icon__KDgcE"
              style={{
                backgroundColor: checked ? "rgb(8, 18, 41)" : "#fff",
                color: checked ? "#fff" : "rgb(8, 18, 41)"
              }}
            >
              {checked && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <title>Check</title>
                  <path
                    d="M5 13L9 17L19 7"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>

            {!isLast && <span className="progressPanelListItem_dotEnd__1rZW3" style={{ borderColor: "rgb(8, 18, 41)" }} />}
          </div>

          <div className="progressPanelListItem_wrapper__mI9Ls">
            <p
              className="progressPanelListItem_text__hxf3I"
              style={{ fontSize: 14, color: "rgb(8, 18, 41)" }}
            >
              {label}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ProgressPanelListItem;
