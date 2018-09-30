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
      filteredItems, 
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

    const totalPages = filteredItems.length/this.state.itemsPerPage

    // Slicing filtered items to match the current page
    const sliceStart = this.state.page * this.state.itemsPerPage
    const sliceEnd   = this.state.page * this.state.itemsPerPage + this.state.itemsPerPage;
    const pageItems  = filteredItems.slice(sliceStart, sliceEnd);

    return (
      <div className='maincontent'>
        <Table 
          headers={headers}
          items={pageItems}
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
        <div className='pages' style={{display: 'flex', flexDirection: 'column', alignSelf: 'center', left: 0, marginLeft: '128px', position: 'fixed'}}>
          <div>
            <Input onChange={(event) => {
              const newValue = event.target.value;
              if(newValue >=0 && newValue <= totalPages) {
                this.setState({page: newValue});
              }
            }} 
            fluid 
            placeholder='Page' 
            value={Number(this.state.page)} 
            label={'/ ' + Math.floor(totalPages)} 
            labelPosition='right'/>
          </div>
          <div>
            <Button icon='arrow left'  disabled={this.state.page === 0} onClick={() => this.setState({page: Number(this.state.page) - 1})}/>
            <Button icon='arrow right' disabled={this.state.page >= totalPages-1} onClick={() => this.setState({page: Number(this.state.page) + 1})}/>
          </div>
        </div>
      </div>
    )
  }
}
