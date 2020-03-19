import React, {Component} from 'react';
import Datepicker from "../../Datepicker.jsx";
import {
    Button,
    Modal,
    Col,
    Form,
    FormGroup,
    Input

} from "reactstrap";


export default class ModalEditTrxSatis extends Component{
    constructor(props){
        super(props);
        this.state = {
            isOnScreen: props.isOpen,
            editedDate : props.trx.tarih,
            birimFiyat :props.trx.birimFiyat,
            satisAdet : props.trx.satisAdet,
            stokAdeti : props.trx.satisAdet + props.trx.stokAdeti
            
        }
    }


    componentWillMount(){
        
         console.log("componentWillMount: ModalEditTrx");
         
         console.log("++isOpen ", this.props.trx,this.props.stokAdet);

    }
    
    numInputChanged = (event) => {
        
        console.log("asdasd", event);
        let input = event.target.id.substring(14);
        let x = Number(event.target.value);
        if (x > 0 ){
            if  (input === "birimFiyat"){
                this.setState( { [input]: x });
            }
            else{
                if ( x <= this.state.stokAdeti){
                    this.setState( { [input]: x });
                }
            }
        }
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

    saveUpdates = () => {

        this.setState({
            isOnScreen: !this.state.isOnScreen
        });


        // console.log("+++iNPUT TIRE:",this.tire._id.idInfoToString(),"=>", this.tire._id.idInfoToString() );
       
        let eskiAdet = this.props.trx.satisAdet;
        let eskiTotFiyat = this.props.trx.birimFiyat * this.props.trx.satisAdet ;
        this.props.trx.birimFiyat = Number(document.getElementById("edit-modalTrx-birimFiyat").value);
        this.props.trx.satisAdet     = Number(document.getElementById("edit-modalTrx-satisAdet").value);
        //this.props.trx.tarih        = document.getElementById("edit-modalTrx-tarih").value; -- ? Not working
        this.props.trx.tarih        = this.state.editedDate ;
        console.log("-i- saveUpdates@ModalEditTrxSatis: new trx: ", this.props.trx);
        
        this.props.editFunc(this.props.trx,eskiAdet, eskiTotFiyat  );
    }

   
     
    render(){
       // const _birimFiyat = this.props.trx.birimFiyat;
        
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
                            <label htmlFor="edit-modalTrx-birimFiyat"
                                className="form-control-label"
                                sm="2"
                            >
                             Birim Fiyatı (KDV Dahil) 
                            </label>
                            <Input type="number" 
                                    className="form-control-alternative"
                                    id="edit-modalTrx-birimFiyat"
                                    placeholder={this.state.birimFiyat}
                                    value={this.state.birimFiyat}
                                    onChange={this.numInputChanged}
                            />
                        </Col>
                         <Col lg="6">
                            <label htmlFor="edit-modalTrx-satisAdet"
                                className="form-control-label"
                                sm="2"
                            >
                                Adet
                            </label>
                        {/* </Col>         */}
                
                            <Input type="number" 
                                    className="form-control-alternative"
                                    id="edit-modalTrx-satisAdet"
                                    min="1"
                                    max={this.state.stokAdeti}
                                    placeholder={this.state.satisAdet}
                                    value={this.state.satisAdet}
                                    onChange={this.numInputChanged}
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