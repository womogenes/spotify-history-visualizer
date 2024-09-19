export const parseHistoryJSON = (json: string) => {
	return JSON.parse(json).map((stream) => ({
		ts: stream.ts,
		track_name: stream.master_metadata_track_name,
		artist_name: stream.master_metadata_artist_name,
		album_name: stream.master_metadata_album_name,
		spotify_track_uri: stream.spotify_track_uri
	}));
};
