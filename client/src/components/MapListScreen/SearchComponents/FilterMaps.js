import { Box, Container, InputAdornment, TextField, Grid } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RepoSelectButton from "./RepoSelectButton";
import TagsFilter from "./TagsFilter";
import SearchMaps from "./SearchMaps";

export default function FilterMaps(props) {
  const {currentList} = props;


  return (
    <Box>
        <Grid container rowSpacing={0}>
                <RepoSelectButton></RepoSelectButton>
                <SearchMaps currentList={currentList}></SearchMaps>
                <TagsFilter></TagsFilter>
        </Grid>
    </Box>
  );
}