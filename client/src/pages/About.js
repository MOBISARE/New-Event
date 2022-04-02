import React from 'react';
import { Link } from 'react-router-dom';

import LinkButton from '../components/LinkButton'

class About extends React.Component {

    constructor(props){
        super(props);

        this.state = {scrollhidden: false, scrollanimation: false};
        this.scrollButton = React.createRef();
        this.firstMenu = React.createRef();
    }

    scrollToFirstMenu = () => {
        this.firstMenu.current.scrollIntoView({ behavior: 'smooth'});
    }

    updateScroll = () => {
        if(this.state.scrollanimation === (window.scrollY === 0)){
            this.setState({scrollanimation: (window.scrollY !== 0)});

            if((window.scrollY === 0)) this.setState({scrollhidden: false});
            else setTimeout(() => {if(this.state.scrollanimation) this.setState({scrollhidden: true})}, 200);
        }

    }

    componentDidMount = () => {
        window.addEventListener('scroll', this.updateScroll);
    }

    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.updateScroll);
    }

    render(){
        var scrollTransitionClasses = this.state.scrollanimation ? 'transition-opacity opacity-0 duration-200' : 'opacity-100'
        scrollTransitionClasses += this.state.scrollhidden ? ' hidden' : ''

        return(
            <div onScroll={this.updateScroll}>
                <div className='absolute top-0 right-0 left-0 bg-gradient-to-r from-purple to-blue h-screen'>
                </div>
                <div className='py-24 h-[1080px] w-full'>
                    <div className='p-11 left-[10%] top-1/4 w-[665px] absolute'>
                        <h1 className='text-9xl leading-[0.6] text-gray font-logo font-black left-0'>newEvent</h1>
                        <h3 className='text-4xl text-gray font-medium text-right'>créateur d'événement</h3>
                        <h4 className='text-xl text-gray font-normal w-full text-justify my-8'>Simplifie la création et la gestion des événements pour notre association</h4>
                    </div>
                </div>

                <span className={'material-icons text-5xl text-white fixed inset-x-0 bottom-[5%] text-center animate-bounce cursor-pointer ' + scrollTransitionClasses} onClick={this.scrollToFirstMenu} ref={this.scrollButton}>
                    expand_more
                </span>

                <div className=' bg-gray h-[1500px] w-full' ref={this.firstMenu}>

                    <h2 className='text-5xl font-black text-center text-darkgray pt-28'>Qui sommes-nous ?</h2>

                    <div className='relative text-center h-[600px]'>
                        <div className='absolute right-[55%] w-[400px] inset-y-0 flex items-center z-10'>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arcu, quis ante fusce amet, facilisis tellus. Commodo nibh donec pulvinar nibh amet, diam. Volutpat id dignissim non, eget pellentesque. Turpis tincidunt sem eleifend adipiscing at. Augue imperdiet magna id enim at sed convallis ac. Fringilla dolor mi, ullamcorper magnis non ornare dolor. Nec augue pellentesque felis aliquam aenean amet quis pharetra. Diam cras faucibus orci, egestas. <br/>
                                Odio sollicitudin placerat orci iaculis blandit. Odio nulla egestas tellus velit. Libero molestie vivamus enim quam sed. Lacus et sed pulvinar diam porttitor faucibus accumsan vestibulum, bibendum. Interdum pretium ultricies diam ac libero, amet urna amet. Ut cras feugiat.
                            </p>
                        </div>

                        <div className='absolute left-[58%] h-full w-1/2 flex items-center'>
                            <div className='bg-darkgray h-[450px] w-full'/>
                        </div>
                    </div>

                    <div className='relative text-center h-[600px]'>

                        <div className='absolute right-[55%] h-full flex items-center'>
                            <div className='bg-darkgray h-[450px] w-[500px]'/>
                        </div>

                        <div className='absolute left-[55%] w-[400px] inset-y-0 flex items-center z-10'>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arcu, quis ante fusce amet, facilisis tellus. Commodo nibh donec pulvinar nibh amet, diam. Volutpat id dignissim non, eget pellentesque. Turpis tincidunt sem eleifend adipiscing at. Augue imperdiet magna id enim at sed convallis ac. Fringilla dolor mi, ullamcorper magnis non ornare dolor. Nec augue pellentesque felis aliquam aenean amet quis pharetra. Diam cras faucibus orci, egestas. <br/>
                                Odio sollicitudin placerat orci iaculis blandit. Odio nulla egestas tellus velit. Libero molestie vivamus enim quam sed. Lacus et sed pulvinar diam porttitor faucibus accumsan vestibulum, bibendum. Interdum pretium ultricies diam ac libero, amet urna amet. Ut cras feugiat.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default About;
