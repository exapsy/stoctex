// APIs & LIBRARIES
import { 
  computed, 
  action, 
  observable,
}               from 'mobx';
import axios    from 'axios';
import _includes from 'lodash/includes';
import _filter   from 'lodash/filter';
import _reduce   from 'lodash/reduce';

// LOCAL IMPORTS
import rest from '../config/rest';

/**
 * Stores and Retrieves List data through and from the API
 */
export default class ListStore {

  /** All the items to be fetched to the list, unfiltered */
  @observable items = [];
  
  /** Editable observable function provided, for the filters to be modifiable however it is desired */
  @observable itemFilterCallback = () => true;

  /** Provides an enumerable from 'modes' freezed variable, which describes what type of items the ListStore provides */
  @observable mode;

  /** Enumerable for 'mode' variable, describes the type of 'items' provided by the database */
  static modes = Object.freeze({
    PRODUCTS:  'products',
    COURIERS:  'couriers',
    CUSTOMERS: 'customers'
  });

  /** Provides all the necessary constant information about all types of items that can be provided */
  @observable.ref _modeFields = Object.freeze({
    products: {
      headers: {
        code1:   'Code1', 
        code2:   'Code2', 
        barcode: 'Barcode',
        name:    'Name',
        gs:      'GS',
        corfu:   'Corfu',
        cclit:   'CClit',
        gp_k:    'GP K',
        total:   'Total'
      },
      functions: {
        total: (item) => this.sum([item.gs, item.corfu, item.cclit, item.gp_k])
      },
      totalColumns: 9,
      columnsWidth: [3, 3, 4, 7, 3, 3, 3, 3, 3],
      dataTypes: {
        code1:   'string', 
        code2:   'string', 
        barcode: 'string',
        name:    'string',
        gs:      'number',
        corfu:   'number',
        cclit:   'number',
        gp_k:    'number',
        total:   'number'
      },
      requiredFields: {
        code1:   true,
        code2:   false,
        barcode: true,
        name:    true,
        gs:      true,
        corfu:   true,
        cclit:   true,
        gp_k:    true
      },
      modifiableFields: {
        code1:   false,
        code2:   true,
        barcode: false,
        name:    false,
        gs:      true,
        corfu:   true,
        cclit:   true,
        gp_k:    true
      },
      rest: rest.v1.products
    },
    customers: {
      headers: {
        id: 'ID', 
        name: 'Full Name', 
        favouriteCourier: 'Favourite Courier',
        vat: 'VAT',
        doy: 'ΔΟΥ',
        phone1: 'Phone 1',
        phone2: 'Phone 2',
        email: 'Email',
        location: 'Location',
        address: 'Address',
        zip: 'ZIP'
      },
      rest: rest.v1.customers
    },
    couriers: {
      headers: {
        name: 'Couriers', 
        email: 'Email', 
        phone: 'Phone'
      },
      rest: rest.v1.couriers
    }
  });


  /**
   * 
   * @param {string} mode The type of model for the list to retrieve
   */
  constructor(mode) {
    // If mode not included in enumerable 'modes', it's an error
    if(!_includes(ListStore.modes, mode)) throw new Error('Selected Mode does not exist');

    this.mode = mode;

    this.addItemDb  = this.addItemDb.bind(this);
    this.fetchItems = this.fetchItems.bind(this);
  }

  /** 
   * An object describing what the header for each field should be with the keys provided respectively for each field
   * @returns {{fieldName: string}}
   */
  @computed get headers() {
    // Mode must be defined
    if(!this.mode) throw new Error('List mode was not defined during item fetching');

    return this._modeFields[this.mode].headers;
  }
  
  /** 
   * A Table shall have a total amount of columns, usually depending on the amount of headers
   * @returns {number} Amount of columns
   */
  @computed get totalColumns() {
    // Mode must be defined
    if(!this.mode) throw new Error('List mode was not defined during item fetching');

    return this._modeFields[this.mode].totalColumns;
  }

  /**
   * The width of each column, so each column takes as much screen space as we'd like
   * @returns {Array.<number>)}
   */
  @computed get columnsWidth() {
    // Mode must be defined
    if(!this.mode) throw new Error('List mode was not defined during item fetching');
    
    return this._modeFields[this.mode].columnsWidth;
  }

  /** 
   * Some columns may be computed by other fields or other factors
   * @returns {{fieldName: function}}
   */
  @computed get functions() {
    // Mode must be defined
    if(!this.mode) throw new Error('List mode was not defined during item fetching');
    
    return this._modeFields[this.mode].functions;
  }

  /** 
   * The type of each field provided for operations like type checking or even frontend decoration for UX
   * @returns {{fieldName: type}}
   */
  @computed get dataTypes() {
    // Mode must be defined
    if(!this.mode) throw new Error('List mode was not defined during item fetching');
    
    return this._modeFields[this.mode].dataTypes;
  }

  /**
   * Some fields may be required for an item and others may not
   * @returns {{fieldName: boolean}}
   */
  @computed get requiredFields() {
    // Mode must be defined
    if(!this.mode) throw new Error('List mode was not defined during item fetching');
    
    return this._modeFields[this.mode].requiredFields;
  }


  /**
   * Which fields of an item to be editable for the user to modify
   * @returns {{fieldName: boolean}}
   */
  @computed get modifiableFields() {
    // Mode must be defined
    if(!this.mode) throw new Error('List mode was not defined during item fetching');
    
    return this._modeFields[this.mode].modifiableFields;
  }

  /** 
   * Provides the API url depending on the current 'mode' - See: 'modes' enumerable
   * @returns {string} The URL that corresponds to the current mode
   */
  @computed get rest() {
    // Mode must be defined
    if(!this.mode) throw new Error('List mode was not defined during item fetching');
    
    return this._modeFields[this.mode].rest;
  }

  /**
   * Fetches and returns the items for the current mode from the API
   * @async
   * @returns {Promise<[{fieldName: any}]>}
   */
  @action
  fetchItems() {

    return new Promise((resolve, reject) => {

      if(!this.mode) reject('List mode was not defined during item fetching');

      // API URL to make `post` request to
      const url = this.rest;

      // API get Request
      axios.get(url)
        .then(
          action("fetchItems.success", (res) => {
            resolve(res.data);
          }),
          action("fetchItems.failure", (err) => reject(err))
        );
    });
  }

  /**
   * Adds an item to the database
   * @async
   * @param {{fieldName: any}} item 
   * @returns {Promise<[{fieldName: any}]}
   */
  @action.bound
  addItemDb(item) {
        
    return new Promise((resolve, reject) => {

      if(!item) reject('Item parameter was undefined');

      // API URL to make `post` request to
      const url = this.rest;

      // API post Request
      axios.post(
        url, 
        item, 
        {withCredentials: true}
      )
        .then(
          action('addItemDb.success', (res) => {
            this.fetchItems()
              .then(
                action('addItemDb.fetchItems.success', 
                (fetchedItems) => {
                  this.items = fetchedItems
                  resolve(fetchedItems);
              }))
              .catch(
                action('addItemDb.fetchItems.success', 
                (err) => reject(err)));
            }))
        .catch(
          action('addItemDb.failure', 
          (err) => reject(err))
        );
    });
  }


  /**
   * Removes an item from the database
   * @async
   * @param {string} itemId The id of the item to remove
   * @returns {Promise<[{fieldName: any}]}
   */
  @action.bound
  removeItemDb(itemId) {
    
    return new Promise((resolve, reject) => {

      if(!itemId) reject(`Object's ID wasn't given, unable to remove item`);

      // API URL to make `delete` request to
      const url = `${this.rest}/${itemId}`;

      // API delete Request
      axios.delete(url)
        .then(value => {
          this.fetchItems()
            .then(
              action('removeItemDb.fetchItems.success'),
              (fetchedItems) => {
                this.items = fetchedItems
                resolve(fetchedItems);
            })
            .catch(
              action('removeItemDb.fetchItems.failure'),
              err => reject(err)
            );
        })
        .catch(
          action('removeItemDb.failure'),
          err => reject(err)
        );
    });
  }

  /**
   * Updates an item
   * @async
   * @function updateItemDb
   * @param {string} itemId The id of the item to update
   * @param {string} fieldName The name of the field of the item to update
   * @param {string|number} newValue The new value to be stored to the item's choosen field
   * @returns {Promise<[{fieldName: any}]} Fetched items
   */
  @action.bound
  updateItemDb(itemId, fieldName, newValue) {

    return new Promise((resolve, reject) => {

      if(!itemId) reject('Error Updating Item: itemId was undefined or null');
      if(!fieldName) reject('Error Updating Item: fieldName was undefined or null');
      if(!newValue) reject('Error Updating Item: newValue was undefined or null');

      // API URL to make `put` request to
      const url = `${this.rest}/${itemId}?${fieldName.toLowerCase()}=${newValue}`;

      // API put Request
      axios.put(url)
        .then(
          action('updateItemDb.success'),
          (value) => resolve(value)
        )
        .catch(
          action('updateItemDb.failure'),
          err => reject(err)
        );
    });
  }

  /**
   * Filters the `items` object with the `itemFilterCallback` observable function
   * @returns {[{fieldName: (string|number)}]} Filtered Items
   */
  @computed get filteredItems() {
    return _filter(this.items, this.itemFilterCallback);
  }

  /**
   * Provides all the item's keys without the functions
   * @returns {Array.<string>} Key names
   */
  @computed get objectKeys() {
    // Current mode's item's keys
    const headerKeys = Object.keys(this._modeFields[this.mode].headers)

    // Filtering out the functions
    return _filter(headerKeys, (header) => {
      return !this.isFieldFunction(header);
    });
  }

  /**
   * A Function which is provided for a specific field
   * Currently exists in `Products` items with the key of `total`
   * @param {Array.<number>} array 
   */
  sum(array) {
    // Summing up all the numbers, type-safe
    return _reduce(array, (total, n) => {
      n = !n ? 0 : n;
      return Number(total) + Number(n);
    });
  }
}