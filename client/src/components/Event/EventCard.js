import React from "react"
import {Link} from "react-router-dom"

class EventCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { descriptionVisible: false }
    }

    render() {
        return(
            <Link to={'/evenement/'+this.props.id} className='w-72 h-64 rounded-lg bg-white m-3 flex flex-col justify-center shadow
                        transition-transform ease-in-out hover:delay-75 hover:duration-300 hover:scale-105 group'
                        onMouseEnter={() => {
                            this.setState({ descriptionVisible: true })
                        }}
                        onMouseLeave={() => {
                            this.setState({ descriptionVisible: false })
                        }}
            >
                <div className='bg-darkgray w-72 grow rounded-t-lg overflow-hidden'>
                    <img className='object-cover w-full h-auto'
                         src={this.props.imgUrl} onError={event => event.target.hidden=true} alt=" "/>
                </div>
                <div className='p-2 border-t-8 border-green transition-[height] group-hover:ease-in-out group-hover:duration-700 group-hover:delay-75 group-hover:h-4/5'>
                    <h5 className='text-xl font-bold'>{ this.props.title }</h5>
                    <p className={'description-event max-h-[54%] overflow-hidden '
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