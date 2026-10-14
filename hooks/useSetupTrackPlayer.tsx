import { useEffect } from 'react'
import TrackPlayer, { AddTrack, AppKilledPlaybackBehavior, Capability, RatingType, RepeatMode } from 'react-native-track-player'
import { images } from '@/constants/images'

let setupPromise: Promise<void> | null = null

const setupPlayer = async () => {

	
	try {
		await TrackPlayer.setupPlayer({
			maxCacheSize: 100 * 1024 * 1024,
			autoUpdateMetadata: true,
		})
	} catch (error) {
		if (!(error instanceof Error) || !error.message.includes('already been initialized')) {
			throw error
		}
	}

	await TrackPlayer.updateOptions({

		
		
		ratingType: RatingType.Heart,
		capabilities: [
			Capability.SkipToPrevious,
			Capability.Play,
			Capability.Pause,
			Capability.SkipToNext,
			Capability.Stop,
			
			
		],
		

		notificationCapabilities:[
			Capability.SkipToPrevious,
			Capability.Play,
            Capability.Pause,
			Capability.SkipToNext,
		],
		compactCapabilities: [
			Capability.SkipToPrevious,
            Capability.Play,
			Capability.SkipToNext,
        ],
		
		
		
		
		android: {
			
			alwaysPauseOnInterruption:true,
			appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
			
			
			
		},

		
		
		icon: images.trackPlayerIcon,
		color: 0xff03dac5,
		
	})

	await TrackPlayer.setVolume(0.5) // not too loud
	await TrackPlayer.setRepeatMode(RepeatMode.Track)
	
	
}

export const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
	useEffect(() => {
		if (!setupPromise) {
			setupPromise = setupPlayer().catch((error) => {
				setupPromise = null
				throw error
			})
		}

		setupPromise
			.then(() => onLoad?.())
			.catch((error) => console.error(error))
	}, [onLoad])
}
export const playTrack = async (tracks: AddTrack[], index = 0) => {
	await TrackPlayer.reset();
	await TrackPlayer.add(tracks);
	await TrackPlayer.skip(index);
	await TrackPlayer.play();
  };
  
