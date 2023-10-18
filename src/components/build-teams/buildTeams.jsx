import React, {useState} from 'react';

function BuildTeam() {

    //const [cantSelected, setCantSelected] = useState(0);
    const [playersSelected, setPlayersSelected] = useState([]);
    const [mondayPlayers, setMondayPlayers] = useState([]); 
    const [errorString, setErrorString] = useState(''); 

    let cantSelected = 0;
    let maxPlayers = 12;

    const allPlayers = [
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
	];

    const handleAllPlayersChange = (e) => {
        const options = e.target.options;
        console.log('e ', e)
        console.log('options ', options)
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
        }
  
  
  
        console.log('mondayPlayers ', mondayPlayers);
      }

    const refresh = ()=> {
        console.log('refresh')
    }

    const armarEquipos = () => {
        console.log('RANDOM -----------------------')
		teamOneArray = [];
		teamTwoArray = [];

        mondayPlayers = resetOnTeam(mondayPlayers);

        mondayPlayersRandom = shuffle(mondayPlayers);

        arqueros = getForPosition('Arquero', mondayPlayersRandom);

        if (arqueros) {
            if (arqueros.length > 1) {
                teamOneArray.push(arqueros[0]);
                teamTwoArray.push(arqueros[1]);

                arqueros[0].onTeam = true;
                arqueros[1].onTeam = true;
            }
        }

        let restOfPlayers = mondayPlayers.filter(players => {
            return players.onTeam === false;
        })

	  	for (let i = 0; i < restOfPlayers.length; i++) {
		    if (i % 2 === 0) {
		      teamOneArray.push(restOfPlayers[i]);
		    } else {
		      teamTwoArray.push(restOfPlayers[i]);
		    }
		}

		pointsTeamOne = calcTeamPoints(teamOneArray);
		pointsTeamTwo = calcTeamPoints(teamTwoArray);

		let diff = Math.abs(pointsTeamOne - pointsTeamTwo);

		if (pointsTeamOne !== pointsTeamTwo && diff > 30){
            let i = 0;
			while (diff > 30) {
				console.log('emparejando');
				doTeamsEquals(pointsTeamOne, pointsTeamTwo, i);

				pointsTeamOne = calcTeamPoints(teamOneArray);
				pointsTeamTwo = calcTeamPoints(teamTwoArray);

				diff = Math.abs(pointsTeamOne - pointsTeamTwo);
                i++;
			}
		};

        teamOneArray = teamOneArray.sort(compararPosiciones);
        teamTwoArray = teamTwoArray.sort(compararPosiciones);

		teamHTML = '';
		imprimirEquipo(teamOneArray, 'Equipo 1', pointsTeamOne);
		imprimirEquipo(teamTwoArray, 'Equipo 2', pointsTeamTwo);
    }

    function imprimirEquipo(teamArray, title, totalPoints) {
        teamHTML += '<div class="col-lg-6 col-md-6 mb-4  mt-8">';
        teamHTML += `<h2>${ title }</h2> 
                       <ol class="list-group list-group-numbered">`;
        teamArray.forEach((player, index) => {
  
          if (player.posicion === 'Delantero') {
              teamHTML += `<li class="list-group-item d-flex justify-content-between align-items-start list-group-item-success">`
          } else if (player.posicion === 'Mediocampista') {
              teamHTML += `<li class="list-group-item d-flex justify-content-between align-items-start list-group-item-warning">`
          }else if (player.posicion === 'Arquero') {
              teamHTML += `<li class="list-group-item d-flex justify-content-between align-items-start list-group-item-danger">`
          }else if (player.posicion === 'Defensor') {
              teamHTML += `<li class="list-group-item d-flex justify-content-between align-items-start list-group-item-primary">`
          }
  
  
         teamHTML += `${player.nombre} 
                             <div class="fw-bold">${player.posicion}</div>
                          <span class="badge bg-primary rounded-pill" style="color: white">${player.totalPoints}</span>
                      </li>`;
        });
        teamHTML += `<li class="list-group-item d-flex justify-content-between align-items-start"><h3>Puntos totales: ${totalPoints}</h3></li>`;
        teamHTML += `</ol>`;
        teamHTML += '</div>';
  
        document.getElementById('teamGenerated').innerHTML = teamHTML;
  
      }

    const resetOnTeam = (array) => {
        updateArray = []
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
                        <div className="row">

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
                                                allPlayers.map((player, i)=> {
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
                                            <button className="btn btn-primary mt-2" style={{ marginRight: '10px'}} onClick="armarEquipos">Armar equipos parejos random</button> 
	  						                <button className="btn btn-success mt-2" onclick="armarLaMejorOpcion('best')">Armar mejor opción</button>
                                            </>
                                        }
                                </div>
                                }
                            </div>
                        </div>

                        <div className="row" id="teamGenerated">  
                                <teamList></teamList>
                        </div>

                    </div>
                    {/* /.container-fluid */}

                </div>
                {/* End of Main Content */}

                {/* Footer */}
                <footer className="sticky-footer bg-white">
                    <div className="container my-auto">
                        <div className="copyright text-center my-auto">
                            <span>El lunes a la cancha &copy;</span>
                        </div>
                    </div>
                </footer>
                {/* End of Footer */}

                </div>
            </>
        
    )


}

export default BuildTeam