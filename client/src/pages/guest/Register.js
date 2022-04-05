import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'

import Checkbox from '../../components/Checkbox';
import FormButton from '../../components/FormButton';
import InputField from '../../components/InputField';
import PictureField from '../../components/PictureField';
import InputLocation from "../../components/InputLocation";

class Register extends React.Component {

    handleRegister = async (e) => {
        e.preventDefault();

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
            
            if(res.data[0] === null || res.data[0]._score < 1) {
                document.getElementById("ville").setCustomValidity("Cette ville n'existe pas");
                document.getElementById("ville").reportValidity();
                return;
            }

            if(document.getElementById("mdp").value !== document.getElementById("confmdp").value){
                document.getElementById("confmdp").setCustomValidity("Les mots de passe sont différent");
                document.getElementById("confmdp").reportValidity();
                return;
            }

            if(!document.getElementById("mdp").value.match(/.*[a-z].*/) || !document.getElementById("mdp").value.match(/.*[A-Z].*/) || !document.getElementById("mdp").value.match(/.*[0-9].*/) || !document.getElementById("mdp").value.match(/.*[!@#\$%\^&\(\)\{\}\[\]:";'<>,\.\?\/~`_\+-=\|\]].*/) || document.getElementById("mdp").value.length < 8){
                document.getElementById("mdp").setCustomValidity("Le mot de passe doit contenir au moins une minuscule, une majuscule, une lettre, un caractère spéciaux et doit faire au minimum 8 charactère");
                document.getElementById("mdp").reportValidity();
                return;
            }

            let email = document.getElementById("mail").value
            let mdp = document.getElementById("mdp").value

            // Form data
            let data = new FormData();
            data.append("nom", document.getElementById("nom").value);
            data.append("prenom", document.getElementById("prenom").value);
            data.append("email", email);
            data.append("mot_de_passe", mdp);
            data.append("naissance", document.getElementById("naissance").value);
            data.append("ville", res.data[0].nom);
            data.append("departement", res.data[0].codeDepartement);
            data.append("no_telephone", document.getElementById("telephone").value);
            if(document.getElementById("picture").files[0] !== undefined)
                data.append("img_profil", document.getElementById("picture").files[0]);

            // Register
            await axios.post("/api/compte/inscription", data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });
            
            // Login
            await axios({
                method:"post",
                url:"/api/compte/connexion",
                withCredentials: true,
                data: {
                    email: email,
                    mot_de_passe: mdp
                }
            });

            window.location = "/";
        }
        catch(err){
            if(err.response.status === 400){
                document.getElementById("mail").setCustomValidity("L'email est déjà lié à un compte");
                document.getElementById("mail").reportValidity();
            }
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
                        <InputLocation inputId='ville' className='col-span-7' required>Ville *</InputLocation>
                        <InputField id='naissance' type='date' className='col-span-3' required>Date de naissance *</InputField>
                        <InputField id='telephone' className='col-span-10'>N° de téléphone</InputField>
                        <InputField id='mdp' type='password' className='col-span-5' required>Mot de passe *</InputField>
                        <InputField id='confmdp' type='password' className='col-span-5' required>Confirmation mot de passe *</InputField>
                        <div className='flex justify-between col-span-10'>
                            <Checkbox id='notif'>Je souhaite recevoir les notifications par mail</Checkbox> <div>* champs obligatoires</div>
                        </div>
                        
                        <FormButton className='col-span-10' value="S'inscrire"/>
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
