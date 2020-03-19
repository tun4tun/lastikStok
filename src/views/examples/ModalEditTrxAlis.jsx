import React, {Component} from 'react';
import Tire from "../../Tire.js";
import Datepicker from "../../Datepicker.jsx";
import {
    Button,
    Container,
    Modal,
    Row,
    Col,
    Form,
    FormGroup,
    Input

} from "reactstrap";


export default class ModalEditTrxAlis extends Component{
    constructor(props){
        super(props);
        this.state = {
            isOnScreen: props.isOpen,
            editedDate : props.trx.tarih,
            birimMaliyet: props.trx.birimMaliyet,
            alisAdet : props.trx.alisAdet

            
        }
    }


    componentWillMount(){
        
         console.log("componentWillMount: @ModaalEditTrxAlis");
         
         console.log("++isOpen ", this.props.isOpen,this.props.trx);

    }
    
    

    toggleModal = ()=> {
        this.setState({
          isOnScreen: !this.state.isOnScreen
        });
        
        this.props.toggleFunc(this.props.modalStateName);
      };

    dateChanged = (value) => {
        console.log("inputDateChangeCalled : ",value);
          this.setState({
            editedDate: value // ISO String, ex: "2016-11-19T12:00:00.000Z"
            
          });
          // this.setState((state)=>{
          //     let selectedDate = event.target.value;
          //     return selectedDate
          //   });
      }

    numInputChanged = (event) => {
        debugger;
        console.log("asdasd", event);
        let input = event.target.id.substring(14);
        let x = Number(event.target.value);
        if (x > 0){
            this.setState( { [input]: x });
        }
    }

    saveUpdates = () => {

        this.setState({
            isOnScreen: !this.state.isOnScreen
        });


        // console.log("+++iNPUT TIRE:",this.tire._id.idInfoToString(),"=>", this.tire._id.idInfoToString() );
       
        let eskiAdet = this.props.trx.alisAdet;
        let eskiTotMaliyet = this.props.trx.birimMaliyet * this.props.trx.alisAdet ;
        this.props.trx.birimMaliyet = Number(document.getElementById("edit-modalTrx-birimMaliyet").value);
        this.props.trx.alisAdet     = Number(document.getElementById("edit-modalTrx-alisAdet").value);
        //this.props.trx.tarih        = document.getElementById("edit-modalTrx-tarih").value; -- ? Not working
        this.props.trx.tarih        = this.state.editedDate ;
        console.log("-i- saveUpdates@ModalEditTrxAlis: new trx: ", this.props.trx);
        
        this.props.editFunc(this.props.trx,eskiAdet, eskiTotMaliyet  );
    }

    // renderFormItems(){
    //     return this.props.editableFields.map((item, index) => {
    //         let inputId = "edit-modalTrx-".concat(index);
    //         return (
    //             <FormGroup row>
    //                     {/* <Col sm="6"> */}
    //                     <Col className="text-right" sm="3" >    
    //                         <label htmlFor={inputId}
    //                             className="form-control-label"
    //                             sm="2"
    //                         >
    //                          {item.label} 
    //                         </label>
    //                     </Col>
    //                     {/* </Col>         */}
    //                     <Col sm="9"> 
    //                         <Input type={item.type} 
    //                                 className="form-control-alternative"
    //                                 id={inputId}
    //                                 placeholder={item}
    //                                 defaultValue={this}
    //                         />
    //                     </Col>
    //                 </FormGroup>
    //         );
    //     })
    // }


     
    render(){
       // const _birimMaliyet = this.props.trx.birimMaliyet;
        
        return (
            // console.log("<<<<<<<<", tire);
            <Modal
                className="modal-dialog-centered"
                 isOpen={this.state.isOnScreen}
                // toggle={() => this.toggleModal()}
            >
                <div className="modal-header">
                    <h3 className="modal-title" id="modal-title-default">
                    {this.props.title}
                    </h3>
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
                {/* <hr className="my-4" /> */}
                <Form>
                    
                    
                    <FormGroup row>
                        {/* <Col sm="6"> */}
                        <Col sm="6">    
                            <label htmlFor="edit-modalTrx-birimMaliyet"
                                className="form-control-label"
                                sm="2"
                            >
                             Birim Maliyeti (KDV Dahil) 
                            </label>
                            <Input type="number" 
                                    className="form-control-alternative"
                                    id="edit-modalTrx-birimMaliyet"
                                    placeholder={this.props.trx.birimMaliyet}
                                    min="1"
                                    //defaultValue={this.props.trx.birimMaliyet}
                                    onChange={this.numInputChanged}
                                    value={this.state.birimMaliyet}
                            />
                        </Col>
                         <Col lg="6">
                            <label htmlFor="edit-modalTrx-alisAdet"
                                className="form-control-label"
                                sm="2"
                            >
                                Adet
                            </label>
                        {/* </Col>         */}
                
                            <Input type="number" 
                                    className="form-control-alternative"
                                    id="edit-modalTrx-alisAdet"
                                    min= "1"
                                    placeholder={this.props.trx.alisAdet}
                                    //defaultValue={this.props.trx.alisAdet}
                                    onChange={this.numInputChanged}
                                    value={this.state.alisAdet}

                            />
                        </Col>
                        
                        </FormGroup>

                        <FormGroup row className="justify-content-md-center">
                        <Col sm="12">
                        <label htmlFor="edit-modalTrx-tarih"
                            className="form-control-label"
                            sm="3"
                            >
                            Tarih
                        </label>
                        
                            <Datepicker 
                                id="edit-modalTrx-tarih"
                                className="form-control-alternative"
                                placeholder = {this.props.trx.tarih}
                                // defaultValue={new Date()}                          
                                value={this.state.editedDate}
                                onChange={this.dateChanged}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col className="text-left">              
                            <Button className="ml-auto"
                                    color="danger"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => this.toggleModal()}
                            >
                                Vazgeç
                            </Button>  
                        </Col> 
                        <Col className ="text-right" sm="9">
                            
                            <Button color="primary" 
                                    type="button"
                                    onClick={ () => this.saveUpdates() }    
                                >
                                Değişiklikleri Kaydet
                            </Button>
                        
                        </Col>
                    </FormGroup>       
                   
                </Form>
            </div>

            </Modal>
            );
        }
    }