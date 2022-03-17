import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../../withRouter';


class ProfilDropDown extends React.Component {

    constructor(props){
        super(props);
        this.state = { active : false };
        this.DOM_element = React.createRef();
    }

    toggleActive = () => {
        this.setState({ active : !this.state.active })

        if(!this.state.active) window.addEventListener('click', this.checkClickOutside);
        else window.removeEventListener('click', this.checkClickOutside);
    }

    logout = () => {
        axios({
            method: "post",
            url: "/api/compte/deconnexion"
        })
        .then((res) => {
            window.location = "/";
        })
    }

    checkClickOutside = (e) => {
        if(this.state.active && !this.DOM_element.current.contains(e.target) && !this.props.button.current.contains(e.target)) {
            this.setState({ active : false })
            window.removeEventListener('click', this.checkClickOutside);
        }
    }

    componentWillUnmount = () => {
        window.removeEventListener('click', this.checkClickOutside);
    }

    createEvent = () => {
        axios.put('/api/evenement/creer')
        .then(res => {
            this.props.router.navigate("/evenement/" + res.data);
        })
        .catch((err) => {
            console.log(err);
        })
        this.toggleActive();
    }

    render(){

        var dropDownElems = [
            { key:1, name: 'Mon Profil', link: '/mon-profil' },
            { key:2, name: 'Mes événements', link: '/mes-evenements' },
            { key:3, name: 'Créer un événement', fonc: this.createEvent },
            { key:4, name: 'hr' },
            { key:5, name: 'Déconnexion', fonc: this.logout },
        ]

        return(
            <div id='dropdown-account' className={'text-left bg-white absolute right-0 drop-shadow-sm border rounded-md border-transparentgray flex flex-col gap-1 py-1 ' + (this.state.active? '': 'hidden')} ref={this.DOM_element}>
                {dropDownElems.map(elem => {
                    if(elem.name === 'hr') return(<hr className='text-transparentgray mx-2' key={elem.key}/>)
                    else if(elem.link) return(<Link key={elem.key} to={elem.link} onClick={ this.toggleActive } className='inline-block px-4 whitespace-nowrap hover:bg-selected-gray py-1 text-sm'>{elem.name}</Link>)
                    else return(<div key={elem.key} to={elem.link} onClick={elem.fonc ? elem.fonc : this.toggleActive } className='inline-block px-4 whitespace-nowrap hover:bg-selected-gray py-1 text-sm cursor-pointer'>{elem.name}</div>)
                })}
            </div>
        );
    }
}

export default withRouter(ProfilDropDown);
