import React, { Component } from 'react';

// LOCAL IMPORTS
import SceneSelector from './scenes/SceneSelector';
import './semantic/dist/semantic.min.css';
import './css/normalize.css';
import './css/webflow.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SceneSelector/>
      </div>
    );
  }
}

export default App;
