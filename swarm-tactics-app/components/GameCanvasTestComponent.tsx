import {FC, useEffect, useState} from 'react'
import GameCanvas, {rendered_game} from "@/component/GameCanvas";
import {tutorial_json} from "../../constants/tutorial";
import {login} from "@/lib/hooks/auth-server";

interface GameCanvasTestComponentProps {
    // Define any props you need here
}

const GameCanvasTestComponent: FC<GameCanvasTestComponentProps> = ({}) => {
    // State to manage the step value
    const [step, setStep] = useState<number>(4);

    // Function to increment the step
    const handleStepUp = () => {
        console.log("stepo up")
        setStep(prevStep => prevStep + 1);
    };

    // Function to decrement the step
    const handleStepDown = () => {
        setStep(prevStep => prevStep > 0 ? prevStep - 1 : 0);
    };

    let [game,setGame] = useState<rendered_game|null>(null)

    useEffect(() => {
        setGame(JSON.parse(tutorial_json))
    },[])

    return (
        <>
            <button onClick={handleStepUp}>Step Up</button>
            <button onClick={handleStepDown}>Step Down</button>
            {game && <GameCanvas step={step} game={game}  />}
        </>
    );
};

export default GameCanvasTestComponent;