import './index.css'

const MovieCard = props => {
  const {movieDetails} = props
  console.log(movieDetails)
  const {
    id,
    overview,
    popularity,
    posterPath,
    releaseDate,
    title,
    voteAverage,
  } = movieDetails
  // console.log(posterPath)

  return (
    <div className="movie-card-container">
      <img
        src={`https://image.tmdb.org/t/p/w400${posterPath}`}
        alt={id}
        className="movie-poster"
      />
      <div className="movie-description">
        <h1>{title}</h1>
        <p>RELEASE DATE : {releaseDate}</p>
        <p>RATING : {voteAverage}</p>
        <p>{overview}</p>
        <p>POPULARITY:{popularity}</p>
      </div>
    </div>
  )
}

export default MovieCard
