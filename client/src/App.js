import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/guest/Home'
import Login from './pages/guest/Login';
import Register from './pages/guest/Register';
import LostPassword from './pages/guest/LostPassword'

import Main from './pages/Main'
import About from './pages/About'
import MyEvents from './pages/MyEvents'
import ConnectedView from './pages/ConnectedView'
import Event from './pages/Event'

class App extends React.Component {
    render() {
        let connected = true
        if (!connected) {
            return (
                <Routes>
                    <Route path='/' element={<Home/>} />
                    <Route path='/connexion' element={<Login/>} />
                    <Route path='/inscription' element={<Register/>} />
                    <Route path='/reinitialisation-mot-de-passe' element={<LostPassword/>} />
                </Routes>
            )
        } else {
            return (
                <Routes>
                    <Route path='/' element={<ConnectedView/>}>
                        <Route path='' element={<Main/>}/>
                        <Route path='a-propos' element={<About/>}/>
                        <Route path='mes-evenements' element={<MyEvents/>}/>
                        <Route path='evenement' element={<Event/>}/>
                    </Route>
                </Routes>
            );
        }
    };
}

export default App;
