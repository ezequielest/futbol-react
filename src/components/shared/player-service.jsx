const calcPoinsPlayer = (player) => {
    let points =
        (
            (parseInt(player.ability) * 0.5) +
            (parseInt(player.resistance) * 0.1) +
            (parseInt(player.speed) * 0.1) +
            (parseInt(player.powerShoot) * 0.2)
        );

    //1 arquero - 2 defensa - 3 mediocampista - 4 delantero TODO crear enum
    if (player.posicion === 1) {
        points = points + (parseInt(player.defense) * 0.1 )
    } else if (player.posicion === 2) {
        points = points + (parseInt(player.defense) * 0.1 )
    } else if (player.posicion === 3) {
        points = points + (parseInt(player.middle) * 0.1 )
    } else {
        points = points + (parseInt(player.offence) * 0.1 )
    }

    return Math.round(points);
}

export default calcPoinsPlayer