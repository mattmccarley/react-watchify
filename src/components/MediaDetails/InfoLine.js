import React from "react";
import PropTypes from "prop-types";
import { getMovieReleases } from "../../utils/api";
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

class InfoLine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedMediaId: null,
      releases: null,
      mediaCertificationRating: null,
      genres: null,
      releaseYear: null,
      runtime: null,
      loading: true,
    };

    this.getMediaReleases = this.getMediaReleases.bind(this);
    this.getMediaCertificationRating = this.getMediaCertificationRating.bind(
      this
    );
    this.getGenres = this.getGenres.bind(this);
  }

  getMediaReleases() {
    getMovieReleases(this.props.focusedMediaDetails.id)
      .then((data) => {
        const releases = data.results;
        const mediaCertificationRating = this.getMediaCertificationRating(
          releases
        );
        const genres = this.getGenres();
        const releaseYear = this.props.focusedMediaDetails
          ? this.props.focusedMediaDetails.release_date.substring(0, 4)
          : null;
        const runtime = this.props.focusedMediaDetails
          ? this.props.focusedMediaDetails.runtime
          : null;
        this.setState({
          focusedMediaId: this.props.focusedMediaDetails.id,
          releases,
          mediaCertificationRating,
          genres,
          releaseYear,
          runtime,
          loading: false,
        });
      })
      .catch((error) => {
        console.warn("Error fetching movie releases: ", error);

        this.setState({
          error: "There was an error fetching the movie releases",
        });
      });
  }

  getMediaCertificationRating(releases) {
    const usReleases = releases.filter(
      (release) => release.iso_3166_1 === "US"
    );

    if (usReleases[0]) {
      return usReleases[0].release_dates[0].certification;
    } else {
      return null;
    }
  }

  getGenres() {
    return this.props.focusedMediaDetails
      ? this.props.focusedMediaDetails.genres
          .slice(0, 2)
          .map(({ name }) => name)
      : null;
  }

  componentDidMount() {
    this.getMediaReleases();
  }

  render() {
    const { classes } = this.props;
    const {
      focusedMediaId,
      releases,
      mediaCertificationRating,
      genres,
      releaseYear,
      runtime,
      loading,
    } = this.state;

    if (focusedMediaId !== this.props.focusedMediaDetails.id) {
      this.getMediaReleases();
    }

    if (releases && !loading) {
      return (
        <div className={classes.infoLine}>
          {mediaCertificationRating && (
            <Typography className={classes.movieRating}>
              {mediaCertificationRating}
            </Typography>
          )}

          <Typography>{releaseYear}</Typography>

          <span>&nbsp;‧&nbsp;</span>

          <Typography>{genres[0] + " / " + genres[1]}</Typography>

          <span>&nbsp;‧&nbsp;</span>

          <Typography>
            {`${Math.floor(runtime / 60)}h ${
              runtime % 60 !== 0 ? (runtime % 60) + "m" : ""
            }`}
          </Typography>
        </div>
      );
    } else {
      return null;
    }
  }
}

InfoLine.propTypes = {
  focusedMedia: PropTypes.object,
};

export default withStyles(useStyles)(InfoLine);
