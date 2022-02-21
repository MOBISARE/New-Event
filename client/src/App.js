import React from 'react'
import Test from './components/test/Test'

class App extends React.Component {
  render() {
    return(
      <div>
        <h1 className='text-cyan-500'>App</h1>
        <Test/>
      </div>
    );
  };
}

export default App;
