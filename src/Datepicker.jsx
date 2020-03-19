import React from "react";
// react plugin used to create datetimepicker
import ReactDatetime from "react-datetime";
import moment from 'moment';
// reactstrap components
import {
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
  Row
} from "reactstrap";

class Datepicker extends React.Component {
  // state = {};
  constructor(props){
    super(props);
    this.state = {
        // placeholder : this.props.placeholder ,
        // value : this.props.value ,
        // className: this.props.className
    }
}
  componentWillMount() {
      console.log("xxxDatepicker: ",this.state.className)
  }
  componentWillUpdate(){
    console.log("xxxDatepicker up: ",this.state.className)
  }

  handleChange = (val) => {
      // console.log("datepicker val ", val );
      // console.log("datepicker fVal " , val.format("DD-YYYY-MM") );
      // let fVal = val.format("DD/MM/YYYY");
      debugger;
      if ( moment(val,"DD/MM/YYYY",true).isValid() ){
          this.setState ({value:val.format("DD/MM/YYYY")});
          this.props.onChange(val.format("DD/MM/YYYY"));
      }
  }

  render() {
    return (
      <>
        <FormGroup>
          <InputGroup className="input-group-alternative">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="ni ni-calendar-grid-58" />
              </InputGroupText>
            </InputGroupAddon>
            <ReactDatetime
              inputProps={{
                //placeholder : "Tarih Seciniz"
                placeholder : this.props.placeholder 
               //,value : this.state.value 
              }}
              timeFormat={false}
              closeOnSelect={true}
              dateFormat="DD/MM/YYYY" 
              onChange={this.handleChange}
              value = { this.props.value  }
              className = "is-invalid"
            />
          </InputGroup>
        </FormGroup>
      </>
    );
  }
}

export default Datepicker;