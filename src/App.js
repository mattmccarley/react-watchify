import React, { Component } from 'react';
import tmdb from 'themoviedb-javascript-library';
import {debounce} from 'lodash';
import { encode } from 'punycode';


class App extends Component {
  constructor(props) {
    super(props);
    tmdb.common.api_key = '1d332297db144df89557e1d191ef8368';
    tmdb.common.base_uri = 'https://api.themoviedb.org/3/';
    
    this.state = {
      quickList: [],
      clickFeed: [],

      searchInputValue: '',
      isSearching: false,
      movieSearchResults: null,

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
    this.addToQuickList = this.addToQuickList.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.searchForMovies = debounce(this.searchForMovies, 1000);
    this.searchForCastMembers = debounce(this.searchForCastMembers, 1000);
    this.handleSearchMovieClick = this.handleSearchMovieClick.bind(this);
    this.handleSearchActorClick = this.handleSearchActorClick.bind(this);
  }

  componentWillMount() {
    this.getPopularMovies();
    this.getMovieGenreList();
  }

  componentDidUpdate() {
    if (this.state.clickFeed.length > 0 && !this.state.isSearching) {
      const element = document.getElementById(`feed-item-${this.state.clickFeed.length - 1}`);
      element.scrollIntoView({behavior: 'smooth'});
    }
  }

  getPopularMovies() {
    tmdb.movies.getPopular({}, (data) => {
      var parsedData = JSON.parse(data);
      this.setState((prevState) => ({
        clickFeed: [...prevState.clickFeed, parsedData.results.slice(0, 12)],
        currentSeed: JSON.parse(data),
      }));
    }, (err) => {
      console.error(err);
    });
  }

  getMovieGenreList() {
    if (!this.state.movieGenres) {
      tmdb.genres.getMovieList({}, (data) => {
        var parsedData = JSON.parse(data);
        this.setState({
          movieGenres: parsedData.genres,
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
        clickFeed: [...prevState.clickFeed, parsedData.results.slice(0, 12)],
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
        clickFeed: [...prevState.clickFeed, parsedData.results.slice(0, 12)],
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
      var parsedData = JSON.parse(data);
      this.setState((prevState) => ({
        clickFeed: [...prevState.clickFeed, parsedData.results.slice(0, 12)],
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

  addToQuickList(movie) {
    if (!this.state.quickList.includes(movie)) {
      this.setState((prevState) => ({
        quickList: [...prevState.quickList, movie]
      }));
    }
  }

  handleSearch(event) {
    
    const value = event.target.value;
    
    this.setState({
      searchInputValue: value,
      isSearching: value !== '',
    });

    this.searchForMovies(value);
    this.searchForCastMembers(value);
  }
  
  searchForMovies(value) {
    tmdb.search.getMovie({
      "query": encodeURI(value)
    }, (data) => {
      let parsedData = JSON.parse(data);
      this.setState({
        movieSearchResults: parsedData.results.slice(0,12),
      });
    }, (err) => {
      console.error(err);
  
    });
  }

  searchForCastMembers(value) {
    tmdb.search.getPerson({
      "query": encodeURI(value)
    }, (data) => {
      let parsedData = JSON.parse(data);
      this.setState({
        castMemberSearchResults: parsedData.results.slice(0, 12),
      });
    }, (err) => {
      console.error(err);
    })
  }

  handleSearchMovieClick(movie) {
    this.getRecommendedMovies(movie);
    this.setState({
      isSearching: false,
      searchInputValue: '',
    });
  }

  handleSearchActorClick(actorId, actorName) {
    this.getMoviesByCastMember(actorId, actorName);
    this.setState({
      isSearching: false,
      searchInputValue: '',
    });
  }

  render() {
    return (
      <div>
        <div className="flex justify-between bg-yellow-dark fixed pin-t pin-l pin-r px-8 py-4 shadow">
          <h1>Watchify</h1>
          <div>
            <button className="bg-black p-2 text-white uppercase font-thin text-xs rounded">
              {`Quick List: ${this.state.quickList.length}`}
            </button>
          </div>
        </div>
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
        
        <div className="flex mt-16">
          <div className="p-8 w-2/3">
            <input className="p-4 rounded-full bg-grey-light w-full mb-4"
              placeholder="search by movie title, cast member name, or keyword"
              onChange={this.handleSearch}
              type="text"
              value={this.state.searchInputValue}></input>


            {this.state.isSearching && (
              <div className="mt-16">
                {this.state.movieSearchResults && (
                  <div>
                    <h2>Movies</h2>
                    <div className="flex flex-wrap">
                    {this.state.movieSearchResults.map(movie => {
                      return (
                          <div className="m-0 p-0 w-1/6 cursor-pointer"
                            key={movie.id}
                            onClick={() => this.handleSearchMovieClick(movie)}>
                            <img className="h-full w-full m-0 p-0"
                              src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${movie.poster_path}`} alt=""/>
                          </div>
                      )
                    })}
                    </div>
                  </div>
                )}

                {this.state.castMemberSearchResults && (
                  <div>
                    <h2>Actors</h2>
                    <div className="flex flex-wrap">
                    {this.state.castMemberSearchResults.map(castMember => {
                      let id = castMember.id;
                      let name = castMember.name;
                      let imagePath = castMember.profile_path;                     

                      return (
                        <div className="w-1/4 p-4 cursor-pointer flex flex-col items-center" 
                          key={id}
                          onClick={() => this.handleSearchActorClick(id, name)}>
                          <div className="w-16 h-16 overflow-hidden rounded-full mb-2 relative">
                            <img className="absolute cast-member-image"
                              src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${imagePath}`}
                              alt=""/>
                          </div>
                          <p className="text-center">{name}</p>
                        </div>
                      )
                    })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {this.state.clickFeed && !this.state.isSearching &&
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
                      {feedItem.map(movie => {
                        return (
                          <div className="m-0 p-0 w-1/6 cursor-pointer"
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
          <div className="p-8 w-1/3 fixed pin-t pin-b pin-r mt-16">
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
                          <img className="h-full m-0 p-0 w-auto"
                            src={`https://image.tmdb.org/t/p/w370_and_h556_bestv2${this.state.currentSeed.poster_path}`} alt=""/>
                        </div>

                        {this.state.currentSeed.id && (
                          <div className="">
                            <button className="p-2 rounded-lg shadow text-white bg-green mb-2 mr-2"
                              onClick={() => this.playTrailer(this.state.currentSeed.id)}>
                              Watch Trailer
                            </button>
                            <button className="p-2 rounded-lg shadow text-white bg-black mb-2 mr-2"
                              onClick={() => this.addToQuickList(this.state.currentSeed)}>
                              + Quick List
                            </button>
                            <a className ="p-2 rounded-lg shadow text-blue bg-grey-lightest cursor-pointer no-underline"
                              href={`https://www.google.com/search?q=${this.state.currentSeed.title}+Movie+${this.state.currentSeed.release_date.slice(0,4)}`}
                              target="_blank"
                              rel="noopener noreferrer">
                              Where To Watch
                            </a>
                          </div>
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
