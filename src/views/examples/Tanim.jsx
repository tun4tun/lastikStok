/*!


TODO:
-Show Duplicate key error
-Pagination ?? -- postponed
-Modallar Tarayinca sayfayi kapatiyor cikiyor.>>bug
-Tanim tablosunda stok gosterilmeyecek -- Done
+ insert ederken basindaki sonundaki bosluklari trimleyip at
+ inputlar icin checkler eklenecek

=========================================================
* Argon Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useDebugValue } from "react";
import ModalEditDefinition from "./ModalEditDefinition";
import Tire from "../../Tire.js";

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Container,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
  UncontrolledDropdown,
  DropdownToggle,
  Input,
  Media,
  // Pagination,
  // PaginationItem,
  // PaginationLink,
  Progress,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
  Modal
} from "reactstrap";

import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";

// core components
import Header from "components/Headers/Header.jsx";    
import { throwStatement, switchStatement, enumBooleanBody } from "@babel/types";
import { couldStartTrivia, isIterationStatement } from "typescript";

import StockTable from "StockTable";
import ModalInformation from "./ModalInformation";
// import Tire from "Tire";

// const client = Stitch.initializeDefaultAppClient("lastikpark-ogewz");
const client = Stitch.getAppClient("lastikpark-ogewz");
const mongodb = client.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas"
);

const db = mongodb.db("lastikParkDB");


client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
  console.log(`Logged in as anonymous user with id: ${user.id}`);
}).catch(console.error);



class Tanim extends React.Component {
  
  // constructor() {
  //   super();
  //   this.state = {
  //     marka: "",
  //     taban: 0,
  //     oran: 0,
  //     jant:"",
  //     yukEndeksi:"",
  //     hizEndeksi:"",
  //     desen:"",
  //     yanakYapisi:"",
  //     mevsim:"",
  //     diger:"",
  //     tableData: []
      
  //   };
  // constructor(props) {
  //   super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
  //   this.state = { //state is by default an object
  //      tires: [
  //         { marka:'Pirelli', taban: 165, oran: 65, jant: 'R16',yukEndeksi:90,hizEndeksi:'X'},
  //         { marka:'Good Year', taban: 170, oran: 75, jant: 'R17',yukEndeksi:91,hizEndeksi:'Y'},
  //         { marka:'Lassa', taban: 175, oran: 80, jant: 'R19',yukEndeksi:92,hizEndeksi:'Z'},
  //         { marka:'Continental', taban: 180, oran: 80, jant: 'R20',yukEndeksi:93,hizEndeksi:'V'},
  //         { marka:'Kumho', taban: 185, oran: 80, jant: 'R21',yukEndeksi:94,hizEndeksi:'T'}
  //      ]
  //   }
  
    constructor(props) {
      super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
      this.state = { //state is by default an object
        maxStock : 100,
        tires: [],
        modalDeleteTire: false,
        modalEditTire: false,
        modalError : false,
        errorMsg : ""
        // tires: [
        //     { marka:'Pirelli', taban: 165, oran: 65, jant: 'R16',yukEndeksi:90,hizEndeksi:'X'},
        //     { marka:'Good Year', taban: 170, oran: 75, jant: 'R17',yukEndeksi:91,hizEndeksi:'Y'},
        //     { marka:'Lassa', taban: 175, oran: 80, jant: 'R19',yukEndeksi:92,hizEndeksi:'Z'},
        //     { marka:'Continental', taban: 180, oran: 80, jant: 'R20',yukEndeksi:93,hizEndeksi:'V'},
        //     { marka:'Kumho', taban: 185, oran: 80, jant: 'R21',yukEndeksi:94,hizEndeksi:'T'}
        //  ]
      }

    
    //let tire2 = new Tire("Gudyiear",165,65,"R16",90,"T","desen","yanak","mevsim","diger");
    console.log("*** CONSTRUCTOR ***");


    
    this.insertNewTire = this.insertNewTire.bind(this);
    
    this.inputTyped = this.inputTyped.bind(this);
    this.displayInventory = this.displayInventory.bind(this);
    //this.toggleModal = this.toggleModal.bind(this);
   // this.toggleEditModal = this.toggleEditModal.bind(this);
  }
  


  

/*************************************************************************************************/
/***************************** DATABASE FUNCTIONS ************************************************/
  updateTireInDB = (tire) => {
      db.collection("inventoryCollection")
      .findOneAndReplace(
        {_id : tire._id},tire
      )
      .then(DocumentT => {
        console.log("Updated document: ", DocumentT);
        this.setState({modalEditTire:false });
        this.refreshInventoryTable();
      }).catch(console.error);
  }

  deleteTireFromDB = (tire)=>{
      //debugger;
      let {_id} = tire;
   
      
      console.log("Tirewith id '",_id.toString(),"'will be deleted from database.");
      console.log(tire);

      db.collection("inventoryCollection")
        .findOneAndDelete(
          {_id : tire._id}
        )
     .then(DocumentT => {
      console.log("Deleted document: ", DocumentT);
      this.setState({modalDeleteTire: false});
      this.refreshInventoryTable();
    }).catch(console.error);



  }

  insertNewTire() {
    let _marka = document.getElementById("tanim-marka").value;
    let _model = document.getElementById("tanim-model").value;
    let _taban = Number(document.getElementById("tanim-taban").value);
    let _oran  = Number(document.getElementById("tanim-oran").value);
    let _jant = document.getElementById("tanim-jant").value;
    let _yukEndeksi= Number(document.getElementById("tanim-yuk").value);
    let _hizEndeksi = document.getElementById("tanim-hiz").value;
    let _yanakYapisi = document.getElementById("tanim-yanak").value;
    let _mevsim = document.getElementById("tanim-mevsim").value;
    let _diger = document.getElementById("tanim-diger").value;

    db.collection("inventoryCollection")
    .insertOne({
      owner_id: client.auth.user.id,
      marka: _marka,
      model: _model,
      taban: _taban,
      oran: _oran,
      jant: _jant,
      yukEndeksi: _yukEndeksi,
      hizEndeksi: _hizEndeksi,
      yanakYapisi: _yanakYapisi,
      mevsim: _mevsim,
      diger: _diger
    })
    .then(remoteResult => {
     console.log("Insert done with id:",remoteResult.insertedId);
     this.refreshInventoryTable(); 
   }).catch(
      //console.error
        this.displayError(console.error)

        // console.log(error.message);
        // this.setState({modalError: true,errorMsg : error.message});
        //     );
     );
  }

  refreshInventoryTable(){
    // db.collection("inventoryCollection").find().toArray().then(results => {
    //   console.log("StockItems:",results);
    //   this.state.tires = results;
    //   console.log("TiresArray",this.tires);
    //   console.log("StateTiresArray",this.state.tires);
    //   this.setState((prevState,results) => {
    //     let tanim = Object.assign({}, prevState.jasper);  // creating copy of state variable jasper
    //     tanim.tires = results;                     // update the name property, assign a new value                 
    //     return { tanim };                                 // return new object jasper object
    //   })
    //debugger;



    db.collection("inventoryCollection").find().toArray().then(results => {
      
      console.log("StockItems:",results);
      //console.log("TiresArray",this.state.tires);
      // let resArry = Object.assign({}, results);
      // this.tableRows = results;
      this.setState( state =>{ 
        console.log("Burdaki results ne: ",results);
        
        return {tires : results}                // return new object jasper object
        
      })
    })
    .catch(console.error);
    //this.forceUpdate();
      
      console.log(">>> Table ROWS: ",this.tableRows);
      console.log("StateTiresArray",this.state.tires);
    
  }

/*************************************************************************************************/
/***************************** REACT LIFECYCLE METHODS *******************************************/


  componentDidMount(){
    console.log("DidMount Entered:");
    // console.log(tbData);
    // db.collection("inventoryCollection").find().toArray().then(results => {
    //   console.log("StockItems:",results);
    //   this.state.tires = results;
    //   console.log("TiresArray",this.tires);
    //   console.log("StateTiresArray",this.state.tires);
    //   this.setState((prevState,results) => {
    //     let tanim = Object.assign({}, prevState.jasper);  // creating copy of state variable jasper
    //     tanim.tires = results;                     // update the name property, assign a new value                 
    //     return { tanim };                                 // return new object jasper object
    //   })
    //this.refreshInventoryTable();
  }
  
   componentWillMount(){
      console.log("*** willMount/ " );
      this.refreshInventoryTable();
    }
  
    componentWillUpdate(){
        console.log("***willUpdate ", this.state.tires );
    }
   
  
  
  



  


  inputTyped(event){
    var stateToChange = event.target.id.substring(6); 
    
    switch (stateToChange) {
      case "marka":
        this.state.marka = event.target.value;
        break;
      case "taban":
        this.state.taban = Number(event.target.value);
        break;
      case "oran":
        this.state.oran = Number(event.target.value);
        break;
      case "jant":
        this.state.jant = event.target.value;
        break;
      case "yuk":
        this.state.yukEndeksi = Number(event.target.value);
        break;
      case "hiz":
        this.state.hizEndeksi = event.target.value;
        break;
      case "yanak":
        this.state.yanakYapisi = event.target.value;
        break;
      case "mevsim":
        this.state.mevsim = event.target.value;
        break;
      case "diger":
        this.state.diger = event.target.value;
        break;
      default:
        break;
    }
    
  }

  
 
  displayInventory(){
    console.log("Entered in display inventory:");
    // db.collection("inventoryCollection")
    //    .find({}, { limit: 1000 })
    //    .asArray()
    //    .then(tableData => {
    //      this.setState({tableData});
    //    })
    //    .catch(console.error);

      var callback = function(err, res){
        if(err) {
           return res.status(400).send({message: 'Server error:' + JSON.stringify(err)});
        } else {
           res.json(res);
       }
      }


   }



  displayError = (err) => {
     //console.err;
     console.log("=======================================");
     console.log(err.message);
     this.setState({modalError: true,errorMsg : err.message});      
  }




  resetForm(){
    document.getElementById("tanim-marka").value = "";
    document.getElementById("tanim-taban").value = "";
    document.getElementById("tanim-oran").value="";
    document.getElementById("tanim-jant").value="";
    document.getElementById("tanim-yuk").value="";
    document.getElementById("tanim-hiz").value="";
    document.getElementById("tanim-yanak").value="";
    document.getElementById("tanim-mevsim").value="";
    document.getElementById("tanim-diger").value="";


  } 

/********************************************************************************/
/******************************* MODAL FUNCTIONS ********************************/

/********* For Edit Modal: */
toggleEditModal = () => {
 // debugger;
  this.setState({modalEditTire: !this.state.modalEditTire});
  //return this.state.modalEditTire;
}

setModalInterComp = (modalState,shouldBeVisible) => {
    this.setState({[modalState] : shouldBeVisible});
    if (modalState === "modalError"){
        this.setState({errorMsg: ""});     
    }
}



toggleModal = (modalStateName)=> {  


  this.setState({
    [modalStateName]: !this.state[modalStateName]
  });


};



/********* For Confirmation Modal */
// toggleModal = (state,tire)=> {  
//   if (!this.state[state]) {
//     this.setState({selectedTire:tire,isTireSelected:true});
//     console.log(tire);
//   } 

//   this.setState({
//     [state]: !this.state[state]
//   });


// };
  
  


  renderStockData(){
    // console.log("?? t",this.tableRows);
     return this.state.tires.map((tire, index) => {
          let tireTemp = new Tire(tire);
          let deleteConfirmQstn ="Yukarda belirtilen lastiği envanterden silmek üzeresiniz.\nOnaylıyor musunuz?"

          console.log("TireArray to be parsed has lengt of: ",this.state.tires.length);
          const { _id,owner_id,marka,model,taban,oran,jant,yukEndeksi,hizEndeksi,yanakYapisi,mevsim,diger } = tire; //destructuring
          console.log("id and oid:",tireTemp._id,tireTemp.owner_id);

          
          const ebat = String(taban).concat(" / ").concat(String(oran))
                          .concat(" / ").concat(jant)
                            .concat(" / ").concat(yukEndeksi)
                              .concat(" / ").concat(hizEndeksi);
          //*TODO burda stok sayisi hesaplanmasi lazim                            
          const stockCount = 10;
          const stockPerc = stockCount / this.state.maxStock *100;
        
          const tooltipID = "tooltip".concat(_id.toString());
          const rowId = "r".concat(_id.toString());
          const otherInfo = "Stok#: ".concat(String(stockCount)).concat(
                            "\n\t Yanak: ".concat(yanakYapisi)).concat(
                            "\n\t Mevsim: ".concat(mevsim).concat(
                            "\n\t Diğer: ".concat(diger)));
          
                            console.log("otherinfi:",otherInfo);
          const editPopupTitle = marka.concat(" ").concat(model).concat(" - ").concat(ebat);

                                    
          // if (stockPerc <= 20) {
          //   var barClassVar = 'bg-danger';
          //   var infoIcon = 'fas fa-info-circle text-red';  
          //   var settingsIcon = 'ni ni-settings text-red';
          //   var ebatIcon = 'fas fa-car-side text-red'
          // }else if (stockPerc >= 21 && stockPerc <=80 ) {
          //   var barClassVar = 'bg-info';
          //   var infoIcon = 'fas fa-info-circle text-info';
          //   var settingsIcon = 'ni ni-settings text-info';
          //   var ebatIcon = 'fas fa-car-side text-info'
          // }else{
          //   var barClassVar = 'bg-success';
          //   var infoIcon = 'fas fa-info-circle text-green';
          //   var settingsIcon = 'ni ni-settings text-green';
          //   var ebatIcon = 'fas fa-car-side text-green'
          // }

          
          var infoIcon = 'fas fa-info-circle text-info';  
          var settingsIcon = 'ni ni-settings text-info';
          var ebatIcon = 'fas fa-car-side text-info'
          
          

          return (
              <tr key={rowId}>
              <th scope="row">
                <Media className="align-items-center">
                  <a
                    className="avatar rounded-circle mr-3"
                    href="#pablo"
                    onClick={e => e.preventDefault()}
                  >
                    <img
                      alt="..."
                      src={require("assets/img/theme/sketch.jpg")}
                    />
                  </a>
                  <Media>
                    <span className="mb-0 text-sm">
                      {marka}
                    </span>
                  </Media>
                </Media>
              </th>
              <td>
                <span className="mb-0 text-sm">
                  {model}
                </span>
              </td>
              <td>
                  <i className={ebatIcon} /> {ebat}
              </td>
              {/* <td>
                <div className="d-flex align-items-center">
                  <span className="mr-2">{stockCount}</span>
                    <div>
                      <Progress
                        max="100"
                        value={stockPerc}
                        barClassName={barClassVar}
                      />
                  </div>
                </div>                
              </td> */}
              <td className = "text-center">
                <span>
                <i className={infoIcon} id={tooltipID} /> 
                  <UncontrolledTooltip
                    delay={0}
                    target={tooltipID}
                  >
                    {otherInfo}
                  </UncontrolledTooltip>
                  </span>
              </td>
              <td className="text-right">
              <UncontrolledDropdown direction="left">
                  <DropdownToggle className="pr-0" nav>
                    <i className={settingsIcon} /> 
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-arrow">
                    <DropdownItem className="noti-title" header tag="div">
                      <h6 className="text-overflow m-0">{editPopupTitle}</h6>
                    </DropdownItem>
                    <DropdownItem divider />

                    <DropdownItem onClick={() => this.toggleModal("modalEditTire")}>
                      <i className="fas fa-edit" />
                      <span>Düzenle</span>
                      <ModalEditDefinition 
                        title={tireTemp.mainInfo()}
                        tire={tireTemp}
                        modalStateName="modalEditTire" 
                        isOpen={this.state.modalEditTire}
                        toggleFunc={this.setModalInterComp}
                        editFunc={this.updateTireInDB}
                        forTire={tireTemp}
                        />

                      
                    

                    </DropdownItem>
                    <DropdownItem onClick={() => this.toggleModal("modalDeleteTire")}>
                      <i className="fas fa-trash-alt"/>
                      <span>Sil</span> 
                      <ModalInformation headerTitle="Dikkat!" 
                                        mainTitle={tireTemp.mainInfo()}
                                        confirmButtonName="Onaylıyorum, sil."
                                        question={deleteConfirmQstn}
                                        isOpen={this.state.modalDeleteTire}
                                        modalStateName="modalDeleteTire"
                                        toggleFunc={this.setModalInterComp}
                                        confirmFunc={this.deleteTireFromDB}
                                        forTire={tireTemp}
                      />

                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </td> 
            </tr>
          )
        
                      
        })
      
  }

  
  
  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
            <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <h3 className="mb-0">Yeni Lastik Tanimi</h3>
                </CardHeader>
                {/* <CardBody className="bg-secondary shadow"> */}
                <CardBody>
                <Form>
                    <h6 className="heading-small text-muted mb-4">
                      Lastik Bilgileri
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label htmlFor="tanim-marka"
                                className="form-control-label"
                              >
                                Marka
                              </label>
                            
                              
                              <Input type="text" 
                              className="form-control-alternative"
                              id="tanim-marka"
                              placeholder="Yeni Lastik Markasini Girin"
                              // onChange={this.inputTyped}
                              
                              />
                               

                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label htmlFor="tanim-model"
                                className="form-control-label"
                              >
                                Desen
                              </label>
                            
                              
                              <Input type="text" 
                              className="form-control-alternative"
                              id="tanim-model"
                              placeholder="Yeni Lastik Deseni Girin"
                              // onChange={this.inputTyped}
                              
                              />
                               

                          </FormGroup>
                        </Col>
                        </Row>
                        <Row>
                        <Col lg="3">
                          <FormGroup>
                          <label htmlFor="tanim-taban"
                                className="form-control-label"
                              >
                                Taban
                              </label>
                            
                              
                              <Input type="number" 
                              className="form-control-alternative"
                              id="tanim-taban"
                              placeholder="155<->325"
                              min="155"
                              max="325"
                              step="10"
                              // onChange={this.inputTyped}
                              />
                          </FormGroup>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                          <label htmlFor="tanim-oran"
                                className="form-control-label"
                              >
                                Oran
                              </label>
                            
                              
                              <Input type="number" 
                              className="form-control-alternative"
                              id="tanim-oran"
                              placeholder="20<->95"
                              min="20"
                              max="95"
                              step="5"
                              // onChange={this.inputTyped}
                              />
                          </FormGroup>
                        </Col>
                        <Col lg="3">
                          <FormGroup>
                          <label htmlFor="tanim-jant"
                                className="form-control-label"
                              >
                                Jant
                              </label>
                            
                              
                              <Input type="text" 
                              className="form-control-alternative"
                              id="tanim-jant"
                              placeholder="Rxx"
                              // onChange={this.inputTyped}
                              />
                          </FormGroup>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                          <label htmlFor="tanim-yuk"
                                className="form-control-label"
                              >
                                Yuk Endeksi
                              </label>
                            
                              
                              <Input type="number" 
                              className="form-control-alternative"
                              id="tanim-yuk"
                              placeholder="70<->130"
                              min="70"
                              max="130"
                              step="1"
                              // onChange={this.inputTyped}
                              />
                              
                          </FormGroup>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                          <label htmlFor="tanim-hiz"
                                className="form-control-label"
                              >
                                Hiz Endeksi
                              </label>
                            
                              
                              <Input type="text" 
                              className="form-control-alternative"
                              id="tanim-hiz"
                              maxLength="1"
                              // onChange={this.inputTyped}
                              />
                          </FormGroup>
                        </Col>
                    </Row>    
                    <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label htmlFor="tanim-yanak"
                              className="form-control-label"
                              
                            >
                              Yanak Yapisi
                            </label>

                            <Input
                              className="form-control-alternative"
                              id="tanim-yanak"
                              type="text"
                              placeholder="Lastik Yanaklari"
                              // onChange={this.inputTyped}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label htmlFor="tanim-mevsim"
                              className="form-control-label"
                              
                            >
                              Mevsim
                            </label>

                            <Input
                              className="form-control-alternative"
                              id="tanim-mevsim"
                              placeholder="Yaz/Kis/4Mevsim.."
                              type="text"
                              // onChange={this.inputTyped}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                        <FormGroup > 
                              <label htmlFor="tanim-diger"
                                className="form-control-label"
                              >
                                Diger
                              </label>
                            
                              
                              <Input type="text"
                              placeholder="Ek ozellikler..." 
                              className="form-control-alternative"
                              id="tanim-diger"
                              // onChange={this.inputTyped}
                              />
          
                            </FormGroup> 
                        </Col>
                    </Row>
                    
                    <Row>
                      {/* <FormGroup>  */}
                        <Col lg="3">
                          {/* <FormGroup>        */}
                                <Button block className="btn-icon btn-3" color="danger" type="button" 
                                    size="lg" onClick={ this.resetForm } >
                                  <span className="btn-inner--icon">
                                    {/* <i className="ni ni-folder-17" /> */}
                                    <i className="fas fa-eraser" />
                                  </span>
                                  <span className="btn-inner--text">Formu Temizle</span>
                                </Button>
                          {/* </FormGroup>  */}
                        </Col>
                        
                        <Col lg="9">
                                
                                <Button block className="btn-icon btn-3" color="primary" type="button" 
                                    size="lg" onClick={ this.insertNewTire } >
                                  <span className="btn-inner--icon">
                                    {/* <i className="ni ni-folder-17" /> */}
                                    <i className="fas fa-save" />
                                  </span>
                                  <span className="btn-inner--text">Kaydet</span>
                                </Button>
                          {/* </FormGroup>  */}
                        </Col>
                    </Row>
                      
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </div>
          </Row>
          {/* Dark table */}
          <Row className="mt-5" >
            <div className="col">
              <Card className="bg-default shadow">
                <CardHeader className="bg-transparent border-0">
                  <h3 className="text-white mb-0">Tanımlı Lastikler</h3>
                </CardHeader>
                <Table
                  className="align-items-center table-dark table-flush"
                  responsive
                >
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Marka</th>
                      <th scope="col">Desen</th>
                      <th scope="col">Ebatlar</th>
                      <th className="text-center" scope="col">Diğer</th>
                      <th className="text-right" scope="col">Düzenle</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.renderStockData()}
                    
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
          <ModalInformation headerTitle="Hata!" 
                                        mainTitle={this.state.errorMsg}
                                        confirmButtonName="Tamam"
                                        question="Uzgunuz yapmak istediginiz islem Hatali."
                                        isOpen={this.state.modalError}
                                        modalStateName="modalError"
                                        toggleFunc={this.setModalInterComp}
                                        // confirmFunc={this.deleteTireFromDB}
                                        // forTire={tireTemp}
                      />
        </Container>
      </>
    );
  }
}

export default Tanim;


                     // </ModalInformation><Modal
                      //   className="modal-dialog-centered modal-danger"
                      //   contentClassName="bg-gradient-danger"
                      //   isOpen={this.state.modalDeleteTire}
                      //   toggle={() => this.toggleModal("modalDeleteTire",tire)}
                      //   backdrop="static"
                      // >
                      //   <div className="modal-header">
                      //     <h6 className="modal-title" id="modal-title-notification">
                      //       Dikkat!
                      //     </h6>
                      //     <button
                      //       aria-label="Close"
                      //       className="close"
                      //       data-dismiss="modal"
                      //       type="button"
                      //       onClick={() => this.toggleModal("modalDeleteTire",tire)}
                      //     >
                      //       <span aria-hidden={true}>×</span>
                      //     </button>
                      //   </div>
                      //   <div className="modal-body">
                      //     <div className="py-3 text-center">
                      //       <i className="ni ni-bell-55 ni-3x" />
                      //       {/* <h4 className="heading mt-4">{editPopupTitle} - {otherInfo}</h4> */}
                      //       <h4 className="heading mt-4">{this.printTireInfo(this.state.selectedTire)}</h4>
                      //       <p>
                      //         Yukarda belirtilen lastiği envanterden silmek üzeresiniz.
                      //         Onaylıyor musunuz?
                      //       </p>
                      //     </div>
                      //   </div>
                      //   <div className="modal-footer">
                      //     <Button className="btn-white" color="default" type="button"
                      //             onClick={() => this.deleteTireFromDB(this.state.selectedTire)}>
                      //       Onaylıyorum, sil.
                      //     </Button>
                      //     <Button
                      //       className="text-white ml-auto"
                      //       color="link"
                      //       data-dismiss="modal"
                      //       type="button"
                      //       onClick={() => this.toggleModal("modalDeleteTire",tire)}
                      //     >
                      //       Vazgeç
                      //     </Button>
                      //   </div>
                      // </Modal>
                      //)} 

// printTireInfo = (tire) => {
   
  //   if (this.state.isTireSelected ) { 
    
  //   let { _id,owner_id,marka,taban,oran,jant,yukEndeksi,hizEndeksi,desen,yanakYapisi,mevsim,diger } = tire; //destructuring   
  //   const ebat = String(taban).concat(" / ").concat(String(oran))
  //                   .concat(" / ").concat(jant)
  //                     .concat(" / ").concat(yukEndeksi)
  //                       .concat(" / ").concat(hizEndeksi);

  
  //   const otherInfo = "Desen: ".concat(desen).concat(
  //                     "\n\t Yanak: ".concat(yanakYapisi)).concat(
  //                     "\n\t Mevsim: ".concat(mevsim).concat(
  //                     "\n\t Diğer: ".concat(diger)));
    
  //                     console.log("otherinfi:",otherInfo);
  //   const editPopupTitle = marka.concat(" - ").concat(ebat);
  //   return editPopupTitle.concat(" - ").concat(otherInfo);
  //   }
  //   else
  //     return null;
  // }