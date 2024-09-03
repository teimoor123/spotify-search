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
    const _getArtistsByArtist = async (token, artistName) => {
        const limit = 10;
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
    const _getTracks = async (token, albumEndPoint) => {
        const limit = 10;
        console.log(`${albumEndPoint}/tracks`);
        const result = await fetch(`${albumEndPoint}/tracks`, {
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
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list',
        searchArtist: '#search_artist',
        buttonSubmit2: '#btn_submit2',
        artistsResultsHeader: '#artist-results-header',
        divArtistlist: '.artist-list',
        albumsResultsHeader: '#album-results-header',
        divAlbumlist: '.album-list',
        songsResultsHeader: '#song-results-header',
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                tracks: document.querySelector(DOMElements.divSonglist),
                songDetail: document.querySelector(DOMElements.divSongDetail),
                artist: document.querySelector(DOMElements.searchArtist),
                submit2: document.querySelector(DOMElements.buttonSubmit2),
                artistsResults: document.querySelector(DOMElements.artistsResultsHeader),
                artists2: document.querySelector(DOMElements.divArtistlist),
                artistsResults: document.querySelector(DOMElements.albumsResultsHeader),
                albums: document.querySelector(DOMElements.divAlbumlist),
                songResultsHeader: document.querySelector(DOMElements.songsResultsHeader)
            }
        },
        // need method to create a track list group item 
        createTrack(id, name, img) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name} <img src="${img}" align="right" style=" width: 50px; height: 50px;"> </a>`
            document.querySelector(DOMElements.songsResultsHeader).innerHTML = '<h2>Songs</h2>';
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },
        createArtist2(id, name, img) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name} <img src="${img}" align="right" style="border-radius: 50%; width: 50px; height: 50px;"> </a>`;
            document.querySelector(DOMElements.artistsResultsHeader).innerHTML = '<h2>Artists</h2>';
            document.querySelector(DOMElements.divArtistlist).insertAdjacentHTML('beforeend', html);
        },
        createAlbum(id, name, img) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}" data-img="${img}">
                ${name} <img src="${img}" align="right" style="width: 50px; height: 50px;">
            </a>`
            document.querySelector(DOMElements.albumsResultsHeader).innerHTML = '<h2>Albums</h2>';
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
                <label for="Genre" class="form-label col-sm-12">${title}</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By: ${artist}</label>
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

    const loadToken = async () => {
        //get the token
        const token = await APICtrl.getToken();           
        //store the token onto the page
        UICtrl.storeToken(token);
    }

    // create submit button click event listener
    DOMInputs.submit2.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // reset artist and album options
        UICtrl.resetArtists2();
        UICtrl.resetAlbums();
        //get the token
        const token = UICtrl.getStoredToken().token;        
        // get the artist field
        const artistSearch = UICtrl.inputField().artist;
        // get artist endpoint based on the searched name
        const artistName = artistSearch.value;
        // get the list of artists
        const artists = await APICtrl.getArtistsByArtist(token, artistName);
        // create a artist list item
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

    // create album selection click event listener
    DOMInputs.artists2.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetAlbums();
        UICtrl.resetTracks();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the artist endpoint
        const artistId = e.target.id;
        //get the albums object
        const albums = await APICtrl.getAlbums(token, artistId);
        // load the albums details
        albums.forEach(a => UICtrl.createAlbum(a.href, a.name, a.images[0].url))
    }); 

    // create track selection click event listener
    DOMInputs.albums.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetTracks();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the artist endpoint
        const albumId = e.target.id;
        // get the album cover
        const img = e.target.getAttribute('data-img');
        //get the albums object
        const tracks = await APICtrl.getTracks(token, albumId);
        // load the albums details
        tracks.forEach(t => UICtrl.createTrack(t.href, t.name, img))
    }); 

    return {
        init() {
            console.log('App is starting');
            loadToken();
        }
    }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();

