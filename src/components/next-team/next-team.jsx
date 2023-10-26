import React, {useState} from 'react';
import ListTeam from '../list-team/listTeam';
import {useEffect} from 'react';
import { db } from "/src/firebase/firebase.js";
import { doc, collection, getDocs } from "firebase/firestore";
import './next-team.scss'
import TeamMatch from './components/team-match';

function NextTeam() {

    const [teamOneArray, setTeamOneArray] = useState([]);
    const [teamTwoArray, setTeamTwoArray] = useState([]);

    useEffect(()=> {
      getTeamForTheNextMatch();
    } , [])

     const getTeamForTheNextMatch = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "next-match"));
            const playersArray = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const oneArray = JSON.parse(data['teamOne']);
                const twoArray = JSON.parse(data['teamTwo']);

                setTeamOneArray(oneArray);
                setTeamTwoArray(twoArray);

            });

        } catch (error) {
            console.error("Error al obtener datos de Firestore:", error);
        }
    };

    return (<>
              <div className="next-team-container">
                <p className="title">PROXIMO PARTIDO</p>

                <div className="team-match-container">
                  <TeamMatch teamName={'TEAM 1'} teamArray={teamOneArray} />
                  <TeamMatch teamName={'TEAM 2'} teamArray={teamTwoArray} />
                </div>
              </div>

            </>
    )


}

export default NextTeam
