import React from "react";

class EventCard extends React.Component {
    render() {
        return(
            <div className='rounded-lg bg-white m-3 flex flex-col justify-center shadow'>
                <img src='/images/icon.png' className='' alt="Image de l'événement"/>
                <h5 className='text-lg font-bold'>Titre de l'événement</h5>
                <p>Description de l'événement</p>
                <span>5</span>
                <span>Nancy</span>
                <span>00/00/0000</span>
                <span>00/00/0000</span>
            </div>
        )
    }
}

export default EventCard