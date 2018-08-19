import * as React from 'react';
import './App.css';

class App extends React.Component<{}> {
  public render() {
    return (
      <div className="container-fluid">
      <div className="centreText">
        {/* React components must have a wrapper node/element */}
        <h1>Home</h1>
      </div>
    </div>
    );
  }
}

export default App;
