import React from 'react'
import InputField from '../../components/InputField'
import PictureField from '../../components/PictureField'
import Checkbox from '../../components/Checkbox'
import axios from 'axios'
import LinkButton from '../../components/LinkButton'
import Button from "../../components/Button"
import FormButton from "../../components/FormButton"
import { Link } from 'react-router-dom';

class ModifyProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {myprofile: [], isMyProfileLoaded: false};
    }

    componentDidMount = () => {
        axios.get('/api/compte/')
        .then((res) => {
            console.log(res.data);
            this.setState({myprofile: res.data, isMyProfileLoaded: true});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    handleRegister = async (e) => {
        e.preventDefault();

        // Envoi des données modifiées
        let registerRes = await axios({
            method: "post",
            url:"/api/compte/modifier",
            data: {
                nom: document.getElementById("nom").value,
                prenom: document.getElementById("prenom").value,
                email: document.getElementById("mail").value,
                mot_de_passe: document.getElementById("mdp").value,
                naissance: document.getElementById("naissance").value,
                ville: document.getElementById("ville").value,
                departement: document.getElementById("departement").value,
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

    supprimerProfile = () => {
        axios.post('/api/compte/supprimer/' /*+ this.props.eventModel.id*/)
            .then((res) => {
                //revenir à la page d'accueil et déconnecter l'utilisateur
                this.props.container.props.router.navigate('/');
            })
            .catch((err) => {
                console.log(err);
            })
    }

    modifierMDP = () => {
        axios.post('/api/compte/modifieMdp')
            .then((res) => {
                this.props.container.props.router.navigate('/modifier-profil');
            })
            .catch((err) => {
                console.log(err);
            })
    }

    saveProfile = async(e) => {
        e.preventDefault();
        let data = new FormData();

        data.append('nom', document.getElementById('nom').value);
        data.append('prenom', document.getElementById('prenom').value);
        data.append('naissance', document.getElementById('naissance').value);
        data.append('departement', document.getElementById('departement').value);
        data.append('ville', document.getElementById('ville').value);
        data.append('img_profil', document.getElementById('img_profil').files[0]);
        data.append('no_telephone', document.getElementById('no_telephone').value);
        data.append('email', document.getElementById('email').value);
        axios.put('/api/compte/modifier/', data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then((res) => {
                this.props.container.setState({profile: res.data, isModifing: false})
            })
            .catch((err) => {
                console.log(err);
            })
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
                <form onSubmit={this.saveProfile}>
                    <div>
                        <h1 className='text-2xl text-darkgray border-solid border-b-selected-gray-2 border-0 border-b-2 mt-4 mb-4'>Profil :</h1>
                        <InputField id='prenom' type='text' className='text-darkgray mb-2' /*placeholder={this.state.myprofile.prenom.placeholder}*/ required>Prénom *</InputField>
                        <InputField id='nom' type='text' className='text-darkgray mb-2' required>Nom *</InputField>
                        <InputField id='ville' type='text' className='text-darkgray mb-2' required>Ville *</InputField>
                        <InputField id='naissance' type='date' className='text-darkgray mb-2' required>Date de Naissance *</InputField>
                        <h2 className='mb-2 text-darkgray'>Photo :</h2>
                        <PictureField id='picture' className='col-span-2 row-span-2 w-32 h-32'></PictureField>
                    </div>

                    <div>
                        <h1 className='text-2xl text-darkgray border-solid border-b-selected-gray-2 border-0 border-b-2 mt-4 mb-4'>Contact :</h1>

                        <InputField id='email' type='email' className='w-full mb-2' required>Adresse email *</InputField>
                        <InputField id='no_telephone' type='tel' className='w-full mb-2'>N° de Téléphone</InputField>
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
                        <Button className='bg-red-600' onClick={this.supprimerProfile}>Supprimer</Button>
                    </div>
                    <FormButton value='Valider' name='submit-action' className='bg-green-valid min-w-full'/>

                </form>
                
            </div>
        );
    }
}
export default ModifyProfile;