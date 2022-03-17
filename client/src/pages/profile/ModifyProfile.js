import React from 'react'
import InputField from '../../components/InputField'
import PictureField from '../../components/PictureField'
import Checkbox from '../../components/Checkbox'
import axios from 'axios'
import LinkButton from '../../components/LinkButton';

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
            <div className='py-24 bg-gradient-to-r from-purple to-blue h-screen w-full flex items-center justify-center'>

                <div className='w-[800px] rounded-3xl shadow-lg bg-gray py-6 px-20'>
                    {/*Formulaire de modification des données personnelles*/}
                    <form className='grid gap-5 mt-10' onSubmit={this.handleRegister}>

                        <div>
                            <h1 className='text-2xl'>Profil :</h1>
                            <br/>
                            <h2>Prénom *</h2>
                            <InputField id='prenom' type='text' required></InputField>
                            <br/>
                            <h2>Nom *</h2>
                            <InputField id='nom' type='text'required></InputField>
                            <br/>
                            <h2>Ville *</h2>
                            <InputField id='ville' type='text' required></InputField>
                            <br/>
                            <h2>Date de Naissance *</h2>
                            <InputField id='naissance' type='date' required></InputField>
                            <br/>
                            <h2 className='mb-2'>Photo</h2>
                            <PictureField id='picture' className='col-span-2 row-span-2 w-32 h-32'></PictureField>
                            <br/>
                        </div>

                        <div>
                            <h1 className='text-2xl'>Contact :</h1>
                            <h2>Adresse email *</h2>
                            <InputField id='email' type='email' className='w-full' required></InputField>
                            <h2>N° de Téléphone</h2>
                            <InputField id='no_telephone' type='tel' className='w-full' required></InputField>
                        </div>

                        <div>
                            <h1 className='text-2xl'>Notifications :</h1>
                            <Checkbox id='notif'>Je souhaite recevoir les notifications par mail</Checkbox>
                        </div>

                        <div>
                            <h1 className='text-2xl'>Changement de mot de passe :</h1>
                            <h2>Ancien mot de passe *</h2>
                            <InputField id='mot_de_passe' type='password' className='w-full' required></InputField>
                            <h2>Nouveau mot de passe *</h2>
                            <InputField id='mot_de_passe' type='password' className='w-full' required></InputField>
                            <h2>Confirmation du mot de passe *</h2>
                            <InputField id='mot_de_passe' type='password' className='w-full' required></InputField>
                            <LinkButton bg_class='bg-white' text_class='text-black' to='/' width='0'>Modifier mot de passe</LinkButton>
                        </div>

                        <div>
                            <h1 className='text-2xl text-red-500'>Suppression du compte :</h1>
                            <p>Attention la suppression du compte est définitive</p>
                            <LinkButton className='col-span-2' bg_class='bg-red-500' text_class='text-white' to='/' width='0'>Supprimer</LinkButton>
                        </div>

                    </form>
                    <div>
                        <LinkButton className='col-span-2' bg_class='bg-green' text_class='text-white' to='/' width='0'>Valider</LinkButton>
                    </div>
                </div>
            </div>
        );
    }
}
export default ModifyProfile;