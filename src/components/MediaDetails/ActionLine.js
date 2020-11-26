import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = (theme) => ({
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
  trailerButtonLink: {
    color: "inherit",
    textDecoration: "none",
  },
});

class ActionLine extends React.Component {
  render() {
    const { classes, voteAverage } = this.props;

    return (
      <React.Fragment>
        <div className={classes.actionLine}>
          <div className={classes.voteAverage}>
            <Typography>{voteAverage}</Typography>
          </div>

          <Button variant="contained" size="small">
            + Quick List
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(ActionLine);
