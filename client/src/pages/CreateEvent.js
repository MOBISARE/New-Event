import React from 'react'
import NeedList from "../components/Event/NeedList";
import InputField from "../components/InputField";
import FormButton from "../components/FormButton";
import axios from "axios";

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

    processImg = () => {
        const reader = new FileReader();

        reader.onloadend = () => {
            console.log(this.previewImage.current.style)
            this.previewImage.current.style.backgroundImage = "url('"+reader.result+"')";
        }

        if(this.hiddenInput.current.files[0]){
            reader.readAsDataURL(this.hiddenInput.current.files[0]);
        }
    }

    submitForm(evt) {
        let form = document.forms[0]
        console.log(form.elements)
        let submitActionCode = [
            'Annuler', 'Publier', 'Supprimer'
        ].indexOf(form.elements['submit-action'].value)
        axios.post('/api/evenement/creer', {
            titre: form.elements['title'].value,
            description: form.elements['description'].value,
            departement: form.elements['location'].value,
            debut: form.elements['start-date'].value,
            fin: form.elements['end-date'].value,
            etat: submitActionCode,
            img_banniere: form.elements['image'].value,
            id_proprietaire: 1,
        }).then(r => console.log(r)).catch(reason => console.log(reason))
        evt.preventDefault()
    }

    render(){
        return(
            <form className='max-w-[1000px] mx-auto' onSubmit={this.submitForm} >
                <div className='flex'>
                    <div className='flex flex-col w-3/5 bg-white rounded-3xl shadow mr-4'>
                        <div className='flex-grow bg-darkgray h-80 rounded-t-3xl overflow-hidden'>
                            <label htmlFor='image' className='hover:cursor-pointer w-full h-full inline-block relative flex items-center justify-center bg-cover'
                                   onInput={this.processImg} ref={this.previewImage}>
                                <input type='file' accept='image/*' id='image' ref={this.hiddenInput}
                                       className='absolute top-[-1000px]' name='img-banniere' />
                                <span className="material-icons text-white text-9xl transition hover:scale-110">
                                    upload_file
                                </span>
                            </label>
                        </div>
                        <div className='p-6 border-t-8 border-green'>
                            <InputField type='text' children='Titre' id='title' required name='titre'
                                        className='font-bold' />
                            <div className='mt-3'>
                                <label htmlFor='description' className='block leading-3 ml-4 text-lg z-0'>Description</label>
                                <textarea id='description' className='rounded-xl border-transparentgray w-full bg-transparent' rows='6' name='description' />
                            </div>
                        </div>
                    </div>
                    <div className='w-2/5'>
                        <div className='flex flex-col h-fit bg-white rounded-3xl shadow ml-4 p-6'>
                            <FormButton value='Publier' name='submit-action' className='bg-blue' />
                            <FormButton value='Annuler' name='submit-action' className='my-3 bg-neutral-500' />
                            <button name='submit-action' value='Supprimer'
                                className='border-solid border rounded-full border-transparentgray px-8 py-2 bg-red-600 text-xl text-gray cursor-pointer transition hover:scale-105'>
                                Supprimer</button>

                        </div>
                        <div className='flex flex-col h-fit bg-white rounded-3xl shadow ml-4 p-6 mt-10'>
                            <InputField type='date' id='start-date' children='Date de début' required min={today}
                                        className='max-w-min' name='debut'/>
                            <InputField type='date' id='end-date' children='Date de fin' required min={today}
                                        className='my-3 max-w-min' name='fin' />
                            <InputField type='text' id='location' name='location' children='Localisation' required />
                        </div>
                    </div>
                </div>

                <NeedList />
            </form>
        );
    }
}

export default CreateEvent
