import React from 'react';
import { Link } from 'react-router-dom';


class ProfilDropDown extends React.Component {

    constructor(props){
        super(props);
        this.state = { active : false };
    }

    toggleActive = () => {
        this.setState({ active : !this.state.active })
    }

    render(){

        var dropDownElems = [
            { key:1, name: 'Mon Profil', link: '/profil' },
            { key:2, name: 'Mes événements', link: '/mes-evenements' },
            { key:3, name: 'hr' },
            { key:4, name: 'Déconnexion', link: '/dexonnexion' },
        ]

        var activeClasses = this.state.active ? '' : 'hidden';

        return(
            <div id='dropdown-account' className={'text-left bg-white absolute right-0 drop-shadow-sm border rounded-md border-transparentgray flex flex-col gap-1 py-1 ' + activeClasses}>
                {dropDownElems.map(elem => {
                    if(elem.name === 'hr') return(<hr className='text-transparentgray mx-2' key={elem.key}/>)
                    else return(<Link key={elem.key} to={elem.link} onClick={this.toggleActive} className='inline-block px-4 whitespace-nowrap hover:bg-selected-gray py-1 text-sm'>{elem.name}</Link>)
                })}
            </div>
        );
    }
}

export default ProfilDropDown;
