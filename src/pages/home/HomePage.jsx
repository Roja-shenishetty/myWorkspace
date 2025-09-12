import ToolsSection from '../../components/tool-showcase/sections/ToolsSection';
import HeroSection from './HeroSection';
import { features } from './features.config.jsx'
import { Box, Typography, Button, Paper } from '@mui/material';
import { tools } from '../../tool.config.jsx'; // <-- Data is injected from here
import ShowCaseRow from '../../components/shared/showcase/showcaserow/ShowCaseRow.jsx';
import "./hompage.css"
// This component represents the entire home page by assembling section components.



const HorizontalIconTitleButton = ({ title, svgIcon }) => {
  return (
    <div className="flex h-[4.5rem] sm:h-[5.625rem]">
      <button
        aria-label={title}
        tabIndex={0}
        onClick={() => console.log("hi")}
        className="transition duration-200 w-full h-full cursor-pointer group stack items-center border rounded-t-[18px] rounded-b-[16px]
          border-gray-alpha-300 outline-none focus-visible:ring-ring focus-visible:ring-offset-2 
          focus-visible:outline-none ring-ring ring-offset-2 hover:border-gray-alpha-950 focus-visible:border-gray-alpha-950
          hover:bg-gray-100 hover:bg-saffron-lite transition-colors duration-300 active:bg-gray-200"
        style={{ "--tw-ring-offset-color": "white" }}
      >
        <div className="stack gap-2 w-full">
          <div className="flex flex-col overflow-hidden flex-1 stack gap-2 sm:gap-4 lg:gap-4 items-start justify-start duration-200 w-full pt-3.5 sm:pt-[1.125rem] pb-3 px-3.5 sm:pb-4 sm:px-5">
            <div className="transition duration-200 [&_svg]:w-[1.125rem] [&_svg]:h-[1.125rem]">
              {svgIcon ? svgIcon : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-newspaper"
                >
                  <path d="M15 18h-5"></path>
                  <path d="M18 14h-8"></path>
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"></path>
                  <rect x="10" y="6" width="8" height="4" rx="1"></rect>
                </svg>
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-alpha-950">{title}</p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};


const HomePage = () => {

  return (<>
    <div className="bg-light-bg font-sans">
      <main>
        
        <HeroSection></HeroSection>
        <Box sx={{ mt: 4, ml: 2, mr: 2, mb: 1 }}>
          <ShowCaseRow title='' items={features} autoplay variant='row-slider'></ShowCaseRow>
        </Box>
        <ToolsSection title="Explore the Creators Toolbelt" data={tools} />
      </main>
      {/* <Footer /> */}
    </div>
  </>);
};

export default HomePage;