import React, { useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Button, Stack, Typography } from "@mui/material";
import MobilePage, { SnackbarContext } from "../components/MobilePage";

import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Simple theme tuned for mobile
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#006FFD" },
    secondary: { main: "#4E46E5" },
  },
  shape: { borderRadius: 14 },
});

const drawerItems = [
  { label: "Home", icon: <HomeIcon />, value: "home" },
  { label: "About", icon: <InfoIcon />, value: "about" },
  { label: "Settings", icon: <SettingsIcon />, value: "settings" },
];

const bottomActions = [
  { label: "Home", icon: <HomeIcon />, value: "home" },
  { label: "Chat", icon: <ChatBubbleIcon />, value: "chat" },
  { label: "Account", icon: <AccountCircleIcon />, value: "account" },
];

function HeaderActions() {
  return <NotificationsIcon />;
}

function HomeScreen() {
  const { showSnackbar } = useContext(SnackbarContext);
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>Welcome 👋</Typography>
      <Typography variant="body2" color="text.secondary">
        Fixed header & footer. Content scrolls under safe areas.
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button onClick={() => showSnackbar("Saved successfully", "success")}>Save</Button>
        <Button color="secondary" onClick={() => showSnackbar("Info message")}>Info</Button>
        <Button color="error" onClick={() => showSnackbar("Oops!", "error")}>Error</Button>
      </Stack>
      <Box sx={{ height: 900, bgcolor: "action.hover", borderRadius: 2 }} />
    </Stack>
  );
}

function Placeholder({ label }) {
  return <Typography variant="h6" sx={{ py: 1 }}>{label}</Typography>;
}

export default function MobilePageDemo() {
  const [tab, setTab] = useState("home");
  const [title, setTitle] = useState("Mobile App");

  const screen = useMemo(() => {
    switch (tab) {
      case "home":
        return <HomeScreen />;
      case "chat":
        return <Placeholder label="Chat" />;
      case "account":
        return <Placeholder label="Account" />;
      default:
        return <HomeScreen />;
    }
  }, [tab]);

  return (
    <ThemeProvider theme={theme}>
      <MobilePage
        title={title}
        headerActions={<HeaderActions />}
        drawerItems={drawerItems}
        onSelectDrawerItem={(val) => setTitle(val[0].toUpperCase() + val.slice(1))}
        bottomActions={bottomActions}
        bottomValue={tab}
        onBottomChange={(val) => {
          setTab(val);
          setTitle(val[0].toUpperCase() + val.slice(1));
        }}
      >
        {screen}
      </MobilePage>
    </ThemeProvider>
  );
}
