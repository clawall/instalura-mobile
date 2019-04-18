import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import InstaluraFetchService from './src/services/InstaluraFetchService';
import Post from './src/components/Post';
import HeaderUsuario from './src/components/HeaderUsuario';

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

    this.setState({ fotos: listaAtualizada });
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

    InstaluraFetchService.post(`/fotos/${idFoto}/like`)
      .catch(e => {
        this.setState({ fotos: listaOriginal })
        Notificacao.exibe('Ops..', 'Algo deu errado ao curtir')
      });
  }

  adicionaComentario = (idFoto, valorComentario, inputComentario) => {
    if (valorComentario === '')
      return;

    const estadoAtual = this.state
    const foto = this.buscaPorId(idFoto);

    const comentario = {
      texto: valorComentario
    };
    InstaluraFetchService.post(`/fotos/${idFoto}/comment`, comentario)
      .then(comentario => [...foto.comentarios, comentario])
      .then(novaLista => {
        const fotoAtualizada = {
          ...foto,
          comentarios: novaLista
        }
        this.atualizaFotos(fotoAtualizada);
        inputComentario.clear();
      })
      .catch(e => {
        this.setState({ ...estadoAtual })
        Notificacao.exibe('Ops..', 'Algo deu errado ao adicionar comentário');
      });
  }

  verPerfilUsuario = (idFoto) => {
    const foto = this.buscaPorId(idFoto);

    this.props.navigator.push('Feed', {
      component: {
        name: 'PerfilUsuario',
        backButtonTitle: '',
        passProps: {
          usuario: foto.loginUsuario,
          fotoDePerfil: foto.urlPerfil
        },
        options: {
          topBar: {
            title: {
              text: foto.loginUsuario
            }
          }
        }
      }
    });
  }

  carregaFotos() {
    let uri = '/fotos';
    if (this.props.usuario)
      uri = `/public/fotos/${this.props.usuario}`;

    InstaluraFetchService.get(uri)
      .then(json => this.setState({ fotos: json }))
      .catch(e => {
        Notificacao.exibe('Ops..', 'Algo deu errado ao carregar as fotos');
      });
  }

  componentDidMount() {
    Navigator.setOnNavigatorEvent(evento => {
      if (evento.id === 'willAppear')
        this.carregaFotos();
    });
  }

  exibeHeader() {
    if (this.props.usuario)
      return <HeaderUsuario {...this.props}
        posts={this.state.fotos.length} />;
  }

  render() {
    return (
      <ScrollView>
        {this.exibeHeader()}

        <FlatList style={styles.container}
          keyExtractor={item => item.id}
          data={this.state.fotos}
          renderItem={({ item }) =>
            <Post foto={item} likeCallback={this.like} comentarioCallback={this.adicionaComentario} verPerfilCallback={this.verPerfilUsuario} />
          }
        />
      </ScrollView>
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