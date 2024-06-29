async function fetchMovieDataOMDB(title) {
    const apiKey = 'e5a0f4ec';
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie data:', error);
        return null;
    }
}

async function fetchMoviesFromEndpoint(endpoint, apiKey, query) {
    const apiUrl = `https://api.themoviedb.org/3/discover/${endpoint}?api_key=${apiKey}&with_genres=${query}&language=en-US&page=1`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(`Error fetching movies from ${endpoint}:`, error);
        return [];
    }
}

async function fetchAndDisplayMoviesFromTMDB(sectionId, endpoint, apiKey, query) {
    const section = document.getElementById(sectionId);
    const movieList = section.querySelector('.movie-list');
    const movies = await fetchMoviesFromEndpoint(endpoint, apiKey, query);

    for (let i = 0; i < movies.length; i++) {
        const movieData = movies[i];
        const movieDataOMDB = await fetchMovieDataOMDB(movieData.title);

        if (movieData && movieData.poster_path && movieData.title && movieData.id) {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            const posterLink = document.createElement('a');
            const data = {
                title: movieData.title,
                id: movieData.id,
                overview: movieData.overview,
                year: movieDataOMDB.Year,
                rated: movieDataOMDB.Rated,
                runtime: movieDataOMDB.Runtime,
                genre: movieDataOMDB.Genre,
                director: movieDataOMDB.Director,
                writer: movieDataOMDB.Writer,
                actors: movieDataOMDB.Actors,
                language: movieDataOMDB.Language,
                imdbRating: movieDataOMDB.imdbRating,
                type: movieDataOMDB.Type
            };

            const jsonString = JSON.stringify(data);
            posterLink.href = `../pages/movie.html?data=${encodeURIComponent(jsonString)}`;

            const posterImg = document.createElement('img');
            posterImg.classList.add('movie-poster');
            posterImg.src = `https://image.tmdb.org/t/p/w185${movieData.poster_path}`;
            posterImg.alt = `${movieData.title} Poster`;

            posterLink.appendChild(posterImg);
            movieCard.appendChild(posterLink);
            movieList.appendChild(movieCard);
        }
    }
}

async function displayMovies() {
    const apiKey = '658ba67b70b3250e143baea3e67e1c9e';

    await fetchAndDisplayMoviesFromTMDB('horror', 'tv', apiKey, '27');
    await fetchAndDisplayMoviesFromTMDB('comedy', 'tv', apiKey, '35');
    await fetchAndDisplayMoviesFromTMDB('romance', 'tv', apiKey, '10749');
}

displayMovies();

// Search

document.getElementById('play-button').addEventListener('click', function() {
    var movieTitle = document.getElementById('movie-search').value.trim();
    if (movieTitle !== '') {
        const movieData = {
            title: movieTitle
        };
        const jsonString = JSON.stringify(movieData);
        window.location.href = '../sections/search.html?data=' + encodeURIComponent(jsonString);
    } else {
        alert('Please enter a movie title.');
    }
});