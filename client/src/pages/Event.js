import React from 'react'

import UserMini from '../components/UserMini'
import NeedList from '../components/NeedList'

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
        this.state = evt
    }

    render(){
        return(
            <div className='max-w-[1000px] mx-auto'>
                <div className='flex'>
                    <div className='flex flex-col w-3/5 bg-white rounded-3xl shadow mr-4'>
                        <div className='flex-grow bg-darkgray h-80 rounded-t-3xl overflow-hidden'>
                            <img className='object-cover w-full h-auto'
                                 src={this.state.imgUrl} onError={event => event.target.hidden=true} alt=" "/>
                        </div>
                        <div className='p-6 border-t-8 border-green'>
                            <h5 className='text-xl font-bold'>{ this.state.title }</h5>
                            <p>{ this.state.description }</p>
                        </div>
                    </div>
                    <div className='w-2/5'>
                        <div className='flex flex-col h-fit bg-white rounded-3xl shadow ml-4 p-6'>
                            <div>
                                Dates :
                                <div className='ml-10'>
                                    {this.state.startDate} -- {this.state.endDate}
                                </div>
                            </div>
                            <div className='my-2'>
                                Localisation :
                                <div className='ml-10'>
                                    {this.state.location}
                                </div>
                            </div>
                            <button className='bg-green-valid h-8 text-white rounded-full'>
                                Rejoindre</button>
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
                                <div className='ml-10'>
                                    <span className='flex items-center'>
                                        <span className="material-icons md-18 mr-1">
                                            people
                                        </span>
                                        { this.state.membersNumber }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NeedList/>
            </div>
        );
    }
}

export default Event;
