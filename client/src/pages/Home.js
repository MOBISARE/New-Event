import React from 'react';

class Home extends React.Component {
    render(){
        return(
            <div>
                <div className='container fixed h-16 p-2 max-w-full flex justify-between bg-white shadow-md z-10'>
                    <img className='' src='/images/Logo.png'></img>

                    <div className='flex gap-5 items-center'>
                        <div>TEST</div>
                        <div>TEST</div>
                    </div>

                
                </div>

                <div className='py-24 bg-gradient-to-r from-purple_gradient to-blue h-[1080px] w-full'>
                    <div className='p-11 w-fit left-[10%] top-1/4 max-m absolute'>
                        <h1 className='text-9xl leading-[0.6] text-gray font-logo font-black left-0'>newEvent</h1>
                        <h3 className='text-4xl text-gray font-roboto font-medium text-right'>créateur d'événement</h3>
                        <h4 className='text-xl text-gray font-roboto font-normal w-full'>Simplifie la création et la gestion des événements pour notre association</h4>
                    </div>
                </div>

                <div className='py-24 bg-gray h-screen w-full'>
                    <h1 >HOME</h1>
                </div>
                
            </div>
        );
    }
}

export default Home;
