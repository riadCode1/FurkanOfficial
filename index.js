import { AppRegistry } from 'react-native';
import app from "./app";
import TrackPlayer from 'react-native-track-player';
import service from './service';

AppRegistry.registerComponent('YourAppName', () => app);
TrackPlayer.registerPlaybackService(() => service);

// Import your global CSS file


