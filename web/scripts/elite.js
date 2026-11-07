/*
HEYYY
WHAT ARE YOU DOING HERE
THIS IS THE CODE DRAWING STUFF TO THE SCREEN
please don't look, it's so bad lmao. This is my first real time working in javascript so I dunno much about proper syntax/formatting/stuff
 */



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
        this.system_coord=coordinate.slice();
    }

    draw_screenshot(index){
        if((focusMode&&index===prev_closest_index)||focusMode==false) {
            let cam = p5.instance._renderer.mainCamera

            let pos = cam.eyeX;
            let posY = cam.eyeY;
            let posZ = cam.eyeZ;

            let dist_to_cam = dist(this.coord[0], this.coord[1], this.coord[2], cam.eyeX, cam.eyeY, cam.eyeZ);

            if (dist_to_cam < 1250) {
                if (focusMode === false) {
                    let dist_to_center = dist(this.coord[0], this.coord[1], this.coord[2], (cam.eyeX + cam.centerX) / 2, (cam.eyeY + cam.centerY) / 2, (cam.eyeZ + cam.centerZ) / 2);
                    if (dist_to_center < curr_closest_dist) {
                        curr_closest_dist = dist_to_center;
                        curr_closest_index = index;

                    }
                }
                dist_to_cam = dist_to_cam / 3;
                strokeWeight(1.5);
                if (prev_closest_index === index) {
                    stroke(40, 100, 100);
                } else {
                    stroke(25, 98, 85);
                }
                if (dist_to_cam < 200) {
                    texture(this.screenshot);
                } else {
                    fill(25, 98, 85);
                }
                push();
                translate(this.coord[0], this.coord[1], this.coord[2]);
                rotateY(this.rotationY);
                rotateX(this.rotationX);
                rect(0, 0, this.screenshot.width / dist_to_cam, this.screenshot.height / dist_to_cam);
                resetShader();
                if (dist_to_cam < 50) {
                    fill(25, 98, 85);
                    stroke(200, 98, 85);
                    textSize(130 / dist_to_cam);
                    text(this.system_name, 0, -5);
                    if (focusMode && index === prev_closest_index) {
                        text("Image:", -20, +20);
                        text(index + 1, -20, +30);
                    }
                }
                pop();
            }
        }
    }
    randomize(){
        let at_nice_spot=false;
        let random_distance=20;
        const old_coord=this.coord.slice();
        while (at_nice_spot===false) {
            at_nice_spot=true;
            // this.rotationX = random(0, 45);
            // this.rotationY = random(-30, 30);
            for (let i = 0; i < old_coord.length; i++) {
                this.coord[i] = old_coord[i] + random(-random_distance,random_distance);
            }
            for (let i = 0; i < loaded_screenshots.length; i++) {
                const coordcheck=loaded_screenshots[i].coord;
                if (60>dist(this.coord[0], this.coord[1], this.coord[2],coordcheck[0],coordcheck[1],coordcheck[2])){
                    at_nice_spot=false;
                }
            }
            for (let i = 0; i < systems.length; i++) {
                const coordcheck=systems[i].coord;
                if (30>dist(this.coord[0], this.coord[1], this.coord[2],coordcheck[0],coordcheck[1],coordcheck[2])){
                    at_nice_spot=false;
                }
            }
            random_distance+=5;
        }
    }
}

function focusScreenshot(screenshot) {

    let cam = p5.instance._renderer.mainCamera;

    let target = createVector(screenshot.coord[0],screenshot.coord[1],screenshot.coord[2]);

    // Set the orbit target to the screenshot's position.
    cam.setPosition(target.x+31,target.y+15,target.z+50);
    cam.lookAt(
        target.x+31,target.y+15,target.z-15
    );
    focusMode=true;
}


class jump_route{
    constructor(coord1,coord2,amount) {
        this.coord1=coord1;
        this.coord2=coord2;
        this.amount=sqrt(amount)/4;
        this.length=dist(this.coord1[0],this.coord1[1],this.coord1[2],this.coord2[0],this.coord2[1],this.coord2[2]);
        this.col=color(((3000 / (dist(this.coord1[0],this.coord1[1],this.coord1[2],this.coord2[0],this.coord2[1],this.coord2[2]) + 33)) + 100), 28, (80 + (1 / (-(amount + 1) / 100))));
    }

    draw_jump() {
        let cam = p5.instance._renderer.mainCamera

        let pos = cam.eyeX;
        let posY = cam.eyeY;
        let posZ = cam.eyeZ;

        let dist_to_cam=dist(this.coord1[0], this.coord1[1], this.coord1[2],cam.eyeX,cam.eyeY,cam.eyeZ);
        if(dist_to_cam<this.length*8) {
            strokeWeight(this.amount);
            stroke(this.col);
            line(this.coord1[0], this.coord1[1], this.coord1[2], this.coord2[0], this.coord2[1], this.coord2[2]);
        }

    }
}

const arraysEqual = (a, b) =>
    a.length === b.length && a.every((val, index) => val === b[index]);

var jumps=[];
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
    setTimeout(() => {
        window.scrollTo({
            top: document.body.scrollHeight-20,
            behavior: 'smooth'
        });

    }, 3000);


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
        "AeBe":color(0,0,0),
        "W":color(0,0,0),
        "WN":color(0,0,0),
        "WNC":color(0,0,0),
        "WC":color(0,0,0),
        "WO":color(0,0,0),
        "CS":color(0,0,0),
        "C":color(0,0,0),
        "CN":color(0,0,0),
        "CJ":color(0,0,0),
        "CH":color(0,0,0),
        "CHd":color(0,0,0),
        "MS":color(0,0,0),
        "S":color(0,0,0),
        "D":color(0,0,0),
        "DA":color(0,0,0),
        "DAB":color(0,0,0),
        "DAO":color(0,0,0),
        "DAZ":color(0,0,0),
        "DAV":color(0,0,0),
        "DB":color(0,0,0),
        "DBZ":color(0,0,0),
        "DBV":color(0,0,0),
        "DO":color(0,0,0),
        "DOV":color(0,0,0),
        "DQ":color(225, 250, 252),
        "DC":color(0,0,0),
        "DCV":color(0,0,0),
        "DX":color(0,0,0),
        "N":color(0,0,0),
        "H":color(0,0,0),
        "X":color(0,0,0),
        "SupermassiveBlackHole":color(0,0,0),
        "A_BlueWhiteSuperGiant":color(206, 242, 249),
        "B_BlueWhiteSuperGiant":color(217, 231, 234),
        "F_WhiteSuperGiant":color(0,0,0),
        "M_RedGiant":color(0,0,0),
        "K_OrangeGiant":color(0,0,0),
        "RoguePlanet":color(0,0,0),
        "Nebula":color(0,0,0),
        "StellarRemnantNebula":color(0,0,0)
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

    for(let i=0;i<jump_routes.length;i++){
        const jump_data=jump_routes[i];
        let  pos1=jump_data[0];
        let pos2=jump_data[1];
        pos1[0]*=-1;
        pos1[1]*=-1;
        pos2[0]*=-1;
        pos2[1]*=-1;
        const amount=jump_data[2];
        let jump=new jump_route(pos1,pos2,amount);
        jumps.push(jump);
    }

    font = await loadFont('/web/font/ShareTech-Regular.ttf');
    textFont(font);

}

startingHue=0;
endingHue=360;

var seconds = new Date().getTime() / 1000;


var prev_closest_index=0;
var curr_closest_index=0;
var curr_closest_dist=99999999;

function draw() {
    let cam = p5.instance._renderer.mainCamera
    applyProjection();
    if (frameCount % 60 == 0) {
        console.log("Framerate:", frameRate())
        //cam.lookAt(100,50,50);
    }



    seconds = new Date().getTime() / 1000;


    background(240, 80, 20);

    orbitControl();

    push();
    // texture(screenshot);
    // push();
    // rotateX(40);
    // rect(40,70,screenshot.width/20,screenshot.height/20);
    // pop();

    //let a=millis();
    if(focusMode===false) {
        for (let i = 0; i < systems.length; i++) {
            systems[i].draw_system();
        }
    }
    // print("Systems",millis()-a);
    // a=millis();
    if(focusMode===false){
    prev_closest_index=curr_closest_index;
    curr_closest_index=0;
    curr_closest_dist=99999999;
    }
    for (let i = 0; i < loaded_screenshots.length; i++) {
        loaded_screenshots[i].draw_screenshot(i);
    }
    // print("Screenshots",millis()-a);
    // a=millis();
    if(focusMode===false) {
        for (let i = 0; i < jumps.length; i++) {
            jumps[i].draw_jump();
        }
    }
    // print("Jumps",millis()-a);
    // a=millis();
    pop();


    strokeWeight(1);
    stroke(0, 75, 72);
    line(cam.centerX,cam.centerY,cam.centerZ,cam.centerX+5,cam.centerY,cam.centerZ);
    stroke(119, 75, 72);
    line(cam.centerX,cam.centerY,cam.centerZ,cam.centerX,cam.centerY-5,cam.centerZ);
    stroke(246, 75, 72);
    line(cam.centerX,cam.centerY,cam.centerZ,cam.centerX,cam.centerY,cam.centerZ+5);


    stroke(195, 78, 92);
    strokeWeight(0.7);

    let grid_count=20;
    let grid_line_length=2000;
    for (let i=-grid_count;i<grid_count;i++){
        line(-grid_line_length+(floor(cam.centerX/200)*200),0,100*i+(floor(cam.centerZ/200)*200),grid_line_length+(floor(cam.centerX/200)*200),0,100*i+(floor(cam.centerZ/200)*200));
        line(100*i+(floor(cam.centerX/200)*200),0,-grid_line_length+(floor(cam.centerZ/200)*200),100*i+(floor(cam.centerX/200)*200),0,grid_line_length+(floor(cam.centerZ/200)*200));
        if (i%2==0){
            stroke(195, 78, 92);
        } else{
            stroke(215, 77, 50);
        }
    }
    //print("Grid",millis()-a);
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}


var focusMode=false;

function mousePressed(){
    focusMode = false;
}

function mouseWheel(){
    focusMode = false;
}

function keyPressed(){
    if(key==='f'){
        focusScreenshot(loaded_screenshots[prev_closest_index]);
    }
    if(key==='a'){
        prev_closest_index-=1;
        focusScreenshot(loaded_screenshots[prev_closest_index]);
    }
    if(key==='d'){
        prev_closest_index+=1;
        focusScreenshot(loaded_screenshots[prev_closest_index]);
    }

}