import React from 'react';
import axios from 'axios';

import EventCard from '../components/Event/EventCard'
import LoadingEventCard from '../components/Event/LoadingEventCard';

function NoEventsFound() {
    return(
        <div className='flex justify-center my-6 mx-20 rounded-full bg-white h-10 w-8/12 border border-transparentgray'>
            <p className='h-max w-max my-auto'>Aucun événement ne correspond à votre recherche.</p>
        </div>
    )
}

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchedEvents: [],
            isSearchLoaded: false,
            advancedSearchActive: false
        };
        this.searchbar = React.createRef()
        this.advancedSearchbar = React.createRef()
    }

    componentDidMount(){
        this.search()
        window.addEventListener('click', this.checkClickOutside);
    }

    componentWillUnmount = () => {
        window.removeEventListener('click', this.checkClickOutside);
    }

    toggleOrSetAdvancedSearchbar = () => {
        this.setState({ advancedSearchActive: !this.state.advancedSearchActive })

        if(!this.state.advancedSearchActive) window.addEventListener('click', this.checkClickOutside)
        else window.removeEventListener('click', this.checkClickOutside)
    }

    checkClickOutside = (e) => {
        if(this.state.advancedSearchActive && !this.searchbar.current.contains(e.target) && !this.advancedSearchbar.current.contains(e.target)) {
            this.toggleOrSetAdvancedSearchbar()
            window.removeEventListener('click', this.checkClickOutside)
        }
    }

    handlerFocusSearchbar() {
        if (!this.state.advancedSearchActive){
            this.setState({advancedSearchActive: true})
            window.addEventListener('click', this.checkClickOutside)
        }
    }

    search() {
        let tri = document.getElementById('tri').value
        let debut = document.getElementById('date-debut').value
        let fin = document.getElementById('date-fin').value
        let location = document.getElementById('location').value
        let search = document.getElementById('search-input').value || '""'
        axios.get(`/api/evenement/recherche/${search}`, {
            params: {
                tri: tri? tri.toLowerCase():undefined,
                datedebut: debut || undefined,
                datefin: fin || undefined,
                ville: location || undefined
            }
        })
        .then((res) => {
            this.setState({searchedEvents: res.data, isSearchLoaded: true, advancedSearchActive:false});
        })
        .catch((err) => {
            console.log(err);
            this.setState({searchedEvents: [], isSearchLoaded: true, advancedSearchActive:false});
        });
    }

    render(){
        return(
            <div className='text-center flex flex-col items-center w-[800px] max-w-[800px] mx-auto'>
                <div className='bg-gray h-screen w-full absolute select-none'>
                    <img src='/images/blob1.svg'
                         className='fixed top-0 right-0 w-2/5' alt=''/>
                    <img src='/images/blob2.svg'
                         className='fixed bottom-0 left-0 w-2/5' alt=''/>
                </div>
                <form className='relative z-10 w-full' onSubmit={event => event.preventDefault()}>
                    <h1 className='font-bold text-7xl mt-24'>Rechercher un
                        <div className='font-black text-transparent bg-clip-text bg-gradient-to-r from-purple to-blue w-max m-auto'>
                            événement</div>
                    </h1>

                    <div className='relative bg-white w-full rounded-full h-16 flex items-center p-4 mt-10 text-2xl border border-transparentgray'
                         ref={this.searchbar}>
                        <button className='flex' type='submit' onClick={() => this.search()}>
                            <span className="material-icons text-4xl text-transparentgray">
                                search
                            </span>
                        </button>
                        <input placeholder='Anniversaire de...' id='search-input' onFocus={() => this.handlerFocusSearchbar()}
                               className='flex-grow focus:outline-none ml-2 placeholder:text-transparentgray' />
                        <button className='flex' onClick={this.toggleOrSetAdvancedSearchbar}>
                            <span className="material-icons text-4xl text-transparentgray">
                                manage_search
                            </span>
                        </button>

                        <div ref={this.advancedSearchbar} className={'absolute top-[3.9rem] left-0 right-0 bg-white rounded-b-3xl mx-6 px-4 pt-4 pb-2 text-base text-darkergray -z-10 drop-shadow ' +
                                'flex flex-wrap border border-t-0 border-transparentgray place-content-center transition-all ' + (this.state.advancedSearchActive? "":"-translate-y-full -mb-10")}>
                            <div className='flex flex-wrap justify-center'>
                                <div className='flex place-content-center mr-4 mb-2'>
                                    <span className='mr-2'>Dates : </span>
                                    <input className='h-7 rounded-full pt-1 pr-0 w-34' type='date' id='date-debut'/>
                                    <span className='mx-2'> -- </span>
                                    <input className='h-7 rounded-full pt-1 pr-0 w-34' type='date' id='date-fin'/>
                                </div>
                                <div className='flex place-content-center'>
                                    <span className='mr-2'>Ville : </span>
                                    <input className='h-7 rounded-full pt-1 pr-0 min-w-32' id='location'
                                           placeholder='Nancy' type='text'/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-wrap flex-row justify-center w-full relative -z-20'>
                        <div className='mt-14 w-full text-right mr-14'>
                            <span>Tri : </span>
                            <select id='tri' className='rounded-full h-8 py-0 border-transparentgray'
                                    onChange={() => this.search()}>
                                <option defaultChecked>Populaire</option>
                                <option>Récent</option>
                            </select>
                        </div>
                        {
                            !this.state.isSearchLoaded
                            ? [<LoadingEventCard key={1} />,<LoadingEventCard key={2} />,<LoadingEventCard key={3} />]
                            : this.state.searchedEvents.length===0
                            ? <NoEventsFound />
                            : this.state.searchedEvents.map((elem, index) => {
                                return(
                                <EventCard
                                    key={index}
                                    id={elem.id}
                                    title={elem.titre}
                                    description={elem.description}
                                    imgUrl={elem.img_banniere}
                                    membersNumber={elem.nb_participants}
                                    etat={elem.etat}
                                    location={elem.departement}
                                    startDate={elem.debut}
                                    endDate={elem.fin}
                                />)
                            })
                        }
                    </div>
                </form>
            </div>
        );
    }
}

export default Main;
