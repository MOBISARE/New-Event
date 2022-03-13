import React from 'react'

import UserMini from '../../components/UserMini'
import NeedList from '../../components/Event/NeedList'
import Button from "../../components/Button";
import ParticipantViewer from '../../components/Event/ParticipantViewer'

class Event extends React.Component {
    render() {
        return(
            <div className='max-w-[1000px] mx-auto'>
                <div className='flex'>
                    <div className='w-3/5 h-[600px] bg-loadinggray rounded-3xl shadow mr-4 animate-pulse'>
                    </div>
                    <div className='w-2/5'>
                        <div className='h-[200px] bg-loadinggray rounded-3xl shadow ml-4 animate-pulse'>

                        </div>
                        <div className='h-[200px] bg-loadinggray rounded-3xl shadow ml-4 mt-10 animate-pulse'>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Event;
