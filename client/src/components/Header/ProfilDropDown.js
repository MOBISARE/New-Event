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

        var activeClasses = this.state.active ? 'text-left bg-white absolute right-0 drop-shadow-2xl border rounded-md border-transparentgray flex flex-col' : 'hidden text-left bg-white absolute right-0 drop-shadow-2xl border rounded-md border-transparentgray flex flex-col';

        return(
            <div id='dropdown-account' className={activeClasses}>
                {dropDownElems.map(elem => {
                    console.log("test");
                    if(elem.name == 'hr') return(<hr  key={elem.key}/>)
                    else return(<Link key={elem.key} to={elem.link} className='inline-block px-3 whitespace-nowrap hover:bg-transparentgray py-1'>{elem.name}</Link>)
                })}
            </div>
        );
    }
}

export default ProfilDropDown;
