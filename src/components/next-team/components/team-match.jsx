import React from 'react';
import './team-match.scss';

function TeamMatch(props) {

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
                              { player.image && <img className="avatar-player" src={'https://futbol-team.s3.us-east-2.amazonaws.com/' + player.image} />}
                              { !player.image && <div className="avatar-player placeholder">{player.name[0] }</div>}
                              <div className="name">{player.name} ({player.totalPoints})</div>
                          </div>)
                          }
                        })}
                      </div>

                      <div className="row-match defensores">
                      { props.teamArray.map((player, i) => {
                          if (player.mainPosition === '2') {
                          return(<div key={i} className="player" onClick={() => seeDetails(player)}>
                              { player.image && <img className="avatar-player" src={'https://futbol-team.s3.us-east-2.amazonaws.com/' + player.image} />}
                              { !player.image && <div className="avatar-player placeholder">{player.name[0] }</div>}
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
                              { player.image && <img className="avatar-player" src={'https://futbol-team.s3.us-east-2.amazonaws.com/' + player.image} />}
                              { !player.image && <div className="avatar-player placeholder">{player.name[0] }</div>}
                              <div className="name">{player.name} ({player.totalPoints})</div>
                          </div>)
                          }
                        })}
                      </div>

                      <div className="row-match delanteros">
                      { props.teamArray.map((player, i) => {
                          if (player.mainPosition === '4') {
                          return(
                            <div key={i} className="player" onClick={() => seeDetails(player)}>
                              { player.image && <img className="avatar-player" src={'https://futbol-team.s3.us-east-2.amazonaws.com/' + player.image} />}
                              { !player.image && <div className="avatar-player placeholder">{player.name[0] }</div>}
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
