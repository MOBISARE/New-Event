import React from 'react';

class CreateNeed extends React.Component {
    constructor(props) {
        super(props);

        this.componentDiv = React.createRef()
    }

    showComponent() {
        this.componentDiv.current.classList.remove("hidden")
    }

    hiddeComponent() {
        this.componentDiv.current.classList.add("hidden")
    }

    render(){
        return(
            <div ref={this.componentDiv}
                 className='flex place-items-center fixed right-0 left-0 bottom-0 top-0 bg-transparentgray z-50 hidden'>
                <div className='relative bg-white m-auto h-1/2 w-1/2 rounded-2xl'>
                    <span className="material-icons hover:cursor-pointer text-3xl font-bold absolute right-0 top-0 m-1"
                        onClick={() => this.hiddeComponent()}>
                        close
                    </span>
                </div>
            </div>
        );
    }
}

export default CreateNeed;
