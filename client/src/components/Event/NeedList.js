import React from 'react'

import UserMini from "../UserMini";
import CreateNeed from "./CreateNeed";

class NeedLine extends React.Component {
    render(){
        return(
            <div className='border-b border-b-transparentgray p-2 pl-6 flex items-center'>
                <p className='title flex-grow'>{ this.props.need.description }</p>
                <UserMini firstname='Prénom' lastname='Nom' />
                <span className="material-icons pl-2 text-darkergray">
                    edit_note
                </span>
                <span className="material-icons pl-2 text-darkergray">
                    delete_outline
                </span>
            </div>
        );
    }
}


class NeedList extends React.Component {
    constructor(props) {
        super(props);
        this.componentAddNeed = React.createRef()
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
        let needElements = ""
        if (this.props.needs)
            this.props.needs.map(value => {
                return <NeedLine need={value} />
            })

        return(
            <div className='flex flex-col w-full min-h-[450px] bg-white rounded-3xl shadow mt-8 p-4'>
                <div className='text-xl ml-4 mb-2 flex justify-between'>
                    Besoins
                    <button type='button' className='w-max rounded-full px-4 py-1 bg-darkgray text-lg text-gray transition hover:scale-105 '
                            onClick={() => this.componentAddNeed.current.showComponent() }>Ajouter un besoin</button>
                </div>
                <div className='flex flex-col flex-grow border border-transparentgray rounded-lg'>
                    <div className='m-1 flex items-center'>
                            <span className="material-icons text-transparentgray">
                                search
                            </span>
                        <input className='flex-grow placeholder:text-transparentgray'
                               placeholder='Besoin de patates...' onInput={this.handlerInputNeedList} />
                    </div>
                    <div id='need-list' className='flex-grow overflow-y-scroll border-t border-t-transparentgray'>
                        {needElements}
                    </div>
                </div>

                <CreateNeed ref={this.componentAddNeed}/>
            </div>
        );
    }
}

export default NeedList
