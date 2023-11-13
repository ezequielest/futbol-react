export const calcPoinsPlayer = (player) => {
    let points =
    (
        (parseInt(player.ability) * 0.1) +
        (parseInt(player.resistance) * 0.1) +
        (parseInt(player.speed) * 0.1) +
        (parseInt(player.powerShoot) * 0.1)
    );

    //1 arquero - 2 defensa - 3 mediocampista - 4 delantero TODO crear enum
    if (player.mainPosition === "1") {
        points = points + (parseInt(player.defense) * 0.4 )
    } else if (player.mainPosition === "2") {
        points = points + (parseInt(player.defense) * 0.4 )
    } else if (player.mainPosition === "3") {
        points = points + (parseInt(player.middle) * 0.4 )
    } else {
        points = points + (parseInt(player.offence) * 0.4 )
    }

    if (player.secondaryPosition === "1") {
    points = points + (parseInt(player.defense) * 0.2 )
    } else if (player.secondaryPosition === "2") {
    points = points + (parseInt(player.defense) * 0.2 )
    } else if (player.secondaryPosition === "3") {
    points = points + (parseInt(player.middle) * 0.2 )
    } else {
    points = points + (parseInt(player.offence) * 0.2 )
    }

    return Math.round(points);
}