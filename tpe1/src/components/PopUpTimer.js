import  React from "react";
import api from '../api';
import {Button, Input, ButtonGroup, ModalBody, ModalFooter, ModalHeader, Progress, InputGroup} from 'reactstrap';

import "../css/activationSlider.css"
import "../css/Slider.css"

var ProgressBar = require('react-progressbar.js')
var Circle = ProgressBar.Circle;





class PopUpTimer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            status: "",
            interval: 0,
            remaining: 0,
            id: props.id,
            newInterval: 0,
        }
        this.changeState = this.changeState.bind(this);
        this.tick = this.tick.bind(this);
        this.setInterval = this.setInterval.bind(this);
        this.backupInterval = this.backupInterval.bind(this);
    }

    componentWillMount(){
        this.timerID = setInterval(
            () => this.tick(),
            1000 );

        api.devices.getState(this.props.id)
            .done((data) => {
                this.setState({
                    status: data.result.status,
                    interval: data.result.interval,
                    remaining: data.result.remaining,
                })
            })
            .fail(()=>{
                console.log("failed")
            });
    };

    componentWillUnmount() {
        clearInterval(this.timerID);
    };

    changeState(event){
        if(event.target.name === "start"){
            api.devices.putDevice(this.state.id, "start",[])
                .done(()=>this.setState({remaining: this.state.interval}))
                // .fail(()) si failea por que ajax topkekea mostrarlo

        }
        else if(event.target.name === "stop"){
            api.devices.putDevice(this.state.id,"stop", [])
                .done(()=>this.setState({remaining: 0}))
        }
    };


    backupInterval(event){
        event.preventDefault();
        this.setState({newInterval: event.target.value})
    }

    setInterval(){
        api.devices.putDevice(this.state.id,"setInterval", [this.state.newInterval])
            //  .done((data)=>{
            //      console.log(data);
            //      console.log(data.result);
            //      data.result ? this.setState({interval: this.state.newInterval}) : console.log("false");     <=== Una dura pelea con la api pero los booleans los retorna como undefined.
            // if(data.result === true)
            //     console.log("entro al if")
            //     this.setState({interval: this.state.newInterval})
           // });mensaje de error si da false, no se puede cmabiar mientras esta corriendo})
        this.setState({interval: this.state.newInterval})

    }

    tick(){
        if(this.state.remaining > 0){
            this.setState({remaining: this.state.remaining -1})
        }
    };

    render(){
        console.log(this.state.newInterval);

        let containerStyle = {
            width: '100px',
            height: '100px',


        };

        let options = {
            color: '#346FA1',
            strokeWidth: 6,
            fill: '#F9F9FA',
        };

        return(
            <div>
                <ModalHeader>{this.props.name}</ModalHeader>
                <ModalBody>
                    <div className="popup-item">
                        <h6>Tiempo Restante:</h6>
                            <Circle
                                progress={this.state.remaining/this.state.interval}
                                text={this.state.remaining}
                                options={options}
                                initialAnimate={true}
                                containerStyle={containerStyle}
                                containerClassName={'.progressbar'} />
                    </div>
                    <div className="popup-item">
                        <ButtonGroup>
                            <Button color="primary" name="start" onClick={this.changeState}>Empezar</Button>
                            <Button color="primary" name="stop" onClick={this.changeState}>Frenar</Button>
                        </ButtonGroup>
                    </div>
                    <div className="popup-item">
                        <h6>Establecer nuevo Intervalo:</h6>
                        <InputGroup>
                            <Input type="text" onChange={this.backupInterval} />
                            <Button color="primary" name="submit" onClick={this.setInterval}>Ok</Button>
                        </InputGroup>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-primary" onClick={this.props.closeModal}>Cerrar</button>
                </ModalFooter>
            </div>
        )
    }

}

export default PopUpTimer;