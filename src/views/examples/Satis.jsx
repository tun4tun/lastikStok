/*!


! maxAdet guncellenmiyor stok eksiye dusuyr


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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Col,

} from "reactstrap";
// core components
import Header from "components/Headers/Header.jsx";
import Datepicker from "../../Datepicker.jsx";
import SatisDataTable from "./SatisDataTable.jsx";

import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";
//import { noop } from "@babel/types";
//import { thisTypeAnnotation } from "@babel/types";
//import { eventNames } from "cluster";
import 'moment';
import { couldStartTrivia, getDefaultLibFileName } from "typescript";
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

class Satis extends React.Component {
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
        ,sales : []
        
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
        ,birimFiyat : "" 
        ,satisAdet : ""
        ,toplamFiyat :""
        ,saveButtonPressed : false

        //Modals:
        ,modalDeleteSale : false
        ,modalEditSale : false

        //Filters
        ,filterArrayMarka : []
        ,filterArrayTarih : []
        ,filterApplied : {}

        ,ortMaliyet: ""
        ,karOrani : ""
        ,stokAdeti : 0
        ,ortFiyat : ""
        ,ortKarOrani : ""


    }
    
    //let definedBrands = [];
    // const editableFields = [{label: "Birim Maliyet(KDV Dahil)", type="number",mapsTo: "birimFiyat" },
    //                         {label: "Adet", type : "number", mapsTo: "satisAdet"},
    //                         {label: "Tarih", type : "date", mapsTo: "tarih" } ];
  }
  

  componentWillMount(){
      db.collection("purchaseCollection").find().toArray().then(dbResults => {
        
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

        db.collection("salesCollection").find().toArray().then(dbResults => {
        
          console.log("will DB Results:",dbResults);
          
          //prepare Options
          let distinctFilterMarkaValues = [...new Set(dbResults.map(value => value.marka))].sort();
          let distinctFilterTarihValues = [...new Set(dbResults.map(value => value.tarih))].sort();
  
         
          this.setState({ filterArrayMarka : distinctFilterMarkaValues
                         ,filterArrayTarih : distinctFilterTarihValues       
          });
        })
        .catch(console.error);

        

        this.refreshSalesTable(this.state.filterApplied);

      
            
  }
  





  adetChanged = (event) => {
    

    let birimFiyat = this.state.birimFiyat;
    let toplamFiyat = birimFiyat * event.target.value;
    let birimKdvsiz = birimFiyat / 1.18 ;
    let toplamKdvsiz = toplamFiyat / 1.18 ;
    let _satisAdet;
    
    

    if ( 0 <= event.target.value && event.target.value <= this.state.stokAdeti){
        _satisAdet = event.target.value ;
    }else if ( event.target.value > this.state.stokAdeti ){
        _satisAdet = this.state.stokAdeti;
    }else{
        _satisAdet = 0 ;
    }
    
    if(isNaN(event.target.value)) {
      _satisAdet = 0;
    }
    
    document.getElementById("satis-birim-fiyat-kdvsiz").value = ((Number.isNaN(birimKdvsiz)) ? "" : formatTRY.format(birimKdvsiz) ) ;
    document.getElementById("satis-toplam-fiyat-kdvsiz").value = ((Number.isNaN(toplamKdvsiz)) ? "" : formatTRY.format(toplamKdvsiz) ) ;
    this.setState({satisAdet: _satisAdet,toplamFiyat: toplamFiyat});

  }

  inputBirimChanged = (event) => {
      let toplamFiyat;
      let birimFiyat = event.target.value;
      let karOrani, ortMaliyet;
      
      this.setState( (state) => {
        
          toplamFiyat = state.toplamFiyat;
          ortMaliyet = parseInt(state.ortMaliyet);
          if (birimFiyat === "") {
              toplamFiyat = "";
              karOrani = String("% -")
          }else{
              if ( state.satisAdet > 0 ) {
                  toplamFiyat = birimFiyat * state.satisAdet ;
              }else{
                  toplamFiyat = "";
              }
              if (ortMaliyet !== ""){
                karOrani = ((birimFiyat - ortMaliyet) / ortMaliyet * 100).toFixed(2) ;
                karOrani = String("% ").concat(karOrani);
              
              }
          }
        

          let birimKdvsiz = birimFiyat / 1.18 ;
          let toplamKdvsiz = toplamFiyat / 1.18 ;


          document.getElementById("satis-birim-fiyat-kdvsiz").value = ((Number.isNaN(birimKdvsiz)) ? "" : formatTRY.format(birimKdvsiz) ) ;
          document.getElementById("satis-toplam-fiyat-kdvsiz").value = ((Number.isNaN(toplamKdvsiz)) ? "" : formatTRY.format(toplamKdvsiz) ) ;
          
          return { birimFiyat,toplamFiyat,karOrani };

     }); 
  }

  inputToplamChanged = (event) => {
    let birimFiyat;
    let toplamFiyat = event.target.value;
    
    this.setState((state) => {
        birimFiyat = state.birimFiyat;
        if (toplamFiyat === ""){
            birimFiyat = "";
        }else{
            if (state.satisAdet > 0 ) {
                birimFiyat = toplamFiyat / state.satisAdet ;
            }else{
              birimFiyat = "";
            }
        }

        
        let birimKdvsiz = formatTRY.format(birimFiyat / 1.18 );
        let toplamKdvsiz = formatTRY.format(toplamFiyat / 1.18 );

        document.getElementById("satis-birim-fiyat-kdvsiz").value = (Number.isNaN(birimKdvsiz) ? "" : birimKdvsiz );
        document.getElementById("satis-toplam-fiyat-kdvsiz").value = (Number.isNaN(toplamKdvsiz) ? "" : toplamKdvsiz );
        return { birimFiyat,toplamFiyat };
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
            decision = (this.state.birimFiyat === "" || this.state.birimFiyat == 0 ) ? false : true ;
            break;
          case "adet":
            decision = (this.state.satisAdet === "" || this.state.satisAdet == 0 ) ? false : true ;
            break;
          case "toplam":
            decision = (this.state.toplamFiyat === "" || this.state.toplamFiyat == 0 ) ? false : true ;
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
      if (this.state.birimFiyat === ""  || this.state.birimFiyat == 0){
          tempArray.push("Birim-fiyat");
          setCorrect = false;
      }
      if (this.state.satisAdet === "" || this.state.satisAdet == 0){
          tempArray.push("Adet");
          setCorrect = false;
      }
      if (this.state.toplamFiyat === "" || this.state.toplamFiyat == 0 ){
          tempArray.push("Toplam-fiyat");
          setCorrect = false;
      }


      this.setState({saveButtonPressed : true,wrongInputs: tempArray});
      

      return setCorrect;
  }

  saveSale = () => {

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
          let _birimFiyat = Number(this.state.birimFiyat);
          let _satisAdet = Number(this.state.satisAdet);
          let _tarih ;
          if (this.state.selectedDate === "" ){
              let today = new Date();
              let dd = String(today.getDate()).padStart(2, '0');
              let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              let yyyy = today.getFullYear();
              _tarih = dd + '/' + mm + '/' + yyyy;
          }else{
              _tarih = this.state.selectedDate;
          }
          db.collection("salesCollection")
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
              satisAdet : _satisAdet ,
              birimFiyat : _birimFiyat     
            })
            .then(remoteResult => {
                console.log("Insert done with id:",remoteResult.insertedId);
                this.setState({saveButtonPressed: false});
                this.refreshSalesTable(this.state.filterApplied); 
          }).catch(
              //console.error
                // this.displayError(console.error)
                //console.log(err.message);
                alert(console.error)
                // console.log(error.message);
                // this.setState({modalError: true,errorMsg : error.message});
                //     );
            );
            let tireSold = {
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
            this.updateStockWithSale(tireSold,_birimFiyat,_satisAdet);
          
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


  
  updateStockWithSale = (tire,fiyat,count) => {
      db.collection("stockCollection").find(tire).toArray().then(dbResults => {
         // if (dbResults.length > 0){
              console.log("Stok:Tire found: ",dbResults);
              let tireReturned = dbResults[0];
              let newOrtFiyat = ((tireReturned.ortFiyat * tireReturned.satisAdet) + (fiyat * count)) / (tireReturned.satisAdet + count); 
              tireReturned.ortFiyat = newOrtFiyat ;
              tireReturned.satisAdet = tireReturned.satisAdet + count;
              tireReturned.stokAdet = tireReturned.stokAdet - count;

              db.collection("stockCollection")
              .findOneAndReplace(tire,tireReturned).then(DocumentT => {

                console.log("Updated document: ", DocumentT);
                alert("stock table: Updated!!");
                this.setState({stokAdeti : tireReturned.stokAdet});
              }).catch(console.error);
          // }
          // else{
          //     console.log("Stok Lastik bulunamadi:");
              
          //     tire.stokAdet = count ;
          //     tire.ortFiyat = fiyat;
          //     db.collection("stockCollection")
          //     .insertOne(tire)
          //     .then(remoteResult => {
          //         console.log("Insert done with id:",remoteResult.insertedId);
                 
                 
          //   }).catch(
          //     console.error
          //   );
          //}
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

  editSale = (editedTrx,eskiAdet,eskiTotFiyat) => {

      delete editedTrx.stokAdeti;
      db.collection("salesCollection")
      .findOneAndReplace({ _id: editedTrx._id },editedTrx).then(DocumentX => {
        console.log("Updated document after editingSale: ", DocumentX);

        console.log(editedTrx);

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
        console.log(stockTire2beUpdated);
        
        
        db.collection("stockCollection").findOne(stockTire2beUpdated).then( DocumentT =>{
          
          //Lastigi buldun simdi stok tablosunu guncelle
          if (DocumentT.satisAdet - eskiAdet + editedTrx.satisAdet !== 0 ){ 
              DocumentT.ortFiyat = ((DocumentT.ortFiyat * DocumentT.satisAdet) - eskiTotFiyat + (editedTrx.birimFiyat * editedTrx.satisAdet) ) / (DocumentT.satisAdet - eskiAdet + editedTrx.satisAdet); 
          }else{
              DocumentT.ortFiyat = 0;
          }
          DocumentT.satisAdet = DocumentT.satisAdet - eskiAdet + editedTrx.satisAdet ;
          DocumentT.stokAdet = DocumentT.stokAdet + eskiAdet - editedTrx.satisAdet ;
          
          db.collection("stockCollection")
          .findOneAndReplace(stockTire2beUpdated,DocumentT).then(DocumentU => {

            console.log("Updated document afterPurchase change: ", DocumentU);
            alert("stock table: Updated after Purchase Change!!");
          }).catch(console.error);

        }
        ).catch(console.error);
        this.setState({modalEditSale: false});
        
        this.refreshSalesTable(this.state.filterApplied);
      }).catch(console.error);


  }

  deleteSale = (id) => {
      // let {_id} = tire;
      
        
      console.log("Tirewith id '",id.toString(),"'will be deleted from database.");
      
      

      db.collection("salesCollection")
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
        let deletedSaleCost = DocumentT.birimFiyat;
        let deletedSaleCount = DocumentT.satisAdet;

        db.collection("stockCollection").findOne(stockTire2beUpdated).then( DocumentT =>{
          console.log("deleteSale Method/ DocumentT2beUpdated: ",DocumentT)
          
          if ( (DocumentT.satisAdet - deletedSaleCount) !== 0){
              DocumentT.ortFiyat = ((DocumentT.ortFiyat * DocumentT.satisAdet) - (deletedSaleCost * deletedSaleCount) ) / (DocumentT.satisAdet - deletedSaleCount); 
          }else {
              DocumentT.ortFiyat = 0;
          }
          DocumentT.satisAdet = DocumentT.satisAdet - deletedSaleCount ;
          DocumentT.stokAdet = DocumentT.stokAdet + deletedSaleCount ;
          //Lastigi buldun simdi stok tablosunu guncelle
          
          
          db.collection("stockCollection")
          .findOneAndReplace(stockTire2beUpdated,DocumentT).then(DocumentU => {
            console.log("Updated document afterSale Deletion: ", DocumentU);
            alert("stock table: Updated after Sale Deletion!!");
          }).catch(console.error);

        }
        ).catch(console.error);

        this.setState({modalDeleteSale: false});
        
        this.refreshSalesTable(this.state.filterApplied);
      }).catch(console.error);

  }

  refreshSalesTable = (filter) => {
      db.collection("salesCollection").find(filter).toArray().then(results => {
        //console.log("TiresArray",this.state.tires);
        // let resArry = Object.assign({}, results);
     
        results = results.map((item,index)=>{
           
            let tireSold = {
              //"owner_id" : item.owner_id , //tire.owner_id = client.auth.user.id
              "marka" : item.marka ,
              "model" : item.model ,
              "taban" : item.taban ,
              "oran"  : item.oran ,
              "jant"  : item.jant ,
              "yukEndeksi" : item.yukEndeksi ,
              "hizEndeksi" : item.hizEndeksi ,
              "yanakYapisi": item.yanakYapisi ,
              "mevsim": item.mevsim ,
              "diger" : item.diger
            };
            console.log(tireSold);
            db.collection("stockCollection").find(tireSold).toArray().then(stokResults => {
             
                item.stokAdeti = stokResults[0].stokAdet;
                console.log(item);
            })
            .catch(
              console.error
            );
            
            return item;
        });
        
        console.log("EVET sonucl results:", results);
        
        this.setState( {sales : results})


      })
      .catch(console.error);
        
        
      console.log("salesArray",this.state.sales);

      db.collection("salesCollection").find().toArray().then(dbResults => {
        
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


      let _selOpt = String(event.target.id).substring(6);
      let _selVal = event.target.value;


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

      db.collection("stockCollection").find(queryFilterOptions).toArray().then(dbResults => {
       // debugger;
        console.log("DB Results:",dbResults);

        let resultCount = dbResults.length;
        //this.definedBrands = dbResults.map( value => value.marka);
        if ( resultCount == 1) {
            let tire = dbResults[0];
            let gnlKarOrani = (tire.satisAdet !== 0) ? ((tire.ortFiyat - tire.ortMaliyet) / tire.ortMaliyet * 100).toFixed(2) : String("-") ;
            gnlKarOrani = String("% ").concat(gnlKarOrani);
            tire.ortMaliyet = (Number.isInteger(tire.ortMaliyet) ? String(tire.ortMaliyet).concat(" ₺") : String(tire.ortMaliyet.toFixed(2)).concat(" ₺"));
            tire.ortFiyat = (Number.isInteger(tire.ortFiyat) ? String(tire.ortFiyat).concat(" ₺") : String(tire.ortFiyat.toFixed(2)).concat(" ₺"));

            //tire.ortMaliyet = "₺"
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
                       ,ortMaliyet : tire.ortMaliyet 
                       ,stokAdeti : tire.stokAdet
                       ,ortFiyat : tire.ortFiyat
                       ,ortKarOrani : gnlKarOrani


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
       
        delete queryFilterOptions["_id"];
        delete queryFilterOptions["owner_id"];

        this.setState( (state) => {
           
            // let selectedBrand = (uniqueMarkaValues.length === 1) ? uniqueMarkaValues[0] : state.selectedBrand ;
            // let selectedModel = (uniqueModelValues.length === 1) ? uniqueModelValues[0] : state.selectedModel ;
            // let selectedTaban = (uniqueTabanValues.lenth === 1) ? uniqueTabanValues[0] : state.selectedTaban ;
            // let selectedOran = (uniqueOranValues.length === 1) ? uniqueOranValues[0] : state.selectedOran ;
            // let selectedJant = (uniqueJantValues.length === 1) ? uniqueJantValues[0] : state.selectedJant ;
            // let selectedYuk = (uniqueYukValues.length === 1) ? uniqueYukValues[0] : state.selectedYuk ;
            // let selectedHiz = (uniqueHizValues.length === 1) ? uniqueHizValues[0] : state.selectedHiz ;
            // let selectedYanak = (uniqueYanakValues.length === 1) ? uniqueYanakValues[0] : state.selectedYanak ;
            // let selectedMevsim = (uniqueMevsimValues.length === 1) ? uniqueMevsimValues[0] : state.selectedMevsim ;
            // let selectedOther = (uniqueDigerValues.length === 1) ? uniqueDigerValues[0] : state.selectedOther ;

            let definedBrands = state.definedBrands;
            let modelsForTheBrand = state.modelsForTheBrand;
            let tabansForSelection = state.tabansForSelection;
            let oransForSelection = state.oransForSelection;
            let jantsForSelection = state.jantsForSelection;
            let yukEndeksForSelection = state.yukEndeksForSelection;
            let hizEndeksForSelection = state.hizEndeksForSelection;
            let yanaksForSelection = state.yanaksForSelection;
            let mevsimsForSelection = state.mevsimsForSelection;
            let otherInfo = state.otherInfo;


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
            //   tabansFor = uniqueTabanValues;
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
          

            return { //selectedBrand,selectedModel,selectedTaban,selectedOran,selectedJant,
                      //selectedYuk,selectedHiz,selectedYanak,selectedMevsim,selectedOther,
                        definedBrands,modelsForTheBrand,tabansForSelection,oransForSelection,
                          jantsForSelection,yukEndeksForSelection,hizEndeksForSelection,yanaksForSelection,
                            mevsimsForSelection,otherInfo};

        });
        
      })
      .catch(console.error);  
      
  }



  resetForm = () => {
    document.getElementById("satis-birim-fiyat-kdvsiz").value = "";
    document.getElementById("satis-toplam-fiyat-kdvsiz").value = "";
    db.collection("purchaseCollection").find().toArray().then(dbResults => {
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
          ,birimFiyat : "" 
          ,satisAdet : ""
          ,toplamFiyat :""
          ,wrongInputs : [] 
          ,saveButtonPressed : false
          ,ortMaliyet : ""
          ,ortFiyat : ""
          ,karOrani : ""
          ,stokAdeti : 0 
          ,ortKarOrani : ""
          });
    });  
  }

  displayOptions = (input) => {
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
   
    if (varArray.length != 0 && String(varArray[0]).includes("Seçin") === false ){
        varArray.unshift(varOptionText);
    }


    
    if ( this.state.tireSelected === {} || varArray == undefined || varArray.length == 0 ) {
      return  <option>{varOptionText}</option>   
    }
    else{
      return varArray.map( (item,index)=>{
            return <option key={input.concat("Options").concat(index)} >{item}</option>
      });
    }
  }




  toggleModal = (modalStateName) => {  
    this.setState({
      [modalStateName]: !this.state[modalStateName]
    });
  
  
  };

  applyFilter = (filterObj) => {
     
      
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
      this.refreshSalesTable(filterObj);

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
                      <h3 className="mb-0">Lastik Satış Gir</h3>
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
                            <label htmlFor="satis-marka"
                                className="form-control-label"
                              >
                                Marka
                              </label>
                            
                              
                              <Input type="select" 
                                // className="form-control-alternative"
                                className = { (this.inputSetCorrectlyFor("marka")  ?  "form-control-alternative" : "is-invalid" )}
                                id="satis-marka"
                                value={this.state.selectedBrand}
                                onChange={this.anOptionSelected}
                                >
                                  {this.displayOptions("marka")}
                              </Input>

                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label htmlFor="satis-model"
                                className="form-control-label"
                              >
                                Desen
                              </label>
                            
                              
                              <Input type="select" 
                              className={ (this.inputSetCorrectlyFor("model") ) ? "form-control-alternative" : "is-invalid" }
                              id="satis-model"
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
                          <label htmlFor="satis-taban"
                                className="form-control-label"
                              >
                                Taban
                              </label>
                            
                              
                              <Input type="select" 
                              className={ (this.inputSetCorrectlyFor("taban") ) ? "form-control-alternative" : "is-invalid" }
                              id="satis-taban"
                              value ={this.state.selectedTaban}
                              onChange={this.anOptionSelected}
                              >
                                {this.displayOptions("taban")}

                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                          <label htmlFor="satis-oran"
                                className="form-control-label"
                              >
                                Oran
                              </label>
                            
                              
                              <Input type="select" 
                              className={ (this.inputSetCorrectlyFor("oran") ) ? "form-control-alternative" : "is-invalid" }
                              id="satis-oran"
                              value={this.state.selectedOran}
                              onChange={this.anOptionSelected}
                              >
                                {this.displayOptions("oran")}
                            </Input>
                          </FormGroup>
                        </Col>

                        <Col lg="3">
                          <FormGroup>
                          <label htmlFor="satis-jant"
                                className="form-control-label"
                              >
                                Jant
                              </label>
                            
                              
                              <Input type="select" 
                              className={ (this.inputSetCorrectlyFor("jant") ) ? "form-control-alternative" : "is-invalid" }
                              id="satis-jant"
                              value = {this.state.selectedJant}
                              onChange= {this.anOptionSelected}
                              >
                                {this.displayOptions("jant")}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                          <label htmlFor="satis-yuk"
                                className="form-control-label"
                              >
                                Yuk Endeksi
                              </label>
                            
                              
                              <Input type="select" 
                              className={ (this.inputSetCorrectlyFor("yuk") ) ? "form-control-alternative" : "is-invalid" }
                              id="satis-yuk"
                              value={this.state.selectedYuk}
                              onChange = {this.anOptionSelected}
                              >
                                {this.displayOptions("yuk")}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                          <label htmlFor="satis-hiz"
                                className="form-control-label"
                              >
                                Hiz Endeksi
                              </label>
                            
                              
                              <Input type="select" 
                              className={ (this.inputSetCorrectlyFor("hiz") ) ? "form-control-alternative" : "is-invalid" }
                              id="satis-hiz"
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
                            <label htmlFor="satis-yanak"
                              className="form-control-label"
                              
                            >
                              Yanak Yapisi
                            </label>

                            <Input
                              className={ (this.inputSetCorrectlyFor("yanak") ) ? "form-control-alternative" : "is-invalid" }
                              id="satis-yanak"
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
                            <label htmlFor="satis-mevsim"
                              className="form-control-label"
                              
                            >
                              Mevsim
                            </label>

                            <Input
                              type="select"
                              // className="form-control-alternative"
                              className={ (this.inputSetCorrectlyFor("mevsim") ) ? "form-control-alternative" : "is-invalid" }
                              id="satis-mevsim"
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
                              <label htmlFor="satis-diger"
                                className="form-control-label"
                              >
                                Diger
                              </label>
                            
                              <Input type="select"
                              //placeholder="Ek ozellikler..." 
                              className={ (this.inputSetCorrectlyFor("diger") ) ? "form-control-alternative" : "is-invalid" }
                              id="satis-diger"
                              value={this.state.selectedOther}
                              onChange={this.anOptionSelected}
                              >
                                {this.displayOptions("diger")}
                              </Input>

                              {/* <Input type="text"
                              placeholder="Ek ozellikler..." 
                              className="form-control-alternative"
                              id="satis-diger"
                              /> */}
                              
                            
          
                            </FormGroup> 
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="satis-birim-fiyat"
                            >
                              Birim Fiyatı (KDV Dahil)
                            </label>   
                              <Input
                                className={ (this.inputSetCorrectlyFor("birim") ) ? "form-control-alternative" : "is-invalid" }
                                //defaultValue="Lucky"
                                id="satis-birim-fiyat"
                                placeholder="₺ Cinsinden"
                                type="number"
                                value= {this.state.birimFiyat}
                                onChange={this.inputBirimChanged}
                              />
                          </FormGroup>
                        </Col>
                        <Col lg="2">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="satis-adet"
                            >
                              Adet
                            </label>
                            <Input
                              className={ (this.inputSetCorrectlyFor("adet") ) ? "form-control-alternative" : "is-invalid" }
                        
                              id="satis-adet"
                              placeholder="0"
                              type="number"
                              min="0"
                              max={this.state.stokAdeti}
                              value={this.state.satisAdet}
                              onChange={this.adetChanged}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="satis-toplam-fiyat"
                            >
                              Toplam Fiyatı (KDV Dahil)
                            </label>
                            <Input
                              className= { (this.inputSetCorrectlyFor("toplam") ) ? "form-control-alternative" : "is-invalid" }
                              id="satis-toplam-fiyat"
                              placeholder="₺ Cinsinden"
                              type="number"
                              value ={this.state.toplamFiyat}
                              onChange={this.inputToplamChanged}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="satis-tarih"
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
                              id="satis-tarih"
                              className= { (this.inputSetCorrectlyFor("date") ) ?   "is-invalid" : "form-control-alternative" }
                              placeholder = "Satış Tarihi Seçin"
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
                                    onClick={this.saveSale}    
                                >
                                  <span className="btn-inner--icon">
                                    {/* <i className="ni ni-folder-17" /> */}
                                    <i className="fas fa-save" />
                                  </span>
                                  <span className="btn-inner--text">Satışı Kaydet</span>
                                </Button>
                          {/* </FormGroup>  */}
                       
                        </Col>
                      </Row>
                      
                    </div>
                    
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Satış Destek Asistanı
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="satis-ort-maliyet"
                            >
                              Ortalama Maliyet
                            </label>
     
                              <Input disabled
                                className="form-control-alternative"
                                id="satis-ort-maliyet"
                                placeholder="₺ Cinsinden"
                                type="text"
                                value= {this.state.ortMaliyet}
                              />
                          </FormGroup>
                        </Col>
                        <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="satis-kar-orani"
                            >
                              Mevcut İşlem Kâr Oranı
                            </label>
                            <Input disabled
                              className="form-control-alternative"
                              id="satis-kar-orani"
                              placeholder="% -"
                              type="text"
                              value= {this.state.karOrani}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="satis-ort-fiyat"
                            >
                              Ortalama Fiyat
                            </label>
     
                              <Input disabled
                                className="form-control-alternative"
                                id="satis-ort-fiyat"
                                placeholder="₺ Cinsinden"
                                type="text"
                                value= {this.state.ortFiyat}
                              />
                          </FormGroup>
                        </Col>
                        <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="satis-ort-kar"
                            >
                              Ortalama Kâr Oranı
                            </label>
                            <Input disabled
                              className="form-control-alternative"
                              id="satis-ort-kar"
                              placeholder="% -"
                              type="text"
                              value= {this.state.ortKarOrani}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="satis-birim-fiyat-kdvsiz"
                              
                            >
                              Birim Fiyatı (KDV Hariç)
                            </label>
                            <Input disabled
                              className="form-control-alternative"
                              id="satis-birim-fiyat-kdvsiz"
                              placeholder="- ₺"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="satis-toplam-fiyat-kdvsiz"
                              
                            >
                              Toplam Fiyatı (KDV Hariç)
                            </label>
                            <Input disabled
                              className="form-control-alternative"
                              id="satis-toplam-fiyat-kdvsiz"
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
              <SatisDataTable  mainTitle="Mevcut Lastik Satışları" 
                          columnTitles={["Marka","Desen","Ebat","Tarih","Adet","Birim Fiyat","Diğer"]}
                          data={this.state.sales}
                          deleteModalStateName= "modalDeleteSale"
                          editModalStateName="modalEditSale"
                          toggleFunc={this.toggleModal}
                          confirmFunc={this.deleteSale}
                          editFunc={this.editSale}
                          isConfirmModalVisible= {this.state.modalDeleteSale}
                          isEditModalVisible={this.state.modalEditSale}
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

export default Satis;



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


{/* <Col lg="3">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="satis-birim-fiyat"
                            >
                              Birim Fiyatı (KDV Dahil)
                            </label>
                            <InputGroup className="form-control-alternative mb-4" >
                              <InputGroupAddon addonType="prepend" className="form-control-alternative">
                                <InputGroupText className="form-control-alternative text-sm" disabled>
                                  <i className="fas fa-lira-sign" />
                                </InputGroupText>
                              </InputGroupAddon>      
                              <Input
                                className={ (this.inputSetCorrectlyFor("birim") ) ? "form-control-alternative" : "is-invalid" }
                                //defaultValue="Lucky"
                                id="satis-birim-fiyat"
                                placeholder="₺ Cinsinden"
                                type="number"
                                value= {this.state.birimFiyat}
                                onChange={this.inputBirimChanged}
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col> */}