import React from 'react'
import EventCard from '../components/EventCard'
import {Link} from 'react-router-dom'

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
    render(){
        const myevents = [fakeEvents[0]].map(value =>
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
        const mycontributing = [fakeEvents[1], fakeEvents[2]].map(value =>
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
            <div>
                <div className='mt-6'>
                    <span className='text-3xl mr-2'>Mes événements</span>
                    <Link to='/creer-evenement'>
                        <span className="material-icons">
                        add_circle_outline
                    </span>
                    </Link>
                    <hr/>
                    <div>
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
