'use strict'

var container = document.getElementById( 'container' );

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, .1, 1000 );
var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 1, 1000 );
camera.position.set( 50, 10, 0 );
var frustumSize = 1000;

var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls( camera, renderer.domElement );
var clock = new THREE.Clock();

var colors = [
	0xed6a5a,
	0xf4f1bb,
	0x9bc1bc,
	0x5ca4a9,
	0xe6ebe0,
	0xf0b67f,
	0xfe5f55,
	0xd6d1b1,
	0xc7efcf,
	0xeef5db,
	0x50514f,
	0xf25f5c,
	0xffe066,
	0x247ba0,
	0x70c1b3
];

var resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );
var graph = new THREE.Object3D();
scene.add( graph );

init()
render();

function makeLine( geo, c ) {

	var g = new MeshLine();
	g.setGeometry( geo );

	var material = new MeshLineMaterial( {
		useMap: false,
		useGlobalColor: false,
		color: new THREE.Color( colors[ c ] ),
		opacity: 1,
		resolution: resolution,
		sizeAttenuation: !false,
		lineWidth: .01,
		near: camera.near,
		far: camera.far
	});
	var mesh = new THREE.Mesh( g.geometry, material );
	graph.add( mesh );

}

function init() {
	createLines();
}

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: r,
        g: g,
        b: b
    };
}

function createLines() {

	var verts = new Float32Array( 600 );
	var colors = new Float32Array( 800 );
	for( var j = 0; j < 200; j += 1 ) {
		verts[ j * 3 ] = -30 + .3 * j;
		verts[ j * 3 + 1 ] = 5 * Math.sin( .03 *  j );
		verts[ j * 3 + 2 ] = -20;

		var color = HSVtoRGB(0.005*j, 1, 1);
		colors[j * 4] = color.r;
		colors[j * 4 + 1] = color.g;
		colors[j * 4 + 2] = color.b;
		colors[j * 4 + 3] = 1;
	}
	var line = new THREE.BufferGeometry();
	line.addAttribute('position', new THREE.BufferAttribute(verts, 3));
	line.addAttribute('color', new THREE.BufferAttribute(colors, 4));
	
	makeLine( line, 0 );
}

onWindowResize();

function onWindowResize() {

	var w = container.clientWidth;
	var h = container.clientHeight;

	var aspect = w / h;

	camera.left   = - frustumSize * aspect / 2;
	camera.right  =   frustumSize * aspect / 2;
	camera.top    =   frustumSize / 2;
	camera.bottom = - frustumSize / 2;

	camera.updateProjectionMatrix();

	renderer.setSize( w, h );

	resolution.set( w, h );

}

window.addEventListener( 'resize', onWindowResize );

function render() {

	requestAnimationFrame( render );
	controls.update();
	graph.rotation.y += .25 * clock.getDelta();

	renderer.render( scene, camera );

}
