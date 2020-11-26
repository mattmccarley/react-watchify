import React from "react";
import PropTypes from "prop-types";
import { getMovieDetails } from "../../utils/api";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InfoLine from "./InfoLine";
import ActionLine from "./ActionLine";
import Title from "./Title";
import Trailer from "./Trailer";

const useStyles = (theme) => ({
  overview: {
    marginBottom: theme.spacing(2),
  },
});

class MediaDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedMediaDetails: null,
      loading: true,
    };

    this.handleNewMovieDetails = this.handleNewMovieDetails.bind(this);
  }

  handleNewMovieDetails(focusedMedia) {
    getMovieDetails(focusedMedia.id)
      .then((data) => {
        this.setState({
          focusedMediaDetails: data,
          loading: false,
        });
      })
      .catch((error) => {
        console.warn("Error fetching movie details: ", error);

        this.setState({
          error: "There was an error fetching the movie details",
        });
      });
  }

  componentDidMount() {
    const { focusedMedia } = this.props;

    if (focusedMedia) {
      this.handleNewMovieDetails(focusedMedia);
    }
  }

  render() {
    const { focusedMediaDetails, loading } = this.state;
    const { classes, focusedMedia } = this.props;

    if (
      focusedMediaDetails &&
      focusedMedia &&
      focusedMediaDetails.id !== focusedMedia.id
    ) {
      this.handleNewMovieDetails(focusedMedia);
    }

    if (focusedMediaDetails && !loading) {
      return (
        <React.Fragment>
          <React.Fragment>
            <Title title={focusedMediaDetails.title} />

            <InfoLine focusedMediaDetails={focusedMediaDetails} />

            <ActionLine
              focusedMediaDetails={focusedMediaDetails}
              voteAverage={focusedMediaDetails.vote_average}
            />

            <Typography className={classes.overview}>
              {focusedMediaDetails.overview}
            </Typography>

            <Trailer focusedMediaDetails={focusedMediaDetails} />
          </React.Fragment>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

MediaDetails.propTypes = {
  focusedMedia: PropTypes.object,
};

export default withStyles(useStyles)(MediaDetails);
