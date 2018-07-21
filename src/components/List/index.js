import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import map                  from 'lodash/map';
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

    if(!props) throw new Error(`No props were given to List`);
    if(!this.props.headers) throw new Error(`No headers were given to the List`);
    if(!this.props.cellRender) throw new Error(`No render function was given to the List`);
  }
  getTitles() {
    return map(this.props.headers, (item, index) => {
      return (
        <Table.HeaderCell key={item.toLowerCase()}>
          {item}
        </Table.HeaderCell>
      );
    });
  }

  getItems() {
    const { headers, cellRender } = this.props;

    const columnsWidth = this.props.columnWidth 
                            ? this.props.columnWidth 
                            : Array(this.props.headers.length).fill(1);
    const { items } = this.props;

    return map(items, (item, index) => {
      let cells = [];
      const headersValues  = Object.values(headers);
      const itemKeys = Object.keys(headers);

      // Returns item's values by key
      const fieldArray   = map(itemKeys, (key, index) => {
        return item[key] || 'N/A';
      });

      
      // Loop through all the headers
      for(let cellIndex = 0; cellIndex < headersValues.length; cellIndex++) {
        let itemObjectId  = items[index]._id;
        let fieldName = itemKeys[cellIndex];

        const cellValue = fieldArray[cellIndex];
        if(!cellValue){
          console.error(
            `Key "${headersValues[cellIndex]}" on item was null or undefined
            \n${JSON.stringify(item, '\n', 2)}`);
        }
        const cellId = uuid();
        cells.push(
          <Table.Cell key={cellId} selectable={this.props.cellRender && cellValue ? true : false} width={columnsWidth[index]}>
            { cellRender && 
              cellValue ? 
              cellRender(cellValue, fieldName, itemObjectId, cellId) 
                : 'N/A'}
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

  getAdder() {
    if(!this.props.addItems) return null;



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
          {this.getAdder() ?
            (
              <Table.Body>
                {this.getAdder()}
                {this.getItems()}
              </Table.Body>
            )
            :
            (
              <Table.Body>
                {this.getItems()}
              </Table.Body>
            )
          }
        </Table>
      </div>
    )
  }
}

List.propTypes = {
  headers:      PropTypes.object,
  items:        PropTypes.arrayOf(PropTypes.object),
  modifiable:   PropTypes.array,
  functions:    PropTypes.array,
  addItems:     PropTypes.func,
  totalColumns: PropTypes.number,
  columnWidth:  PropTypes.arrayOf(PropTypes.number),
  cellRender:   PropTypes.func
};