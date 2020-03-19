// import React, { Component } from 'react';

// class StockTable extends Component {
//     constructor(props) {
//       super(props); //since we are extending class Table so we have to use super in order to override Component class constructor
//       this.state = {
//           _itemHeader: "",
//             get itemHeader() {
//               return this._itemHeader;
//           },
//             set itemHeader(value) {
//               this._itemHeader = value;
//           },
//         items: [
//           { id: 1, name: 'Wasif', age: 21, email: 'wasif@email.com' },
//           { id: 2, name: 'Ali', age: 19, email: 'ali@email.com' },
//           { id: 3, name: 'Saad', age: 16, email: 'saad@email.com' },
//           { id: 4, name: 'Asad', age: 25, email: 'asad@email.com' }
//         ]
//       };
//     }
  
//  render() { //Whenever our class runs, render method will be called automatically, it may have already defined in the constructor behind the scene.
//     return (
//        <div>
//           <h1>this.itemHeader()</h1>
//        </div>
//     )
 


//  }
//  renderTableData() {
//     return this.state.items.map((item, index) => {
//        const { id, name, age, email } = student //destructuring
//        return (
//           <tr key={id}>
//              <td>{id}</td>
//              <td>{name}</td>
//              <td>{age}</td>
//              <td>{email}</td>
//           </tr>
//        )
//     })
//  }
// }



// export default Table
  