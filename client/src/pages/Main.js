import React from 'react';

import EventCard from '../components/EventCard'

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
            <div className='text-center flex flex-col items-center max-w-[1000px] mx-auto'>
                <div className='bg-gray h-screen w-screen fixed -z-50'>
                    <img src='/images/blob1.svg'
                         className='fixed top-0 right-0 w-2/5' alt=''/>
                    <img src='/images/blob2.svg'
                         className='fixed bottom-0 left-0 w-2/5' alt=''/>
                </div>

                <h1 className='font-bold text-7xl mt-24'>Rechercher un
                    <div className='font-black text-transparent bg-clip-text bg-gradient-to-r from-purple to-blue'>
                        événement</div>
                </h1>

                <div className='relative bg-white w-full rounded-full h-14 flex items-center p-2 mt-10 text-2xl border border-transparentgray'
                     id='searchbar'>
                    <button className='flex'>
                        <span className="material-icons text-4xl text-transparentgray">
                            search
                        </span>
                    </button>
                    <input placeholder='Anniversaire de...' onFocus={handlerFocusSearchbar} onBlur={handlerFocusSearchbar}
                           className='flex-grow focus:outline-none ml-2 placeholder:text-transparentgray'/>
                    <button className='flex' onClick={
                        () => document.getElementById('advanced-searchbar').classList.toggle('hidden')
                    }>
                        <span className="material-icons text-4xl text-transparentgray">
                            manage_search
                        </span>
                    </button>

                    <div id='advanced-searchbar'
                         className='hidden absolute top-[3.2rem] left-0 right-0 bg-white rounded-b-xl mx-4 p-4 text-base flex flex-wrap border border-t-0 border-transparentgray'>
                        <div className='flex content-center mr-4 mb-2'>
                            <span className='mr-2'>Dates : </span>
                            <input className='h-7 rounded-full pt-1 pr-0 w-32' type='date'/>
                            <span className='mx-2'> -- </span>
                            <input className='h-7 rounded-full pt-1 pr-0 w-32' type='date'/>
                        </div>
                        <div className='flex content-center'>
                            <span className='mr-2'>Ville : </span>
                            <input className='h-7 rounded-full pt-1 pr-0 min-w-32'
                                   placeholder='Nancy' type='text'/>
                        </div>
                    </div>
                </div>

                <div className='flex flex-wrap flex-row justify-center w-full mx-14 xl:mx-80'>
                    <div className='mt-14 w-full text-right mr-14'>
                        <span>Tri : </span>
                        <select className='rounded-full h-8 py-0'>
                            <option>Populaire</option>
                            <option>Récent</option>
                        </select>
                    </div>
                    { eventCards }
                </div>
            </div>
        );
    }
}

export default Main;
