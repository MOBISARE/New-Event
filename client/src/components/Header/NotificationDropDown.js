import React, { createRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


class NotificationDropDown extends React.Component {

    static defaultProps = {
        button: null,
        notifications: []
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

    Notification = (elem, index) => {
        return (
            this.SimpleNotification(elem, index)
        )
    }

    SimpleNotification = (elem, index) => {

        let supprNotif = () => {
            axios.post('/api/notification/' + elem.id_notif + '/supprimer')
            .then((res) => {
                console.log(res);
                // update notifications
                this.props.refresh();
            })
            .catch((err) => {
                console.log(err);
            })
        }
        console.log(elem)

        return (
            <div key={index} className='flex  pl-4 hover:bg-selected-gray cursor-pointer gap-1 place-items-stretch'>
                <p className='flex-1 text-sm py-1'>{elem.message}</p>
                <div className='flex items-center justify-center px-3 hover:bg-selected-gray-2' onClick={supprNotif}>
                    <span className="material-icons hover:animate-shake">
                    delete
                    </span>
                </div>
            </div>
        )
    }

    ChoiceNotification = (elem, index) => {
        let accept = () => {
            axios.post('/api/notification/' + elem.id_notif + '/accepter')
            .then((res) => {
                this.props.refresh();
            })
            .catch((err) => {
                console.log(err);
            })
        }

        let refuse = () => {
            axios.post('/api/notification/' + elem.id_notif + '/refuser')
            .then((res) => {
                this.props.refresh();
            })
            .catch((err) => {
                console.log(err);
            })
        }

        return (
            <div key={index} className='flex  pl-4 hover:bg-selected-gray cursor-pointer gap-1 place-items-stretch'>
                <p className='flex-1 text-sm py-1'>{elem.message}</p>
                <div className='flex'>
                    <span className="material-icons flex items-center justify-center px-2 hover:bg-selected-gray-2 text-green-valid" onClick={accept}>
                    check
                    </span>
                    <span className="material-icons flex items-center justify-center px-2 hover:bg-selected-gray-2 text-red-500" onClick={refuse}>
                    clear
                    </span>
                </div>
            </div>
        );
    }

    render(){
        return(
            <div id='dropdown-account' className={'text-left bg-white absolute right-0 drop-shadow-sm border rounded-md border-transparentgray flex flex-col gap-1 py-1 min-w-[200px] max-w-[300px] w-max ' + (this.state.active? '': 'hidden')} ref={this.DOM_element}>
                {
                    this.props.notifications.length > 0 ?
                    this.props.notifications.map((elem, index) => {
                        if(elem.type === 0)
                            return this.Notification(elem, index);
                        else
                            return this.ChoiceNotification(elem, index);
                    })
                    :
                    <div className='inline-block px-4 whitespace-nowrap py-1 text-sm'>Vous n'avez pas de notification</div>
                }
            </div>
        );
    }
}

export default NotificationDropDown;