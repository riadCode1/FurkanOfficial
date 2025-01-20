import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlaylistScreen = () => {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const storedPlaylist = await AsyncStorage.getItem('playlist');
        setPlaylist(storedPlaylist ? JSON.parse(storedPlaylist) : []);
       
      } catch (e) {
        console.error(e);
      }
    };

    loadPlaylist();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 10 }}>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
      <FlatList
        data={playlist}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default PlaylistScreen;
