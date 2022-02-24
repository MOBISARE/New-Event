import React from 'react';

import Button from '../components/Button'

class Home extends React.Component {
    render(){
        return(
            <div>
                <div className='container fixed h-16 p-2 px-5 max-w-full flex justify-between bg-white shadow-md z-50'>
                    <img className='' src='/images/Logo.png'></img>

                    <div className='flex gap-5 items-center'>
                        <Button bg_class='bg-blue' text_class='text-gray' to='/insciption'>Inscription</Button>
                        <Button bg_class='bg-darkgray' text_class='text-gray' to='/connexion'>Connexion</Button>
                    </div>

                
                </div>

                <div className='py-24 bg-gradient-to-r from-purple_gradient to-blue h-[1080px] w-full'>
                    <div className='p-11 left-[10%] top-1/4 w-[665px] absolute'>
                        <h1 className='text-9xl leading-[0.6] text-gray font-logo font-black left-0'>newEvent</h1>
                        <h3 className='text-4xl text-gray font-medium text-right'>créateur d'événement</h3>
                        <h4 className='text-xl text-gray font-normal w-full text-justify my-8'>Simplifie la création et la gestion des événements pour notre association</h4>
                    </div>
                </div>

                <span className='material-icons text-5xl text-white fixed inset-x-0 bottom-[5%] text-center animate-bounce cursor-pointer' style={{clip: "rect(top, right, bottom, left)"}}>
                    expand_more
                </span>

                <div className=' bg-gray h-[1500px] w-full'>

                    <h2 className='text-5xl font-black text-center text-darkgray py-16'>Qui sommes-nous ?</h2>

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

                    <h5 className='text-2xl text-blue text-center mb-12'>Crée ton événement dès aujourd'hui</h5>
                    <h1 className='text-6xl font-bold text-gray text-center'>Rejoins nous !</h1>

                    <div className='flex justify-center mt-48'>
                        <Button bg_class='bg-gradient-to-r from-purple_gradient to-blue h-16 w-60' text_class='text-gray text-2xl' to='/insciption'>S'inscrire</Button>
                    </div>
                    

                </div>
                
            </div>
        );
    }
}

export default Home;
