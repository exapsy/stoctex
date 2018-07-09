import React, { Component } from 'react';
import axios                from 'axios';
import find                 from 'lodash/find';
import { Input }            from 'semantic-ui-react';

// LOCAL IMPORTS
import List    from '../../components/List';
import SideBar from '../../components/SideBar';
import rest    from '../../config/rest';
import './style.scss';

export default class Main extends Component {
  constructor() {
    super();
    this.state = { 
      products: [],
    };
    this.inputFormData = []
    this.updateList = this.updateList.bind(this);
    this.cellRender = this.cellRender.bind(this);
    this.updateCell = this.updateCell.bind(this);
  }

  componentDidMount() {
    // GET The list's product objects from the database
    axios.get(rest.v1.products, { crossdomain: true })
      .then(res => {
        this.setState({products: res.data});
    });
  }

  updateList(products) {
    // Reset, to form a table with other products
    this.inputFormData = [];
    // Update the state with the new products
    this.setState({products})
  }

  cellRender(cellValue, fieldName, objectId, cellId) {
    const inputStyle = {
      width: '100%'
    };

    // Storing InputForm data for values updating reference - API Calling
    this.inputFormData.push({cellValue, fieldName, objectId, cellId})
    // Type of the Input component
    const type = typeof(find(this.state.products, {_id: objectId})[fieldName.toLowerCase()]);

    return (
      <Input 
        defaultValue={typeof(cellValue) === 'string' ? cellValue.toString().toUpperCase() : cellValue} 
        style={inputStyle} 
        onChange={this.updateCell}
        id={cellId}
        type={type}
      />
    )
  }

  updateCell(event) {
    const { id, value: newValue } = event.target;

    // `Cell Value` should be clearly defined before updating
    if(newValue) {
      // Get InputForm data - objectId & fieldName
      const inputFormData = find(this.inputFormData, {cellId: id});
      axios.put(
          `${rest.v1.products}/${inputFormData.objectId}?${inputFormData.fieldName.toLowerCase()}=${newValue}`, 
          { crossdomain: true })
          .then(value=> {
            // This doesn't work as should. forceUpdate() should call cellRender() to update the type of the input
            // this.forceUpdate();
          });
    }
  }

  render() {
    return (
      <div className='Main'>
        <div className='content'>
          <SideBar updateList={this.updateList}/>
          <div className='maincontent'>
            <List 
              headers={{code: 'Code', name: 'Name', retail: 'Retail', wholesale: 'Wholesale', amount: 'Amount'}} 
              items={this.state.products}
              totalColumns={12}
              columnWidth={[2, 4, 2, 2, 2]}
              cellRender={this.cellRender}
            />
            
          </div>
        </div>
      </div>
    )
  }
}
