// src/layouts/MobileLayoutNotched.jsx
import * as React from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Box, Paper,
    BottomNavigation, BottomNavigationAction, Fab, SwipeableDrawer,
    Divider, List, ListItem, ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import SavingsIcon from '@mui/icons-material/Savings';
import PaymentsIcon from '@mui/icons-material/Payments';
import AppsIcon from '@mui/icons-material/Apps';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import HomeIcon from '@mui/icons-material/Home';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import GroupsIcon from "@mui/icons-material/Groups";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import WorkIcon from "@mui/icons-material/Work";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventIcon from "@mui/icons-material/Event";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TodayIcon from "@mui/icons-material/Today";
import DateRangeIcon from "@mui/icons-material/DateRange";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import LearnIcon from '../components/icons/ILearnIcon';
import { Outlet } from 'react-router-dom';

const BN_H = 72;
const FAB_SIZE = 64;
const FAB_LIFT = 10;
const NOTCH_RADIUS = FAB_SIZE / 2 + 12;


function MyIcon() {
  return (
    <img 
      src="/app-logo.svg" 
      alt="App Logo" 
      width={34} 
      height={34} 
      style={{ display: "inline-block" }} 
    />
  );
}

const DEFAULT_TABS = [
    { value: '/home', label: 'Home', icon: <HomeIcon fontSize={"large"} /> },
    { value: '/events', label: 'Events', icon: <EventIcon fontSize={"large"}/> },   
    { value: '/team', label: 'Team', icon: <GroupsIcon fontSize={"large"}/> },
     { value: '/work', label: 'Work', icon: <BusinessCenterIcon fontSize={"large"} /> },
     { value: '/', label: 'iLearn', icon: <MyIcon fill="currentColor" color="primary" sx={{ color: "orange", fontSize: 40 }} /> },
    { value: '/more', label: 'More', icon: <AppsIcon /> }
];


export default function MobileLayoutNotched({
    title = 'SSN3',
    backTo,
    actions = null,
    tabs = DEFAULT_TABS,
    hideBottomNav = false,
    centerIcon,
    renderSheet,
    contentSx = {},
    children
}) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [sheetOpen, setSheetOpen] = React.useState(false);

    const current = React.useMemo(() => {
        if (!tabs || tabs.length === 0) return false;
        const found = tabs.find(t => pathname === t.value);
        return found ? found.value : false;
    }, [pathname, tabs]);

    const handleBack = () => {
        if (typeof backTo === 'number') navigate(backTo);
        else if (typeof backTo === 'string') navigate(backTo);
        else navigate(-1);
    };

    const mid = Math.floor(tabs.length / 2);

    return (
        // Own the viewport so no parent can constrain width/height
        <Box
            sx={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                height: '100dvh',
                bgcolor: 'background.default',
                boxSizing: 'border-box'
            }}
        >
            {/* Header */}
            <AppBar
                position="sticky"
                elevation={1}
                sx={{
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pt: 'env(safe-area-inset-top)',
                    width: '100%',
                    maxWidth: '100%'
                }}
            >
                <Toolbar sx={{ minHeight: 56, gap: 1, minWidth: 0 }}>
                    {backTo !== undefined && (
                        <IconButton edge="start" onClick={handleBack} aria-label="Back">
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 0 }}>{title}</Typography>
                    <Box sx={{ ml: 'auto' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>                                   
                                    <IconButton size="small"><SearchIcon /></IconButton>
                                    <IconButton size="small"><NotificationsNoneIcon /></IconButton>
                                </Box>
                    {actions}
                </Toolbar>
            </AppBar>

            {/* Single scroll container */}
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0
                }}
            >
                <SimpleBar style={{ height: '100%', width: '100%' }} autoHide={false}>
                    <Box
                        sx={{
                            pl: 2.2,
                            pr: 2.2,
                            pt: 0.5,
                            width: '100%',
                            maxWidth: '100%',
                            // space for notch + FAB so last rows aren't obscured
                            pb: `calc(${BN_H + FAB_SIZE / 2 + 32}px + env(safe-area-inset-bottom))`,
                            ...contentSx
                        }}
                    >
                       <Outlet />
                    </Box>
                </SimpleBar>
            </Box>

            {/* Solid notched footer + FAB (no glass) */}
            {!hideBottomNav && tabs && tabs.length > 0 && (
                <Box sx={{ position: 'sticky', bottom: 0, zIndex: 10, width: '100%' }}>
                    <Box sx={{ position: 'relative', height: BN_H, width: '100%' }}>
                        <Paper
                            elevation={1}  // slight shadow; set 0 for fully flat
                            square
                            sx={(theme) => ({
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                borderTop: '1px solid',
                                borderColor: 'divider',

                                // ✅ SOLID background (no glass/blur/gradient)
                                backgroundColor: theme.palette.background.paper,
                                backgroundImage: 'none',
                                backdropFilter: 'none',
                                WebkitBackdropFilter: 'none',
                                opacity: 1,

                                pb: 'env(safe-area-inset-bottom)',

                                // keep the concave notch
                               // WebkitMaskImage: `radial-gradient(circle ${NOTCH_RADIUS}px at 50% 0, transparent ${NOTCH_RADIUS - 1}px, #000 ${NOTCH_RADIUS}px)`,
                               // maskImage: `radial-gradient(circle ${NOTCH_RADIUS}px at 50% 0, transparent ${NOTCH_RADIUS - 1}px, #000 ${NOTCH_RADIUS}px)`
                            })}
                        >
                            <BottomNavigation
                                value={current}
                                onChange={(_, v) => navigate(v)}
                                showLabels
                                sx={{
                                    width: '100%',
                                    height: '100%',

                                    // ✅ kill any theme gradient on BN itself
                                    backgroundColor: 'transparent !important',
                                    backgroundImage: 'none !important',

                                    pt: `${FAB_SIZE / 10}px`,
                                    '& .MuiBottomNavigationAction-root': {
                                        flex: 1, minWidth: 0, px: 0
                                    },
                                    '& .Mui-selected': { color: 'primary.main' }
                                }}
                            >
                                {/* Left half */}
                                {tabs.slice(0, mid).map(t => (
                                    <BottomNavigationAction key={t.value} value={t.value} label={t.label} icon={t.icon} />
                                ))}

                               

                                {/* Right half */}
                                {tabs.slice(mid).map(t => (
                                    <BottomNavigationAction key={t.value} value={t.value} label={t.label} icon={t.icon} />
                                ))}
                            </BottomNavigation>
                        </Paper>

                        {/* FAB (not masked), slightly lifted */}
                        <Fab
                            color="primary"
                            aria-label="primary action"
                            onClick={() => setSheetOpen(true)}
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: 0,
                                transform: `translate(-50%, calc(-50% - ${FAB_LIFT}px))`,
                                width: FAB_SIZE,
                                height: FAB_SIZE,
                                zIndex: 1,
                                boxShadow: '0 12px 28px rgba(0,0,0,0.20)',
                                '& .MuiSvgIcon-root': { color: 'common.white' }
                            }}
                        >
                            {centerIcon ?? <AddRoundedIcon />}
                        </Fab>
                    </Box>
                </Box>
            )}

            {/* Bottom sheet / modal */}
            <SwipeableDrawer
                anchor="bottom"
                open={sheetOpen}
                onClose={() => setSheetOpen(false)}
                onOpen={() => setSheetOpen(true)}
                disableSwipeToOpen={false}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        pb: 'env(safe-area-inset-bottom)'
                    }
                }}
            >
                {/* Drag handle */}
                <Box sx={{ py: 1, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ width: 40, height: 4, borderRadius: 99, bgcolor: 'divider' }} />
                </Box>
                <Divider />
                {renderSheet
                    ? renderSheet(() => setSheetOpen(false))
                    : (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Quick actions</Typography>
                            <List>
                                <ListItem button onClick={() => setSheetOpen(false)}>
                                    <ListItemText primary="Create Task" secondary="Create a task for group or individual" />
                                </ListItem>
                                <ListItem button onClick={() => setSheetOpen(false)}>
                                    <ListItemText primary="Raise Issue" secondary="Raise an issue " />
                                </ListItem>
                                <ListItem button onClick={() => setSheetOpen(false)}>
                                    <ListItemText primary="Send Announcement" secondary="Share info for publishing" />
                                </ListItem>
                                 <ListItem button onClick={() => setSheetOpen(false)}>
                                    <ListItemText primary="Create Group" secondary="Create a group" />
                                </ListItem>
                            </List>
                        </Box>
                    )
                }
            </SwipeableDrawer>
        </Box>
    );
}
