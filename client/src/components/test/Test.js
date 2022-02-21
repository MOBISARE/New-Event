import React from 'react';

class Test extends React.Component {

    constructor(){
        super();
        this.state = {
            data: []
        }
    }

    componentDidMount(){
        fetch('/api/test')
        .then(res => res.json())
        .then(data => this.setState({data}));
    }

    render(){
        return(
            <h4>{this.state.data.id}</h4>
        );
    }
}

export default Test;
