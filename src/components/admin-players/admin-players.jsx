import { useEffect } from "react";
import React, {useState} from 'react';
import { db } from "/src/firebase/firebase.js";
import { collection, getDocs } from "firebase/firestore"; 
import { addDoc } from "firebase/firestore"; 


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
        totalPoints: 0,
        onTeam: false
    };

    const [allPlayers, setAllPlayers] = useState([]);
    const [newPlayerForm, setNewPlayerForm] = useState(initialNewPlayer);
    const [loading, setLoading] = useState(false);
    const [viewPlayerSelected, setViewPlayerSelected] = useState({});

    useEffect(()=>{

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

    const handleInputChange = (e) => {
        console.log(e.target)
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

    const saveChange = () => {
        console.log('result form ', newPlayerForm);

        let points = 
            (
                (parseInt(newPlayerForm.ability) * 0.5) + 
                (parseInt(newPlayerForm.resistance) * 0.1) + 
                (parseInt(newPlayerForm.speed) * 0.1) + 
                (parseInt(newPlayerForm.powerShoot) * 0.2)
            );
        
        //1 arquero - 2 defensa - 3 mediocampista - 4 delantero TODO crear enum
        if (newPlayerForm.posicion === 1) {
            points = points + (parseInt(newPlayerForm.defense) * 0.1 )
        } else if (newPlayerForm.posicion === 2) {
            points = points + (parseInt(newPlayerForm.defense) * 0.1 )  
        } else if (newPlayerForm.posicion === 3) {
            points = points + (parseInt(newPlayerForm.middle) * 0.1 )
        } else {
            points = points + (parseInt(newPlayerForm.offence) * 0.1 ) 
        }

        const totalPoints = Math.round(points);
        console.log('totalPoints ',totalPoints)
        const payload = {
            name: newPlayerForm.name,
            mainPosition: newPlayerForm.mainPosition,
            secondaryPosition: newPlayerForm.secondaryPosition,
            ability: newPlayerForm.ability,
            speed: newPlayerForm.speed,
            powerShoot: newPlayerForm.powerShoot,
            resistance: newPlayerForm.resistance,
            defense: newPlayerForm.defense,
            middle: newPlayerForm.middle,
            offence: newPlayerForm.offence,
            age: newPlayerForm.age,
            totalPoints: totalPoints,
            onTeam: false
        };
        setLoading(true);
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

    const viewPlayer = (playerSelected) => {
        console.log('view player')
        console.log('player selected ',playerSelected);
        setViewPlayerSelected(playerSelected);
        $('#showDataPlayer').modal('show');
        
    }

    const deletePlayer = () => {
        console.log('delete player')
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
                                <button type="button" className="btn btn-primary mb-2" data-bs-toggle="modal" data-bs-target="#newPlayerModal">
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
                                                        <td><a style={{'marginRight': '10px'}} onClick={() => viewPlayer(player)}><i className="fa-regular fa-eye"></i></a><a onClick={deletePlayer}><i className="fa-solid fa-trash"></i></a></td>
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
                        <div className="card">
                            <div className="card-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                                    <div style={{ display: 'flex'}} className="mb-3">
                                        <img src="https://placehold.co/100x100" style={{ marginRight: '20px'}}/>
                                        <div>
                                            <h3 className="card-title">{viewPlayerSelected.name}</h3>
                                            <h6 className="card-subtitle mb-2 text-muted">{getPositionString(viewPlayerSelected.mainPosition)}</h6>
                                            <p className="card-text"><span className="badge bg-primary rounded-pill">Edad {viewPlayerSelected.age}</span></p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="bg-primary" style={{ borderRadius: '50%', height: '100px', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><span style={{ fontSize: '50px'}} className="text-gray-100">{viewPlayerSelected.totalPoints}</span></div>
                                    </div>
                                </div>
                                
                                <div className="mb-2">
                                    <div className="mb-1">Habilidad <span className="badge bg-primary rounded-pill">{viewPlayerSelected.ability}</span></div>
                                    <div className="progress">
                                        <div className={`progress-bar bg-info w–${viewPlayerSelected.ability}`} style={{ width: viewPlayerSelected.ability + '%'}} role="progressbar" aria-valuenow={viewPlayerSelected.ability} aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className="mb-1">Resistencia <span className="badge bg-primary rounded-pill">{viewPlayerSelected.resistance}</span></div>
                                    <div className="progress">
                                        <div className={`progress-bar bg-info w–${viewPlayerSelected.resistance}`} style={{ width: viewPlayerSelected.resistance + '%'}} role="progressbar" aria-valuenow={viewPlayerSelected.ability} aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className="mb-1">Velocidad <span className="badge bg-primary rounded-pill">{viewPlayerSelected.speed}</span></div>
                                    <div className="progress">
                                        <div className={`progress-bar bg-info w–${viewPlayerSelected.speed}`} style={{ width: viewPlayerSelected.speed + '%'}} role="progressbar" aria-valuenow={viewPlayerSelected.ability} aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className="mb-1">Potencia de disparo <span className="badge bg-primary rounded-pill">{viewPlayerSelected.powerShoot}</span></div>
                                    <div className="progress">
                                        <div className={`progress-bar bg-info w–${viewPlayerSelected.powerShoot}`} style={{ width: viewPlayerSelected.powerShoot + '%'}} role="progressbar" aria-valuenow={viewPlayerSelected.ability} aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className="mb-1">Puntos como defensor <span className="badge bg-primary rounded-pill">{viewPlayerSelected.defense}</span></div>
                                    <div className="progress">
                                        <div className={`progress-bar bg-primary w–${viewPlayerSelected.defense}`} style={{ width: viewPlayerSelected.defense + '%'}} role="progressbar" aria-valuenow={viewPlayerSelected.ability} aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className="mb-1">Puntos como mediocampista <span className="badge bg-primary rounded-pill">{viewPlayerSelected.middle}</span></div>
                                    <div className="progress">
                                        <div className={`progress-bar bg-warning w–${viewPlayerSelected.middle}`} style={{ width: viewPlayerSelected.middle + '%'}} role="progressbar" aria-valuenow={viewPlayerSelected.ability} aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className="mb-1">Puntos como delantero <span className="badge bg-primary rounded-pill">{viewPlayerSelected.offence}</span></div>
                                    <div className="progress">
                                        <div className={`progress-bar bg-success w–${viewPlayerSelected.offence}`} style={{ width: viewPlayerSelected.offence + '%'}} role="progressbar" aria-valuenow={viewPlayerSelected.ability} aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>

                               {/**  <a href="#" className="card-link">Card link</a>
                                <a href="#" className="card-link">Another link</a>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="newPlayerModal" tabIndex="-1" aria-labelledby="newPlayerModal" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-center center">Nuevo Jugador</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                            <form className='container'>

                                <div className="row">
                                    <div className="col mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" className="form-control" name="name" id="nombre" value={newPlayerForm.name || ''} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col mb-3">
                                    <label className="form-label">Posicion principal</label>
                                    <select id="mainPosition" name="mainPosition" className="form-select" onChange={handleInputChange}>
                                        <option value="1">Arquero</option>
                                        <option value="2">Defensa</option>
                                        <option value="3">Mediocampoista</option>
                                        <option value="4">Delantero</option>
                                    </select>
                                    </div>
                                    <div className="col mb-3">
                                    <label className="form-label">Posicion secundaria</label>
                                    <select id="secondaryPosition" name="secondaryPosition" className="form-select" onChange={handleInputChange}>
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
                            <button type="button" disabled={loading} className="btn btn-primary" onClick={saveChange}>Agregar</button>
                        </div>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default AdminPlayers