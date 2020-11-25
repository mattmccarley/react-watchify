import React from "react";
import PropTypes from "prop-types";
import { getMovieReleases, getMovieDetails } from "../../utils/api";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = (theme) => ({
  infoLine: {
    display: "flex",
    marginBottom: theme.spacing(2),
    alignItems: "center",
    color: theme.palette.grey[700],
  },
  movieRating: {
    border: "1px solid",
    borderRadius: "2px",
    boxSizing: "border-box",
    display: "inline-block",
    fontSize: "11px",
    lineHeight: "11px",
    margin: "2px 8px 2px 0",
    maxHeight: "14px",
    padding: "1px 3px 0",
    transform: "translateY(-1px)",
  },
});

const GENRES_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

class InfoLine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      releases: null,
      focusedMediaDetails: null,
    };

    this.getMediaDetails = this.getMediaDetails.bind(this);
    this.getMediaReleases = this.getMediaReleases.bind(this);
    this.getMediaCertificationRating = this.getMediaCertificationRating.bind(
      this
    );
    this.getGenres = this.getGenres.bind(this);
  }

  getMediaDetails() {
    // getMovieDetails(
    //   { id: this.props.focusedMedia.id },
    //   (data) => {
    //     this.setState({
    //       focusedMediaDetails: JSON.parse(data),
    //     });
    //   },
    //   (err) => {
    //     console.error(err);
    //   }
    // );
  }

  getMediaReleases() {
    getMovieReleases(
      { id: this.props.focusedMedia.id },
      (data) => {
        this.setState({
          releases: JSON.parse(data).items,
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getMediaCertificationRating() {
    return this.state.releases
      ? this.state.releases.filter((release) => release.iso_3166_1 === "US")[0]
          .release_dates[0].certification
      : null;
  }

  getGenres() {
    const genres = this.state.focusedMediaDetails
      ? this.state.focusedMediaDetails.genres.map(
          (genreId) => GENRES_MAP[genreId]
        )
      : null;
    const formattedGenres = [];
    if (genres) {
      for (let i = 0; i < genres.length - 1; i++) {
        formattedGenres.push(<span>{genres[i].name}/</span>);
      }
      formattedGenres.push(genres[genres.length - 1].name);
    }
    return formattedGenres;
  }

  render() {
    // this.getMediaDetails();
    // this.getMediaReleases();
    const { classes } = this.props;
    // const mediaCertificationRating = this.getMediaCertificationRating();
    // const genres = this.getGenres();
    // const releaseYear = this.state.focusedMediaDetails
    //   ? this.state.focusedMediaDetails.release_date.substring(0,4)
    //   : null;
    // const runtime = this.state.focusedMediaDetails
    //   ? this.state.focusedMediaDetails.runtime
    //   : null;

    return (
      <div className={classes.infoLine}>
        {/* <Typography className={classes.movieRating}>
          {mediaCertificationRating}
        </Typography>

        <Typography>{releaseYear}</Typography>

        <span>&nbsp;‧&nbsp;</span>

        <Typography>{genres}</Typography>

        <span>&nbsp;‧&nbsp;</span>

        <Typography>
          {`${runtime / 60}h ${runtime % 60 !== 0 ? (runtime % 60) + "m" : ""}`}
        </Typography> */}
      </div>
    );
  }
}

InfoLine.propTypes = {
  focusedMedia: PropTypes.object,
};

export default withStyles(useStyles)(InfoLine);
