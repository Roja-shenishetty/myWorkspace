function DeviceToolbarIcon({ size = 20, color="black", ...props}) {
  // Size can be 16–24 for crisp icon
  return (
  <svg
      width={size}
      height={size * 27 / 36} // keep aspect ratio
      viewBox="0 0 36 27"
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      {/* Laptop: L-shape (bottom left corner to top left, then to right) */}
      <polyline points="6,21 6,7 21,7" />
      {/* Laptop base */}
      <line x1="8" y1="23" x2="14" y2="23" />
      {/* Small stroke protruding at bottom-left */}
      <line x1="7" y1="26" x2="17" y2="26" />
      {/* Mobile device (moved slightly left, not flush right) */}
      <rect x="17" y="11" width="8" height="12" rx="2" />
            <line x1="18" y1="20" x2="24" y2="20" />

    </svg>
  );
}

export default DeviceToolbarIcon;
