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
import Event from './pages/Event'
import CreateEvent from './pages/CreateEvent'
import Navbar from './components/Header/Navbar';
import Error from './pages/Error'

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {uid:''};
    }

    async componentDidMount() {
        try {
            let res = await axios({
                method: "get",
                url: `/api/jwtid`,
                withCredentials: true,
            })
            this.setState({uid : res.data});
        }
        catch (err) {
            console.log(err);
        }
    }

    componentDidUpdate() {
        console.log("update")
    }

    render() {
        if (this.state.uid === '') {
            return (
                <UidContext.Provider value={this.uid}>
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
                <UidContext.Provider value={this.uid}>
                <div className='bg-gray w-full min-h-screen h-full'>
                    <Navbar/>
                    <div className='py-24 px-16 max-w-[1300px] mx-auto'>
                        <Routes>
                            <Route path='/' element={<Main/>}/>
                            <Route path='a-propos' element={<About/>}/>
                            <Route path='mes-evenements' element={<MyEvents/>}/>
                            <Route path='evenement/:id' element={<Event/>}/>
                            <Route path='creer-evenement' element={<CreateEvent/>} />
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
