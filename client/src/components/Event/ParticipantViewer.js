import React, { createRef } from 'react';
import { Link } from 'react-router-dom';


class ParticipantViewer extends React.Component {

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
                <div className='inline-block px-4 whitespace-nowrap py-1 text-md'>Participants</div>
                <div className='flex items-center border-y border-transparentgray px-1'>
                    <span className="material-icons text-transparentgray">
                        search
                    </span>
                    <input className='flex-grow placeholder:text-transparentgray focus-visible:outline-none p-1' placeholder='Rechercher des membres' />
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='flex w-full px-3 py-1 gap-2 items-center hover:bg-selected-gray'>
                        <img className='rounded-full h-6 w-6 bg-green' src={this.props.imgUrl} />
                        <span className='text-sm'>Prénom Nom</span>
                    </div>

                </div>
            </div>
        );
    }
}

export default ParticipantViewer;