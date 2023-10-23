import React, {useState} from 'react';
import ListTeam from '../list-team/listTeam';
import {useEffect} from 'react';
import { db } from "/src/firebase/firebase.js";
import { doc, collection, getDocs } from "firebase/firestore"; 

function BuildTeam() {

    //const [cantSelected, setCantSelected] = useState(0);
    const [playersSelected, setPlayersSelected] = useState([]);
    const [mondayPlayers, setMondayPlayers] = useState([]); 
    const [errorString, setErrorString] = useState('');

    const [teamOneArray, setTeamOneArray] = useState([]); 
    const [teamTwoArray, setTeamTwoArray] = useState([]); 

    const [pointsTeamOne, setPointsTeamOne] = useState(0);
    const [pointsTeamTwo, setPointsTeamTwo] = useState(0);

    const [ordenPosiciones, setOrdenPosiciones] = useState(["Arquero", "Defensor", "Medioc.", "Delantero"]);

    const [allPlayers, setAllPlayers] = useState([]);

    /*
    [
		{ name: "Alejandro", habilidad: 60, resistencia: 75, velocidad: 55, potenciaDisparo: 70, defensa: 60, medio: 50, ataque: 65, posicion: "Delantero", edad: 46, onTeam: false},
		{ name: "Claudio",  habilidad: 60, resistencia: 75, velocidad: 65, potenciaDisparo: 40, defensa: 60, medio: 79, ataque: 50, posicion: "Mediocampista", edad: 44, onTeam: false },
		{ name: "Carlos",  habilidad: 40, resistencia: 80, velocidad: 55, potenciaDisparo: 50, defensa: 90, medio: 50, ataque: 30, posicion: "Defensor", edad: 42, onTeam: false },
		{ name: "Jona",  habilidad: 85, resistencia: 90, velocidad: 80, potenciaDisparo: 70, defensa: 70, medio: 90, ataque: 80,posicion: "Mediocampista", edad: 26, onTeam: false },
		{ name: "Lequi",  habilidad: 80, resistencia: 70, velocidad: 70, potenciaDisparo: 40, defensa: 70, medio: 75, ataque: 75, posicion: "Mediocampista", edad: 33, onTeam: false },
		{ name: "Nico",  habilidad: 80, resistencia: 85, velocidad: 80, potenciaDisparo: 85,defensa: 60, medio: 50, ataque: 90, posicion: "Delantero", edad: 35, onTeam: false },
		{ name: "David Barr",  habilidad: 92, resistencia: 85, velocidad: 85, potenciaDisparo: 80,defensa: 50, medio: 80, ataque: 90, posicion: "Mediocampista", edad: 34, onTeam: false },
		{ name: "Martin",  habilidad: 65, resistencia: 82, velocidad: 75, potenciaDisparo: 75, defensa: 85, medio: 40, ataque: 70, posicion: "Defensor", edad: 44, onTeam: false },
		{ name: "Mati Nez",  habilidad: 50, resistencia: 60, velocidad: 50, potenciaDisparo: 40, defensa: 90, medio: 20, ataque: 40, posicion: "Arquero", edad: 23, onTeam: false },
		{ name: "Emma",  habilidad:90, resistencia: 30, velocidad: 70, potenciaDisparo: 70, defensa: 60, medio: 70, ataque: 90,posicion: "Mediocampista", edad: 23, onTeam: false },
		{ name: "Mati Vega",  habilidad: 89, resistencia: 77, velocidad: 80, potenciaDisparo: 70, defensa: 37, medio: 78, ataque: 79, posicion: "Delantero", edad: 34, onTeam: false },
		{ name: "Lukka",  habilidad: 60, resistencia: 78, velocidad: 75, potenciaDisparo: 70, defensa: 40, medio: 65, ataque: 60, posicion: "Delantero", edad: 23, onTeam: false },
		{ name: "Facu",  habilidad: 60, resistencia: 60, velocidad: 65, potenciaDisparo: 60, defensa: 95, medio: 40, ataque: 60, posicion: "Arquero", edad: 23, onTeam: false },
		{ name: "Manu",  habilidad: 85, resistencia: 70, velocidad: 75, potenciaDisparo: 99, defensa: 70, medio: 85, ataque: 90, posicion: "Delantero", edad: 23, onTeam: false },
        { name: "Lucas L",  habilidad: 65, resistencia: 80, velocidad: 72, potenciaDisparo: 82, defensa: 79, medio: 81, ataque: 78, posicion: "Mediocampista", edad: 27, onTeam: false },
        { name: "Willy",  habilidad: 70, resistencia: 30, velocidad: 72, potenciaDisparo: 90, defensa: 30, medio: 80, ataque: 90, posicion: "Delantero", edad: 36, onTeam: false },
        { name: "Marce",  habilidad: 85, resistencia: 70, velocidad: 75, potenciaDisparo: 70, defensa: 30, medio: 80, ataque: 80, posicion: "Delantero", edad: 35, onTeam: false },
        { name: "Juanito",  habilidad: 80, resistencia: 70, velocidad: 75, potenciaDisparo: 70, defensa: 30, medio: 70, ataque: 80, posicion: "Delantero", edad: 36, onTeam: false },
        { name: "Mike",  habilidad: 60, resistencia: 60, velocidad: 60, potenciaDisparo: 60, defensa: 50, medio: 50, ataque: 50, posicion: "Delantero", edad: 36, onTeam: false },
        { name: "Jorge",  habilidad: 60, resistencia: 60, velocidad: 60, potenciaDisparo: 60, defensa: 50, medio: 50, ataque: 50, posicion: "Delantero", edad: 36, onTeam: false },
        { name: "Juacko",  habilidad: 60, resistencia: 60, velocidad: 60, potenciaDisparo: 60, defensa: 50, medio: 50, ataque: 50, posicion: "Delantero", edad: 36, onTeam: false }
	] */

    let cantSelected = 0;
    let maxPlayers = 12;

    useEffect(() => {
        const players = JSON.parse(localStorage.getItem('players'));
        setAllPlayers(players);

        if (!players) {
            getPlayersData();
        }
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

    const refresh = ()=> {
        console.log('refresh')
    }

    const armarEquipos = () => {

        let newStateOne = [];
        let newStateTwo = [];
        let pointsTeamOne = 0
        let pointsTeamTwo = 0;

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

				pointsTeamOne = calcTeamPoints(teamOneArray);
				pointsTeamTwo = calcTeamPoints(teamTwoArray);

				diff = Math.abs(pointsTeamOne - pointsTeamTwo);
                i++;
			}
		};

        newStateOne.sort(compararPosiciones);
        newStateTwo.sort(compararPosiciones);

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

        setPointsTeamOne(pointsTeamOneTemp);
        setPointsTeamTwo(pointsTeamTwoTemp);

        setTeamOneArray(teamOneArrayTemp);
        setTeamTwoArray(teamTwoArrayTemp);

	}

    const compararPosiciones = (a, b) => {
        const posicionA = ordenPosiciones.indexOf(a.posicion);
        const posicionB = ordenPosiciones.indexOf(b.posicion);
  
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

    return (<>
                <div id="content-wrapper" className="d-flex flex-column">

                {/* Main Content */}
                <div id="content">

                    {/* Begin Page Content */}
                    <div className="container-fluid mt-4">

                        {/* Content Row */}
                        <div className="row mb-4">

                            {/* Earnings (Monthly) Card Example */}
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card border-left-primary shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                    mejor jugador</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">Jere Quinteros</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-trophy fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Earnings (Monthly) Card Example */}
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card border-left-success shadow h-100 py-2">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                    MAS PICANTE</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">El pela</div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-pepper-hot fa-2x text-gray-300"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/* Content Row */}
        
                        {/*<div className='row'>
                            <div className="col">
                                <button type="button" className="btn btn-primary mb-2" data-bs-toggle="modal" data-bs-target="#newPlayerModal">
                                    AGREGAR NUEVO JUGADOR
                                </button>
                            </div>
                        </div>*/}

                        {/* Content Row */}
                        <div className="row">

                            {/* Content Column */}
                            <div className="col-lg-6 mb-4">

                                {/* Project Card Example */}
                                <div className="card shadow mb-4 p-4">
                                    <div className='selection-list'>
                                        <h1>Lista de selección</h1>
                                        <select name="allPlayers" id="allPlayersSelect" className="form-select all-players" multiple onChange={handleAllPlayersChange}>
                                            {
                                                allPlayers?.map((player, i)=> {
                                                    return <option key={i} value={player.name}>{player.name}</option>;
                                                })
                                            }
                                        </select>
                                        <div>
                                            {errorString.length > 0 &&
                                            <span className="alert alert-danger mt-2" style={{ display: 'block'}} role="alert">{errorString}</span>
                                            }
                                        </div>
                                        <div>
                                            <button className="btn btn-primary mt-2" style={{ marginRight: '10px'}} onClick={addPlayers}>Sumar al lunes</button>
                                            <button className="btn btn-danger mt-2" onClick={refresh}>Reiniciar selección</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 mb-4">
                                { mondayPlayers.length > 0 &&
                                <div>
                                <h3>Convocados para el próximo partido 
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
                                            <>
                                            <button className="btn btn-primary mt-2" style={{ marginRight: '10px'}} onClick={armarEquipos}>Armar equipos parejos random</button> 
	  						                <button className="btn btn-success mt-2" onClick={armarLaMejorOpcion}>Armar mejor opción</button>
                                            </>
                                        }
                                </div>
                                }
                            </div>
                        </div>
                        { teamOneArray.length > 0 &&
                        <div className="row" id="teamGenerated">  
                            <div className="col">
                                <ListTeam title={'Team 1'} teamArray={teamOneArray} totalPoints={pointsTeamOne} />
                            </div>
                            <div className="col">
                                <ListTeam title={'Team 2'} teamArray={teamTwoArray} totalPoints={pointsTeamTwo}/>
                            </div>
                        </div>
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