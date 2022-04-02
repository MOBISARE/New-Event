import React from 'react';

class About extends React.Component {
    componentDidMount() {
        let logo = document.getElementById('logo-link')
        logo.querySelector("span").innerText = "badEvent"
        logo.querySelector("img").classList.add("rotate-45", "transition-all") // ou rotate-180 ?
    }

    componentWillUnmount() {
        let logo = document.getElementById('logo-link')
        logo.querySelector("span").innerText = "newEvent"
        logo.querySelector("img").classList.remove("rotate-45")
    }

    render(){
        return(
            <div className='pt-6 w-full'>
                <h1 className='text-4xl font-bold text-center'>Erreur 404</h1>
                <p className='text-center py-5'>Vous avez cliqué sur un lien cassé !</p>

            </div>
        );
    }
}

export default About;
