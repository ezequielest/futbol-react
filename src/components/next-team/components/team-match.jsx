import React, {useState} from 'react';

function TeamMatch(props) {

    const [viewPlayerSelected, setViewPlayerSelected] = useState({});
    const [arquero, setArquero] = useState({});
    const [defensores, setDefensores] = useState({});
    const [medio, setMedio] = useState({});
    const [delanteros, setDelanteros] = useState({});

    const seeDetails = (player) => {
      props.playerSelected(player);
    }

    return (<>
              <div className="team-container">
                    <h3 className='team-name'>{props.teamName}</h3>
                    <div className="next-team-map team-one">

                      <div className="row-match arquero">
                        { props.teamArray.map((player, i) => {
                          if (player.mainPosition === '1') {
                          return (<div key={i} className="player" onClick={() => seeDetails(player)}>
                              <i className="fa-solid fa-shirt"></i>
                              <div className="name">{player.name} ({player.totalPoints})</div>
                          </div>)
                          }
                        })}
                      </div>

                      <div className="row-match defensores">
                      { props.teamArray.map((player, i) => {
                          if (player.mainPosition === '2') {
                          return(<div key={i} className="player" onClick={() => seeDetails(player)}>
                              <i className="fa-solid fa-shirt"></i>
                              <div className="name">{player.name} ({player.totalPoints})</div>
                          </div>)
                          }
                        })
                      }
                      </div>

                      <div className="row-match mediocampistas">
                      { props.teamArray.map((player, i) => {
                          if (player.mainPosition === '3') {
                          return(<div key={i} className="player" onClick={() => seeDetails(player)}>
                              <i className="fa-solid fa-shirt"></i>
                              <div className="name">{player.name} ({player.totalPoints})</div>
                          </div>)
                          }
                        })}
                      </div>

                      <div className="row-match delanteros">
                      { props.teamArray.map((player, i) => {
                          if (player.mainPosition === '4') {
                          return(
                            <div key={i} className="player">
                              <i className="fa-solid fa-shirt" onClick={() => seeDetails(player)}></i>
                              <div className="name">{player.name} ({player.totalPoints})</div>
                          </div>)
                          }
                        })}
                      </div>

                    </div>
              </div>
            </>

    )


}

export default TeamMatch
