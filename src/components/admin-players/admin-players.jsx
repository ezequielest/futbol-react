import { useEffect } from "react";
import React, {useState} from 'react';
import { db } from "/src/firebase/firebase.js";
import { addDoc, updateDoc, collection, query, where, getDocs, getDoc, doc} from "firebase/firestore";
import PlayerCard from './../shared/components/player-card/player-card';
import { calcPoinsPlayer } from '/src/components/shared/player-service';
import UploadImage from '/src/components/shared/components/upload-image/upload-image';

function AdminPlayers(props) {

    const initialNewPlayer = {
        name: '',
        mainPosition: '1',
        secondaryPosition: '1',
        ability: 0,
        speed: 0,
        powerShoot: 0,
        resistance: 0,
        defense: 0,
        middle: 0,
        offence: 0,
        age: 0,
        onTeam: false
    };

    const [allPlayers, setAllPlayers] = useState([]);
    const [newPlayerForm, setNewPlayerForm] = useState(initialNewPlayer);
    const [loading, setLoading] = useState(false);
    const [viewPlayerSelected, setViewPlayerSelected] = useState({});
    const [isEditingPlayer, setIsEditingPlayer] = useState(false);

    useEffect(()=>{

        //const players = JSON.parse(localStorage.getItem('players'));
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
                console.log(doc.data())
                playersArray.push(doc.data())
            });
            setAllPlayers(playersArray);
            localStorage.setItem('players',JSON.stringify(playersArray));
        } catch (error) {
            console.error("Error al obtener datos de Firestore:", error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setNewPlayerForm({
            ...newPlayerForm,
            [name]: value
          });
    }

    const getPositionString = (number)=> {
        const positions = ['Arquero','Defensor','Medioc.','Delantero'];

        return positions[number-1];
    }

    const saveChange = async () => {

        let totalPoints = calcPoinsPlayer(newPlayerForm);
        console.log('saveChange ', newPlayerForm)
        const payload = {
            name: newPlayerForm.name,
            mainPosition: newPlayerForm.mainPosition,
            secondaryPosition: newPlayerForm.secondaryPosition,
            ability: parseInt(newPlayerForm.ability),
            speed: parseInt(newPlayerForm.speed),
            powerShoot: parseInt(newPlayerForm.powerShoot),
            resistance: parseInt(newPlayerForm.resistance),
            defense: parseInt(newPlayerForm.defense),
            middle: parseInt(newPlayerForm.middle),
            offence: parseInt(newPlayerForm.offence),
            age: parseInt(newPlayerForm.age),
            totalPoints: totalPoints,
            onTeam: false
        };

        setLoading(true);

        if (isEditingPlayer) {

          const playersRef = collection(db, "players");

          const q = query(playersRef, where("name", "==",  newPlayerForm.name));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(async(documento) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(documento.id, " => ", documento.data());
            const playersRef = doc(db, "players", documento.id);

            await updateDoc(playersRef, payload);

            getPlayersData();
            setLoading(false);
            setNewPlayerForm(initialNewPlayer);
            $('#newPlayerModal').modal('hide');
          });

        } else {
          addDoc(collection(db, "players"), payload)
          .then(()=>{
              console.log('ok')
              getPlayersData();
              setLoading(false);
              setNewPlayerForm(initialNewPlayer);
              $('#newPlayerModal').modal('hide');
          }).catch((err)=>{
              console.log(err)
          })
        }


    }


    const viewPlayer = (playerSelected) => {
        console.log('playerSelected ', playerSelected);
        setViewPlayerSelected(playerSelected);
        $('#showDataPlayer').modal('show');

    }

    const deletePlayer = () => {
        console.log('delete player')
    }

    const addPlayer =  () => {
      setIsEditingPlayer(false);
      $('#newPlayerModal').modal('show');
    }

    const editPlayer = (player) => {
        setIsEditingPlayer(true);
        setNewPlayerForm(player)
        $('#newPlayerModal').modal('show');
    }

    const closeModal = () => {
        setNewPlayerForm(initialNewPlayer);
    }

    return (
        <>
            <div id="content-wrapper" className="d-flex flex-column">

                {/* Main Content */}
                <div id="content">

                    {/* Begin Page Content */}
                    <div className="container-fluid mt-4">

                        <div className='row'>
                            <div className="col">
                                <button type="button" className="btn btn-primary mb-2" onClick={addPlayer}>
                                    AGREGAR NUEVO JUGADOR
                                </button>
                            </div>
                        </div>

                        {/* Content Row */}
                        <div className="row">

                            {/* Content Column */}
                            <div className="col-lg-12 mb-4">
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
                                                        <a style={{'marginRight': '10px'}} onClick={() => editPlayer(player)}><i className="fa-solid fa-edit"></i></a>
                                                        <a style={{'opacity': '0.1'}} onClick={deletePlayer}><i className="fa-solid fa-trash"></i></a>
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

            <div className="modal fade" id="newPlayerModal" tabIndex="-1" aria-labelledby="newPlayerModal" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            { isEditingPlayer &&
                                <h5 className="modal-title text-center center">Editar Jugador</h5>
                            }

                            { !isEditingPlayer &&
                                <h5 className="modal-title text-center center">Nuevo Jugador</h5>
                            }
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                            <form className='container'>

                                { isEditingPlayer &&
                                (<>
                                <div className="row">
                                    <div className="col-12">
                                        showing image
                                    </div>
                                </div>
                                </>
                                )
                                }

                                { !isEditingPlayer &&
                                (<>
                                <div className="row">
                                    <div className="col-12">
                                        <UploadImage />
                                    </div>
                                </div>
                                </>
                                )
                                }

                                <div className="row">
                                    <div className="col mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" className="form-control" name="name" id="nombre" value={newPlayerForm.name || ''} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col mb-3">
                                    <label className="form-label">Posicion principal</label>
                                    <select id="mainPosition" name="mainPosition" className="form-select" value={newPlayerForm.mainPosition || 1} onChange={handleInputChange}>
                                        <option value="1">Arquero</option>
                                        <option value="2">Defensa</option>
                                        <option value="3">Mediocampoista</option>
                                        <option value="4">Delantero</option>
                                    </select>
                                    </div>
                                    <div className="col mb-3">
                                    <label className="form-label">Posicion secundaria</label>
                                    <select id="secondaryPosition" name="secondaryPosition" className="form-select" value={newPlayerForm.secondaryPosition || 1} onChange={handleInputChange}>
                                        <option value="1">Arquero</option>
                                        <option value="2">Defensa</option>
                                        <option value="3">Mediocampoista</option>
                                        <option value="4">Delantero</option>
                                    </select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col mb-3">
                                    <label className="form-label">Habilidad</label>
                                    <input type="text" className="form-control" name="ability" value={newPlayerForm.ability || ''} onChange={handleInputChange}/>
                                    </div>
                                    <div className="col mb-3">
                                    <label className="form-label">Resistencia</label>
                                    <input type="text" className="form-control" name="resistance" value={newPlayerForm.resistance || ''} onChange={handleInputChange}/>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col mb-3">
                                    <label className="form-label">Velocidad</label>
                                    <input type="text" className="form-control" name="speed" value={newPlayerForm.speed || ''} onChange={handleInputChange}/>
                                    </div>
                                     <div className="col mb-3">
                                     <label className="form-label">Potencia de disparo</label>
                                    <input type="text" className="form-control" name="powerShoot" value={newPlayerForm.powerShoot || ''} onChange={handleInputChange}/>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col mb-3">
                                    <label className="form-label">Pts. defensa</label>
                                    <input type="text" className="form-control" name="defense" value={newPlayerForm.defense || ''} onChange={handleInputChange}/>
                                    </div>
                                    <div className="col mb-3">
                                    <label className="form-label">Pts. medioc.</label>
                                    <input type="text" className="form-control" name="middle" value={newPlayerForm.middle || ''} onChange={handleInputChange}/>
                                    </div>
                                    <div className="col mb-3">
                                    <label className="form-label">Pts. delantero</label>
                                    <input type="text" className="form-control" name="offence" value={newPlayerForm.offence || ''} onChange={handleInputChange}/>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Edad</label>
                                    <input type="text" className="form-control" name="age" value={newPlayerForm.age || ''} onChange={handleInputChange}/>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={closeModal}>Cancelar</button>
                            { isEditingPlayer &&
                              <button type="button" disabled={loading} className="btn btn-primary" onClick={saveChange}>Editar</button>
                            }
                            { !isEditingPlayer &&
                              <button type="button" disabled={loading} className="btn btn-primary" onClick={saveChange}>Agregar</button>
                            }
                        </div>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default AdminPlayers
