import React from "react"
import {Link} from "react-router-dom"

class EventCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { descriptionVisible: false }
    }

    render() {
        return(
            <Link to='/evenement' className='w-72 h-64 rounded-lg bg-white m-3 flex flex-col justify-center shadow
                        transition-transform ease-in-out hover:delay-150 hover:duration-300 hover:scale-105'
                        onMouseEnter={() => {
                            this.setState({ descriptionVisible: true })
                        }}
                        onMouseLeave={() => {
                            this.setState({ descriptionVisible: false })
                        }}
            >
                <div className='bg-darkgray w-72 grow rounded-t-lg'>
                    <img className='object-cover'
                         src={""} onError={event => event.target.hidden=true} alt=" "/>
                </div>
                <div className='p-2 border-t-8 border-green'>
                    <h5 className='text-xl font-bold'>{ this.props.title }</h5>
                    <p className={'description-event break-word'
                        + (this.state.descriptionVisible? "":" hidden")}
                       style={{hyphens:'auto'}}>
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