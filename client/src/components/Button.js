import React from 'react';
import { Link } from 'react-router-dom';

class Button extends React.Component {

    static defaultProps = {
        className: '',
        text_class: ''
    }

    render(){
        return(
            <div className={'border-solid border rounded-full border-transparentgray px-8 py-2 flex items-center justify-center bg-darkgray transition hover:scale-105 ' + this.props.className}>
                <div className= {'text-xl text-gray ' + this.props.text_class}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Button;
