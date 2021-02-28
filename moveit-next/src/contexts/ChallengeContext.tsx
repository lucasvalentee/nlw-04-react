import { createContext, useState, ReactNode, useEffect } from 'react';
import challenges from '../../challenges.json';

interface Challenge {
	type: 'body' | 'eye';
	description: string;
	amount: number;
}

interface ChallengesProviderProps {
	children: ReactNode;
}

interface ChallengesContextData {
	level: number;
	currentExperience: number;
	challengesCompleted: number;
	experienceToNextLevel: number;
	activeChallenge: Challenge;
	levelUp: () => void;
	startNewChallenge: () => void;
	completeChallenge: () => void;
	resetChallenge: () => void;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps) {
	const [level, setLevel] 						    = useState(1),
		  [currentExperience, setCurrentExperience]     = useState(0),
		  [challengesCompleted, setChallengesCompleted] = useState(0),
		  [activeChallenge, setActiveChallenge] 		= useState(null);

	const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

	useEffect(() => {
		Notification.requestPermission();
	}, [])

	function levelUp() {
		setLevel(level + 1);
	}

	function startNewChallenge() {
		const challenge = challenges[Math.floor(Math.random() * challenges.length)]

		setActiveChallenge(challenge);

		new Audio('/notification.mp3').play();

		if(Notification.permission === 'granted') {
			new Notification('Novo desafio 🐱‍🏍', {
				body: `Valendo ${challenge.amount} xp!`
			});
		}
	}

	function resetChallenge() {
		setActiveChallenge(null);
	}

	function completeChallenge() {
		if (!activeChallenge) {
			return;
		}

		const { amount } = activeChallenge;

		let finalExperience = currentExperience + amount;

		if(finalExperience >= experienceToNextLevel) {
			finalExperience = finalExperience - experienceToNextLevel;
			levelUp();
		}

		setCurrentExperience(finalExperience);
		setActiveChallenge(null);
		setChallengesCompleted(challengesCompleted + 1);
	}

	return (
		<ChallengesContext.Provider 
			value={{ 
				level, 
				currentExperience, 
				challengesCompleted, 
				experienceToNextLevel,
				activeChallenge,
				levelUp,
				startNewChallenge,
				completeChallenge,
				resetChallenge
			}}>

			{children}

		</ChallengesContext.Provider>
	)
}