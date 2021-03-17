// Classes

class Point {
    // Constructs a Point object on 3 dimensions
    constructor(x=0, y=0, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Sets the string output to "x y z"
    toString() {
        return `${this.x} ${this.y} ${this.z}`;
    }

    // Moves a point by delta on each axis
    move(dx=0, dy=0, dz=0) {
        this.x += dx;
        this.y += dy;
        this.z += dz;
    }

    // Calculates the distance between two points
    distance(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2) + Math.pow(this.z - other.z, 2));
    }
}


class Entity {
    // Constructs an Entity object with classname and attributes.
    constructor(classname='temp', attributes=[]) {
        this.classname = classname;
        this.attributes = attributes;
    }

    // Set string output to comply with the .ent file format.
    toString() {
        let t = `{\n"classname" "${this.classname}"\n`;
        for (let i = 0; i < this.attributes.length; i++) {
            t += `"${this.attributes[i][0]}" "${this.attributes[i][1]}"\n`;
        }
        t += '}';
        return t;
    }

    // Moves an entity by delta on each axis, only if the entity contains the "origin" attribute.
    move(dx=0, dy=0, dz=0) {
        for (let i=0; i < this.attributes.length; i++){
            if (this.attributes[i][0] == 'origin') {
                let a = this.attributes[i][1].split(' ');
                let p = new Point(parseInt(a[0]), parseInt(a[1]), parseInt(a[2]));
                p.move(parseInt(dx), parseInt(dy), parseInt(dz));
                this.attributes[i][1] = p.toString()
                break
            }
        }
    }

    // Rotates an entity by delta on each axis, only if it contains the "angles" attribute.
    rotate(dx=0, dy=0, dz=0) {
        for (let i=0; i < this.attributes.length; i++){
            if (this.attributes[i][0] == 'angles') {
                let a = this.attributes[i][1].split(' ');
                let p = new Point(parseInt(a[0]), parseInt(a[1]), parseInt(a[2]));
                p.move(parseInt(dx), parseInt(dy), parseInt(dz));
                this.attributes[i][1] = p.toString()
                break
            }
        }
    }

    // Adds attributes to an entity, ex: [['key', 'value'], ['key2', 'value2']]
    add(arr) {
        this.attributes = this.attributes.concat(arr)
    }

    // Modify an existing attribute's value
    mod(k, v) {
        if (k == 'classname') {
            this.classname = v;
        }
        else {
            for (let i=0; i < this.attributes.length; i++) {
                if (k == this.attributes[i][0]) {
                    this.attributes[i][1] = v
                    break
                }
            }
        }
    }
}



// Utilities

// Fills a 3-dimesional rectangular box with Point objects using two points as corners. 
function fill(p1, p2, offset, hollow=false) {
    let points = [];
    offset = new Point(Math.abs(offset.x), Math.abs(offset.y), Math.abs(offset.z));
    p1 = new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.min(p1.z, p2.z));
    p2 = new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y), Math.max(p1.z, p2.z));

    // If offset is 0, sets to distance + 1 to run atleast once in the loops.
    offset.x == 0 ? offset.x = p2.x-p1.x+1: offset.x;
    offset.y == 0 ? offset.y = p2.y-p1.y+1: offset.y;
    offset.z == 0 ? offset.z = p2.z-p1.z+1: offset.z;

    let border = [p1.x, p1.y, p1.z, p2.x, p2.y, p2.z];

    for (let i = p1.z; i < p2.z; i += offset.z) {
        for (let j = p1.j; j < p2.y; j += offset.y) {
            for (let k = p1.k; k < p2.x; k += offset.x) {
                points.push(k, j, i);
            }
        }
    }

        return points;
}








// Testers

let box = new Entity('small_box', [
    ['key','value'],
    ['target','t01'],
    ['angles', '0 0 0'],
    ['origin','100 -82 433'],
    ['health','-1']
]);

box.move(100,100,100)
box.rotate(0, 90, 180)
box.add([['test', 'add']])
box.mod('classname', 'big_box')
// console.log(box.toString())


let p1 = new Point()
let p2 = new Point(10,10,10)
let offset = new Point(5,5,5)
// console.log(p1.toString())


var pts = fill(p1,p2,offset)
console.log(pts.length)

