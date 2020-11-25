import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const useStyles = (theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
});

function Title(props) {
  const { title, classes } = props;
  return (
    <Typography className={classes.title} variant="h4" component="h2">
      {title}
    </Typography>
  );
}

export default withStyles(useStyles)(Title);
