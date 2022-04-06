import React from 'react'

import UserMini from "../UserMini";
import CreateNeed from "./CreateNeed";
import axios from "axios";

class NeedLine extends React.Component {
    render(){
        return(
            <div className={'border-b border-b-transparentgray p-2 pl-6 flex items-center'}>
                <p className='title flex-grow'>{ this.props.need.description }</p>
                <UserMini user={this.props.need} proposeMe={(this.props.proposeMe? () => this.props.proposeMe(this.props.need):undefined)} />
                <div className={(this.props.actionType==='show')? "invisible":"visible"}>
                    <span className="material-icons pl-2 text-darkergray hover:cursor-pointer"
                          onClick={() => this.props.modify(this.props.need) }>
                        edit_note
                    </span>
                    <span className="material-icons pl-2 text-darkergray hover:cursor-pointer"
                          onClick={(evt) => {
                              this.props.delete(this.props.need)
                              evt.target.classList.add('invisible')
                          }}>
                        delete_outline
                    </span>
                </div>
            </div>
        );
    }
}


class NeedList extends React.Component {
    constructor(props) {
        super(props);
        this.componentAddNeed = React.createRef()
        this.componentModifyNeed = React.createRef()
        this.needList = React.createRef()
        this.state = {
            needs: this.props.needs || [],
        }

    }

    componentDidMount() {
        this.actualiser()
    }

    async actualiser() {
        let needs = await axios.get("/api/evenement/"+this.props.eventId+"/besoins").catch(reason => {
            if (reason.response.status===404)
                return []
            else
                console.log(reason)
        })
        this.setState({
            needs: needs.data.liste,
            usermail: needs.data.usermail
        })
    }

    async addNeed(need) {
        await axios.post("/api/evenement/"+this.props.eventId+"/besoin/creer", need).catch(console.log)
        this.actualiser()
    }

    async modifyNeed(need) {
        axios.put(`/api/evenement/${this.props.eventId}/besoin/${need.id}/modifier`, need).catch(console.log)
        this.actualiser()
    }

    deleteNeed(need) {
        axios.post(`/api/evenement/${this.props.eventId}/besoin/${need.id}/supprimer`).then(() => {
            this.state.needs.splice(this.state.needs.indexOf(need),1)
            this.setState({
                needs: this.state.needs
            })
        })
    }

    proposeNeed(need) {
        axios.post("/api/evenement/"+this.props.eventId+"/besoin/proposer", need).catch(console.log)
    }

    proposeModifyNeed(need) {
        axios.post(`/api/evenement/${this.props.eventId}/besoin/${need.id}/demande/modifier`, need).catch(console.log)
    }

    proposeDeleteNeed(need) {
        axios.post(`/api/evenement/${this.props.eventId}/besoin/${need.id}/demande/suppression`, need).catch(console.log)
    }

    proposeMe(need) {
        axios.put(`/api/evenement/${this.props.eventId}/besoin/${need.id}/modifier`, {
            description: need.description,
            email: this.state.usermail
        }).catch(console.log)
        console.log({
            description: need.description,
            email: this.state.usermail
        })
    }

    handlerInputNeedList(evt) {
        //if (evt.target.value==="") return
        let inputText = new RegExp(evt.target.value, "i")

        let needlines = document.getElementById('need-list').children
        for (let needline of needlines) {
            let containsInput = needline.querySelector('.title').innerText
                .search(inputText)+1 // incrémente de 1 pour le cas où inputText est trouvé au début du titre
            if (!containsInput) {
                let username = needline.querySelector('.username')
                if (username)
                    containsInput = username.innerText.search(inputText) + 1
            }
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
                                    onClick={() => this.componentAddNeed.current.showComponent() }>{(this.props.appartenance===1)? "Proposer un besoin":"Ajouter un besoin"}</button>
                    }
                </div>
                <div className='flex flex-col flex-grow border border-transparentgray rounded-lg'>
                    <div className='m-1 flex items-center'>
                            <span className="material-icons text-transparentgray">
                                search
                            </span>
                        <input className='flex-grow placeholder:text-transparentgray'
                               placeholder='Besoin de patates...' onInput={(evt) => this.handlerInputNeedList(evt)} />
                    </div>
                    <div id='need-list' ref={this.needList}
                         className='flex-grow overflow-y-scroll border-t border-t-transparentgray'>
                        {
                            this.state.needs && this.state.needs.length>0 ?
                                this.state.needs.map((value) => {
                                    return <NeedLine key={value.id} need={value} modify={(need) => this.componentModifyNeed.current.showComponent(need)}
                                                     delete={(this.props.appartenance===1?
                                                         (need) => this.proposeDeleteNeed(need):
                                                         (need) => this.deleteNeed(need))}
                                                     actionType={(this.props.appartenance===1)?
                                                             (value.email === this.state.usermail)? 'modify':'show'
                                                             : this.props.actionType}
                                                     proposeMe={ (this.props.appartenance===1)? (need) => this.proposeMe(need) : undefined } />
                                }, "")
                                : <p className='text-center m-2'>Aucun besoin pour l'instant.</p>
                        }
                    </div>
                </div>

                {
                    (this.props.actionType==='show')? '':
                        (this.props.appartenance===1)?
                            <div>
                                <CreateNeed ref={this.componentAddNeed} titleWindow='Proposer un besoin' actionType={"creer"}
                                            callback={(need) => this.proposeNeed(need)} eventId={this.props.eventId} />
                                <CreateNeed ref={this.componentModifyNeed} titleWindow='Proposer une modification' actionType={"modifier"}
                                            callback={(need) => this.proposeModifyNeed(need)} eventId={this.props.eventId} />
                            </div>
                            :
                            <div>
                                <CreateNeed ref={this.componentAddNeed} titleWindow='Créer un besoin' buttonText={"Créer"} actionType={"creer"}
                                            callback={(need) => this.addNeed(need)} eventId={this.props.eventId} />
                                <CreateNeed ref={this.componentModifyNeed} titleWindow='Modifier un besoin' actionType={"modifier"}
                                            callback={(need) => this.modifyNeed(need)} eventId={this.props.eventId} />
                            </div>
                }
            </div>
        );
    }
}

export default NeedList
