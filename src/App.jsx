import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import RunBookEditor from "./components/runbookeditor/RunBookEditor";

import CSSExtractor from "./pages/CSSExtractor"
import { Box } from '@mui/material'
import HomePage from "./pages/home/HomePage";
import MarkdownEditor from "./components/shared/markdown/MarkdownEditor";
import MarkdownSimple from "./components/shared/simple-markdown/MarkdownEditorMain";
import ResponsiveViewer from "./components/shared/ResponsiveMobileViewer/MobileView"
import ComponentExplorer from "./components/shared/ComponentExplorer/TwoColumnScrollableContainer"
import GuidesPage from "./pages/GuidesPage";
import StartPage from "./pages/start/StartPage";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MobileLayoutNotched from "./layouts/MobileLayout";
import { useMediaQuery, useTheme } from "@mui/material";
import EventRoutes from './views/organize-events/EventRoutes';
import  SimpleRulesTreeBuilderMain from "./components/info-tree-rule-builder/simple-rules-tree/SimpleRulesTreeBuilderMain"
function App() {

const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // or "md"

 const Layout = isMobile ? MobileLayoutNotched : AppLayout;
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* your app */}

        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {/* Index route could show a landing or docs home */}
              <Route index element={<HomePage />} />
              {/* Map your app pages here */}
              <Route path="/tools/cssextract" element={<CSSExtractor />} />
          
               <Route path="/tools/infotreeeditor" element={<SimpleRulesTreeBuilderMain />} />
              <Route path="/tools/markdowneditor" element={<MarkdownEditor />} />
              <Route path="/tools/markdownsimple" element={<MarkdownSimple></MarkdownSimple>} />
              <Route path="/tools/responsiveviewer" element={<ResponsiveViewer></ResponsiveViewer>} />
              <Route path="/tools/componentexplorer" element={<ComponentExplorer></ComponentExplorer>} />
              <Route path="/guides" element={<GuidesPage></GuidesPage>} />
              <Route path="/start" element={<StartPage>ddd</StartPage>} />
              {/* Catch-all 404 */}
              <Route path="*" element={<div className="p-6">Not Found</div>} />

                <Route path="/events/*" element={<EventRoutes />} /> 
            </Route>
            <Route path="/tools/runbookeditor" element={<RunBookEditor />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
