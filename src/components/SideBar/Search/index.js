/**
 * Search Component to search for a specific item from #ListStore storage
 * 
 */

// Dependencies
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import './style.scss';

@inject('listStore')
@observer
export default class Search extends Component {
  constructor(props) {
    super(props);
    
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    // Default filtering function to display all the items
    this.props.listStore.itemFilterCallback = ((value) => true);
  }

  /**
   * Handler when the Search Textbox changes - Updates the table's items
   * @param {Event} event 
   */
  handleSearchChange(event) {
    event.preventDefault();
    // Escape function to remove any escape characters from the user's string - BUG prevention    
    RegExp.escape = function(string) {
      return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

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
      <form action="/search" className="search w-form" onSubmit={e => { e.preventDefault(); }}>
        <input 
          type="search" 
          className="search-input w-input" 
          maxLength="256" name="query" 
          placeholder="Search…" 
          id="search" 
          required=""
          onChange={this.handleSearchChange}
          />
      </form>
    );
  }
}
