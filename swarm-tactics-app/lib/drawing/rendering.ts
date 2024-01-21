import {number} from "prop-types";
import {login} from "@/lib/hooks/auth-server";

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

export interface Rendering_Config {
    canvas:HTMLCanvasElement
    ctxMain: CanvasRenderingContext2D

    canvasWorld:HTMLCanvasElement
    ctxWorld:CanvasRenderingContext2D

    canvasPheroRed:HTMLCanvasElement
    ctxPheroRed:CanvasRenderingContext2D

    canvasPheroGreen:HTMLCanvasElement
    ctxPheroGreen:CanvasRenderingContext2D

    canvasPheroBlue:HTMLCanvasElement
    ctxPheroBlue:CanvasRenderingContext2D

    canvasPhero:HTMLCanvasElement
    ctxPhero:CanvasRenderingContext2D

    map:number[][]
    world_heigth:number
    world_width:number
    bases:any
    units:any
    phero:number[][][][]
    winner:any
    data_out:any
    vision?:any
    smell?:any
    sensor?:any

    size:number
    offset_x:number
    offset_y:number
    d_horizontal:number
    d_vertical:number

    base_outer_radius:number
    base_inner_radius:number
    base_center_ring_radius:number
    base_center_radius:number

    unit_outer_radius:number
    unit_inner_radius:number
}


const sqrt_3 = 1.732
const a = 2 * Math.PI / 6;
const margin = 30


export function get_rendering_config(canvas:HTMLCanvasElement,game:rendered_game):Rendering_Config {
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

    const map = game.world
    const row = map.length
    const col =  map[0].length
    const size_w= Math.floor((canvas.width - 2*margin)/((((row-1)/2)+2*col)))
    const size_h= Math.floor((canvas.height -2*margin)/(0.5 + 1.5*row))
    const size= Math.min(size_w,size_h)

    return {
        canvas:canvas,
        ctxMain:canvas.getContext('2d') as CanvasRenderingContext2D,
        canvasWorld:canvasWorld,
        ctxWorld:ctxWorld,
        canvasPheroRed:canvasPheroRed,
        ctxPheroRed:ctxPheroRed,
        canvasPheroBlue:canvasPheroBlue,
        ctxPheroBlue:ctxPheroBlue,
        canvasPheroGreen:canvasPheroGreen,
        ctxPheroGreen:ctxPheroGreen,
        canvasPhero:canvasPhero,
        ctxPhero:ctxPhero,

        map: map,
        world_heigth: map.length,
        world_width: map[0].length,
        bases: game.bases,
        units: game.units,
        phero: game.phero,

        winner: game.winner,
        vision : game.vision,
        smell : game.smell,
        sensor : game.sensor,
        data_out : game.data_out,

        size:size,
        offset_x: (canvas.width -(sqrt_3*((row/2)+col))*size)/2 + 0.75*sqrt_3*size,
        offset_y: (canvas.height-(0.5 + 1.5*row)*size)/2 + size,
        d_horizontal: sqrt_3*size,
        d_vertical: 3/2*size,

        base_outer_radius: size * 1.2,
        base_inner_radius: size * 0.9,
        base_center_ring_radius: size * 0.7,
        base_center_radius: size * 0.5,

        unit_outer_radius: size / 1.6,
        unit_inner_radius: size / 2.1,
    }
}

export function init_graphics(rendering_config:Rendering_Config) {
    rendering_config.ctxMain.font = "30px Arial"
    rendering_config.ctxWorld.fillStyle = ("#44AAFF")
    rendering_config.ctxWorld.fillRect(0, 0, rendering_config.canvas.width, rendering_config.canvas.height);
    rendering_config.ctxWorld.fillStyle =("#FFFFFF")
    for(var i = 0; i < rendering_config.map.length; i++) {
        for(var j = 0; j < rendering_config.map[i].length; j++) {
            if (rendering_config.map[i][j] == 0) {
                drawHexagon(rendering_config,rendering_config.ctxWorld,i,j,rendering_config.size,"#FFFFFF")
            } else if (rendering_config.map[i][j] == 1) {
                drawHexagon(rendering_config,rendering_config.ctxWorld,i,j,rendering_config.size, "purple")
            }
        }
    }
    test(rendering_config)
}

export function update(rendering_config:Rendering_Config,step:number) {
    console.log("updated")
    rendering_config.ctxMain.clearRect(0,0,rendering_config.canvas.width,rendering_config.canvas.height)
    rendering_config.ctxMain.drawImage(rendering_config.canvasWorld,0,0)
    draw_pheromones(rendering_config,step)
    for (var i=0; i<rendering_config.units[step].length; i++) {
        drawUnit(rendering_config,rendering_config.ctxMain, rendering_config.units[step][i][0], rendering_config.units[step][i][1], rendering_config.units[step][i][2], rendering_config.units[step][i][3],)
    }
    for(var i = 0; i < rendering_config.bases.length; i++) {
        drawBase(rendering_config,rendering_config.ctxMain, rendering_config.bases[i][0],rendering_config.bases[i][1],rendering_config.bases[i][2])
    }
    rendering_config.ctxMain.fillText(step.toString(), rendering_config.canvas.width-100,50)
    if (step == rendering_config.units.length-1){
        let text
        if (rendering_config.winner == "#FF0000") {
            text = "Red Won"
        } else if (rendering_config.winner == "#0000FF") {
            text = "Blue Won"
        } else {
            text = "Tie"
        }
        rendering_config.ctxMain.fillText(text,30, rendering_config.canvas.height-20)
    }
    if (rendering_config.data_out) {
        draw_data(rendering_config,step)
    }
}

function test({canvas ,ctxPheroRed,ctxPheroGreen,ctxPheroBlue}:Rendering_Config) {
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

function drawCircle({offset_x,offset_y,d_horizontal,d_vertical}:Rendering_Config,
                    ctx:CanvasRenderingContext2D,x:number, y:number,radius:number,color:string) {
    ctx.beginPath()
    ctx.arc(offset_x + y*d_horizontal +x/2*d_horizontal, offset_y + x*d_vertical , radius, 0, 2 * Math.PI, false)
    ctx.stroke()
    ctx.save()
    ctx.fillStyle = color
    ctx.fill()
    ctx.restore()
}

function drawHexagon({offset_x,offset_y,d_horizontal,d_vertical}:Rendering_Config,
                     ctx:CanvasRenderingContext2D,x:number, y:number,radius:number,color:string,stroke=true) {
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


function deg_to_rad(deg:number) {
    return deg/360 * 2*Math.PI
}


function drawUnit(rendering_config:Rendering_Config,
                  ctx:CanvasRenderingContext2D,x:number, y:number,color:string,dir:number) {
    drawHexagon(rendering_config,ctx,x,y,rendering_config.unit_outer_radius,"gray")
    drawHexagon(rendering_config,ctx,x,y,rendering_config.unit_inner_radius, color)
    ctx.beginPath();
    ctx.lineTo(rendering_config.offset_x + y*rendering_config.d_horizontal +x/2*rendering_config.d_horizontal + rendering_config.unit_outer_radius * Math.cos(a * dir -a/2), rendering_config.offset_y + x*rendering_config.d_vertical + rendering_config.unit_outer_radius * Math.sin(a * dir -a/2));
    ctx.lineTo(rendering_config.offset_x + y*rendering_config.d_horizontal +x/2*rendering_config.d_horizontal + rendering_config.unit_inner_radius * Math.cos(a * dir -a/2), rendering_config.offset_y + x*rendering_config.d_vertical + rendering_config.unit_inner_radius * Math.sin(a * dir -a/2));
    ctx.lineTo(rendering_config.offset_x + y*rendering_config.d_horizontal +x/2*rendering_config.d_horizontal + rendering_config.unit_inner_radius * Math.cos(a * (dir+1) -a/2), rendering_config.offset_y + x*rendering_config.d_vertical + rendering_config.unit_inner_radius * Math.sin(a * (dir+1) -a/2));
    ctx.lineTo(rendering_config.offset_x + y*rendering_config.d_horizontal +x/2*rendering_config.d_horizontal + rendering_config.unit_outer_radius * Math.cos(a * (dir+1) -a/2), rendering_config.offset_y + x*rendering_config.d_vertical + rendering_config.unit_outer_radius * Math.sin(a * (dir+1) -a/2));
    ctx.stroke();
    ctx.save()
    ctx.fillStyle = "black"
    ctx.fill();
    ctx.restore()
}

function drawBase(rendering_config:Rendering_Config,
                  ctx:CanvasRenderingContext2D,x:number, y:number,color:string) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
        ctx.lineTo(rendering_config.offset_x + y*rendering_config.d_horizontal +x/2*rendering_config.d_horizontal + rendering_config.base_outer_radius * Math.cos(a * i + deg_to_rad(5) - a/2), rendering_config.offset_y + x*rendering_config.d_vertical + rendering_config.base_outer_radius * Math.sin(a * i + deg_to_rad(5) - a/2));
        ctx.lineTo(rendering_config.offset_x + y*rendering_config.d_horizontal +x/2*rendering_config.d_horizontal + rendering_config.base_inner_radius * Math.cos(a * i + deg_to_rad(13) -a/2), rendering_config.offset_y + x*rendering_config.d_vertical + rendering_config.base_inner_radius * Math.sin(a * i + deg_to_rad(13) -a/2));
        ctx.lineTo(rendering_config.offset_x + y*rendering_config.d_horizontal +x/2*rendering_config.d_horizontal + rendering_config.base_inner_radius * Math.cos(a * i + deg_to_rad(47) -a/2), rendering_config.offset_y + x*rendering_config.d_vertical + rendering_config.base_inner_radius * Math.sin(a * i + deg_to_rad(47) -a/2));
        ctx.lineTo(rendering_config.offset_x + y*rendering_config.d_horizontal +x/2*rendering_config.d_horizontal + rendering_config.base_outer_radius * Math.cos(a * i + deg_to_rad(55) -a/2), rendering_config.offset_y + x*rendering_config.d_vertical + rendering_config.base_outer_radius * Math.sin(a * i + deg_to_rad(55) -a/2));
    }
    ctx.closePath();
    ctx.stroke();
    ctx.save()
    ctx.fillStyle = "gray"
    ctx.fill();
    ctx.restore()
    drawCircle(rendering_config,ctx,x,y,rendering_config.base_center_ring_radius,"black")
    drawCircle(rendering_config,ctx,x,y,rendering_config.base_center_radius,color)
}

function draw_pheromones(renderingConfig:Rendering_Config,step:number) {
    //RED
    renderingConfig.ctxPhero.globalCompositeOperation = "source-over"
    renderingConfig.ctxPhero.clearRect(0,0,renderingConfig.canvasPhero.width,renderingConfig.canvasPhero.height)
    for (var i = 0; i < renderingConfig.world_heigth;i++) {
        for (var j = 0; j < renderingConfig.world_width; j++) {
            if (renderingConfig.phero[step][0][i][j] > 0) {
                drawHexagon(renderingConfig,renderingConfig.ctxPhero,i,j,renderingConfig.size,`rgba(
                    ${255},
                    ${0},
                    ${0},
                    ${renderingConfig.phero[step][0][i][j]/50})`,false)
            }
        }
    }
    renderingConfig.ctxPhero.globalCompositeOperation = "source-in"
    renderingConfig. ctxPhero.drawImage(renderingConfig.canvasPheroRed,0,0)
    renderingConfig.ctxMain.drawImage(renderingConfig.canvasPhero,0,0)
    //GREEN
    renderingConfig.ctxPhero.globalCompositeOperation = "source-over"
    renderingConfig.ctxPhero.clearRect(0,0,renderingConfig.canvasPhero.width,renderingConfig.canvasPhero.height)
    for (var i = 0; i < renderingConfig.world_heigth;i++) {
        for (var j = 0; j < renderingConfig.world_width; j++) {
            if (renderingConfig.phero[step][1][i][j] > 0) {
                drawHexagon(renderingConfig,renderingConfig.ctxPhero,i,j,renderingConfig.size,`rgba(
                    ${0},
                    ${255},
                    ${0},
                    ${renderingConfig.phero[step][1][i][j]/50})`,false)
            }
        }
    }
    renderingConfig.ctxPhero.globalCompositeOperation = "source-in"
    renderingConfig.ctxPhero.drawImage(renderingConfig.canvasPheroGreen,0,0)
    renderingConfig.ctxMain.drawImage(renderingConfig.canvasPhero,0,0)
    //BLUE
    renderingConfig.ctxPhero.globalCompositeOperation = "source-over"
    renderingConfig.ctxPhero.clearRect(0,0,renderingConfig.canvasPhero.width,renderingConfig.canvasPhero.height)
    for (var i = 0; i < renderingConfig.world_heigth;i++) {
        for (var j = 0; j < renderingConfig.world_width; j++) {
            if (renderingConfig.phero[step][2][i][j] > 0) {
                drawHexagon(renderingConfig,renderingConfig.ctxPhero,i,j,renderingConfig.size,`rgba(
                    ${0},
                    ${0},
                    ${255},
                    ${renderingConfig.phero[step][2][i][j]/50})`,false)
            }
        }
    }
    renderingConfig.ctxPhero.globalCompositeOperation = "source-in"
    renderingConfig.ctxPhero.drawImage(renderingConfig.canvasPheroBlue,0,0)
    renderingConfig.ctxMain.drawImage(renderingConfig.canvasPhero,0,0)
}


const directions = ["BL ","FL ","F   ","FR ","BR ","B   "]
export function draw_data(rendering_config:Rendering_Config, step:number) {
    rendering_config.ctxMain.font = "20px Arial"
    rendering_config.ctxMain.fillText("smell:",10,30)

    for (let i= 0; i < rendering_config.smell[step].length;i++) {
        let smellstring = directions[i] + "["
        smellstring += " ("+ rendering_config.smell[step][i][0].toString() + ")"
        smellstring += " ("+ rendering_config.smell[step][i][1].toString() + ")"
        smellstring += "]"
        rendering_config.ctxMain.fillText(smellstring,10,50+i*20)
    }

    rendering_config.ctxMain.fillText("vision:",10,50+6*20)
    for (let i= 0; i < rendering_config.vision[step].length;i++) {
        let visionstring = directions[i] + "["
        visionstring +=  rendering_config.vision[step][i].toFixed(2)
        visionstring += "]"
        rendering_config.ctxMain.fillText(visionstring,10,50+(i+7)*20)
    }

    rendering_config.ctxMain.fillText("sense:",100,50+6*20)
    for (let i= 0; i < rendering_config.vision[step].length;i++) {
        let sensestring = directions[i] + "["
        sensestring +=  rendering_config.sensor[step][i].toString()
        sensestring += "]"
        rendering_config.ctxMain.fillText(sensestring,100,50+(i+7)*20)
    }




    //ctxMain.fillText(arrayToString(vision[step]),10,30)
    //ctxMain.fillText(arrayToString(sensor[step]),10,50)
    rendering_config.ctxMain.font = "30px Arial"
}