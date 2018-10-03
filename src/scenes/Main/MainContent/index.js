// APIs & LIBRARIES
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Table from '../../../components/Table';
import './style.scss';
import { 
  Button,
  Input
} from 'semantic-ui-react';

@inject("listStore")
@observer
export default class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = { page: 0, itemsPerPage: 24 }
  }

  render() {

    // TABLE PROPERTIES FETCH
    const { 
      headers, 
      filteredPagedItems, 
      functions, 
      totalColumns, 
      columnsWidth, 
      dataTypes, 
      requiredFields, 
      modifiableFields, 
      addItemDb,
      removeItemDb,
      updateItemDb,
      refreshItems
    } = this.props.listStore;


    return (
      <div className='maincontent'>
        <Table 
          headers={headers}
          items={filteredPagedItems}
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
          refreshItems={refreshItems}
        />
      </div>
    )
  }
}
