import React, { createRef } from 'react';
import { Link } from 'react-router-dom';


class NotificationDropDown extends React.Component {

    static defaultProps = {
        button: null
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
    
    componentWillUnmount = () => {
        window.removeEventListener('click', this.checkClickOutside);
    }

    render(){
        var dropDownElems = [
        ]

        return(
            <div id='dropdown-account' className={'text-left bg-white absolute right-0 drop-shadow-sm border rounded-md border-transparentgray flex flex-col gap-1 py-1 min-w-[200px] ' + (this.state.active? '': 'hidden')} ref={this.DOM_element}>
                {dropDownElems.length > 0 ?
                dropDownElems.map(elem => {
                    return(<Link key={elem.key} to={elem.link} onClick={this.toggleActive} className='inline-block px-4 whitespace-nowrap hover:bg-selected-gray py-1 text-sm'>{elem.name}</Link>)
                })
                :
                <div className='inline-block px-4 whitespace-nowrap py-1 text-sm'>Vous n'avez pas de notification</div>
                }
            </div>
        );
    }
}

export default NotificationDropDown;