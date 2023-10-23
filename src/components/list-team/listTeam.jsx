import React from "react";

function ListTeam(props) {
    return (
        <>
        <div className="col-lg-12 col-md-6 mb-4  mt-8">
            <h2>{ props.title }</h2> 
            <ol className="list-group list-group-numbered">

            { props.teamArray.map((player, index) => {

                let listClass = '';

                if (player.posicion === 'Delantero') {
                    listClass = 'list-group-item d-flex justify-content-between align-items-start list-group-item-success';
                } else if (player.posicion === 'Mediocampista') {
                    listClass = 'list-group-item d-flex justify-content-between align-items-start list-group-item-warning';
                } else if (player.posicion === 'Arquero') {
                    listClass = 'list-group-item d-flex justify-content-between align-items-start list-group-item-danger';
                } else if (player.posicion === 'Defensor') {
                    listClass = 'list-group-item d-flex justify-content-between align-items-start list-group-item-primary';
                }

                return (
                <React.Fragment key={index}>
                <li className={listClass}>
                    <div className="ms-2 me-auto">
	   					<div className="fw-bold">{player.name}</div>
					</div>
                    <span className="badge bg-primary rounded-pill" style={{color: '#ddd'}}>{player.totalPoints}</span>
                </li>
                </React.Fragment>
                )
                
                })
            }

            { <li className="list-group-item d-flex justify-content-between align-items-start"><h3>Puntos totales: {props.totalPoints}</h3></li>}
            
            </ol>
        </div>
        </>
    )
}

export default ListTeam