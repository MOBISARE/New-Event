import React from 'react';

class Checkbox extends React.Component {

    static defaultProps = {
        id:'checkbox',
        className:'',
    }

    render(){
        return(
            <div className={'flex items-center gap-2 ' + this.props.className}>
                <input type='checkbox' id={this.props.id} name={this.props.id} className='rounded-md border-transparentgray'></input>
                <label htmlFor={this.props.id} className='block leading-3 text-lg'>{this.props.children}</label>
            </div>
        );
    }
}

export default Checkbox;
