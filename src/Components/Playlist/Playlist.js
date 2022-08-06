import "./Playlist.css";
import { Tracklist } from "./../Tracklist/Tracklist";
import React from "react";

export class Playlist extends React.Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(event) {
    let value = event.target.value;
    this.props.onNameChange(value);
  }

  render() {
    return (
      <div className="Playlist">
        <input
          defaultValue="Create New Playlist"
          value={this.props.playlistName}
          onChange={this.handleNameChange}
        />
        <Tracklist
          tracks={this.props.playlistTracks}
          onRemove={this.props.onRemove}
          isRemoval={true}
        />
        <button className="Playlist-save" onClick={this.props.onSave}>
          SAVE TO SPOTIFY
        </button>
      </div>
    );
  }
}
