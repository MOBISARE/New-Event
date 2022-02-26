import React from 'react';

class InputField extends React.Component {

    static defaultProps = {
        id:'field',
        className:'',
        type: 'text'
    }

    render(){
        return(
            <div className={this.props.className}>
                <label htmlFor={this.props.id} className='block leading-3 ml-4 text-lg z-0'>{this.props.children}</label>
                <input type={this.props.type} id={this.props.id} name={this.props.id} className='rounded-full border-transparentgray z-10 w-full'></input>
            </div>
        );
    }
}

export default InputField;
