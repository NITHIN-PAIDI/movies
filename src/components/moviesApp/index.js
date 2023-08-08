import {Component} from 'react'
import './index.css'
import Loader from 'react-loader-spinner'
import {BsFilterRight} from 'react-icons/bs'
import {AiOutlineUnorderedList} from 'react-icons/ai'
import ReactPaginate from 'react-paginate'
import MovieCard from '../movieCard'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Moviesapp extends Component {
  state = {
    searchInput: '',
    filtredRating: '',
    moviesList: [],
    apiStatus: apiStatusConstants.initial,
    currentPage: 0, // Change initial page to 0
    itemsPerPage: 5,
    selectedSortingOption: 'Rating', // Default sorting option
    isAscending: false, // Default sorting order
  }

  componentDidMount() {
    this.getData()
  }

  handleSortingOptionChange = event => {
    this.setState(
      {
        selectedSortingOption: event.target.value,
        currentPage: 0, // Reset page when sorting option changes
      },
      this.sortMovies,
    )
  }

  onSubmitSearch = event => {
    event.preventDefault()
    this.getData()
  }

  handlePageChange = ({selected}) => {
    this.setState({currentPage: selected}) // Use selected page directly
  }

  getData = async () => {
    const {searchInput} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiurl = `https://api.themoviedb.org/3/search/movie?api_key=6ffe1f80823fbffe590f53b5386853a0&query=${searchInput}`

    const response = await fetch(apiurl)
    const data = await response.json()

    if (response.ok) {
      const promiseResultObject = data
      const finalData = promiseResultObject.results
      const formatedData = finalData.map(each => ({
        id: each.id,
        adult: each.adult,
        backDropPath: each.backdrop_path,
        originalLanguage: each.original_language,
        originalTitle: each.original_title,
        overview: each.overview,
        popularity: each.popularity,
        posterPath: each.poster_path,
        releaseDate: each.release_date,
        title: each.title,
        video: each.video,
        voteAverage: each.vote_average,
        voteCount: each.vote_count,
      }))

      this.setState({
        moviesList: formatedData,
        apiStatus: apiStatusConstants.success,
        currentPage: 0,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onchangeSearchinput = event => {
    this.setState({searchInput: event.target.value})
  }

  handleFilterChange = event => {
    this.setState({filtredRating: event.target.value}, this.filterMovies)
  }

  filterMovies = () => {
    const {filtredRating, moviesList} = this.state

    const filteredMovies = moviesList.filter(
      movie => movie.voteAverage >= parseFloat(filtredRating),
    )

    this.setState({moviesList: filteredMovies})
  }

  sortMovies = () => {
    const {selectedSortingOption, isAscending, moviesList} = this.state
    const sortedMovies = [...moviesList]

    if (selectedSortingOption === 'Rating') {
      sortedMovies.sort((a, b) =>
        isAscending
          ? a.voteAverage - b.voteAverage
          : b.voteAverage - a.voteAverage,
      )
    } else if (selectedSortingOption === 'Release Date') {
      sortedMovies.sort((a, b) =>
        isAscending
          ? new Date(a.releaseDate) - new Date(b.releaseDate)
          : new Date(b.releaseDate) - new Date(a.releaseDate),
      )
    }

    this.setState({moviesList: sortedMovies})
  }

  renderMoviesListView = () => {
    const {moviesList, currentPage, itemsPerPage} = this.state
    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentMovies = moviesList.slice(startIndex, endIndex)

    return (
      <div>
        {moviesList.length > 0 ? (
          currentMovies.map(each => (
            <MovieCard key={each.id} movieDetails={each} />
          ))
        ) : (
          <div>
            <h1 className="search-heading">
              Search the movies in the search bar to get movie details
            </h1>
          </div>
        )}
      </div>
    )
  }

  renderFailureView = () => <h1>Failure</h1>

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderMoviesLists = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMoviesListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {
      searchInput,
      moviesList,
      itemsPerPage,
      filtredRating,
      selectedSortingOption,
    } = this.state
    const pageCount = Math.ceil(moviesList.length / itemsPerPage)
    return (
      <div className="bg-container">
        <form className="header-section" onSubmit={this.onSubmitSearch}>
          <h1 className="heading">Netflix</h1>
          <>
            <input
              className="search-input"
              type="search"
              value={searchInput}
              placeholder="Movie Name"
              onChange={this.onchangeSearchinput}
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </>
          {moviesList.length > 0 && (
            <div className="filter-container">
              <BsFilterRight className="filter-img" />
              <input
                type="number"
                className="input-filter"
                placeholder="Filter by rating"
                value={filtredRating}
                onChange={this.handleFilterChange}
              />
            </div>
          )}
          {moviesList.length > 0 && (
            <div className="filter-container">
              <AiOutlineUnorderedList className="order-img" />
              <select
                className="input-filter"
                value={selectedSortingOption}
                onChange={this.handleSortingOptionChange}
              >
                <option value="Rating">Rating</option>
                <option value="Release Date">Release Date</option>
              </select>
            </div>
          )}
        </form>

        <div className="movies_list_container">{this.renderMoviesLists()}</div>
        {pageCount > 1 && (
          <div className="pagination-controls">
            <ReactPaginate
              previousLabel="Previous"
              nextLabel="Next"
              pageCount={pageCount}
              onPageChange={this.handlePageChange}
              containerClassName="pagination"
              activeClassName="active"
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
            />
          </div>
        )}
      </div>
    )
  }
}

export default Moviesapp
