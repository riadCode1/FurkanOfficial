import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';

import StyleSheet from 'react-native-media-query';


const Read = ({ id }) => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const API_URL = `https://api.quran.com/api/v4/quran/verses/indopak?chapter_number=${id}`; // Removed extra space

    const getSurahs = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        setSurahs(data.verses);
        
      } catch (error) {
        console.error("Error fetching Quran data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getSurahs(); 
  }, [id]);

 

  return (
    <View style={styles.container}>
      <View style={{marginBottom:18}}>
        <Text style={[styles.text,{fontSize:25}]}>
              
              {" ﴿بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِيۡمِ ﴾"}
            </Text>
      </View>
       
      {surahs.map((item) => (
        <View key={item.id.toString()} style={styles.item}>
          <Text style={styles.text}>
            {item.text_indopak}
          </Text>
          <View style={{ width: 30, height: 30,alignItems:"center", alignSelf: "center",justifyContent:"center" }}>
          
            <Text style={{fontSize:20 }}>
            ۝ 
            </Text>
            <Text style={{position:"absolute",fontSize:10}}>
              {item.verse_key.slice(2)}
            </Text>

            
          </View>
        </View>
      ))}
    </View>
  );
};

const {styles} = StyleSheet.create({
  container: { 
    
    backgroundColor: "#FFF5C9",
    paddingHorizontal: 16,
    paddingTop:16,
    '@media (min-width: 768px)': {
      paddingHorizontal:32
        },
    
    
    alignItems:"center" // Responsive padding
  },
  listContent: {
   
    paddingBottom: (200),
    paddingHorizontal:16
  },
  text: {
    
    fontSize: (18), // Responsive font size
    fontFamily: 'DMSans-Regular',
    textAlign: "center", // Changed to right for Arabic text
    lineHeight: (30),
    color: '#2D2926',
    
  },
  item: {
    
    justifyContent:"center"
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFF5C9",
  },
  errorText: {
    color: 'red',
    fontSize: (16),
    textAlign: 'center',
    
  },
});

export default Read;