import { useEffect } from "react";
import React, {useState} from 'react';
import { db } from "/src/firebase/firebase.js";
import { collection, getDocs} from "firebase/firestore";
import PlayerCard from '../shared/components/player-card/player-card';
import './see-players-points.scss';
import avatarImage from './../../../public/avatar-player.png'

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
            const softByDiffPoints = playersArray.sort((a,b) => { 
                if ((b.totalPoints - b.originalPoints) > (a.totalPoints - a.originalPoints) && b.totalPoints > a.totalPoints) {
                    return 1;
                }
                if ((b.totalPoints - b.originalPoints) < (a.totalPoints - a.originalPoints) && b.totalPoints < a.totalPoints) {
                return -1;
                }
                // a must be equal to b
                return 0;
            });

            setAllPlayers(softByDiffPoints);
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
        setViewPlayerSelected(playerSelected);
        $('#showDataPlayer').modal('show');
    }

    return (
        <>
            <div className="d-flex flex-column content-wrapper">

                {/* Main Content */}
                <div id="content">

                    {/* Begin Page Content */}
                    <div className="container-fluid mt-4">

                        {/* Content Row */}
                        <div className="row">

                            {/* Content Column */}
                            <div className="col-lg-12 mb-4">
                            <h3>Puntos de jugadores</h3>
 
                            <div className="cards-container">     
                                {
                                allPlayers?.map((player, i)=> {
                                    let listClass = '';

                                    if (player.mainPosition === '4') {
                                        listClass = 'text-success';
                                    } else if (player.mainPosition === '3') {
                                        listClass = 'text-warning';
                                    } else if (player.mainPosition === '1') {
                                        listClass = 'text-danger';
                                    } else if (player.mainPosition === '2') {
                                        listClass = 'text-primary';
                                    }
                                    return (
                                        <div key={i} className="card">
                                        <span class="position-number">#{i+1}</span>
                                        {
                                            player.image && <img src={'https://futbol-team.s3.us-east-2.amazonaws.com/' + player.image} className="avatar picture" alt="..."/>
                                        }
                                        {
                                            !player.image &&
                                            <div><img src={avatarImage} className="avatar placeholder" alt="..."/></div>
                                        }

                                        <div className="card-body">
                                            <div className="first-line">
                                                <div className="player-name">{ player.name }

                                                { player.totalPoints - player.originalPoints > 0 &&
                                                        <sup className='text-success mx-2'>+{player.totalPoints - player.originalPoints }</sup>
                                                }

                                                {  player.totalPoints - player.originalPoints  == 0 &&
                                                        <sup className='text-primary mx-2'>{player.totalPoints - player.originalPoints }</sup>
                                                }

                                                {  player.totalPoints - player.originalPoints  < 0 &&
                                                        <sup className='text-danger mx-2'>{player.totalPoints - player.originalPoints }</sup>
                                                }</div>

                                                <div className="circle">{ player.totalPoints }</div>
                                            </div>

                                            <span className={'position ' + listClass}>
                                                { getPositionString(player.mainPosition) }
                                            </span>

                                            <a href="#" onClick={() => viewPlayer(player)} className="btn btn-primary">Ver puntos</a>
                                        </div>
                                    </div>)
                                    })
                                }
                            </div>

                            </div>

                        </div>
                    </div>
                    {/* /.container-fluid */}

                </div>
                {/* End of Main Content */}

            </div>

            <div className="modal fade" id="showDataPlayer" tabIndex="-1" aria-labelledby="showDataPlayer" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content see-players">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <PlayerCard player={viewPlayerSelected} />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default SeePlayersPoints
