// ShowCaseRow.jsx
import * as React from "react";
import {
  Box, Card, CardActionArea, CardContent, Typography, Stack, Avatar, IconButton
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Grid as SwiperGrid, Autoplay, FreeMode, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";

/** Utils */
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function ChangeChip({ change = 0, pct = 0 }) {
  const positive = change > 0 || pct > 0;
  const negative = change < 0 || pct < 0;
  const color = positive ? "success.main" : negative ? "error.main" : "text.secondary";
  const Icon = positive ? TrendingUpIcon : negative ? TrendingDownIcon : React.Fragment;

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {Icon !== React.Fragment && <Icon sx={{ fontSize: 16, color }} />}
      <Typography variant="caption" sx={{ color }}>
        {change ? `${change > 0 ? "+" : ""}${inr.format(Math.abs(change))}` : "0.00"} ({pct ? `${pct > 0 ? "+" : ""}${pct.toFixed(2)}%` : "0.00%"})
      </Typography>
    </Stack>
  );
}

/**
 * Props:
 * - variant: "row-slider" | "rows-slider" | "two-col-infinite"
 * - rows: number (for "rows-slider", defaults to 2)
 * - breakpoints, loop, autoplay, spaceBetween, title, onSeeMore
 * - showArrows, arrowsOnHover, arrowButtonSize, arrowIconSize, arrowOffset
 */
export default function ShowCaseRow({
  items = [],
  title = "Most Important",
  variant = "row-slider",
  rows = 2,
  breakpoints,
  loop,
  autoplay,
  cardHeight = 350,
  spaceBetween = 12,
  onSeeMore,
  showArrows = false,
  arrowsOnHover = true,
  arrowButtonSize = 36,
  arrowIconSize = 20,
  arrowOffset = 8,
}) {
  const prevRef = React.useRef(null);
  const nextRef = React.useRef(null);
  const swiperRef = React.useRef(null);

  const defaultBreakpoints =
    breakpoints ||
    (variant === "row-slider"
      ? { 0: { slidesPerView: 1.2 }, 360: { slidesPerView: 1 }, 520: { slidesPerView: 2 }, 900: { slidesPerView: 3 }, 1200:{ slidesPerView:4} }
      : variant === "rows-slider"
      ? { 0: { slidesPerView: 2 }, 600: { slidesPerView: 3 }, 900: { slidesPerView: 4 } }
      : { 0: { slidesPerView: 2 }, 900: { slidesPerView: 2 } });

  const enableGrid = variant === "rows-slider";
  const enableLoop = variant === "two-col-infinite" ? true : Boolean(loop);
  const enablePagination = variant !== "two-col-infinite";

  const autoplayConfig = autoplay
    ? { delay: typeof autoplay === "number" ? autoplay : 3800, disableOnInteraction: false }
    : false;

  // ✅ Bind custom IconButtons after both refs and swiper exist
  React.useEffect(() => {
    if (!showArrows) return;
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    // Rebind navigation to custom elements
    swiper.params.navigation = {
      ...(swiper.params.navigation || {}),
      prevEl: prevRef.current,
      nextEl: nextRef.current,
    };
    // (Re)initialize navigation
    if (swiper.navigation) {
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [showArrows, items.length, variant, rows]);

  return (
    <Box sx={{ position: "relative" }}>
      <Typography variant="h6" sx={{ mb: 1.5 }}>
        {title}
      </Typography>

      <Swiper
        modules={[Navigation, Pagination, SwiperGrid, Autoplay, FreeMode, A11y]}
        // Turn off default arrows; we'll use custom buttons
        navigation={false}
        pagination={enablePagination ? { clickable: true } : false}
        freeMode={variant === "row-slider"}
        loop={enableLoop && !enableGrid}
        autoplay={autoplayConfig}
        spaceBetween={spaceBetween}
        breakpoints={defaultBreakpoints}
        grid={enableGrid ? { rows, fill: "row" } : undefined}
        style={{ paddingBottom: enablePagination ? 24 : 0 }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {items.map((item, i) => {
          const key = item.id ?? i;
          return (
            <SwiperSlide key={key} style={{ height: enableGrid ? "auto" : undefined }}>
              {item.more ? (
                <Card variant="outlined" sx={{ height: 132 }}>
                  <CardActionArea onClick={onSeeMore ?? item.onClick} sx={{ height: "100%" }} aria-label="See more">
                    <CardContent
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography fontWeight={700}>See more</Typography>
                        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Explore all
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ) : (
                <Card variant="outlined" sx={{ height: cardHeight }}>
                  <CardActionArea onClick={item.onClick} sx={{ height: "100%" }}>
                    <CardContent
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Stack direction="column" alignItems="center" spacing={0}>
                        <Avatar src={item.logoUrl || undefined} alt={item.title} 
                         sx={{ width: 200, height: 200, fontWeight: 700 }}>
                          {item.title?.[0] ?? "⋯"}
                        </Avatar>
                        <Typography fontWeight={700} sx={{ flex: 1 }} noWrap>
                          {item.title}
                        </Typography>
                         <Box sx={{ mt: "auto" }}>
                        <Typography fontWeight={500} sx={{mt:2}}>
                         {item.description}
                        </Typography>
                      </Box>
                      </Stack>

                     
                    </CardContent>
                  </CardActionArea>
                </Card>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {showArrows && (
        <>
          <IconButton
            ref={prevRef}
            className="sc-nav"
            aria-label="Previous"
            sx={{
              position: "absolute",
              top: "50%",
              left: arrowOffset,
              transform: "translateY(-50%)",
              width: arrowButtonSize,
              height: arrowButtonSize,
              borderRadius: "50%",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 2,
              zIndex: 3,
              ...(arrowsOnHover ? { opacity: 0, transition: "opacity .2s", "&:hover": { opacity: 1 } } : {}),
            }}
            size="small"
          >
            <ChevronLeftIcon sx={{ fontSize: arrowIconSize }} />
          </IconButton>

          <IconButton
            ref={nextRef}
            className="sc-nav"
            aria-label="Next"
            sx={{
              position: "absolute",
              top: "50%",
              right: arrowOffset,
              transform: "translateY(-50%)",
              width: arrowButtonSize,
              height: arrowButtonSize,
              borderRadius: "50%",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 2,
              zIndex: 3,
              ...(arrowsOnHover ? { opacity: 0, transition: "opacity .2s", "&:hover": { opacity: 1 } } : {}),
            }}
            size="small"
          >
            <ChevronRightIcon sx={{ fontSize: arrowIconSize }} />
          </IconButton>
        </>
      )}
    </Box>
  );
}
