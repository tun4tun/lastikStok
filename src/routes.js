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
import Index from "views/Index.jsx";
import Profile from "views/examples/Profile.jsx";
import Satis from "views/examples/Satis.jsx";
// import Register from "views/examples/Register.jsx";
// import Login from "views/examples/Login.jsx";
import Tanim from "views/examples/Tanim.jsx";
// import Icons from "views/examples/Icons.jsx";
import Alis from "./views/examples/Alis";

var routes = [
  {
    path: "/index",
    name: "Stok Kontrol",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  {
    path: "/alis",
    name: "Alış",
    icon: "ni ni-delivery-fast text-blue",
    component: Alis,
    layout: "/admin"
  },
  {
    path: "/satis",
    name: "Satış",
    icon: "ni ni-money-coins text-orange",
    component: Satis,
    layout: "/admin"
  },
  {
    path: "/user-profile",
    name: "Sipariş",
    icon: "ni ni-cart text-yellow",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/tanim",
    name: "Lastikler",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tanim,
    layout: "/admin"
   }
  //,
  // {
  //   path: "/login",
  //   name: "Login",
  //   icon: "ni ni-key-25 text-info",
  //   component: Login,
  //   layout: "/auth"
  // },
  // {
  //   path: "/register",
  //   name: "Register",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: Register,
  //   layout: "/auth"
  // }
];

// const  MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://emreKommez:lastikPark48@bodcluster-whupa.mongodb.net/admin?retryWrites=true&w=majority";
// MongoClient.connect(uri,function(err,db){
//   console.log("Connected.");
//   db.close();
// });





export default routes;
