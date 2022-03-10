import React from 'react'

import UserMini from "../UserMini";

class NeedLine extends React.Component {
    render(){
        return(
            <div className='border-b border-b-transparentgray p-2 pl-6 flex items-center'>
                <p className='title flex-grow'>{ this.props.title }</p>
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


function handlerInputNeedList(evt) {
    let inputText = new RegExp(evt.target.value, "i")
    let needlines = document.getElementById('need-list').children
    for (let needline of needlines) {
        let containsInput = needline.querySelector('.title').innerText
            .search(inputText)+1 // incrémente de 1 pour le cas où inputText est trouvé au début du titre
        if (containsInput) needline.classList.remove("hidden")
        else needline.classList.add("hidden")
    }
}

class NeedList extends React.Component {
    render(){
        return(
            <div className='flex flex-col w-full min-h-[450px] bg-white rounded-3xl shadow mt-8 p-4'>
                <h5 className='text-xl ml-4 mb-2'>Besoins</h5>
                <div className='flex flex-col flex-grow border border-transparentgray rounded-lg'>
                    <div className='m-1 flex items-center'>
                            <span className="material-icons text-transparentgray">
                                search
                            </span>
                        <input className='flex-grow placeholder:text-transparentgray'
                               placeholder='Besoin de patates...' onInput={handlerInputNeedList} />
                    </div>
                    <div id='need-list' className='flex-grow overflow-y-scroll border-t border-t-transparentgray'>
                        <NeedLine title='Intitulé du besoin' />
                        <NeedLine title='Intitulé du besoin' />
                    </div>
                </div>
            </div>
        );
    }
}

export default NeedList
