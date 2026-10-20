let screenshot;



class System {
    constructor(coordinate,color) {
        this.coord = coordinate;
        this.color=color;
        this.screenshots = [];
        this.connected_coords=[];
        this.name="";
    }

    add_screenshot(screenshot) {
        this.screenshots.push(screenshot);
    }
    add_connected(coord) {
        this.connected_coords.push(coord);
    }

    draw_system() {

        fill(this.color);
        noStroke();
        push();
        translate(this.coord[0], this.coord[1], this.coord[2]);
        box(2);
        pop();
        strokeWeight(1);
        for (let i=0;i<this.connected_coords.length;i++) {
            const prev_coord = this.connected_coords[i];
            const distance=dist(this.coord[0], this.coord[1], this.coord[2], prev_coord[0], prev_coord[1], prev_coord[2])/20;
            let dist_val=((-1)/(distance+1))+1
            stroke(128*dist_val, 255, 255);
            line(this.coord[0], this.coord[1], this.coord[2], prev_coord[0], prev_coord[1], prev_coord[2]);
        }

        if (this.screenshots.length > 0) {
            strokeWeight(6);
            stroke(25, 98, 85);
            let timeVal = seconds / 2;
            let index = floor(timeVal) % this.screenshots.length;
            let screenshot = this.screenshots[index];
            texture(screenshot);
            push();
            translate(this.coord[0], this.coord[1], this.coord[2]);
            rotateY(30);
            rotateX(45);
            rect(0, 0, screenshot.width / 20, screenshot.height / 20);
            resetShader();
            fill(25, 98, 85);
            stroke(200,98,85);
            textSize(10);
            text(this.name,0,-5);
            pop();
        }

    }
}


class Screenshot{
    constructor(coordinate,rotationX,rotateY) {
    }
}
const arraysEqual = (a, b) =>
    a.length === b.length && a.every((val, index) => val === b[index]);


systems=[]
async function setup() {
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);



    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100);

    strokeWeight(1);
    noFill();


    for (let i = 0; i < star_systems.length; i++) {
        const coord = star_systems[i];
        let is_new=true;

        for (let j = 0; j < systems.length; j++) {
            if(arraysEqual(coord,systems[j].coord)){
                is_new=false;
                let current_system=systems[j];
                if (i > 0) {
                    const prevCoord = star_systems[i - 1];
                    // Only add if it's not already connected to this point
                    if (!current_system.connected_coords.some(c => arraysEqual(c, prevCoord))) {
                        current_system.add_connected(prevCoord);
                    }
                }
            }
        }
        if(is_new) {
            const col = color(lerp(startingHue, endingHue,i / star_systems.length), 28, 98);
            let new_system = new System(coord, col);
            if(i>0){
                new_system.add_connected(star_systems[i-1]);
            }
            systems.push(new_system);
        }
    }


    for(let i=0;i<screenshots.length;i++){
        const screenshot_data=screenshots[i];
        const screenshot_image = await loadImage(screenshot_data[1]);
        const screenshot_coord=screenshot_data[0];
        for (let j = 0; j < systems.length; j++) {
            if(arraysEqual(screenshot_coord,systems[j].coord)) {
                systems[j].add_screenshot(screenshot_image);
                systems[j].name=screenshot_data[2];
            }
        }
    }

    font = await loadFont('/web/font/ShareTech-Regular.ttf');
    textFont(font);

}

startingHue=0;
endingHue=360;

var seconds = new Date().getTime() / 1000;

function draw() {
    if (frameCount % 60 == 0) {
        console.log("Framerate:", frameRate())
    }


    seconds = new Date().getTime() / 1000;


    background(240, 80, 20);

    orbitControl();

    push();
    scale(4);
    // texture(screenshot);
    // push();
    // rotateX(40);
    // rect(40,70,screenshot.width/20,screenshot.height/20);
    // pop();
    for (let i = 0; i < systems.length; i++) {
        systems[i].draw_system();
    }


    pop();
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}