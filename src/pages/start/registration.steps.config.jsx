import { UserDetailsStep, validateUserDetails } from "./wizard/steps/UserDetailsStep";
import { ReferralData } from "./wizard/steps/01_ReferrelData";
import { SelectUserType} from "./wizard/steps/02_SelectUserTypeStep";
import {SelectOrgType} from "./wizard/steps/03_OrganizationTypes";
import { UserAccountTypes } from "./wizard/steps/04_UserAccountTypes";

import {items} from './Referral-info'
import {userTypeItems} from './user-type.config'
import {organizationTypeItems} from './organization-types.config'
import {userAccountTypeItems} from './user-account-types.config'

export const RegistrationSteps = [
  {
    stepNumber: 1,
    stepName: "Referral Details ",
    component: ReferralData,
    props:{
      items: items,
    },
    validation: null,
  },
  {
    stepNumber: 2,
    stepName: "User Type",
    component: SelectUserType, // React component imported/defined
     props:{
      items: userTypeItems,
      title: "Select User Type"
    },
    validation: null, // validator function (optional)
  },
  
  {
    stepNumber: 3,
    stepName: "Org Type",
    component: SelectOrgType,
    props:{
      items: organizationTypeItems,
      title: "Select Your Organization Type"
    },
    validation: null,
  },

  {
    stepNumber: 4,
    stepName: "User Account Type",
    component: UserAccountTypes,
    props:{
      items: userAccountTypeItems,
      title: "Select Your User Account Type"
    },
    validation: null,
  },
];
