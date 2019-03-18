import React, { Component } from 'react';
import tmdb from 'themoviedb-javascript-library';


class App extends Component {
  constructor(props) {
    super(props);
    tmdb.common.api_key = "1d332297db144df89557e1d191ef8368";
    
    this.state = {
      movieList: null,
      isWatchingTrailer: false,
      trailerId: null,
      currentSeed: null,
    }

    this.getPopularMovies = this.getPopularMovies.bind(this);
    this.getRecommendedMovies = this.getRecommendedMovies.bind(this);
  }

  componentWillMount() {
    this.getPopularMovies();
  }

  getPopularMovies() {
    const page = this.state.movieList ? this.state.movieList.page + 1 : 1;
    tmdb.movies.getPopular({page}, (data) => {
      this.setState({
        movieList: JSON.parse(data),
        currentSeed: 'popular'
      });
    }, (err) => {
      console.error(err);
    });
  }

  getRecommendedMovies(id, title) {
    tmdb.movies.getRecommendations({id}, data => {
      this.setState({
        movieList: JSON.parse(data),
        currentSeed: title
      })
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
          <div className="fixed pin bg-grey-darker"
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
        <h2>
          {
            this.state.currentSeed === 'popular' ?
            'Popular Movies' :
            `Movies similar to ${this.state.currentSeed}`
          }
        </h2>
        <button className="p-4 bg-red text-white rounded-lg shadow-md"
          onClick={this.getPopularMovies}>
          Load More
        </button>
        <div className="flex flex-wrap">
          {this.state.movieList && this.state.movieList.results.map((movie) => {
            return (
              <div className=""
                key={movie.id}>
                <div className="m-4">
                  <img className="h-64"
                    src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${movie.poster_path}`}
                    alt=""/>
                  <div className="">
                    {movie.vote_average}
                  </div>
                  <button className="p-2 rounded-lg shadow-md text-white bg-green"
                    onClick={() => this.playTrailer(movie.id)}>
                    Watch Trailer
                  </button>
                  <button className="p-2 rounded-lg shadow-md text-white bg-green"
                    onClick={() => this.getRecommendedMovies(movie.id, movie.title)}>
                    Get Similar Movies
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
