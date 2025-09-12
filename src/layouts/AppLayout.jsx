import { Outlet } from "react-router-dom";
import TopBar from "../components/topbar/TopBar";

export default function AppLayout() {
  return (
  
      <div className="min-h-screen flex flex-col">
      <TopBar />
      <main id="mainOutlet" className="flex-1">
        <Outlet />
      </main>
    </div>
 
    
  );
}
