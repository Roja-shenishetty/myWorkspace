import React from 'react';
import HorizontalIconButtonGrid from "./HorizontalIconButtonGrid"
import MaxWidthWrapper from './MaxWidthWrapper';
import { Wizard } from './wizard/Wizard';
import { RegistrationSteps} from './registration.steps.config'

// This component represents the entire home page by assembling section components.
const StartPage = () => {



  return (
    <div className="bg-light-bg font-sans mt-12 justify-items-center">



      {/* <Header /> */}
    
      <Wizard steps={RegistrationSteps}></Wizard>
      {/* <Footer /> */}
    </div>
  );
};

export default StartPage;