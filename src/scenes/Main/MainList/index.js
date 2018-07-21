// APIS & LIBRARIES
import React, { Component } from 'react';
import axios                from 'axios';
import includes             from 'lodash/includes';

// LOCAL IMPORTS
import List    from '../../../components/List';
import rest    from '../../../config/rest';

const _models = Object.freeze({
  PRODUCTS: '/Products',
  CUSTOMERS: '/Customers',
  COURIERS: '/Couriers'
});

export default class MainList extends Component {
  constructor(props) {
    super(props);

    if(!props) throw new Error(`No params was provided to the Main.List`);
    if(!props.model) throw new Error(`No param 'model' was provided to the MainList`);
    if(!includes(_models, props.model)) throw new Error(`Param 'model' provided to the MainList was false. Try using 'MainList.models' enum instead.`);
    
    this.state = {model: null}
  }

  componentDidMount() {
    const { model } = this.props;
    import(__dirname + model)
      .then(value => {
        this.setState({ model: value.default });
        console.log('model imported!', this.state.model);
    });
  }

  static get models() { return _models };

  render() {
    console.log('state model', this.state.model);
    const { model } = this.state;
    
    return (
      this.state.model 
      ? <div className='List'>
          <List 
            headers       = { model.headers } 
            modifiable    = { model.modifiable }
            addItems      = { model.addItems }
            items         = { model.items }
            totalColumns  = { model.totalColumns }
            columnWidth   = { model.columnWidth }
            cellRender    = { model.cellRender }
          />
        </div>
      : <div className='List'>
          <List 
            headers       = { {noheader: 'N/A'}} 
            cellRender    = { function() {} }
          />
        </div>
    )
  }
} 