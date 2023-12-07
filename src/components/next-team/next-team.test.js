import { assert, expect, test } from 'vitest'
import NextTeam from "./next-team";

it('next player test', () => {
    test('add points to player', () => {
        player = {
            defense: 9,
            middle: 9,
            offence: 9
        }

        const player = addPoints(player, 2);

        expect(player.defense).toBe(11);

    })
});