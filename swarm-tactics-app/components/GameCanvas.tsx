import {FC, MutableRefObject, useEffect, useRef, useState} from 'react'
import {get_rendering_config, init_graphics, Rendering_Config, update} from "@/lib/drawing/rendering";


export interface rendered_game {
    world: any;
    bases: any;
    units: any;
    phero: any;
    winner: any;
    folder: string;
    filename: string;
    data_out: boolean;
    sensor?: any;
    vision?: any;
    smell?: any;
}




interface GameCanvasProps {
    game: rendered_game;
    step: number;
}

const GameCanvas: FC<GameCanvasProps> = ({game,step}) => {
    const canvasRef = useRef(null);

    let [rendering_config,set_rendering_config] = useState<Rendering_Config|null>(null)


    useEffect(()=> {
        const canvas = canvasRef.current
        if (canvas==null) {
            return
        }
        let config = get_rendering_config(canvas,game)
        set_rendering_config(config)
        init_graphics(config)

    },[game])

    useEffect(()=> {
        console.log(step)
        if (rendering_config == null) {
            return
        }
        console.log(step)
        update(rendering_config,step)
    },[step,rendering_config])



    return <div className="grow-0">
        <canvas ref={canvasRef} id="canvas" width="1080" height="720"/>
    </div>
}

export default GameCanvas