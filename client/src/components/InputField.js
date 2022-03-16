import React from 'react';

class InputField extends React.Component {

    static defaultProps = {
        id:'field',
        className:'',
        type: 'text',
        disabled: '',
        required: '',
        defaultValue: ''
    }

    render(){
        return(
            <div className={this.props.className}>
                <label htmlFor={this.props.id} className='block leading-3 ml-4 text-lg relative z-20'>{this.props.children}</label>
                <input type={this.props.type} id={this.props.id} name={this.props.id} className='rounded-full border-transparentgray z-10 w-full bg-white'
                       disabled={this.props.disabled} required={this.props.required} onChange={(e) => e.target.setCustomValidity("")}
                       min={this.props.min} defaultValue={this.props.defaultValue}></input>
            </div>
        );
    }
}

export default InputField;
