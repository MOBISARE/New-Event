import React from 'react'
import LinkButton from '../../components/LinkButton';

class UserProfile extends React.Component {
    render(){
        return(
            
            <div className='bg-gray'>
                <div className=' bg-white rounded-lg drop-shadow-md max-h-lg mx-auto  flex '>
                    <div className='pb-40 px-8 border-solid border-0 border-r-2 border-darkergray mt-10 mr-10'>
                        
                            <img src='/images/icon.png'></img>
                            <h1 className='font-bold inline '>Prénom </h1>
                            <h1 className='font-bold inline'>Nom</h1>
                            <LinkButton bg_class='h-1 px-1 m-2 bg-white' text_class='text-xs text-black' to='/modifier-profil' width='0'>Modifier informations</LinkButton>
                   </div>

                    <div className='mt-10 '>
                        <h2 className='font-bold mb-2'>Informations</h2>
                        <ul>
                            <li>Ville : </li>
                            <li>Département : </li>
                            <li>Date de Naissance : </li>
                        </ul>
                        <h2 className='font-bold mt-4 mb-2'>Contact</h2>
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