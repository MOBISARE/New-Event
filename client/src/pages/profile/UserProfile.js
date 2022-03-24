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
                
                <div className=' bg-white rounded-lg drop-shadow-md max-h-lg mx-auto  flex '>
                    <div className='pb-40 px-8 border-solid border-0 border-r-2 border-r-selected-gray-2 mt-10 mr-10'>
                        
                            <img src='/images/icon.png'>{this.state.myprofile.img_profil}</img>
                            <h1 className='font-bold inline '>{this.state.myprofile.prenom} </h1>
                            <h1 className='font-bold inline'>{this.state.myprofile.nom}</h1>
                            <LinkButton bg_class='h-1 px-1 m-2 bg-white' text_class='text-xs text-black' to='/modifier-profil' width='0'>Modifier informations</LinkButton>
                   </div>

                    <div className='mt-10 '>
                        <h2 className='font-bold mb-2'>Informations</h2>
                        <ul>
                            <li>Ville : {this.state.myprofile.ville}</li>
                            <li>Département : {this.state.myprofile.departement}</li>
                            <li>Date de Naissance : {new Date(this.state.myprofile.naissance).toLocaleDateString()}</li>
                        </ul>
                        <h2 className='font-bold mt-4 mb-2'>Contact</h2>
                        <ul>
                            <li>E-mail : {this.state.myprofile.email}</li>
                            <li>Téléphone : {this.state.myprofile.no_telephone}</li>
                        </ul>
                    </div>
                </div> 
            </div>
        );
    }
}

export default UserProfile;