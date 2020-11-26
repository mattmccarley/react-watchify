import React from "react";
import PropTypes from "prop-types";
import { getMovieVideos } from "../../utils/api";

export default class Trailer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedMediaId: null,
      videos: null,
      loading: true,
    };

    this.getVideos = this.getVideos.bind(this);
  }

  componentDidMount() {
    this.getVideos();
  }

  getVideos() {
    getMovieVideos(this.props.focusedMediaDetails.id)
      .then((data) => {
        this.setState({
          focusedMediaId: data.id,
          videos: data.results,
          loading: false,
        });
      })
      .catch((error) => {
        console.warn("Error fetching movie videos: ", error);

        this.setState({
          error: "There was an error fetching the movie videos",
        });
      });
  }

  render() {
    const { focusedMediaId } = this.state;
    const trailer = this.state.videos
      ? this.state.videos.filter((video) => video.type === "Trailer")
      : null;

    if (focusedMediaId !== this.props.focusedMediaDetails.id) {
      this.getVideos();
    }

    if (trailer && trailer[0]) {
      return (
        <iframe
          title={trailer[0].key}
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${trailer[0].key}`}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen="1"
          controls="0"
          modestbranding="1"
        ></iframe>
      );
    } else {
      return null;
    }
  }
}

Trailer.propTypes = {
  focusedMediaDetails: PropTypes.object
}
