function ListTeam() {
    return (
        <>
        <div class="col-lg-6 col-md-6 mb-4  mt-8">
            <h2>{ title }</h2> 
            <ol class="list-group list-group-numbered">

            { teamArray.map((player, index) => {
                
                let listClass = '';

                if (player.posicion === 'Delantero') {
                    listClass = 'list-group-item-success';
                } else if (player.posicion === 'Mediocampista') {
                    listClass = 'list-group-item-warning';
                } else if (player.posicion === 'Arquero') {
                    listClass = 'list-group-item-danger';
                } else if (player.posicion === 'Defensor') {
                    listClass = 'list-group-item-primary';
                }

                return (
                <>
                <li key={index} className="badge bg-primary rounded-pill {listClass}">
                    {player.nombre} 
                    <div className="fw-bold">${player.posicion}</div>
                    <span className="badge bg-primary rounded-pill" style="color: white">${player.totalPoints}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-start"><h3>Puntos totales: ${totalPoints}</h3></li>
                </>
                )
            
                })
            }
            
            </ol>
        </div>
        </>
    )
}
