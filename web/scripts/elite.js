let screenshot;



class System {
    constructor(coordinate,star_color,name,startype,allegiance,population) {
        this.coord = coordinate;
        this.color=star_color;
        this.name=name;
        this.startype=startype;
        this.allegiance=allegiance;
        this.allegiance_color=null;
        // if (this.allegiance==="Empire"){
        //     this.allegiance_color=color(189, 81, 95);
        // }else if (this.allegiance==="Federation"){
        //     this.allegiance_color=color(0, 72, 81);
        // }else if (this.allegiance==="Alliance"){
        //     this.allegiance_color=color(119, 84, 41);
        // }
        this.population=population;
        this.box_size= ((-1) / ((this.population + 50000000) * 0.00000001)) + 3;
    }

    draw_system() {

        fill(this.color);
        //if(this.allegiance_color==null){
            noStroke();
        // } else {
        //     strokeWeight(0.5);
        //     stroke(this.allegiance_color);
        // }
        push();
        translate(this.coord[0], this.coord[1], this.coord[2]);
        box(this.box_size);
        pop();
        // strokeWeight(1);
        // for (let i=0;i<this.connected_coords.length;i++) {
        //     const prev_coord = this.connected_coords[i];
        //     const distance=dist(this.coord[0], this.coord[1], this.coord[2], prev_coord[0], prev_coord[1], prev_coord[2])/20;
        //     let dist_val=((-1)/(distance+1))+1
        //     stroke(128*dist_val, 255, 255);
        //     line(this.coord[0], this.coord[1], this.coord[2], prev_coord[0], prev_coord[1], prev_coord[2]);
        // }

    }
}


class Screenshot{
    constructor(coordinate,image,system_name) {
        this.coord=coordinate;
        this.rotationX=0;
        this.rotationY=0;
        this.screenshot=image;
        this.system_name=system_name;
    }

    draw_screenshot(){
        let cam = p5.instance._renderer.mainCamera

        let pos = cam.eyeX;
        let posY = cam.eyeY;
        let posZ = cam.eyeZ;

        let dist_to_cam=dist(this.coord[0]*4, this.coord[1]*4, this.coord[2]*4,cam.eyeX,cam.eyeY,cam.eyeZ);
        dist_to_cam=dist_to_cam/12;
        strokeWeight(6);
        stroke(25, 98, 85);
        texture(this.screenshot);
        push();
        translate(this.coord[0], this.coord[1], this.coord[2]);
        rotateY(this.rotationY);
        rotateX(this.rotationX);
        rect(0, 0, this.screenshot.width / dist_to_cam, this.screenshot.height / dist_to_cam);
        resetShader();
        fill(25, 98, 85);
        stroke(200,98,85);
        textSize(7);
        text(this.system_name,0,-5);
        pop();

    }
    randomize(){
        this.rotationX=random(0,45);
        this.rotationY=random(-30,30);
        for(let i=0;i<this.coord.length;i++){
            this.coord[i]=this.coord[i]+random(-80,80);
        }
    }
}
const arraysEqual = (a, b) =>
    a.length === b.length && a.every((val, index) => val === b[index]);


var systems=[];
var loaded_screenshots=[];

var startype_to_color={
};

function applyProjection() {
    let cam = p5.instance._renderer.mainCamera;
    let fov = 60;                      // degrees (you use angleMode(DEGREES))
    let aspect = width / height;
    let near = 0.1;
    let far = 1000000;                 // pick whatever you need
    cam.perspective(fov, aspect, near, far);
}

async function setup() {
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);


    startype_to_color={
        "O":color(160, 168, 219),
        "B":color(205, 248, 244),
        "A":color(217, 234, 248),
        "F":color(252, 248, 229),
        "G":color(251, 242, 211),
        "K":color(253, 203, 114),
        "M":color(236, 151, 84),
        "L":color(228, 4, 25),
        "T":color(140, 2, 92),
        "Y":color(85, 1, 59),
        "TTS":color(216, 0, 2),
        "AeBe":color(219, 52, 235),
        "W":color(219, 52, 235),
        "WN":color(219, 52, 235),
        "WNC":color(219, 52, 235),
        "WC":color(219, 52, 235),
        "WO":color(219, 52, 235),
        "CS":color(219, 52, 235),
        "C":color(219, 52, 235),
        "CN":color(219, 52, 235),
        "CJ":color(219, 52, 235),
        "CH":color(219, 52, 235),
        "CHd":color(219, 52, 235),
        "MS":color(219, 52, 235),
        "S":color(219, 52, 235),
        "D":color(219, 52, 235),
        "DA":color(219, 52, 235),
        "DAB":color(219, 52, 235),
        "DAO":color(219, 52, 235),
        "DAZ":color(219, 52, 235),
        "DAV":color(219, 52, 235),
        "DB":color(219, 52, 235),
        "DBZ":color(219, 52, 235),
        "DBV":color(219, 52, 235),
        "DO":color(219, 52, 235),
        "DOV":color(219, 52, 235),
        "DQ":color(219, 52, 235),
        "DC":color(219, 52, 235),
        "DCV":color(219, 52, 235),
        "DX":color(219, 52, 235),
        "N":color(219, 52, 235),
        "H":color(219, 52, 235),
        "X":color(219, 52, 235),
        "SupermassiveBlackHole":color(219, 52, 235),
        "A_BlueWhiteSuperGiant":color(206, 242, 249),
        "B_BlueWhiteSuperGiant":color(217, 231, 234),
        "F_WhiteSuperGiant":color(219, 52, 235),
        "M_RedGiant":color(219, 52, 235),
        "K_OrangeGiant":color(219, 52, 235),
        "RoguePlanet":color(219, 52, 235),
        "Nebula":color(219, 52, 235),
        "StellarRemnantNebula":color(219, 52, 235)
    };

    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100);

    strokeWeight(1);
    noFill();


    for (let i = 0; i < star_systems.length; i++) {
        const star_system_data=star_systems[i];
        let star_system_coords=star_system_data[0];
        star_system_coords[0]*=-1;
        star_system_coords[1]*=-1;
        const star_system_name=star_system_data[1];
        const star_system_type=star_system_data[2];
        const star_system_allegiance=star_system_data[3];
        const star_system_population=star_system_data[4];
        let star_system=new System(star_system_coords,startype_to_color[star_system_type],star_system_name,star_system_type,star_system_allegiance,star_system_population);
        systems.push(star_system);
    }


    for(let i=0;i<screenshots.length;i++){
        const screenshot_data=screenshots[i];
        const screenshot_image = await loadImage(screenshot_data[2]);
        let screenshot_coord=screenshot_data[0];
        screenshot_coord[0]*=-1;
        screenshot_coord[1]*=-1;
        const screenshot_system_name=screenshot_data[1];
        for (let j = 0; j < systems.length; j++) {
            if(arraysEqual(screenshot_coord,systems[j].coord)) {
                let loaded_screenshot=new Screenshot(screenshot_coord,screenshot_image,screenshot_system_name);
                loaded_screenshot.randomize();
                loaded_screenshots.push(loaded_screenshot);
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
    applyProjection();
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
    for (let i = 0; i < loaded_screenshots.length; i++) {
        loaded_screenshots[i].draw_screenshot();
    }







    pop();

    let cam = p5.instance._renderer.mainCamera
    strokeWeight(7);
    stroke(0, 75, 72);
    line(cam.centerX,cam.centerY,cam.centerZ,cam.centerX+40,cam.centerY,cam.centerZ);
    stroke(119, 75, 72);
    line(cam.centerX,cam.centerY,cam.centerZ,cam.centerX,cam.centerY-40,cam.centerZ);
    stroke(246, 75, 72);
    line(cam.centerX,cam.centerY,cam.centerZ,cam.centerX,cam.centerY,cam.centerZ+40);


    stroke(195, 78, 92);
    strokeWeight(3);

    let grid_count=20;
    let grid_line_length=8000;
    for (let i=-grid_count;i<grid_count;i++){
        line(-grid_line_length+(floor(cam.centerX/800)*800),0,400*i+(floor(cam.centerZ/800)*800),grid_line_length+(floor(cam.centerX/800)*800),0,400*i+(floor(cam.centerZ/800)*800));
        line(400*i+(floor(cam.centerX/800)*800),0,-grid_line_length+(floor(cam.centerZ/800)*800),400*i+(floor(cam.centerX/800)*800),0,grid_line_length+(floor(cam.centerZ/800)*800));
        if (i%2==0){
            stroke(195, 78, 92);
        } else{
            stroke(215, 77, 50);
        }
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}