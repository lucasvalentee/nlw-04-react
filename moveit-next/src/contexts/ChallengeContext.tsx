import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
	type: 'body' | 'eye';
	description: string;
	amount: number;
}

interface ChallengesProviderProps {
	children: ReactNode;
	level: number;
	currentExperience: number;
	challengesCompleted: number;
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
	closeLevelUpModal: () => void;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {
	const [level, setLevel] 						    = useState(rest.level ?? 1),
		  [currentExperience, setCurrentExperience]     = useState(rest.currentExperience ?? 0),
		  [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);

	const [activeChallenge, setActiveChallenge] = useState(null);

	const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

	const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

	useEffect(() => {
		Notification.requestPermission();
	}, [])

	useEffect(() => {
		Cookies.set('level', String(level));
		Cookies.set('currentExperience', String(currentExperience));
		Cookies.set('challengesCompleted', String(challengesCompleted));
	}, [ level, currentExperience, challengesCompleted ])

	function levelUp() {
		setLevel(level + 1);
		setIsLevelUpModalOpen(true);
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
	
	function closeLevelUpModal() {
		setIsLevelUpModalOpen(false);
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
				resetChallenge,
				closeLevelUpModal
			}}>

			{children}

			{ isLevelUpModalOpen && <LevelUpModal /> }

		</ChallengesContext.Provider>
	)
}