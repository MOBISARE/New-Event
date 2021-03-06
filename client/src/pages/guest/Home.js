import React from 'react';
import { Link } from 'react-router-dom';

import LinkButton from '../../components/LinkButton'

class Home extends React.Component {

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
                <div className='container fixed h-16 p-2 px-5 max-w-full flex justify-between bg-white shadow-md z-50'>
                    <Link to='/'><img className='object-cover h-full' src='/images/Logo.png'></img></Link>

                    <div className='flex gap-5 items-center'>
                        <LinkButton bg_class='bg-blue' text_class='text-gray' to='/inscription'>Inscription</LinkButton>
                        <LinkButton bg_class='bg-darkgray' text_class='text-gray' to='/connexion'>Connexion</LinkButton>
                    </div>
                
                </div>

                <div className='py-24 bg-gradient-to-r from-purple to-blue h-[1080px] w-full'>
                    <div className='p-11 left-[10%] top-1/4 w-[665px] absolute'>
                        <h1 className='text-9xl leading-[0.6] text-gray font-logo font-black left-0'>newEvent</h1>
                        <h3 className='text-4xl text-gray font-medium text-right'>cr??ateur d'??v??nement</h3>
                        <h4 className='text-xl text-gray font-normal w-full text-justify my-8'>Simplifie la cr??ation et la gestion des ??v??nements pour notre association</h4>
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

                        <div className='absolute left-[55%] h-full flex items-center'>
                            <div className='bg-darkgray h-[450px] w-[500px]'/>
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

                <div className='bg-darkgray h-[800px] w-full py-36'>

                    <h5 className='text-2xl text-blue text-center mb-12'>Cr??e ton ??v??nement d??s aujourd'hui</h5>
                    <h1 className='text-6xl font-bold text-gray text-center'>Rejoins nous !</h1>

                    <div className='flex justify-center mt-48'>
                        <LinkButton bg_class='bg-gradient-to-r from-purple to-blue h-16 w-60' text_class='text-gray text-2xl' to='/inscription'>S'inscrire</LinkButton>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default Home;
