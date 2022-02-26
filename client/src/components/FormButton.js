import React from 'react';
import { Link } from 'react-router-dom';

class FormButton extends React.Component {

    static defaultProps = {
        text_class: '',
        className: '',
        value: 'Confirmer'
    }

    render(){
        return(
            <input type='submit' className={'border-solid border rounded-full border-transparentgray px-8 py-2 bg-darkgray text-xl text-gray cursor-pointer transition hover:scale-105 ' + this.props.className} value={this.props.value} />
        );
    }
}

export default FormButton;
