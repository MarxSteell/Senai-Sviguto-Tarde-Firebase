import React, { Component } from 'react';
import firebase from '../../services/firebase'
import { importDefaultSpecifier } from '@babel/types';

export default class EventosIndex extends Component {

    constructor() {
        super();

        this.state = {
            listaEventos: [],
            titulo: "",
            descricao: "",
            ativo: false,
            acessoLivre: false,
            data: "",
            hora: "",
            idEvento: 0
        }
    }

    listarEventosRealTime() {
        firebase.firestore().collection("eventos")
            .where("ativo", "==", true)
            .onSnapshot((eventos) => {
                let eventosArray = [];
                eventos.forEach((evento) => {
                    eventosArray.push({
                        id: evento.id,
                        titulo: evento.data().titulo,
                        descricao: evento.data().descricao,
                        data: evento.data().data,
                        acessoLivre: evento.data().acessoLivre,
                        ativo: evento.data().ativo
                    })
                })
                this.setState({ listaEventos: eventosArray }, () => {
                    console.log(this.state.listaEventos);
                })
            })
    }

    // listarEventos() {
    //     firebase.firestore().collection("eventos")
    //         .where("ativo", "==", true)
    //         .get()
    //         .then((eventos) => {
    //             let eventosArray = [];
    //             eventos.forEach((evento) => {
    //                 eventosArray.push({
    //                     id: evento.id,
    //                     titulo: evento.data().titulo,
    //                     descricao: evento.data().descricao,
    //                     data: evento.data().data,
    //                     acessoLivre: evento.data().acessoLivre,
    //                     ativo: evento.data().ativo
    //                 })
    //             })
    //             this.setState({ listaEventos: eventosArray }, () => {
    //                 console.log(this.state.listaEventos);
    //             });
    //         })
    // }

    componentDidMount() {
        this.listarEventosRealTime();
    }

    atualizaEstado(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    salvarEvento(event) {
        event.preventDefault();
        if (this.state.idEvento === 0) {
            firebase.firestore().collection("eventos").add({
                data: firebase.firestore.Timestamp.fromDate(new Date(this.state.data + " " + this.state.hora)),
                titulo: this.state.titulo,
                descricao: this.state.descricao,
                ativo: Boolean(this.state.ativo),
                acessoLivre: Boolean(this.state.acessoLivre)
            }).then(() => {
                alert("Evento Cadastrado")
            }).catch((erro) => {
                console.log('Erro', erro)
            })
        } else {
            firebase.firestore().collection("eventos")
                .doc(this.state.idEvento)
                .set({
                    data: firebase.firestore.Timestamp.fromDate(new Date(this.state.data + " " + this.state.hora)),
                    titulo: this.state.titulo,
                    descricao: this.state.descricao,
                    ativo: Boolean(this.state.ativo),
                    acessoLivre: Boolean(this.state.acessoLivre)
                }).then((result) => {
                    alert("Evento Alterado");
                    this.limparFormulario()
                }).catch((erro) => {
                    console.log("Erro: ", erro)
                })
        }
    }

    buscarporID(event) {
        event.preventDefault();
        firebase.firestore().collection("eventos")
            .doc(event.target.id)
            .get()
            .then((evento) => {
                this.setState({
                    idEvento: evento.id,
                    titulo: evento.data().titulo,
                    descricao: evento.data().descricao,
                    ativo: evento.data().ativo,
                    acessoLivre: evento.data().acessoLivre,
                    data: evento.data().data.toDate().toISOString().split("T")[0],
                    hora: evento.data().data.toDate().toTimeString().slice(0, 5)
                })
            })
    }

    limparFormulario() {
        this.setState({
            titulo: "",
            descricao: "",
            ativo: false,
            acessoLivre: false,
            data: "",
            hora: "",
            idEvento: 0
        })
    }

    deletar(event) {
        event.preventDefault();

        if (window.confirm("Tem certeza disso?")) {
            firebase.firestore().collection("eventos")
            .doc(event.target.id)
            .delete()
            .then((result) => {
                alert("Evento Excluído");
            }).catch((erro) => {
                console.log("Erro: ", erro)
            })
        }
    }

    buscarParaDeletar() {
        let arrayIDS = [];
        let arrayGeral = this.state.listaEventos;

        arrayGeral.forEach((eventos) => {
            arrayIDS.push({
                id: eventos.id
            })
        })

        return arrayIDS;
    }

    deletarTodos(event) {
        event.preventDefault();

        let ids = this.buscarParaDeletar();

        ids.forEach((ids) => {
            if (window.confirm("Tem certeza disso?")) {
            firebase.firestore().collection("eventos")
                .doc(ids.id)
                .delete()
                .catch(erro => console.log("Erro", erro))
            }
        })
        alert("Eventos Apagados");
    }


    render() {
        return (
            <div>
                <h1>Eventos - Index</h1>
                <div><button onClick={this.deletarTodos.bind(this)}>Deletar Todos</button></div>
                <ul>
                    {
                        this.state.listaEventos.map((evento) => {
                            return (
                                
                                <li key={evento.id}>
                                    {evento.id} - {evento.titulo} - {evento.descricao} -
                                <button id={evento.id} onClick={this.buscarporID.bind(this)}>Editar</button>
                                    <button id={evento.id} onClick={this.deletar.bind(this)}>Excluir</button>
                                </li>
                            )
                        })
                    }
                </ul>
                <h2>Eventos - Cadastrar</h2>
                <form onSubmit={this.salvarEvento.bind(this)} method="POST">
                    <input
                        type="text"
                        name="titulo"
                        placeholder="Título"
                        value={this.state.titulo}
                        onChange={this.atualizaEstado.bind(this)} /><br />

                    <input
                        type="textarea"
                        name="descricao"
                        placeholder="Descrição"
                        value={this.state.descricao}
                        onChange={this.atualizaEstado.bind(this)} /> <br />

                    <input
                        type="checkbox"
                        name="ativo"
                        value={this.state.ativo}
                        onChange={this.atualizaEstado.bind(this)} /> Ativo <br />

                    <input type="checkbox"
                        name="acessoLivre"
                        value={this.state.acessoLivre}
                        onChange={this.atualizaEstado.bind(this)} /> Acesso Livre <br />

                    <input
                        type="date"
                        name="data"
                        value={this.state.data}
                        onChange={this.atualizaEstado.bind(this)} /> <br />

                    <input
                        type="time"
                        name="hora"
                        value={this.state.hora}
                        onChange={this.atualizaEstado.bind(this)} /> <br />

                    <button type="submit">Salvar</button>
                </form>
            </div>
        )
    }
}