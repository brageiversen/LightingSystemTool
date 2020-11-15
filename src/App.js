import React from 'react';

import GLMainWrapper from './Screens/Main/GLMainWrapper';

class App extends React.Component{
  render() {
    document.title = "Lighting system tool"
    return (  
      <GLMainWrapper />
      )
  }
}



export default App;
