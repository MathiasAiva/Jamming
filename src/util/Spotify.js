const id = "YOUR APP ID";
const uri = "YOUR REDIRECT URI, IF YOU WNT TO TEST LOCALLY ADD THE LOCAL ADRESS";
// Remember to add the redirect uri in  your spotify app too https://developer.spotify.com/dashboard/applications

let accessToken;

let Spotify = {
    getAccessToken(){ // Returns the access token used in the rest of the App 
        if(accessToken){
            return accessToken;
        }

        // Find the AccessToken Match and Expires In Match in the Link
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if(accessTokenMatch && expiresInMatch){ // If both are set:
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }else{ //If there isn't a match, then redirect the user to a window to log in 
            window.location = `https://accounts.spotify.com/authorize?client_id=${id}&response_type=token&scope=playlist-modify-public&redirect_uri=${uri}`;
        }
    },

    search(term){ // Search function, gets the tracks
        const accessToken = this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { //Fetch Tracks
            headers: {
              Authorization: `Bearer ${accessToken}` 
            }
          }).then(response => {
            if(response.ok){
                return response.json();
            } // If it did work, return the response, else throw error:
            throw new Error('Request Failed!'); 
            }, networkError => console.log(networkError.message)

        ).then(jsonResponse => { // Continue but with the working response
            if(!jsonResponse.tracks){
                return [];
            } 
            return jsonResponse.tracks.items.map(track => ({ //Map each track and return a object 
                id:track.id,
                name:track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    savePlaylist(name, trackUris) { // When the playlist is saved, POST
        if (!name || !trackUris.length) {
          return;
        }
    
        const accessToken = Spotify.getAccessToken();  
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;
    
        return fetch('https://api.spotify.com/v1/me', {headers: headers} // GET user ID
        ).then(response => response.json() 
        ).then(jsonResponse => {
          userId = jsonResponse.id;  
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, { 
            // POST, Create new Playlist
            headers: headers,
            method: 'POST',
            body: JSON.stringify({name: name})
          }).then(response => response.json()
          ).then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
              // POST, add tracks to previous created playlist  
              headers: headers,
              method: 'POST',
              body: JSON.stringify({uris: trackUris})
            });
          });
        });
      }
    };

    

export default Spotify;