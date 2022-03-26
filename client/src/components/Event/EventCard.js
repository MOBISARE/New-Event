import React from "react"
import {Link} from "react-router-dom"

class EventCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionVisible: false,
            bgColor: ['bg-green','bg-blue','bg-purple'][Math.floor(Math.random()*3)]
        }
    }

    render() {
        return(
            <Link to={'/evenement/'+this.props.id} className={'select-none w-72 h-64 rounded-lg bg-white m-3 flex flex-col justify-center shadow transition-transform ease-in-out delay-75 duration-300 hover:scale-105 ' + (this.props.etat === 0 ? 'grayscale' : '')}
                        onMouseEnter={() => {
                            this.setState({ descriptionVisible: true })
                        }}
                        onMouseLeave={() => {
                            this.setState({ descriptionVisible: false })
                        }}
            >
                <div className={'w-72 grow rounded-t-lg overflow-hidden ' + this.state.bgColor}>
                    <img className='object-cover w-full h-auto'
                         src={this.props.imgUrl} onError={event => event.target.hidden=true} alt=" "/>
                </div>
                <div className={'flex flex-col p-2 border-t-8 border-darkgray transition-[max-height] ease-in-out duration-1000 ' +
                    (this.state.descriptionVisible? "max-h-[80%]":"max-h-[6.8rem]")}>
                    <span className='font-bold text-xl'>
                        <h5 className='truncate'>{ this.props.title }</h5>
                    </span>
                    <p className={'description-event overflow-hidden '
                     + (this.state.descriptionVisible? "h-max":"")}
                       style={{hyphens:'auto'}}>
                        { (this.props.description==='NULL')? '':this.props.description }
                    </p>
                    <div className='grid grid-cols-2 grid-rows-2 text-xs mt-2'>
                        <span className='flex items-center'>
                            <span className="material-icons md-18 mr-1">
                                people
                            </span>
                            { (this.props.membersNumber==='?')? '0':this.props.membersNumber }
                        </span>
                        <span className='flex items-center ml-auto'>{ new Date(this.props.startDate).toLocaleDateString() }</span>
                        <span className='flex items-center'>
                            <span className="material-icons md-18 mr-1">
                                place
                            </span>
                            { this.props.location || "Non définie" }
                        </span>
                        <span className='flex items-center ml-auto'>{ new Date(this.props.endDate).toLocaleDateString() }</span>
                    </div>
                </div>
            </Link>
        )
    }
}

export default EventCard