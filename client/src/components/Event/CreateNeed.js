import React from 'react';
import axios from "axios";
import FormButton from "../FormButton";

class ParticipantsList extends React.Component {

    constructor(props){
        super(props);
        this.state = { active : false, participants : [] };
        this.DOM_element = React.createRef()
    }

    toggleActive = () => {
        this.setState({ active : !this.state.active });

        if(!this.state.active) window.addEventListener('click', this.checkClickOutside);
        else window.removeEventListener('click', this.checkClickOutside);
    }

    checkClickOutside = (e) => {
        if(this.state.active && !this.DOM_element.current.contains(e.target) && !this.props.input.current.contains(e.target)) {
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
            <div key={i} className='w-full px-3 flex hover:bg-selected-gray items-stretch justify-between'>
                <div className='flex py-2 gap-2 items-center grow hover:cursor-pointer' onClick={() => this.props.selectUser(elem.email)}>
                    <img className='rounded-full h-6 w-6 bg-green flex-none' src={this.props.imgUrl} alt='' />
                    <div className='text-sm whitespace-nowrap'>{elem.prenom + " " + elem.nom}</div>
                    <div className='text-sm text-darkergray font-light text-right flex-1'>{elem.vous ? 'Vous' : elem.proprietaire ? 'Propriétaire' : ''}</div>
                </div>
            </div>
        );
    }

    render(){
        return(
            <div id='dropdown-account' className={'text-left bg-white absolute right-0 left-0 m-auto my-10 drop-shadow-sm border rounded-md border-transparentgray flex flex-col ' +
                'gap-1 py-1 min-w-[200px] max-h-64 w-fit z-50 ' + (this.state.active? '': 'hidden')} ref={this.DOM_element}>
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


class CreateNeed extends React.Component {
    constructor(props) {
        super(props);
        this.componentDiv = React.createRef()
        this.participants = React.createRef()
        this.inputParticipant = React.createRef()
        this.state = {
            needId: undefined
        }
    }

    showComponent(need) {
        if (need) {
            this.setState({ needId: need.id })
            document.getElementById("associated-to"+this.props.actionType).value = need.email || ""
            document.getElementById("need-title"+this.props.actionType).value = need.description
        } else {
            document.getElementById("associated-to"+this.props.actionType).value = ""
            document.getElementById("need-title"+this.props.actionType).value = ""
        }
        this.componentDiv.current.classList.remove("hidden")
    }

    hideComponent() {
        this.componentDiv.current.classList.add("hidden")
        document.getElementById("associated-to"+this.props.actionType).value = ""
        document.getElementById("need-title"+this.props.actionType).value = ""
    }

    validation(evt) {
        evt.preventDefault()
        let newNeed = {
            id: this.state.needId,
            description : document.getElementById("need-title"+this.props.actionType).value,
            email : document.getElementById("associated-to"+this.props.actionType).value,
            eventId : this.props.eventId
        }
        this.props.callback(newNeed)
        this.hideComponent()
    }

    setUser(usermail) {
        document.getElementById("associated-to"+this.props.actionType).value = usermail
        this.participants.current.toggleActive()
    }

    render(){
        return(
            <form ref={this.componentDiv} onSubmit={(evt) => this.validation(evt)}
                  className='flex place-items-center fixed right-0 left-0 bottom-0 top-0 bg-transparentgray z-50 hidden '>
                <div className='flex flex-col relative bg-white m-auto max-h-[300px] h-1/2 min-w-[500px] w-max rounded-2xl px-8 pt-4'>
                    <span className="material-icons hover:cursor-pointer text-3xl font-bold absolute right-0 top-0 m-1"
                          onClick={() => this.hideComponent()}>
                        close
                    </span>
                    <h3 className='text-4xl text-center'>{ this.props.titleWindow }</h3>

                    <div className='flex-grow flex flex-col justify-between my-6 mx-2'>
                        <div>
                            <label htmlFor={'need-title'+this.props.actionType} className='block leading-3 ml-4 text-lg relative z-20'>Intitulé</label>
                            <input type='text' id={'need-title' + this.props.actionType} required
                                   className='rounded-full border-transparentgray z-10 w-full bg-white'/>
                        </div>
                        <div className='w-2/5'>
                            <label htmlFor={'associated-to'+this.props.actionType} className='block leading-3 ml-4 text-lg relative z-20'>Associé à</label>
                            <input type='text' id={'associated-to'+this.props.actionType} className='rounded-full border-transparentgray z-10 w-full bg-white'
                                   onFocus={() => this.participants.current.toggleActive()} ref={this.inputParticipant} />
                        </div>
                        <FormButton value='Valider' />
                    </div>

                    <ParticipantsList ref={this.participants} eventId={this.props.eventId}
                                      selectUser={(email) => this.setUser(email)} input={this.inputParticipant} />
                </div>
            </form>
        );
    }
}

export default CreateNeed;
