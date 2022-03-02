import React from 'react';
import {Outlet, Link} from "react-router-dom"

function Notification() {
    return(
        <div>
            <p>Contenu de la notification</p>

        </div>
    )
}

function ConnectedView() {

    return(
        <div>
            <nav className='container h-16 p-2 px-5 max-w-full xl:px-64 flex justify-between bg-white shadow-md z-50'>
                <Link to='/'><img className='object-cover h-full' src='/images/Logo.png' alt='Logo newEvent'/></Link>
                <div className='flex gap-5 items-center'>
                    <Link id='link-mainpage' to='/' className={' font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple to-blue'}>
                        Accueil</Link>
                    <Link id='link-myevents' to='/mes-evenements' className='whitespace-nowrap'>
                        Mes événements</Link>
                    <Link id='link-about' to='/a-propos' className='whitespace-nowrap'>
                        A propos</Link>

                    <div className='relative'>
                        <button className='bg-darkgray rounded-lg w-10 h-10'
                                onClick={ () => {
                                    document.getElementById('dropdown-account').toggleAttribute("hidden")
                                    document.getElementById('dropdown-notifications').hidden = true
                                }}>
                        <span className="material-icons text-4xl text-white">
                            person
                        </span>
                        </button>
                        <div id='dropdown-account' className='text-left bg-white absolute right-0 drop-shadow-2xl border' hidden>
                            <h6 className='px-3 mt-2 hover:bg-gray'>Mon profil</h6>
                            <Link to='/mes-evenements' className='inline-block h-6 px-3 mb-1 whitespace-nowrap hover:bg-gray'>Mes événements</Link>
                            <hr className='m-1'/>
                            <h6 className='px-3 mt-1 mb-2 hover:bg-gray'>Déconnexion</h6>
                        </div>
                    </div>
                    <div className='relative'>
                        <button className='bg-darkgray rounded-lg w-10 h-10'
                                onClick={ () => {
                                    document.getElementById('dropdown-notifications').toggleAttribute("hidden")
                                    document.getElementById('dropdown-account').hidden = true
                                }}

                        >
                        <span className="material-icons text-4xl text-white">
                            notifications
                        </span>
                        </button>
                        <div id='dropdown-notifications' className='text-left bg-white absolute right-0 drop-shadow-2xl border' hidden>
                            <Notification/>
                        </div>
                    </div>
                </div>
            </nav>

            <div className='mx-10 xl:mx-64'>
                <Outlet/>
            </div>
        </div>
    )
}

export default ConnectedView;
