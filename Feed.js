import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Post from './src/components/Post';

export default class Feed extends Component {
  constructor() {
    super();
    this.state = {
      fotos: []
    }
  }

  buscaPorId(idFoto) {
    return this.state.fotos.find(foto => foto.id === idFoto);
  }

  atualizaFotos(fotoAtualizada) {
    const listaAtualizada = this.state.fotos
        .map(foto => foto.id === fotoAtualizada.id ? fotoAtualizada : foto);

    this.setState({fotos: listaAtualizada});
  }

  like = (idFoto) => {
    const foto = this.buscaPorId(idFoto);
    AsyncStorage.getItem('usuario')
      .then(usuarioLogado => {
        let novaLista = [];
        if (!foto.likeada) {
          novaLista = [
            ...foto.likers,
            { login: usuarioLogado }
          ];
        } else {
          novaLista = foto.likers.filter(liker => {
            return liker.login !== usuarioLogado
          });
        }
        return novaLista;
      })
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          likeada: !foto.likeada,
          likers: novaLista
        };
        this.atualizaFotos(fotoAtualizada);
      });
    const uri = `https://instalura-api.herokuapp.com/api/fotos/${idFoto}/like`;
    AsyncStorage.getItem('token')
      .then(token => {
        return {
          method: 'POST',
          headers: new Headers({
            "X-AUTH-TOKEN": token
          })
        }
      })
      .then(requestInfo => fetch(uri, requestInfo));
  }

  adicionaComentario = (idFoto, valorComentario, inputComentario) => {
    if (valorComentario === '')
      return;
    const foto = this.buscaPorId(idFoto);
    const uri = `https://instalura-api.herokuapp.com/api/fotos/${idFoto}/comment`;
    AsyncStorage.getItem('token')
      .then(token => {
        return {
          method: 'POST',
          body: JSON.stringify({
            texto: valorComentario
          }),
          headers: new Headers({
            "Content-type": "application/json",
            "X-AUTH-TOKEN": token
          })
        };
      })
      .then(requestInfo => fetch(uri, requestInfo))
      .then(resposta => resposta.json())
      .then(comentario => [...foto.comentarios, comentario])
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          comentarios: novaLista
        }
        this.atualizaFotos(fotoAtualizada);
        inputComentario.clear();
      });
  }

  componentDidMount() {
    const uri = 'https://instalura-api.herokuapp.com/api/fotos'
    AsyncStorage.getItem('token')
      .then(token => {
        return {
          headers: new Headers({
            "X-AUTH-TOKEN": token
          })
        }
      })
      .then(requestInfo => fetch(uri, requestInfo))
      .then(resposta => resposta.json())
      .then(json => this.setState({ fotos: json }));
  }

  render() {
    return (
      <FlatList style={styles.container}
        keyExtractor={item => item.id}
        data={this.state.fotos}
        renderItem={({ item }) =>
          <Post foto={item} likeCallback={this.like} comentarioCallback={this.adicionaComentario} />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#ddd',
  }
});