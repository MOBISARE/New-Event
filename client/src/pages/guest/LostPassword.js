import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/Button'
import FormButton from '../../components/FormButton'
import InputField from '../../components/InputField'

class LostPassword extends React.Component {

    constructor(props){
        super(props);

        this.state = {formState: 0, email: '', token:''};
    }

    checkAndSendEmail = (e) => {
        e.preventDefault();
        axios.post("/api/compte/recupmdp", 
        { email : document.getElementById('email').value })
        .then((res) => {
            this.setState({email: document.getElementById('email').value, formState: this.state.formState + 1});
        })
        .catch((err) => {
            console.log(err);
            document.getElementById("email").setCustomValidity("L'adresse email n'est pas valide");
            document.getElementById("email").reportValidity();
        })
    }

    resendEmail = () => {
        axios.post("/api/compte/recupmdp", 
        { email : this.state.email })
        .then((res) => {
            // TODO : feedback
        })
        .catch((err) => {
            console.log(err);
        })
    }

    checkSecretCode = (e) => {
        e.preventDefault();
        axios.post("/api/compte/checkToken", 
        { email : this.state.email, token : document.getElementById('token').value })
        .then((res) => {
            this.setState({token : document.getElementById('token').value, formState: this.state.formState + 1});
            document.getElementById("form").reset();
        })
        .catch((err) => {
            console.log(err);
            document.getElementById("token").setCustomValidity("Le token n'est pas valide");
            document.getElementById("token").reportValidity();
        })
    }

    changePassword = (e) => {
        e.preventDefault();
        if(document.getElementById('password').value !== document.getElementById('cpassword').value) {
            document.getElementById("cpassword").setCustomValidity("Les mots de passe sont différent");
            document.getElementById("cpassword").reportValidity();
            return;
        }

        axios.put("/api/compte/modifieMdp", 
        { email : this.state.email, token : this.state.token, mot_de_passe : document.getElementById('password').value })
        .then((res) => {
            this.setState({formState: this.state.formState + 1});
        })
        .catch((err) => {
            console.log(err);
        })
    }

    form = () => {
        switch(this.state.formState){
            case 0:
                return (
                    <form className='flex flex-col gap-5 mt-10' onSubmit={this.checkAndSendEmail} id='form'>
                        <InputField id='email' type='email' className='w-full' required>Adresse e-mail</InputField>

                        <FormButton>Confirmation</FormButton>
                    </form>
                )
            case 1:
                return (
                    <form className='flex flex-col gap-5 mt-10' onSubmit={this.checkSecretCode} id='form'>
                        <InputField id='email' type='email' className='w-full' disabled>Adresse e-mail</InputField>
                        <div className='flex flex-row gap-5 items-end'>
                            <InputField id='token' className='w-full' required>Code de récupération</InputField>
                            <Button bg_class='bg-purple' onClick={this.resendEmail}>Renvoyer</Button>
                        </div>

                        <FormButton>Confirmation</FormButton>
                    </form>
                )
            case 2:
                return (
                    <form className='flex flex-col gap-5 mt-10' id='form' onSubmit={this.changePassword}>
                        <InputField id='password' className='w-full' type='password' required>Nouveau mot de passe</InputField>
                        <InputField id='cpassword' className='w-full' type='password' required>Confirmer le mot de passe</InputField>

                        <FormButton>Confirmation</FormButton>
                    </form>
                )
            case 3:
                return (
                    <div>Mot de passe modifié</div>
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