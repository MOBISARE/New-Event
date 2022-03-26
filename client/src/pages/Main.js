import React from 'react';
import axios from 'axios';

import EventCard from '../components/Event/EventCard'
import LoadingEventCard from '../components/Event/LoadingEventCard';

function handlerFocusSearchbar(ev) {
    ev.target.placeholder = (ev.type==="blur")? "Anniversaire de...":""
}

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {searchedEvents: [], isSearchLoaded: false};
    }

    componentDidMount = () => {
        axios.get('/api/evenement/recherche/""')
        .then((res) => {
            this.setState({searchedEvents: res.data, isSearchLoaded: true});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    render(){
        return(
            <div className='text-center flex flex-col items-center max-w-[1000px] mx-auto'>
                <div className='bg-gray h-screen w-full absolute select-none'>
                    <img src='/images/blob1.svg'
                         className='fixed top-0 right-0 w-2/5' alt=''/>
                    <img src='/images/blob2.svg'
                         className='fixed bottom-0 left-0 w-2/5' alt=''/>
                </div>
                <div className='relative z-10'>
                    <h1 className='font-bold text-7xl mt-24'>Rechercher un
                        <div className='font-black text-transparent bg-clip-text bg-gradient-to-r from-purple to-blue w-max m-auto'>
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
                             className='hidden absolute top-[3.25rem] left-0 right-0 bg-white rounded-b-3xl mx-4 px-4 py-2 text-base text-darkergray
                          flex flex-wrap border border-t-0 border-transparentgray place-content-center'>
                            <div className='flex flex-wrap justify-center'>
                                <div className='flex place-content-center mr-4 mb-2'>
                                    <span className='mr-2'>Dates : </span>
                                    <input className='h-7 rounded-full pt-1 pr-0 w-34' type='date'/>
                                    <span className='mx-2'> -- </span>
                                    <input className='h-7 rounded-full pt-1 pr-0 w-34' type='date'/>
                                </div>
                                <div className='flex place-content-center'>
                                    <span className='mr-2'>Ville : </span>
                                    <input className='h-7 rounded-full pt-1 pr-0 min-w-32'
                                           placeholder='Nancy' type='text'/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-wrap flex-row justify-center w-full'>
                        <div className='mt-14 w-full text-right mr-14'>
                            <span>Tri : </span>
                            <select className='rounded-full h-8 py-0'>
                                <option>Populaire</option>
                                <option>Récent</option>
                            </select>
                        </div>
                        {
                            !this.state.isSearchLoaded
                            ? [<LoadingEventCard key={1} />,<LoadingEventCard key={2} />,<LoadingEventCard key={3} />]
                            : this.state.searchedEvents.map((elem, index) => {
                                return(
                                <EventCard
                                    key={index}
                                    id={elem.id}
                                    title={elem.titre}
                                    description={elem.description}
                                    imgUrl={elem.img_banniere}
                                    membersNumber={'?'}
                                    etat={elem.etat}
                                    location={elem.departement}
                                    startDate={elem.debut}
                                    endDate={elem.fin}
                                />)
                            }) 
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;
