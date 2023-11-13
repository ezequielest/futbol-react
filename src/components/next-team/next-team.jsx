import React, {useState} from 'react';
import {useEffect} from 'react';
import { db } from "/src/firebase/firebase.js";
import { doc, collection, getDocs, addDoc, deleteDoc, query, where, updateDoc, orderBy, limit } from "firebase/firestore";
import './next-team.scss'
import TeamMatch from './components/team-match';
import PlayerCard from '/src/components/shared/components/player-card/player-card';
import { useNavigate  } from "react-router-dom";
import {calcPoinsPlayer} from '/src/components/shared/player-service';

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
    const navigate = useNavigate();

    useEffect(()=> {
      getTeamForTheNextMatch();
    } , [])

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
              addPoints(player);
            })

            teamTwoArray.forEach(async player => {
              removePoints(player);
            });

          } else if (localResultMatch < visitingResultMatch){
            teamOneArray.forEach(async player => {
              removePoints(player);
            })

            teamTwoArray.forEach(async player => {
              addPoints(player);
            });
          }

          console.log('saved ok');
          deleteDoc(doc(db, "next-match", currentMatchId))
          .then(()=>{
              //delete from next-team
              //update team points
              getTeamForTheNextMatch();

              console.log('deleted ok from current played')
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

    const addPoints = async (player) =>  {

      const q = query(collection(db, "players"), where("name", "==", player.name));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((document) => {
        console.log(document.id, " => ", document.data());
        const playerData = document.data();
        const player = doc(db, "players", document.id);

        let playerTemp =  playerData;

        if (playerTemp.mainPosition === '1') {
          playerTemp.defense = playerData.defense + 2 > 99 ? 99 : parseInt(playerData.defense) + 2;
        } else if (playerTemp.mainPosition === '2'){
          playerTemp.defense = playerData.defense + 2 > 99 ? 99 : parseInt(playerData.defense) + 2;
        } else if (playerTemp.mainPosition === '3') {
          playerTemp.middle = playerData.middle + 2 > 99 ? 99 : parseInt(playerData.middle) + 2;
        } else if (playerTemp.mainPosition === '4') {
          playerTemp.offence = playerData.offence + 2 > 99 ? 99 : parseInt(playerData.offence) + 2;
        }

        if (playerTemp.secondaryPosition === '1') {
          playerTemp.defense = playerData.defense + 2 > 99 ? 99 : parseInt(playerData.defense) + 2;
        } else if (playerTemp.secondaryPosition === '2'){
          playerTemp.defense = playerData.defense + 2 > 99 ? 99 : parseInt(playerData.defense) + 2;
        } else if (playerTemp.secondaryPosition === '3') {
          playerTemp.middle = playerData.middle + 2 > 99 ? 99 : parseInt(playerData.middle) + 2;
        } else if (playerTemp.secondaryPosition === '4') {
          playerTemp.offence = playerData.offence + 2 > 99 ? 99 : parseInt(playerData.offence) + 2;
        }

        console.log('player temp ', playerTemp)
        const totalPoints = calcPoinsPlayer(playerTemp);
        console.log('totalPoints ', totalPoints)
        updateDoc(player, {
          defense:      playerTemp.defense,
          middle:       playerTemp.middle,
          offence:      playerTemp.offence,
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

            playerTemp.ability = playerData.ability + 2 > 99 ? 99 : parseInt(playerData.ability) + 2;
            playerTemp.powerShoot = playerData.powerShoot === 99 ? 99 : parseInt(playerData.powerShoot) + 1;
            playerTemp.resistance = playerData.resistance === 99 ? 99 : parseInt(playerData.resistance) + 1;
            playerTemp.speed = playerData.speed === 99 ? 99 : parseInt(playerData.speed) + 1;
    
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

          playerTemp.ability = playerData.ability - 2 < 0 ? 0 : parseInt(playerData.ability) - 2;
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
                  <a className='btn btn-primary' onClick={goToBuildTeam}>ARMAR EQUIPO</a>
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
                  <TeamMatch teamName={'LOCAL'} teamArray={teamOneArray} playerSelected={handlePlayerSelected} />
                  <TeamMatch teamName={'VISITANTE'} teamArray={teamTwoArray} playerSelected={handlePlayerSelected} />
                </div>

                <div className="finish-team-form">
                  { !matchHasEnded && infoMatch.type === 'next' &&
                    <a className='btn btn-secondary' onClick={finishMatch}>Finalizar partido</a>
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
                  <div className="modal-content">

                    <div className="modal-body">
                      <PlayerCard player={playerSelected} />
                    </div>
                    
                    <div className="modal-footer">
                      {!bestPlayer && infoMatch.type !== 'next' &&
                      (<a className='btn btn-primary' onClick={() => handleBestPlayer(playerSelected)}>MEJOR JUGADOR</a>)
                      }

                      {!hardPlayer && infoMatch.type !== 'next' &&
                      (<a className='btn btn-danger' onClick={() => handleHardPlayer(playerSelected)}>MEJOR MAS PICANTE</a>)
                      }
                    </div>
                    </div>
                </div>
              </div>
              </>)
              }
            </>
    )
}

export default NextTeam
