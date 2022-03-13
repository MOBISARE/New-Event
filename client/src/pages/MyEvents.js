import React from 'react'
import EventCard from '../components/Event/EventCard'
import axios from "axios";
import withRouter from '../withRouter'

class MyEvents extends React.Component {

    constructor(props){
        super(props);
        this.state = {myevents: [], mycontributing: []};
    }

    componentDidMount = () => {
        axios.get('/api/mes-evenements')
        .then((res) => {
            this.setState({myevents: res.data});
        })
        .catch((err) => {
            console.log(err);
        });

        axios.get('/api/mes-participations')
        .then((res) => {
            this.setState({mycontributing: res.data});
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
        const myevents = [].map(value =>
            <EventCard
                key={value.id}
                id={value.id}
                title={value.title}
                description={value.description}
                imgUrl={value.imgUrl}
                membersNumber={value.membersNumber}
                location={value.location}
                startDate={value.startDate}
                endDate={value.endDate}
            />
        )
        const mycontributing = [].map(value =>
            <EventCard
                key={value.id}
                id={value.id}
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
            <div>
                <div>
                    <span className='text-3xl mr-2'>Mes événements</span>
                    <span className="material-icons cursor-pointer" onClick={this.createEvent}>
                        add_circle_outline
                    </span>

                    <hr/>

                    <div className='flex flex-wrap flex-row'>
                        { 
                        this.state.myevents.map((elem) => {
                            return(
                            <EventCard
                                key={elem.id_evenement}
                                id={elem.id_evenement}
                                title={elem.titre}
                                description={elem.description}
                                imgUrl={elem.img_banniere}
                                membersNumber={'?'}
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
                        this.state.mycontributing.map((elem) => {
                            return(
                            <EventCard
                                key={elem.id_evenement}
                                id={elem.id_evenement}
                                title={elem.titre}
                                description={elem.description}
                                imgUrl={elem.img_banniere}
                                membersNumber={'?'}
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
