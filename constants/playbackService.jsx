import TrackPlayer, { Event } from 'react-native-track-player'
import { navigateToAdjacentSurah } from './trackNavigation'

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
		void navigateToAdjacentSurah(1).catch((error) => {
			console.error('Could not play the next Surah:', error)
		})
		
	})

	TrackPlayer.addEventListener(Event.RemotePrevious, () => {
		void navigateToAdjacentSurah(-1).catch((error) => {
			console.error('Could not play the previous Surah:', error)
		})
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
