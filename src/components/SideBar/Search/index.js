import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

// LOCAL IMPORTS
import './style.scss';

@inject('listStore')
@observer
export default class Search extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // Default filtering function to display all the items
    this.props.listStore.itemFilterCallback = ((value) => true);
  }

  /**
   * Handler when the Search Textbox changes - Updates the table's items
   * @param {Event} event 
   */
  handleChange(event) {
    // Escape function to remove any escape characters from the user's string - BUG prevention    
    RegExp.escape = function(string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    };

    // Regex object
    const searchRegex = new RegExp(RegExp.escape(event.target.value), 'i');

    // Changing the filter function in the listStore, in order to update the newly filtered items
    this.props.listStore.itemFilterCallback = ((value, index) => {

      // Regex Testing/Searching on fields: code1, barcode, name, code2
      return searchRegex.test(value.code1) 
      || searchRegex.test(value.barcode)
      || searchRegex.test(value.name)
      || searchRegex.test(value.code2);
    });
  }

  render() {
    return (
      <form action="/search" className="search w-form">
        <input 
          type="search" 
          className="search-input w-input" 
          maxLength="256" name="query" 
          placeholder="Search…" 
          id="search" 
          required=""/>
      </form>
    )
  }
}
