// import react from "react";

// class TireRow extends React.Component {
//     constructor(props){
//         super(props);
//         tire: props[tire];
//     }

//     render(){
//         <tr key={rowId}>
//             <th scope="row">
//               <Media className="align-items-center">
//                 <a
//                   className="avatar rounded-circle mr-3"
//                   href="#pablo"
//                   onClick={e => e.preventDefault()}
//                 >
//                   <img
//                     alt="..."
//                     src={require("assets/img/theme/sketch.jpg")}
//                   />
//                 </a>
//                 <Media>
//                   <span className="mb-0 text-sm">
//                     {marka}
//                   </span>
//                 </Media>
//               </Media>
//             </th>
//             <td>
//                 <i className={ebatIcon} /> {ebat}
//             </td>
//             <td>
//               <div className="d-flex align-items-center">
//                 <span className="mr-2">{stockCount}</span>
//                   <div>
//                     <Progress
//                       max="100"
//                       value={stockPerc}
//                       barClassName={barClassVar}
//                     />
//                 </div>
//               </div>                
//             </td>
//             <td className = "text-center">
//               <span>
//               <i className={infoIcon} id={tooltipID} /> 
//                 <UncontrolledTooltip
//                   delay={0}
//                   target={tooltipID}
//                 >
//                   {otherInfo}
//                 </UncontrolledTooltip>
//                 </span>
//             </td>
//             <td className="text-right">
//             <UncontrolledDropdown direction="left">
//                 <DropdownToggle className="pr-0" nav>
//                   <i className={settingsIcon} /> 
//                 </DropdownToggle>
//                 <DropdownMenu className="dropdown-menu-arrow">
//                   <DropdownItem className="noti-title" header tag="div">
//                     <h6 className="text-overflow m-0">{editPopupTitle}</h6>
//                   </DropdownItem>
//                   <DropdownItem divider />

//                   <DropdownItem onClick={() => this.toggleModal("modalEditTire",tire)}>
//                     <i className="fas fa-edit" />
//                     <span>Düzenle</span>
                    
//                     { this.state.selectedTire && (
//                     <Modal
//                       className="modal-dialog-centered"
//                       isOpen={this.state.modalEditTire}
//                       toggle={() => this.toggleModal("modalEditTire")}
//                     >
//                       <div className="modal-header">
//                         <h6 className="modal-title" id="modal-title-default">
//                           Type your modal title
//                         </h6>
//                         <button
//                           aria-label="Close"
//                           className="close"
//                           data-dismiss="modal"
//                           type="button"
//                           onClick={() => this.toggleModal("modalEditTire")}
//                         >
//                           <span aria-hidden={true}>×</span>
//                         </button>
//                       </div>
//                       <div className="modal-body">
//                         <p>
//                           Far far away, behind the word mountains, far from the
//                           countries Vokalia and Consonantia, there live the blind
//                           texts. Separated they live in Bookmarksgrove right at the
//                           coast of the Semantics, a large language ocean.
//                         </p>
//                         <p>
//                           A small river named Duden flows by their place and supplies
//                           it with the necessary regelialia. It is a paradisematic
//                           country, in which roasted parts of sentences fly into your
//                           mouth.
//                         </p>
//                       </div>
//                       <div className="modal-footer">
//                         <Button color="primary" type="button">
//                           Save changes
//                         </Button>
//                         <Button
//                           className="ml-auto"
//                           color="link"
//                           data-dismiss="modal"
//                           type="button"
//                           onClick={() => this.toggleModal("modalEditTire")}
//                         >
//                           Close
//                         </Button>
//                       </div>
//                     </Modal>
//                     )}

//                   </DropdownItem>
//                   <DropdownItem onClick={() => this.toggleModal("modalDeleteTire",tire)}>
//                     <i className="fas fa-trash-alt"/>
//                     <span>Sil</span> 
//                     { this.selectedTire && (
//                     <Modal
//                       className="modal-dialog-centered modal-danger"
//                       contentClassName="bg-gradient-danger"
//                       isOpen={this.state.modalDeleteTire}
//                       toggle={() => this.toggleModal("modalDeleteTire",)}
//                     >
//                       <div className="modal-header">
//                         <h6 className="modal-title" id="modal-title-notification">
//                           Dikkat!
//                         </h6>
//                         <button
//                           aria-label="Close"
//                           className="close"
//                           data-dismiss="modal"
//                           type="button"
//                           onClick={() => this.toggleModal("modalDeleteTire")}
//                         >
//                           <span aria-hidden={true}>×</span>
//                         </button>
//                       </div>
//                       <div className="modal-body">
//                         <div className="py-3 text-center">
//                           <i className="ni ni-bell-55 ni-3x" />
//                           {/* <h4 className="heading mt-4">{editPopupTitle} - {otherInfo}</h4> */}
//                           <h4 className="heading mt-4">{this.printTireInfo(this.state.selectedTire)}</h4>
//                           <p>
//                             Yukarda belirtilen lastiği envanterden silmek üzeresiniz.
//                             Onaylıyor musunuz?
//                           </p>
//                         </div>
//                       </div>
//                       <div className="modal-footer">
//                         <Button className="btn-white" color="default" type="button">
//                           Onaylıyorum, sil.
//                         </Button>
//                         <Button
//                           className="text-white ml-auto"
//                           color="link"
//                           data-dismiss="modal"
//                           type="button"
//                           onClick={() => this.toggleModal("modalDeleteTire")}
//                         >
//                           Vazgeç
//                         </Button>
//                       </div>
//                     </Modal>
//                     )}
//                   </DropdownItem>
//                 </DropdownMenu>
//               </UncontrolledDropdown>
//             </td> 
//           </tr>
//     }

// }

// export default TireRow;