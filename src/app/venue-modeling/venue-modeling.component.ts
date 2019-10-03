import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as THREE from 'three-full';

// import DragControls from 'three-dragcontrols';
// import OrbitControls from 'three-orbitcontrols';
// import { GridHelper } from 'three';

@Component({
	selector: 'app-venue-modeling',
	templateUrl: './venue-modeling.component.html',
	styleUrls: ['./venue-modeling.component.css']
})

export class VenueModelingComponent {

	@ViewChild('rendererContainer') rendererContainer: ElementRef;

	private scene: any;
	private camera: any;
	private renderer: any;
	private objectShapes: any[] = [];
	private grid: any;
	public orbitControls: any;
	private draggableObjectsArray: any[] = [];
	public previousColor: any;
	public geometryShapes: any[];
	public isHelperSelected: boolean;
	public isCubeSelected: boolean;
	public isTrapezoidSelected: boolean;
	public isSphereSelected: boolean;
	public cubeDimensionForm: FormGroup;
	public sphereDimensionForm: FormGroup;
	public helperGridDimensionForm: FormGroup;
	public trapezoidDimensionForm: FormGroup;
	public selectedShape: any = '';

	public constructor() {

		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

		this.camera.position.set(0, 0, 10);

		//scene
		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer();

		this.cubeDimensionForm = new FormGroup({
			width: new FormControl('', Validators.required),
			height: new FormControl('', Validators.required),
			depth: new FormControl('', Validators.required)
		});

		this.sphereDimensionForm = new FormGroup({
			radius: new FormControl('', Validators.required),
			widthSegments: new FormControl('', Validators.required),
			heightSegments: new FormControl('', Validators.required)
		});

		this.helperGridDimensionForm = new FormGroup({
			size: new FormControl('', Validators.required),
			divisions: new FormControl('', Validators.required)
		});

		this.trapezoidDimensionForm = new FormGroup({
			radiusTop: new FormControl('', Validators.required),
			radiusBottom: new FormControl('', Validators.required),
			height: new FormControl('', Validators.required),
			radialSegments: new FormControl('', Validators.required),
			heightSegments: new FormControl('', Validators.required)
		});

		this.geometryShapes = [
			'HelperGrid',
			'Cube',
			'Sphere',
			'Trapezoid'
		];

		this.isHelperSelected = false;

		this.isCubeSelected = false;

		this.isTrapezoidSelected = false;

		this.isSphereSelected = false;

	}

	public ngAfterViewInit(): void {

		this.renderer.setSize(900, 400);

		this.renderer.setClearColor(0x000000);

		this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

		this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

		const dragControls = new THREE.DragControls(this.draggableObjectsArray, this.camera, this.renderer.domElement);

		dragControls.addEventListener('dragstart', (event: any) => {
			console.log('DragStartEvent: ', event);
			this.orbitControls.enabled = false;
			console.log('SCENE :', this.scene);
			console.log('controls :', this.orbitControls);
		});
		dragControls.addEventListener('dragend', (event: any) => {
			console.log('DragEndEvent :', event);
			this.orbitControls.enabled = true;
			console.log('controls :', this.orbitControls);
		});

		this.animate();

	}

	/**
	 * 
	 * On changing dropdown options while selecting 3D object.
	 * 
	 * @param event.
	 * 
	 */
	public onDropdownChanged(event: any): void {

		console.log('Event : ', event);

		this.selectedShape = event;

		if (event === 'HelperGrid') {

			this.isHelperSelected = true;
			this.isCubeSelected = false;
			this.isTrapezoidSelected = false;
			this.isSphereSelected = false;

		} else if (event === 'Cube') {

			this.isHelperSelected = false;
			this.isCubeSelected = true;
			this.isTrapezoidSelected = false;
			this.isSphereSelected = false;

		} else if (event === 'Trapezoid') {

			this.isHelperSelected = false;
			this.isCubeSelected = false;
			this.isTrapezoidSelected = true;
			this.isSphereSelected = false;

		} else if (event === 'Sphere') {

			this.isHelperSelected = false;
			this.isCubeSelected = false;
			this.isTrapezoidSelected = false;
			this.isSphereSelected = true;

		}

	}

	/**
	 * 
	 * Creates helper grid.
	 * 
	 * @param size 
	 * @param divisions 
	 * 
	 */
	public createHelperGrid(size: any, divisions: any): void {

		this.grid = new THREE.GridHelper(size, divisions);

		this.scene.add(this.grid);

		this.draggableObjectsArray.push(this.grid);

	}

	/**
	 * 
	 * Rotates object.
	 * 
	 * @param object 
	 * 
	 */
	public rotateObject(object: any): void {
	  // To be implemented.
	}

	/**
	 * 
	 * Creates cube 3D object.
	 * 
	 */
	public createCube(width: any, height: any, depth: any): void {
		const cube = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth, 5, 5, 5), new THREE.MeshBasicMaterial({
			color: "skyblue",
			wireframe: true
		}));

		cube.name = 'cube1';

		cube.rotation.x = Math.PI / 2;

		cube.position.set(1, 1, 0);

		this.scene.add(cube);

		this.draggableObjectsArray.push(cube);

	}

	/**
	 * 
	 * Creates trapezoid.
	 * 
	 */
	public createTrapezoid(radiusTop: any, radiusBottom: any, height: any, radialSegments: any, heightSegments: any): void {

		// 0.8 / Math.sqrt(2), 1 / Math.sqrt(2), 1, 4, 1

		const trapezoid = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments), new THREE.MeshBasicMaterial({
			color: "green",
			wireframe: true
		}));

		// trapezoid.rotateY(Math.PI / 4);

		trapezoid.position.set(2, 2, 0);

		// trapezoid.scale.set(4, 4, 4);

		this.scene.add(trapezoid);

		this.draggableObjectsArray.push(trapezoid);

	}

	/**
	 * 
	 * Creates sphere.
	 * 
	 * @param radius 
	 * @param widthSegments 
	 * @param heightSegments
	 *  
	 */
	public createSphere(radius: any, widthSegments: any, heightSegments: any): void {

		const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, widthSegments, heightSegments), new THREE.MeshBasicMaterial({
			color: 'skyblue',
			wireframe: true
		}));

		sphere.position.set(-1, 1, 0);

		this.scene.add(sphere);

		this.draggableObjectsArray.push(sphere);

	}

	/**
	 * 
	 * Animates the scene.
	 * 
	 */
	public animate(): void {

		// Requests animation frame every few seconds and updates the scene in the background.
		window.requestAnimationFrame(() => this.animate());

		this.renderer.render(this.scene, this.camera);

	}

}
