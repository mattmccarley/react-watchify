import React from "react";
import TopAppBar from "./components/TopAppBar";
import MainContent from "./components/MainContent";
import AsideContent from "./components/AsideContent";
import Grid from "@material-ui/core/Grid";
import { getPopularMovies } from './utils/api';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaItems: [],
      focusedMedia: null,
    };

    this.handlePosterClick = this.handlePosterClick.bind(this);
  }

  componentDidMount() {
    getPopularMovies(
      {},
      (data) => {
        const parsed = JSON.parse(data);
        this.setState({
          mediaItems: [...parsed.results.slice(0, 8)],
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }

  handlePosterClick(clickedMedia) {
    this.setState({
      focusedMedia: clickedMedia,
    });
  }

  render() {
    return (
      <div className="App">
        <TopAppBar></TopAppBar>
        <Grid container>
          <MainContent
            mediaItems={this.state.mediaItems}
            onPosterClick={this.handlePosterClick}
          />
          <AsideContent focusedMedia={this.state.focusedMedia} />
        </Grid>
      </div>
    );
  }
}

export default App;
