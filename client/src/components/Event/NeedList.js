import React from 'react'

import UserMini from "../UserMini";
import CreateNeed from "./CreateNeed";
import axios from "axios";

class NeedLine extends React.Component {
    render(){
        return(
            <div className='border-b border-b-transparentgray p-2 pl-6 flex items-center'
                 key={this.props.need.id}>
                <p className='title flex-grow'>{ this.props.need.description }</p>
                <UserMini firstname={this.props.need.participant.prenom || 'Prenom'} lastname={this.props.need.participant.nom || 'Nom'} />
                {
                    (this.props.actionType==='show')? '':
                        <div>
                            <span className="material-icons pl-2 text-darkergray hover:cursor-pointer"
                                  onClick={() => this.props.modify()}>
                                edit_note
                            </span>
                            <span className="material-icons pl-2 text-darkergray hover:cursor-pointer"
                                  onClick={() => this.props.delete(this.props.need.id)}>
                                delete_outline
                            </span>
                        </div>
                }

            </div>
        );
    }
}


class NeedList extends React.Component {
    constructor(props) {
        super(props);
        this.componentAddNeed = React.createRef()
        this.needList = React.createRef()
        this.state = {
            needs: this.props.needs || [],
        }

    }

    async actualiser() {
        let needs = await axios.get("/api/evenement/"+this.props.eventId+"/besoins").catch(reason => {
            if (reason.response.status===404)
                return []
            else
                console.log(reason)
        })
        this.setState({
            needs: needs.data
        })
    }

    async addNeed(need) {
        let res = await axios.post("/api/evenement/"+this.props.eventId+"/besoin/creer", need).catch(console.log)
        need.id = res.data.id_besoin
        need.participant = res.data.participant
        this.setState({
            needs: this.state.needs.concat([need])
        })
    }

    async modifyNeed() {

    }

    deleteNeed(id, need) {
        axios.post(`/api/evenement/${this.props.eventId}/besoin/${id}/supprimer`)
        this.state.needs.splice(this.state.needs.indexOf(need),1)
        this.setState({
            needs: this.state.needs
        })
    }

    handlerInputNeedList(evt) {
        let inputText = new RegExp(evt.target.value, "i")
        let needlines = document.getElementById('need-list').children
        for (let needline of needlines) {
            let containsInput = needline.querySelector('.title').innerText
                .search(inputText)+1 // incrémente de 1 pour le cas où inputText est trouvé au début du titre
            if (containsInput) needline.classList.remove("hidden")
            else needline.classList.add("hidden")
        }
    }

    render(){

        return(
            <div className='flex flex-col w-full min-h-[450px] bg-white rounded-3xl shadow mt-8 p-4'>
                <div className='text-xl ml-4 mb-2 flex justify-between'>
                    Besoins
                    {
                        (this.props.actionType==='show')? '':
                            <button type='button' className='w-max rounded-full px-4 py-1 bg-darkgray text-lg text-gray transition hover:scale-105 '
                                    onClick={() => this.componentAddNeed.current.showComponent() }>Ajouter un besoin</button>
                    }
                </div>
                <div className='flex flex-col flex-grow border border-transparentgray rounded-lg'>
                    <div className='m-1 flex items-center'>
                            <span className="material-icons text-transparentgray">
                                search
                            </span>
                        <input className='flex-grow placeholder:text-transparentgray'
                               placeholder='Besoin de patates...' onInput={this.handlerInputNeedList} />
                    </div>
                    <div id='need-list' ref={this.needList}
                         className='flex-grow overflow-y-scroll border-t border-t-transparentgray'>
                        {
                            this.state.needs && this.state.needs.length>0 ?
                                this.state.needs.map((value) => {
                                    return <NeedLine need={value} actionType={this.props.actionType}
                                                     delete={(id) => this.deleteNeed(id)} modify={() => this.modifyNeed()} />
                                }, "")
                                : <p className='text-center m-2'>Aucun besoin pour l'instant.</p>
                        }
                    </div>
                </div>

                {
                    (this.props.actionType==='show')? '':
                        <CreateNeed ref={this.componentAddNeed} titleWindow='Créer un besoin'
                                    addNeed={(need) => this.addNeed(need)} />
                }
            </div>
        );
    }
}

export default NeedList
