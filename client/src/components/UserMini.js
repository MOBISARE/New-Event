import React from 'react'

class UserMini extends React.Component {
    render(){
        return(
            <div className='rounded-full border border-transparentgray w-fit'>
                {
                    this.props.user.email?
                        <div className='flex items-center h-8 pr-2'>
                            <img className='rounded-full h-8 w-8 bg-green mr-1' src={this.props.user.img_profil} alt=''/>
                            <span className='username max-w-[130px] truncate'>
                                {this.props.user.prenom} {this.props.user.nom}</span>
                        </div>
                        : <span className='px-2 h-10'>Pas d'utilisateur</span>
                }
            </div>
        );
    }
}

export default UserMini
