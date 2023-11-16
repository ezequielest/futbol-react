


function PlayerCard(props) {

const getPositionString = (number)=> {
    const positions = ['Arquero','Defensor','Medioc.','Delantero'];

    return positions[number-1];
}

return (
   <div className="card">
        <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                <div style={{ display: 'flex'}} className="mb-3">
                    { props.player.image && <img className="avatar-player-card" src={'https://futbol-team.s3.us-east-2.amazonaws.com/' + props.player.image} />}
                    { !props.player.image && props.player.name && <div className="avatar-player-card placeholder">{props.player.name[0] }</div>}
                    <div>
                        <h3 className="card-title">{props.player.name}</h3>
                        <h6 className="card-subtitle mb-2 text-muted">{getPositionString(props.player.mainPosition)}</h6>
                        <p className="card-text"><span className="badge bg-primary rounded-pill">Edad {props.player.age}</span></p>
                    </div>
                </div>
                <div>
                    <div className="bg-primary" style={{ borderRadius: '50%', height: '100px', width: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><span style={{ fontSize: '50px'}} className="text-gray-100">{props.player.totalPoints}</span></div>
                </div>
            </div>

            <div className="mb-2">
                <div className="mb-1">Habilidad <span className="badge bg-primary rounded-pill">{props.player.ability}</span></div>
                <div className="progress">
                    <div className={`progress-bar bg-info w–${props.player.ability}`} style={{ width: props.player.ability + '%'}} role="progressbar" aria-valuenow={props.player.ability} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>

            <div className="mb-2">
                <div className="mb-1">Resistencia <span className="badge bg-primary rounded-pill">{props.player.resistance}</span></div>
                <div className="progress">
                    <div className={`progress-bar bg-info w–${props.player.resistance}`} style={{ width: props.player.resistance + '%'}} role="progressbar" aria-valuenow={props.player.ability} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>

            <div className="mb-2">
                <div className="mb-1">Velocidad <span className="badge bg-primary rounded-pill">{props.player.speed}</span></div>
                <div className="progress">
                    <div className={`progress-bar bg-info w–${props.player.speed}`} style={{ width: props.player.speed + '%'}} role="progressbar" aria-valuenow={props.player.ability} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>

            <div className="mb-2">
                <div className="mb-1">Potencia de disparo <span className="badge bg-primary rounded-pill">{props.player.powerShoot}</span></div>
                <div className="progress">
                    <div className={`progress-bar bg-info w–${props.player.powerShoot}`} style={{ width: props.player.powerShoot + '%'}} role="progressbar" aria-valuenow={props.player.ability} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>

            <div className="mb-2">
                <div className="mb-1">Puntos como defensor <span className="badge bg-primary rounded-pill">{props.player.defense}</span></div>
                <div className="progress">
                    <div className={`progress-bar bg-primary w–${props.player.defense}`} style={{ width: props.player.defense + '%'}} role="progressbar" aria-valuenow={props.player.ability} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>

            <div className="mb-2">
                <div className="mb-1">Puntos como mediocampista <span className="badge bg-primary rounded-pill">{props.player.middle}</span></div>
                <div className="progress">
                    <div className={`progress-bar bg-warning w–${props.player.middle}`} style={{ width: props.player.middle + '%'}} role="progressbar" aria-valuenow={props.player.ability} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>

            <div className="mb-2">
                <div className="mb-1">Puntos como delantero <span className="badge bg-primary rounded-pill">{props.player.offence}</span></div>
                <div className="progress">
                    <div className={`progress-bar bg-success w–${props.player.offence}`} style={{ width: props.player.offence + '%'}} role="progressbar" aria-valuenow={props.player.ability} aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        </div>
    </div>)
}

export default PlayerCard

