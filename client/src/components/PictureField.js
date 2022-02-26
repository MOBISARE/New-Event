import React from 'react';

class PictureField extends React.Component {

    static defaultProps = {
        id:'field',
        className:''
    }

    constructor(props){
        super(props);
        this.hiddenInput = React.createRef();
        this.previewImage = React.createRef();
    }

    handleClick = () => {
        this.hiddenInput.current.click();
    }

    processImg = () => {
        var reader = new FileReader();

        reader.onloadend = () => {
            this.previewImage.current.src = reader.result;
        }

        if(this.hiddenInput.current.files[0]){
            reader.readAsDataURL(this.hiddenInput.current.files[0]);
        }
        else
            this.previewImage.current.src = "";
        
    }

    render(){
        return(
            <div className={'h-28 w-28 ' + this.props.className}>
                <label htmlFor={this.props.id} className='block leading-3 ml-4 text-lg -mt-3'>{this.props.children}</label>
                <input type="file" id={this.props.id} name={this.props.id} className='hidden' ref={this.hiddenInput} onChange={this.processImg}></input>
                <div className='border rounded-xl border-transparentgray w-full h-full cursor-pointer bg-white overflow-hidden' onClick={this.handleClick}><img className='object-cover h-full w-full' ref={this.previewImage}/></div>
            </div>
        );
    }
}

export default PictureField;