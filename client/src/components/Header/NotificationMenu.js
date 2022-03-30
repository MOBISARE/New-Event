import React, { createRef } from 'react';
import axios from 'axios';
import NotificationDropDown from './NotificationDropDown';


class NotificationMenu extends React.Component {

    constructor(props){
        super(props);
        this.state = { isLoading : true, notifications: [] };

        this.notificationButton = React.createRef();
        this.notificationDropDown = React.createRef();
    }

    componentDidMount = () => {
        this.refreshNotifs();
    }

    refreshNotifs = () => {
        console.log('refresh');
        axios.get('/api/notification/getAll')
        .then((res) => {
            this.notificationDropDown.current.setState({notifications: res.data});
            this.setState({isLoading: false});
        })
        .catch((err) => {
            console.log(err);
        })
    }

    render(){
        return(
            <div className='relative'>
                {
                !this.state.isLoading && this.notificationDropDown.current.state.notifications.length != 0
                ? <div className='absolute w-5 h-5 rounded-full bg-red-600 -top-2 -right-2 text-center text-white'>{this.notificationDropDown.current.state.notifications.length > 0 ? this.notificationDropDown.current.state.notifications.length : '9+'}</div>
                : <></>
                }
                <button className='bg-darkgray rounded-lg w-10 h-10' onClick={() => {this.notificationDropDown.current.toggleActive();}} ref={this.notificationButton}>
                <span className="material-icons text-4xl text-white">
                    notifications
                </span>
                </button>
                <NotificationDropDown ref={this.notificationDropDown} button={this.notificationButton} refresh={this.refreshNotifs}/>
            </div>
        );
    }
}

export default NotificationMenu;