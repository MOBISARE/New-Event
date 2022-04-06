import React from 'react'
import InputField from '../../components/InputField'
import PictureField from '../../components/PictureField'
import Checkbox from '../../components/Checkbox'
import axios from 'axios'
import LinkButton from '../../components/LinkButton'
import Button from "../../components/Button"
import FormButton from "../../components/FormButton"
import { Link } from 'react-router-dom';
import InputLocation from "../../components/InputLocation";
import dateformat from "dateformat";

class ModifyProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myprofile: {},
            isMyProfileLoaded: false
        }
        this.spanPasswordChange = React.createRef();
    }

    componentDidMount = () => {
        axios.get('/api/compte')
            .then((res) => {
                res.data.naissance = dateformat(res.data.naissance, "isoDate")
                this.setState({myprofile: res.data, isMyProfileLoaded: true});
            })
            .catch((err) => {
                console.log(err);
            });
    }

    supprimerProfile = () => {
        if (window.confirm('Voulez-vous vraiment supprimer votre compte ?')) {
            axios.put('/api/compte/supprimer')
                .then(() => {
                    window.location = "/"
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    modifierMDP = (e) => {
        if (document.getElementById("new_mdp").value !== document.getElementById("confmdp").value) {
            document.getElementById("confmdp").setCustomValidity("Les mots de passe sont différent");
            document.getElementById("confmdp").reportValidity();
            return;
        }

        e.preventDefault()
        axios.put('/api/compte/modifierMdp', {
            old_password: document.getElementById('old_mdp').value,
            new_password: document.getElementById("new_mdp").value
        }).then(() => {
            this.spanPasswordChange.current.classList.add("hidden")
        }).catch((err) => {
            console.log(err)
            if(err.response.status === 400){
                document.getElementById('old_mdp').setCustomValidity("Le mot de passe est erroné");
                document.getElementById('old_mdp').reportValidity();
            }
            this.spanPasswordChange.current.classList.add("hidden")
        })
        this.spanPasswordChange.current.classList.remove("hidden")
    }

    saveProfile = async(e) => {
        e.preventDefault();
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

        if(res.data[0] === null) {
            document.getElementById("ville").setCustomValidity("Cette ville n'existe pas");
            document.getElementById("ville").reportValidity();
            return;
        }

        // Form data
        let data = new FormData();
        data.append("nom", document.getElementById("nom").value);
        data.append("prenom", document.getElementById("prenom").value);
        data.append("email", document.getElementById("mail").value);
        data.append("naissance", document.getElementById("naissance").value);
        data.append("ville", res.data[0].nom);
        data.append("departement", res.data[0].codeDepartement);
        data.append("no_telephone", document.getElementById("telephone").value);
        if(document.getElementById("picture").files[0] !== undefined)
            data.append("img_profil", document.getElementById("picture").files[0]);

        axios.put('/api/compte/modifier', data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then(() => {
                window.location = "mon-profil"
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render(){
        return(
            <div className='h-screen w-full'>
                <div className='rounded-3xl shadow-lg bg-white py-6 px-20'>
                    <div className='relative'>
                        <Link to={'/mon-profil'} className='absolute -left-14'>
                            <span className='material-icons text-5xl'>
                                keyboard_arrow_left
                            </span>
                        </Link>

                        <h1 className='text-5xl font-bold text-darkgray text-center'>Modifier mon profil</h1>
                    </div>

                    <form className='py-6' onSubmit={this.saveProfile}>
                        <div className='my-6 grid grid-cols-3 gap-4'>
                            <div className='grid gap-2 col-span-2'>
                                <InputField id='prenom' className='' defaultValue={this.state.myprofile.prenom} required>Prénom *</InputField>
                                <InputField id='nom' className='' defaultValue={this.state.myprofile.nom} required>Nom *</InputField>
                                <InputLocation inputId='ville' className='' defaultValue={this.state.myprofile.ville} required>Ville *</InputLocation>
                                <InputField id='naissance' type='date' required defaultValue={this.state.myprofile.naissance} >
                                    Date de naissance *</InputField>
                            </div>
                            <PictureField id='picture' className='col-span-1 h-3/4 w-auto' defaultValue={this.state.myprofile.img_profil}>Photo</PictureField>
                        </div>
                        <div className='my-6 grid gap-2'>
                            <h3 className='text-3xl border-b'>Contact</h3>
                            <InputField id='mail' type='email' className='' defaultValue={this.state.myprofile.email} required>Adresse e-mail *</InputField>
                            <InputField id='telephone' className='' defaultValue={this.state.myprofile.no_telephone}>N° de téléphone</InputField>
                        </div>
                        <div className='my-6'>
                            <h3 className='text-3xl border-b'>Notifications</h3>
                            <Checkbox className='m-4' id='notif' isChecked={this.state.myprofile.notif_email!==0}>Je souhaite recevoir les notifications par mail</Checkbox>
                        </div>
                        <FormButton className='w-full' value="Valider"/>
                    </form>
                    <form className='my-6' onSubmit={this.modifierMDP}>
                        <h3 className='text-3xl border-b'>Changement de mot de passe</h3>
                        <div className='grid gap-4 my-2 w-7/12'>
                            <InputField id='old_mdp' type='password' className='col-span-5' required>Ancien mot de passe</InputField>
                            <InputField id='new_mdp' type='password' className='col-span-5' required>Nouveau mot de passe</InputField>
                            <InputField id='confmdp' type='password' className='col-span-5' required>Confirmation du mot de passe</InputField>
                            <FormButton className='bg-white'>Modifier mon mot de passe</FormButton>
                            <span ref={this.spanPasswordChange} className='hidden animate-spin flex items-center justify-center material-icons'>
                                sync
                            </span>
                        </div>
                    </form>

                    <div className='my-6'>
                        <h3 className='text-3xl border-b'>Suppression du compte</h3>
                        <p className='my-2'>Attention ! La suppression du compte est définitive.</p>
                        <Button onClick={this.supprimerProfile} className='bg-red-600 w-max'>Supprimer mon compte</Button>
                    </div>
                </div>
            </div>
        );
    }
}
export default ModifyProfile;