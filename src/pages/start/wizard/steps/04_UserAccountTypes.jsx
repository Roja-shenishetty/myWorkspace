import { Box, TextField } from "@mui/material";
import CustomHeading from '../../CustomHeading'
import HorizontalIconButtonGrid from "../../HorizontalIconButtonGrid";

export function UserAccountTypes({ data, items = {}, onChange, errors = {} }) {
    console.log("SELECTED TITLE.", data)
    return (
        <Box>
            <CustomHeading title="Select Your  Account Type in Organization" textSize="text-1xl md:text-2xl" ></CustomHeading>
            <HorizontalIconButtonGrid data={data} items={items} onChange={onChange} errors={errors}>
            </HorizontalIconButtonGrid>
        </Box>
    );
}