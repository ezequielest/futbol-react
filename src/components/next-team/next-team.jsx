import React, {useState} from 'react';
import {useEffect} from 'react';
import { db } from "/src/firebase/firebase.js";
import { doc, collection, getDocs,setDoc, addDoc, deleteDoc, query, where, updateDoc, orderBy, limit } from "firebase/firestore";
import './next-team.scss'
import TeamMatch from './components/team-match';
import PlayerCard from '/src/components/shared/components/player-card/player-card';
import { useNavigate  } from "react-router-dom";
import {calcPoinsPlayer} from '/src/components/shared/player-service';
import swal from 'sweetalert';

function NextTeam() {

    const [teamOneArray, setTeamOneArray] = useState([]);
    const [teamTwoArray, setTeamTwoArray] = useState([]);
    const [matchHasEnded, setMatchHasEnded] = useState(false);
    const [matchResultForm, setMatchResultForm] = useState({
      localResult: 0,
      visitingResult: 0
    })
    const [whitoutResult, setWhitoutResult] = useState(true);
    const [currentMatchId, setCurrentMatchId] = useState('');
    const [infoMatch, setInfoMatch] = useState({});
    const [playerSelected, setPlayerSelected] = useState({});
    const [bestPlayer, setBestPlayer] = useState(null);
    const [hardPlayer, setHardPlayer] = useState(null);
    const [allPlayers, setAllPlayers] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState([]);
  
    const [playerToCampare, setPlayerToCampare] = useState(null);

    const [playerToChange, setPlayerToChange] = useState(null);
    const [playerForChange, setPlayerForChange] = useState('');

    const [showGuestForm, setShowGuestForm] = useState(false);
    const [guestToChange, setGuestToChange] = useState({});
    const [guestForm, setGuestForm] = useState({
      name: '',
      points: 0
  });


    const navigate = useNavigate();

    useEffect(()=> {
      const logged = JSON.parse(localStorage.getItem('isLoggedIn'));
      setIsLoggedIn(logged);
      getTeamForTheNextMatch();
      getPlayersData();

      detectChangeOnModal();
    } , [])

    const detectChangeOnModal = () => {

      $('#showDataPlayer').on('hidden.bs.modal', function () {
          console.log('se cerro o se abrio el modal');
          setPlayerForChange(null);
          setPlayerToCampare(null);
      });


    }

    const getBeforeMatchTeam = async () => {
      cancelSaveOldMatch();
      try {
        //const querySnapshot = await getDocs(collection(db, "previous-matches").where(orderBy('update','desc'), limit(1)));
        const q = query(collection(db, "previous-matches"), orderBy('update', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.size === 0) {
          setWhitoutResult(true);
        } else {
          querySnapshot.forEach((doc) => {
            setWhitoutResult(false);

            setCurrentMatchId(doc.id);
            const data = doc.data();

            setInfoMatch({
              type: 'before',
              title: 'PARTIDO ANTERIOR',
              matchData: data
            })

            setBestPlayer(data.bestPlayer);
            setHardPlayer(data.hardPlayer);

            const oneArray = JSON.parse(data['localTeam']);
            const twoArray = JSON.parse(data['visitingTeam']);

            setTeamOneArray(oneArray);
            setTeamTwoArray(twoArray);

        });
        }


    } catch (error) {
        console.error("Error al obtener datos de Firestore:", error);
    }
    }

    const getTeamForTheNextMatch = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "next-match"));
            console.log('querySnapshot', querySnapshot)
            if (querySnapshot.size === 0) {
              setWhitoutResult(true);
            } else {
              querySnapshot.forEach((doc) => {
                setWhitoutResult(false);
                console.log('doc ',doc)
                setCurrentMatchId(doc.id);
                const data = doc.data();
                console.log('data ', data);
                const oneArray = JSON.parse(data['teamOne']);
                const twoArray = JSON.parse(data['teamTwo']);

                console.log('after parse data ', oneArray)

                setInfoMatch({
                  type: 'next',
                  title: 'EQUIPOS PARA EL PROXIMO PARTIDO',
                  matchData: data
                })
                setTeamOneArray(oneArray);
                setTeamTwoArray(twoArray);

            });
            }


        } catch (error) {
            console.error("Error al obtener datos de Firestore:", error);
        }
    };

    const finishMatch = () => {
      setMatchHasEnded(true);
    }

    const setWinnerTeam = (winner) => {
      console.log('winner ', winner)
    }

    const handleInputChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;

      setMatchResultForm({
        ...matchResultForm,
        [name]: value
      })
    }

    const handlePlayerSelected = (player) => {
      console.log('player ', player)
      setPlayerSelected(player);
      $('#showDataPlayer').modal('show');
    }

    const saveAsOldMatch = () => {
      const teamOne = JSON.stringify(teamOneArray);
      const teamTwo = JSON.stringify(teamTwoArray);

      const payload = {
          localResult: matchResultForm.localResult,
          visitingResult: matchResultForm.visitingResult,
          localTeam: teamOne,
          visitingTeam: teamTwo,
          update: new Date(),
      }

      addDoc(collection(db, "previous-matches"), payload)
      .then(()=>{
          //delete from next-team
          //update team points
          const localResultMatch = parseInt(matchResultForm.localResult);
          const visitingResultMatch = parseInt(matchResultForm.visitingResult);

          if (localResultMatch > visitingResultMatch) {
            teamOneArray.forEach(async player => {
              if (player.name.indexOf('INVITADO') === -1) {
                addPoints(player, 2);
              }
            })

            teamTwoArray.forEach(async player => {
              if (player.name.indexOf('INVITADO') === -1) {
                removePoints(player, 2);
              }
            });

          } else if (localResultMatch < visitingResultMatch){
            teamOneArray.forEach(async player => {
              if (player.name.indexOf('INVITADO') === -1) {
                removePoints(player, 2);
              }
            })

            teamTwoArray.forEach(async player => {
              if (player.name.indexOf('INVITADO') === -1) {
                addPoints(player, 2);
              }
            });
          } else {
            //empate, suma 1
            if (player.name.indexOf('INVITADO') === -1) {
              addPoints(player, 1);
            }
          }

          console.log('saved ok');
          deleteDoc(doc(db, "next-match", currentMatchId))
          .then(()=>{
              //delete from next-team
              //update team points
              getTeamForTheNextMatch();
          }).catch((err)=>{
              console.log(err)
          })
      }).catch((err)=>{
          console.log(err)
      })
    }

    const cancelSaveOldMatch = () => {
      setMatchHasEnded (false);
      setMatchResultForm ({});
    }

    const addPoints = async (player, cant) =>  {

      const q = query(collection(db, "players"), where("name", "==", player.name));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((document) => {
        console.log(document.id, " => ", document.data());
        const playerData = document.data();
        const player = doc(db, "players", document.id);

        let playerTemp =  playerData;

        if (playerTemp.mainPosition === '1') {
          playerTemp.defense = playerData.defense + cant > 99 ? 99 : parseInt(playerData.defense) + cant;
        } else if (playerTemp.mainPosition === '2'){
          playerTemp.defense = playerData.defense + cant > 99 ? 99 : parseInt(playerData.defense) + cant;
        } else if (playerTemp.mainPosition === '3') {
          playerTemp.middle = playerData.middle + cant > 99 ? 99 : parseInt(playerData.middle) + cant;
        } else if (playerTemp.mainPosition === '4') {
          playerTemp.offence = playerData.offence + cant > 99 ? 99 : parseInt(playerData.offence) + cant;
        }

        if (playerTemp.secondaryPosition === '1') {
          playerTemp.defense = playerData.defense + cant > 99 ? 99 : parseInt(playerData.defense) + cant;
        } else if (playerTemp.secondaryPosition === '2'){
          playerTemp.defense = playerData.defense + cant > 99 ? 99 : parseInt(playerData.defense) + cant;
        } else if (playerTemp.secondaryPosition === '3') {
          playerTemp.middle = playerData.middle + cant > 99 ? 99 : parseInt(playerData.middle) + cant;
        } else if (playerTemp.secondaryPosition === '4') {
          playerTemp.offence = playerData.offence + cant > 99 ? 99 : parseInt(playerData.offence) + cant;
        }

        const totalPoints = calcPoinsPlayer(playerTemp);

        updateDoc(player, {
          defense:      playerTemp.defense,
          middle:       playerTemp.middle,
          offence:      playerTemp.offence,
          totalMatchWin: playerTemp.totalMatchWin ? playerTemp.totalMatchWin + 1 : 1,
          totalMatch: playerTemp.totalMatch ? playerTemp.totalMatch + 1 : 1,
          totalPoints:  totalPoints
        });
      })
    }

    const removePoints = async (player) =>  {

      const q = query(collection(db, "players"), where("name", "==", player.name));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((document) => {
        console.log(document.id, " => ", document.data());
        const playerData = document.data();
        const player = doc(db, "players", document.id);

          let playerTemp =  playerData;

          if (playerTemp.mainPosition === '1') {
            playerTemp.defense = playerData.defense - 2 < 0 ? 0 : parseInt(playerData.defense) - 2;
          } else if (playerTemp.mainPosition === '2'){
            playerTemp.defense = playerData.defense - 2 < 0 ? 0 : parseInt(playerData.defense) - 2;
          } else if (playerTemp.mainPosition === '3') {
            playerTemp.middle = playerData.middle - 2 < 0 ? 0 : parseInt(playerData.middle) - 2;
          } else if (playerTemp.mainPosition === '4') {
            playerTemp.offence = playerData.offence - 2 < 0 ? 0 : parseInt(playerData.offence) - 2;
          }

          if (playerTemp.secondaryPosition === '1') {
            playerTemp.defense = playerData.defense - 2 < 0 ? 0 : parseInt(playerData.defense) - 2;
          } else if (playerTemp.secondaryPosition === '2'){
            playerTemp.defense = playerData.defense - 2 < 0 ? 0 : parseInt(playerData.defense) - 2;
          } else if (playerTemp.secondaryPosition === '3') {
            playerTemp.middle = playerData.middle - 2 < 0 ? 0 : parseInt(playerData.middle) - 2;
          } else if (playerTemp.secondaryPosition === '4') {
            playerTemp.offence = playerData.offence - 2 < 0 ? 0 : parseInt(playerData.offence) - 2;
          }

          const totalPoints = calcPoinsPlayer(playerTemp);

          updateDoc(player, {
            defense:      playerTemp.defense,
            middle:       playerTemp.middle,
            offence:      playerTemp.offence,
            totalMatchLost: playerTemp.totalMatchLost ? playerTemp.totalMatchLost + 1 : 1,
            totalMatch: playerTemp.totalMatch ? playerTemp.totalMatch + 1 : 1,
            totalPoints:  totalPoints
          });
      })
    }


    const goToBuildTeam = () => {
      navigate("/build-team");
    }

    const handleBestPlayer = (player) => {
      //buscar el documento por id de partidos antetiores y meter la data1
      const match = doc(db, "previous-matches", currentMatchId);

      updateDoc(match, {
        bestPlayer: player.name,
      }).then(async () => {
        setBestPlayer(player.name);

          const q = query(collection(db, "players"), where("name", "==", player.name));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((document) => {
            console.log(document.id, " => ", document.data());
            const playerData = document.data();
            const player = doc(db, "players", document.id);

            let playerTemp =  playerData;

            playerTemp.ability = playerData.ability + 1 > 99 ? 99 : parseInt(playerData.ability) + 1;
            playerTemp.powerShoot = playerData.powerShoot + 1 > 99 ? 99 : parseInt(playerData.powerShoot) + 1;
            playerTemp.resistance = playerData.resistance + 1 > 99 ? 99 : parseInt(playerData.resistance) + 1;
            playerTemp.speed = playerData.speed + 1 > 99 ? 99 : parseInt(playerData.speed) + 1;

            const totalPoints = calcPoinsPlayer(playerTemp);

            updateDoc(player, {
              ability:      playerTemp.ability,
              powerShoot:   playerTemp.powerShoot,
              resistance:   playerTemp.resistance,
              speed:        playerTemp.speed,
              totalPoints:  totalPoints
            });
        });
      })
    }

    const handleHardPlayer = (player) => {
      console.log('currentMatchId ',currentMatchId)
      const match = doc(db, "previous-matches", currentMatchId);

      updateDoc(match, {
        hardPlayer: player.name,
      }).then(async () => {
        setHardPlayer(player.name);

        const q = query(collection(db, "players"), where("name", "==", player.name));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((document) => {
          console.log(document.id, " => ", document.data());
          const playerData = document.data();
          const player = doc(db, "players", document.id);

          let playerTemp =  playerData;

          playerTemp.ability = playerData.ability - 1 < 0 ? 0 : parseInt(playerData.ability) - 1;
          playerTemp.powerShoot = playerData.powerShoot- 1 < 0 ? 0 : parseInt(playerData.powerShoot) - 1;
          playerTemp.resistance = playerData.resistance - 1 < 0 ? 0: parseInt(playerData.resistance) - 1;
          playerTemp.speed = playerData.speed - 1 < 0 ? 0: parseInt(playerData.speed) - 1;

          const totalPoints = calcPoinsPlayer(playerTemp);

          updateDoc(player, {
            ability:      playerTemp.ability,
            powerShoot:   playerTemp.powerShoot,
            resistance:   playerTemp.resistance,
            speed:        playerTemp.speed,
            totalPoints:  totalPoints
          });
        })
      });
    }

    const deleteMatch = () => {

      swal({
        title: "Estas seguro de eliminar el equipo actual?",
        text: "Una vez eliminado, debera crearlo nuevamente",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          deleteDoc(doc(db, "next-match", currentMatchId))
          .then(()=>{
              getTeamForTheNextMatch();
              swal("Equipo eliminado con éxito");
          }).catch((err)=>{
              console.log(err)
          })
        }
      });

    }

    const handleChangePlayer = (player) => {
      setPlayerToChange(player);

      $('#showDataPlayer').modal('hide');
      $('#modalChangePlayer').modal('show');
    }

    const getPlayersData = async (player) => {
      try {
          const querySnapshot = await getDocs(collection(db, "players"));
          const playersArray = [];
          querySnapshot.forEach((doc) => {
            playersArray.push(doc.data())
          });

          let playersArrayTemp;
          if (player) {
            playersArrayTemp = playersArray.filter(playerTeam => {
              return playerTeam.name !== player.name
            }) 
          } else {
            playersArrayTemp = playersArray;
          }

          setAllPlayers(playersArrayTemp);
          localStorage.setItem('players',JSON.stringify(playersArray));
      } catch (error) {
          console.error("Error al obtener datos de Firestore:", error);
      }
    };
      
    const hideModalChangePlayer = () => {
      setPlayerForChange(null);
      setPlayerToChange(null);
      $('#showDataPlayer').modal('show');
      $('#modalChangePlayer').modal('hide');
    }

    const handleSectionPlayerToChange = (e) => {
      const options = e.target.options;
      let playerForCh;
      for (let i = 0; i < options.length; i++) {
          if (options[i].selected) {
              playerForCh = options[i].value;
          }
      }

      const playerTemp = allPlayers.find((player) => {
        return player.name === playerForCh;
      })
      console.log('player for change ', playerForCh);
      setPlayerForChange(playerTemp);
    }

    const handleSectionPlayerToCompare = (e) => {
      const options = e.target.options;
      let playerForCh;
      for (let i = 0; i < options.length; i++) {
          if (options[i].selected) {
              playerForCh = options[i].value;
          }
      }

      const playerTemp = allPlayers.find((player) => {
        return player.name === playerForCh;
      })
      console.log('player for change ', playerForCh);
      setPlayerToCampare(playerTemp);
    }

    const handleChangePlayerToPlayer = () => {
      $('#showDataPlayer').modal('hide');
      $('#modalChangePlayer').modal('hide');
      let teamOneArrayTemp = [];
      let teamTwoArrayTemp = [];

      const mondayPlayer = teamOneArray.concat(teamTwoArray);

      const isAlreadyOnMatch = mondayPlayer.some(player => {
        return playerForChange.name === player.name;
      });

      if (isAlreadyOnMatch) {
        swal("No se puede reemplazar", "Este jugador ya forma parte del partido", "error");
      } else {
        //buscar donde esta el personaje que tengo que cambiar y reemplazarlo
        let hasChangeOnOneArray = teamOneArray.some((player) => {
          return player.name === playerToChange.name;
        })

        let hasChangeOnTwoArray = teamTwoArray.some((player) => {
          return player.name === playerToChange.name;
        })

        if (hasChangeOnOneArray) {
          teamOneArrayTemp = teamOneArray.filter((player) => {
            return player.name !== playerToChange.name;
          });

          teamOneArrayTemp.push(playerForChange);
          teamTwoArrayTemp = teamTwoArray;
        }

        if (hasChangeOnTwoArray) { 
          teamTwoArrayTemp = teamTwoArray.filter((player) => {
            return player.name !== playerToChange.name;
          });

          teamOneArrayTemp = teamOneArray;
          teamTwoArrayTemp.push(playerForChange);
        }

        const teamOne = JSON.stringify(teamOneArrayTemp);
        const teamTwo = JSON.stringify(teamTwoArrayTemp);

        const jsonTeams = {
            teamOne,
            teamTwo
        }

        setDoc(doc(db, "next-match", "krFHQIrA6som1LX34jlO"), jsonTeams).then(() => {
            swal("Jugador cambiado con éxito!");
            getTeamForTheNextMatch();
        });
      }
    }

    const addGuest = () => {
      setShowGuestForm(true);
    }

    const handleGuestForm = (e) => {

        const name = e.target.name;
        const value = e.target.value;

        const form = {
          ...guestForm,
          [name]: value
        }

        setGuestForm(form);
    }

    const addGuestToChange = () => {

      const guest = {
        name: guestForm.name + ' (INVITADO)',
        mainPosition: '3',
        totalPoints: guestForm.points
      }

      setPlayerForChange(guest);
      setShowGuestForm(false);
    }

    const cancelGuestToChange = () => {
      setShowGuestForm(false);
    }

    return (<>
              <header>
                <a className='btn btn-primary' onClick={getBeforeMatchTeam}>PARTIDO ANTERIOR</a>
                <a className='btn btn-primary' onClick={getTeamForTheNextMatch}>PROXIMO PARTIDO</a>
              </header>

              {whitoutResult &&
              (<>
              <div className="without-next-team">
                <div className="message">
                  <span>TODAVIA NO HAY EQUIPO DEFINIDO PARA EL PROXIMO PARTIDO</span>
                  { isLoggedIn && <a className='btn btn-primary' onClick={goToBuildTeam}>ARMAR EQUIPO</a> }
                </div>
              </div></>)
              }

              {!whitoutResult &&
              (<>
              <div className="next-team-container">
                {infoMatch.type === 'before' &&
                  (<>
                  <div className="result-container">
                  <p className="title">RESULTADO PARTIDO ANTERIOR</p>

                    {/* Content Row */}
                    <div className="row mb-4 players-chosen">

                      {/* Earnings (Monthly) Card Example */}
                      <div className="col-md-6 mb-4">
                          <div className="card border-left-primary shadow h-100 py-2">
                              <div className="card-body">
                                  <div className="row no-gutters align-items-center">
                                      <div className="col mr-2">
                                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                              mejor jugador</div>
                                          <div className="h5 mb-0 font-weight-bold text-gray-800">{ bestPlayer ? bestPlayer : 'SIN DEFINIR'}</div>
                                      </div>
                                      <div className="col-auto">
                                          <i className="fas fa-trophy fa-2x text-gray-300"></i>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Earnings (Monthly) Card Example */}
                      <div className="col-md-6 mb-4">
                          <div className="card border-left-success shadow h-100 py-2">
                              <div className="card-body">
                                  <div className="row no-gutters align-items-center">
                                      <div className="col mr-2">
                                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                              MAS PICANTE</div>
                                          <div className="h5 mb-0 font-weight-bold text-gray-800">{ hardPlayer ? hardPlayer : 'SIN DEFINIR'}</div>
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

                  <div className='results'>
                    <div className='team'>
                      <h5>LOCAL</h5>
                      <h1>{ infoMatch.matchData.localResult }</h1>
                    </div>
                    -
                    <div className='team'>
                      <h5>VISITANTE</h5>
                      <h1>{ infoMatch.matchData.visitingResult }</h1>
                    </div>
                  </div>
                  </div>
                  </>)
                }

                {infoMatch.type === 'next' &&
                  <p className="title">PROXIMO PARTIDO</p>
                }

                <div className="team-match-container">
                  <TeamMatch teamName={'local'} teamArray={teamOneArray} playerSelected={handlePlayerSelected} />
                  <TeamMatch teamName={'visitante'} teamArray={teamTwoArray} playerSelected={handlePlayerSelected} invertPositions={true} />
                </div>

                <div className="finish-team-form">
                  { !matchHasEnded && infoMatch.type === 'next' &&
                    (<>
                    <a className='btn btn-primary mx-2' onClick={finishMatch}>Finalizar partido</a>
                    <a className='btn btn-danger' onClick={deleteMatch}>Eliminar equipo</a>
                    </>)
                  }
                  { matchHasEnded && infoMatch.type === 'next' &&
                  (
                    <div className="set-win-form">
                    <h5>GANADOR DEL ENCUENTRO</h5>
                    <div>
                      LOCAL
                      <input className='form-control' name="localResult" type="number" onChange={handleInputChange}/>
                    </div>
                    <div>
                      VISITANTE
                      <input className='form-control' name="visitingResult" type="number" onChange={handleInputChange}/>
                    </div>
                    <a className='btn btn-danger cancel' onClick={cancelSaveOldMatch}>CANCELAR</a>
                    <a className='btn btn-primary' onClick={saveAsOldMatch}>GUARDAR RESULTADO</a>
                    </div>
                  )
                  }
                </div>
              </div>

              <div className="modal fade" id="showDataPlayer" tabIndex="-1" aria-labelledby="showDataPlayer" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content data-player-content">
                    <div class="modal-header">
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body h-100 mobile-100">
                      <div className="players-compare-container h-100 mobile-100">
                        <div className='player-card-container'>
                          <PlayerCard player={playerSelected} />
                        </div>

                        <div className='mt-4 mb-4 mx-4'>
                          <h5>Comparar con</h5>
                          <select name="allPlayers" id="allPlayersSelect" value={playerForChange?.name || ''} className="form-select all-players single mt-4" onChange={handleSectionPlayerToCompare}>
                              <option value="">Elegir jugador</option>
                              {
                                  allPlayers?.map((player, i)=> {
                                      return <option key={i} value={player.name}>{player.name}</option>;
                                  })
                              }
                          </select>
                        </div>

                        { playerToCampare && <div className='player-card-container'><PlayerCard player={playerToCampare} /></div>}
                      </div>

                      {
                        isLoggedIn && (
                          <>
                            <div className="modal-footer">
                            {!bestPlayer && infoMatch.type !== 'next' &&
                            (<a className='btn btn-primary' onClick={() => handleBestPlayer(playerSelected)}>MEJOR JUGADOR</a>)
                            }
      
                            {!hardPlayer && infoMatch.type !== 'next' &&
                            (<a className='btn btn-danger' onClick={() => handleHardPlayer(playerSelected)}>JUGADOR MAS PICANTE</a>)
                            }
      
                            { infoMatch.type === 'next' && !playerToCampare &&
                            (<a className='btn btn-primary' onClick={() => handleChangePlayer(playerSelected)}>CAMBIAR JUGADOR</a>)
                            }
                            
                            </div>
                          </>
                        )
                      }
                      </div>
                    </div>
                </div>
              </div>
              </>)
              }


              <div className="modal fade" id="modalChangePlayer" tabIndex="-1" aria-labelledby="modalChangePlayer" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">                   
                    
                    <div class="modal-header">
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        <div className='change-for-container'>
                        <div className='mx-4'>
                          { playerToChange?.image &&<img className="avatar-player mx-2" src={'https://futbol-team.s3.us-east-2.amazonaws.com/' + playerToChange?.image} />}
                          { !playerToChange?.image && <div className="avatar-player placeholder">{playerToChange?.name[0] }</div>}
                          { playerToChange?.name }
                        </div>
                        { playerForChange &&
                        (<>
                        <div className='mx-4'>POR</div>
                        <div className='mx-4'>
                          { playerForChange?.image &&<img className="avatar-player mx-2" src={'https://futbol-team.s3.us-east-2.amazonaws.com/' + playerForChange?.image} />}
                          { !playerForChange?.image && <div className="avatar-player placeholder">{playerForChange?.name[0] }</div>}
                          { playerForChange?.name }
                        </div>
                        </>)
                        }
                        </div>

                        <div>


                          { !showGuestForm && !playerForChange &&
                          
                          (<>
                            <select name="allPlayers" id="allPlayersSelect" value={playerForChange?.name || ''} className="form-select all-players single mt-4" onChange={handleSectionPlayerToChange}>
                              <option value="">Seleccionar reemplazo</option>
                              {
                                  allPlayers?.map((player, i)=> {
                                      return <option key={i} value={player.name}>{player.name}</option>;
                                  })
                              }
                            </select>
                            <button className="btn btn-outline-dark mx-2 mt-2" onClick={addGuest}>Agregar invitado</button>
                          </>)
                          
                          }

                          { showGuestForm && 
                          (<>
                            <h5 className='mt-4 mb-2'>Datos de invitado</h5>
                            <form className='mt-4'>
                              <label>Nombre</label>
                              <input type="text" name="name" className='form-control' onChange={handleGuestForm}/>
                              <label>Puntos totales</label>
                              <input type="number" name="points" className='form-control' onChange={handleGuestForm}/>
                          </form>
                          </>)
                          }

                        </div>


                    </div>
                    
                    <div className="modal-footer">
                    { showGuestForm &&
                    (<>
                      <button className="btn btn-outline-primary mx-2 mt-4" onClick={addGuestToChange} >Agregar</button>
                      <button className="btn btn-outline-danger mx-2 mt-4" onClick={cancelGuestToChange} >Cancelar</button>
                    </>) 
                    }

                    { !showGuestForm &&
                    (<>
                      <a className='btn btn-primary' onClick={() => handleChangePlayerToPlayer(playerSelected)}>CAMBIAR</a>
                      <a className='btn btn-danger' onClick={() => hideModalChangePlayer(playerSelected)}>CANCELAR</a>
                    </>)
                    }
                    </div>
                    </div>
                </div>
              </div>

            </>
    )
}

export default NextTeam
