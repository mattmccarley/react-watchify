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
  constructor (props) {
    super(props);

    this.state = {
      focusedMediaDetails: null,
    }
  }

  render() {
    const { focusedMedia } = this.props;

    if (focusedMedia) {
      getMovieDetails(
        {id: focusedMedia.id },
        (data) => {
          console.log(JSON.parse(data));
          this.setState({
            focusedMediaDetails: JSON.parse(data),
          });
        },
        (err) => {
          console.error(err);
        }
      );
    }

    return (
      <React.Fragment>
        {this.state.focusedMediaDetails && (
          <React.Fragment>
            <Title title={this.state.focusedMediaDetails.title} />
  
            <InfoLine
              focusedMediaDetails={this.state.focusedMediaDetails}
            />
  
            <ActionLine voteAverage={this.state.focusedMediaDetails.vote_average} />
  
            <Typography>{this.state.focusedMediaDetails.overview}</Typography>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

MediaDetails.propTypes = {
  focusedMedia: PropTypes.object,
};

export default withStyles(useStyles)(MediaDetails);
