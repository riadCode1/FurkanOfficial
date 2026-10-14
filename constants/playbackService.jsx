import TrackPlayer, { Event } from 'react-native-track-player'
<<<<<<< HEAD
import { navigateToAdjacentSurah } from './trackNavigation'
=======
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

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
<<<<<<< HEAD
		void navigateToAdjacentSurah(1).catch((error) => {
			console.error('Could not play the next Surah:', error)
		})
=======
		TrackPlayer.skipToNext()
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
		
	})

	TrackPlayer.addEventListener(Event.RemotePrevious, () => {
<<<<<<< HEAD
		void navigateToAdjacentSurah(-1).catch((error) => {
			console.error('Could not play the previous Surah:', error)
		})
=======
		TrackPlayer.skipToPrevious()
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
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
	
<<<<<<< HEAD
}
=======
}
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
