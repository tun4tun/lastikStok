import React, {Component} from 'react';
import Tire from "../../Tire.js";
import {
    Button,
    Modal
} from "reactstrap";


export default class ModalInformation extends Component{
    constructor(props){
        super(props);
        this.state = {
            isOnScreen: props.isOpen,
            headerTitle: props.headerTitle,
            mainTitle: props.mainTitle,
            question: props.question,
            confirmButtonName: props.confirmButtonName,
            tire : props.forTire

        }
    }
    componentDidMount(){
        console.log("Confirmation Modal componentDidMount");
        console.log(this.state.tire);
    }

    toggleModal = ()=> {
        let curVisiblity = this.state.isOnScreen;
        this.setState({
          isOnScreen: !this.state.isOnScreen
        });
        
        this.props.toggleFunc(this.props.modalStateName,!curVisiblity);
      };

    confirmPressed = () => {

        this.setState({
            isOnScreen: !this.state.isOnScreen
        });

        this.props.confirmFunc(this.state.tire);
    }

    render(){
        return (
            <Modal
            className="modal-dialog-centered modal-danger"
            contentClassName="bg-gradient-danger"
            isOpen={this.state.isOnScreen}
            toggle={() => this.toggleModal()}
            backdrop="static"
            >
            <div className="modal-header">
                <h6 className="modal-title" id="modal-title-notification">
                {this.state.headerTitle}
                </h6>
                <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={() => this.toggleModal()}
                >
                <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="py-3 text-center">
                <i className="ni ni-bell-55 ni-3x" />
                {/* <h4 className="heading mt-4">{editPopupTitle} - {otherInfo}</h4> */}
                <h4 className="heading mt-4">{this.state.mainTitle}</h4>
                <p>
                    {this.state.question}
                </p>
                </div>
            </div>
            <div className="modal-footer">
                <Button className="btn-white" color="default" type="button"
                        onClick={() => this.confirmPressed() }>
                {this.state.confirmButtonName}
                </Button>
                <Button
                className="text-white ml-auto"
                color="link"
                data-dismiss="modal"
                type="button"
                onClick={() => this.toggleModal()}
                >
                Vazgeç
                </Button>
            </div>
            </Modal>
        );
    }
}