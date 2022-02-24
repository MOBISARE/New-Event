import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login';
import Register from './pages/Register';

class App extends React.Component {
  render() {
    return(
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/connexion' element={<Login/>} />
        <Route path='/inscription' element={<Register/>} />
      </Routes>
    );
  };
}

export default App;
