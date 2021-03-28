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
        t += '}\n';
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

    n_offset = new Point(Math.abs(offset.x), Math.abs(offset.y), Math.abs(offset.z));
    n_p1 = new Point(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.min(p1.z, p2.z));
    n_p2 = new Point(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y), Math.max(p1.z, p2.z));
    let points = [];
    let t_arr = [];
    let border, b_x, b_y, b_z; // border end-points
    let x_d, y_d, z_d; // distance on 1d axis
    x_d = n_p2.x-n_p1.x; y_d =n_p2.y-n_p1.y; z_d = n_p2.z-n_p1.z;

    n_offset.x == 0 ? (x_d == 0 ? (n_offset.x = 1): (n_offset.x = x_d)) : (n_offset.x = n_offset.x);
    n_offset.y == 0 ? (y_d == 0 ? (n_offset.y = 1): (n_offset.y = y_d)) : (n_offset.y = n_offset.y);
    n_offset.z == 0 ? (z_d == 0 ? (n_offset.z = 1): (n_offset.z = z_d)) : (n_offset.z = n_offset.z);

    x_d == 0 ? (n_p2.x += 1) : n_p2.x = n_p2.x;
    y_d == 0 ? (n_p2.y += 1) : n_p2.y = n_p2.y;
    z_d == 0 ? (n_p2.z += 1) : n_p2.z = n_p2.z;

    for (let i=n_p1.x; i<n_p2.x; i+=n_offset.x) {
        for (let j=n_p1.y; j<n_p2.y; j+=n_offset.y) {
            for (let k=n_p1.z; k<n_p2.z; k+=n_offset.z) {
                points.push(new Point(i,j,k));
            }
        }
    }
    
    b_x = n_p1.x + Math.floor(x_d/n_offset.x) * n_offset.x;
    b_y = n_p1.y + Math.floor(y_d/n_offset.y) * n_offset.y;
    b_z = n_p1.z + Math.floor(z_d/n_offset.z) * n_offset.z;

    border = [n_p1.x, n_p1.y, n_p1.z, b_x, b_y, b_z];

    if (hollow) {
        for (let i=0; i<points.length; i++) {
            if (points[i].x == border[0] || points[i].y == border[1] || points[i].z == border[2]
                || points[i].x == border[3] || points[i].y == border[4] || points[i].z == border[5]) {
                t_arr.push(points[i]);
            }
        }
    }
    
    // console.log(t_arr.length);
    points = t_arr;

    return points;
}

// Generates the code for the .ent file
function generate() {

    // Setup
    let e = new Entity(document.getElementById("classname_value").value.toString());
    let array = [];
    let content = '';

    let p1 = new Point(
        parseInt(document.getElementById("x1").value == "" ? 0 : document.getElementById("x1").value),
        parseInt(document.getElementById("y1").value == "" ? 0 : document.getElementById("y1").value),
        parseInt(document.getElementById("z1").value == "" ? 0 : document.getElementById("z1").value));

    let p2 = new Point(
        parseInt(document.getElementById("x2").value == "" ? 0 : document.getElementById("x2").value),
        parseInt(document.getElementById("y2").value == "" ? 0 : document.getElementById("y2").value),
        parseInt(document.getElementById("z2").value == "" ? 0 : document.getElementById("z2").value));

    let offset = new Point(
        parseInt(document.getElementById("ox").value == "" ? 0 : document.getElementById("ox").value),
        parseInt(document.getElementById("oy").value == "" ? 0 : document.getElementById("oy").value),
        parseInt(document.getElementById("oz").value == "" ? 0 : document.getElementById("oz").value));

    let hollow = document.getElementById("hollow").checked

    let d_offset = new Point(
        parseInt(document.getElementById("dox").value == "" ? 0 : document.getElementById("dox").value),
        parseInt(document.getElementById("doy").value == "" ? 0 : document.getElementById("doy").value),
        parseInt(document.getElementById("doz").value == "" ? 0 : document.getElementById("doz").value));


    
    let times = document.getElementById("times").value;

    // Set entitiy's attributes
    if (ig_list.length > 0) {
        for (let x = 0; x < ig_list.length; x++) {
            let k = document.getElementById('key' + (ig_list[x].toString().substring(2,3))).value;
            let v = document.getElementById('value' + (ig_list[x].toString().substring(2,3))).value;
            e.add([[k, v]]);
        }

        let pts = fill(p1,p2,offset,hollow);
        for (let i=0; i<pts.length; i++) {
            let t = new Entity(e.classname, e.attributes);
            t.add([["origin", `${pts[i].x.toString()} ${pts[i].y.toString()} ${pts[i].z.toString()}`]]);
            array.push(t);
        }

        // Checking if duplicate is checked, if so moves the origins, fills again and pushes into the entites array.
        if (document.getElementById("duplicate").checked == true) {
            if (document.getElementById("times").value > 0) {
                for (let t=0; t<times; t++) {
                    p1.move(d_offset.x, d_offset.y, d_offset.z);
                    p2.move(d_offset.x, d_offset.y, d_offset.z);
                    let d_pts = fill(p1, p2, offset, hollow);
                    for (let i=0; i<d_pts.length; i++) {
                        let t = new Entity(e.classname, e.attributes);
                        t.add([["origin", `${d_pts[i].x.toString()} ${d_pts[i].y.toString()} ${d_pts[i].z.toString()}`]]);
                        array.push(t);
                    }
                }
            }
        }

        // Setting array of entities to code format
        for (let j=0; j<array.length;j++) {
            content += array[j].toString();
        }
        
        // console.log(array);
        array.length > 256 ? alert("Exceeded 256 entity limit!\n" + `${array.length} entities generated.`) : 0;
        document.getElementById("textarea").value += content;

    }
}

