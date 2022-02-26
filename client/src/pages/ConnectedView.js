import React from 'react';

import {Outlet, Link} from "react-router-dom"

class ConnectedView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentPage: "accueil"}
    }

    render(){
        return(
            <div>
                <nav className='container fixed h-16 p-2 px-5 max-w-full flex justify-between bg-white shadow-md z-50'>
                    <Link to='/'><img className='object-cover h-full' src='/images/Logo.png' alt='Logo newEvent'/></Link>
                    <div className='flex gap-5 items-center'>
                        <Link to='/accueil' className={'font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple_gradient to-blue'}>
                            Accueil</Link>
                        <Link to='/mes-evenements' className='whitespace-nowrap'>
                            Mes événements</Link>
                        <Link to='/a-propos' className='whitespace-nowrap'>
                            A propos</Link>

                        <button className='bg-darkgray rounded-lg w-12 h-10'>
                            <span className="material-icons text-white">
                                person
                            </span>
                        </button>
                        <button className='bg-darkgray rounded-lg w-12 h-10'>
                            <span className="material-icons text-white">
                                notifications
                            </span>
                        </button>
                    </div>
                </nav>

                <Outlet/>
            </div>
        );
    }
}

export default ConnectedView;
