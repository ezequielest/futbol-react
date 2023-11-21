import React, {useState} from 'react';
import ListTeam from '../list-team/listTeam';
import {useEffect} from 'react';
import { db } from "/src/firebase/firebase.js";
import { doc, collection, getDocs, setDoc } from "firebase/firestore";
import { useNavigate  } from "react-router-dom";

function BuildTeam() {

    //const [cantSelected, setCantSelected] = useState(0);
    const [playersSelected, setPlayersSelected] = useState([]);
    const [mondayPlayers, setMondayPlayers] = useState([]);
    const [errorString, setErrorString] = useState('');

    const [teamOneArray, setTeamOneArray] = useState([]);
    const [teamTwoArray, setTeamTwoArray] = useState([]);

    const [pointsTeamOne, setPointsTeamOne] = useState(0);
    const [pointsTeamTwo, setPointsTeamTwo] = useState(0);
    const [maxPlayers, setMaxPlayers] = useState(12);

    const [showSuccessSaveTeamMessage, setShowSuccessSaveTeamMessage] = useState(false);


    const [ordenPosiciones, setOrdenPosiciones] = useState(["1", "2", "3", "4"]);

    const [allPlayers, setAllPlayers] = useState([]);
    const Navigate = useNavigate();

    let cantSelected = 0;

    useEffect(() => {
       // const players = JSON.parse(localStorage.getItem('players'));
        //setAllPlayers(players);

        //if (!players) {
            getPlayersData();
        //}
    }, []);


    const getPlayersData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "players"));
            const playersArray = [];
            querySnapshot.forEach((doc) => {
                playersArray.push(doc.data())
            });
            setAllPlayers(playersArray);
            localStorage.setItem('players',JSON.stringify(playersArray));
        } catch (error) {
            console.error("Error al obtener datos de Firestore:", error);
        }
    };

    const handleAllPlayersChange = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value)
            }
        }

        setPlayersSelected([...selected]);
	}

    const handleMaxPlayers = (e) => {
        const value = parseInt(e.target.value);
        setMaxPlayers(value);
        resetMondayTeam();
    }

    const addPlayers = () => {
        if ((playersSelected.length + mondayPlayers.length) > maxPlayers) {
            setErrorString('Se excele la cantidad máxima de jugadores');
        } else {
            setErrorString('');
            for (var i = 0; i < playersSelected.length; i++) {

                const isPlayerAlreadySelected = mondayPlayers.find(player => {
                    return player.name === playersSelected[i];
                })

                if (isPlayerAlreadySelected === undefined) {
                    const player = allPlayers.find(player => {
                        return player.name === playersSelected[i];
                    })

                    mondayPlayers.push(player);

                }

                setMondayPlayers([...mondayPlayers]);

            }

            setMondayPlayers([...mondayPlayers]);

           //reset options TODO
          /*for (var i = 0; i < playersSelected.length; i++) {
              playersSelected.options[i].selected = false;
          }*/

          setPlayersSelected(playersSelected);
        }
      }

    const resetMondayTeam = ()=> {
        setMondayPlayers([]);
        setTeamOneArray([]);
        setTeamTwoArray([]);
        setErrorString('');
    }

    const armarEquipos = () => {

        let newStateOne = [];
        let newStateTwo = [];
        let pointsTeamOne = 0
        let pointsTeamTwo = 0;

        setErrorString('');

        setMondayPlayers([...resetOnTeam(mondayPlayers)]);

        let mondayPlayersRandom = shuffle(mondayPlayers);
        let arqueros = getForPosition('Arquero', mondayPlayersRandom);

        //CONSULTA - como actualizar el mismo array a medida que necesito transformarlo, linea 112 y 113
        if (arqueros) {
            if (arqueros.length > 1) {
                arqueros[0].onTeam = true;
                arqueros[1].onTeam = true;

                newStateOne.push(arqueros[0]);
                newStateTwo.push(arqueros[1]);
            }
        }

        let restOfPlayers = mondayPlayers.filter(players => {
            return players.onTeam === false;
        })

	  	for (let i = 0; i < restOfPlayers.length; i++) {
		    if (i % 2 === 0) {
                newStateOne.push(restOfPlayers[i]);
		    } else {
                newStateTwo.push(restOfPlayers[i]);
		    }
		}

		pointsTeamOne = calcTeamPoints(newStateOne);
        pointsTeamTwo = calcTeamPoints(newStateTwo);

		let diff = Math.abs(pointsTeamOne - pointsTeamTwo);
        let teams = [];
		if (pointsTeamOne !== pointsTeamTwo && diff > 30){
            let i = 0;
			while (diff > 30) {
				teams = doTeamsEquals(pointsTeamOne, pointsTeamTwo, newStateOne, newStateTwo, i);

                newStateOne = teams[0];
                newStateTwo = teams[1];

				pointsTeamOne = calcTeamPoints(newStateOne);
				pointsTeamTwo = calcTeamPoints(newStateTwo);

				diff = Math.abs(pointsTeamOne - pointsTeamTwo);
                i++;
			}
		};

        newStateOne.sort(compararPosiciones);
        newStateTwo.sort(compararPosiciones);

        console.log('pointsTeamOne', pointsTeamOne)
        console.log('pointsTeamTwo', pointsTeamTwo)
        setPointsTeamOne(pointsTeamOne);
        setPointsTeamTwo(pointsTeamTwo);

        setTeamOneArray(newStateOne);
        setTeamTwoArray(newStateTwo);
    }

    const armarLaMejorOpcion = () => {
        console.log('BEST OPTION -----------------------');
		let teamOneArrayTemp = [];
		let teamTwoArrayTemp = [];

        let pointsTeamOneTemp = 0
        let pointsTeamTwoTemp = 0;

        setErrorString('');

        let mondayPlayersTemp = mondayPlayers;

        mondayPlayersTemp = resetOnTeam(mondayPlayersTemp);

	  	//obtengo por posicion en la cancha
	  	let arqueros = getForPosition('Arquero', mondayPlayersTemp).sort((a, b) => b.totalPoints - a.totalPoints);
	  	let defensores = getForPosition('Defensor', mondayPlayersTemp).sort((a, b) => b.totalPoints - a.totalPoints);
	  	let mediocampistas = getForPosition('Mediocampista', mondayPlayersTemp).sort((a, b) => b.totalPoints - a.totalPoints);
	  	let delanteros = getForPosition('Delantero', mondayPlayersTemp).sort((a, b) => b.totalPoints - a.totalPoints);

	  	if (arqueros) {
		  	if (arqueros.length > 1) {
		  		teamOneArrayTemp.push(arqueros[0]);
		  		teamTwoArrayTemp.push(arqueros[1]);

		  		arqueros[0].onTeam = true;
		  		arqueros[1].onTeam = true;

		  	} else if (arqueros.length === 1) {
				teamOneArrayTemp.push(arqueros[0]);
				arqueros[0].onTeam = true;

		  		if (defensores.length > 1) {
		  			teamTwoArrayTemp.push(defensores[0])
		  			teamTwoArrayTemp.push(defensores[1])
		  			defensores[0].onTeam = true;
		  			defensores[1].onTeam = true;

                    teamOneArrayTemp.push(delanteros[delanteros.length - 1]);
                    delanteros[delanteros.length-1].onTeam = true;

		  		} else if (defensores.length === 1) {
		  			//1 defensor y el mejor delantero
		  			teamTwoArrayTemp.push(defensores[0]);
		  			teamTwoArrayTemp.push(delanteros[0]);
		  			defensores[0].onTeam = true;
		  			delanteros[0].onTeam = true;

                    teamOneArrayTemp.push(delanteros[delanteros.length - 1]);
                    delanteros[delanteros.length-1].onTeam = true;
		  		}
		  	};
	  	} else {
	  		mondayPlayersTemp.sort((a, b) => b.totalPoints - a.totalPoints);
	  	}

	  	let restOfPlayers = mondayPlayersTemp.filter(players => {
	  		return players.onTeam === false;
	  	})

        restOfPlayers.sort(compararPosiciones);

        //acomodo el resto de los jugadores
        for (let i = 0; i < restOfPlayers.length; i++) {
            if (i % 2 === 0) {
              teamOneArrayTemp.push(restOfPlayers[i]);
            } else {
              teamTwoArrayTemp.push(restOfPlayers[i]);
            }
        }

		pointsTeamOneTemp = calcTeamPoints(teamOneArrayTemp);
		pointsTeamTwoTemp = calcTeamPoints(teamTwoArrayTemp);

		let diff = Math.abs(pointsTeamOneTemp - pointsTeamTwoTemp);

        let teams = [];
		if (pointsTeamOneTemp !== pointsTeamTwoTemp && diff > 30){
            let i = 0;

			while (diff > 30 || i === 3) {
                console.log('pointsTeamOneTemp ',pointsTeamOneTemp)
				teams = doTeamsEquals(pointsTeamOneTemp, pointsTeamTwoTemp, teamOneArrayTemp, teamTwoArrayTemp, i);

                teamOneArrayTemp = teams[0];
                teamTwoArrayTemp = teams[1];

				pointsTeamOneTemp = calcTeamPoints(teamOneArrayTemp);
				pointsTeamTwoTemp = calcTeamPoints(teamTwoArrayTemp);

				diff = Math.abs(pointsTeamOneTemp - pointsTeamTwoTemp);
                i++;
			}
		};

        teamOneArrayTemp.sort(compararPosiciones);
        teamTwoArrayTemp.sort(compararPosiciones);

        console.log('pointsTeamOne', pointsTeamOne)
        console.log('pointsTeamTwo', pointsTeamTwo)
        setPointsTeamOne(pointsTeamOneTemp);
        setPointsTeamTwo(pointsTeamTwoTemp);

        setTeamOneArray(teamOneArrayTemp);
        setTeamTwoArray(teamTwoArrayTemp);

	}

    const compararPosiciones = (a, b) => {
        const posicionA = ordenPosiciones.indexOf(a.mainPosition);
        const posicionB = ordenPosiciones.indexOf(b.mainPosition);

        return posicionA - posicionB;
    }

    //CONSULTA - como actualizar el mismo array a medida que necesito transformarlo, linea 177

    const doTeamsEquals = (pointsTeamOne, pointsTeamTwo, teamOne, teamTwo, index) => {

		//check what is the beast team
		if ((pointsTeamOne > pointsTeamTwo)) {
			const getChanges = changePlayer(teamOne, teamTwo, index);
			teamOne = getChanges[0];
			teamTwo = getChanges[1];
		} else {
			const getChanges = changePlayer(teamTwo, teamOne, index);
			teamOne = getChanges[1];
			teamTwo = getChanges[0];
		}

        return [teamOne, teamTwo];
	}

    const changePlayer = (bestTeam, worstTeam, index) => {
        let bestTeamTemp = bestTeam;
        let worstTeamTemp = worstTeam;

		let bestOfensePlayer = bestTeamTemp.sort((a, b) => b.totalPoints - a.totalPoints)[index];
		let worstOfensePlayer = worstTeamTemp.sort((a, b) => b.totalPoints - a.totalPoints)[(worstTeamTemp.length-1)-index];


        if (bestOfensePlayer === undefined || worstOfensePlayer === undefined) {
            return [bestTeamTemp,worstTeamTemp];
        }

		//TEAM ONE IS BEST
		bestTeamTemp.push(worstOfensePlayer);
		worstTeamTemp.push(bestOfensePlayer);

		//remove player
		let bestTeamFinish = bestTeamTemp.filter(player => {
			return player.name !== bestOfensePlayer.name;
		});

		let worstTeamFinish = worstTeamTemp.filter(player => {
			return player.name !== worstOfensePlayer.name;
		});

		return [bestTeamFinish,worstTeamFinish];
	}

    const calcTeamPoints = (team) => {
		let totalPoints = 0;
		team.forEach( player => {
			totalPoints += player.totalPoints;
		})
		return totalPoints;
	}

    const getForPosition = (position, teamArray) => {
        return teamArray.filter(player => {
            return player.posicion === position;
        });
    }

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {

          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
      }

    const resetOnTeam = (array) => {
        let updateArray = []
        array.forEach(player => {
            player.onTeam = false;
            updateArray.push(player)
        })

        return updateArray;
    }

    const saveTeamForNextPlayer = async () => {


        try {
            const querySnapshot = await getDocs(collection(db, "next-match"));
            console.log('querySnapshot', querySnapshot)
            if (querySnapshot.size > 0) {
                swal({
                    title: "Ya existe un partido",
                    text: "El equipo actual sera reemplazado por el que acabas de crear, estas seguro?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                        const teamOne = JSON.stringify(teamOneArray);
                        const teamTwo = JSON.stringify(teamTwoArray);
                
                        const jsonTeams = {
                            teamOne,
                            teamTwo
                        }
                
                        setDoc(doc(db, "next-match", "krFHQIrA6som1LX34jlO"), jsonTeams).then(() => {
                            setShowSuccessSaveTeamMessage(true);
                
                            Navigate("/next-team");
                
                            setTimeout(() => {
                              setShowSuccessSaveTeamMessage(false);
                            }, "5000");
                        });
                    }
                  });
            } else {
                const teamOne = JSON.stringify(teamOneArray);
                const teamTwo = JSON.stringify(teamTwoArray);
        
                const jsonTeams = {
                    teamOne,
                    teamTwo
                }
        
                setDoc(doc(db, "next-match", "krFHQIrA6som1LX34jlO"), jsonTeams).then(() => {
                    setShowSuccessSaveTeamMessage(true);
        
                    Navigate("/next-team");
        
                    setTimeout(() => {
                      setShowSuccessSaveTeamMessage(false);
                    }, "5000");
                });
            }
        } catch (error) {
            console.error("Error al obtener datos de Firestore:", error);
        }

    }

    return (<>
                <div id="content-wrapper" className="d-flex flex-column">
                {/* Main Content */}
                <div id="content">

                    {/* Begin Page Content */}
                    <div className="container-fluid md-6">
                        <div className='row'>
                            <div className='col-md-6'>
                                <label className='mt-4 mb-2'>Cantidad de jugadores</label>
                                <input type="number" name="maxPlayers" className='form-control' value={maxPlayers} onChange={handleMaxPlayers}/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div id="content">

                    {/* Begin Page Content */}
                    <div className="container-fluid mt-4">

                        {/* Content Row */}
                        <div className="row">

                            {/* Content Column */}
                            <div className="col-lg-6 mb-4">

                                {/* Project Card Example */}
                                <div className="card shadow mb-4 p-4">
                                    <div className='selection-list'>
                                        <h3 className='mb-4'>Lista de selección</h3>
                                        <select name="allPlayers" id="allPlayersSelect" className="form-select all-players" multiple onChange={handleAllPlayersChange}>
                                            {
                                                allPlayers?.map((player, i)=> {
                                                    return <option key={i} value={player.name}>{player.name}</option>;
                                                })
                                            }
                                        </select>
                                        <div>
                                            <button className="btn btn-primary mt-2" style={{ marginRight: '10px'}} onClick={addPlayers}>Sumar al lunes</button>
                                            <button className="btn btn-danger mt-2" onClick={resetMondayTeam}>Reiniciar selección</button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {errorString.length > 0 &&
                                    <span className="alert alert-danger mt-2" style={{ display: 'block'}} role="alert">{errorString}</span>
                                    }
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 mb-4">
                                { mondayPlayers.length > 0 &&
                                <div className="card shadow mb-4 p-4">
                                    <h3 className='mb-4'>Convocados para el próximo partido
                                    <span className="badge bg-primary rounded-pill">{mondayPlayers.length} / {maxPlayers}</span></h3>
	  			                        <ol className="list-group list-group-numbered">
	                                        {mondayPlayers.map((player, index) => {
	                                            return <li key={index} className="list-group-item d-flex justify-content-between align-items-start">{player.name}
                                                <div className="ms-2 me-auto">
                                                    <div className="fw-bold">{player.posicion}</div>
                                                </div>
                                                <span className="badge bg-primary rounded-pill">{player.totalPoints}</span>
                                            </li>
                                            })}
                                        </ol>

                                        { mondayPlayers.length < maxPlayers &&
                                          <h5 className="mt-2">Faltan {maxPlayers - mondayPlayers.length} jugadores</h5>
                                        }

	                                    { mondayPlayers.length === maxPlayers &&
                                            <div>
                                                <button className="btn btn-primary mt-2" style={{ marginRight: '10px'}} onClick={armarEquipos}>Armar equipos parejos random</button>
	  						                    <button className="btn btn-success mt-2" onClick={armarLaMejorOpcion}>Armar mejor opción</button>
                                            </div>
                                        }
                                </div>
                                }
                            </div>
                        </div>
                        { teamOneArray.length > 0 &&
                        <>
                        <div className="row" id="teamGenerated">
                            <div className="col">
                                <ListTeam title={'Team 1'} teamArray={teamOneArray} totalPoints={pointsTeamOne} />
                            </div>
                            <div className="col">
                                <ListTeam title={'Team 2'} teamArray={teamTwoArray} totalPoints={pointsTeamTwo}/>
                            </div>
                        </div>
                        <button className="btn btn-primary mt-2 mb-4" onClick={saveTeamForNextPlayer}>Guardar equipo</button>
                        
                        { showSuccessSaveTeamMessage &&
                            <div className="alert alert-success" role="alert">
                              Equipo guardado con éxito
                            </div>
                        }
                        </>
                        }

                    </div>
                    {/* /.container-fluid */}

                </div>
                {/* End of Main Content */}

                </div>

                <div className="modal fade" id="newPlayerModal" tabIndex="-1" aria-labelledby="newPlayerModal" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Modal body text goes here.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                        </div>
                    </div>
                </div>
            </>

    )


}

export default BuildTeam
