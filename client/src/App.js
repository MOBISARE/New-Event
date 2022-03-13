import React from 'react'
import { Routes, Route } from 'react-router-dom'

import axios from 'axios';
import { UidContext } from "./AppContext";

import Home from './pages/guest/Home'
import Login from './pages/guest/Login';
import Register from './pages/guest/Register';
import LostPassword from './pages/guest/LostPassword'

import UserProfile from './pages/profile/UserProfile';
import ModifyProfile from './pages/profile/ModifyProfile';

import Main from './pages/Main'
import About from './pages/About'
import MyEvents from './pages/MyEvents'
import Navbar from './components/Header/Navbar';
import Error from './pages/Error'
import EventContainer from './pages/event/EventContainer';

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {uid:'', isLoaded: false};
    }

    async componentDidMount() {
        try {
            let res = await axios({
                method: "get",
                url: '/api/jwtid',
                withCredentials: true,
            })
            this.setState({uid : res.data, isLoaded: true});
        }
        catch (err) {
            console.log(err);
            this.setState({isLoaded: true});
        }
    }

    render() {
        if(!this.state.isLoaded) return ( <></> );

        if (this.state.uid === '') {
            return (
                <UidContext.Provider value={this.state.uid}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/connexion' element={<Login />} />
                        <Route path='/inscription' element={<Register />} />
                        <Route path='/reinitialisation-mot-de-passe' element={<LostPassword />} />
                    </Routes>
                </UidContext.Provider>
            )
        } else {
            return (
                <UidContext.Provider value={this.state.uid}>
                <div className='bg-gray w-full min-h-screen h-full'>
                    <Navbar/>
                    <div className='py-24 px-16 max-w-[1300px] mx-auto'>
                        <Routes>
                            <Route path='/' element={<Main/>}/>
                            <Route path='a-propos' element={<About/>}/>
                            <Route path='mes-evenements' element={<MyEvents/>}/>
                            <Route path='evenement/:id' element={<EventContainer/>}/>
                            <Route path='*' element={<Error/>}/>
                            <Route path='mon-profil' element={<UserProfile/>} />
                            <Route path='modifier-profil' element={<ModifyProfile/>}/>
                        </Routes>
                    </div>

                    </div>
                </UidContext.Provider>
            );
        }
    };
}

export default App;
