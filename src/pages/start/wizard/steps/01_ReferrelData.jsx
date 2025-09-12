import { Box } from "@mui/material";
import CustomHeading from '../../CustomHeading'
import HorizontalIconButtonGrid from "../../HorizontalIconButtonGrid";

export function ReferralData({ data, items = {}, onChange, errors = {} }) {
  console.log("SELECTED TITLE.",data)
  return (
    <Box>
      <CustomHeading textSize="text-1xl md:text-2xl" title="How did you hear about iLearn?"></CustomHeading>
      <HorizontalIconButtonGrid data={data}  items={items} onChange={onChange} errors={errors}>
      </HorizontalIconButtonGrid>
    </Box>
  );
}