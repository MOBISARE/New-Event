import React from 'react';
import { Link } from 'react-router-dom';

class Button extends React.Component {

    static defaultProps = {
        className: '',
        text_class: '',
        onClick: undefined
    }

    render(){
        return(
            <div className={'border-solid border rounded-full border-transparentgray px-8 py-2 flex items-center justify-center bg-darkgray ' + this.props.className + ' transition hover:scale-105 cursor-pointer'} onClick={this.props.onClick}>
                <div className= {'text-xl text-gray ' + this.props.text_class}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Button;
