import "./App.css";
import { SearchBar } from "./../SearchBar/SearchBar";
import { SearchResults } from "./../SearchResults/SearchResults";
import { Playlist } from "./../Playlist/Playlist";
import Spotify from "./../../util/Spotify";
import React from "react";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "Playlist Name",
      playlistTracks: [],
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.includes(track.id)) { 
      // If track already is there do nothing
      return;
    } else {
      const playlistUpdate = this.state.playlistTracks; // Add track array to playlistUpdate 
      playlistUpdate.push(track); // Push new track

      this.setState({ playlistTracks: playlistUpdate }); // Set new state
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter((currentTrack) => currentTrack.id !== track.id); 
    // Create new array with every track except the one to delete

    this.setState({ playlistTracks: tracks }); // SetState to new array
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map((track) => track.uri); // Create Array with all Uris
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {  
      this.setState({ // Reset playlist List
        playlistName: "New Playlist",
        playlistTracks: [],
      });
    });
  }

  search(term) {
    Spotify.search(term).then((searchResults) => {
      this.setState({ searchResults: searchResults });
    });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}
