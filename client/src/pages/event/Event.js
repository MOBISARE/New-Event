import React from 'react'

import UserMini from '../../components/UserMini'
import NeedList from '../../components/Event/NeedList'
import Button from "../../components/Button"
import ParticipantViewer from '../../components/Event/ParticipantViewer'
import EventMenu from '../../components/Event/EventMenu'
import InviteMenu from '../../components/Event/InviteMenu'
import axios from 'axios'

class Event extends React.Component {
    constructor(props) {
        super(props);

        this.participantBtn = React.createRef();
        this.participantViewer = React.createRef();
        this.eventMenuBtn = React.createRef();
        this.eventMenu = React.createRef();

        this.inviteMenu = React.createRef();
    }

    OwnerEventMenu = () => {
        let buttons = [
            {title: "Inviter des participants", onClick: () => {this.inviteMenu.current.showComponent()}},
            {title: "Modifier événement", onClick: () => {this.props.container.setState({isModifing: true})}}
        ]

        return (
            <div className='relative'>
                <span className="material-icons cursor-pointer" onClick={() => {this.eventMenu.current.toggleActive()}} ref={this.eventMenuBtn}>
                more_vert
                </span>
                <EventMenu ref={this.eventMenu} button={this.eventMenuBtn} values={buttons}></EventMenu>
            </div>
        )
    }

    ParticipantEventMenu = () => {

        let buttons = [
            {title: "Modifier événement", onClick: () => {this.props.container.setState({isModifing: true})}},
            {title: "Quitter événement", onClick: () => quitEvent(), color:'red-500'}
        ]

        let quitEvent = () => {
            axios.post('/api/evenement/' + this.props.eventModel.id + '/seretirer')
            .then((res) => {
                this.props.container.props.router.navigate('/');
            })
            .catch((err) => {
                console.log(err);
            })
        }

        return (
            <div className='relative'>
                <span className="material-icons cursor-pointer" onClick={() => {this.eventMenu.current.toggleActive()}} ref={this.eventMenuBtn}>
                more_vert
                </span>
                <EventMenu ref={this.eventMenu} button={this.eventMenuBtn} values={buttons}></EventMenu>
            </div>
        )
    }

    ClickableUserMenu = () => {
        return(
            <div>
                <div className='flex cursor-pointer' onClick={() => {this.participantViewer.current.toggleActive()}} ref={this.participantBtn}>
                    <span className="material-icons md-18 mr-1">
                        people
                    </span>
                    { this.props.eventModel.nbParticipants }
                </div>
                <ParticipantViewer ref={this.participantViewer} button={this.participantBtn} eventId={this.props.eventModel.id}/>
            </div>
        );
    }

    UnclickableUserMenu = () => {
        return(
            <div>
                <div className='flex'>
                    <span className="material-icons md-18 mr-1">
                        people
                    </span>
                    { this.props.eventModel.nbParticipants }
                </div>
            </div>
        );
    }

    render() {
        return(
            <div className='max-w-[1000px] mx-auto'>
                <div className='flex'>
                    <div className='flex flex-col w-3/5 bg-white rounded-3xl shadow mr-4'>
                        <div className=' bg-darkgray min-h-[250px] max-h-80 rounded-t-3xl overflow-hidden'>
                            <img className='object-cover w-full h-auto'
                                 src={this.props.eventModel.img_banniere} onError={event => event.target.hidden=true} alt=" "/>
                        </div>
                        <div className='p-6 border-t-8 border-green'>
                            <div className='flex flex-row justify-between'>
                                <h5 className='text-xl font-bold'>{ this.props.eventModel.titre }</h5>
                                {
                                    this.props.eventModel.etatAppartenance === 2
                                    ? this.OwnerEventMenu()
                                    : this.props.eventModel.etatAppartenance === 1
                                    ? this.ParticipantEventMenu()
                                    : <></>
                                }
                            </div>
                            
                            <p>{ this.props.eventModel.description }</p>
                        </div>
                    </div>
                    <div className='w-2/5'>
                        <div className='flex flex-col h-fit bg-white rounded-3xl shadow ml-4 p-6'>
                            <div>
                                Dates :
                                <div className='ml-10'>
                                    {new Date(this.props.eventModel.debut).toLocaleDateString()} -- {new Date(this.props.eventModel.fin).toLocaleDateString()}
                                </div>
                            </div>
                            <div className='my-2'>
                                Localisation :
                                <div className='ml-10'>
                                    {this.props.eventModel.departement}
                                </div>
                            </div>
                            {
                                this.props.eventModel.etatAppartenance === 0
                                ? <Button className='bg-green-valid'>Rejoindre</Button>
                                : <></>
                            }
                            
                        </div>
                        <div className='flex flex-col h-fit bg-white rounded-3xl shadow ml-4 p-6 mt-10'>
                            <div>
                                Organisateur
                                <div className='ml-10'>
                                    <UserMini user={this.props.eventModel.proprietaire} />
                                </div>
                            </div>
                            <div className='my-2'>
                                Participants
                                <div className='ml-10 relative'>
                                    <span className='flex items-center'>
                                        {
                                            this.props.eventModel.etatAppartenance === 0
                                            ? this.UnclickableUserMenu()
                                            : this.ClickableUserMenu()
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NeedList needs={this.props.eventModel.besoins}
                          eventId={this.props.eventModel.id}
                          actionType={(this.props.eventModel.etatAppartenance === 0)? 'show':'modify'}
                          appartenance={this.props.eventModel.etatAppartenance}/>
                <InviteMenu ref={this.inviteMenu} eventId={this.props.eventModel.id}/>
            </div>
        );
    }
}

export default Event;
