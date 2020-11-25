import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import MediaDetails from "./MediaDetails/MediaDetails";

const useStyles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(2),
  },
}));

export default function AsideContent({ focusedMedia }) {
  const classes = useStyles();

  return (
    <Grid className={classes.main} item xs={5}>
      <MediaDetails focusedMedia={focusedMedia} />
    </Grid>
  );
}

AsideContent.propTypes = {
  focusedMedia: PropTypes.object
}
