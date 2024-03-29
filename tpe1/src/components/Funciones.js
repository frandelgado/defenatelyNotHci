import React, {Component} from 'react';
import api from '../api';
import EditarFuncion from './EditarFuncion'
import {Button, ListGroup, ListGroupItem, InputGroup, InputGroupAddon, InputGroupButton} from 'reactstrap'
import Simplert from 'react-simplert'
import '../css/Funciones.css'

class Funciones extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const routineList = this.props.routines.map(
           (routine) =>
                <Funcion name={routine.name} id={routine.id} callback={this.props.callback}/>
        );

        return (
            <div >
                {routineList}
            </div>
        );
    };
}

class Funcion extends Component{
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.attemptDelete = this.attemptDelete.bind(this);
        this.deleteFunction = this.deleteFunction.bind(this);
        this.resetConfirm = this.resetConfirm.bind(this);
        this.didModify = this.didModify.bind(this);
        this.run = this.run.bind(this);
        this.state = {
            popup: false,
            showAlert: false,
            alertType: "",
            alertMessage: "",
            alertConfirm: false
        };
    }

    toggle() {
        this.setState({
            popup: !this.state.popup
        });
    }

    attemptDelete() {
        this.setState({
            alertType: "warning",
            alertMessage: "¿Esta seguro de que desea eliminar la función?",
            alertConfirm: true,
            showAlert: true
        })
    }

    deleteFunction() {
        this.resetConfirm();
        api.routines.delete(this.props.id)
            .done(() => this.props.callback())
            .fail(()=>
                this.setState({
                    alertType: "error",
                    alertMessage: "Hubo un error al intentar eliminar la función",
                    showAlert: true
                })
            );
    }

    resetConfirm() {
        this.setState({
            alertConfirm: false,
            showAlert: false
        });
    }

    didModify(bool) {
        if(bool) {
            this.setState({
                alertType: "success",
                alertMessage: "La función se actualizó correctamente",
                showAlert: true
            })
        }
        else {
            this.setState({
                alertType: "error",
                alertMessage: "Hubo un error al intentar actualizar la función",
                showAlert: true
            })
        }
    }

    run() {
        api.routines.execute(this.props.id)
            .done(()=>
                this.setState({
                    alertType: "success",
                    alertMessage: "La función se ejecutó correctamente",
                    showAlert: true
                })
            )
            .fail(()=>
                this.setState({
                    alertType: "error",
                    alertMessage: "Hubo un error al intentar ejecutar la función",
                    showAlert: true
                })
            );
    }

    render() {
        return (
            <InputGroup className="funcion justify-content-center">
                <InputGroupAddon className="funcion-text">{this.props.name}</InputGroupAddon>
                <EditarFuncion id={this.props.id} visible={this.state.popup} toggle={this.toggle} callback={this.didModify}/>
                <Simplert showSimplert={this.state.showAlert} type={this.state.alertType} message={this.state.alertMessage} customCloseBtnText={this.state.alertConfirm? "Canclear" : "Entendido"}
                    useConfirmBtn={this.state.alertConfirm} customConfirmBtnText={"Eliminar"} customConfirmBtnClass={"danger"} onConfirm={this.deleteFunction} onClose={this.resetConfirm}
                    disableOverlayClick={true} />
                <InputGroupButton><Button color="success" onClick={this.run}><i className="fa fa-play"/></Button></InputGroupButton>
                <InputGroupButton><Button color="primary" onClick={this.toggle}><i className="fa fa-cog"/></Button></InputGroupButton>
                <InputGroupButton><Button color="danger" onClick={this.attemptDelete}><i className="fa fa-trash"/></Button></InputGroupButton>
            </InputGroup>
        );
    }
}
export default Funciones;
