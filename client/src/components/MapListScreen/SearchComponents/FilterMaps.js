import { Box, Container, InputAdornment, TextField, Grid } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RepoSelectButton from "./RepoSelectButton";
import TagsFilter from "./TagsFilter";
import SearchMaps from "./SearchMaps";

export default function FilterMaps() {


  return (
    <Box>
        <Grid container rowSpacing={0}>
                <RepoSelectButton></RepoSelectButton>
                <SearchMaps></SearchMaps>
                <TagsFilter></TagsFilter>
        </Grid>
    </Box>
  );
}