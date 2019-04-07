import React, { Component } from 'react';
import { Text, View, Dimensions, Image, FlatList } from 'react-native';

const width = Dimensions.get('screen').width;

export default class Feed extends Component {
  render() {
    const fotos = [
      { id: 1, usuario: 'rafaela' },
      { id: 2, usuario: 'alberto' },
      { id: 3, usuario: 'vitor' },
    ];

    return (
      <FlatList
        keyExtractor={item => (item.id + item.usuario)}
        data={fotos}
        renderItem={({ item }) =>
          <View style={{marginTop: 20}}>
            <Text>{item.usuario}</Text>
            <Image source={require('./resources/img/alura.png')}
              style={{ width: width, height: width }} />
          </View>
        }
      />
    );
  }
}
