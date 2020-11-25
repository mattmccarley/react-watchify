import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: "hidden",
  },
  posterImage: {
    margin: "0 0 -2.5% -2.5%",
    padding: 0,
    height: "105%",
    width: "105%",
  },
}));

export default function PosterGrid({ mediaItems, onPosterClick }) {
  const classes = useStyles();
  return (
    <Grid container justify="center" spacing={1}>
      {mediaItems.map((movie) => (
        <Grid key={movie.id} item xs={3}>
          <Paper className={classes.paper} elevation={2}>
            <img
              className={classes.posterImage}
              src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${movie.poster_path}`}
              alt=""
              onClick={() => onPosterClick(movie)}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

PosterGrid.propTypes = {
  mediaItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  onPosterClick: PropTypes.func.isRequired
};
