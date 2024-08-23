const APIController = (function() {
    
    const clientId = '9b1269b2405a4e1592ed0a78e699bab9';
    const clientSecret = '976a05b2419c4fe78623d992dbdcd0ef';

    // private methods
    const _getToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        const data = await result.json();
        return data.access_token;
    }
    const _getGenres = async (token) => {
        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data.categories.items;
    }
    const _getPlaylistByGenre = async (token, genreId) => {
        const limit = 10;
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data.playlists.items;
    }
    const _getArtistsByArtist = async (token, artistName) => {
        const limit = 1;
        const result = await fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=artist&limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data.artists.items;
    }
    const _getAlbums = async (token, artistId) => {
        const limit = 10;
        const result = await fetch(`${artistId}/albums`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data.items;
    }
    const _getTracks = async (token, tracksEndPoint) => {
        const limit = 10;
        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data.items;
    }
    const _getTrack = async (token, trackEndPoint) => {
        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data;
    }
    return {
        getToken() {
            return _getToken();
        },
        getArtistsByArtist(token, artistId) {
            return _getArtistsByArtist(token, artistId);
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getArtistsByArtist(token, artistName) {
            return _getArtistsByArtist(token, artistName);
        },
        getAlbums(token, artistId) {
            return _getAlbums(token, artistId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();


// UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list',
        searchArtist: '#search_artist',
        buttonSubmit2: '#btn_submit2',
        divArtistlist: '.artist-list',
        divAlbumlist: '.album-list',
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail),
                artist: document.querySelector(DOMElements.searchArtist),
                submit2: document.querySelector(DOMElements.buttonSubmit2),
                artists2: document.querySelector(DOMElements.divArtistlist),
                albums: document.querySelector(DOMElements.divAlbumlist)
            }
        },

        // need methods to create select list option
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        }, 
        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },
        // need method to create a track list group item 
        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },
        createArtist2(id, name, img) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name} <img src="${img}" align="right" style="border-radius: 50%;"> </a>`;
            document.querySelector(DOMElements.divArtistlist).insertAdjacentHTML('beforeend', html);
        },
        createAlbums(id, name, img) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name} <img src="${img}" align="right"> </a>`;
            document.querySelector(DOMElements.divAlbumlist).insertAdjacentHTML('beforeend', html);
        },
        // need method to create the song detail
        createTrackDetail(img, title, artist) {
            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            // any time user clicks a new song, we need to clear out the song detail div
            detailDiv.innerHTML = '';

            const html = 
            `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">        
            </div>
            <div class="row col-sm-12 px-0">
                <label for="Genre" class="form-label col-sm-12">${title}:</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
            </div> 
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },
        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },
        resetAlbumDetail() {
            this.inputField().songDetail.innerHTML = '';
        },
        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },
        resetAlbums() {
            this.inputField().albums.innerHTML = '';
            this.resetAlbumDetail();
        },
        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },
        resetArtists2() {
            this.inputField().artists2.innerHTML = '';
        },
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },
        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    // get genres on page load
    const loadGenres = async () => {
        //get the token
        const token = await APICtrl.getToken();           
        //store the token onto the page
        UICtrl.storeToken(token);
        //get the genres
        const genres = await APICtrl.getGenres(token);
        //populate our genres select element
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    }

    // create genre change event listener
    DOMInputs.genre.addEventListener('change', async () => {
        //reset the playlist
        UICtrl.resetPlaylist();
        //get the token that's stored on the page
        const token = UICtrl.getStoredToken().token;        
        // get the genre select field
        const genreSelect = UICtrl.inputField().genre;       
        // get the genre id associated with the selected genre
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;             
        // get the playlist based on a genre
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);       
        // create a playlist list item for every playlist returned
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });
     

    // create submit button click event listener
    DOMInputs.submit.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // clear tracks
        UICtrl.resetTracks();
        //get the token
        const token = UICtrl.getStoredToken().token;        
        // get the playlist field
        const playlistSelect = UICtrl.inputField().playlist;
        // get track endpoint based on the selected playlist
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        // get the list of tracks
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        // create a track list item
        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
        
    });

    // create submit button click event listener
    DOMInputs.submit2.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetArtists2();
        UICtrl.resetAlbums();
        //get the token
        const token = UICtrl.getStoredToken().token;        
        // get the playlist field
        const artistSearch = UICtrl.inputField().artist;
        // get track endpoint based on the selected playlist
        const artistName = artistSearch.value;
        // get the list of tracks

        const artists = await APICtrl.getArtistsByArtist(token, artistName);
        // create a track list item
        artists.forEach(a => UICtrl.createArtist2(a.href, a.name, a.images[0].url))
    });

    // create song selection click event listener
    DOMInputs.tracks.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetTrackDetail();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the track endpoint
        const trackEndpoint = e.target.id;
        //get the track object
        const track = await APICtrl.getTrack(token, trackEndpoint);
        // load the track details
        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
    });    

    // create song selection click event listener
    DOMInputs.artists2.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the track endpoint
        const artistId = e.target.id;
        console.log(artistId);
        //get the track object
        const albums = await APICtrl.getAlbums(token, artistId);
        // load the track details
        albums.forEach(a => UICtrl.createAlbums(a.href, a.name, a.images[0].url))
    }); 

    return {
        init() {
            console.log('App is starting');
            loadGenres();
        }
    }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();

