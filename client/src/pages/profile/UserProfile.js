import React from 'react'
import axios from "axios"
import LinkButton from '../../components/LinkButton';

class UserProfile extends React.Component {

    constructor(props){
        super(props);
        this.state = {myprofile: [], isMyProfileLoaded: false};
    }

    componentDidMount = () => {
        axios.get('/api/compte/mon-profil')
        .then((res) => {
            this.setState({myprofile: res.data, isMyProfileLoaded: true});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    /*{
                    ! this.state.isMyProfileLoaded
                    ? this.state.myprofile.map((elem) => {
                        return(
                            prenom={elem.prenom}
                            nom={elem.nom}
                            ville={elem.ville}
                            departement={elem.departement}
                            photo={elem.photo}
                            dateDeNaissance={elem.naissance}
                            email={elem.email}
                            telephone={elem.no_telephone}
                        )
                },*/
    render(){
        return(
            
            <div className='bg-gray'>
                
                <div className=' bg-white rounded-lg drop-shadow-md max-h-lg mx-auto  flex '>
                    <div className='pb-40 px-8 border-solid border-0 border-r-2 border-r-selected-gray-2 mt-10 mr-10'>
                        
                            <img src='/images/icon.png'></img>
                            <h1 className='font-bold inline '></h1>
                            <h1 className='font-bold inline'></h1>
                            <LinkButton bg_class='h-1 px-1 m-2 bg-white' text_class='text-xs text-black' to='/modifier-profil' width='0'>Modifier informations</LinkButton>
                   </div>

                    <div className='mt-10 '>
                        <h2 className='font-bold mb-2'>Informations</h2>
                        <ul>
                            <li>Ville : </li>
                            <li>Département : </li>
                            <li>Date de Naissance : </li>
                        </ul>
                        <h2 className='font-bold mt-4 mb-2'>Contact</h2>
                        <ul>
                            <li>E-mail : abc@xyz.com</li>
                            <li>Téléphone : 06.01.02.03.04</li>
                        </ul>
                    </div>
                </div> 
            </div>
        );
    }
}

export default UserProfile;