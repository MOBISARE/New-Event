import React from 'react';
import { Link } from 'react-router-dom';

class Button extends React.Component {

    static defaultProps = {
        text_class: '',
        bg_class: '',
        to: '#',
        className: ''
    }

    render(){
        return(
            <Link to={this.props.to} className={this.props.className}>
                <div className={'border-solid border rounded-full border-transparentgray px-8 py-2 flex items-center justify-center bg-darkgray ' + this.props.bg_class}>
                    <div className= {'text-xl text-gray ' + this.props.text_class}>
                        {this.props.children}
                    </div>
                </div>
            </Link>
            
        );
    }
}

export default Button;
