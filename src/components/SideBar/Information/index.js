import React, { Component } from 'react';
import { Label, Input } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import './style.scss';

@inject('listStore')
@observer
export default class Information extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hoverTranslation: {
        currentIndex: 0,
        translations: ['Hover your mouse below', 'Σύρε το ποντίκι σου από κατω']
      }
    }

    setInterval(() => {
      const { hoverTranslation } = this.state;
      if(hoverTranslation.currentIndex >= hoverTranslation.translations.length-1) {
        hoverTranslation.currentIndex = 0;
      } else {
        hoverTranslation.currentIndex++; 
      }
      this.setState({hoverTranslation});
    }, 5000);
  }

  renderHoverText() {
    const hoverTranslation = this.state.hoverTranslation.translations[this.state.hoverTranslation.currentIndex];

    return (
      <small>{hoverTranslation}</small>
    )
  }

  render() {
    let { items } = this.props.listStore;
    items = items !== null ? toJS(items) : [];
    
    let totalCost = 0;
    let totalStorageItems = 0;
    // Counting all items from all storages
    totalStorageItems = items.length > 0 ? items.reduce(
      (accumulator, currentValue) => {
        let {
          gs,
          corfu,
          cclit,
          gpk
        } = currentValue;
        gs    = !isNaN(Number(gs))    && gs    ? Number(gs)    : 0;
        corfu = !isNaN(Number(corfu)) && corfu ? Number(corfu) : 0;
        cclit = !isNaN(Number(cclit)) && cclit ? Number(cclit) : 0;
        gpk   = !isNaN(Number(gpk))   && gpk   ? Number(gpk)   : 0;
        
        return accumulator + gs + corfu + cclit + gpk;
      },
      totalStorageItems) : 0;
      // Counting total cost of all items
      totalCost = items.length > 0 ? items.reduce(
        (accumulator, currentValue) => {
          let {
            cost
          } = currentValue;
          cost = typeof(cost)    === 'number' ? cost    : 0;
  
          return accumulator + cost;
        },
        totalCost) : 0;
    // console.log('totalStorageItems: ', totalStorageItems);
    // const totalCost = items.reduce(
    //   (accumulator, currentValue) => {
    //     accumulator + currentValue.gs + currentValue.corfu + currentValue.cclit + currentValue.gp_k
    //   });
    

    return (
      <div className='information'>
        <h1>Information</h1>
        {this.renderHoverText()}
         <div className='information-flexbox'>
          <div id='total-storage-items'>
            <label className='title'>Storage</label>
            <label className='data'>{totalStorageItems}</label>
          </div>
          <div id='total-cost'>
            <label className='title'>Cost</label>
            <label className='data'>{totalCost}</label>
          </div>
        </div>
      </div>
    );
  }
}
