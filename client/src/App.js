import React from 'react'
import {Routes, Route, Link} from 'react-router-dom'

import axios from 'axios';
import { UidContext } from "./AppContext";

import Home from './pages/guest/Home'
import Login from './pages/guest/Login';
import Register from './pages/guest/Register';
import LostPassword from './pages/guest/LostPassword'

import UserProfile from './pages/profile/UserProfile';
import ModifyProfile from './pages/profile/ModifyProfile';
import Profil from './pages/profile/Profil';

import Main from './pages/Main'
import About from './pages/About'
import MyEvents from './pages/MyEvents'
import Navbar from './components/Header/Navbar';
import Error from './pages/Error'
import EventContainer from './pages/event/EventContainer'
import LinkButton from "./components/LinkButton";

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
                        <Route path='*' element={<div>
                            <div className='container fixed h-16 p-2 px-5 max-w-full flex justify-between bg-white shadow-md z-50'>
                                <Link to='/' id='logo-link' className='flex items-end gap-1'><img className='object-cover h-full py-1' src='/images/icon.png' alt='Logo newEvent'/><span className='text-4xl font-logo font-black leading-7'>newEvent</span></Link>

                                <div className='flex gap-5 items-center'>
                                    <LinkButton bg_class='bg-blue' text_class='text-gray' to='/inscription'>Inscription</LinkButton>
                                    <LinkButton bg_class='bg-darkgray' text_class='text-gray' to='/connexion'>Connexion</LinkButton>
                                </div>

                            </div><div className='py-24'><Error/></div></div>}/>
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
                                <Route path='mon-profil' element={<UserProfile/>} />
                                <Route path='modifier-profil' element={<ModifyProfile/>}/>
                                <Route path='profil/:email' element={<Profil/>}/>
                                <Route path='*' element={<Error/>}/>
                            </Routes>
                        </div>
                    </div>
                </UidContext.Provider>
            );
        }
    };
}

export default App;
