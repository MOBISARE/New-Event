import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/Button'
import FormButton from '../../components/FormButton'
import InputField from '../../components/InputField'

class LostPassword extends React.Component {

    constructor(props){
        super(props);

        this.state = {formState: 0};
    }

    form = () => {
        switch(this.state.formState){
            case 0:
                return (
                    <form className='flex flex-col gap-5 mt-10'>
                        <InputField id='email' type='email' className='w-full' required>Adresse e-mail</InputField>

                        <FormButton>Confirmation</FormButton>
                    </form>
                )
            case 1:
                return (
                    <form className='flex flex-col gap-5 mt-10'>
                        <InputField id='email' type='email' className='w-full' disabled>Adresse e-mail</InputField>
                        <div className='flex flex-row gap-5 items-end'>
                            <InputField id='code' className='w-full' required>Code de récupération</InputField>
                            <Button bg_class='bg-purple'>Renvoyer</Button>
                        </div>

                        <div onClick={() => this.setState({formState: this.state.formState+1})}>
                            <FormButton>Confirmation</FormButton>
                        </div>
                    </form>
                )
            case 2:
                return (
                    <form className='flex flex-col gap-5 mt-10'>
                        <InputField id='password' className='w-full' required>Nouveau mot de passe</InputField>
                        <InputField id='cpassword' className='w-full' required>Confirmer le mot de passe</InputField>

                        <div onClick={() => this.setState({formState: this.state.formState+1})}>
                            <FormButton>Confirmation</FormButton>
                        </div>
                    </form>
                )
        }
    }

    backbutton = () => {
        switch(this.state.formState){
            case 1:
            case 2:
                return (
                    <div className='col-span-1 relative -left-14 cursor-pointer' onClick={() => this.setState({formState: this.state.formState-1})}>
                        <span className='material-icons text-5xl'>
                            keyboard_arrow_left
                        </span>
                    </div>
                )
            default:
                return (
                    <Link to={'/connexion'} className='col-span-1 relative -left-14'>
                        <span className='material-icons text-5xl'>
                            keyboard_arrow_left
                        </span>
                    </Link>
                )
        }
    }

    render(){
        return(
            <div className='py-24 bg-gradient-to-r from-purple to-blue h-screen w-full flex items-center justify-center'>

                <div className='w-[600px] rounded-3xl shadow-lg bg-gray py-6 px-20'>

                    {/* BackButton + Title */}
                    <div className='grid grid-flow-col grid-cols-12'>
                        {this.backbutton()}

                        <h1 className='text-5xl font-bold text-darkgray text-center col-span-10'>Réinitialisation de mot de passe</h1>
                    </div>

                    {/* Form */}
                    {this.form()}

                </div>

                
            </div>
        );
    }
}

export default LostPassword;