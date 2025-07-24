import { useEffect, useRef } from 'react'
import TrackPlayer, { AddTrack, AppKilledPlaybackBehavior, Capability, RatingType, RepeatMode } from 'react-native-track-player'

const setupPlayer = async () => {

	
	await TrackPlayer.setupPlayer({
		maxCacheSize: 100 * 1024 * 1024, 
		autoUpdateMetadata: false,
		
		
		
	})

	await TrackPlayer.updateOptions({
		
		ratingType: RatingType.Heart,
		capabilities: [
			Capability.Play,
			Capability.Pause,
			// Capability.SkipToNext,
			// Capability.SkipToPrevious,
			Capability.Stop,
			
			
		],
		

		notificationCapabilities:[
			Capability.Play,
            Capability.Pause,
            Capability.Stop,
		],
		compactCapabilities: [
            Capability.Play,
            Capability.Pause,
			
        ],
		
		
		
		
		android: {
			
			alwaysPauseOnInterruption:true,
			appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
			
			
			
		},

		
		
		
	})

	await TrackPlayer.setVolume(0.5) // not too loud
	await TrackPlayer.setRepeatMode(RepeatMode.Track)
	
	
}

export const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
	const isInitialized = useRef(false)

	useEffect(() => {
		if (isInitialized.current) return

		setupPlayer()
			.then(() => {
				isInitialized.current = true
				onLoad?.()
			})
			.catch((error) => {
				isInitialized.current = false
				console.error(error)
			})
	}, [onLoad])
}
export const playTrack = async (tracks: AddTrack[], index = 0) => {
	await TrackPlayer.reset();
	await TrackPlayer.add(tracks);
	await TrackPlayer.skip(index);
	await TrackPlayer.play();
  };
  