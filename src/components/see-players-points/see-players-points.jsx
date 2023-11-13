import { useEffect } from "react";
import React, {useState} from 'react';
import { db } from "/src/firebase/firebase.js";
import { collection, getDocs} from "firebase/firestore";
import PlayerCard from '../shared/components/player-card/player-card';

function SeePlayersPoints() {

    const [allPlayers, setAllPlayers] = useState([]);
    const [viewPlayerSelected, setViewPlayerSelected] = useState({});

    useEffect(()=>{
        getPlayersData();
    }, []);

    const getPlayersData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "players"));
            const playersArray = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.data())
                playersArray.push(doc.data())
            });
            setAllPlayers(playersArray);
            localStorage.setItem('players',JSON.stringify(playersArray));
        } catch (error) {
            console.error("Error al obtener datos de Firestore:", error);
        }
    };

    const getPositionString = (number)=> {
        const positions = ['Arquero','Defensor','Medioc.','Delantero'];

        return positions[number-1];
    }

    const viewPlayer = (playerSelected) => {
        console.log('playerSelected ', playerSelected);
        setViewPlayerSelected(playerSelected);
        $('#showDataPlayer').modal('show');

    }

    return (
        <>
            <div id="content-wrapper" className="d-flex flex-column">

                {/* Main Content */}
                <div id="content">

                    {/* Begin Page Content */}
                    <div className="container-fluid mt-4">

                        {/* Content Row */}
                        <div className="row">

                            {/* Content Column */}
                            <div className="col-lg-12 mb-4">
                            <h3>Puntos de jugadores</h3>
                            <table className="table table-responsive">
                                <thead>
                                    <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Posición</th>
                                    <th scope="col">Puntaje</th>
                                    <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>

                                        {
                                            allPlayers?.map((player, i)=> {
                                                let listClass = '';

                                                if (player.mainPosition === '4') {
                                                    listClass = 'bg-success p-2';
                                                } else if (player.mainPosition === '3') {
                                                    listClass = 'bg-warning p-2';
                                                } else if (player.mainPosition === '1') {
                                                    listClass = 'bg-danger p-2';
                                                } else if (player.mainPosition === '2') {
                                                    listClass = 'bg-primary p-2';
                                                }

                                                return (

                                                    <tr key={i}>
                                                        <th scope="row">{ i+1 }</th>
                                                        <td>{ player.name }</td>
                                                        <td>
                                                            <span className={listClass} style={{ borderRadius: '4px', width: '100px', display: 'block', textAlign: 'center', color: 'white'}}>
                                                                { getPositionString(player.mainPosition) }
                                                            </span>
                                                        </td>
                                                        <td>{ player.totalPoints }</td>
                                                        <td>
                                                        <a style={{'marginRight': '10px'}} onClick={() => viewPlayer(player)}><i className="fa-regular fa-eye"></i></a>
                                                        </td>
                                                    </tr>

                                                )
                                            })
                                        }

                                </tbody>
                            </table>

                            </div>

                        </div>
                    </div>
                    {/* /.container-fluid */}

                </div>
                {/* End of Main Content */}

            </div>

            <div className="modal fade" id="showDataPlayer" tabIndex="-1" aria-labelledby="showDataPlayer" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-body">
                        <PlayerCard player={viewPlayerSelected} />
                    </div>
                </div>
            </div>

        </>
    )
}

export default SeePlayersPoints
