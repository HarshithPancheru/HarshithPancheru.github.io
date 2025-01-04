class Dice {
    //initialization
    constructor(can) {
        this.context = can.getContext("2d");
        this.size = can.width;

        //Original coordinates position of the dice 
        this.diceXYZ = [...this.DICEXYZ];
        this.pointsXYZ = [...this.POINTSXYZ]
        this.origin = [...this.ORIGIN];

        this.nearPoint = 1000;

        //x y z angles
        this.angleX = 0;
        this.angleY = 0;
        this.angleZ = 0;

        //animation speed
        this.x_speed = 0.01;
        this.y_speed = 0.01;
        this.z_speed = 0.01;

        //default colors
        this.dice_color = 'rgba(150,0,0,0.8)';
        this.points_color = 'white';

    }

    //original dice coordinates
    get DICEXYZ() {
        //Original position of the points

        // a = half length of the sides of the dice
        var a = this.size / 3;
        this.a = a;
        return [
            [-a, a, -a], [a, a, -a], [a, -a, -a], [-a, -a, -a],
            [-a, a, a], [a, a, a], [a, -a, a], [-a, -a, a]
        ];
    }

    //grouping coordinates of the dice as faces 
    get diceFace() {

        let map = [[], [], [], [], [], [], [], []];
        let points = [...this.pointsXYZ];

        //projecting 3d diagram into 2d
        for (var i = 0; i < 8; i++) {
            //Faces
            map[i][0] = this.diceXYZ[i][0] * this.nearPoint / (this.origin[2] + this.diceXYZ[i][2] + this.nearPoint); // x=x/(z*tan(a/2)
            map[i][1] = this.diceXYZ[i][1] * this.nearPoint / (this.origin[2] + this.diceXYZ[i][2] + this.nearPoint); // y=y/(z*tan(a/2)
        }
        points = points.map(function (face) {
            let dots = [];
            for (let i = 0; i < face.length; i++) {
                let points = [];
                for (let j = 0; j < face[i].length; j++) {
                    points.push([face[i][j][0] * dice.nearPoint / (dice.origin[2] + face[i][j][2] + dice.nearPoint), face[i][j][1] * dice.nearPoint / (dice.origin[2] + face[i][j][2] + dice.nearPoint)]);
                }
                dots.push(points);
            }
            return dots;
        })


        //changing the coordinate system (origin) of the dice to screen's coordinate system
        for (var i = 0; i < 8; i++)
            map[i] = [this.origin[0] + map[i][0], this.origin[1] + map[i][1]];

        points = points.map(function (face) {
            let dots = [];
            let origin = dice.ORIGIN;
            for (let i = 0; i < face.length; i++) {
                let points = [];
                for (let j = 0; j < face[i].length; j++) {
                    points.push([face[i][j][0] + origin[0], face[i][j][1] + origin[1], face[i][j][2]]);
                }
                dots.push(points);
            }
            return dots;
        })

        let face3d = [
            [this.diceXYZ[0], this.diceXYZ[1], this.diceXYZ[2], this.diceXYZ[3]],
            [this.diceXYZ[4], this.diceXYZ[5], this.diceXYZ[6], this.diceXYZ[7]],
            [this.diceXYZ[0], this.diceXYZ[1], this.diceXYZ[5], this.diceXYZ[4]],
            [this.diceXYZ[3], this.diceXYZ[2], this.diceXYZ[6], this.diceXYZ[7]],
            [this.diceXYZ[1], this.diceXYZ[2], this.diceXYZ[6], this.diceXYZ[5]],
            [this.diceXYZ[0], this.diceXYZ[3], this.diceXYZ[7], this.diceXYZ[4]]
        ]

        let max_list = [];
        //finding the face which is before the screen 
        for (let i = 0; i < 6; i++) {
            var max = face3d[i][0][2];
            for (var j = 1; j < 4; j++) {
                if (max < face3d[i][j][2])
                    max = face3d[i][j][2];
            }
            max_list.push(max);
        }

        let face = [
            [map[0], map[1], map[2], map[3]],
            [map[4], map[5], map[6], map[7]],
            [map[0], map[1], map[5], map[4]],
            [map[3], map[2], map[6], map[7]],
            [map[1], map[2], map[6], map[5]],
            [map[0], map[3], map[7], map[4]]
        ]

        //sorting faces with respect to z coordinate
        for (let i = 0; i < 6; i++) {
            let key = max_list[i];
            let keyFace = [...face[i]];
            let keyPoint = [...points[i]];
            let j = i - 1;
            while (j > -1 && key > max_list[j]) {
                max_list[j + 1] = max_list[j];
                face[j + 1] = face[j];
                points[j + 1] = points[j];
                j--;
            }
            max_list[j + 1] = key;
            face[j + 1] = [...keyFace];
            points[j + 1] = [...keyPoint];
        }
        return [face, points];
    }

    //origins of dice coordinate in terms of screen's origins
    get ORIGIN() {
        return [this.size / 2, this.size / 2, this.a];
    }

    //default Dots position in 3D
    get POINTSXYZ() {
        let a = this.size / 3;
        let points = [
            [[0, 0, -a]],
            [[0, 0, a], [-a / 2.5, -a / 2.5, a], [a / 2.5, a / 2.5, a]],
            [[-a / 2.5, a, -a / 2.5], [a / 2.5, a, a / 2.5]],
            [[-a / 2.5, -a, -a / 2.5], [a / 2.5, -a, -a / 2.5], [-a / 2.5, -a, a / 2.5], [a / 2.5, -a, a / 2.5]],
            [[a, -a / 2.5, -a / 2], [a, a / 2.5, -a / 2], [a, -a / 2.5, a / 2], [a, a / 2.5, a / 2], [a, -a / 2.5, 0], [a, a / 2.5, 0]],
            [[-a, 0, 0], [-a, -a / 2, -a / 2], [-a, a / 2, -a / 2], [-a, -a / 2, a / 2], [-a, a / 2, a / 2]]
        ];

        //bezierPoints = [[p1,p2,c1,c2,c3,c4],...]
        //p1 -> start point
        //p2 -> end point
        //c1 to c4 -> control points 1 to 4
        var bezierPoints = [[], [], [], [], [], []];
        for (let i = 0; i < points.length; i++)
            for (let j = 0; j < points[i].length; j++) {
                var cx = points[i][j][0];
                var cy = points[i][j][1];
                var cz = points[i][j][2];
                a = this.a / 5;
                if (cz == this.a || cz == -this.a)
                    bezierPoints[i][j] = [[cx - a, cy, cz], [cx + a, cy, cz], [cx - a, cy - 1.33 * a, cz], [cx + a, cy - 1.33 * a, cz], [cx - a, cy + 1.33 * a, cz], [cx + a, cy + 1.33 * a, cz]];
                else if (cy == this.a || cy == -this.a)
                    bezierPoints[i][j] = [[cx - a, cy, cz], [cx + a, cy, cz], [cx - a, cy, cz + 1.33 * a], [cx + a, cy, cz + 1.33 * a], [cx - a, cy, cz - 1.33 * a], [cx + a, cy, cz - 1.33 * a]];
                else
                    bezierPoints[i][j] = [[cx, cy - a, cz], [cx, cy + a, cz], [cx, cy - a, cz + 1.33 * a], [cx, cy + a, cz + 1.33 * a], [cx, cy - a, cz - 1.33 * a], [cx, cy + a, cz - 1.33 * a]];


            }

        return bezierPoints;
    }

    //rotating dice coordinates
    rotate(angleX = 0, angleY = 0, angleZ = 0) {
        const a = this.a;
        //angleX -> rotation along X-axis
        //angleY -> rotation along Y-axis
        //angleZ -> rotation along Z-axis
        //angles should be in radians


        this.angleX = (this.angleX + angleX) % Math.PI;
        this.angleY = (this.angleY + angleY) % Math.PI;
        this.angleZ = (this.angleZ + angleZ) % Math.PI;

        let pointsXYZ = this.pointsXYZ;
        let diceXYZ = this.diceXYZ;

        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const cosZ = Math.cos(angleZ);
        const sinZ = Math.sin(angleZ);

        //rotation matrices
        const onX = [[1, 0, 0], [0, cosX, -sinX], [0, sinX, cosX]];
        const onY = [[cosY, 0, sinY], [0, 1, 0], [-sinY, 0, cosY]];
        const onZ = [[cosZ, -sinZ, 0], [sinZ, cosZ, 0], [0, 0, 1]];


        //matrix multiplication of each rotation matrices
        var yz = [[], [], []];
        var xyz = [[], [], []];
        var new_dice = [[], [], [], [], [], [], [], []];
        let new_points = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let sum = 0;
                for (let k = 0; k < 3; k++) {
                    sum += onY[i][k] * onZ[k][j];
                }
                yz[i][j] = sum;
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let sum = 0;
                for (let k = 0; k < 3; k++) {
                    sum += onX[i][k] * yz[k][j];
                }
                xyz[i][j] = sum;
            }
        }

        //rotating dice vetices
        for (let i = 0; i < 8; i++) {
            //faces
            for (let j = 0; j < 3; j++) {
                //row
                let sum = 0;
                for (let k = 0; k < 3; k++)
                    //column
                    sum += xyz[j][k] * diceXYZ[i][k];
                new_dice[i][j] = sum;
            }
        }
        this.diceXYZ = [...new_dice];

        //rotating dots
        for (let i = 0; i < 6; i++) {
            //each faces
            let face = [];
            for (let j = 0; j < pointsXYZ[i].length; j++) {
                //each dots
                let dot = [];
                for (let k = 0; k < 6; k++) {
                    //points
                    let point = [];
                    for (let l = 0; l < 3; l++) {
                        let sum = 0;
                        for (let m = 0; m < 3; m++)
                            sum += xyz[l][m] * pointsXYZ[i][j][k][m];
                        point.push(sum);
                    }
                    dot.push(point);
                }
                face.push(dot);
            }
            new_points.push(face);
        }
        this.pointsXYZ = [...new_points];
    }

    //drawing dice and it's dots
    drawDice() {
        const ctx = this.context;
        ctx.clearRect(0, 0, this.size, this.size);
        const face = this.diceFace[0];
        let points = this.diceFace[1];
        ctx.lineWidth = 1;


        //drawing dice
        for (var i = 0; i < face.length; i++) {
            ctx.fillStyle = this.dice_color;
            ctx.strokeStyle = this.dice_color;
            ctx.beginPath();
            ctx.moveTo(face[i][3][0], face[i][3][1]);
            for (var j = 0; j < face[i].length; j++)
                ctx.lineTo(face[i][j][0], face[i][j][1]);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            //drawing dots
            ctx.fillStyle = this.points_color;
            ctx.strokeStyle = this.points_color;
            for (let j = 0; j < points[i].length; j++) {
                var a = this.a / 5;
                ctx.beginPath();
                ctx.moveTo(points[i][j][0][0], points[i][j][0][1]);
                ctx.bezierCurveTo(points[i][j][2][0], points[i][j][2][1], points[i][j][3][0], points[i][j][3][1], points[i][j][1][0], points[i][j][1][1]);
                ctx.moveTo(points[i][j][0][0], points[i][j][0][1]);
                ctx.bezierCurveTo(points[i][j][4][0], points[i][j][4][1], points[i][j][5][0], points[i][j][5][1], points[i][j][1][0], points[i][j][1][1]);
                ctx.fill();
                ctx.stroke();
            }
        }
    }

    //animating the rotation
    animate() {
        animateRotate();
        function animateRotate() {
            if (animate_bool) {
                dice.rotate(dice.x_speed, dice.y_speed, dice.z_speed);
                dice.drawDice();
                requestAnimationFrame(animateRotate);
            }
        }
    }

    //resetting all changes made by the user
    reset() {
        this.dice_color = 'rgba(150,0,0,0.8)';
        this.points_color = 'white';
        this.x_speed = 0.01;
        this.y_speed = 0.01;
        this.z_speed = 0.01;
        x_speed_range.value = '0.01';
        y_speed_range.value = '0.01';
        z_speed_range.value = '0.01';
        background_color.value = "#7070ff";
        point_color.value = "#ffffff";
        animate_bool = true;
        animate_button.click();
        dice_color.value = "#ac0000";
        transparency.value = '0.8';
        bc_color = '#7070ff';
        this.angleX = 0;
        this.angleY = 0;
        this.angleZ = 0;
        this.diceXYZ = this.DICEXYZ;
        this.pointsXYZ = this.POINTSXYZ;
        drawbc();
        this.rotate();
        this.drawDice();
    }
}

const body = document.getElementById('body'); //Body
const ctx = document.getElementById("canbck").getContext('2d'); //Background canvas context
const can = document.getElementById("can"); //Dice canvas
const animate_button = document.getElementById('animate'); //animate_button
const dice_color = document.getElementById("dice_color"); // dice color picker
const transparency = document.getElementById("transparency"); //transparency range
const x_speed_range = document.getElementById("x_speed"); //x axis speed range
const y_speed_range = document.getElementById("y_speed"); //y axis speed range
const z_speed_range = document.getElementById("z_speed"); //z axis speed range
const background_color = document.getElementById('background_color'); //background color picker
const point_color = document.getElementById('point_color'); //Dots color picker

var bc_color = '#7070ff'; //default background color
var animate_bool = false; //is animating?
var dice = new Dice(can); //Creating dice object
var x_move, y_move; //for calculating x y movement of pointer

//Adding event listners
dice_color.addEventListener('input', hexToRGB);
transparency.addEventListener('input', hexToRGB);

animate_button.addEventListener('click', function () {
    if (!animate_bool) {
        animate_bool = true;
        animate_button.style.backgroundColor = 'green';
        animate_button.style.color = 'white';
        dice.animate();
    }
    else {
        animate_bool = false;
        animate_button.style.backgroundColor = 'white';
        animate_button.style.color = 'green';
    }
});

x_speed_range.addEventListener('input', function () {
    dice.x_speed = parseFloat(x_speed_range.value);
});

y_speed_range.addEventListener('input', function () {
    dice.y_speed = parseFloat(y_speed_range.value);
});

z_speed_range.addEventListener('input', function () {
    dice.z_speed = parseFloat(z_speed_range.value);
});

background_color.addEventListener('input', function () {
    bc_color = background_color.value;
    drawbc();
})

point_color.addEventListener('input', function () {
    dice.points_color = point_color.value;
    dice.drawDice();
})

can.addEventListener('mousedown', function (event) {
    if (animate_bool)
        animate_button.click();
    dice.move_bool = true;
    x_move = event.screenX;
    y_move = event.screenY;
})

body.addEventListener('mousemove', function (event) {
    if (dice.move_bool) {
        dice.angleX = (x_move - event.screenX) / dice.a;
        dice.angleY = (event.screenY - y_move) / dice.a
        x_move = event.screenX;
        y_move = event.screenY;
        dice.rotate(dice.angleY, dice.angleX);
        dice.drawDice();
    }
})

body.addEventListener('mouseup', function () {
    dice.move_bool = false;
})

can.addEventListener('touchstart', function (event) {
    if (animate_bool)
        animate_button.click();
    dice.move_bool = true;
    x_move = event.touches[0].screenX;
    y_move = event.touches[0].screenY;
})

body.addEventListener('touchmove', function (event) {
    if (dice.move_bool) {
        dice.angleX = (x_move - event.touches[0].screenX) / dice.a;
        dice.angleY = (event.touches[0].screenY - y_move) / dice.a
        x_move = event.touches[0].screenX;
        y_move = event.touches[0].screenY;
        dice.rotate(dice.angleY, dice.angleX);
        dice.drawDice();
    }
})

body.addEventListener('touchend', function () {
    dice.move_bool = false;
})


//converts hex code to RGB color code
function hexToRGB() {
    const bigint = parseInt(dice_color.value.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    dice.dice_color = 'rgba(' + String(r) + ',' + String(g) + ',' + String(b) + ',' + String(transparency.value) + ')';
    dice.drawDice();
}

//drawing background for the dice
function drawbc() {
    let min_pad = document.getElementById("canbck").width * 3 / 40;
    let max_pad = document.getElementById("canbck").width * (1 - 3 / 40);
    let r = document.getElementById("canbck").width * 3 / 40;
    ctx.fillStyle = bc_color;

    ctx.beginPath();
    ctx.moveTo(max_pad, min_pad);
    ctx.arcTo(min_pad, min_pad, min_pad, max_pad, r);
    ctx.arcTo(min_pad, max_pad, max_pad, max_pad, r);
    ctx.arcTo(max_pad, max_pad, max_pad, min_pad, r);
    ctx.arcTo(max_pad, min_pad, min_pad, min_pad, r);
    ctx.closePath();
    ctx.fill();
}

drawbc();
dice.drawDice();










//Updating number of visitors
//I don't know what this coding is 
//CHATGPT

