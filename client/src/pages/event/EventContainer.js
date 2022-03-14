import React from 'react'
import axios from "axios";

import LoadingEvent from './LoadingEvent'
import Event from './Event';
import CreateEvent from './CreateEvent';

let evt = {
    id:1,
    title:"Titre d'événement",
    description:"Description de cet événement",
    imgUrl:"/images/icon.png",
    membersNumber:"5",
    location:"Nancy",
    startDate:"26/02/2020",
    endDate:"31/08/2020"
}

class EventContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: undefined
        }
    }

    componentDidMount = () => {
        axios.get('/api/evenement/7')
        .then(res => {
            this.setState({event: res.data});
        })
        .catch(err => {
            console.log(err);
        })
    }

    render() {
        return(
            <div>
                {
                    this.state.event === undefined
                    ? <LoadingEvent></LoadingEvent>
                    : this.state.event.etat === 0
                    ? <CreateEvent></CreateEvent>
                    : <Event></Event>
                }
            </div>
        );
    }
}

export default EventContainer;
