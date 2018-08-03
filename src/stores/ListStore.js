// APIs & LIBRARIES
import { 
  computed, 
  action, 
  observable,
  reaction
}               from 'mobx';
import axios    from 'axios';
import includes from 'lodash/includes';
import filter   from 'lodash/filter';
import reduce   from 'lodash/reduce';

// LOCAL IMPORTS
import rest from '../config/rest';

/**
 * Stores and Retrieves List data through and from the API
 */
export default class ListStore {
  @observable items = [];
  
  @observable itemFilterCallback = [];

  @observable itemFilter = (value) => true;

  @observable mode;
  
  @observable listInputs = [];

  static modes = Object.freeze({
    PRODUCTS:  'products',
    COURIERS:  'couriers',
    CUSTOMERS: 'customers'
  });

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
      // totalColumns: 16,
      // columnsWidth: [2, 2, 2, 4, 1, 1, 1, 1, 2],
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
        code2:   false,
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
   * @param {this.modes} mode The type of model for the list to retrieve
   */
  constructor(mode) {
    if(!includes(ListStore.modes, mode)) throw new Error('Selected Mode does not exist');

    this.mode = mode;

    this.addItemDb  = this.addItemDb.bind(this);
    this.fetchItems = this.fetchItems.bind(this);

    this.filterItems(this.itemFilterCallback);
  }

  componentDidUpdate(prevProps, prevState) {
    reaction(
      () => this.itemFilterCallback,
      () => {
        this.filterItems(this.itemFilterCallback);
        console.log('Filtering Items');
      }
    );
  }
  

  @computed get headers() {
    if(!this.mode) throw new Error('List mode was not defined during item fetching');
    return this._modeFields[this.mode].headers;
  }
  
  @computed get totalColumns() {
    return this._modeFields[this.mode].totalColumns;
  }

  @computed get columnsWidth() {
    return this._modeFields[this.mode].columnsWidth;
  }

  @computed get functions() {
    return this._modeFields[this.mode].functions;
  }

  @computed get dataTypes() {
    return this._modeFields[this.mode].dataTypes;
  }

  @computed get requiredFields() {
    return this._modeFields[this.mode].requiredFields;
  }

  @computed get modifiableFields() {
    return this._modeFields[this.mode].modifiableFields;
  }

  @computed get rest() {
    return this._modeFields[this.mode].rest;
  }


  @action
  fetchItems() {

    return new Promise((resolve, reject) => {

      if(!this.mode) reject('List mode was not defined during item fetching');

      axios.get(this.rest)
        .then(
          action("fetchItems.success", (res) => {
            this.filterItems(this.itemFilterCallback);
            resolve(res.data);
          }),
          action("fetchItems.failure", (err) => reject(err))
        );
    });
  }

  @action.bound
  addItemDb(item) {
        
    return new Promise((resolve, reject) => {

      if(!item) reject('Item parameter was undefined');

      axios.post(this.rest, item, {withCredentials: true})
        .then(
          action('addItemDb.success', (res) => {
            this.fetchItems()
              .then(action('addItemDb.fetchItems.success', (fetchedItems) => {
                this.items = fetchedItems;
              }));

              resolve(res);
            }))
        .catch(action('addItemDb.failure', (err) => reject(err)));
    });
  }

  @action.bound
  removeItemDb(objectId) {
    
    return new Promise((resolve, reject) => {

      if(!objectId) reject(`Object's ID wasn't given, unable to remove item`);

      axios.delete(`${this.rest}/${objectId}`)
        .then(value => {
          this.fetchItems()
            .then(value => {
              this.items = value;
            })
            .catch(err => {
              reject(err);
            });

            resolve(value);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  @action.bound
  updateItemDb(itemId, valueField, newValue) {

    return new Promise((resolve, reject) => {

      if(!itemId) reject('Error Updating Item: itemId was undefined or null');
      if(!valueField) reject('Error Updating Item: valueField was undefined or null');
      if(!newValue) reject('Error Updating Item: newValue was undefined or null');

      axios.put(
        `${this.rest}/${itemId}?${valueField.toLowerCase()}=${newValue}`, 
        { crossdomain: true })
        .then(value => resolve(value))
        .catch(err => reject(err));
    });
  }

  @action.bound
  filterItems(callbackfn) {
    this.filteredItems = filter(this.items, callbackfn);
    console.log('Filtered Items', this.filteredItems);
  }

  @computed get objectKeys() {
    const headerKeys = Object.keys(this._modeFields[this.mode].headers)
    return filter(headerKeys, (header) => {
      return !this.isFieldFunction(header);
    });
  }

  sum(array) {
    return reduce(array, (total, n) => {
      n = !n ? 0 : n;
      return Number(total) + Number(n);
    });
  }
}