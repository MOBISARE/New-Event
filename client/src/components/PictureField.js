import React from 'react';

class PictureField extends React.Component {

    static defaultProps = {
        id:'field',
        className:'',
        defaultValue:''
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
    }

    render(){
        return(
            <div className={'h-28 w-28 ' + this.props.className}>
                <label htmlFor={this.props.id} className='block leading-3 ml-3 text-lg -mt-3'>{this.props.children}</label>
                <input type="file" id={this.props.id} name={this.props.id} className='hidden' ref={this.hiddenInput} onChange={this.processImg} defaultValue={this.props.defaultValue}/>
                <div className='border rounded-2xl border-transparentgray w-full h-full cursor-pointer bg-white overflow-hidden' onClick={this.handleClick}><img className='object-cover h-full w-full' ref={this.previewImage} alt='' src={this.props.defaultValue} /></div>
            </div>
        );
    }
}

export default PictureField;
