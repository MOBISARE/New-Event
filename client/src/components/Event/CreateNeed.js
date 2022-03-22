import React from 'react';
import InputField from "../InputField";
import Button from "../Button";

class CreateNeed extends React.Component {
    constructor(props) {
        super(props);
        this.componentDiv = React.createRef()
    }

    showComponent() {
        this.componentDiv.current.classList.remove("hidden")
    }

    hideComponent() {
        this.componentDiv.current.classList.add("hidden")
    }

    validation() {
        let title = document.getElementById('new-need-title')
        let associated = document.getElementById('associated-to')

        this.props.addNeed({
            description: title.value,
            participant: associated.value
        })
        this.hideComponent()
        title.value = ""
        associated.value = ""
    }

    render(){
        return(
            <div ref={this.componentDiv}
                 className='flex place-items-center fixed right-0 left-0 bottom-0 top-0 bg-transparentgray z-50 hidden'>
                <div className='flex flex-col relative bg-white m-auto max-h-[300px] h-1/2 w-1/2 rounded-2xl p-2'>
                    <span className="material-icons hover:cursor-pointer text-3xl font-bold absolute right-0 top-0 m-1"
                        onClick={() => this.hideComponent()}>
                        close
                    </span>
                    <h3 className='text-3xl text-center'>{ this.props.titleWindow }</h3>

                    <div className='flex-grow flex flex-col justify-between my-6 mx-2'>
                        <InputField children='Intitulé' id='new-need-title' />
                        <InputField className='w-2/5' children='Associé à' id='associated-to' />
                        <Button children='Créer' onClick={() => this.validation()} />
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateNeed;
