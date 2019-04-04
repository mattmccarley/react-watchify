import React, { Component } from 'react';
import tmdb from 'themoviedb-javascript-library';
import { isAbsolute } from 'path';


class App extends Component {
  constructor(props) {
    super(props);
    tmdb.common.api_key = '1d332297db144df89557e1d191ef8368';
    tmdb.common.base_uri = 'https://api.themoviedb.org/3/';
    
    this.state = {
      quickList: [],
      clickFeed: [],
      currentSeed: null,
      currentSeedCast: null,
      isWatchingTrailer: false,
      trailerId: null,
      movieGenres: null,
    }

    this.getPopularMovies = this.getPopularMovies.bind(this);
    this.getRecommendedMovies = this.getRecommendedMovies.bind(this);
    this.getMovieGenreList = this.getMovieGenreList.bind(this);
    this.getMoviesByGenre = this.getMoviesByGenre.bind(this);
    this.getMoviesByCastMember = this.getMoviesByCastMember.bind(this);
    this.getCreditDetails = this.getCreditDetails.bind(this);
  }

  componentWillMount() {
    this.getPopularMovies();
    this.getMovieGenreList();
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

  getMovieGenreList() {
    if (!this.state.movieGenres) {
      tmdb.genres.getMovieList({}, (data) => {
        this.setState({
          movieGenres: JSON.parse(data).genres,
        });
      }, (err) => {
        console.error(err);
      })
    }
  }

  getMoviesByGenre(genreId, genreName) {
    tmdb.discover.getMovies({
      with_genres: `${genreId}`
    }, (data) => {
      var parsedData = JSON.parse(data);
      this.setState((prevState) => ({
        clickFeed: [...prevState.clickFeed, parsedData],
        currentSeed: genreName,
        currentSeedCast: null,
      }));
    }, (err) => {
      console.error(err);
    });
  }

  getMoviesByCastMember(castMemberId, castMemberName) {
    tmdb.discover.getMovies({
      with_cast: castMemberId
    }, (data) => {
      let parsedData = JSON.parse(data);
      this.setState((prevState) => ({
        clickFeed: [...prevState.clickFeed, parsedData],
        currentSeed: castMemberName,
        currentSeedCast: null,
      }));
    }, (err) => {
      console.error(err);
    })
  }

  getRecommendedMovies(movieSeed) {
    let id = movieSeed.id;
    tmdb.movies.getRecommendations({id}, data => {
      this.setState((prevState) => ({
        clickFeed: [...prevState.clickFeed, JSON.parse(data)],
        currentSeed: movieSeed,
      }));

    this.getCreditDetails(movieSeed);

    }, err => {
      console.error(err);
    });
  }

  getCreditDetails(movieSeed) {
    let id = movieSeed.id;
    tmdb.movies.getCredits({id: id}, (data) => {
      var parsedData = JSON.parse(data);
      this.setState({
        currentSeedCast: parsedData.cast.slice(0, 4),
      })
    }, (err) => {
      console.error(err);
    })
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
                var currentSeedLabel = this.state.currentSeed.title ? `Recommendations based on ${this.state.currentSeed.title}` : `${this.state.currentSeed} Movies`;

                return (
                  <div className="mb-8"
                    key={index}
                    id={`feed-item-${index}`}>
                    {index === 0 && (
                      <h2>Popular Movies</h2>
                    )}
                    {index > 0 && (
                      <h2>{currentSeedLabel}</h2>
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
                  {this.state.currentSeed.title && this.state.currentSeed.release_date && (
                    <h2 className="mb-4">
                      {`${this.state.currentSeed.title} (${this.state.currentSeed.release_date.slice(0, 4)})`}
                    </h2>
                  )}

                  {this.state.currentSeed.poster_path && this.state.currentSeed.overview && (
                    <div className="flex mb-8">
                      <div className="">
                        <div className="h-64 mr-4 mb-4">
                          <img className="h-full m-0 p-0 min-w-full"
                            src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${this.state.currentSeed.poster_path}`} alt=""/>
                        </div>

                        {this.state.currentSeed.id && (
                          <button className="p-2 rounded-lg shadow-md text-white bg-green"
                            onClick={() => this.playTrailer(this.state.currentSeed.id)}>
                            Watch Trailer
                          </button>
                        )}

                      </div>
                      <div className="w-1/2">
                        <div className="flex">
                          {this.state.currentSeed.vote_average && (
                            <div className="mb-4 mr-4">
                              <div className="bg-black text-white w-10 h-10 rounded-full flex flex-col justify-center items-center">
                                <span>{this.state.currentSeed.vote_average}</span>
                              </div> 
                            </div>
                          )}

                          {this.state.currentSeed.genre_ids && (
                            <div className="mb-4">
                              <ul className="flex list-reset flex-wrap">
                                {this.state.currentSeed.genre_ids.map(id => {
                                  var genreName = this.state.movieGenres.find(genre => genre.id === id).name;
                                  return (
                                    <li className="mr-2 mb-2 p-2 bg-grey-light rounded cursor-pointer text-xs"
                                      key={id}
                                      onClick={() => this.getMoviesByGenre(id, genreName)}>
                                      {genreName}
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          )}

                        </div>
                        <p className="mb-4">
                          {this.state.currentSeed.overview}
                        </p>

                        
                      </div>
                    </div>
                  )}

                  


                  

                  {this.state.currentSeedCast && (
                    <div className="">
                      <ul className="list-reset flex flex-wrap">
                        {this.state.currentSeedCast.map(castMember => {
                          let id = castMember.id;
                          let name = castMember.name;
                          let imagePath = castMember.profile_path;                     

                          return (
                            <li className="w-1/4 p-4 cursor-pointer flex flex-col items-center" 
                              key={id}
                              onClick={() => this.getMoviesByCastMember(id, name)}>
                              <div className="w-16 h-16 overflow-hidden rounded-full mb-2 relative">
                                <img className="absolute cast-member-image"
                                  src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${imagePath}`}
                                  alt=""/>
                              </div>
                              <p className="text-center">{name}</p>
                            </li>
                          )
    
                          })
                      }
                      </ul>

                    </div>
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
