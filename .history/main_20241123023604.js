import './style.css'
import * as THREE from 'three'
import { addBoilerPlateMesh, addStandardMesh } from './addMeshes'
import { addLight } from './addLights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//Here we grab the wheel adaptor from three-story controls, this is what will allow us to trigger events based on swipes.
import { WheelAdaptor } from 'three-story-controls'
import gsap from 'gsap'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 0, 5)

//Globals
const meshes = {}
const lights = {}
const controls = new OrbitControls(camera, renderer.domElement)

//for the sake of this demo I just have our default position of 0, 0, 5 and our preset location of 2, 0, 3
//we could very easily have an array of more positions corresponding to more elements etc, if you're trying to shift back and forth between two positions this will do however.
let cameraPositions = [
	{ x: 0, y: 0, z: 5 },
	{ x: 2, y: 0, z: 3 },
]

let viewPositions = [
	{ x: 0, y: 0, z: 0 },
	{ x: 2, y: 0, z: 0 },
]
let count = 0

//we're gonna disable all the manual aspects of the camera for now to make it easy
controls.enablePan = false
controls.enableZoom = false
controls.enableRotate = false

//to use our wheelAdaptor we just store a new instance in a variable and call the connect() function
const wheelAdaptor = new WheelAdaptor({ type: 'discrete' })
wheelAdaptor.connect()

//afterworks it's quite simple, we listen for something called trigger, trigger in this case will be whenever we swipe once on the mouse pad.
wheelAdaptor.addEventListener('trigger', () => {
	//inside our event listener code we're going to use gsap and we want to make sure that we don't accidentally trigger multiple animations overwriting each other so we can check if gsap is tweening, aka is gsap currently in the middle of an animation sequence, if yes, then return early don't trigger another sequence.
	if (gsap.isTweening(camera.position) || gsap.isTweening(controls.target)) {
		return
	}

	//we increment our count by 1 and use the modulo to make sure we stay in bounds. count = (0 + 1) % 2 leaves remainder 1. count = (1 + 1) % 2 leaves remainder 0 etc.
	count = (count + 1) % positions.length

	//here we use gsap to change where our controls are looking and where our camera is positioned.
	gsap.to(controls.target, {
		x: viewPositions[count].x,
		y: viewPositions[count].y,
		z: viewPositions[count].z,
		ease: 'power3.inOut',
		duration: 2,
	})
	gsap.to(camera.position, {
		x: cameraPositions[count].x,
		y: cameraPositions[count].y,
		z: cameraPositions[count].z,
		ease: 'power3.inOut',
		duration: 2,
	})
})
init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.default = addBoilerPlateMesh()
	meshes.standard = addStandardMesh()

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.default.scale.set(2, 2, 2)

	//scene operations
	scene.add(meshes.default)
	scene.add(meshes.standard)
	scene.add(lights.defaultLight)

	resize()
	animate()
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	requestAnimationFrame(animate)

	meshes.default.rotation.x += 0.01
	meshes.default.rotation.z += 0.01

	meshes.standard.rotation.x += 0.01
	meshes.standard.rotation.z += 0.01

	// meshes.default.scale.x += 0.01

	renderer.render(scene, camera)
}
