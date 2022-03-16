import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import NotificationDropDown from './NotificationDropDown';
import ProfilDropDown from './ProfilDropDown';


class Navbar extends React.Component {

    constructor(props){
        super(props);
        this.profilDropDown = React.createRef();
        this.notificationDropDown = React.createRef();

        this.profilButton = React.createRef();
        this.notificationButton = React.createRef();
    }


    render(){

        var activeNavLink = 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple to-blue '

        return(
            <nav className='fixed container h-16 p-2 px-5 max-w-full flex justify-between bg-white shadow-md z-50'>
                <Link to='/' className='flex items-end gap-1'><img className='object-cover h-full py-1' src='/images/icon.png' alt='Logo newEvent'/><span className='text-4xl font-logo font-black leading-7'>newEvent</span></Link>
                <div className='flex gap-16'>
                    <div className='flex gap-12 items-center'>
                        <NavLink id='link-mainpage' to='/' 
                            className={({isActive}) => 'whitespace-nowrap text-lg ' + (isActive ? activeNavLink : '')} 
                            children={ ({isActive}) => { return isActive 
                                ? (<div className='flex justify-center'>Accueil<div className='h-1 w-12 bg-gradient-to-r from-purple to-blue absolute bottom-0'></div></div>) 
                                : (<div>Accueil</div>) 
                            }
                        }>
                        </NavLink>
                        <NavLink id='link-myevents' to='/mes-evenements' 
                            className={({isActive}) => 'whitespace-nowrap text-lg ' + (isActive ? activeNavLink : '')} 
                            children={ ({isActive}) => { return isActive 
                                ? (<div className='flex justify-center'>Mes événements<div className='h-1 w-24 bg-gradient-to-r from-purple to-blue absolute bottom-0'></div></div>) 
                                : (<div>Mes événements</div>) 
                            }
                        }>
                        </NavLink>
                        <NavLink id='link-about' to='/a-propos' 
                            className={({isActive}) => 'whitespace-nowrap text-lg ' + (isActive ? activeNavLink : '')} 
                            children={ ({isActive}) => { return isActive 
                                ? (<div className='flex justify-center'>A propos<div className='h-1 w-12 bg-gradient-to-r from-purple to-blue absolute bottom-0'></div></div>) 
                                : (<div>A propos</div>) 
                            }
                        }>
                            
                        </NavLink>
                    </div>

                    <div className='flex gap-5 items-center'>
                        <div className='relative'>
                            <button className='bg-darkgray rounded-lg w-10 h-10' onClick={() => {this.profilDropDown.current.toggleActive();}} ref={this.profilButton}>
                            <span className="material-icons text-4xl text-white">
                                person
                            </span>
                            </button>
                            <ProfilDropDown compRef={this.profilDropDown} button={this.profilButton}/>
                        </div>
                        
                        <div className='relative'>
                            <button className='bg-darkgray rounded-lg w-10 h-10' onClick={() => {this.notificationDropDown.current.toggleActive();}} ref={this.notificationButton}>
                            <span className="material-icons text-4xl text-white">
                                notifications
                            </span>
                            </button>
                            <NotificationDropDown ref={this.notificationDropDown} button={this.notificationButton}/>
                        </div>
                    </div>
                </div>
                
            </nav>
        );
    }
}

export default Navbar;
