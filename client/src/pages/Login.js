import React from 'react';
import { Link } from 'react-router-dom';

import FormButton from '../components/FormButton';
import InputField from '../components/InputField'

class Login extends React.Component {

    handleLogin = (e) => {
        e.preventDefault();
        console.log(e);
    }
    
    render(){
        return(
            <div className='py-24 bg-gradient-to-r from-purple to-blue h-screen w-full flex items-center justify-center'>

                <div className='w-[600px] h-[370px] rounded-3xl shadow-lg bg-gray py-6 px-20'>

                    {/* BackButton + Title */}
                    <div className='grid grid-flow-col grid-cols-12'>
                        <Link to={'/'} className='col-span-1 relative -left-14'>
                            <span className='material-icons text-5xl'>
                                keyboard_arrow_left
                            </span>
                        </Link>

                        <h1 className='text-5xl font-bold text-darkgray text-center col-span-10'>Connexion</h1>
                    </div>

                    {/* Form */}
                    <form className='flex flex-col gap-5 mt-10' onSubmit={this.handleLogin}>
                        <InputField id='email' className='w-full' required>Adresse e-mail</InputField>
                        <InputField id='mdp' className='w-full' required>Mot de passe</InputField>
                        <FormButton value='Connexion'></FormButton>
                    </form>

                    {/* Links */}
                    <div className='flex justify-between mt-3'>
                        <Link to='/reinitialisation-mot-de-passe'>Mot de passe oublié ?</Link>
                        <Link to='/inscription'>Créer un compte</Link>
                    </div>

                </div>

                
            </div>
        );
    }
}

export default Login;
