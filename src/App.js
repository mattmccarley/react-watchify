import React, { Component } from 'react';
import tmdb from 'themoviedb-javascript-library';


class App extends Component {
  constructor(props) {
    super(props);
    tmdb.common.api_key = "1d332297db144df89557e1d191ef8368";
    
    this.state = {
      quickList: [],
      clickFeed: [],
      currentSeed: null,
      isWatchingTrailer: false,
      trailerId: null,
    }

    this.getPopularMovies = this.getPopularMovies.bind(this);
    this.getRecommendedMovies = this.getRecommendedMovies.bind(this);
  }

  componentWillMount() {
    this.getPopularMovies();
  }

  componentDidUpdate() {
    if (this.state.clickFeed.length > 0) {
      const element = document.getElementById(`feed-item-${this.state.clickFeed.length - 1}`);
      element.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  }

  getPopularMovies() {
    tmdb.movies.getPopular({}, (data) => {
      this.setState((prevState) => ({
        clickFeed: [...prevState.clickFeed, JSON.parse(data)],
        currentSeed: JSON.parse(data),
      }));
    }, (err) => {
      console.error(err);
    });
  }

  getRecommendedMovies(movieSeed) {
    let id = movieSeed.id;
    tmdb.movies.getRecommendations({id}, data => {
      this.setState((prevState) => ({
        clickFeed: [...prevState.clickFeed, JSON.parse(data)],
        currentSeed: movieSeed,
      }));
    }, err => {
      console.error(err);
    });
  }

  playTrailer(id) {
    tmdb.movies.getVideos({id}, data => {
      const parsedData = JSON.parse(data);
      if (parsedData.results[0].key) {
        this.setState({
          isWatchingTrailer: true,
          trailerId: parsedData.results[0].key
        });
      }
    }, err => {
      console.error(err);
    })
  }

  render() {
    return (
      <div>
        {this.state.isWatchingTrailer && (
          <div className="fixed pin bg-grey-darker z-10"
            onClick={() => this.setState({ isWatchingTrailer: false })}>
            <div className="trailer-container">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${this.state.trailerId}`}
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Movie Trailer">
                </iframe>
            </div>
          </div>
          )
        }
        <h1>Watchify</h1>
        <div className="flex">
          <div className="rounded-lg shadow-lg p-8 w-2/3">
            {this.state.clickFeed &&
              this.state.clickFeed.map((feedItem, index) => {
                return (
                  <div className="mb-8"
                    id={`feed-item-${index}`}>
                    {index === 0 && (
                      <h2>Popular Movies</h2>
                    )}
                    {index > 0 && (
                      <h2>Recommendations based on {this.state.currentSeed.title}</h2>
                    )}
                    <div className="flex flex-wrap">
                      {feedItem.results.map(movie => {
                        return (
                          <div className="m-0 p-0 w-1/5 cursor-pointer"
                            key={movie.id}
                            onClick={() => this.getRecommendedMovies(movie)}>
                            <img className="h-full w-full m-0 p-0"
                              src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${movie.poster_path}`} alt=""/>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                )
              }
          </div>
          <div className="rounded-lg shadow-lg p-8 w-1/3 fixed pin-t pin-b pin-r">
            {this.state.currentSeed && (
                <div>
                  <div className="h-64">
                    <img className="h-full m-0 p-0"
                      src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${this.state.currentSeed.poster_path}`} alt=""/>
                  </div>
                  <h3>{this.state.currentSeed.title}</h3>
                  {this.state.currentSeed.vote_average && (
                    <p>rating: {this.state.currentSeed.vote_average}</p>
                  )}
                  <p className="italic">
                    {this.state.currentSeed.overview}
                  </p>
                  {this.state.currentSeed.id && (
                    <button className="p-2 rounded-lg shadow-md text-white bg-green"
                      onClick={() => this.playTrailer(this.state.currentSeed.id)}>
                      Watch Trailer
                    </button>
                  )}
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
