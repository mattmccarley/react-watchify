import React from "react";
import PropTypes from "prop-types";
import { getMovieDetails } from "../../utils/api";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InfoLine from "./InfoLine";
import ActionLine from "./ActionLine";
import Title from "./Title";

const useStyles = (theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
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
    getMovieDetails(
      { id: focusedMedia.id },
      (data) => {
        console.log(JSON.parse(data));
        this.setState({
          focusedMediaDetails: JSON.parse(data),
          loading: false,
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }

  componentDidMount() {
    const { focusedMedia } = this.props;

    if (focusedMedia) {
      this.handleNewMovieDetails(focusedMedia);
    }
  }

  render() {
    const { focusedMediaDetails, loading } = this.state;
    const { focusedMedia } = this.props;

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

            <ActionLine voteAverage={focusedMediaDetails.vote_average} />

            <Typography>{focusedMediaDetails.overview}</Typography>
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
