<<<<<<< HEAD
import { useEffect } from 'react'
import TrackPlayer, { AddTrack, AppKilledPlaybackBehavior, Capability, RatingType, RepeatMode } from 'react-native-track-player'
import { images } from '@/constants/images'

let setupPromise: Promise<void> | null = null
=======
import { useEffect, useRef } from 'react'
import TrackPlayer, { AddTrack, AppKilledPlaybackBehavior, Capability, RatingType, RepeatMode } from 'react-native-track-player'
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

const setupPlayer = async () => {

	
<<<<<<< HEAD
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
=======
	await TrackPlayer.setupPlayer({
		maxCacheSize: 100 * 1024 * 1024, 
		autoUpdateMetadata: false,
		
		
		
	})
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3

	await TrackPlayer.updateOptions({

		
		
		ratingType: RatingType.Heart,
		capabilities: [
<<<<<<< HEAD
			Capability.SkipToPrevious,
			Capability.Play,
			Capability.Pause,
			Capability.SkipToNext,
=======
			Capability.Play,
			Capability.Pause,
			// Capability.SkipToNext,
			// Capability.SkipToPrevious,
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
			Capability.Stop,
			
			
		],
		

		notificationCapabilities:[
<<<<<<< HEAD
			Capability.SkipToPrevious,
			Capability.Play,
            Capability.Pause,
			Capability.SkipToNext,
		],
		compactCapabilities: [
			Capability.SkipToPrevious,
            Capability.Play,
			Capability.SkipToNext,
=======
			Capability.Play,
            Capability.Pause,
            Capability.Stop,
		],
		compactCapabilities: [
            Capability.Play,
            Capability.Pause,
			
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
        ],
		
		
		
		
		android: {
			
			alwaysPauseOnInterruption:true,
			appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
			
			
			
		},

		
		
<<<<<<< HEAD
		icon: images.trackPlayerIcon,
		color: 0xff03dac5,
=======
		icon: require('../assets/images/Logo.png'),
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
		
	})

	await TrackPlayer.setVolume(0.5) // not too loud
	await TrackPlayer.setRepeatMode(RepeatMode.Track)
	
	
}

export const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
	}, [onLoad])
}
export const playTrack = async (tracks: AddTrack[], index = 0) => {
	await TrackPlayer.reset();
	await TrackPlayer.add(tracks);
	await TrackPlayer.skip(index);
	await TrackPlayer.play();
  };
<<<<<<< HEAD
  
=======
  
>>>>>>> 7d68767e3b3e36ecc4e484959e2011d2fa7e78c3
