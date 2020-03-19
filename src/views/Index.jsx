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
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// import parseOptions from "variables/charts.jsx";
// import chartAylikCiroBazli from "variables/charts.jsx";
// import chartOptions from "variables/charts.jsx";
//import {chartExample1,chartExample2} from "variables/charts.jsx"

// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Media,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  UncontrolledTooltip,
  Container,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

// core components
import {
 chartOptions,
  parseOptions,
  chartExample1,
 chartExample2,
 chartAylikCiroBazli,
 chartAylikAdetBazli,
 monthsToDisplayInGraphs
} from "variables/charts.jsx";

import {
  Stitch,
  AnonymousCredential,
  RemoteMongoClient
} from "mongodb-stitch-browser-sdk";

import Header from "components/Headers/Header.jsx";
import { chartreuse } from "color-name";

// /***********************************************************************/
// /* DB STUFF */
const client = Stitch.initializeDefaultAppClient("lastikpark-ogewz");
//const client = Stitch.getAppClient("lastikpark-ogewz");
const mongodb = client.getServiceClient(
   RemoteMongoClient.factory,
   "mongodb-atlas"
);

const db = mongodb.db("lastikParkDB");

// client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
//   console.log(`Logged in as anonymous user with id: ${user.id}`);
// }).catch(console.error);
// /***********************************************************************/

const maxStock = 100;

class Index extends React.Component {
  state = {
    activeNav: 1,
    chartExample1Data: "data1",
    chartAylikCiroBazliOrnek:"data1",
    barChart : chartAylikAdetBazli ,
    lineChart: chartAylikCiroBazli,

    tires : []
    ,filterArrayMarka : []
    ,filterApplied : {}
  };
  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartAylikCiroBazliOrnek:
        this.state.chartAylikCiroBazliOrnek === "data1" ? "data2" : "data1"
    });
    let wow = () => {
      console.log(this.state);
    };
    wow.bind(this);
    setTimeout(() => wow(), 1000);
    // this.chartReference.update();
  };
  componentWillMount() {
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
    // chartAylikAdetBazli.data.datasets[0].data = [1,2,3,4,5,6,7,8,9,10,11,12,13];  
    this.findAylikBazliSatislar();
    this.getStockData(this.state.filterApplied);


    db.collection("stockCollection").find().toArray().then(dbResults => {

      console.log("chats DB Results:",dbResults);
      let distinctFilterMarkaValues = [...new Set(dbResults.map(value => value.marka))].sort();
      this.setState({  filterArrayMarka : distinctFilterMarkaValues });
      
    })
    .catch(console.error);


    
  }

  getStockData = (filter) => {
    db.collection("stockCollection").find(filter).toArray().then(dbResults => {

      console.log("chats DB Results:",dbResults);
      let distinctFilterMarkaValues = [...new Set(dbResults.map(value => value.marka))].sort();
      this.setState({tires: dbResults });
      
    })
    .catch(console.error);
  }

  findAylikBazliSatislar = () => {
    let aylikSatislarAdet = {} ;
    let aylikSatislarCiro = {} ;
    let satisAdetArray = [];
    let satisCiroArray = [];
    let monthsForGraphs = monthsToDisplayInGraphs();

    db.collection("salesCollection").find().toArray().then(dbResults => {

      console.log("chats DB Results:",dbResults);
      dbResults.forEach((satis) => {

          let m = String(satis.tarih).substr(8,2).concat(String(satis.tarih).substr(3,2));
          console.log("Aylar varki: ", m);
          if(aylikSatislarAdet[m]){
              aylikSatislarAdet[m] = aylikSatislarAdet[m] + satis.satisAdet ;
          }else{
            aylikSatislarAdet[m] =  satis.satisAdet ;
          }
          if(aylikSatislarCiro[m]){
            aylikSatislarCiro[m] = aylikSatislarCiro[m] + (satis.satisAdet * satis.birimFiyat) ;
          }else{
            aylikSatislarCiro[m] =  satis.satisAdet * satis.birimFiyat ;
          }


      })
      monthsForGraphs.forEach((item)=>{

          item = Number(item);
          let _satisAdeti = aylikSatislarAdet[item];
          satisAdetArray.push(_satisAdeti);

          satisCiroArray.push(aylikSatislarCiro[item]);
      })
      
      console.log("yYy: ", satisAdetArray);
      chartAylikAdetBazli.data.datasets[0].data = satisAdetArray ;
      chartAylikCiroBazli.data.datasets[0].data = satisCiroArray ;
      console.log(chartAylikCiroBazli);
      this.setState({barChart: chartAylikAdetBazli});
      
    })
    .catch(console.error);
    
    return satisAdetArray;
  }

  applyFilter = (event) => {
    debugger;
    let filterObj = {marka: event.currentTarget.textContent}

    if(event.currentTarget.textContent.includes("Kaldır")){
        delete filterObj.marka;
    }
  
    this.getStockData(filterObj);

    this.setState({
      filterApplied : filterObj
    });
    
    
}

  renderMarkaFilterOptions(){
    return this.state.filterArrayMarka.map(element => {
        return (
          // <DropdownItem onClick={() => this.toggleModal("modalEditTire")}>
          <DropdownItem key={element} onClick={this.applyFilter}>
                        <span>{element}</span>
          </DropdownItem>
        )
    });
  }

  renderStokTableRows() {
    return this.state.tires.map((tire, index) => {
        const stockPerc = tire.stokAdet / maxStock *100;
        
        const ebat = String(tire.taban).concat(" / ").concat(String(tire.oran))
                          .concat(" / ").concat(tire.jant)
                            .concat(" / ").concat(tire.yukEndeksi)
                              .concat(" / ").concat(tire.hizEndeksi).concat(" ");

        const tooltipID = "tooltip".concat(tire._id.toString());
        const rowId = "r".concat(tire._id.toString());
        const otherInfo = "\n\t Yanak: ".concat(tire.yanakYapisi).concat(
                          "\n\t Mevsim: ".concat(tire.mevsim).concat(
                          "\n\t Diğer: ".concat(tire.diger)));
        const ortMaliyet = Number.isInteger(tire.ortMaliyet) ? tire.ortMaliyet : tire.ortMaliyet.toFixed(2);
        const ortFiyat = Number.isInteger(tire.ortFiyat) ? tire.ortFiyat : tire.ortFiyat.toFixed(2);
                                  
        if (stockPerc <= 20) {
          var barClassVar = 'bg-danger';
          var infoIcon = 'fas fa-info-circle text-red';  
          var settingsIcon = 'ni ni-settings text-red';
          var ebatIcon = 'fas fa-car-side text-red'
        }else if (stockPerc >= 21 && stockPerc <=80 ) {
          var barClassVar = 'bg-info';
          var infoIcon = 'fas fa-info-circle text-info';
          var settingsIcon = 'ni ni-settings text-info';
          var ebatIcon = 'fas fa-car-side text-info'
        }else{
          var barClassVar = 'bg-success';
          var infoIcon = 'fas fa-info-circle text-green';
          var settingsIcon = 'ni ni-settings text-green';
          var ebatIcon = 'fas fa-car-side text-green'
        }

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
                  {tire.marka}
                </span>
              </Media>
            </Media>
          </th>
          <td className = "text-left">
              {tire.model}
          </td>
          <td>
              <i className={ebatIcon} /> {ebat}
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
          <td>
            <div className="d-flex align-items-center">
              <span className="mr-2">{tire.stokAdet}</span>
                {/* <div>
                  <Progress
                    max="100"
                    value={stockPerc}
                    barClassName={barClassVar}
                  />
              </div> */}
            </div>                
          </td>
          <td>
              ₺{ortMaliyet}
          </td>
          <td>
              ₺{ortFiyat}
          </td>
        </tr>

        );
    })
  }


  render() {
    let filterIcon ;
    debugger;
    if (Object.keys(this.state.filterApplied).length> 0 ){
      filterIcon = 'fas fa-filter text-green';  
    }else{
      filterIcon = 'fas fa-filter';  
    }

    return (

      
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Ciro Bazında
                      </h6>
                      <h2 className="text-white mb-0">Satışlar</h2>
                    </div>
                    {/* <div className="col">
                      <Nav className="justify-content-end" pills>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 1
                            })}
                            href="#pablo"
                            onClick={e => this.toggleNavs(e, 1)}
                          >
                            <span className="d-none d-md-block">Month</span>
                            <span className="d-md-none">M</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: this.state.activeNav === 2
                            })}
                            data-toggle="tab"
                            href="#pablo"
                            onClick={e => this.toggleNavs(e, 2)}
                          >
                            <span className="d-none d-md-block">Week</span>
                            <span className="d-md-none">W</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div> */}
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Line
                      //data={chartAylikCiroBazli[this.state.chartAylikCiroBazliOrnek]}
                      data={chartAylikCiroBazli.data}
                      options={chartAylikCiroBazli.options}
                      getDatasetAtEvent={e => console.log(e)}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            </Row>
            <Row className="mt-5">
            <Col xl="12">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Adet Bazlı
                      </h6>
                      <h2 className="mb-0">Satış Sayıları</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Bar
                      data={this.state.barChart.data}
                      options={chartAylikAdetBazli.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Stok Tablosu</h3>
                    </div>
                    {/* <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div> */}
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Marka
                          <UncontrolledDropdown direction="right">
                              <DropdownToggle className="pr-0" nav>
                                <i className={filterIcon} /*id={filterId}*/ /> 
                              </DropdownToggle>
                              <DropdownMenu className="dropdown-menu-arrow">
                                { this.renderMarkaFilterOptions()}
                                { Object.keys(this.state.filterApplied).length> 0 && 
                                    <DropdownItem divider /> 
                                }
                                { Object.keys(this.state.filterApplied).length> 0 && 
                                    <DropdownItem key="removeFilter" onClick={this.applyFilter}>
                                      <span>Filtreyi Kaldır</span>
                                    </DropdownItem>
                                }
                              </DropdownMenu>  
                          </UncontrolledDropdown>
                      </th>
                      <th scope="col">Desen</th>
                      <th scope="col">Ebat </th>
                      <th scope="col">Adet </th>
                      <th scope="col">Ort. Maliyet </th>
                      <th scope="col">Ort. Fiyat </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.renderStokTableRows()}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Index;
