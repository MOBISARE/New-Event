import React from 'react'
import axios from "axios";

import withRouter from '../../withRouter'
import LoadingEvent from './LoadingEvent'
import Event from './Event';
import CreateEvent from './CreateEvent';

class EventContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: undefined
        }
    }

    componentDidMount = () => {
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
                    ? <CreateEvent></CreateEvent>
                    : <Event></Event>
                }
            </div>
        );
    }
}

export default withRouter(EventContainer);
