import React, {Component} from 'react';
import Tire from "../../Tire.js";
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


export default class ModalEditDefinition extends Component{
    constructor(props){
        super(props);
        this.state = {
            isOnScreen: props.isOpen,
            title: props.title,
            tire: props.tire 
            
        }
    }


    componentWillMount(){
         console.log("componentWillMount: ModalEdit");
         let t1 = new Tire(this.state.tire);
         console.log("++Tire in the state: ", this.state.tire);
         console.log("++Tire newly created: ",t1);
         console.log("---");
         console.log(t1.mainInfo());
    }
    
    

    toggleModal = ()=> {
        let curVisiblity = this.state.isOnScreen;
        this.setState({
          isOnScreen: !this.state.isOnScreen
        });
        
        this.props.toggleFunc(this.props.modalStateName,!curVisiblity);
      };

    saveUpdates = () => {

        this.setState({
            isOnScreen: !this.state.isOnScreen
        });

        //debugger;
        // console.log("+++iNPUT TIRE:",this.tire._id.idInfoToString(),"=>", this.tire._id.idInfoToString() );
        let tire2Save = new Tire(this.state.tire);
        tire2Save._id         = this.state.tire._id;
        tire2Save.owner_id    = this.state.tire.owner_id;
        tire2Save.marka       = document.getElementById("edit-modal-marka").value;
        tire2Save.model       = document.getElementById("edit-modal-model").value;
        tire2Save.taban       = Number(document.getElementById("edit-modal-taban").value);
        tire2Save.oran        = Number(document.getElementById("edit-modal-oran").value);
        tire2Save.jant        = document.getElementById("edit-modal-jant").value;
        tire2Save.yukEndeksi  = Number(document.getElementById("edit-modal-yuk").value);
        tire2Save.hizEndeksi  = document.getElementById("edit-modal-hiz").value;
        tire2Save.yanakYapisi = document.getElementById("edit-modal-yanak").value;
        tire2Save.mevsim      = document.getElementById("edit-modal-mevsim").value;
        tire2Save.diger       = document.getElementById("edit-modal-diger").value;
        
        
        
        console.log("+++File to be replaced:",tire2Save.idInfoToString(),"=>", tire2Save.fullInfo());
        this.props.editFunc(tire2Save);
    }
     
    render(){
        return (
            // console.log("<<<<<<<<", tire);
            <Modal
                className="modal-dialog-centered"
                 isOpen={this.state.isOnScreen}
                // toggle={() => this.toggleModal()}
            >
                <div className="modal-header">
                    <h2 className="modal-title" id="modal-title-default">
                    {this.state.title}
                    </h2>
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
                <Form>
                    <FormGroup row>
                        {/* <Col sm="6"> */}
                        <Col sm="6" >    
                            <label htmlFor="edit-modal-marka"
                                className="form-control-label"
                                sm="2"
                            >
                                Marka   
                            </label>
                         {/* </Col> */}
                        {/* </Col>         */}
                        {/* <Col sm="6">  */} 
                            <Input type="text" 
                                    className="form-control-alternative"
                                    id="edit-modal-marka"
                                    placeholder={this.state.tire.marka}
                                    defaultValue={this.state.tire.marka}
                            />
                        </Col>
                   
                        {/* <Col sm="6"> */}
                        <Col sm="6" >    
                            <label htmlFor="edit-modal-model"
                                className="form-control-label"
                                sm="2"
                            >
                                Desen  
                            </label>
      
                            <Input type="text" 
                                    className="form-control-alternative"
                                    id="edit-modal-model"
                                    placeholder={this.state.tire.model}
                                    defaultValue={this.state.tire.model}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm="6" >
                            <label htmlFor="edit-modal-taban"
                            className="form-control-label"
                            >
                            Taban
                            </label>
                            <Input type="number" 
                                className="form-control-alternative"
                                id="edit-modal-taban"
                                min="155"
                                max="325"
                                step="10"
                                placeholder={this.state.tire.taban}
                                defaultValue={this.state.tire.taban}
                            />
                        </Col>

                        <Col sm="6" > 
                            <label  htmlFor="edit-modal-oran"
                                    className="form-control-label"
                                    >
                                    Oran
                            </label>
                            <Input  type="number" 
                                    className="form-control-alternative"
                                    id="edit-modal-oran"
                                    min="20"
                                    max="95"
                                    step="5"
                                    placeholder={this.state.tire.oran}
                                    defaultValue={this.state.tire.oran}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col  sm="6" >    
                            <label  htmlFor="edit-modal-jant"
                                    className="form-control-label"
                                    sm="3"
                                    >
                                    Jant
                            </label>
                            <Input  type="text" 
                                    className="form-control-alternative"
                                    id="edit-modal-jant"
                                    placeholder={this.state.tire.jant}
                                    defaultValue={this.state.tire.jant}
                            />
                        </Col>  
                        <Col  sm="6" >
                            <label  htmlFor="edit-modal-yuk"
                                className="form-control-label"
                                sm="6"
                            >
                        
                            Yuk Endeksi
                            </label>
                            <Input type="number" 
                                    className="form-control-alternative"
                                    id="edit-modal-yuk"
                                    min="70"
                                    max="130"
                                    step="1"
                                    placeholder={this.state.tire.yukEndeksi}
                                    defaultValue={this.state.tire.yukEndeksi}
                            />
                        </Col>
                        
                        
                    </FormGroup>
                
                    <FormGroup row>
                        <Col sm="6" >
                            <label  htmlFor="edit-modal-hiz"
                                    className="form-control-label"
                                    sm="3"
                                >   
                                Hız Endeksi
                            </label>
                            <Input type="text" 
                                className="form-control-alternative"
                                id="edit-modal-hiz"
                                maxLength="1"
                                placeholder={this.state.tire.hizEndeksi}
                                defaultValue={this.state.tire.hizEndeksi}
                            />
                        </Col>
                        <Col sm="6" >
                            <label  htmlFor="edit-modal-yanak"
                                    className="form-control-label"
                                    >
                                    Yanak Yapısı
                            </label>

                            <Input  className="form-control-alternative"
                                    id="edit-modal-yanak"
                                    type="text"
                                    placeholder={this.state.tire.yanakYapisi}
                                    defaultValue={this.state.tire.yanakYapisi}
                            />
                        </Col>
                        
                    </FormGroup>
                    <FormGroup row>
                        <Col sm="6" >
                            <label  htmlFor="edit-modal-mevsim"
                                    className="form-control-label" 
                                >
                                Mevsim
                                </label>

                            <Input  className="form-control-alternative"
                                    id="edit-modal-mevsim"
                                    type="text"
                                    placeholder={this.state.tire.mevsim}
                                    defaultValue={this.state.tire.mevsim}
                            />
                        </Col>
                        
                        <Col sm="6" >
                            <label  htmlFor="edit-modal-diger"
                                    className="form-control-label"
                                >
                                Diğer
                            </label>
                            <Input  type="text"
                                    className="form-control-alternative"
                                    id="edit-modal-diger"
                                    placeholder={this.state.tire.diger}
                                    defaultValue={this.state.tire.diger}
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
                    {/* </div> */}
                </Form>
            </div>

            </Modal>
            );
        }
    }