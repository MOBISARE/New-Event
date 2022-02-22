import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

class App extends React.Component {
  render() {
    return(
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
    );
  };
}

export default App;
