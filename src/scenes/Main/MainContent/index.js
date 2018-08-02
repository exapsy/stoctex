// APIs & LIBRARIES
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { toJS }             from 'mobx';

// LOCAL IMPORTS
import Table from '../../../components/Table';
import ListStore from '../../../stores/ListStore';
import './style.scss';

@inject("listStore")
@observer
export default class MainContent extends Component {

  static defaultProps = {
    listStore: new ListStore(ListStore.modes.PRODUCTS)
  }

  constructs() {
    this.addItem = this.addItem.bind(this);
  }

  componentDidMount() {
    const { fetchItems } = this.props.listStore;

    fetchItems()
      .then(value => {
        this.props.listStore.items = value;
      })
      .catch(err => { throw new Error(`Error while fetching items ${err}`)});
  }

  render() {

    // TABLE PROPERTIES FETCH
    const { 
      headers, 
      filteredItems, 
      functions, 
      totalColumns, 
      columnsWidth, 
      dataTypes, 
      requiredFields, 
      modifiableFields, 
      addItemDb,
      removeItemDb,
      updateItemDb
    } = this.props.listStore;

    return (
      <div className='maincontent'>
        <Table 
          headers={headers}
          items={toJS(filteredItems)}
          functions={functions}
          totalColumns={totalColumns}
          columnsWidth={columnsWidth}
          dataTypes={dataTypes}
          requiredFields={requiredFields}
          modifiableFields={modifiableFields}
          itemAdd={true}
          onItemAdd={addItemDb}
          onItemRemove={removeItemDb}
          onItemUpdate={updateItemDb}
        />
      </div>
    )
  }
}
