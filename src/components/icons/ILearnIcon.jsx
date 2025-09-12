import { SvgIcon } from "@mui/material";

export default function LearnIcon(props) {
  return (
    <SvgIcon
      {...props}   fill="#00AF89" 
      viewBox="0 0 500 500" // adjust based on your SVG’s coordinate system
    >
      {/* Paste your SVG groups and paths here */}
      <g   fill="#00AF89" stroke="#000" transform="matrix(1.510702, 0, 0, 1.376031, 250.629415, 249.929876)">
        <g transform="matrix(1 0 0 1 -12.41 91.27)">
          <path   fill="#00AF89" d="M 398.000061 605.691162 ... 510.180359 627.328796 506.713654 622.810669 z" />
        </g>
        <g transform="matrix(1 0 0 1 64.46 -78.28)">
          <path   fill="#00AF89" d="M 622.853027 532.040894 ... 525.854797 357.307465 C 525.367981 359.374054 526.993652 359.74118 529.303101 359.815247 z" />
        </g>
        {/* Add the rest of your <g> and <path> elements here */}
      </g>

      {/* Book icon group */}
      <g transform="matrix(0.432516, 0, 0, 0.413035, -79.92428, 118.890498)">
        <g transform="matrix(18.252405, -0.032221, 0.038852, 22.008505, 470.054819, 337.685493)">
          <path
            d="M15 2a7.65 7.65 0 0 0-5 2 7.65 7.65 0 0 0-5-2H1v15h4a7.65 7.65 0 0 1 5 2 7.65 7.65 0 0 1 5-2h4V2zm2.5 13.5H14a4.38 4.38 0 0 0-3 1V5s1-1.5 4-1.5h2.5z"
            fill="#00AF89"
          />
          <path d="M9 3.5h2v1H9z" fill="#00AF89" />
        </g>
      </g>
    </SvgIcon>
  );
}
