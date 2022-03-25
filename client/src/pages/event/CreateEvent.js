import React from 'react'
import NeedList from "../../components/Event/NeedList";
import InputField from "../../components/InputField";
import FormButton from "../../components/FormButton";
import Button from "../../components/Button";
import axios from "axios";
import dateformat from 'dateformat'
import InputLocation from "../../components/InputLocation";

let today = new Date()
let dd = today.getDate()
let mm = today.getMonth() + 1
const yyyy = today.getFullYear()
if(dd<10){
    dd='0'+dd
}
if(mm<10){
    mm='0'+mm
}
today = yyyy+'-'+mm+'-'+dd

class CreateEvent extends React.Component {
    constructor(props) {
        super(props);
        this.hiddenInput = React.createRef()
        this.previewImage = React.createRef()
    }

    componentDidMount = () => {
        if(this.props.eventModel.img_banniere) this.previewImage.current.style.backgroundImage = "url('"+this.props.eventModel.img_banniere+"')"
    }

    processImg = () => {
        const reader = new FileReader();

        reader.onloadend = () => {
            this.previewImage.current.style.backgroundImage = "url('"+reader.result+"')"
            document.getElementById('delete-imginput').hidden = false
        }

        if(this.hiddenInput.current.files[0]){
            reader.readAsDataURL(this.hiddenInput.current.files[0]);
        }
    }

    publishEvent = async(e) => {
        e.preventDefault();

        try {
            let data = new FormData();

            data.append('titre', document.getElementById('title').value);
            data.append('description', document.getElementById('description').value);
            data.append('departement', document.getElementById('location').value);
            data.append('debut', document.getElementById('start-date').value);
            data.append('fin', document.getElementById('end-date').value);
            data.append('img_banniere', document.getElementById('image').files[0]);

            await axios.put('/api/evenement/modifier/' + this.props.eventModel.id, data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });

            let res = await axios.post('/api/evenement/publier/' + this.props.eventModel.id);

            this.props.container.setEvent(res.data);
        }
        catch (err) {
            console.log(err);
        }
    }

    saveEvent = async() => {
        let data = new FormData();

        data.append('titre', document.getElementById('title').value);
        data.append('description', document.getElementById('description').value);
        data.append('departement', document.getElementById('location').value);
        data.append('debut', document.getElementById('start-date').value);
        data.append('fin', document.getElementById('end-date').value);
        data.append('img_banniere', document.getElementById('image').files[0]);

        axios.put('/api/evenement/modifier/' + this.props.eventModel.id, data, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
            .then((res) => {
                this.props.container.setEvent(res.data);
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    deleteEvent = () => {
        axios.post('/api/evenement/supprimer/' + this.props.eventModel.id)
            .then((res) => {
                this.props.container.props.router.navigate('/');
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render(){
        return(
            <div className='max-w-[1000px] mx-auto'>
                <form onSubmit={this.publishEvent} >
                    <div className='flex'>
                        <div className='flex flex-col w-3/5 bg-white rounded-3xl shadow mr-4'>
                            <div className='relative flex-grow bg-darkgray h-80 rounded-t-3xl overflow-hidden'>
                                <label htmlFor='image' className='hover:cursor-pointer w-full h-full relative flex items-center justify-center bg-cover'
                                       onInput={this.processImg} ref={this.previewImage}>
                                    <input type='file' accept='image/*' id='image' ref={this.hiddenInput}
                                           className='absolute top-[-1000px]' name='img-banniere' />
                                    <span className="material-icons text-white text-9xl transition hover:scale-110">
                                    upload_file
                                </span>
                                </label>
                                <span className="material-icons absolute top-0 right-0 m-4 text-red-600 transition hover:scale-110 hover:cursor-pointer"
                                      onClick={(evt) => {
                                          this.previewImage.current.style.backgroundImage = ''
                                          this.hiddenInput.current.value = ''
                                          evt.target.hidden = true
                                      }} id='delete-imginput' hidden>
                                cancel
                            </span>
                            </div>
                            <div className='p-6 border-t-8 border-green'>
                                <InputField type='text' children='Titre' id='title' required name='titre' className='font-bold' defaultValue={this.props.eventModel.titre} />
                                <div className='mt-3'>
                                    <label htmlFor='description' className='block leading-3 ml-4 text-lg z-0'>Description</label>
                                    <textarea id='description' className='rounded-xl border-transparentgray w-full bg-transparent' rows='6' name='description' defaultValue={this.props.eventModel.description}/>
                                </div>
                            </div>
                        </div>
                        <div className='w-2/5'>
                            <div className='flex flex-col gap-3 h-fit bg-white rounded-3xl shadow ml-4 p-6'>
                                <FormButton value='Publier' name='submit-action' className='bg-blue' />
                                <Button className='bg-green-valid' onClick={this.saveEvent}>Sauvegarder</Button>
                                <Button name='submit-action' className='bg-neutral-500' onClick={() => this.props.container.props.router.navigate(-1)}>Annuler</Button>
                                <Button className='bg-red-600' onClick={this.deleteEvent}>Supprimer</Button>
                            </div>
                            <div className='flex flex-col h-fit bg-white rounded-3xl shadow ml-4 p-6 mt-10'>
                                <InputField type='date' id='start-date' children='Date de début' required min={today}
                                            className='max-w-min' name='debut' defaultValue={dateformat(this.props.eventModel.debut, 'yyyy-mm-dd')}/>
                                <InputField type='date' id='end-date' children='Date de fin' required min={today}
                                            className='my-3 max-w-min' name='fin' defaultValue={dateformat(this.props.eventModel.fin, 'yyyy-mm-dd')}/>
                                <InputLocation />
                            </div>
                        </div>
                    </div>
                </form>
                <NeedList eventId={this.props.eventModel.id}
                          actionType='create' />
            </div>
        );
    }
}

export default CreateEvent
