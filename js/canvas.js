/**
 * Created by abhij on 3/7/2017.
 *
 */
// Fabric.js Canvas object
let canvas;

let CANVAS_CURRENT;
let UNDO_STACK = [];
let REDO_STACK = [];

let updateFlag = true;
let isFisrt = true;

$(document).ready(function() {
    canvas = window._canvas = new fabric.Canvas('canvas', {
        selection: true,
        // backgroundColor: '#EAEDED',
        preserveObjectStacking: true
    });
    canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), 1.0);

    canvas.on("object:added", function (e) {
        if(updateFlag) {
            var object = e.target;
            console.log('object:added');
            // isFisrt = true;
            updateStack();
        }
    });

    canvas.on("object:modified", function (e) {
        if(updateFlag) {
            var object = e.target;
            console.log('object:modified');
            // isFisrt = true;
            updateStack();
        }
    });

    CANVAS_CURRENT = JSON.stringify(canvas);
    // UNDO_STACK.push();
    // REDO_STACK.push();
});

function State(data) {
    this.data = data;
}

function updateStack() {
    // if(CANVAS_CURRENT === ""){
    //     console.log('current updated');
    //     CANVAS_CURRENT = JSON.stringify(canvas);
    // } else {
        console.log('stack updated');
        UNDO_STACK.push(new State(CANVAS_CURRENT));
        CANVAS_CURRENT = JSON.stringify(canvas);
    // }
}

const ERASE = "erase", DRAW = "draw";

// let FILL_COLOR, BACK_COLOR, STROKE_COLOR;
let DRAW_MODE = DRAW;

function undo() {
    if(UNDO_STACK.length > 0) {
        console.log("undone");
        updateFlag = false;
        // if (stackCounter < state.length) {
        canvas.clear().renderAll();
        // if(isFisrt){
        REDO_STACK.push(new State(CANVAS_CURRENT));
        // isFisrt = false;
        // }
        CANVAS_CURRENT = UNDO_STACK.pop().data;

        canvas.loadFromJSON(CANVAS_CURRENT, function onLoad() {
            canvas.renderAll();
        });
        // }
        updateFlag = true;
    } else {
        console.log("not undone");
    }
}

function redo() {
    if(REDO_STACK.length > 0) {
        console.log("redone");
        // updateStack();
        updateFlag = false;
        // if (mods > 0) {
        canvas.clear().renderAll();
        // if(isFisrt){
        //     REDO_STACK.pop();
        //     isFisrt = false;
        // }
        UNDO_STACK.push(new State(CANVAS_CURRENT));

        CANVAS_CURRENT = REDO_STACK.pop().data;

        canvas.loadFromJSON(CANVAS_CURRENT, function onLoad() {
            canvas.renderAll();
        });
        //console.log("geladen " + (state.length-1-mods+1));
        // mods -= 1;
        //console.log("state " + state.length);
        //console.log("mods " + mods);
        // }
        updateFlag = true;
    } else {
        console.log("not redone");
    }
}

function clearCanvas() {
    canvas.clear();
}

// Copy Paste
let copiedObject;
let copiedObjects = [];
function copy(){
    let object;

    if(canvas.getActiveGroup()){
        for(let i = 0; i < canvas.getActiveGroup().objects.length; i++){
            object = canvas.getActiveGroup().objects[i];
            copiedObjects[i] = object;
        }
    } else if(canvas.getActiveObject()){
        object = canvas.getActiveObject();
        copiedObject = object;
    }
}

function paste(){
    let object;
    if(copiedObjects.length > 0){
        for(let i in copiedObjects){
            object = copiedObjects[i];
            object.set("top", object.top+10);
            object.set("left", object.left+10);
            canvas.add(copiedObjects[i]);
        }
    } else if(copiedObject){
        let object = copiedObject;
        object.set("top", object.top+10);
        object.set("left", object.left+10);
        canvas.add(object);
    }
    canvas.renderAll();
}

function deleteObjects() {
    let activeGroup = canvas.getActiveGroup();
    let activeObject = canvas.getActiveObject();

    if(activeObject){
        activeObject.remove();
    } else if(activeGroup) {
        let objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function(object) {
            canvas.remove(object);
        });
    }
}
// todo: check if more anc be added to this.. https://jsfiddle.net/d29u79vn/
function drawArrow(fromx, fromy, tox, toy) {

    var angle = Math.atan2(toy - fromy, tox - fromx);

    var headlen = 10;  // arrow head size

    // bring the line end back some to account for arrow head.
    tox = tox - (headlen) * Math.cos(angle);
    toy = toy - (headlen) * Math.sin(angle);

    // calculate the points.
    var points = [
        {
            x: fromx,  // start point
            y: fromy
        }, {
            x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2),
            y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
        },{
            x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2),
            y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
        }, {
            x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
            y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
        },{
            x: tox + (headlen) * Math.cos(angle),  // tip
            y: toy + (headlen) * Math.sin(angle)
        }, {
            x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
            y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
        }, {
            x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
            y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
        }, {
            x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
            y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
        },{
            x: fromx,
            y: fromy
        }
    ];

    var arrow = new fabric.Polyline(points, {
        fill: 'white',
        stroke: 'black',
        opacity: 1,
        strokeWidth: 2,
        originX: 'left',
        originY: 'top',
        selectable: true
    });

    canvas.add(arrow);

    canvas.renderAll();
}

function rotateObject(angleOffset) {
    let obj = canvas.getActiveObject(),
        resetOrigin = false;

    if (!obj) return;

    let angle = obj.getAngle() + angleOffset;

    if ((obj.originX !== 'center' || obj.originY !== 'center') && obj.centeredRotation) {
        obj.setOriginToCenter && obj.setOriginToCenter();
        resetOrigin = true;
    }

    angle = angle > 360 ? 90 : angle < 0 ? 270 : angle;

    obj.setAngle(angle).setCoords();

    if (resetOrigin) {
        obj.setCenterToOrigin && obj.setCenterToOrigin();
    }

    canvas.renderAll();
}

function getTimeStamp() {
    let currentDate = new Date();
    return currentDate.getDate() + "-"
        + (currentDate.getMonth()+1) + "-"
        + currentDate.getFullYear() + "_"
        + currentDate.getHours() + "_"
        + currentDate.getMinutes() + "_"
        + currentDate.getSeconds();
}