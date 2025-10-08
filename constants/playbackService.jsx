import TrackPlayer, { Event } from 'react-native-track-player'

export const playbackService = async () => {
	TrackPlayer.addEventListener(Event.RemotePlay, () => {
		TrackPlayer.play()
	})

	TrackPlayer.addEventListener(Event.RemotePause, () => {
		TrackPlayer.pause()
	})

	TrackPlayer.addEventListener(Event.RemoteStop, () => {
		TrackPlayer.stop()
	})

	TrackPlayer.addEventListener(Event.RemoteNext, () => {
		TrackPlayer.skipToNext()
		
	})

	TrackPlayer.addEventListener(Event.RemotePrevious, () => {
		TrackPlayer.skipToPrevious()
	})

	// TrackPlayer.addEventListener('playback-track-changed', async (data) => {
		
	// 	const track = await TrackPlayer.getTrack(data.nextTrack);
	// 	if (track) {
	// 	  await TrackPlayer.updateMetadataForTrack(track.id, {
	// 		title: "rack.title",
	// 		artist: track.artist,
	// 		artwork: track.artwork, // Add artwork for the notification
	// 	  });
	// 	}
	//   });
	
}