import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

import Checkbox from '../../components/Checkbox';
import FormButton from '../../components/FormButton';
import InputField from '../../components/InputField';
import PictureField from '../../components/PictureField';

class Register extends React.Component {

    handleRegister = async (e) => {
        e.preventDefault();
        console.log(e);

        try {
            let res = await axios({
                method: "get",
                url:"https://geo.api.gouv.fr/communes",
                params: {
                    nom: document.getElementById("ville").value,
                    field: "departement",
                    boost: "population",
                    limit: 5
                }
            })
            
            console.log(res);

            if(res.data[0] === null || res.data[0]._score < 1) {
                document.getElementById("ville").setCustomValidity("Cette ville n'existe pas");
                document.getElementById("ville").reportValidity();
                return;
            }
        }
        catch(err){
            console.log(err);
        }

        if(document.getElementById("mdp").value !== document.getElementById("confmdp").value){
            document.getElementById("confmdp").setCustomValidity("Les mots de passe sont différent");
            document.getElementById("confmdp").reportValidity();
            return;
        }
    }
    
    render(){
        return(
            <div className='py-24 bg-gradient-to-r from-purple to-blue h-screen w-full flex items-center justify-center'>

                <div className='w-[800px] rounded-3xl shadow-lg bg-gray py-6 px-20'>

                    {/* BackButton + Title */}
                    <div className='grid grid-flow-col grid-cols-12'>
                        <Link to={'/'} className='col-span-1 relative -left-14'>
                            <span className='material-icons text-5xl'>
                                keyboard_arrow_left
                            </span>
                        </Link>

                        <h1 className='text-5xl font-bold text-darkgray text-center col-span-10'>Inscription</h1>
                    </div>

                    {/* Form */}
                    <form className='grid gap-5 mt-10' onSubmit={this.handleRegister}>
                        <InputField id='prenom' className='col-span-4' required>Prénom *</InputField>
                        <InputField id='nom' className='col-span-4' required>Nom *</InputField>
                        <PictureField id='picture' className='col-span-2 row-span-2 w-32 h-32'>Photo</PictureField>
                        <InputField id='mail' type='email' className='col-span-8' required>Adresse e-mail *</InputField>
                        <InputField id='ville' className='col-span-7' required>Ville *</InputField>
                        <InputField id='naissance' type='date' className='col-span-3' required>Date de naissance *</InputField>
                        <InputField id='telephone' className='col-span-10'>N° de téléphone</InputField>
                        <InputField id='mdp' type='password' className='col-span-5' required>Mot de passe *</InputField>
                        <InputField id='confmdp' type='password' className='col-span-5' required>Confirmation mot de passe *</InputField>
                        <div className='flex justify-between col-span-10'>
                            <Checkbox id='notif'>Je souaite recevoire les notifications par mail</Checkbox> <div>* champs obligatoires</div>
                        </div>
                        
                        <FormButton className='col-span-10' value="S'inscrire"></FormButton>
                    </form>

                    {/* Links */}
                    <div className='mt-3'>
                        <Link to='/connexion'>J'ai déjà un compte</Link>
                    </div>

                </div>

                
            </div>
        );
    }
}

export default Register;
