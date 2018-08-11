import React, { Component } from 'react';
import { Provider }         from 'mobx-react';
import DevTools from 'mobx-react-devtools';

// LOCAL IMPORTS
import SceneSelector from './scenes/SceneSelector';
import ListStore from './stores/ListStore';
import './semantic/dist/semantic.min.css';
import './css/normalize.css';
import './css/webflow.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider listStore={new ListStore(ListStore.modes.PRODUCTS)}>
            <SceneSelector/>
            <DevTools/>
        </Provider>
      </div>
    );
  }
}

export default App;
