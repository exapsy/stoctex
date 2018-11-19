/**
 * Main component for the Application
 * 
 */

// Dependencies
import React, { Component } from 'react';
import MobxDevTools         from 'mobx-react-devtools';
import ErrorBoundary from './components/ErrorBoundary';
import SceneSelector from './scenes/SceneSelector';
import { Provider } from 'mobx-react';
import UserStore from './stores/UserStore';
import './semantic/dist/semantic.min.css';
import './css/normalize.css';
import './css/webflow.css';


class App extends Component {
  render() {
    return (
      <div className="app">
        <Provider userStore={new UserStore()}>
          <ErrorBoundary>
            <SceneSelector/>
            {process.env.NODE_ENV === 'production' ? null : <MobxDevTools/>}
          </ErrorBoundary>
        </Provider>
      </div>
    );
  }
}

export default App;
