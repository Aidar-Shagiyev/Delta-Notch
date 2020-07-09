const MIN_COLOR = [80, 175, 255];  // rgb
const MAX_COLOR = [175, 80, 255];  // rgb
const a = 0.01; const b = 100; const v = 1; const k = 2; const h = 2;  // Constants from https://doi.org/10.1006/jtbi.1996.0233

class Hex {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        let path = new Path2D();
        path.moveTo(x, y - (hex_offset + hex_edge / 2));
        path.lineTo(x - hex_width / 2, y - hex_edge / 2);
        path.lineTo(x - hex_width / 2, y + hex_edge / 2);
        path.lineTo(x, y + (hex_offset + hex_edge / 2));
        path.lineTo(x + hex_width / 2, y + hex_edge / 2);
        path.lineTo(x + hex_width / 2, y - hex_edge / 2);
        path.closePath();
        this.path = path;
        
        this.delta = 0.2 * Math.random();
        this.notch = 0.2 * Math.random();
    }

    draw() {
        context.lineWidth = 1;
        context.strokeStyle = "#909090";
        context.stroke(this.path);

        let color = [0, 0, 0];  // rgb
        for (let i in color) {
            color[i] = MIN_COLOR[i] + (MAX_COLOR[i] - MIN_COLOR[i]) * this.delta
        }
        context.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        context.fill(this.path);
    }

    set delta(x) {
        this._delta = x;  // between 0 and 1.
        this.draw()
    }

    get delta() {
        return this._delta
    }
}

function setup(){
    canvas = document.querySelector("canvas");
    canvas.height = document.body.offsetHeight - controls.clientHeight - parseFloat(window.getComputedStyle(document.body).paddingTop) - parseFloat(window.getComputedStyle(document.body).paddingBottom);
    canvas.width = document.body.offsetWidth - parseFloat(window.getComputedStyle(document.body).paddingLeft) - parseFloat(window.getComputedStyle(document.body).paddingRight);
    context = canvas.getContext('2d');
    generate_grid()
    
}

function generate_grid() {
    var hex_size = document.getElementById("hex_size").value
    stopped = true;
    context.clearRect(0, 0, canvas.width, canvas.height)
    hexagons = new Array();
    hex_width = parseInt(hex_size);
    hex_offset = hex_width / 2 / Math.sqrt(3);  // height of the upper triangle.
    hex_edge = hex_offset * 2;
    var center = [canvas.width / 2, canvas.height / 2];
    var up = Math.floor((center[1] - (hex_edge / 2 + hex_offset)) / (hex_edge + hex_offset));
    var left = Math.floor(center[0] / hex_width);
    var y = center[1] - up * (hex_edge + hex_offset);
    var x = center[0] - left * hex_width;
    if (up % 2 === 1) x -= hex_width / 2;

    for (let i = 0; y < canvas.height - (hex_offset + hex_edge / 2); i++) {
        hexagons[i] = new Array();
        for (let j = 0; x < canvas.width - hex_width / 2;) {
            if (x < hex_width / 2) {
                x += hex_width;
                continue
            };
            var hex = new Hex(x, y);
            hexagons[i][j++] = hex;
            x += hex_width;
        }
        x = hexagons[i][0].x - hex_width / 2;
        y += hex_edge + hex_offset;
    }
}

function update() {
    if (stopped) {
        updating = false;
        return
    }
    updating = true;
    let dt = document.getElementById("speed").value / 200;
    for (let i = 0; i < hexagons.length; i++) {
        for (let j = 0; j < hexagons[i].length; j++) {
            let hex = hexagons[i][j]
            let repression = 0;
            for (let neigh of get_neighbours(i, j)) {
                if (neigh !== undefined) {
                    repression += neigh.delta / 6;
                }
            }

            hex.notch = runge_kuttta(get_notch_derivative(repression), hex.notch, dt);
        }
    }

    let max_change = 0;
    for (let i = 0; i < hexagons.length; i++) {
        for (let j = 0; j < hexagons[i].length; j++) {
            let hex = hexagons[i][j];
            let new_delta = runge_kuttta(get_delta_derivative(hex.notch), hex.delta, dt);
            max_change = Math.max(max_change, Math.abs(hex.delta - new_delta));
            hex.delta = new_delta;
        }
    }

    if (max_change < 0.001 * dt) {
        updating = false;
        stopped = true;
        console.log("Done!");
        return
    }
    setTimeout(update, 10)
}

function get_neighbours(i, j) {
    let other = i > 0 ? hexagons[i - 1][0] : hexagons[i + 1][0];
    let shift = hexagons[i][0].x > other.x ? 1 : -1;
    let out = [];
    // top neighbours
    if (i > 0) {
        out.push(hexagons[i - 1][j]);
        out.push(hexagons[i - 1][j + shift]);
    }
    // side neighbours
    out.push(hexagons[i][j - 1]);
    out.push(hexagons[i][j + 1]);
    // bot neighbours
    if (i + 1 < hexagons.length) {
        out.push(hexagons[i + 1][j]);
        out.push(hexagons[i + 1][j + shift]);
    }
    return out
}

function get_notch_derivative(repression) {
    return (notch) => Math.pow(repression, k) / (a + Math.pow(repression, k)) - notch
}

function get_delta_derivative(notch) {
    return (delta) => v * (1 / (1 + b * Math.pow(notch, h)) - delta)
}

function runge_kuttta(derivative, y, step) {
    let k1 = derivative(y);
    let k2 = derivative(y + 0.5 * step * k1);
    let k3 = derivative(y + 0.5 * step * k2);
    let k4 = derivative(y + step * k3);
    return y + step * (k1 + 2 * k2 + 2 * k3 + k4) / 6
}

var stopped = true;
var updating = false;
window.addEventListener('load', setup)