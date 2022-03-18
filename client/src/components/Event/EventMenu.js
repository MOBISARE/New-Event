import axios from 'axios';
import React, { createRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';

class EventMenu extends React.Component {

    static defaultProps = {
        button: null,
        values: []
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

        return(
            <div className={'absolute right-0 rounded-md flex flex-col z-10 overflow-hidden ' + (this.state.active? '': 'hidden')} ref={this.DOM_element}>
                {
                    this.props.values.map((val) => {
                        return <Button className='rounded-none whitespace-nowrap py-1' onClick={val.onClick}>{val.title}</Button>
                    })
                }
            </div>
        );
    }
}

export default EventMenu;