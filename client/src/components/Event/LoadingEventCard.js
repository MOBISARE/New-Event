import React from "react"

class LoadingEventCard extends React.Component {

    render() {
        return(
            <div className='w-72 h-64 rounded-lg bg-white m-3 flex flex-col justify-center shadow'>
                <div className='bg-loadinggray w-72 grow rounded-t-lg overflow-hidden animate-pulse'/>
                <div className='p-2'>
                    <div className='bg-loadinggray animate-pulse rounded-md h-7'></div>
                    <div className='grid grid-cols-2 grid-rows-2 text-xs mt-2 gap-2'>
                        <div className="h-5 w-14 rounded-md bg-loadinggray"/>
                        <div className="h-5 w-36 rounded-md bg-loadinggray place-self-end"/>
                        <div className="h-5 w-14 rounded-md bg-loadinggray"/>
                        <div className="h-5 w-36 rounded-md bg-loadinggray place-self-end"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoadingEventCard