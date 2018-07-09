import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import _                    from 'lodash';
import { 
  Icon, 
  Label, 
  Menu, 
  Table }                   from 'semantic-ui-react';
import uuid                 from 'uuid';


// LOCAL IMPORTS
import './style.scss';

export default class List extends Component {
  constructor(props) {
    super(props);
    const columnsWidth = this.props.columnWidth ? this.props.columnWidth : Array(this.props.headers.length).fill(1);
    this.state = {columnWidth: columnsWidth};
  }
  getTitles() {    
    return _.map(this.props.headers, (item, index) => {
      return (
        <Table.HeaderCell key={item.toLowerCase()}>
          {item}
        </Table.HeaderCell>
      );
    });
  }

  getItems() {
    return _.map(this.props.items, (item, index) => {
      let cells = []
      const headersArray = Object.values(this.props.headers);
      const objectKeys   = Object.keys(this.props.headers);
      const fieldArray   = _.map(objectKeys, (key, index) => {
        return item[key] || 'N/A';
      });
      
      for(let cellIndex = 0; cellIndex < headersArray.length; cellIndex++) {
        let itemObjectId = this.props.items[index]._id;
        let itemField    = headersArray[cellIndex];

        const cell = fieldArray[cellIndex];
        if(!cell){
          console.error(
            `Key "${headersArray[cellIndex]}" on item was null or undefined
            \n${JSON.stringify(item, '\n', 2)}`);
        }
        const cellId = uuid();
        cells.push(
          <Table.Cell key={cellId} selectable={this.props.cellRender && cell ? true : false} width={this.state.columnWidth[index]}>
            {this.props.cellRender && cell ? this.props.cellRender(cell, itemField, itemObjectId, cellId) : 'N/A'}
          </Table.Cell>
        );

      }

      return (
          <Table.Row key={uuid()}>
            {cells}
          </Table.Row>
        )
      }
    )
  }


  render() {
    return (
      <div className='list'>
        <Table celled sortable columnts={this.props.columns}>
          <Table.Header>
            <Table.Row>
              {this.getTitles()} 
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.getItems()}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

List.propTypes = {
  headers:      PropTypes.object,
  items:        PropTypes.arrayOf(PropTypes.object),
  cellRender:   PropTypes.func,
  totalColumns: PropTypes.number,
  columnWidth:  PropTypes.arrayOf(PropTypes.number)
};