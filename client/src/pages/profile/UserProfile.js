import React from 'react'
import axios from "axios"
import LinkButton from '../../components/LinkButton';

class UserProfile extends React.Component {

    constructor(props){
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

    render(){
        if(!this.state.isMyProfileLoaded) return(<></>);

        return(
            
            <div className='bg-gray'>
                
                <div className=' bg-white rounded-lg drop-shadow-md max-h-lg mx-auto flex p-8 gap-5 min-h-[500px]'>
                    <div className='border-0 border-r border-r-selected-gray-2 pr-8 flex flex-col gap-2'>
                        <img className='w-48 h-48 rounded-lg border border-transparentgray text-center'
                             src={this.state.myprofile.img_profil} alt='Image de profil'/>
                        <div>
                            <h1 className='inline text-2xl'>{this.state.myprofile.prenom} </h1>
                            <h1 className='inline text-2xl'>{this.state.myprofile.nom}</h1>
                        </div>
                        
                        
                        <LinkButton bg_class='bg-transparent' text_class='text-sm text-black' to='/modifier-profil'>Modifier profil</LinkButton>
                   </div>

                    <div className='ml-4 mt-2 flex flex-col gap-1'>
                        <h2 className='text-2xl mb-2'>Informations :</h2>
                        <div className='indent-8'>Ville : {this.state.myprofile.ville}</div>
                        <div className='indent-8'>Département : {this.state.myprofile.departement}</div>
                        <div className='indent-8'>Date de Naissance : {new Date(this.state.myprofile.naissance).toLocaleDateString()}</div>

                        <h2 className='text-2xl mt-10'>Contact</h2>
                        <div className='indent-8'>Adresse e-mail : {this.state.myprofile.email}</div>
                        <div className='indent-8'>Téléphone : {this.state.myprofile.no_telephone || "non renseigné."}</div>
                    </div>
                </div> 
            </div>
        );
    }
}

export default UserProfile;