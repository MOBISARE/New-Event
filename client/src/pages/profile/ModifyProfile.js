import React from 'react'
import InputField from '../../components/InputField'
import PictureField from '../../components/PictureField'
import Checkbox from '../../components/Checkbox'
import Button from '../../components/Button';

class ModifyProfile extends React.Component {
    render(){
        return(
            <div className='bg-gray'>
                <div className='bg-white rounded-md drop-shadow-md flex-1'>
                    <div>
                        <h1 className='text-2xl'>Profil :</h1>
                        <h2>Prénom</h2>
                        <InputField id='prenom' type='text' className='w-full' required></InputField>
                        <h2>Nom</h2>
                        <InputField id='nom' type='text' className='w-full' required></InputField>
                        <h2>Ville</h2>
                        <InputField id='ville' type='text' className='w-full' required></InputField>
                        <h2>Date de Naissance</h2>
                        <InputField id='naissance' type='date' className='w-full' required></InputField>
                        <h2 className='mb-2'>Photo</h2>
                        <PictureField id='picture' className='col-span-2 row-span-2 w-32 h-32'></PictureField>
                    </div>
                    <div>
                        <h1 className='text-2xl'>Contact :</h1>
                        <h2>Adresse email</h2>
                        <InputField id='email' type='email' className='w-full' required></InputField>
                        <h2>N° de Téléphone</h2>
                        <InputField id='no_telephone' type='tel' className='w-full' required></InputField>
                    </div>
                    <div>
                        <h1 className='text-2xl'>Notifications :</h1>
                        <Checkbox id='notif'>Je souaite recevoire les notifications par mail</Checkbox>
                    </div>
                    <div>
                        <h1 className='text-2xl'>Changement de mot de passe :</h1>
                        <h2>Ancien mot de passe</h2>
                        <InputField id='mot_de_passe' type='password' className='w-full' required></InputField>
                        <h2>Nouveau mot de passe</h2>
                        <InputField id='mot_de_passe' type='password' className='w-full' required></InputField>
                        <h2>Confirmation du mot de passe</h2>
                        <InputField id='mot_de_passe' type='password' className='w-full' required></InputField>
                        <Button bg_class='bg-white' text_class='text-black' to='/' width='0'>Modifier mot de passe</Button>
                    </div>
                    <div>
                        <h1 className='text-2xl text-red-500'>Suppression du compte :</h1>
                        <p>Attention la suppression du compte est définitive</p>
                        <Button bg_class='bg-red-500' text_class='text-white' to='/' width='0'>Supprimer</Button>
                    </div>
                </div>
                <Button bg_class='bg-green' text_class='text-white' to='/' width='0'>Valider</Button>
            </div>
        );
    }
}
export default ModifyProfile;