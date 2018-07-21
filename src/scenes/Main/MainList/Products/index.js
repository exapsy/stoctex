// APIs & LIBRARIES
import React         from 'react';
import axios         from 'axios';
import find          from 'lodash/find';
import sum           from 'lodash/sum';
import { Input }     from 'semantic-ui-react';

// LOCAL IMPORTS
import rest from '../../../../config/rest';

const _headers = Object.freeze({
  code1: 'Code1',
  code2: 'Code2',
  barcode: 'Barcode',
  name: 'Name', 
  gs: 'GS',
  corfu: 'Corfu',
  cclit: 'CClit',
  gp_k: 'GP K',
  total: 'Total' });
const _modifiable = Object.freeze([
  'code2', 
  'gs',
  'corfu',
  'cclit', 
  'gp_k'
]);
const _totalColumns = 8;
const _columnWidth = [ 1, 1, 1, 1, 1, 1, 1, 1 ];

export default class Products {
  static get headers()      { return _headers; }
  static get modifiable()   { return _modifiable; }
  static get functions()    {
    return [
      'total',
      (items) => {
        const { gs, cclit, corfu, gp_k } = items;
        return sum([gs, cclit, corfu, gp_k]);
      }
    ]
  }
  static get addItems()     { 

  }
  static get items()        {
    return this._fetchProducts();
  }
  static get totalColumns() { return _totalColumns; }
  static get columnWidth()  { return _columnWidth; }
  static cellRender(cellValue, fieldName, objectId, cellId) {
    const inputStyle = {
      width: '100%'
    };
    const products = this._fetchProducts();

    // Storing InputForm data for values updating reference - API Calling
    this.inputFormData.push({cellValue, fieldName, objectId, cellId});
    // Type of the Input component
    const type = typeof(find(products, {_id: objectId})[fieldName.toLowerCase()]);

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
  static async _fetchProducts() {
    return axios.get(rest.v1.products)
      .then(value => {
        return value.data;
      });
  }
}