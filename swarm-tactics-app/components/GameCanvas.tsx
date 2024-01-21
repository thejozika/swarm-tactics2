import {FC, MutableRefObject, useEffect, useRef} from 'react'


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
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    const canvas = canvasRef.current as HTMLCanvasElement


    const ctxMain = canvas.getContext('2d') as CanvasRenderingContext2D

    const canvasWorld = document.createElement('canvas')
    canvasWorld.width = canvas.width
    canvasWorld.height = canvas.height
    const ctxWorld = canvasWorld.getContext('2d') as CanvasRenderingContext2D

    const canvasPheroRed = document.createElement('canvas')
    canvasPheroRed.width = canvas.width
    canvasPheroRed.height = canvas.height
    const ctxPheroRed = canvasPheroRed.getContext('2d') as CanvasRenderingContext2D

    const canvasPheroGreen = document.createElement('canvas')
    canvasPheroGreen.width = canvas.width
    canvasPheroGreen.height = canvas.height
    const ctxPheroGreen = canvasPheroGreen.getContext('2d') as CanvasRenderingContext2D

    const canvasPheroBlue = document.createElement('canvas')
    canvasPheroBlue.width = canvas.width
    canvasPheroBlue.height = canvas.height
    const ctxPheroBlue = canvasPheroBlue.getContext('2d') as CanvasRenderingContext2D

    const canvasPhero = document.createElement('canvas')
    canvasPhero.width = canvas.width
    canvasPhero.height = canvas.height
    const ctxPhero = canvasPhero.getContext('2d') as CanvasRenderingContext2D


    const sqrt_3 = 1.732
    const a = 2 * Math.PI / 6;
    const margin = 30

    let map = game.world
    let world_heigth = map.length
    let world_width = map[0].length
    let bases = game.bases
    let units = game.units
    let phero = game.phero
    let row = map.length
    let col = map[0].length
    let winner = game.winner
    let vision:any
    let smell:any
    let sensor:any
    let data_out = game.data_out
    if (data_out) {
        console.log("data_out activated")
        vision = game.vision
        smell = game.smell
        sensor = game.sensor
    }
    let size_w = Math.floor((canvas.width - 2*margin)/((((row-1)/2)+2*col)))
    let size_h = Math.floor((canvas.height -2*margin)/(0.5 + 1.5*row))
    let size = Math.min(size_w,size_h)
    let offset_x = (canvas.width -(sqrt_3*((row/2)+col))*size)/2 + 0.75*sqrt_3*size
    let offset_y = (canvas.height-(0.5 + 1.5*row)*size)/2 + size
    let d_horizontal = sqrt_3*size
    let d_vertical = 3/2*size

    let base_outer_radius = size * 1.2
    let base_inner_radius = size * 0.9
    let base_center_ring_radius = size * 0.7
    let base_center_radius = size * 0.5

    let unit_outer_radius = size / 1.6
    let unit_inner_radius = size / 2.1

    function init() {
        ctxMain.font = "30px Arial"
        ctxWorld.fillStyle = ("#44AAFF")
        ctxWorld.fillRect(0, 0, canvas.width, canvas.height);
        ctxWorld.fillStyle =("#FFFFFF")
        for(var i = 0; i < game.world.length; i++) {
            for(var j = 0; j < game.world[i].length; j++) {
                if (game.world[i][j] == 0) {
                    drawHexagon(ctxWorld,i,j,size,"#FFFFFF")
                } else if (game.world[i][j] == 1) {
                    drawHexagon(ctxWorld,i,j,size, "purple")
                }
            }
        }
        test()
        update()
    }

    function update() {
        ctxMain.clearRect(0,0,canvas.width,canvas.height)
        ctxMain.drawImage(canvasWorld,0,0)
        draw_pheromones()
        for (var i=0; i<units[step].length; i++) {
            drawUnit(ctxMain, units[step][i][0], units[step][i][1], units[step][i][2], units[step][i][3], units[step][i][4])
        }
        for(var i = 0; i < bases.length; i++) {
            drawBase(ctxMain, bases[i][0],bases[i][1],bases[i][2])
        }
        ctxMain.fillText(step.toString(), canvas.width-100,50)
        if (step == units.length-1){
            let text
            if (winner == "#FF0000") {
                text = "Red Won"
            } else if (winner == "#0000FF") {
                text = "Blue Won"
            } else {
                text = "Tie"
            }
            ctxMain.fillText(text,30, canvas.height-20)
        }
        if (data_out) {
            draw_data()
        }
    }

    function draw_pheromones() {
        //RED
        ctxPhero.globalCompositeOperation = "source-over"
        ctxPhero.clearRect(0,0,canvasPhero.width,canvasPhero.height)
        for (var i = 0; i < world_heigth;i++) {
            for (var j = 0; j < world_width; j++) {
                if (phero[step][0][i][j] > 0) {
                    drawHexagon(ctxPhero,i,j,size,`rgba(
                    ${255},
                    ${0},
                    ${0},
                    ${phero[step][0][i][j]/50})`,false)
                }
            }
        }
        ctxPhero.globalCompositeOperation = "source-in"
        ctxPhero.drawImage(canvasPheroRed,0,0)
        ctxMain.drawImage(canvasPhero,0,0)
        //GREEN
        ctxPhero.globalCompositeOperation = "source-over"
        ctxPhero.clearRect(0,0,canvasPhero.width,canvasPhero.height)
        for (var i = 0; i < world_heigth;i++) {
            for (var j = 0; j < world_width; j++) {
                if (phero[step][1][i][j] > 0) {
                    drawHexagon(ctxPhero,i,j,size,`rgba(
                    ${0},
                    ${255},
                    ${0},
                    ${phero[step][1][i][j]/50})`,false)
                }
            }
        }
        ctxPhero.globalCompositeOperation = "source-in"
        ctxPhero.drawImage(canvasPheroGreen,0,0)
        ctxMain.drawImage(canvasPhero,0,0)
        //BLUE
        ctxPhero.globalCompositeOperation = "source-over"
        ctxPhero.clearRect(0,0,canvasPhero.width,canvasPhero.height)
        for (var i = 0; i < world_heigth;i++) {
            for (var j = 0; j < world_width; j++) {
                if (phero[step][2][i][j] > 0) {
                    drawHexagon(ctxPhero,i,j,size,`rgba(
                    ${0},
                    ${0},
                    ${255},
                    ${phero[step][2][i][j]/50})`,false)
                }
            }
        }
        ctxPhero.globalCompositeOperation = "source-in"
        ctxPhero.drawImage(canvasPheroBlue,0,0)
        ctxMain.drawImage(canvasPhero,0,0)
    }

    function test() {
        for (var i = 0; i < canvas.width; i++) {
            for (var j = 0; j < canvas.height; j++) {
                var alpha = 0
                var val = Math.floor(Math.random()*255)
                if (val <= 70){
                    alpha = (val/70)*255
                    ctxPheroRed.fillStyle = `rgb(
                    ${255},
                    ${0},
                    ${0},
                    ${alpha})`;
                    ctxPheroRed.fillRect(i,j,1,1)
                } else if (val <=140) {
                    alpha = (val-70)/70*255
                    ctxPheroGreen.fillStyle = `rgb(
                    ${0},
                    ${255},
                    ${0},
                    ${alpha})`;
                    ctxPheroGreen.fillRect(i,j,1,1)
                } else if (val <=210) {
                    alpha = (val-140)/70*255
                    ctxPheroBlue.fillStyle = `rgb(
                    ${0},
                    ${0},
                    ${255},
                    ${alpha})`;
                    ctxPheroBlue.fillRect(i,j,1,1)
                }
            }
        }
    }

    function drawHexagon(ctx:CanvasRenderingContext2D,x:number, y:number,radius:number,color:string,stroke=true) {
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(offset_x + y*d_horizontal +x/2*d_horizontal + radius * Math.cos(a * i-a/2), offset_y + x*d_vertical + radius * Math.sin(a * i-a/2));
        }
        ctx.closePath();
        if (stroke) {
            ctx.stroke();
        }
        ctx.save()
        ctx.fillStyle = color
        ctx.fill();
        ctx.restore()
    }

    function drawCircle(ctx:CanvasRenderingContext2D,x:number, y:number,radius:number,color:string) {
        ctx.beginPath()
        ctx.arc(offset_x + y*d_horizontal +x/2*d_horizontal, offset_y + x*d_vertical , radius, 0, 2 * Math.PI, false)
        ctx.stroke()
        ctx.save()
        ctx.fillStyle = color
        ctx.fill()
        ctx.restore()
    }


    function deg_to_rad(deg:number) {
        return deg/360 * 2*Math.PI
    }
    function drawBase(ctx:CanvasRenderingContext2D,x:number, y:number,color:string) {
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(offset_x + y*d_horizontal +x/2*d_horizontal + base_outer_radius * Math.cos(a * i + deg_to_rad(5) - a/2), offset_y + x*d_vertical + base_outer_radius * Math.sin(a * i + deg_to_rad(5) - a/2));
            ctx.lineTo(offset_x + y*d_horizontal +x/2*d_horizontal + base_inner_radius * Math.cos(a * i + deg_to_rad(13) -a/2), offset_y + x*d_vertical + base_inner_radius * Math.sin(a * i + deg_to_rad(13) -a/2));
            ctx.lineTo(offset_x + y*d_horizontal +x/2*d_horizontal + base_inner_radius * Math.cos(a * i + deg_to_rad(47) -a/2), offset_y + x*d_vertical + base_inner_radius * Math.sin(a * i + deg_to_rad(47) -a/2));
            ctx.lineTo(offset_x + y*d_horizontal +x/2*d_horizontal + base_outer_radius * Math.cos(a * i + deg_to_rad(55) -a/2), offset_y + x*d_vertical + base_outer_radius * Math.sin(a * i + deg_to_rad(55) -a/2));
        }
        ctx.closePath();
        ctx.stroke();
        ctx.save()
        ctx.fillStyle = "gray"
        ctx.fill();
        ctx.restore()
        drawCircle(ctx,x,y,base_center_ring_radius,"black")
        drawCircle(ctx,x,y,base_center_radius,color)
    }

    function drawUnit(ctx:CanvasRenderingContext2D,x:number, y:number,radius:number,color:string,dir:number) {
        drawHexagon(ctx,x,y,unit_outer_radius,"gray")
        drawHexagon(ctx,x,y,unit_inner_radius, color)
        ctx.beginPath();
        ctx.lineTo(offset_x + y*d_horizontal +x/2*d_horizontal + unit_outer_radius * Math.cos(a * dir -a/2), offset_y + x*d_vertical + unit_outer_radius * Math.sin(a * dir -a/2));
        ctx.lineTo(offset_x + y*d_horizontal +x/2*d_horizontal + unit_inner_radius * Math.cos(a * dir -a/2), offset_y + x*d_vertical + unit_inner_radius * Math.sin(a * dir -a/2));
        ctx.lineTo(offset_x + y*d_horizontal +x/2*d_horizontal + unit_inner_radius * Math.cos(a * (dir+1) -a/2), offset_y + x*d_vertical + unit_inner_radius * Math.sin(a * (dir+1) -a/2));
        ctx.lineTo(offset_x + y*d_horizontal +x/2*d_horizontal + unit_outer_radius * Math.cos(a * (dir+1) -a/2), offset_y + x*d_vertical + unit_outer_radius * Math.sin(a * (dir+1) -a/2));
        ctx.stroke();
        ctx.save()
        ctx.fillStyle = "black"
        ctx.fill();
        ctx.restore()
    }

    let directions = ["BL ","FL ","F   ","FR ","BR ","B   "]
    function draw_data() {
        ctxMain.font = "20px Arial"
        ctxMain.fillText("smell:",10,30)

        for (let i= 0; i < smell[step].length;i++) {
            let smellstring = directions[i] + "["
            smellstring += " ("+ smell[step][i][0].toString() + ")"
            smellstring += " ("+ smell[step][i][1].toString() + ")"
            smellstring += "]"
            ctxMain.fillText(smellstring,10,50+i*20)
        }

        ctxMain.fillText("vision:",10,50+6*20)
        for (let i= 0; i < vision[step].length;i++) {
            let visionstring = directions[i] + "["
            visionstring +=  vision[step][i].toFixed(2)
            visionstring += "]"
            ctxMain.fillText(visionstring,10,50+(i+7)*20)
        }

        ctxMain.fillText("sense:",100,50+6*20)
        for (let i= 0; i < vision[step].length;i++) {
            let sensestring = directions[i] + "["
            sensestring +=  sensor[step][i].toString()
            sensestring += "]"
            ctxMain.fillText(sensestring,100,50+(i+7)*20)
        }




        //ctxMain.fillText(arrayToString(vision[step]),10,30)
        //ctxMain.fillText(arrayToString(sensor[step]),10,50)
        ctxMain.font = "30px Arial"
    }

    useEffect(()=> {
        map = game.world
        world_heigth = map.length
        world_width = map[0].length
        bases = game.bases
        units = game.units
        phero = game.phero
        row = map.length
        col = map[0].length
        winner = game.winner
        vision
        smell
        sensor
        data_out = game.data_out
        if (data_out) {
            console.log("data_out activated")
            vision = game.vision
            smell = game.smell
            sensor = game.sensor
        }
        size_w = Math.floor((canvas.width - 2*margin)/((((row-1)/2)+2*col)))
        size_h = Math.floor((canvas.height -2*margin)/(0.5 + 1.5*row))
        size = Math.min(size_w,size_h)
        offset_x = (canvas.width -(sqrt_3*((row/2)+col))*size)/2 + 0.75*sqrt_3*size
        offset_y = (canvas.height-(0.5 + 1.5*row)*size)/2 + size
        d_horizontal = sqrt_3*size
        d_vertical = 3/2*size

        base_outer_radius = size * 1.2
        base_inner_radius = size * 0.9
        base_center_ring_radius = size * 0.7
        base_center_radius = size * 0.5

        unit_outer_radius = size / 1.6
        unit_inner_radius = size / 2.1

        init()
    },[game])

    useEffect(()=> {
        update()
    },[step])






    return <div className="grow-0">
        <canvas ref={canvasRef} id="canvas" width="1080" height="720"/>
    </div>
}

export default GameCanvas