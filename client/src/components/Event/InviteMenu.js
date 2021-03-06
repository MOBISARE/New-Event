import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

class InviteMenu extends React.Component {
    constructor(props) {
        super(props);

        this.searchField = React.createRef();
        this.citySearchField = React.createRef();
        this.componentDiv = React.createRef();

        this.state = {users: [], isOpen: false};
        this.abortController = new AbortController();
    }

    showComponent() {
        this.componentDiv.current.classList.remove("hidden");
    }

    hideComponent() {
        this.componentDiv.current.classList.add("hidden");
    }

    handleSearch = async(e) => {
        this.abortController.abort();
        this.abortController = new AbortController();
        
        if (this.searchField.current.value === '') {
            this.setState({users: []});
            return;
        }

        axios.get('/api/evenement/' + this.props.eventId + '/utilisateurAInviter', {
            signal: this.abortController.signal, 
            params: { "search" : this.searchField.current.value, "ville" : this.state.isOpen?this.citySearchField.current.value:"" }
        })
        .then((res) => {
            this.setState({users: res.data});
        })
        .catch((err) => {

        })
    }

    showUser = (elem, i) => {

        let invite = () => {
            axios.post('/api/evenement/' + this.props.eventId + '/inviter/' + elem.email)
            .then((res) => {
                this.handleSearch();
            })
            .then((err) => {
                
            })
        }

        return (
            <div key={i} className='w-full pl-3 flex hover:bg-selected-gray items-stretch justify-between'>
                <Link to={'/profil/' + elem.email} className='flex py-2 gap-2 items-center grow'>
                    <img className='rounded-full h-6 w-6 bg-green flex-none' src={elem.img_profil} />
                    <div className='text-sm whitespace-nowrap'>{elem.prenom + " " + elem.nom}</div>
                </Link>
                
                {
                    elem.invite
                    ? <div className='flex items-center justify-center text-center px-10 text-sm'>invit??</div>
                    : <div className='bg-blue text-white text-sm px-10 flex items-center justify-center hover:shadow-inner hover:bg-sky-600 cursor-pointer text-center' onClick={invite}>Inviter</div>
                }
                
            </div>
        );
    }

    render(){
        return(
            <div ref={this.componentDiv} className='flex place-items-center justify-center fixed right-0 left-0 bottom-0 top-0 bg-transparentgray z-50 hidden'>
                <div className='relative bg-white rounded-2xl p-5 flex flex-col gap-5 w-1/2'>
                    <span className="material-icons hover:cursor-pointer text-3xl font-bold absolute right-0 top-0 m-1" onClick={() => this.hideComponent()}>
                        close
                    </span>
                    <h1 className='text-3xl text-center'>Inviter utilisateur</h1>
                    <div className='border border-transparentgray h-72 flex flex-col'>
                        <div className='flex items-center border-b border-transparentgray px-1 bg-white z-10'>
                            <span className="material-icons text-transparentgray">
                                search
                            </span>
                            <input className='flex-grow placeholder:text-transparentgray text-sm focus-visible:outline-none px-1 py-2' placeholder='Rechercher des utilisateurs' onChange={this.handleSearch} ref={this.searchField}/>
                            <span className="material-icons text-transparentgray cursor-pointer" onClick={() => this.setState({isOpen: !this.state.isOpen}, this.handleSearch)}>
                                manage_search
                            </span>
                        </div>

                        <div className={'flex items-center border-b border-transparentgray px-1 relative transition-all ' + (this.state.isOpen ? '' : '-translate-y-full -mb-10')}>
                            <span className="material-icons text-transparentgray">
                                location_on
                            </span>
                            <input className='flex-grow placeholder:text-transparentgray text-sm focus-visible:outline-none px-1 py-2' placeholder='Lieu' onChange={this.handleSearch} ref={this.citySearchField} />
                        </div>

                        <div className={'overflow-hidden overflow-y-scroll transition-transform'}>
                            {
                                this.state.users.map((elem, index) => {
                                    return this.showUser(elem, index);
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default InviteMenu;
