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
        this.state = { active : false };
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
        axios({
            method:"get",
            url:"/api/getParticipants/:id",
            data: {
            }
        })
        .then((res) => {
            console.log(res);
            window.location = "/";
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
            <div key={i} className='w-full px-3 flex hover:bg-selected-gray items-stretch justify-between'>
                <Link to={'/profil/' + elem.id} className='flex py-2 gap-2 items-center grow'>
                    <img className='rounded-full h-6 w-6 bg-green flex-none' src={this.props.imgUrl} />
                    <div className='text-sm whitespace-nowrap'>{elem.firstname + " " + elem.name}</div>
                    <div className='text-sm text-darkergray font-light text-right flex-1'>{elem.isYou ? 'Vous' : elem.owner ? 'Propriétaire' : ''}</div>
                </Link>
                
                {this.props.editable && !elem.owner ? <div className='bg-red-600 text-white text-sm px-2 flex items-center hover:shadow-inner hover:bg-red-800 cursor-pointer' onClick={() => this.kick(i)}>Expulser</div> : <></>}
            </div>
        );
    }

    kick = (i) => {
        console.log("kick " + i)
    }

    render(){
        var participants = [
            {id: 1, firstname: "Prénom", name: "Nom", owner: true},
            {id: 2, firstname: "Prénom2fff", name: "Nom2", isYou: true},
            {id: 3, firstname: "Prénom2", name: "Nom2"},
            {id: 4, firstname: "Prénom2", name: "Nom2"},
            {id: 5, firstname: "Prénom2", name: "Nom2"},
            {id: 6, firstname: "Prénom2", name: "Nom2"},
            {id: 7, firstname: "Prénom2", name: "Nom2"},
            {id: 8, firstname: "Prénom2", name: "Nom2"},
            {id: 9, firstname: "Prénom2", name: "Nom2"},
            {id: 10, firstname: "Prénom2", name: "Nom2"},
            {id: 11, firstname: "Prénom2", name: "Nom2"},
            {id: 12, firstname: "Prénom2", name: "Nom2"},
        ]

        return(
            <div id='dropdown-account' className={'text-left bg-white absolute right-0 drop-shadow-sm border rounded-md border-transparentgray flex flex-col gap-1 py-1 min-w-[200px] max-h-64 w-fit ' + (this.state.active? '': 'hidden')} ref={this.DOM_element}>
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
                        participants.map((elem, index) => {
                            return this.showUser(elem, index)
                        })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default ParticipantViewer;