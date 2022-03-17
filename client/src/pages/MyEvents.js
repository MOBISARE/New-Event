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
            if(res.data) res.data.forEach(element => {
                element.debut = new Date(element.debut).toLocaleDateString();
                element.fin = new Date(element.fin).toLocaleDateString();
            });
            this.setState({myevents: res.data, isMyEventsLoaded: true});
        })
        .catch((err) => {
            console.log(err);
        });

        axios.get('/api/compte/mes-participations')
        .then((res) => {
            if(res.data) res.data.forEach(element => {
                element.debut = new Date(element.debut).toLocaleDateString();
                element.fin = new Date(element.fin).toLocaleDateString();
            });
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
                            : this.state.myevents.map((elem) => {
                                return(
                                <EventCard
                                    key={elem.id_evenement}
                                    id={elem.id_evenement}
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
                <div className='mt-6'>
                    <span className='text-3xl'>Mes participations</span>
                    <hr/>
                    <div className='flex flex-wrap flex-row'>
                    { 
                        !this.state.isMyContribLoaded
                        ? <LoadingEventCard/>
                        : this.state.mycontributing.map((elem) => {
                            return(
                            <EventCard
                                key={elem.id_evenement}
                                id={elem.id_evenement}
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

export default withRouter(MyEvents);
