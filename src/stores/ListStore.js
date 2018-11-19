/**
 * Store for a list of items to provide to other components (Like #Table)
 * Provides different kind of services, 
 * like item refresher to refetch items from the database, 
 * item adder to add an item in the database and other such capabilities
 * 
 */

// Dependencies
import { 
  computed, 
  action, 
  observable,
  reaction,
}               from 'mobx';
import axios    from 'axios';
import _includes from 'lodash/includes';
import _filter from 'lodash/filter';
import _findIndex from 'lodash/findIndex';
import _reduce from 'lodash/reduce';
import api from '../config/api';

/**
 * Stores and Retrieves List data through and from the API
 */
export default class ListStore {
  /**
   * 
   * @param {string} mode The type of model for the list to retrieve
   * @memberof ListStore
   */
  constructor(mode) {
    if(!_includes(ListStore.modes, mode)) this.triggerError('Selected Mode does not exist');

    this.mode = mode;

    // Fetch items and set them to `items`
    this.fetchItems()
      .then(value => {
        this.items = value;
      })
      .catch(err => { this.triggerError(`Error while fetching items ${err}`)});
  }

  /**
   * Stores the UserStore state
   * Important when needed to send author information of the database updates
   *
   * @memberof ListStore
   */

  /** All the items to be fetched to the list, unfiltered */
  @observable items = [];
  
  /** The current page of the filtered items */
  @observable currentPage = 1;

  @observable itemsPerPage = 12;

  /** Editable observable function provided, for the filters to be modifiable however it is desired */
  @observable itemFilterCallback = () => true;

  /** Provides an enumerable from 'modes' freezed variable, which describes what type of items the ListStore provides */
  @observable mode;


  /** Error Catch for ErrorBoundary parent component */
  @observable errorBoundary = {
    hasError : false,
    error    : null
  };
  errorReaction = reaction(
    () => this.errorBoundary,
    (hasError, error) => { if(hasError) throw new Error(error); }
  );

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
        gs:      'ΑΠ1',
        corfu:   'KE1',
        cclit:   'CC',
        gp_k:    'MA1',
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
        barcode: false,
        name:    true,
        gs:      true,
        corfu:   true,
        cclit:   true,
        gp_k:    true
      },
      modifiableFields: {
        code1:   true,
        code2:   true,
        barcode: true,
        name:    true,
        gs:      true,
        corfu:   true,
        cclit:   true,
        gp_k:    true
      },
      api: api.v1.http.products
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
      api: api.v1.http.customers
    },
    couriers: {
      headers: {
        name: 'Couriers', 
        email: 'Email', 
        phone: 'Phone'
      },
      api: api.v1.http.couriers
    }
  });

  /** 
   * An object describing what the header for each field should be with the keys provided respectively for each field
   * @returns {{fieldName: string}}
   * @memberof ListStore
   */
  @computed get headers() {
    if(!this.mode) this.triggerError('List mode was not defined during item fetching');

    return this._modeFields[this.mode].headers;
  }
  
  /** 
   * A Table shall have a total amount of columns, usually depending on the amount of headers
   * @returns {number} Amount of columns
   * @memberof ListStore
   */
  @computed get totalColumns() {
    if(!this.mode) this.triggerError('List mode was not defined during item fetching');

    return this._modeFields[this.mode].totalColumns;
  }

  /**
   * The width of each column, so each column takes as much screen space as we'd like
   * @returns {Array.<number>)}
   * @memberof ListStore
   */
  @computed get columnsWidth() {
    if(!this.mode) this.triggerError('List mode was not defined during item fetching');
    
    return this._modeFields[this.mode].columnsWidth;
  }

  /** 
   * Some columns may be computed by other fields or other factors
   * @returns {{fieldName: function}}
   * @memberof ListStore
   */
  @computed get functions() {
    if(!this.mode) this.triggerError('List mode was not defined during item fetching');
    
    return this._modeFields[this.mode].functions;
  }

  /** 
   * The type of each field provided for operations like type checking or even frontend decoration for UX
   * @returns {{fieldName: type}}
   */
  @computed get dataTypes() {
    if(!this.mode) this.triggerError('List mode was not defined during item fetching');
    
    return this._modeFields[this.mode].dataTypes;
  }

  /**
   * Some fields may be required for an item and others may not
   * @returns {{fieldName: boolean}}
   * @memberof ListStore
   */
  @computed get requiredFields() {
    if(!this.mode) this.triggerError('List mode was not defined during item fetching');
    
    return this._modeFields[this.mode].requiredFields;
  }


  /**
   * Which fields of an item to be editable for the user to modify
   * @returns {{fieldName: boolean}}
   * @memberof ListStore
   */
  @computed get modifiableFields() {
    if(!this.mode) this.triggerError('List mode was not defined during item fetching');
    
    return this._modeFields[this.mode].modifiableFields;
  }

  /** 
   * Provides the API url depending on the current 'mode' - See: 'modes' enumerable
   * @returns {string} The URL that corresponds to the current mode
   * @memberof ListStore
   */
  @computed get api() {
    if(!this.mode) console.log('List mode was not defined during item fetching');
    
    return this._modeFields[this.mode].api;
  }

  /**
   * Fetches the items from the API
   * 
   * @memberof ListStore
   */
  @action.bound
  refreshItems() {
    setTimeout(
      () => this.fetchItems()
      .then(fetchedItems => {
        this.items = fetchedItems;
      }),
      10
    )
  }

  /**
   * Fetches and returns the items for the current mode from the API
   * @async
   * @returns {Promise<[{fieldName: any}]>}
   * @memberof ListStore
   */
  @action
  fetchItems() {

    return new Promise((resolve, reject) => {

      // API URL to make `post` request to
      const url = this.api;

      axios.get(url, { withCredentials: true })
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
   * @memberof ListStore
   */
  @action.bound
  addItemDb(item) {
        
    return new Promise((resolve, reject) => {

      if(!item) reject('Item parameter was undefined');

      const url = this.api;

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
                  this.items = fetchedItems;
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
   * @memberof ListStore
   */
  @action.bound
  removeItemDb(itemId) {
    
    return new Promise((resolve, reject) => {

      if(!itemId) reject(`Object's ID wasn't given, unable to remove item`);

      const url = `${this.api}/${itemId}`;

      axios.delete(
        url,
        {withCredentials: true}
      )
        .then(value => {
          this.fetchItems()
              .then(
                action('removeItemDb.fetchItems.success', 
                (fetchedItems) => {
                  this.items = fetchedItems;
                  resolve(fetchedItems);
              }))
            .catch(
              action('removeItemDb.fetchItems.failure',
              err => reject(err)
            ));
        })
        .catch(
          action('removeItemDb.failure',
          err => reject(err)
        ));
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
   * @memberof ListStore
   */
  @action.bound
  updateItemDb(itemId, fieldName, newValue) {

    return new Promise((resolve, reject) => {

      if(!itemId) reject('Error Updating Item: itemId was undefined or null');
      if(!fieldName) reject('Error Updating Item: fieldName was undefined or null');
      if(!newValue) resolve('Acceptable but item not updated - New Value is null or undefined');

      const updatedItemIndex = _findIndex(this.items, {_id: itemId})
      this.items[updatedItemIndex][fieldName] = newValue;

      const url = `${this.api}/${itemId}?${fieldName.toLowerCase()}=${newValue}`;

      axios(
        {
          method: 'put',
          url, 
          withCredentials: true
        })
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
   * @memberof ListStore
   */
  @computed get filteredItems() {
    return _filter(this.items, this.itemFilterCallback);
  }

  /**
   * Filters the `items` object with the `itemFilterCallback` observable function and then places them in a page accordinge to the page rules
   * @returns {[{fieldName: (string|number)}]} Filtered Items
   * @memberof ListStore
   */
  @computed get filteredPagedItems() {
    
    // Slicing filtered items to match the current page
    const sliceStart = (this.currentPage-1)* this.itemsPerPage
    const sliceEnd   = (this.currentPage-1) * this.itemsPerPage + this.itemsPerPage;

    return _filter(this.items, this.itemFilterCallback).slice(sliceStart, sliceEnd);
  }

  @computed get totalPages() {
    const totalPages = Math.floor(this.filteredItems.length / this.itemsPerPage)+1;
    return Number(totalPages);
  }

  /**
   * Sets the page of the filtered items
   *
   * @memberof ListStore
   */
  @action setPage(page) {
    // if(!Number(page)) return;
    if(page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /**
   * Provides all the item's keys without the functions
   * @returns {Array.<string>} Key names
   * @memberof ListStore
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
   * Changes the class' error state to active
   *
   * @param {*} error The error to be triggered
   * @memberof ListStore
   */
  @action
  triggerError(error) {
    this.errorBoundary.hasError = true;
    this.errorBoundary.error = error;
  }

  /**
   * A Function which is provided for a specific field
   * Currently exists in `Products` items with the key of `total`
   * @param {Array.<number>} array 
   * @memberof ListStore
   */
  sum(array) {
    return _reduce(array, (total, n) => {
      n = !n ? 0 : n;
      return Number(total) + Number(n);
    });
  }
}