import React, { Component } from 'react';
import { 
  observable, 
  action,
  computed
}                           from 'mobx';
import { observer }         from 'mobx-react';
import PropTypes            from 'prop-types';
import uuid                 from 'uuid';
import _map                  from 'lodash/map';
import _find                 from 'lodash/find';
import _forEach              from 'lodash/forEach';
import {
  Table,
  Button,
  Icon,
  Input,
  Dimmer,
  Header,
  Transition,
  Confirm
}                           from 'semantic-ui-react';

import './style.scss';

@observer
export default class StoctexTable extends Component {
  static propTypes = {
    headers:      PropTypes.object,
    items:        PropTypes.arrayOf(PropTypes.object),
    totalColums:  PropTypes.number,
    columnsWidth: PropTypes.arrayOf(PropTypes.number),
    functions:    PropTypes.object,
    onItemAdd:    PropTypes.func,
    onItemRemove: PropTypes.func,
    onItemUpdate: PropTypes.func,
    dataTypes:    PropTypes.object
  };

  static defaultProps = {
    headers: {header: 'No Headers'},
    items: [{}],
    totalColumns: 1,
    columnsWidth: [1],
    onItemAdd: (event) => {},
    functions: {},
    dataTypes: {}
  };

  @observable form  = {};
  @observable items = [];
  @observable message = {active: false, text: '', type: 'warning'};
  @observable confirmDimmer = {active: false, confirmed: false, itemId: null};

  constructor(props) {
    super(props);

    // COLUMN WIDTH INIT
    if(props.totalColumns && !props.columnsWidth) {
      props.columnsWidth = new Array(props.totalColumns).fill(1);
    }

    // FORM INIT
    if(props.itemAdd) {
      _forEach(props.headers, (header, key) => {
        this.form[key] = { value: '', error: null };
      });
    };

    this.computeItems(props.items);
  }

  componentDidUpdate(prevProps) {
    if(prevProps !== this.props) {
      this.computeItems(this.props.items);
    }
  }

  @action.bound
  onItemAdderFieldChange(event) {
    event.preventDefault();

    const fieldName = event.currentTarget.id;
    const newValue  = event.target.value;
    
    this.form[fieldName].value = newValue;

  }

  @action.bound
  async onItemAdd(event) {
    event.preventDefault();
    
    let item = {};

    // CREATING item FROM FORM
    _forEach(this.form, (field, key) => {

      if(this.isFieldRequired(key) && !field.value) {
        field.error = true;
      }
      else {
        field.error = false;
        item[key] = field.value;
      }
    });

    // IF AT LEAST ONE FIELD HAS ERROR
    if(_find(this.form, {error: true})) return false;

    // CLEAR ALL FIELDS
    _forEach(this.form, (field, key) => {
      field.value = '';
    });
        // CALL EXTERNAL EVENT HANDLER
    if(this.props.onItemAdd) {
      try {
        this.props.onItemAdd(item);
      }
      catch(e) {
        console.error(e.message);
        this.triggerMessage(e.response.data.errmsg, 'error');
      }
    }
  }

  @action.bound
  onItemRemove(event) {
    event.preventDefault();
    
    if(!this.confirmDimmer.active) {
      this.confirmDimmer.active = true;
      this.confirmDimmer.itemId = event.currentTarget.id;
    }
    else {
      this.confirmDimmer.active = false;
      
      const objectId = this.confirmDimmer.itemId;
      this.confirmDimmer.itemId = null;

      if(!objectId) {
        console.error('No ObjectId was given for the item');
        return;
      }

      // CALL EXTERNAL EVENT HANDLER IF EXISTS
      if(this.props.onItemRemove) {
        try {
          this.props.onItemRemove(objectId);
        }
        catch(e) {
          this.triggerMessage(e.response.data.errmsg, 'error');
        }
      }
    }
  }

  @action.bound
  onItemUpdate(event) {
    event.preventDefault();

    const idArray = event.currentTarget.id.split(',');

    const objectId  = idArray[0];
    const fieldName = idArray[1];
    const newValue  = event.currentTarget.value;

    const item = _find(this.items, { _id: objectId });
    item[fieldName] = newValue

    this.computeItems(this.items);

    if(this.props.onItemUpdate) {
      try {
        this.props.onItemUpdate(objectId, fieldName, newValue);
      }
      catch(e) {
        this.triggerMessage(e.response.data.errmsg, 'error');
      }
    }
  }

  @action 
  computeItems(items) {
    const { headers } = this.props;
    
    this.items = _map(items, (item, index) => {
      const computedItem = {};

      // FILLING item
      _forEach(headers, (header, key) => {
        // IF FIELD = FUNCTION THEN: RETURN FUNCTION VALUE
        if(this.isFieldAFunction(key)) computedItem[key] = this.props.functions[key](item);
        
        else computedItem[key] = item[key];

      });

      // ADDING _id TO KEEP TRACK OF THE ITEM OUTSIDE THE TABLE'S SCOPE
      computedItem['_id'] = item['_id'];

      return computedItem;
    });
  }

  @computed
  get tableHeader() {
    if(!this.props.headers) return (null);

    const { columnsWidth, headers } = this.props;

    // RETURN OBJECT - HEADER
    const headerCells = _map(Object.values(headers), (headerValue, index) => {
      return (
        <Table.HeaderCell key={uuid()} width={columnsWidth[index]}>
          {headerValue}
        </Table.HeaderCell>
      )
    });

    return (
      <Table.Header>
        <Table.Row>
          {headerCells}
        </Table.Row>
      </Table.Header>
    )
  }

  @computed
  get tableItemAdder() {
    if(!this.props.itemAdd) return (null);

    const { headers } = this.props;

    // RETURN OBJECT - ADD BUTTON
    const addItemButton = (
      <Table.Cell className='buttonCell'>
        <Button icon onClick={this.onItemAdd}>
          <Icon name='plus'/>
        </Button>
      </Table.Cell>
    );

    // RETURN OBJECT - CELLS
    let itemAdderCells = [];

    // FILLING itemAdderCells
    _forEach(Object.values(headers), (headerValue, index) => {
      
      const fieldName  = Object.keys(headers)[index];

      const cellProps = {
        id: fieldName,
        key: fieldName, 
        textAlign: 'center', 
        error: this.form[fieldName].error
      };
      const inputProps = {
        id:       fieldName,
        value:    this.form[fieldName].value,
        type:     this.getDataType(fieldName),
        onChange: this.onItemAdderFieldChange
      };

      const itemAdderCell = (
        <Table.Cell {...cellProps}>
          {!this.isFieldAFunction(fieldName) ? 
          <Input {...inputProps}/>
          : <span className='itemAdderFunctionField'>f(x)</span>}
        </Table.Cell>
      );

      itemAdderCells.push(
        itemAdderCell
      )
    });

    return (
      <Table.Row active key='itemAdderRow' className='itemAdderRow'>
        {itemAdderCells}
        {addItemButton}
      </Table.Row>
    );
  }

  @computed
  get tableItems() {

    if(!this.props.items) return (null);

    const { headers } = this.props;
    const items       = this.items;
    // console.log('items', items);

    return _map(items, (item, index) => {

      // RETURN OBJECT - REMOVE BUTTON
      const itemRemoveButton = (
        <Table.Cell className='buttonCell'>
          <Button icon onClick={this.onItemRemove} id={item._id}>
            <Icon name='minus'/>
          </Button>
        </Table.Cell>
      );

      // RETURN OBJECT - CELLS
      let itemCells = [];

      // FILLING itemCells
      _forEach(headers, (header, key) => {

        const fieldState = this.isFieldAFunction(key) ?
          'function'
          : this.isFieldModifiable(key) ?
          'modifiable'
          : 'unmodifiable'

        const tableCellProps = {
          key: `${item._id}_${key}`,
          className: `itemFieldCell ${fieldState}Cell`
        };
        
        const inputProps = {
          value:    item[key] || '',
          id: [item._id, key],
          type: this.getDataType(key),
          onChange: this.onItemUpdate
        };
        
        // FIELD IS EITHER A FUNCTION / UNMODIFIABLE / MODIFIABLE
        const itemRender = fieldState === 'function' ?
          <span className='functionField'>{item[key]}</span>
          : fieldState === 'modifiable' ?
          <Input {...inputProps} className='modifiableField'/>
          : <span className='unmodifiableField'>{item[key]}</span>;

        const itemCell = (
          <Table.Cell {...tableCellProps}>
            {itemRender}
          </Table.Cell>
        );

        itemCells.push(
          itemCell
        );

      });

      return (
        <Table.Row key={item._id} className='itemRow'>
          {itemCells}
          {itemRemoveButton}
        </Table.Row>
      );

    });

  }

  getDataType(fieldName) {

    // GIVEN TYPE BY PROPS
    if(this.props.dataTypes)
      if(this.props.dataTypes[fieldName])
        return this.props.dataTypes[fieldName];

    // GETTING FROM FIRST ITEM
    if(this.items)
      if(this.items[0])
        return typeof(this.items[0]);

    // DEFAULT
    return 'string';
  }

  isFieldAFunction(fieldName) {
    return this.props.functions[fieldName] ?
      true
      : false;
  }

  isFieldRequired(fieldName) {
    if(!this.props.requiredFields) return false;

    if(!this.props.requiredFields[fieldName]) return false;

    return this.props.requiredFields[fieldName];
  }

  isFieldModifiable(fieldName) {
    if(!this.props.modifiableFields) return false;

    if(!this.props.modifiableFields[fieldName]) return false;

    return this.props.modifiableFields[fieldName];
  }

  triggerMessage(message, type) {
    this.message.text   = message;
    this.message.active = true;
    this.message.type   = type;
  }

  render() {
    const { totalColumns } = this.props;

    const tableProps = {
      celled: true,
      sortable: true,
      fixed: true,
      columns: totalColumns
    }

    const handleHide = function() {
      this.error.active = false;
    };

    return (
      <div className='table'>
        <Dimmer.Dimmable dimmed={this.message.active} blurring>
          <Table {...tableProps}>
            {this.tableHeader}
            <Transition.Group as={Table.Body} animation='browse' duration={500}>
              {this.tableItemAdder}
              {this.tableItems}
            </Transition.Group>
          </Table>

          <Dimmer active={this.message.active} onClickOutside={handleHide}>
            <Header as='h1' color='red'>
              Error
            </Header>
            <Header as='h2'>
              {this.message.text}
            </Header>
          </Dimmer>
          <Confirm 
            open={this.confirmDimmer.active} 
            onCancel={() => this.confirmDimmer.active = false }
            onConfirm={this.onItemRemove}/>
        </Dimmer.Dimmable>
      </div>
    )
  }
}