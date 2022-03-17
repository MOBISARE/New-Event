import React from 'react'
import LinkButton from '../../components/LinkButton';

class UserProfile extends React.Component {
    render(){
        return(
            <div className='bg-gray'>
                <div className='bg-white rounded-md drop-shadow-md max-w-lg mx-auto p-8 flex'>
                    <div>
                        <img src='/images/icon.png'></img>
                        <h1 className='font-bold'>Prénom Nom</h1>
                        <LinkButton bg_class='bg-white' text_class='text-black' to='/modifier-profil' width='0'>Modifier informations</LinkButton>
                   </div>

                    <div>
                        <h2 className='font-bold'>Informations</h2>
                        <ul>
                            <li>Ville : </li>
                            <li>Département : </li>
                            <li>Date de Naissance : </li>
                        </ul>
                        <h2 className='font-bold'>Contact</h2>
                        <ul>
                            <li>E-mail : abc@xyz.com</li>
                            <li>Téléphone : 06.01.02.03.04</li>
                        </ul>
                    </div>
                </div> 
            </div>
        );
    }
}

export default UserProfile;