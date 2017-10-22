import React, {Component} from 'react';
import api from '../api';
import '../css/EditarFuncion.css';
import '../css/Slider.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem, Form, FormGroup, Label, Input, InputGroup, InputGroupButton, Table} from 'reactstrap';

export default class EditarFuncion extends Component {
    constructor(props) {
        super(props);
        this.apply = this.apply.bind(this);
        this.cancel = this.cancel.bind(this);
        this.changeName = this.changeName.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.addAction = this.addAction.bind(this);
        this.state = {
            name: "",
            actions: [],
            room: "",
            devices: [],
            rooms: []
        };
    }

    componentWillMount() {
        if(this.props.id) {
            api.routines.get(this.props.id)
                .done((data) => {
                    this.setState({
                        name: data.routine.name,
                        actions: data.routine.actions,
                        room: data.routine.meta
                    });
                })
                .fail(() => {
                    console.log("Get Routine "+this.props.id+" Failed")}
                );
        }
        if(this.state.room === "") {
            api.devices.list()
                .done((data) => {
                    this.setState({
                        devices: data.devices
                    });
                })
                .fail(() => {
                    console.log("List Devices Failed")}
                );
        }
        else {
            api.room.getDevices(this.state.room)
                .done((data) => {
                    this.setState({
                        devices: data.devices
                    });
                })
                .fail(() => {
                    console.log("Get Room Devices Failed")}
                );
        }

        api.room.list()
            .done((data) => {
                this.setState({
                    rooms: data.rooms
                });
            })
            .fail(() => {
                console.log("List Rooms Failed")}
            );
    }

    apply() {
        const routine = {
            id: this.props.id,
            name: this.state.name,
            actions: JSON.stringify(this.state.actions),
            meta: this.state.room
        };

        if(routine.id)
            api.routines.modify(routine).fail("Failed to update routine "+routine.id);
        else
            api.routines.add(routine).fail("Failed to create routine");

        this.props.toggle();
    }

    cancel() {
        this.componentWillMount();
        this.props.toggle();
    }

    changeName(event) {
        this.setState({
            name: event.target.value
        });
    }

    changeRoom(event) {
        const room = event.target.value;
        api.room.getDevices(room)
            .done((data) => {
                this.setState({
                    room: room,
                    devices: data.devices
                });
            })
            .fail(() => {
                console.log("Get Room Devices Failed")}
            );
    }

    addAction(action) {
        const actions = this.state.actions.slice();
        actions.push(action);
        this.setState({
            actions: actions
        });
    }

    render() {
        return (
            <Modal isOpen={this.props.visible} toggle={this.props.toggle} >
                <ModalHeader toggle={this.props.toggle}>{this.props.id ? "Editar Función" : "Crear Función"}</ModalHeader>
                <Form>
                    <ModalBody>
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input type="text" name="name" value={this.state.name} onChange={this.changeName}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Ambiente</Label>
                            <RoomSelect value={this.state.room} rooms={this.state.rooms} handler={this.changeRoom}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Acciones</Label>
                            <Table>
                                <ActionList actions={this.state.actions} devices={this.state.devices}/>
                            </Table>
                            <ActionAdd devices={this.state.devices} callback={this.addAction}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.apply}>{this.props.id ? "Actualizar" : "Crear"}</Button>{' '}
                        <Button color="secondary" onClick={this.cancel}>Cancelar</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

function ActionList(props) {
    const actionList = props.actions.map(
        action =>
            <tr>
                <td>
                    {props.devices.find(element => element.id === action.deviceId).name}
                </td>
                <td>
                    {action.actionName}
                </td>
                <td>
                    {action.params.length > 0 ? action.params[0] : ""}
                </td>
            </tr>
    );
    return (
        <tbody>
            {actionList}
        </tbody>
    );
}

function RoomSelect(props) {
    const roomOptions = props.rooms.map(
        room =>
            <option value={room.id}>{room.name}</option>
    );
    return (
        <Input type="select" name="room" value={props.value} onChange={props.handler}>
            <option value="" disabled selected hidden>Seleccione</option>
            {roomOptions}
        </Input>
    );
}

class ActionAdd extends Component {
    constructor(props) {
        super(props);
        this.changeDevice = this.changeDevice.bind(this);
        this.changeAction = this.changeAction.bind(this);
        this.changeParam = this.changeParam.bind(this);
        this.submit = this.submit.bind(this);
        this.state = {
            device: {},
            action: {
                params:[]
            },
            param: "",
            actions: []
        }
    }

    changeDevice(event) {
        const device = this.props.devices.find(device => device.id === event.target.value);
        api.deviceTypes.get(device.typeId)
            .done( data =>
                this.setState({
                    device: device,
                    actions: data.device.actions,
                    action: {
                        name: "",
                        params: []
                    }
                })
            )
            .fail(() =>
                console.log("Get device type "+device.typeId+" failed")
            )
    }

    changeAction(event) {
        const action = this.state.actions.find(action => action.name === event.target.value);
        this.setState({
            action: action,
            param: ""
        });
    }

    changeParam(event) {
        this.setState({
            param: event.target.value
        })
    }

    submit() {
        this.props.callback({
            deviceId: this.state.device.id,
            actionName: this.state.action.name,
            params: [this.state.param],
            meta: "{}"
        });
    }

    render() {
        return (
                <InputGroup>
                    <DeviceSelect devices={this.props.devices} handler={this.changeDevice}/>
                    <ActionSelect actions={this.state.actions} value={this.state.action.name} handler={this.changeAction}/>
                    <ParamInput params={this.state.action.params} value={this.state.param} handler={this.changeParam}/>
                    <InputGroupButton><Button color="primary" className="actionadd-button" onClick={this.submit}>+</Button></InputGroupButton>
                </InputGroup>
        );
    }
}

function DeviceSelect(props) {
    const deviceOptions = props.devices.map(
        device =>
            <option value={device.id}>{device.name}</option>
    );
    return (
        <Input className="actionadd-select" type="select" onChange={props.handler}>
            <option value="" disabled selected hidden>Seleccione</option>
            {deviceOptions}
        </Input>
    );
}

function ActionSelect(props) {
    const actionOptions = props.actions.filter(action => action.name != "getState").map(
        action =>
            <option value={action.name}>{action.name}</option>
    );
    return (
        <Input className="actionadd-select" type="select" value={props.value} onChange={props.handler}>
            <option value="" disabled selected hidden>Seleccione</option>
            {actionOptions}
        </Input>
    );
}

function ParamInput(props) {
    if(props.params.length > 0) {
        switch (props.params[0].name) {
            case "color":
                return (<Input type="text" value={props.value} onChange={props.handler}/>);
            case "brightness":
            case "temperature":
                return (<Input type="range" value={props.value} min={props.params[0].minValue} max={props.params[0].maxValue} onChange={props.handler}/>);
            case "heat":
            case "grill":
            case "convection":
            case "mode":
            case "verticalSwing":
            case "horizontalSwing":
            case "fanSpeed":
                const options = props.params[0].supportedValues.map(
                    value =>
                        <option value={value}>{value}</option>
                );
                return (
                    <Input type="select" value={props.value} onChange={props.handler}>
                        <option value="" disabled selected hidden>Seleccione</option>
                        {options}
                    </Input>
                );
            case "interval":
                return (<Input type="number" value={props.value} min={props.params[0].minValue} max={props.params[0].maxValue} onChange={props.handler}/>);
        }
    }

    return (<span/>);
}