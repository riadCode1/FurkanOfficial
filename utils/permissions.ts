import * as Location from 'expo-location';
import { createLogger } from './logger';

const logger = createLogger('Permissions');

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

/**
 * Request location permission and get current location
 * @returns LocationData if successful, null otherwise
 */
export async function requestLocationPermission(): Promise<LocationData | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      logger.warn('Location permission denied');
      return null;
    }

    logger.info('Location permission granted');
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;

    // Try to get reverse geocoding info
    try {
      const geocodedLocation = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocodedLocation.length > 0) {
        const { city, country } = geocodedLocation[0];
        return {
          latitude,
          longitude,
          city: city || undefined,
          country: country || undefined,
        };
      }
    } catch (error) {
      logger.warn('Reverse geocoding failed', error);
    }

    return {
      latitude,
      longitude,
    };
  } catch (error) {
    logger.error('Failed to get location', error);
    return null;
  }
}

/**
 * Check if location permission is granted (without requesting)
 */
export async function checkLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    logger.error('Failed to check location permission', error);
    return false;
  }
}

/**
 * Get current location without requesting permission
 * (Only works if permission is already granted)
 */
export async function getCurrentLocation(): Promise<LocationData | null> {
  try {
    const hasPermission = await checkLocationPermission();

    if (!hasPermission) {
      logger.warn('Location permission not granted');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = location.coords;

    try {
      const geocodedLocation = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocodedLocation.length > 0) {
        const { city, country } = geocodedLocation[0];
        return {
          latitude,
          longitude,
          city: city || undefined,
          country: country || undefined,
        };
      }
    } catch (error) {
      logger.warn('Reverse geocoding failed', error);
    }

    return {
      latitude,
      longitude,
    };
  } catch (error) {
    logger.error('Failed to get current location', error);
    return null;
  }
}
