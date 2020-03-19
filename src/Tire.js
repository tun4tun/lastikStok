class Tire {
    // constructor({}){

    //   this.marka = "",
    //   this.taban = 0,
    //   this.oran = 0,
    //   this.jant = "",
    //   this.yukEndeksi= "",
    //   this.hizEndeksi = "",
    //   this.desen = "",
    //   this.yanakYapisi ="",
    //   this.mevsim ="",
    //   this.diger ="";
    // }
//     constructor(_marka,_taban,_oran,_jant,_yukEndeksi,_hizEndeksi,_desen,_yanakYapisi,_mevsim,_diger){
//         this.marka = _marka,
//         this.taban = _taban,
//         this.oran = _oran,
//         this.jant = _jant,
//         this.yukEndeksi= _yukEndeksi,
//         this.hizEndeksi = _hizEndeksi,
//         this.desen = _desen,
//         this.yanakYapisi = _yanakYapisi,
//         this.mevsim = _mevsim,
//         this.diger = _diger;
//       }

    constructor(tire){
       // debugger;
        let { _id,owner_id,marka,model,taban,oran,jant,yukEndeksi,hizEndeksi,desen,yanakYapisi,mevsim,diger } = tire; 
        this._id = _id ;
        this.owner_id = owner_id ;
        this.marka = marka;
        this.model = model;
        this.taban = taban;
        this.oran = oran;
        this.jant = jant;
        this.yukEndeksi= yukEndeksi;
        this.hizEndeksi = hizEndeksi;
        this.desen = desen;
        this.yanakYapisi = yanakYapisi;
        this.mevsim = mevsim;
        this.diger = diger;
    }
    mainInfo(){
        return this.marka.concat(" ")
                .concat(this.model).concat(" - ")
                    .concat(String(this.taban))
                        .concat(" / ").concat(String(this.oran))
                            .concat(" / ").concat(this.jant)
                            .concat(" / ").concat(String(this.yukEndeksi))
                                .concat(" / ").concat(this.hizEndeksi);
    }

    otherInfo(){
        return  "\nYanak: ".concat(this.yanakYapisi).concat(
                    "\n\t Mevsim: ".concat(this.mevsim).concat(
                    "\n\t Diğer: ".concat(this.diger)));
    }

    fullInfo(){
        return this.mainInfo() + " " + this.otherInfo() ;
    }

    idInfoToString(){
        return (this._id.toString());
    }
    
}   

export default Tire;

//     // get getProperty(prop){
//     //     return this[prop];
//     // }
    
//     mainInfo(){
//         return this.marka.concat(" - ")
//                 .concat(String(this.taban))
//                     .concat(" / ").concat(String(this.oran))
//                         .concat(" / ").concat(this.jant)
//                          .concat(" / ").concat(String(this.yukEndeksi))
//                              .concat(" / ").concat(this.hizEndeksi);
//     }



// }






// var Tire ={
//     marka : "",
//     taban : 0,
//     oran : 0,
//     jant : "",
//     yukEndeksi : "",
//     hizEndeksi : "",
//     desen : "",
//     yanakYapisi : "",
//     mevsim : "",
//     diger : "",
//     mainInfo : function(){
//         return this.marka.concat(" - ")
//                     .concat(String(this.taban))
//                         .concat(" / ").concat(String(this.oran))
//                             .concat(" / ").concat(this.jant)
//                              .concat(" / ").concat(String(this.yukEndeksi))
//                                  .concat(" / ").concat(this.hizEndeksi);
//     }
// }


