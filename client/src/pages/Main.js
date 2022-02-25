import React from 'react';

import EventCard from '../components/EventCard'


function handlerFocusSearchbar(ev) {
    ev.target.placeholder = (ev.target.placeholder==="")? "Anniversaire de...":""
}

class Main extends React.Component {
    render(){
        return(
            <div>
                <div className='text-center flex flex-col items-center'>
                    <div className='bg-gray h-screen w-screen fixed -z-50'>
                        <img src='/images/blob1.svg'
                             className='absolute top-0 right-0' alt=''/>
                        <img src='/images/blob2.svg'
                             className='absolute bottom-0 left-0' alt=''/>
                    </div>

                    <h1 className='font-bold text-6xl mt-36'>Rechercher un
                        <div className='text-transparent bg-clip-text bg-gradient-to-r from-purple_gradient to-blue'>
                            événement</div>
                    </h1>

                    <div className='bg-white w-1/2 rounded-full h-10 flex items-center p-4 mt-10'>
                    <span className="material-icons">
                        search
                    </span>
                        <input placeholder='Anniversaire de...' onFocus={handlerFocusSearchbar} onBlur={handlerFocusSearchbar}
                               className='flex-grow focus:outline-none'/>
                        <span className="material-icons">
                        manage_search
                    </span>
                    </div>

                    <div className='mt-14 right-0'>
                        <span>Tri : </span>
                        <select className='rounded-full'>
                            <option>Populaire</option>
                            <option>Récent</option>
                        </select>
                    </div>

                    <div className='flex flex-wrap flex-row justify-center'>
                        <EventCard/>
                        <EventCard/>
                        <EventCard/>
                        <EventCard/>
                        <EventCard/>
                        <EventCard/>
                        <EventCard/>
                        <EventCard/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;
