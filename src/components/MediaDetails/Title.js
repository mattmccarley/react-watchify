import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
}));

export default function Title({ title }) {
  const { classes } = useStyles();
  return (
    <Typography className={classes.title} variant="h4" component="h2">
      {title}
    </Typography>
  );
}
