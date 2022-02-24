import React from 'react';

class EventCard extends React.Component {
    render() {
        return(
            <div className={"rounded-lg bg-white m-3 flex flex-col justify-center shadow"}>
                <img src={"/images/icon.png"} className={""}/>
                <h5>Titre de l'événement</h5>
                <p>Description de l'événement</p>
                <span>5</span>
                <span>Nancy</span>
                <span>00/00/0000</span>
                <span>00/00/0000</span>
            </div>
        )
    }
}

class Main extends React.Component {
    render(){
        return(
            <div className={"text-center flex flex-col items-center"}>
                <div className={"bg-gray h-screen w-screen fixed -z-50"}>
                    <img src={"/images/blob1.svg"}
                         className={"absolute top-0 right-0"}/>
                    <img src={"/images/blob2.svg"}
                         className={"absolute bottom-0 left-0"}/>
                </div>

                <h1 className={"font-bold text-6xl mt-36"}>Rechercher un
                    <div className={"text-transparent bg-clip-text bg-gradient-to-br from-purple to-blue"}>
                         événement</div>
                </h1>

                <div className={"bg-white w-1/2 rounded-full h-10 flex items-center p-4 mt-10"}>
                    <span>O</span>
                    <input placeholder={"Anniversaire de..."}
                           className={"flex-grow focus:outline-none"}/>
                    <span>P</span>
                </div>

                <div className={"mt-14"}>
                    <span>Tri : </span>
                    <select className={"rounded-full bg-white h-7 pl-1"}>
                        <option>Populaire</option>
                        <option>Récent</option>
                    </select>
                </div>

                <div className={"flex flex-wrap flex-row justify-center"}>
                    <EventCard></EventCard>
                    <EventCard></EventCard>
                    <EventCard></EventCard>
                    <EventCard></EventCard>
                    <EventCard></EventCard>
                    <EventCard></EventCard>
                    <EventCard></EventCard>
                    <EventCard></EventCard>
                </div>
            </div>
        );
    }
}

export default Main;
