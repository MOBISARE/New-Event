import React from 'react'
import EventCard from '../components/Event/EventCard'
import LoadingEventCard from '../components/Event/LoadingEventCard'
import axios from "axios";
import withRouter from '../withRouter'

class MyEvents extends React.Component {

    constructor(props){
        super(props);
        this.state = {myevents: [], mycontributing: [], isMyEventsLoaded: false, isMyContribLoaded: false};
    }

    componentDidMount = () => {
        axios.get('/api/compte/mes-evenements')
        .then((res) => {
            this.setState({myevents: res.data, isMyEventsLoaded: true});
        })
        .catch((err) => {
            console.log(err);
        });

        axios.get('/api/compte/mes-participations')
        .then((res) => {
            this.setState({mycontributing: res.data, isMyContribLoaded: true});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    createEvent = () => {
        axios.put('/api/evenement/creer')
        .then(res => {
            this.props.router.navigate("/evenement/" + res.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    render(){
        return(
            <div>
                <div>
                    <span className='text-3xl mr-2'>Mes événements</span>
                    <span className="material-icons cursor-pointer" onClick={this.createEvent}>
                        add_circle_outline
                    </span>

                    <hr/>

                    <div className='flex flex-wrap flex-row'>
                        {
                            !this.state.isMyEventsLoaded
                            ? <LoadingEventCard/>
                            : this.state.myevents.length===0
                            ? <p className='text-center w-full my-3'>Vous n'avez pas créé d'événement.</p>
                            : this.state.myevents.map((elem) => {
                                if(elem.etat === 2) return(<div key={elem.id_evenement}/>)
                                return(
                                    <EventCard
                                        key={elem.id_evenement}
                                        id={elem.id_evenement}
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
                </div>
                <div className='mt-6'>
                    <span className='text-3xl'>Mes participations</span>
                    <hr/>
                    <div className='flex flex-wrap flex-row'>
                        {
                            !this.state.isMyContribLoaded
                            ? <LoadingEventCard/>
                            : this.state.mycontributing.length===0
                            ? <p className='text-center w-full my-3'>Vous ne participez à aucun événement.</p>
                            : this.state.mycontributing.map((elem) => {
                                if(elem.etat === 2) return(<div key={elem.id_evenement}/>)
                                return(
                                    <EventCard
                                        key={elem.id_evenement}
                                        id={elem.id_evenement}
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
                </div>
            </div>
        );
    }
}

export default withRouter(MyEvents);
