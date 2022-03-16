import React from 'react'
import axios from "axios";

import UserMini from '../../components/UserMini'
import NeedList from '../../components/Event/NeedList'
import Button from "../../components/Button";
import ParticipantViewer from '../../components/Event/ParticipantViewer'

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

class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

        this.participantBtn = React.createRef();
        this.participantViewer = React.createRef();
    }

    async componentDidMount() {
        this.setState(await axios.get('/api/evenement/1').then(value => {
            value.data.debut = new Date(value.data.debut).toLocaleDateString()
            value.data.fin = new Date(value.data.fin).toLocaleDateString()
            return value.data
        }));
        console.log(this.state)
    }

    render() {
        return(
            <div className='max-w-[1000px] mx-auto'>
                <div className='flex'>
                    <div className='flex flex-col w-3/5 bg-white rounded-3xl shadow mr-4'>
                        <div className='flex-grow bg-darkgray h-80 rounded-t-3xl overflow-hidden'>
                            <img className='object-cover w-full h-auto'
                                 src={this.state.img_banniere} onError={event => event.target.hidden=true} alt=" "/>
                        </div>
                        <div className='p-6 border-t-8 border-green'>
                            <h5 className='text-xl font-bold'>{ this.state.titre }</h5>
                            <p>{ this.state.description }</p>
                        </div>
                    </div>
                    <div className='w-2/5'>
                        <div className='flex flex-col h-fit bg-white rounded-3xl shadow ml-4 p-6'>
                            <div>
                                Dates :
                                <div className='ml-10'>
                                    {this.state.debut} -- {this.state.fin}
                                </div>
                            </div>
                            <div className='my-2'>
                                Localisation :
                                <div className='ml-10'>
                                    {this.state.departement}
                                </div>
                            </div>
                            <Button className='bg-green-valid'>Rejoindre</Button>
                        </div>
                        <div className='flex flex-col h-fit bg-white rounded-3xl shadow ml-4 p-6 mt-10'>
                            <div>
                                Organisateur
                                <div className='ml-10'>
                                    <UserMini firstname='Prénom' lastname='Nom' />
                                </div>
                            </div>
                            <div className='my-2'>
                                Participants
                                <div className='ml-10 relative'>
                                    <span className='flex items-center' ref={this.participantBtn} onClick={() => {this.participantViewer.current.toggleActive()}}>
                                        <span className="material-icons md-18 mr-1">
                                            people
                                        </span>
                                        { (this.state.id_participants)? this.state.id_participants.length:0 }
                                    </span>
                                    <ParticipantViewer ref={this.participantViewer} button={this.participantBtn}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NeedList needs={this.state.besoins}/>
            </div>
        );
    }
}

export default Event;
