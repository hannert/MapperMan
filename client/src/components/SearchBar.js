import { Box, Container, InputAdornment, TextField, Grid } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RepoSelectButton from "./RepoSelectButton";
import TagsButton from "./TagsButton";

export default function SearchBar() {
  const [input, setInput] = useState("");

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <Box>
        <Grid container rowSpacing={0}>
                <RepoSelectButton></RepoSelectButton>
                <TextField
                value={input}
                onChange={handleChange}
                sx={{ width: 600}}
                InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <SearchIcon />
                    </InputAdornment>
                ),
                }}
                />
                <TagsButton></TagsButton>
        </Grid>
    </Box>
  );
}