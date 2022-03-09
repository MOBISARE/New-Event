import React from 'react'

import UserMini from './UserMini'

class NeedLine extends React.Component {
    render(){
        return(
            <div className='border-b border-b-transparentgray p-2 pl-6 flex items-center'>
                <p className='title flex-grow'>{ this.props.title }</p>
                <UserMini firstname='Prénom' lastname='Nom' />
                <span className="material-icons pl-2 text-darkergray">
                    edit_note
                </span>
                <span className="material-icons pl-2 text-darkergray">
                    delete_outline
                </span>
            </div>
        );
    }
}

export default NeedLine
