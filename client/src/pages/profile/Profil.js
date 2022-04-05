import React from 'react'
import axios from "axios"
import withRouter from '../../withRouter';

class Profil extends React.Component {

    constructor(props){
        super(props);
        this.state = {profil: [], isProfileLoaded: false};
    }

    componentDidMount = () => {
        axios.get('/api/compte/profil/' + this.props.router.params.email)
        .then((res) => {
            console.log(res.data);
            this.setState({profil: res.data, isProfileLoaded: true});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    render(){
        if(!this.state.isProfileLoaded) return(<></>);

        return(
            
            <div className='bg-gray'>
                
                <div className=' bg-white rounded-lg drop-shadow-md max-h-lg mx-auto flex p-8 gap-5 min-h-[500px]'>
                    <div className='border-0 border-r border-r-selected-gray-2 pr-8 flex flex-col gap-2'>
                        <img className='w-48 h-48 rounded-lg border border-transparentgray text-center'
                             src={this.state.profil.img_profil} alt='Image de profil'/>
                        <div>
                            <h1 className='inline text-2xl'>{this.state.profil.prenom} </h1>
                            <h1 className='inline text-2xl'>{this.state.profil.nom}</h1>
                        </div>
                   </div>

                    <div className='ml-4 mt-2 flex flex-col gap-1'>
                        <h2 className='text-2xl mb-2'>Informations :</h2>
                        <div className='indent-8'>Ville : {this.state.profil.ville}</div>
                        <div className='indent-8'>Département : {this.state.profil.departement}</div>
                        <div className='indent-8'>Date de Naissance : {new Date(this.state.profil.naissance).toLocaleDateString()}</div>

                        <h2 className='text-2xl mt-10'>Contact</h2>
                        <div className='indent-8'>Adresse e-mail : {this.state.profil.email}</div>
                        <div className='indent-8'>Téléphone : {this.state.profil.no_telephone || "non renseigné."}</div>
                    </div>
                </div> 
            </div>
        );
    }
}

export default withRouter(Profil);