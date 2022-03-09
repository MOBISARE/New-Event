import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/guest/Home'
import Login from './pages/guest/Login';
import Register from './pages/guest/Register';
import LostPassword from './pages/guest/LostPassword'

import Main from './pages/Main'
import About from './pages/About'
import MyEvents from './pages/MyEvents'
import Event from './pages/Event'
import CreateEvent from './pages/CreateEvent'
import Navbar from './components/Header/Navbar';
import Error from './pages/Error'

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
                <div className='bg-gray w-screen min-h-screen h-full'>
                    <Navbar/>
                    <div className='py-24 px-16 max-w-[1300px] mx-auto'>
                        <Routes>
                            <Route path='/' element={<Main/>}/>
                            <Route path='a-propos' element={<About/>}/>
                            <Route path='mes-evenements' element={<MyEvents/>}/>
                            <Route path='evenement/:id' element={<Event/>}/>
                            <Route path='creer-evenement' element={<CreateEvent/>} />
                            <Route path='*' element={<Error/>}/>
                        </Routes>
                    </div>

                </div>
                
            );
        }
    };
}

export default App;
