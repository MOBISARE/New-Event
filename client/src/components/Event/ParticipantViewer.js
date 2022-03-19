import axios from 'axios';
import React, { createRef } from 'react';
import { Link } from 'react-router-dom';

class ParticipantViewer extends React.Component {

    static defaultProps = {
        button: null,
        editable: false
    }

    constructor(props){
        super(props);
        this.state = { active : false, participants : [] };
        this.DOM_element = createRef();
    }

    toggleActive = () => {
        this.setState({ active : !this.state.active });
        
        if(!this.state.active) window.addEventListener('click', this.checkClickOutside);
        else window.removeEventListener('click', this.checkClickOutside);
    }

    checkClickOutside = (e) => {
        if(this.state.active && !this.DOM_element.current.contains(e.target) && !this.props.button.current.contains(e.target)) {
            this.setState({ active : false })
            window.removeEventListener('click', this.checkClickOutside);
        }
    }

    componentDidMount = () => {
        axios.get("/api/evenement/" + this.props.eventId + "/participants")
        .then((res) => {
            this.setState({ participants : res.data})
        })
        .catch((err) => {
            console.log(err);
        })
    }
    
    componentWillUnmount = () => {
        window.removeEventListener('click', this.checkClickOutside);
    }

    showUser = (elem, i) => {
        return (
            <div key={i} className='w-max px-3 flex hover:bg-selected-gray items-stretch justify-between'>
                <Link to={'/profil/' + elem.email} className='flex py-2 gap-2 items-center grow'>
                    <img className='rounded-full h-6 w-6 bg-green flex-none' src={this.props.imgUrl} />
                    <div className='text-sm whitespace-nowrap'>{elem.prenom + " " + elem.nom}</div>
                    <div className='text-sm text-darkergray font-light text-right flex-1'>{elem.vous ? 'Vous' : elem.proprietaire ? 'Propriétaire' : ''}</div>
                </Link>
                
                {this.props.editable && !elem.proprietaire ? <div className='bg-red-600 text-white text-sm px-2 flex items-center hover:shadow-inner hover:bg-red-800 cursor-pointer' onClick={() => this.kick(i)}>Expulser</div> : <></>}
            </div>
        );
    }

    kick = (i) => {
        console.log("kick " + i)
    }

    render(){

        return(
            <div id='dropdown-account' className={'text-left bg-white absolute right-0 drop-shadow-sm border rounded-md border-transparentgray flex flex-col gap-1 py-1 min-w-[200px] max-h-64 w-fit z-10 ' + (this.state.active? '': 'hidden')} ref={this.DOM_element}>
                <div className='inline-block px-4 whitespace-nowrap py-1 text-md'>Participants</div>
                <div className='flex items-center border-y border-transparentgray px-1'>
                    <span className="material-icons text-transparentgray">
                        search
                    </span>
                    <input className='flex-grow placeholder:text-transparentgray text-sm focus-visible:outline-none px-1 py-2' placeholder='Rechercher des membres' />
                </div>

                

                <div className='overflow-y-scroll'>
                    <div className='flex flex-col gap-1'>
                        {
                            this.state.participants.length > 0
                            ? this.state.participants.map((elem, index) => {
                                return this.showUser(elem, index)
                            })
                            : <></>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default ParticipantViewer;