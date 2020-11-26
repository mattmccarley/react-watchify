import React from "react";
import TopAppBar from "./components/TopAppBar/TopAppBar";
import MainContent from "./components/MainContent";
import AsideContent from "./components/AsideContent";
import Grid from "@material-ui/core/Grid";
import { debounce } from "lodash";
import {
  getPopularMovies,
  getMovieRecommendations,
  searchMovies,
} from "./utils/api";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaItems: [],
      movieSearchResults: [],
      focusedMedia: null,
      isSearching: false,
      searchInputValue: "",
    };

    this.handlePosterClick = this.handlePosterClick.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.fetchMoviesFromSearch = debounce(this.fetchMoviesFromSearch, 1000);
  }

  componentDidMount() {
    getPopularMovies()
      .then((data) => {
        this.setState({
          mediaItems: [...data.results.slice(0, 8)],
        });
      })
      .catch((error) => {
        console.warn("Error fetching popular movies: ", error);

        this.setState({
          error: "There was an error fetching the popular movies",
        });
      });
  }

  handlePosterClick(clickedMedia) {
    getMovieRecommendations(clickedMedia.id).then((data) => {
      this.setState({
        mediaItems: [...data.results.slice(0, 8)],
        focusedMedia: clickedMedia,
        isSearching: false,
        searchInputValue: "",
      });
    });
  }

  handleSearchInputChange(event) {
    event.preventDefault();
    this.setState({
      searchInputValue: event.target.value,
      isSearching: event.target.value !== "",
    });

    this.fetchMoviesFromSearch(event.target.value);
  }

  fetchMoviesFromSearch(searchText) {
    searchMovies(searchText)
      .then((data) => {
        this.setState({
          movieSearchResults: [...data.results.slice(0, 8)],
        });
      })
      .catch((error) => {
        console.warn("Error searching for movies: ", error);

        this.setState({
          error: "There was an error searching for movies",
        });
      });
  }

  render() {
    const {
      mediaItems,
      isSearching,
      focusedMedia,
      searchInputValue,
      movieSearchResults,
    } = this.state;
    return (
      <div className="App">
        <TopAppBar
          searchInputValue={searchInputValue}
          handleSearchInputChange={this.handleSearchInputChange}
        />
        <Grid container>
          <MainContent
            mediaItems={mediaItems}
            movieSearchResults={movieSearchResults}
            onPosterClick={this.handlePosterClick}
            isSearching={isSearching}
          />
          <AsideContent focusedMedia={focusedMedia} />
        </Grid>
      </div>
    );
  }
}

export default App;
