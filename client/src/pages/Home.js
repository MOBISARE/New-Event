import React from 'react';

class Home extends React.Component {
    render(){
        return(
            <div>
                <div className='container fixed h-16 max-w-full bg-white shadow-md'> Test </div>

                <div className='py-24 bg-gradient-to-r from-purple_gradient to-blue h-screen'>
                    <h1 className='text-9xl text-gray font-roboto'>newEvent</h1>
                </div>

                <div className='py-24 bg-gray h-screen'>
                    <h1 >HOME</h1>
                </div>
                
            </div>
        );
    }
}

export default Home;
