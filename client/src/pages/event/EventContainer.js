import React from 'react'
import axios from "axios";

import withRouter from '../../withRouter'
import LoadingEvent from './LoadingEvent'
import Event from './Event';
import CreateEvent from './CreateEvent';
import ModifyEvent from './ModifyEvent';

class EventContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: undefined,
            isModifing: false
        }
    }

    setEvent = (e) => {
        this.setState({event: e});
    }

    componentDidMount = () => {
        window.scrollTo(0, 0);
        axios.get('/api/evenement/' + this.props.router.params.id)
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
                    ? <CreateEvent eventModel={this.state.event} container={this}></CreateEvent>
                    : this.state.isModifing
                    ? <ModifyEvent eventModel={this.state.event} container={this}></ModifyEvent>
                    : <Event eventModel={this.state.event} container={this}></Event>
                }
            </div>
        );
    }
}

export default withRouter(EventContainer);
