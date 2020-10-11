import React from 'react';

import FixtureGrid from './Screens/FixtureGrid/FixtureGrid';

class App extends React.Component{
  render() {
    document.title = "Lighting system tool"
    return (  
      <FixtureGrid />
      )
  }
}



export default App;
