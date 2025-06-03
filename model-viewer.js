import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls, model;
const modelContainer = document.getElementById('model-viewer');
const loadingIndicator = document.getElementById('loading-indicator');

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    modelContainer.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Load Model
    const loader = new GLTFLoader();
    loader.load('models/1965_ford_mustang_convertible.glb', 
        function(gltf) {
            model = gltf.scene;
            scene.add(model);
            
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3 / maxDim;
            model.scale.multiplyScalar(scale);
            
            // Position camera
            camera.position.z = 5;
            
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
        },
        // Progress callback
        function(xhr) {
            if (xhr.lengthComputable) {
                const percentComplete = xhr.loaded / xhr.total * 100;
                const loadingText = document.querySelector('.loading-text');
                loadingText.textContent = `Loading 3D Model... ${Math.round(percentComplete)}%`;
            }
        },
        // Error callback
        function(error) {
            console.error('An error occurred loading the model:', error);
            loadingIndicator.innerHTML = '<div class="loading-text" style="color: #ff4444;">Error loading 3D model</div>';
        }
    );

    // Control buttons
    document.getElementById('rotate-left').addEventListener('click', () => {
        if (model) model.rotation.y += Math.PI / 4;
    });

    document.getElementById('rotate-right').addEventListener('click', () => {
        if (model) model.rotation.y -= Math.PI / 4;
    });

    document.getElementById('reset-view').addEventListener('click', () => {
        if (model) {
            model.rotation.set(0, 0, 0);
            camera.position.set(0, 0, 5);
            controls.reset();
        }
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();
animate();

