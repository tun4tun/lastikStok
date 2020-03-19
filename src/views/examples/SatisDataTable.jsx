import React, {Component} from 'react';
import {
    Button,
    Card,
    CardHeader,
    Container,
    Col,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    FormGroup,
    Input,
    Media,
    Row,
    UncontrolledDropdown,
    UncontrolledTooltip,
    Table
} from "reactstrap";

import ModalTrxDelConfirm from "./ModalTrxDelConfirm";
import Tire from "../../Tire.js";
import ModalEditTrxSatis from './ModalEditTrxSatis';


export default class SatisDataTable extends Component{
    constructor(props){
        super(props);
        this.state = {
            columnTitles : props.columnTitles
            

        }
    }
    componentDidMount(){
        console.log("DataTable componentDidMount");
        console.log("Column headers: ", this.props.isEditModalVisible);
 
    }

    addMarkaFilter = (event) => {

        console.log("addFilter@SatisDataTable event: ", event.currentTarget.textContent,);

        this.props.filterFunc({marka: event.currentTarget.textContent});
    }

    addTarihFilter = (event) => {

        console.log("addFilter@SatisDataTable event: ", event.currentTarget.textContent,);

        this.props.filterFunc({tarih: event.currentTarget.textContent});
    }

    renderColumnTitles = () => {
      
      
        return this.state.columnTitles.map( (item,index)=>{
              var filterIcon;
               console.log(index,item,this.props.filter);
               let thKey = "thColHdr"+index;
               let filterId = "iFilterId"+index;
               switch (item) {
                 case "Marka":
                    if (this.props.filter.marka){
                        filterIcon = 'fas fa-filter text-green';  
                    }else{
                        filterIcon = 'fas fa-filter';  
                    }
                    return (<th scope="col" key={thKey} >{item}

                              <UncontrolledDropdown direction="right">
                                <DropdownToggle className="pr-0" nav>
                                  <i className={filterIcon} id={filterId} /> 
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-arrow">
                                  { this.renderMarkaFilterOptions()}
                                  { this.props.filter.marka && 
                                      <DropdownItem divider /> 
                                  }
                                  { this.props.filter.marka && 
                                      <DropdownItem key="removeFilter" onClick={this.addMarkaFilter}>
                                        <span>Filtreyi Kaldır</span>
                                      </DropdownItem>
                                  }
                                  </DropdownMenu>  
                              </UncontrolledDropdown>
                              </th>) ;
                 case "Tarih":
                    if (this.props.filter.tarih){
                      filterIcon = 'fas fa-filter text-green';  
                    }else{
                      filterIcon = 'fas fa-filter';  
                    }
                    return (<th scope="col" key={thKey} >{item}
                              <UncontrolledDropdown direction="right">
                                <DropdownToggle className="pr-0" nav>
                                  <i className={filterIcon} id={filterId} /> 
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-arrow">
                                  { this.renderTarihFilterOptions() }                          
                                  { this.props.filter.tarih && 
                                      <DropdownItem divider /> 
                                  }
                                  { this.props.filter.tarih && 
                                      
                                      <DropdownItem key="removeFilter-tarih" onClick={this.addTarihFilter}>
                                          <span>Filtreyi Kaldır</span>
                                      </DropdownItem>
                                  }
                                </DropdownMenu>  
                              </UncontrolledDropdown>
                            </th>) ;
                 default:
                 return (<th scope="col" key={thKey} >{item}</th>) ;
               }
           
             
            

          });
    }

    renderMarkaFilterOptions(){
        return this.props.markaFilterOptions.map(element => {
            return (
              // <DropdownItem onClick={() => this.toggleModal("modalEditTire")}>
              <DropdownItem key={element} onClick={this.addMarkaFilter}>
                            <span>{element}</span>
              </DropdownItem>
            )
        });
    }

    renderTarihFilterOptions(){
      return this.props.tarihFilterOptions.map(element => {
          return (
            // <DropdownItem onClick={() => this.toggleModal("modalEditTire")}>
            <DropdownItem key={element} onClick={this.addTarihFilter}>
                          <span>{element}</span>
            </DropdownItem>
          )
      });
    }
   

    // renderRows = () => {
    renderRows(){
        
        return this.props.data.map((item, index) => {
            let tireTemp = new Tire(item);
            let deleteConfirmQstn ="Yukarda belirtilen satış işlemini envanterden silmek üzeresiniz.\nOnaylıyor musunuz?"
            let saleTrx = item ;

            const { _id,owner_id,marka,model,taban,oran,jant,yukEndeksi,hizEndeksi,yanakYapisi,mevsim,diger,tarih,satisAdet,birimFiyat } = item; //destructuring
            const dbRowId = _id;
            const ebat = String(taban).concat(" / ").concat(String(oran))
                            .concat(" / ").concat(jant)
                                .concat(" / ").concat(yukEndeksi)
                                .concat(" / ").concat(hizEndeksi);

            const tooltipID = "tooltip".concat(_id.toString());
            const rowId = "r".concat(_id.toString());
            const otherInfo = "Yanak: ".concat(yanakYapisi).concat(
                                "\n\t\t  Mevsim: ".concat(mevsim).concat(
                                "\n\t Diğer: ".concat(diger)));
            
                                console.log("otherinfi:",otherInfo);

            const deleteModalTitle = tireTemp.mainInfo() + " için, \n" + 
                                    tarih + " tarihinde\n"  +
                                    birimFiyat+"₺ fiyatından\n" +
                                    satisAdet+ " adet satış işlemi"

            const editPopupTitle = marka.concat(" ").concat(model).concat(" - ").concat(ebat);
            
            var infoIcon = 'fas fa-info-circle text-info';
            var settingsIcon = 'ni ni-settings text-info';
            var ebatIcon = 'fas fa-car-side text-info';
            const editModalValues =[birimFiyat,satisAdet,tarih];
            
                                        
            
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
              <td>
                <span className="mb-0 text-sm">
                  {tarih}
                </span>
              </td>
              <td>
                <span className="mb-0 text-sm">
                  {satisAdet}
                </span>
              </td>
              <td>
                <span className="mb-0 text-sm">
                  {birimFiyat}
                </span>
              </td>
              <td className="text-right">
              <span>
                <i className={infoIcon} id={tooltipID} /> 
                  <UncontrolledTooltip
                    delay={0}
                    target={tooltipID}
                  >
                    {otherInfo}
                  </UncontrolledTooltip>
              </span>
              <UncontrolledDropdown direction="left">
                  <DropdownToggle className="pr-0" nav>
                    <i className={settingsIcon} /> 
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-arrow">
                    <DropdownItem className="noti-title" header tag="div">
                      <h6 className="text-overflow m-0">{editPopupTitle}</h6>
                    </DropdownItem>
                    <DropdownItem divider />

                    <DropdownItem onClick={() => this.props.toggleFunc("modalEditSale")}>
                      <i className="fas fa-edit" />
                      <span>Düzenle</span>
                      <ModalEditTrxSatis
                        title={tireTemp.mainInfo()}
                        tire={tireTemp}
                        modalStateName={this.props.editModalStateName}
                        isOpen={this.props.isEditModalVisible}
                        toggleFunc={this.props.toggleFunc}
                        editFunc={this.props.editFunc}
                        trx={saleTrx}
                        maxAdet={this.props.maxAdet}
                        />

                      
                    

                    </DropdownItem>
                    <DropdownItem onClick={() => this.props.toggleFunc("modalDeleteSale")}>
                      <i className="fas fa-trash-alt"/>
                      <span>Sil</span> 
                      <ModalTrxDelConfirm headerTitle="Dikkat!" 
                                          mainTitle={deleteModalTitle}
                                          confirmButtonName="Onaylıyorum, sil."
                                          question={deleteConfirmQstn}
                                          isOpen={this.props.isConfirmModalVisible}
                                          modalStateName={this.props.deleteModalStateName}
                                          toggleFunc={this.props.toggleFunc}
                                          confirmFunc={this.props.confirmFunc}
                                          id={dbRowId}
                      />

                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </td> 
            </tr>
            )
        })
    };


    render(){
        return (
                <Card className="bg-default shadow">
                {/* <Container className="mt--7" fluid> */}
                
                    <CardHeader className="bg-transparent border-0">
                      <h3 className="text-white mb-0">{this.props.mainTitle}</h3>
                    </CardHeader>
                        <Table
                        className="align-items-center table-dark table-flush"
                        responsive
                        >
                        <thead className="thead-dark">
                            <tr>
                            {this.renderColumnTitles()}
                            
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRows()} 
                        </tbody>
                    </Table>
                </Card>
       
        );
    }
}