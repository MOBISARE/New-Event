import React from 'react';
import { Link } from 'react-router-dom';


class NotificationDropDown extends React.Component {

    constructor(props){
        super(props);
        this.state = { active : false };
    }

    toggleActive = () => {
        this.setState({ active : !this.state.active })
    }

    render(){
        return(
            <div id='dropdown-notifications' className='text-left bg-white absolute right-0 drop-shadow-2xl border' hidden={!this.state.active}>
                test
            </div>
        );
    }
}

export default NotificationDropDown;