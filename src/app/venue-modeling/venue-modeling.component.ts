import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as THREE from 'three-full';
import { randomBates } from 'd3';

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

	public isEditSphereObject: boolean;
	public isEditCubeObject: boolean;
	public isEditTrapezoidObject: boolean;
	public isEditHelperObject: boolean;
	public editableObject: any = '';

	public constructor() {

		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

		this.camera.position.set(0, 0, 10);

		//scene
		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer();


		this.isEditSphereObject = false;
		this.isEditCubeObject = false;
		this.isEditTrapezoidObject = false;
		this.isEditHelperObject = false;

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
			console.log('Array :', this.draggableObjectsArray);

			if (event.object.name.startsWith('cube')) {
				console.log('I am here :', this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)]);

				this.cubeDimensionForm.get('width').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].geometry.parameters.width);

				this.cubeDimensionForm.get('height').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].geometry.parameters.height);

				this.cubeDimensionForm.get('depth').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].geometry.parameters.depth);

				this.editableObject = this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)];

				this.isCubeSelected = true;
				this.isTrapezoidSelected = false;
				this.isSphereSelected = false;
				this.isHelperSelected = false;

				this.isEditCubeObject = true;

			} else if (event.object.name.startsWith('helper')) {
				console.log('I am here helper :', this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)]);

				this.helperGridDimensionForm.get('size').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].parameters.size);

				this.helperGridDimensionForm.get('divisions').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].parameters.divisions);

				this.editableObject = this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)];

				this.isCubeSelected = false;
				this.isTrapezoidSelected = false;
				this.isSphereSelected = false;
				this.isHelperSelected = true;

				this.isEditHelperObject = true;

			} else if (event.object.name.startsWith('trapezoid')) {

				console.log('I am here helper :', this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)]);

				this.trapezoidDimensionForm.get('radiusTop').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].geometry.parameters.radiusTop);

				this.trapezoidDimensionForm.get('radiusBottom').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].geometry.parameters.radiusBottom);

				this.trapezoidDimensionForm.get('height').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].geometry.parameters.height);

				this.trapezoidDimensionForm.get('radialSegments').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].geometry.parameters.radialSegments);

				this.trapezoidDimensionForm.get('heightSegments').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].geometry.parameters.heightSegments);

				this.editableObject = this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)];

				this.isCubeSelected = false;
				this.isTrapezoidSelected = true;
				this.isSphereSelected = false;
				this.isHelperSelected = false;

				this.isEditTrapezoidObject = true;

			} else if (event.object.name.startsWith('sphere')) {

				console.log('I am here helper :', this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)]);

				this.sphereDimensionForm.get('radius').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].geometry.parameters.radius);

				this.sphereDimensionForm.get('widthSegments').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].geometry.parameters.widthSegments);

				this.sphereDimensionForm.get('heightSegments').setValue(this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)].geometry.parameters.heightSegments);

				this.editableObject = this.draggableObjectsArray[this.draggableObjectsArray.indexOf(event.object)];

				this.isCubeSelected = false;
				this.isTrapezoidSelected = false;
				this.isSphereSelected = true;
				this.isHelperSelected = false;

				this.isEditSphereObject = true;

			}

		});
		const page = document.getElementById('main-canvas');
		const menu = document.getElementById('menu');

		page.addEventListener('contextmenu', function (e: any) {
			e.preventDefault();
			menu.style.display = 'block';
			menu.style.position = 'absolute';
			menu.style.top = e.clientY + 'px';
			menu.style.left = e.clientX + 'px';

		});

		page.addEventListener('click', function (e) {
			console.log(e);
			e.preventDefault();
			menu.style.display = "none";
		})


		this.animate();

	}

	public editObject(): void {

		if (this.editableObject.name.startsWith('cube')) {
			console.log('CUBE FORM :', this.cubeDimensionForm.value);
			let new_geometry = new THREE.BoxGeometry(this.cubeDimensionForm.get('width').value, this.cubeDimensionForm.get('height').value, this.cubeDimensionForm.get('depth').value, 5, 5, 5, 5);
			this.draggableObjectsArray[this.draggableObjectsArray.indexOf(this.editableObject)].geometry.dispose();
			this.draggableObjectsArray[this.draggableObjectsArray.indexOf(this.editableObject)].geometry = new_geometry;
		} else if (this.editableObject.name.startsWith('sphere')) {

			console.log('SPHERE FORM :', this.sphereDimensionForm.value);
			let sphereTempGeometry = new THREE.SphereGeometry(this.sphereDimensionForm.get('radius').value, this.sphereDimensionForm.get('widthSegments').value, this.sphereDimensionForm.get('heightSegments').value);
			this.draggableObjectsArray[this.draggableObjectsArray.indexOf(this.editableObject)].geometry.dispose();
			this.draggableObjectsArray[this.draggableObjectsArray.indexOf(this.editableObject)].geometry = sphereTempGeometry;

		} else if (this.editableObject.name.startsWith('trapezoid')) {

			console.log('TRAPEZOID FORM :', this.trapezoidDimensionForm.value);

			// radiusTop, radiusBottom, height, radialSegments, heightSegments
			let trapezoidTempGeometry = new THREE.CylinderGeometry(this.trapezoidDimensionForm.get('radiusTop').value, this.trapezoidDimensionForm.get('radiusBottom').value, this.trapezoidDimensionForm.get('height').value, this.trapezoidDimensionForm.get('radialSegments').value, this.trapezoidDimensionForm.get('heightSegments').value);
			this.draggableObjectsArray[this.draggableObjectsArray.indexOf(this.editableObject)].geometry.dispose();
			this.draggableObjectsArray[this.draggableObjectsArray.indexOf(this.editableObject)].geometry = trapezoidTempGeometry;

		} else if (this.editableObject.name.startsWith('helper')) {

			let size = this.helperGridDimensionForm.get('size').value || 10;
			let divisions = this.helperGridDimensionForm.get('divisions').value || 10;
			let color1 = new THREE.Color(0x444444);
			let color2 = new THREE.Color(0x888888);

			var center = divisions / 2;
			var step = size / divisions;
			var halfSize = size / 2;

			var vertices = [], colors = [];

			for (var i = 0, j = 0, k = - halfSize; i <= divisions; i++ , k += step) {

				vertices.push(- halfSize, 0, k, halfSize, 0, k);
				vertices.push(k, 0, - halfSize, k, 0, halfSize);

				var color = i === center ? color1 : color2;

				color.toArray(colors, j); j += 3;
				color.toArray(colors, j); j += 3;
				color.toArray(colors, j); j += 3;
				color.toArray(colors, j); j += 3;

			}

			var geometry = new THREE.BufferGeometry();
			geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
			geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

			this.draggableObjectsArray[this.draggableObjectsArray.indexOf(this.editableObject)].parameters = { size: this.helperGridDimensionForm.get('size').value, divisions: this.helperGridDimensionForm.get('divisions').value };

			this.draggableObjectsArray[this.draggableObjectsArray.indexOf(this.editableObject)].geometry.dispose();
			this.draggableObjectsArray[this.draggableObjectsArray.indexOf(this.editableObject)].geometry = geometry;
		}
	}

	/**
	 * 
	 * On changing dropdown options while selecting 3D object.
	 * 
	 * @param event.
	 * 
	 */
	public onDropdownChanged(event: any): void {

		this.helperGridDimensionForm.reset();

		this.cubeDimensionForm.reset();

		this.trapezoidDimensionForm.reset();

		this.sphereDimensionForm.reset();

		this.isEditCubeObject = false;
		this.isEditTrapezoidObject = false;
		this.isEditSphereObject = false;
		this.isEditHelperObject = false;

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

		this.grid.name = 'helper' + '-' + Math.random();

		this.scene.add(this.grid);

		this.grid.parameters = { size: size, divisions: divisions };

		this.draggableObjectsArray.push(this.grid);

		console.log('GRID :', this.grid);

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

		cube.name = 'cube' + '-' + Math.random();

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

		trapezoid.name = 'trapezoid' + '-' + Math.random();

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

		sphere.name = 'sphere' + '-' + Math.random();

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

	public getFormattedObjectName(name: any): string {

      return name.slice(0, name.indexOf('-')) + Number(name.slice(name.indexOf('-'))).toFixed(2);

	}

}
