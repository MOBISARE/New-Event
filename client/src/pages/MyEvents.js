import React from 'react'
import EventCard from '../components/Event/EventCard'
import {Link} from 'react-router-dom'
import axios from "axios";

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
    },
]
class MyEvents extends React.Component {

    async componentDidMount() {
        this.setState(await axios.get('/api/evenement/consulter/1').then(value => {
            console.log(value)
        }));
    }

    render(){
        const myevents = [fakeEvents[0], fakeEvents[1]].map(value =>
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
        const mycontributing = [fakeEvents[2]].map(value =>
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
                    <Link to='/creer-evenement'>
                        <span className="material-icons">
                        add_circle_outline
                    </span>
                    </Link>
                    <hr/>
                    <div className='flex flex-wrap flex-row'>
                        { myevents }
                    </div>
                </div>
                <div className='mt-6'>
                    <span className='text-3xl'>Mes participations</span>
                    <hr/>
                    <div className='flex flex-wrap flex-row'>
                        { mycontributing }
                    </div>
                </div>
            </div>
        );
    }
}

export default MyEvents;
