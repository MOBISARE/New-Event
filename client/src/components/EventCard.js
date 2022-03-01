import React from "react"
import {Link} from "react-router-dom"

class EventCard extends React.Component {
    render() {
        return(
            <Link to='/evenement' className='w-72 rounded-lg bg-white m-3 flex flex-col justify-center shadow'>
                <img className='w-72 h-48 object-cover bg-green rounded-t-lg'
                     src={""} alt=" "/>
                <div className='p-2 border-t-8 border-green'>
                    <h5 className='text-lg font-bold'>{ this.props.title }</h5>
                    <p className='break-word' style={{hyphens:'auto'}}>
                        { this.props.description }
                    </p>
                    <div className='grid grid-cols-2 grid-rows-2 text-xs mt-2'>
                        <span className='flex items-center'>
                            <span className="material-icons md-18 mr-1">
                                people
                            </span>
                            { this.props.membersNumber }
                        </span>
                        <span className='flex items-center ml-auto'>{ this.props.startDate }</span>
                        <span className='flex items-center'>
                            <span className="material-icons md-18 mr-1">
                                place
                            </span>
                            { this.props.location }
                        </span>
                        <span className='flex items-center ml-auto'>{ this.props.endDate }</span>
                    </div>
                </div>
            </Link>
        )
    }
}

export default EventCard