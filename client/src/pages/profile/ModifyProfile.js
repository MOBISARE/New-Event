import React from 'react'
import InputField from '../../components/InputField'
import PictureField from '../../components/PictureField'
import Checkbox from '../../components/Checkbox'
import axios from 'axios'
import LinkButton from '../../components/LinkButton';
import { Link } from 'react-router-dom';

class ModifyProfile extends React.Component {

    handleRegister = async (e) => {
        e.preventDefault();

        // Envoi des données modifiées
        let registerRes = await axios({
            method: "post",
            url:"/api/compte/inscription",
            data: {
                nom: document.getElementById("nom").value,
                prenom: document.getElementById("prenom").value,
                email: document.getElementById("mail").value,
                mot_de_passe: document.getElementById("mdp").value,
                naissance: document.getElementById("naissance").value,
                ville: document.getElementById("ville").value,
                departement: "00",
                no_telephone: document.getElementById("telephone").value,
                img_profil: document.getElementById("picture").value
            }
        })

        window.location = "/";
    }
    catch(err){
        if(err.response.status === 400){
            document.getElementById("mail").setCustomValidity("L'email est déjà lié à un compte");
            document.getElementById("mail").reportValidity();
        }
    }

    render(){
        return(
            <div className='bg-white rounded-md drop-shadow-md max-w-lg mx-auto p-8 flex'>
                <Link to={'/'} className='col-span-1 relative -left-5'>
                            <span className='material-icons text-5xl'>
                                keyboard_arrow_left
                            </span>
                </Link>
                {/*Formulaire de modification des données personnelles*/}
                <form onSubmit={this.handleRegister}>
                    <div>
                        <h1 className='text-2xl text-darkgray border-solid border-b-selected-gray-2 border-0 border-b-2 mt-4 mb-4'>Profil :</h1>
                        <InputField id='prenom' type='text' className='text-darkgray mb-2' required>Prénom *</InputField>
                        <InputField id='nom' type='text' className='text-darkgray mb-2' required>Nom *</InputField>
                        <InputField id='ville' type='text' className='text-darkgray mb-2' required>Ville *</InputField>
                        <InputField id='naissance' type='date' className='text-darkgray mb-2' required>Date de Naissance *</InputField>
                        <h2 className='mb-2 text-darkgray'>Photo :</h2>
                        <PictureField id='picture' className='col-span-2 row-span-2 w-32 h-32'></PictureField>
                    </div>

                    <div>
                        <h1 className='text-2xl text-darkgray border-solid border-b-selected-gray-2 border-0 border-b-2 mt-4 mb-4'>Contact :</h1>

                        <InputField id='email' type='email' className='w-full mb-2' required>Adresse email *</InputField>
                        <InputField id='no_telephone' type='tel' className='w-full mb-2' required>N° de Téléphone</InputField>
                    </div>

                    <div>
                        <h1 className='text-2xl text-darkgray border-solid border-b-selected-gray-2 border-0 border-b-2 mt-4 mb-4'>Notifications :</h1>
                        <Checkbox id='notif'>Je souhaite recevoir les notifications par mail</Checkbox>
                    </div>

                    <div>
                        <h1 className='text-2xl text-darkgray border-solid border-b-selected-gray-2 border-0 border-b-2 mt-4 mb-4'>Changement de mot de passe :</h1>
                        <h2>Ancien mot de passe *</h2>
                        <InputField id='mot_de_passe' type='password' className='w-full mb-2' required></InputField>
                        <h2>Nouveau mot de passe *</h2>
                        <InputField id='mot_de_passe' type='password' className='w-full mb-2' required></InputField>
                        <h2>Confirmation du mot de passe *</h2>
                        <InputField id='mot_de_passe' type='password' className='w-full mb-2' required></InputField>
                        <LinkButton bg_class='bg-white' text_class='text-black' to='/' width='0'>Modifier mot de passe</LinkButton>
                    </div>

                    <div>
                        <h1 className='text-2xl text-red-500'>Suppression du compte :</h1>
                        <p>Attention la suppression du compte est définitive</p>
                        <LinkButton className='col-span-2 mb-2' bg_class='bg-red-500' text_class='text-white' to='/' width='0'>Supprimer</LinkButton>
                    </div>

                    <LinkButton className='col-span-2 mb-2' bg_class='bg-green' text_class='text-white' to='/' width='0'>Valider</LinkButton>
                </form>
                
            </div>
        );
    }
}
export default ModifyProfile;