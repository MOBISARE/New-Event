import React from "react"
import axios from "axios";

class InputLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            villes: []
        }
    }

    async getVilles(input) {
        let res = await axios.get("https://geo.api.gouv.fr/communes",
            {
                params: {
                    nom: input,
                    boost: "population",
                    limit: 5
                }
            }
        )
        this.setState({
            villes: res.data.map((item, index) => (
                <option key={index}>
                    {item.nom}
                </option>
            ))
        })
    }

    render() {
        return <div className={this.props.className || ''}>
            <label className='block leading-3 ml-4 text-lg relative z-20'>
                {this.props.children || 'Localisation'}</label>
            <input id={this.props.inputId || 'location'} list='list-location' type='text' defaultValue={this.props.defaultValue}
                   className='rounded-full border-transparentgray z-10 w-full bg-white' required={this.props.required || false}
                   onChange={ (evt) => {
                       if (evt.target.value)
                           this.getVilles(evt.target.value)
                   }}/>
            <datalist id='list-location'>
                {this.state.villes}
            </datalist>
        </div>
    }
}

export default InputLocation