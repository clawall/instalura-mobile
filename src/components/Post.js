import React, { Component } from 'react';
import { Text, View, Dimensions, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

import InputComentario from './InputComentario';
import Likes from './Likes';

const width = Dimensions.get('screen').width;

export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            foto: this.props.foto,
            valorComentario: '',
        }
    }

    exibeLegenda(foto) {
        if (foto.comentario === '')
            return;
        return (
            <View style={styles.comentario}>
                <Text style={styles.tituloComentario}>{foto.loginUsuario}</Text>
                <Text>{foto.comentario}</Text>
            </View>
        );
    }

    render() {
        const { foto, likeCallback, comentarioCallback } = this.props;
        return (
            <View>
                <TouchableOpacity style={styles.cabecalho}
                    onPress={() => verPerfilCallback(foto.id)}>
                    <Image source={{ uri: foto.urlPerfil }}
                        style={styles.fotoDePerfil} />
                    <Text>{foto.loginUsuario}</Text>
                </TouchableOpacity>

                <Image source={{ uri: foto.urlFoto }}
                    style={styles.foto} />

                <View style={styles.rodape}>
                    <Likes foto={foto} likeCallback={likeCallback} />
                    {this.exibeLegenda(foto)}
                    {foto.comentarios.map(comentario =>
                        <View style={styles.comentario} key={comentario.id}>
                            <Text style={styles.tituloComentario}>{comentario.login}</Text>
                            <Text>{comentario.texto}</Text>
                        </View>
                    )}

                    <InputComentario idFoto={foto.id} comentarioCallback={comentarioCallback} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cabecalho: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    fotoDePerfil: {
        marginRight: 10,
        borderRadius: 20,
        width: 40,
        height: 40,
    },
    foto: {
        width: width,
        height: width,
    },
    rodape: {
        margin: 10,
    },
    botaoDeLike: {
        height: 40,
        width: 40,
    },
    comentario: {
        flexDirection: 'row',
    },
    tituloComentario: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    novoComentario: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    input: {
        flex: 1,
        height: 40,
    },
    icone: {
        height: 30,
        width: 30,
    },
});