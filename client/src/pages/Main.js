import React from 'react';

import EventCard from '../components/EventCard'
import InputField from '../components/InputField'

let fakeEvents = [
    {
        id:1,
        title:"Titre d'événement",
        description:"Description de cet événement",
        imgUrl:"/images/icon.png",
        membersNumber:"5",
        location:"Nancy",
        startDate:"26/02/2020",
        endDate:"31/08/2020"
    },
    {
        id:2,
        title:"Titre d'événement",
        description:"Description de cet événement",
        imgUrl:"/images/icon.png",
        membersNumber:"5",
        location:"Nancy",
        startDate:"26/02/2020",
        endDate:"31/08/2020"
    },
    {
        id:3,
        title:"Titre d'événement",
        description:"Description de cet événement",
        imgUrl:"/images/icon.png",
        membersNumber:"5",
        location:"Nancy",
        startDate:"26/02/2020",
        endDate:"31/08/2020"
    }
]

function handlerFocusSearchbar(ev) {
    ev.target.placeholder = (ev.type==="blur")? "Anniversaire de...":""
}

class Main extends React.Component {
    render(){
        let events = fakeEvents
        const eventCards = events.map(value =>
            <EventCard
                key={value.id}
                title={value.title}
                description={value.description}
                imgUrl={value.imgUrl}
                membersNumber={value.membersNumber}
                location={value.location}
                startDate={value.startDate}
                endDate={value.endDate}
            />
        )

        return(
            <div className='text-center flex flex-col items-center'>
                <div className='bg-gray h-screen w-screen fixed -z-50'>
                    <img src='/images/blob1.svg'
                         className='absolute top-0 right-0 w-2/5' alt=''/>
                    <img src='/images/blob2.svg'
                         className='absolute bottom-0 left-0 w-2/5' alt=''/>
                </div>

                <h1 className='font-bold text-6xl mt-36'>Rechercher un
                    <div className='text-transparent bg-clip-text bg-gradient-to-r from-purple to-blue'>
                        événement</div>
                </h1>

                <div className='relative bg-white w-1/2 max-w-xl rounded-full h-10 flex items-center p-4 mt-10'>
                    <button className='flex'>
                        <span className="material-icons">
                            search
                        </span>
                    </button>
                    <input placeholder='Anniversaire de...' onFocus={handlerFocusSearchbar} onBlur={handlerFocusSearchbar}
                           className='flex-grow focus:outline-none ml-2'/>
                    <button className='flex' onClick={
                        () => document.getElementById('advanced-searchbar').classList.toggle('hidden')
                    }>
                        <span className="material-icons">
                            manage_search
                        </span>
                    </button>

                    <div id='advanced-searchbar'
                         className='hidden absolute top-10 left-0 right-0 bg-white rounded-b-xl mx-4 p-2 drop-shadow flex'>
                        <InputField className='w-32'>A partir du</InputField>
                        <InputField className='w-32'>Jusqu'au</InputField>
                        <InputField className='w-32'>Ville</InputField>
                    </div>
                </div>

                <div className='mt-14 right-0'>
                    <span>Tri : </span>
                    <select className='rounded-full'>
                        <option>Populaire</option>
                        <option>Récent</option>
                    </select>
                </div>

                <div className='flex flex-wrap flex-row justify-center mx-14 xl:mx-80'>
                    { eventCards }
                </div>
            </div>
        );
    }
}

export default Main;
