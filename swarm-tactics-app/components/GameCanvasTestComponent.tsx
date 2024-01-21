import { FC } from 'react'
import GameCanvas from "@/component/GameCanvas";
import {tutorial_json} from "../../constants/tutorial";

interface GameCanvasTestComponentProps {

}

const GameCanvasTestComponent: FC<GameCanvasTestComponentProps> = ({}) => {
    return <> <GameCanvas step={1} game={JSON.parse(tutorial_json)} /></>
}

export default GameCanvasTestComponent