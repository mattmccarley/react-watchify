import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Search from "./Search";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  brand: {
    marginRight: theme.spacing(2),
  },
}));

export default function TopAppBar({
  searchInputValue,
  handleSearchInputChange,
}) {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography className={classes.brand} component="h1" variant="h4">
          Watchify
        </Typography>
        <Search
          searchInputValue={searchInputValue}
          handleSearchInputChange={handleSearchInputChange}
        />
      </Toolbar>
    </AppBar>
  );
}

TopAppBar.propTypes = {
  searchInputValue: PropTypes.string.isRequired,
  handleSearchInputChange: PropTypes.func.isRequired,
};
