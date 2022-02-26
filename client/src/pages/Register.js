import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../components/Button'
import Checkbox from '../components/Checkbox';
import InputField from '../components/InputField';
import PictureField from '../components/PictureField';

class Register extends React.Component {
    
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
                    <form className='grid gap-5 mt-10'>
                        <InputField id='prenom' className='col-span-4'>Prénom *</InputField>
                        <InputField id='nom' className='col-span-4'>Nom *</InputField>
                        <PictureField className='col-span-2 row-span-2 w-32 h-32'>Photo</PictureField>
                        <InputField id='mail' type='email' className='col-span-8'>Adresse e-mail *</InputField>
                        <InputField id='ville' className='col-span-7'>Ville *</InputField>
                        <InputField id='naissance' type='date' className='col-span-3'>Date de naissance *</InputField>
                        <InputField id='telephone' className='col-span-10'>N° de téléphone</InputField>
                        <InputField id='mdp' type='password' className='col-span-5'>Mot de passe *</InputField>
                        <InputField id='confmdp' type='password' className='col-span-5'>Confirmation mot de passe *</InputField>
                        <div className='flex justify-between col-span-10'>
                            <Checkbox id='notif'>Je souaite recevoire les notifications par mail</Checkbox> <div>* champs obligatoires</div>
                        </div>
                        
                        <Button className='col-span-10'>S'inscrire</Button>
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
