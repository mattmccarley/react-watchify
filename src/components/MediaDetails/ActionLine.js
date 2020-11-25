import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  actionLine: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  voteAverage: {
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.grey[100],
    height: theme.spacing(5),
    width: theme.spacing(5),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    marginRight: theme.spacing(1),
  },
  trailerButton: {
    marginRight: theme.spacing(1),
  },
}));

export default function ActionLine(props) {
  const classes = useStyles();
  return (
    <div className={classes.actionLine}>
      <div className={classes.voteAverage}>
        <Typography>{props.voteAverage}</Typography>
      </div>

      <Button
        className={classes.trailerButton}
        variant="contained"
        color="secondary"
        size="small"
      >
        Watch Trailer
      </Button>

      <Button variant="contained" size="small">
        + Quick List
      </Button>
    </div>
  );
}
