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
//import { Link } from "react-router-dom";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  UncontrolledDropdown,
  Media,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.jsx";
import Header from "components/Headers/Header.jsx";
import Datepicker from "../../Datepicker.jsx"




class Profile extends React.Component {
  render() {
    return (
      <>
        {<Header /> } 

        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Yeni Sipariş</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        Mevcut Siparişler
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      Lastik Bilgileri
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label for="input-marka"
                                className="form-control-label"
                              >
                                Marka
                              </label>
                            
                              
                              <Input type="select" 
                              className="form-control-alternative"
                              id="input-marka"
                              >
                                <option>Lastik Markasi Secimi</option>  
                                <option>Good Year</option>
                                <option>Michelin</option>
                                <option>Continental</option>

                            </Input>

                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                          <label for="input-marka"
                                className="form-control-label"
                              >
                                Ebat
                              </label>
                            
                              
                              <Input type="select" 
                              className="form-control-alternative"
                              id="input-ebat"
                              >
                                <option>Lastik Ebati Secin</option>  
                                <option>R16</option>
                                <option>R17</option>
                                <option>R18</option>
                                <option>R19</option>

                            </Input>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Alış Fiyatı (KDV Dahil)
                            </label>
                            <Input
                              className="form-control-alternative"
                              //defaultValue="Lucky"
                              id="input-first-name"
                              placeholder="₺ Cinsinden"
                              type="number"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Satış Fiyatı (KDV Dahil)
                            </label>
                            <Input
                              className="form-control-alternative"
                              //defaultValue="Jesse"
                              id="input-last-name"
                              placeholder="₺ Cinsinden"
                              type="number"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Kapora Miktari 
                            </label>

                            <Input
                              className="form-control-alternative"
                              //defaultValue="Lucky"
                              id="input-first-name"
                              placeholder="₺ Cinsinden"
                              type="number"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                        <FormGroup > 
                              <label for="kaporaSelect"
                                className="form-control-label"
                              >
                                Kapora Tipi
                              </label>
                            
                              
                              <Input type="select" label="dene"
                              className="form-control-alternative"
                              id="kaporaSelect"
                              >
                                <option>Kapora Tipini Secin</option>  
                                <option>Nakit</option>
                                <option>K.Karti</option>
                            </Input>
                            
          
                            </FormGroup> 
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Teslimat Bilgileri
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                              
                            >
                              Sipariş Nedeni
                            </label>
                            <Input
                              className="form-control-alternative"
                              //defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                              id="input-address"
                              placeholder="Stok / Kisi Bilgisi"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Sipariş Yeri
                            </label>
                            <Input
                              className="form-control-alternative"
                              //defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                              id="input-address"
                              placeholder="Nereden temin edilecek ?"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              Telefon Numarasi
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="05"
                              id="input-city"
                              placeholder="tel"
                              type="tel"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Teslimat Tarihi
                            </label>
                            {/* <Input
                              className="form-control-alternative"
                              defaultValue ="01/01/0001"
                              id="input-country"
                              placeholder="Country"
                              type= "date"
                            /> */}
                            <Datepicker
                              placeholder = "Teslimat Tarihini Secin"
                            ></Datepicker>
                          
                          </FormGroup>
                        </Col>
                        
                      </Row>
                      <Row>
                        <Col lg="12">
                          <FormGroup>
                            <label>Notlar</label>
                            <Input
                              className="form-control-alternative"
                              placeholder="Ek not varsa buraya ..."
                              rows="4"
                              type="textarea"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      
                    </div>
                    
                    {/* Description */}
                    
                    
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}





export default Profile;
