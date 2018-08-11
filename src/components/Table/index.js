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
  Modal
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

  /** Form's Fields - To be used when adding new item */
  @observable form  = {};
  /** Table's items to display */
  @observable items = [];
  /** Message to show when something goes wrong - TODO: understand WTF IS THIS, should I remove it, since I have error boundaries */
  @observable message = {active: false, text: '', type: 'warning'};
  /** Dimmer to be used to confirm of an item's removal when pushing the removeButton */
  @observable confirmDimmer = {active: false, confirmed: false, itemId: null};

  constructor(props) {
    super(props);

    // column width init
    if(props.totalColumns && !props.columnsWidth) {
      props.columnsWidth = new Array(props.totalColumns).fill(1);
    }

    // form init
    if(props.itemAdd) {
      _forEach(props.headers, (header, key) => {
        this.form[key] = { value: '', error: null };
      });
    };

    this.computeItems(props.items);
  }

  componentDidUpdate(prevProps) {
    // If props changed, compute the new items
    if(prevProps !== this.props) {
      this.computeItems(this.props.items);
    }
  }

  /**
   * Update the form's field that have changed
   * @param {Event} event 
   */
  @action.bound
  onItemAdderFieldChange(event) {
    event.preventDefault();

    const fieldName = event.currentTarget.id;
    const newValue  = event.target.value;
    
    this.form[fieldName].value = newValue;

  }

  /**
   * Handler when the addItem button is clicked
   * @param {Event} event 
   */
  @action.bound
  onItemAdd(event) {
    event.preventDefault();
    
    // Item container
    let item = {};

    // Filling up the Item container with Form's fields
    _forEach(this.form, (field, key) => {
      // If field is required and is not filled, then field is errored, else place the field's value in the item's container
      if(this.isFieldRequired(key) && !field.value) {
        field.error = true;
      }
      else {
        field.error = false;
        item[key] = field.value;
      }
    });

    // If at least one field has error, then skip this function
    if(_find(this.form, {error: true})) return;

    // Clear the fields after filling the item's container
    _forEach(this.form, (field, key) => {
      field.value = '';
    });

    // Call props handler if existant, else does nothing
    if(this.props.onItemAdd) {
      this.props.onItemAdd(item)
        .catch(err => this.triggerMessage(err.response.data.errmsg, 'error'));
    }
  }

  /**
   * Handler when the removeItem button is clicked
   * @param {Event} event 
   */
  @action.bound
  async onItemRemove(event) {
    event.preventDefault();
    
    // If dimmer is not active, activate it and wait for user's confirmation of item's removal
    if(!this.confirmDimmer.active) {
      this.confirmDimmer.active = true;
      this.confirmDimmer.itemId = event.currentTarget.id;
    }
    else {
      // Deactivate the dimmer, since if opened, then a button placed on the dimmer must have been pushed
      this.confirmDimmer.active = false;
      
      // Get object id which was stored in the observable
      const objectId = this.confirmDimmer.itemId;
      // Clear the object id from the observable
      this.confirmDimmer.itemId = null;

      // If object id is not provided through the dimmer, it's a programmable error, thus not acceptable
      if(!objectId) {
        throw new Error('objectId was not provided from the dimmer');
      }

      // Call props handler if existant, else does nothing
      if(this.props.onItemRemove) {
        this.props.onItemRemove(objectId)
          .catch(err => this.triggerMessage(err.response.data.errmsg, 'error'));
      }
    }
  }

  /**
   * Handler when a modifiable field of a displayed item is changed
   * @param {Event} event 
   */
  @action.bound
  onItemUpdate(event) {
    event.preventDefault();

    // Getting [objectId, fieldName] from the `id` property of the HTML object
    const idArray = event.currentTarget.id.split(',');

    const objectId  = idArray[0];
    const fieldName = idArray[1];

    // The new value to store into item's field
    const newValue  = event.currentTarget.value;

    // Find item by objectId
    const item = _find(this.items, { _id: objectId });
    // Update item's field's value
    item[fieldName] = newValue

    // Update the item, and thus the item's functions
    this.computeItems(this.items);

    // Call props handler if existant, else does nothing
    if(this.props.onItemUpdate) {
      this.props.onItemUpdate(objectId, fieldName, newValue)
        .catch(err =>  this.triggerMessage(err.response.data.errmsg, 'error'));
    }
  }

  /**
   * Computes the `items` array of items returning to it the updated **functions** and **values**
   * @param {[{fieldName: (string|number)}]} items The items to be computed
   */
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

  /**
   * @returns {string} HTML Markup for Table Headers
   */
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

  /**
   * @returns {string} HTML Markup for Table Item Adder form
   */
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

  /**
   * @returns {string} HTML Markup for Table Items
   */
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

  /**
   * Provides the type of data that the field requires/returns
   * @param {string} fieldName The field to check the data type for
   * @returns {string} The type of the field
   */
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

  /**
   * Checks whether a field is a function computed value or not
   * @param {string} fieldName The field to check if its a function
   * @returns {boolean} True if field is a function
   */
  isFieldAFunction(fieldName) {
    return this.props.functions[fieldName] ?
      true
      : false;
  }

  /**
   * Checks whether or not a field is required
   * @param {string} fieldName The field to check if its required
   * @returns {boolean} True if field is required
   */
  isFieldRequired(fieldName) {
    if(!this.props.requiredFields) return false;

    if(!this.props.requiredFields[fieldName]) return false;

    return this.props.requiredFields[fieldName];
  }

  /**
   * Checks if a field is modifiable or not
   * @param {string} fieldName The field to check if its modifiable
   * @returns {boolean} True if field is modifiable
   */
  isFieldModifiable(fieldName) {
    if(!this.props.modifiableFields) return false;

    if(!this.props.modifiableFields[fieldName]) return false;

    return this.props.modifiableFields[fieldName];
  }

  /**
   * Triggers a dimmer which displays the message provided
   * @param {string} message The message to display to the dimmer
   * @param {string} type 'Warning' for a warning message, 'Error' for an error type of message
   */
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
              {this.message.type}
            </Header>
            <Header as='h2'>
              {this.message.text}
            </Header>
          </Dimmer>
          <Modal 
            open={this.confirmDimmer.active} 
            basic
            size='small'>
              <Header icon='message' content='Remove Item' />
              <Modal.Content>
                <p>
                  You sure want to remove the Item?
                </p>
              </Modal.Content>
              <Modal.Actions>
                <Button basic color='red' inverted onClick={() => this.confirmDimmer.active=false} icon labelPosition='left'>
                  <Icon name='remove'/>
                  No
                </Button>
                <Button basic color='green' inverted onClick={this.onItemRemove} icon labelPosition='left'>
                  <Icon name='checkmark'/>
                  Yes
                </Button>
              </Modal.Actions>
            </Modal>
        </Dimmer.Dimmable>
      </div>
    )
  }
}