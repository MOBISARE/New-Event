import React from 'react'

class UserMini extends React.Component {
    render(){
        return(
            <div className='flex items-center rounded-full h-8 border border-transparentgray p-2 w-fit'>
                <img className='rounded-full h-4 w-4 bg-green mr-1' src={this.props.imgUrl} />
                <span>{this.props.firstname} {this.props.lastname}</span>
            </div>
        );
    }
}

export default UserMini
