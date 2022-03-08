import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import NotificationDropDown from './NotificationDropDown';
import ProfilDropDown from './ProfilDropDown';


class Navbar extends React.Component {

    constructor(props){
        super(props);
        this.profilDropDown = React.createRef();
        this.notificationDropDown = React.createRef();
    }


    render(){

        var activeNavLink = 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple to-blue'

        return(
            <nav className='fixed container h-16 p-2 px-5 max-w-full xl:px-64 flex justify-between bg-white shadow-md z-50'>
                <Link to='/'><img className='object-cover h-full' src='/images/Logo.png' alt='Logo newEvent'/></Link>
                <div className='flex gap-5 items-center'>
                    <NavLink id='link-mainpage' to='/' className={({isActive}) => 'whitespace-nowrap ' + (isActive ? activeNavLink : '')}>
                        Accueil
                    </NavLink>
                    <NavLink id='link-myevents' to='/mes-evenements' className={({isActive}) => 'whitespace-nowrap ' + (isActive ? activeNavLink : '')}>
                        Mes événements
                    </NavLink>
                    <NavLink id='link-about' to='/a-propos' className={({isActive}) => 'whitespace-nowrap ' + (isActive ? activeNavLink : '')}>
                        A propos
                    </NavLink>

                    <div className='relative'>
                        <button className='bg-darkgray rounded-lg w-10 h-10' onClick={() => {this.profilDropDown.current.toggleActive();}}>
                        <span className="material-icons text-4xl text-white">
                            person
                        </span>
                        </button>
                        <ProfilDropDown ref={this.profilDropDown}/>
                    </div>
                    
                    <div className='relative'>
                        <button className='bg-darkgray rounded-lg w-10 h-10' onClick={() => {this.notificationDropDown.current.toggleActive();}}>
                        <span className="material-icons text-4xl text-white">
                            notifications
                        </span>
                        </button>
                        <NotificationDropDown ref={this.notificationDropDown} />
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;
