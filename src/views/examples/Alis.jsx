/*!



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
import React from "react";
// react component that copies the given text inside your clipboard
//import { CopyToClipboard } from "react-copy-to-clipboard";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Form,

  FormGroup,
  Input,
  Row,
  Col,

} from "reactstrap";
// core components
import Header from "components/Headers/Header.jsx";
import Datepicker from "../../Datepicker.jsx";
import AlisDataTable from "./AlisDataTable.jsx";

import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";

//import { noop } from "@babel/types";
//import { thisTypeAnnotation } from "@babel/types";
//import { eventNames } from "cluster";
import 'moment';
/***********************************************************************/
/* DB STUFF */
//const client = Stitch.initializeDefaultAppClient("lastikpark-ogewz");
const client = Stitch.getAppClient("lastikpark-ogewz");
const mongodb = client.getServiceClient(
  RemoteMongoClient.factory,
  "mongodb-atlas"
);

const db = mongodb.db("lastikParkDB");

client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
  console.log(`Logged in as anonymous user with id: ${user.id}`);
}).catch(console.error);
/***********************************************************************/
/* Formatting Currency */
var formatTRY = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  });

var currency_symbol = "₺"

class Alis extends React.Component {
  constructor(props) {
    super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
    this.state = {
         tireSelected : {}
        ,queryResulted1 : false
        ,definedBrands : []
        ,modelsForTheBrand : []
        ,tabansForSelection : []
        ,oransForSelection : []
        ,jantsForSelection : []
        ,yukEndeksForSelection : []
        ,hizEndeksForSelection :[]
        ,yanaksForSelection : []
        ,mevsimsForSelection : []
        ,otherInfo: []
        ,purchases : []
        
        ,selectedBrand : ""
        ,selectedModel : ""
        ,selectedTaban : ""
        ,selectedOran : ""
        ,selectedJant : ""
        ,selectedYuk : ""
        ,selectedHiz : ""
        ,selectedYanak : ""
        ,selectedMevsim : ""
        ,selectedOther : ""
        ,selectedDate : ""
        ,birimMaliyet : "" 
        ,alisAdet : ""
        ,toplamMaliyet :""
        ,wrongInputs : [] //To display error on wrong/unfilled input fields
        ,saveButtonPressed : false

        //Modals:
        ,modalDeletePurchase : false
        ,modalEditPurchase : false

        //Filters
        ,filterArrayMarka : []
        ,filterArrayTarih : []
        ,filterApplied : {}

    }
    
    //let definedBrands = [];
    // const editableFields = [{label: "Birim Maliyet(KDV Dahil)", type="number",mapsTo: "birimMaliyet" },
    //                         {label: "Adet", type : "number", mapsTo: "alisAdet"},
    //                         {label: "Tarih", type : "date", mapsTo: "tarih" } ];
  }
  

  componentWillMount(){
      db.collection("inventoryCollection").find().toArray().then(dbResults => {
        
            console.log("will DB Results:",dbResults);
            
            //prepare Options
            let distinctMarkaValues = [...new Set(dbResults.map( value => value.marka))].sort();
            let distinctModelValues = [...new Set(dbResults.map( value => value.model))].sort();
            let distinctTabanValues = [...new Set(dbResults.map( value => value.taban))].sort();
            let distinctOranValues = [...new Set(dbResults.map( value => value.oran))].sort();
            let distinctJantValues = [...new Set(dbResults.map( value => value.jant))].sort();
            let distinctYukValues = [...new Set(dbResults.map( value => value.yukEndeksi))].sort();
            let distinctHizValues = [...new Set(dbResults.map( value => value.hizEndeksi))].sort();
            let distinctYanakValues = [...new Set(dbResults.map( value => value.yanakYapisi))].sort();
            let distinctMevsimValues = [...new Set(dbResults.map( value => value.mevsim))].sort();
            let distinctDigerValues = [...new Set(dbResults.map( value => value.diger))].sort();
    
           
            this.setState({ definedBrands : distinctMarkaValues ,
                            modelsForTheBrand : distinctModelValues ,
                            tabansForSelection : distinctTabanValues ,
                            oransForSelection : distinctOranValues ,
                            jantsForSelection : distinctJantValues ,
                            yukEndeksForSelection : distinctYukValues ,
                            hizEndeksForSelection : distinctHizValues ,
                            yanaksForSelection : distinctYanakValues,
                            mevsimsForSelection : distinctMevsimValues,
                            otherInfo : distinctDigerValues           
            });
        })
        .catch(console.error);

        db.collection("purchaseCollection").find().toArray().then(dbResults => {
        
          console.log("will DB Results:",dbResults);
          
          //prepare Options
          let distinctFilterMarkaValues = [...new Set(dbResults.map(value => value.marka))].sort();
          let distinctFilterTarihValues = [...new Set(dbResults.map(value => value.tarih))].sort();
  
         
          this.setState({ filterArrayMarka : distinctFilterMarkaValues
                         ,filterArrayTarih : distinctFilterTarihValues       
          });
        })
        .catch(console.error);

        

        this.refreshPurchaseTable(this.state.filterApplied);

      
            
  }
  

  levelforOption = (optionName) => {
      switch (optionName) {
        case "marka": return 1
        case "model": return 2
        case "taban": return 3
        case "oran":  return 4
        case "jant": return 5
        case "yuk": return 6
        case "hiz": return 7
        case "yanak": return 8
        case "mevsim": return 9 
        case "diger": return 10
        default: return 0
      }
  }

  findLevelAfterDeselect = (obj,selOpt) =>{
      console.log(Object.keys(obj));
      let returnValue = 0;
      Object.keys(obj).map( (prop,index) => {
          console.log(index,prop);
          if ( returnValue < this.levelforOption(prop) 
                && this.levelforOption(prop) < this.levelforOption(selOpt) ) {
                  returnValue = this.levelforOption(prop) ;
                }

      });
      return returnValue;
  }



  adetChanged = (event) => {
    let birimMaliyet = this.state.birimMaliyet;
    let toplamMaliyet = birimMaliyet * event.target.value;
    let birimKdvsiz = birimMaliyet / 1.18 ;
    let toplamKdvsiz = toplamMaliyet / 1.18 ;
    document.getElementById("alis-birim-maliyet-kdvsiz").value = ((Number.isNaN(birimKdvsiz)) ? "" : formatTRY.format(birimKdvsiz) ) ;
    document.getElementById("alis-toplam-maliyet-kdvsiz").value = ((Number.isNaN(toplamKdvsiz)) ? "" : formatTRY.format(toplamKdvsiz) ) ;
    this.setState({alisAdet: event.target.value,toplamMaliyet: toplamMaliyet});

  }

  inputBirimChanged = (event) => {
      let toplamMaliyet;
      let birimMaliyet = event.target.value;
      
      this.setState( (state) => {
          toplamMaliyet = state.toplamMaliyet;
          if (birimMaliyet === "") {
              toplamMaliyet = "";
          }else{
              if ( state.alisAdet > 0 ) {
                  toplamMaliyet = birimMaliyet * state.alisAdet ;
              }else{
                  toplamMaliyet = "";
              }
          }
        

          let birimKdvsiz = birimMaliyet / 1.18 ;
          let toplamKdvsiz = toplamMaliyet / 1.18 ;


          document.getElementById("alis-birim-maliyet-kdvsiz").value = ((Number.isNaN(birimKdvsiz)) ? "" : formatTRY.format(birimKdvsiz) ) ;
          document.getElementById("alis-toplam-maliyet-kdvsiz").value = ((Number.isNaN(toplamKdvsiz)) ? "" : formatTRY.format(toplamKdvsiz) ) ;
          
          return { birimMaliyet,toplamMaliyet };

     }); 
  }

  inputToplamChanged = (event) => {
    let birimMaliyet;
    let toplamMaliyet = event.target.value;
    
    this.setState((state) => {
        birimMaliyet = state.birimMaliyet;
        if (toplamMaliyet === ""){
            birimMaliyet = "";
        }else{
            if (state.alisAdet > 0 ) {
                birimMaliyet = toplamMaliyet / state.alisAdet ;
            }else{
              birimMaliyet = "";
            }
        }

        
        let birimKdvsiz = formatTRY.format(birimMaliyet / 1.18 );
        let toplamKdvsiz = formatTRY.format(toplamMaliyet / 1.18 );

        document.getElementById("alis-birim-maliyet-kdvsiz").value = (Number.isNaN(birimKdvsiz) ? "" : birimKdvsiz );
        document.getElementById("alis-toplam-maliyet-kdvsiz").value = (Number.isNaN(toplamKdvsiz) ? "" : toplamKdvsiz );
        return { birimMaliyet,toplamMaliyet };
    });
      
  }

  inputDateChanged = (value) => {
    console.log("inputDateChangeCalled : ",value);
      this.setState({
        selectedDate: value // ISO String, ex: "2016-11-19T12:00:00.000Z"
        
      });
      // this.setState((state)=>{
      //     let selectedDate = event.target.value;
      //     return selectedDate
      //   });
  }

  inputDateChanged2 = (value,formattedValue) => {
    console.log("value2, formattedVal2: ",value,formattedValue);
    this.setState({
      selectedDate2: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedDate2: formattedValue // Formatted String, ex: "11/19/2016"
    });
    // this.setState((state)=>{
    //     let selectedDate = event.target.value;
    //     return selectedDate
    //   });
  }


  inputSetCorrectlyFor = (inputField) => {
      let decision = true;
      // inputField = inputField.substring(5);
      if (this.state.saveButtonPressed){
        switch (inputField) {
          case "marka":
              decision = (this.state.selectedBrand === "") ? false : true ;
            break;
          case "model":
              decision = (this.state.selectedModel === "") ? false : true ;
            break;
          case "taban":
              decision = (this.state.selectedTaban === "") ? false : true ;
            break;
          case "oran":
              decision = (this.state.selectedOran === "") ? false : true ;
            break;
          case "jant":
              decision = (this.state.selectedJant === "") ? false : true ;
            break;
          case "yuk":
              decision = (this.state.selectedYuk === "") ? false : true ;
            break;
          case "hiz":
              decision = (this.state.selectedHiz === "") ? false : true ;
            break;
          case "yanak":
              decision = (this.state.selectedYanak === "") ? false : true ;
            break;
          case "mevsim":
              decision = (this.state.selectedMevsim === "") ? false : true ;
            break;
          case "diger":
              decision = (this.state.selectedOther === "") ? false : true ;
            break;
          case "birim":
            decision = (this.state.birimMaliyet === "" || this.state.birimMaliyet == 0 ) ? false : true ;
            break;
          case "adet":
            decision = (this.state.alisAdet === "" || this.state.alisAdet == 0 ) ? false : true ;
            break;
          case "toplam":
            decision = (this.state.toplamMaliyet === "" || this.state.toplamMaliyet == 0 ) ? false : true ;
            break;
          default:
            break;
        }
      }
      return decision;
   }

  allInputsSetCorrectly = () => {

      let setCorrect = true ;
      let tempArray = [];
      if (this.state.selectedBrand === ""){
          tempArray.push("Marka");
          setCorrect = false;
          
      }
      if (this.state.selectedModel === "" ){
          tempArray.push("Desen");
          setCorrect = false;
      }
      if (this.state.selectedTaban === "" ){
          tempArray.push("Taban");
          setCorrect = false;
      }
      if (this.state.selectedOran === "" ){
          tempArray.push("Oran");
          setCorrect = false;
      }
      if (this.state.selectedJant === "" ) {
          tempArray.push("Jant");
          setCorrect = false;
      }
      if (this.state.selectedYuk === ""  ){
         tempArray.push("Yuk Endeksi");
         setCorrect = false;
      } 
      if (this.state.selectedHiz === ""  ){
          tempArray.push("Hız Endeksi");
          setCorrect = false;
      }
      if (this.state.selectedYanak === "" ){
          tempArray.push("Yanak");
          setCorrect = false;
      }
      if (this.state.selectedMevsim === "" ){
          tempArray.push("Mevsim");
          setCorrect = false;
      }
      if (this.state.selectedOther === "" ){
          tempArray.push("Diğer");
          setCorrect = false;
      }

      // if (this.state.selectedDate ){
      //     tempArray.push("Tarih");
      //     setCorrect = false;
      // }
      if (this.state.birimMaliyet === ""  || this.state.birimMaliyet == 0){
          tempArray.push("Birim-maliyet");
          setCorrect = false;
      }
      if (this.state.alisAdet === "" || this.state.alisAdet == 0){
          tempArray.push("Adet");
          setCorrect = false;
      }
      if (this.state.toplamMaliyet === "" || this.state.toplamMaliyet == 0 ){
          tempArray.push("Toplam-maliyet");
          setCorrect = false;
      }


      this.setState({saveButtonPressed : true,wrongInputs: tempArray});
      
    // ,selectedOran : ""
    // ,selectedJant : ""
    // ,selectedYuk : ""
    // ,selectedHiz : ""
    // ,selectedYanak : ""
    // ,selectedMevsim : ""
    // ,selectedOther : ""
    // ,selectedDate : ""
    // ,birimMaliyet : "" 
    // ,alisAdet : ""
    // ,toplamMaliyet :""
      return setCorrect;
  }

  savePurchase = () => {

      if ( this.allInputsSetCorrectly() ) {
          let _marka = this.state.selectedBrand ;
          let _model = this.state.selectedModel ;
          let _taban = Number(this.state.selectedTaban);
          let _oran = Number(this.state.selectedOran);
          let _jant = this.state.selectedJant ;
          let _yukEndeksi = Number(this.state.selectedYuk) ;
          let _hizEndeksi = this.state.selectedHiz ;
          let _yanakYapisi = this.state.selectedYanak ;
          let _mevsim = this.state.selectedMevsim ;
          let _diger = this.state.selectedOther;
          let _birimMaliyet = Number(this.state.birimMaliyet);
          let _alisAdet = Number(this.state.alisAdet);
          let _tarih ;
          if (this.state.selectedDate === "" ){
              let today = new Date();
              let dd = String(today.getDate()).padStart(2, '0');
              let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              let yyyy = today.getFullYear();
              _tarih = dd + '/' + mm + '/' + yyyy;
              alert("tarih",_tarih);
          }else{
              _tarih = this.state.selectedDate;
          }
          db.collection("purchaseCollection")
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
              diger: _diger ,
              tarih : _tarih ,
              alisAdet : _alisAdet ,
              birimMaliyet : _birimMaliyet     
            })
            .then(remoteResult => {
                console.log("Insert done with id:",remoteResult.insertedId);
                this.setState({saveButtonPressed: false});
                this.refreshPurchaseTable(this.state.filterApplied); 
          }).catch(
              //console.error
                // this.displayError(console.error)
                //console.log(err.message);
                alert(console.error)
                // console.log(error.message);
                // this.setState({modalError: true,errorMsg : error.message});
                //     );
            );
            let tirePurchased = {
                "owner_id" : client.auth.user.id , //tire.owner_id = client.auth.user.id
                "marka" : _marka ,
                "model" : _model ,
                "taban" : _taban ,
                "oran"  : _oran ,
                "jant"  : _jant ,
                "yukEndeksi" : _yukEndeksi ,
                "hizEndeksi" : _hizEndeksi ,
                "yanakYapisi": _yanakYapisi ,
                "mevsim": _mevsim ,
                "diger" : _diger
            };
            this.updateStockWithPurchase(tirePurchased,_birimMaliyet,_alisAdet,);
          
      }
      else{
        // this.setState({saveButtonPressed:false});
        alert("Eksik bilgi girişi yaptınız. Lütfen giriş yapmadığınız kırmızı ile işaretlenmiş alanları doldurun." ); 
        // if (this.state.wrongInputs.length === 0 ) {
        //   alert("Eksik bilgi girişi yaptınız. Lütfen giriş yapmadığınız şu alanları doldurun: " + errorText );
        // }else{
        //   let errorText;
        //   this.state.wrongInputs.forEach( (item,index) =>{
        //         debugger;
        //           if (index === 0){
        //             errorText = item.substring(5);
        //           }else{
        //               errorText += ", " + item.substring(5);
        //           }
        //         });
        //   alert("Eksik bilgi girişi yaptınız. Lütfen giriş yapmadığınız şu alanları doldurun: " + errorText );
        // }
          
      }

    
  }


  
  updateStockWithPurchase = (tire,fiyat,count) => {
      db.collection("stockCollection").find(tire).toArray().then(dbResults => {
          if (dbResults.length > 0){
              console.log("Stok:Tire found: ",dbResults);
              let tireReturned = dbResults[0];
              let newOrtMaliyet = ((tireReturned.ortMaliyet * tireReturned.alisAdet) + (fiyat * count)) / (tireReturned.alisAdet + count); 
              tireReturned.ortMaliyet = newOrtMaliyet ;
              tireReturned.alisAdet = tireReturned.alisAdet + count;
              tireReturned.stokAdet = tireReturned.stokAdet + count;

              db.collection("stockCollection")
              .findOneAndReplace(tire,tireReturned).then(DocumentT => {
                console.log("Updated document: ", DocumentT);
                alert("stock table: Updated!!");
              }).catch(console.error);
          }
          else{
              console.log("Stok Lastik bulunamadi:");
              
              tire.alisAdet = count ;
              tire.ortMaliyet = fiyat;
              tire.satisAdet = 0;
              tire.ortFiyat = 0;
              tire.stokAdet = count ;

              db.collection("stockCollection")
              .insertOne(tire)
              .then(remoteResult => {
                  console.log("Insert done with id:",remoteResult.insertedId);
                 
                 
            }).catch(
              console.error
            );
          }
      })
      .catch(
        console.error
      );

      //UPSERT:
      // db.collection("stockCollection").findOneAndUpdate(tire,{ $inc:{stokAdet: count} }, {upsert:true})
      // .then(dbResults => {
      //     debugger;
      //     console.log("UPSERT COMPLETED:", dbResults);
      //     console.log("Insert done with id:",dbResults.insertedId);
      // })
      // .catch(console.error);
  }

  editPurchase = (editedTrx,eskiAdet,eskiTotMaliyet) => {
      db.collection("purchaseCollection")
      .findOneAndReplace({ _id: editedTrx._id },editedTrx).then(DocumentX => {
        console.log("Updated document after editingPurchase: ", DocumentX);
        let stockTire2beUpdated = {
          "marka" : DocumentX.marka ,
          "model" : DocumentX.model ,
          "taban" : DocumentX.taban ,
          "oran"  : DocumentX.oran ,
          "jant"  : DocumentX.jant ,
          "yukEndeksi" : DocumentX.yukEndeksi ,
          "hizEndeksi" : DocumentX.hizEndeksi ,
          "yanakYapisi": DocumentX.yanakYapisi ,
          "mevsim": DocumentX.mevsim ,
          "diger" : DocumentX.diger
        };
        //alert("stock table: Updated after Purchase Deletion!!");
        db.collection("stockCollection").findOne(stockTire2beUpdated).then( DocumentT =>{
          console.log("deletePurchase Method/ DocumentT2beUpdated: ",DocumentT)
          //Lastigi buldun simdi stok tablosunu guncelle
          if ((DocumentT.alisAdet - eskiAdet + editedTrx.alisAdet) !== 0 ){
              DocumentT.ortMaliyet = ((DocumentT.ortMaliyet * DocumentT.alisAdet) - eskiTotMaliyet + (editedTrx.birimMaliyet * editedTrx.alisAdet) ) / (DocumentT.alisAdet - eskiAdet + editedTrx.alisAdet); 
          }else{
              DocumentT.ortMaliyet = 0 ;
          }
           
          DocumentT.alisAdet = DocumentT.alisAdet - eskiAdet + editedTrx.alisAdet ;
          DocumentT.stokAdet = DocumentT.stokAdet - eskiAdet + editedTrx.alisAdet ;
          
          db.collection("stockCollection")
          .findOneAndReplace(stockTire2beUpdated,DocumentT).then(DocumentU => {

            console.log("Updated document afterPurchase change: ", DocumentU);
            alert("stock table: Updated after Purchase Change!!");
          }).catch(console.error);

        }
        ).catch(console.error);
        this.setState({modalEditPurchase: false});
        
        this.refreshPurchaseTable(this.state.filterApplied);
      }).catch(console.error);


  }

  deletePurchase = (id) => {
      // let {_id} = tire;
      
        
      console.log("Tirewith id '",id.toString(),"'will be deleted from database.");
      
      

      db.collection("purchaseCollection")
        .findOneAndDelete(
          {_id : id}
        )
      .then(DocumentT => {
        console.log("Deleted document: ", DocumentT);
        let stockTire2beUpdated = {
          "marka" : DocumentT.marka ,
          "model" : DocumentT.model ,
          "taban" : DocumentT.taban ,
          "oran"  : DocumentT.oran ,
          "jant"  : DocumentT.jant ,
          "yukEndeksi" : DocumentT.yukEndeksi ,
          "hizEndeksi" : DocumentT.hizEndeksi ,
          "yanakYapisi": DocumentT.yanakYapisi ,
          "mevsim": DocumentT.mevsim ,
          "diger" : DocumentT.diger
        };
        let deletedPurchaseCost = DocumentT.birimMaliyet;
        let deletedPurchaseCount = DocumentT.alisAdet;

        db.collection("stockCollection").findOne(stockTire2beUpdated).then( DocumentT =>{
          console.log("deletePurchase Method/ DocumentT2beUpdated: ",DocumentT)
          debugger;
          //Lastigi buldun simdi stok tablosunu guncelle
          
          if ( (DocumentT.alisAdet - deletedPurchaseCount ) !== 0){
              DocumentT.ortMaliyet = ((DocumentT.ortMaliyet * DocumentT.alisAdet) - (deletedPurchaseCost * deletedPurchaseCount) ) / (DocumentT.alisAdet - deletedPurchaseCount); 
          }else {
              DocumentT.ortMaliyet = 0;
          }
          //DocumentT.ortMaliyet = newOrtMaliyet ;
          DocumentT.alisAdet = DocumentT.alisAdet - deletedPurchaseCount ;
          DocumentT.stokAdet = DocumentT.stokAdet - deletedPurchaseCount ;
          
          db.collection("stockCollection")
          .findOneAndReplace(stockTire2beUpdated,DocumentT).then(DocumentU => {
            console.log("Updated document afterPurchase Deletion: ", DocumentU);
            alert("stock table: Updated after Purchase Deletion!!");
          }).catch(console.error);

        }
        ).catch(console.error);

        this.setState({modalDeletePurchase: false});
        
        this.refreshPurchaseTable(this.state.filterApplied);
      }).catch(console.error);

  }

  refreshPurchaseTable = (filter) => {
      db.collection("purchaseCollection").find(filter).toArray().then(results => {
        console.log("Purchases:",results);
        //console.log("TiresArray",this.state.tires);
        // let resArry = Object.assign({}, results);
        
        this.setState( {purchases : results})
      })
      .catch(console.error);
        
        
      console.log("purchasesArray",this.state.purchases);

      db.collection("purchaseCollection").find().toArray().then(dbResults => {
        
        console.log("will DB Results:",dbResults);
        
        //prepare Options
        let distinctFilterMarkaValues = [...new Set(dbResults.map(value => value.marka))].sort();
        let distinctFilterTarihValues = [...new Set(dbResults.map(value => value.tarih))].sort();

       
        this.setState({ filterArrayMarka : distinctFilterMarkaValues
                       ,filterArrayTarih : distinctFilterTarihValues       
        });
      })
      .catch(console.error);


  }

  anOptionSelected = (event) => {

      console.log("option selected: " + event.target.value + " of " + event.target.id );
      let _selOpt = String(event.target.id).substring(5);
      let _selVal = event.target.value;

      console.log("Tire Selected: ");
      console.log(this.state.tireSelected);
      // if(this.state.queryResulted1){
      //     this.resetForm();
      //     // this.setState({
      //     //    queryResulted1 : false
      //     //   ,selectedBrand : ""
      //     //   ,selectedModel : ""
      //     //   ,selectedTaban : ""
      //     //   ,selectedOran : ""
      //     //   ,selectedJant : ""
      //     //   ,selectedYuk : ""
      //     //   ,selectedHiz : ""
      //     //   ,selectedYanak : ""
      //     //   ,selectedMevsim : ""
      //     //   ,selectedOther : ""
              
      //     // });
      // }
      this.setState((state)=> {
          let queryResulted1 = state.queryResulted1;
          let selectedBrand = state.selectedBrand;
          let selectedModel = state.selectedModel;
          let selectedTaban = state.selectedTaban;
          let selectedOran = state.selectedOran;
          let selectedJant = state.selectedJant;
          let selectedYuk = state.selectedYuk;
          let selectedHiz = state.selectedHiz;
          let selectedYanak = state.selectedYanak;
          let selectedMevsim = state.selectedMevsim;
          let selectedOther = state.selectedOther;
          // let selectedDate = state.selectedDate;
          // let birimMaliyet = state.birimMaliyet;
          // let alisAdet = state.alisAdet;
          // let toplamMaliyet = state.toplamMaliyet;
          if (state.queryResulted1){
              queryResulted1 = false;
              selectedBrand = "" ;
              selectedModel = "" ;
              selectedTaban = "" ;
              selectedOran = "" ;
              selectedJant = "" ;
              selectedYuk = "" ;
              selectedHiz = "" ;
              selectedYanak = "" ;
              selectedMevsim = "" ;
              selectedOther = "" ;
              // selectedDate = "" ;
              // birimMaliyet = "" ;
              // alisAdet = "" ;
              // toplamMaliyet = "" ;
          }
          switch (_selOpt) {
            case "marka":
                selectedBrand = _selVal;
              break;
            case "model":
                selectedModel = _selVal;
              break;
            case "taban":
                selectedTaban = _selVal;
              break;
            case "oran":
                selectedOran = _selVal;
              break;
            case "jant":
                selectedJant = _selVal;
              break;
            case "yuk":
                selectedYuk = _selVal;
              break;
            case "hiz":
                selectedHiz = _selVal;
              break;
            case "yanak":
                selectedYanak = _selVal;
              break;
            case "mevsim":
                selectedMevsim = _selVal;
              break;
            case "diger":
                selectedOther = _selVal;
              break;
          
            default:
              break;
          }
          return {selectedBrand,selectedModel,selectedTaban,selectedOran,selectedJant,selectedYuk,
                    selectedHiz,selectedYanak,selectedMevsim,selectedOther,queryResulted1};
      });
      

      
      let queryFilterOptions = this.state.tireSelected;
      
      console.log("===> OptionSelected Before: ", queryFilterOptions);
      
 
      if  ( _selVal.includes("Seçin") ) { 
          delete queryFilterOptions[_selOpt];

      }else {
            if ( _selOpt === "taban" || _selOpt === "oran" || _selOpt === "yuk" ) { 
              queryFilterOptions[_selOpt] = Number(_selVal);
            }else{
              queryFilterOptions[_selOpt] = _selVal;
            }
          
      }
      

      console.log("Filter options after new attribute has been added: ", queryFilterOptions);

      db.collection("inventoryCollection").find(queryFilterOptions).toArray().then(dbResults => {
        console.log("DB Results:",dbResults);
        let resultCount = dbResults.length;
        //this.definedBrands = dbResults.map( value => value.marka);
        if ( resultCount == 1) {
          let tire = dbResults[0];
          //const { _id,owner_id,marka,model,taban,oran,jant,yukEndeksi,hizEndeksi,desen,yanakYapisi,mevsim,diger } = tire;
            console.log("-markaSelected tek kayit ife girdi",tire.model,tire.taban,tire.oran,tire.jant);
           
            this.setState(
              
              {
                        
                        tireSelected : {} 
                       ,queryResulted1 : true
                       ,selectedBrand : tire.marka
                       ,selectedModel : tire.model
                       ,selectedTaban : tire.taban
                       ,selectedOran : tire.oran
                       ,selectedJant : tire.jant
                       ,selectedYuk : tire.yukEndeksi
                       ,selectedHiz : tire.hizEndeksi
                       ,selectedYanak : tire.yanakYapisi
                       ,selectedMevsim : tire.mevsim
                       ,selectedOther : tire.diger
                        
                      //  currentLevel : 20,
                      //  modelsForTheBrand : [tire.model] ,
                      //  tabansForSelection : [tire.taban] ,
                      //  oransForSelection : [tire.oran],
                      //  jantsForSelection : [tire.jant],
                      //  yukEndeksForSelection : [tire.yukEndeksi],
                      //  hizEndeksForSelection : [tire.hizEndeksi],
                      //  yanaksForSelection : [tire.yanakYapisi],
                      //  mevsimsForSelection : [tire.mevsim],
                      //  otherInfo : [tire.diger]


            });
            //return;
        }
        //Calculate the options
        let uniqueMarkaValues = [...new Set(dbResults.map( value => value.marka))].sort();
        let uniqueModelValues = [...new Set(dbResults.map( value => value.model))].sort();
        let uniqueTabanValues = [...new Set(dbResults.map( value => value.taban))].sort();
        let uniqueOranValues = [...new Set(dbResults.map( value => value.oran))].sort();
        let uniqueJantValues = [...new Set(dbResults.map( value => value.jant))].sort();
        let uniqueYukValues = [...new Set(dbResults.map( value => value.yukEndeksi))].sort();
        let uniqueHizValues = [...new Set(dbResults.map( value => value.hizEndeksi))].sort();  
        let uniqueYanakValues = [...new Set(dbResults.map( value => value.yanakYapisi))].sort();  
        let uniqueMevsimValues = [...new Set(dbResults.map( value => value.mevsim))].sort();  
        let uniqueDigerValues = [...new Set(dbResults.map( value => value.diger))].sort();  

        

        //uniqueOranValues.unshift("Oran Seçin")
       
        delete queryFilterOptions["_id"];
        delete queryFilterOptions["owner_id"];

        this.setState( (state) => {
            let definedBrands = state.definedBrands;
            let modelsForTheBrand = state.modelsForTheBrand;
            let tabansForSelection = state.tabansForSelection;
            let oransForSelection = state.oransForSelection;
            let jantsForSelection = state.jantsForSelection;
            let yukEndeksForSelection = state.yukEndeksForSelection;
            let hizEndeksForSelection = state.hizEndeksForSelection;
            let yanaksForSelection = state.yanaksForSelection;
            let mevsimsForSelection = state.mevsimsForSelection;
            let otherInfo =state.otherInfo;


            definedBrands = uniqueMarkaValues ;
            modelsForTheBrand = uniqueModelValues;
            tabansForSelection = uniqueTabanValues;
            oransForSelection = uniqueOranValues  ;
            jantsForSelection = uniqueJantValues ;
            yukEndeksForSelection = uniqueYukValues ;
            hizEndeksForSelection = uniqueHizValues ;
            yanaksForSelection = uniqueYanakValues ;
            mevsimsForSelection = uniqueMevsimValues;
            otherInfo = uniqueDigerValues;

        
            // if (_selOpt != "marka" ) {
            //   definedBrands = uniqueMarkaValues ;
            // }
            // if (_selOpt != "model" ) {
            //   modelsForTheBrand = uniqueModelValues;
            // }
            // if (_selOpt != "taban" ) {
            //   tabansForSelection = uniqueTabanValues ;
            // }
            // if (_selOpt != "oran" ) {
            //   oransForSelection = uniqueOranValues  ;
            // }
            // if (_selOpt != "jant"){
            //   jantsForSelection = uniqueJantValues ;
            // }
            // if (_selOpt != "yuk"){
            //   yukEndeksForSelection = uniqueYukValues ;
            // }
            // if (_selOpt != "hiz"){
            //   hizEndeksForSelection = uniqueHizValues ;
            // }
            // if (_selOpt != "yanak"){
            //   yanaksForSelection = uniqueYanakValues ;
            // }
            // if (_selOpt != "mevsim"){
            //   mevsimsForSelection = uniqueMevsimValues;
            // }
            // if (_selOpt != ""){
            //   otherInfo = uniqueDigerValues;
            // }
          

            return { definedBrands,modelsForTheBrand,tabansForSelection,oransForSelection,
                      jantsForSelection,yukEndeksForSelection,hizEndeksForSelection,yanaksForSelection,
                        mevsimsForSelection,otherInfo};

        });
        
      })
      .catch(console.error);  
      
  }



  modelSelected = (event) => {
      let _model =  event.target.value ;
      let queryFilterOptions = {
        marka : this.state.tireSelected.marka,
        model : _model
      }
      db.collection("inventoryCollection").find(queryFilterOptions).toArray().then(dbResults => {
  
        let uniqueValues = [...new Set(dbResults.map( value => value.taban))];
        console.log("modelSelected global unique Results: ", uniqueValues );
        
        if (uniqueValues.length > 1 ) {
            uniqueValues.unshift("Taban Seçin")
        }
        this.setState( {tabansForSelection : uniqueValues, 
                        tireSelected:{ marka: this.state.tireSelected.marka , model : _model}  });
      })
      .catch(console.error); 
  }

  

 



  resetForm = () => {
    document.getElementById("alis-birim-maliyet-kdvsiz").value = "";
    document.getElementById("alis-toplam-maliyet-kdvsiz").value = "";
    db.collection("inventoryCollection").find().toArray().then(dbResults => {
        let uniqueMarkaValues = [...new Set(dbResults.map( value => value.marka))];
        let uniqueModelValues = [...new Set(dbResults.map( value => value.model))];
        let uniqueTabanValues = [...new Set(dbResults.map( value => value.taban))];
        let uniqueOranValues = [...new Set(dbResults.map( value => value.oran))];
        let uniqueJantValues = [...new Set(dbResults.map( value => value.jant))];
        let uniqueYukValues = [...new Set(dbResults.map( value => value.yukEndeksi))];
        let uniqueHizValues = [...new Set(dbResults.map( value => value.hizEndeksi))];  
        let uniqueYanakValues = [...new Set(dbResults.map( value => value.yanakYapisi))];  
        let uniqueMevsimValues = [...new Set(dbResults.map( value => value.mevsim))];  
        let uniqueDigerValues = [...new Set(dbResults.map( value => value.diger))];  

        this.setState( {
          definedBrands : uniqueMarkaValues,
          modelsForTheBrand : uniqueModelValues , 
          tabansForSelection : uniqueTabanValues,
          oransForSelection : uniqueOranValues,
          jantsForSelection : uniqueJantValues,
          yukEndeksForSelection : uniqueYukValues,
          hizEndeksForSelection : uniqueHizValues,
          yanaksForSelection : uniqueYanakValues,
          mevsimsForSelection : uniqueMevsimValues,
          otherInfo : uniqueDigerValues,
          tireSelected : {},
          queryResulted1 : false

          ,selectedBrand : ""
          ,selectedModel : ""
          ,selectedTaban : ""
          ,selectedOran : ""
          ,selectedJant : ""
          ,selectedYuk : ""
          ,selectedHiz : ""
          ,selectedYanak : ""
          ,selectedMevsim : ""
          ,selectedOther : ""
          ,selectedDate : ""
          ,birimMaliyet : "" 
          ,alisAdet : ""
          ,toplamMaliyet :""
          ,wrongInputs : [] 
          ,saveButtonPressed : false
          });
    });  
  }

  displayOptions = (input) => {
    console.log("DISPLAY OPTIONS INPUT : ",input);
    //let input = event.target.id.substring(5);
    let varArray;
    let varOptionText;
    
    switch (input) {
      case "marka":
          varArray = this.state.definedBrands;
          varOptionText = "Lastik Markasi Seçin"
          
        break;
      case "model":
          console.log("model: ", this.state.modelsForTheBrand);
          varArray = this.state.modelsForTheBrand;
          varOptionText = "Lastik Deseni Seçin"
        break;
      case "taban":
          console.log("taban: ", this.state.tabansForSelection);
          varArray = this.state.tabansForSelection;
          varOptionText = "Taban Seçin"
        break;
      case "oran":
          console.log("oran: ", this.state.oransForSelection);
          varArray = this.state.oransForSelection;
          varOptionText = "Oran Seçin"
        break;
      case "jant":
          console.log("jant: ",this.state.jantsForSelection);
          varArray = this.state.jantsForSelection;
          varOptionText = "Ebati Seçin"
        break;
      case "yuk":
          console.log("yuk");
          varArray = this.state.yukEndeksForSelection;
          varOptionText = "Yuk Endeksi Seçin"
        break;
      case "hiz":
      console.log("hiz: ", this.state.hizEndeksForSelection);
          varArray = this.state.hizEndeksForSelection;  
          varOptionText = "Hiz Endeksi Seçin"
        break;
      case "yanak":
          varArray = this.state.yanaksForSelection;
          varOptionText = "Yanak Seçin"
        break;
      case "mevsim":
          varArray = this.state.mevsimsForSelection;
          varOptionText = "Mevsim Seçin"
        break;
      case "diger":
          varArray = this.state.otherInfo;
          varOptionText = "Ek Özellik Seçin"
        break;
      
    }
    //debugger;
    console.log ("-----------> TireSelected before :", this.state.tireSelected );
    if (varArray.length != 0 && String(varArray[0]).includes("Seçin") === false ){
       //if ( varArray[0].includes("Seçin") === false ){
        varArray.unshift(varOptionText);
      //}
    }


    
    if ( this.state.tireSelected === {} || varArray == undefined || varArray.length == 0 ) {
      console.log("+++ife giriyor");
      return  <option>{varOptionText}</option>   
    }
    else{
      console.log("Currently in :",input);
      console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS: ",this.state.tireSelected[input]);
      console.log("tire: ", this.state.tireSelected);

      //document.getElementById("alis-".concat(input)).placeholder =this.state.tireSelected[input];
      return varArray.map( (item,index)=>{
          //if ( item == this.state.tireSelected[input] ){
          //  return <option key={input.concat("Options").concat(index)} selected>{item}</option>
         // }
        //  else {
            return <option key={input.concat("Options").concat(index)} >{item}</option>
      //}
      });
    }
  }




  toggleModal = (modalStateName) => {  
    this.setState({
      [modalStateName]: !this.state[modalStateName]
    });
  
  
  };

  applyFilter = (filterObj) => {
      debugger;
      
      if ( filterObj.marka ) {
          if(filterObj.marka.includes("Kaldır")){
              delete filterObj.marka;
          }
          else{
              delete filterObj.tarih;
          }
      }
      else{
        if ( filterObj.tarih.includes("Kaldır")){
            delete filterObj.tarih;
        }else{
            delete filterObj.marka;
        }
      }
      this.refreshPurchaseTable(filterObj);

      this.setState({
        filterApplied : filterObj
      });
      
      
  }


  
  render() {
    
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <Col className="order-xl-1" xl="12">
            {/* <div className="col"> */}
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row>
                    <Col xs="8">
                      <h3 className="mb-0">Lastik Alim Gir</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      
                      <Button 
                          color="danger" 
                          type="button"
                          size="sm"
                          onClick={this.resetForm}
                          >
                          <span className="btn-inner--icon">
                                    {/* <i className="ni ni-folder-17" /> */}
                                    <i className="fas fa-eraser" />
                                  </span>
                                  <span className="btn-inner--text">Sıfırla</span>
                      </Button>
                    </Col>
                    
                  </Row>
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
                            <label htmlFor="alis-marka"
                                className="form-control-label"
                              >
                                Marka
                              </label>
                            
                              
                              <Input type="select" 
                                // className="form-control-alternative"
                                className = { (this.inputSetCorrectlyFor("marka")  ?  "form-control-alternative" : "is-invalid" )}
                                id="alis-marka"
                                value={this.state.selectedBrand}
                                onChange={this.anOptionSelected}
                                >
                                  {this.displayOptions("marka")}
                              </Input>

                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label htmlFor="alis-model"
                                className="form-control-label"
                              >
                                Desen
                              </label>
                            
                              
                              <Input type="select" 
                              className={ (this.inputSetCorrectlyFor("model") ) ? "form-control-alternative" : "is-invalid" }
                              id="alis-model"
                              value = {this.state.selectedModel}                                      
                              onChange={this.anOptionSelected}
                              >

                                {this.displayOptions("model")}

                            </Input>

                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="3">
                          <FormGroup>
                          <label htmlFor="alis-taban"
                                className="form-control-label"
                              >
                                Taban
                              </label>
                            
                              
                              <Input type="select" 
                              className={ (this.inputSetCorrectlyFor("taban") ) ? "form-control-alternative" : "is-invalid" }
                              id="alis-taban"
                              value ={this.state.selectedTaban}
                              onChange={this.anOptionSelected}
                              >
                                {this.displayOptions("taban")}

                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                          <label htmlFor="alis-oran"
                                className="form-control-label"
                              >
                                Oran
                              </label>
                            
                              
                              <Input type="select" 
                              className={ (this.inputSetCorrectlyFor("oran") ) ? "form-control-alternative" : "is-invalid" }
                              id="alis-oran"
                              value={this.state.selectedOran}
                              onChange={this.anOptionSelected}
                              >
                                {this.displayOptions("oran")}
                            </Input>
                          </FormGroup>
                        </Col>

                        <Col lg="3">
                          <FormGroup>
                          <label htmlFor="alis-jant"
                                className="form-control-label"
                              >
                                Jant
                              </label>
                            
                              
                              <Input type="select" 
                              className={ (this.inputSetCorrectlyFor("jant") ) ? "form-control-alternative" : "is-invalid" }
                              id="alis-jant"
                              value = {this.state.selectedJant}
                              onChange= {this.anOptionSelected}
                              >
                                {this.displayOptions("jant")}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                          <label htmlFor="alis-yuk"
                                className="form-control-label"
                              >
                                Yuk Endeksi
                              </label>
                            
                              
                              <Input type="select" 
                              className={ (this.inputSetCorrectlyFor("yuk") ) ? "form-control-alternative" : "is-invalid" }
                              id="alis-yuk"
                              value={this.state.selectedYuk}
                              onChange = {this.anOptionSelected}
                              >
                                {this.displayOptions("yuk")}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                          <label htmlFor="alis-hiz"
                                className="form-control-label"
                              >
                                Hiz Endeksi
                              </label>
                            
                              
                              <Input type="select" 
                              className={ (this.inputSetCorrectlyFor("hiz") ) ? "form-control-alternative" : "is-invalid" }
                              id="alis-hiz"
                              value={this.state.selectedHiz}
                              onChange={this.anOptionSelected}
                              >
                                {this.displayOptions("hiz")}
                            </Input>
                          </FormGroup>
                        </Col>

                      </Row>

                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label htmlFor="alis-yanak"
                              className="form-control-label"
                              
                            >
                              Yanak Yapisi
                            </label>

                            <Input
                              className={ (this.inputSetCorrectlyFor("yanak") ) ? "form-control-alternative" : "is-invalid" }
                              id="alis-yanak"
                              type="select"
                              value={this.state.selectedYanak}
                              onChange={this.anOptionSelected}
                            >
                            {this.displayOptions("yanak")}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label htmlFor="alis-mevsim"
                              className="form-control-label"
                              
                            >
                              Mevsim
                            </label>

                            <Input
                              type="select"
                              // className="form-control-alternative"
                              className={ (this.inputSetCorrectlyFor("mevsim") ) ? "form-control-alternative" : "is-invalid" }
                              id="alis-mevsim"
                              value = {this.state.selectedMevsim}
                              onChange={this.anOptionSelected}
                            >
                             {this.displayOptions("mevsim")} 
                           {/* <option>ilkbahar</option>
                           <option>Yaz</option>
                           <option>Sonbahar</option>
                           <option>Kiss</option> */}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                        <FormGroup > 
                              <label htmlFor="alis-diger"
                                className="form-control-label"
                              >
                                Diger
                              </label>
                            
                              <Input type="select"
                              //placeholder="Ek ozellikler..." 
                              className={ (this.inputSetCorrectlyFor("diger") ) ? "form-control-alternative" : "is-invalid" }
                              id="alis-diger"
                              value={this.state.selectedOther}
                              onChange={this.anOptionSelected}
                              >
                                {this.displayOptions("diger")}
                              </Input>

                              {/* <Input type="text"
                              placeholder="Ek ozellikler..." 
                              className="form-control-alternative"
                              id="alis-diger"
                              /> */}
                              
                            
          
                            </FormGroup> 
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="alis-birim-maliyet"
                            >
                              Birim Maliyeti (KDV Dahil)
                            </label>
                            <Input
                              className={ (this.inputSetCorrectlyFor("birim") ) ? "form-control-alternative" : "is-invalid" }
                              //defaultValue="Lucky"
                              id="alis-birim-maliyet"
                              placeholder="₺ Cinsinden"
                              type="number"
                              value= {this.state.birimMaliyet}
                              onChange={this.inputBirimChanged}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="alis-adet"
                            >
                              Adet
                            </label>
                            <Input
                              className={ (this.inputSetCorrectlyFor("adet") ) ? "form-control-alternative" : "is-invalid" }
                        
                              id="alis-adet"
                              placeholder="0"
                              type="number"
                              min="1"
                              value={this.state.alisAdet}
                              onChange={this.adetChanged}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="alis-toplam-maliyet"
                            >
                              Toplam Maliyet (KDV Dahil)
                            </label>
                            <Input
                              className= { (this.inputSetCorrectlyFor("toplam") ) ? "form-control-alternative" : "is-invalid" }
                              id="alis-toplam-maliyet"
                              placeholder="₺ Cinsinden"
                              type="number"
                              value ={this.state.toplamMaliyet}
                              onChange={this.inputToplamChanged}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="alis-tarih"
                            >
                              Tarih
                            </label>
                            {/* <Input
                              className="form-control-alternative"
                              defaultValue ="01/01/0001"
                              id="input-country"
                              placeholder="Country"
                              type= "date"
                            /> */}
                            <Datepicker 
                              id="alis-tarih"
                              className= { (this.inputSetCorrectlyFor("date") ) ?   "is-invalid" : "form-control-alternative" }
                              placeholder = "Alım Tarihini Seçin"
                              // defaultValue={new Date()}                          
                              value={this.state.selectedDate}
                              onChange={this.inputDateChanged}
                            ></Datepicker>
                          
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="justify-content-md-center">
                        <Col lg="4" className="text-right">
                          
                                
                                <Button block className="btn-icon btn-3" color="primary" type="button" 
                                    size="lg"
                                    onClick={this.savePurchase}    
                                >
                                  <span className="btn-inner--icon">
                                    {/* <i className="ni ni-folder-17" /> */}
                                    <i className="fas fa-save" />
                                  </span>
                                  <span className="btn-inner--text">Alım Gir</span>
                                </Button>
                          {/* </FormGroup>  */}
                       
                        </Col>
                      </Row>
                      
                    </div>
                    
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Fatura Hesaplama Bilgileri
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="alis-birim-maliyet-kdvsiz"
                              
                            >
                              Birim Maliyet (KDV Haric)
                            </label>
                            <Input disabled
                              className="form-control-alternative"
                              id="alis-birim-maliyet-kdvsiz"
                              placeholder="- ₺"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="alis-toplam-maliyet-kdvsiz"
                              
                            >
                              Toplam Maliyet (KDV Haric)
                            </label>
                            <Input disabled
                              className="form-control-alternative"
                              id="alis-toplam-maliyet-kdvsiz"
                              placeholder="- ₺"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    {/* Description */}
                    
                    
                  </Form>
                </CardBody>
              </Card>
            {/* </div> */}
            </Col>
          </Row>
          <hr className="my-4" />
          <Row>

            <Col className="order-xl-1" xl="12">
              <AlisDataTable  mainTitle="Mevcut Lastik Alımları" 
                          columnTitles={["Marka","Desen","Ebat","Tarih","Adet","Birim Fiyat","Diğer"]}
                          data={this.state.purchases}
                          deleteModalStateName= "modalDeletePurchase"
                          editModalStateName="modalEditPurchase"
                          toggleFunc={this.toggleModal}
                          confirmFunc={this.deletePurchase}
                          editFunc={this.editPurchase}
                          isConfirmModalVisible= {this.state.modalDeletePurchase}
                          isEditModalVisible={this.state.modalEditPurchase}
                          markaFilterOptions={this.state.filterArrayMarka}
                          tarihFilterOptions={this.state.filterArrayTarih}
                          filterFunc={this.applyFilter}
                          filter={this.state.filterApplied}
              />
            </Col>
          </Row>
          
        </Container>
      </>
    );
  }
}

export default Alis;



// displayModelOptions = () => {
//   console.log("displayModelOptions: ",this.state.modelsForTheBrand);
  
//   if ( this.state.modelsForTheBrand == undefined || this.state.modelsForTheBrand.length == 0 ) {
//     return  <option>Lastik Modeli Secimi</option>   
//   }
//   else{
//     return this.state.modelsForTheBrand.map( (item,index)=>{
//       return <option key={"modelOptions".concat(index)} >{item}</option>
//     });
//   }
// }