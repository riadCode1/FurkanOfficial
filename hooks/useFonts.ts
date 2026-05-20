import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'aljazeera': require('../assets/fonts/Aljazeera.ttf'),
        "font":require("../assets/fonts/BadeenDisplay-Regular.ttf"),
        
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  return fontsLoaded;
};

export default useFonts;
