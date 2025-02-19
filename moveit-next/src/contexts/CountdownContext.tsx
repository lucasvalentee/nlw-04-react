import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ChallengesContext } from './ChallengeContext';

interface CountdownContextData {
	seconds: number,
	minutes: number,
	hasFinished: boolean,
	isActive: boolean,
	startCountdown: () => void,
	resetCountdown: () => void,
}

interface CountdownProviderProps {
	children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData);

let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider({ children }: CountdownProviderProps) {
	const { startNewChallenge } = useContext(ChallengesContext);

	const [time, setTime] 				= useState(25 * 60),
		  [isActive, setIsActive] 		= useState(false),
		  [hasFinished, setHasFinished] = useState(false);

	const minutes = Math.floor(time / 60),
		  seconds = time % 60;

	function startCountdown() {
		setIsActive(true);
	}

	function resetCountdown() {
		clearTimeout(countdownTimeout);
		setIsActive(false);
		setHasFinished(false);
		setTime(0.05 * 60);
	}

	useEffect(() => {
		if (isActive && time > 0) {
			countdownTimeout = setTimeout(() => {
				setTime(time - 1);
			}, 1000)
		}
		else if (isActive && time === 0) {
			setHasFinished(true);
			setIsActive(false);
			startNewChallenge();
		}
	}, [isActive, time])

	return (
		<CountdownContext.Provider
			value={{
				seconds,
				minutes,
				hasFinished,
				isActive,
				startCountdown,
				resetCountdown,
			}}>

			{children}

		</CountdownContext.Provider>)
}
