var count = 0;
var ig_list = [];



// Adding the inputs upon click
function add_attribute_form() {

    // input form setup

    var input_group = document.createElement("div");
    var key = document.createElement("input");
    var span = document.createElement("span");
    var value = document.createElement("input");
    var remove_inputs = document.createElement("button");
    var nl = document.createElement("br");


    // appending elements into the input group format div
    input_group.appendChild(key);
    // input_group.appendChild(span);
    input_group.appendChild(value);
    input_group.appendChild(remove_inputs);
    // input_group.appendChild(nl);


    // div setup
    input_group.setAttribute("id", "ig" + count.toString());
    input_group.setAttribute("class", "input-group mb-3")

    // first input setup
    key.setAttribute("id", "key" + count.toString());
    key.setAttribute("type", "text"); 
    key.setAttribute("spellcheck", "false");
    key.setAttribute("class", "form-control");
    key.setAttribute("placeholder", "key");
    key.setAttribute("aria-label", "key");

    // span setup
    span.setAttribute("class", "input-group-text");

    // second input setup
    value.setAttribute("id", "value" + count.toString()); 
    value.setAttribute("type", "text"); 
    value.setAttribute("spellcheck", "false");
    value.setAttribute("class", "form-control");
    value.setAttribute("placeholder", "value");
    value.setAttribute("aria-label", "value");

    // remove_inputs button setup
    remove_inputs.setAttribute("id", "line" + count.toString());
    remove_inputs.setAttribute("type", "button");
    remove_inputs.setAttribute("class", "btn btn-danger");
    remove_inputs.setAttribute("onclick", "remove_input_group(" + ("ig" + count.toString()) + ")");


    document.getElementById("attributes").appendChild(input_group);

    document.getElementById("line".concat(count)).innerHTML = "-";

    ig_list.push([
        "ig" + count.toString()
    ])
    count++;

}

function remove_input_group(e) {
    let index = ig_list.indexOf(e);
    ig_list.splice(index, 1);
    // e.innerHTML = '';
    e.remove();
    count += -1
    // console.log(ig_list)
}

function add_duplicate_form() {
    var checkBox = document.getElementById("duplicate");
    var content = document.getElementById("duplicate_form");
    if (checkBox.checked == true) {
        content.style.display = "block";
    }
    else {
        content.style.display = "none";
    }
}

function reset() {
    document.getElementById("attributes").innerHTML = "";
    ig_list = [];
    count = 0;
    // document.getElementById("classname_value").value = '';
    // document.getElementById("x1").value = ''; document.getElementById("y1").value = ''; document.getElementById("z1").value = '';
    // document.getElementById("x2").value = ''; document.getElementById("y2").value = ''; document.getElementById("z2").value = '';
    // document.getElementById("ox").value = ''; document.getElementById("oy").value = ''; document.getElementById("oz").value = '';
    // document.getElementById("hollow").checked = true;
    // document.getElementById("textarea").value = ''
}

function copy() {
    document.getElementById("textarea").select();
    document.execCommand('copy');
}

