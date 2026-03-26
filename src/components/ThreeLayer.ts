import * as THREE from 'three';
import maplibregl from 'maplibre-gl';
import type { Missionary } from './MapboxMap';

export class ThreeLayer {
  id = 'missionary-bases-3d';
  type = 'custom' as const;
  renderingMode = '3d' as const;

  map: maplibregl.Map | null = null;
  renderer: THREE.WebGLRenderer | null = null;
  scene: THREE.Scene | null = null;
  camera: THREE.Camera | null = null;
  
  // Interaction
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  bases: THREE.Group[] = [];
  
  private locations: Missionary[];
  private onBaseClick: (base: Missionary) => void;
  private onBaseHover: (base: Missionary | null) => void;

  constructor(locations: Missionary[], onBaseClick: (base: Missionary) => void, onBaseHover: (base: Missionary | null) => void) {
    this.locations = locations.filter(l => l.type === 'BASE');
    this.onBaseClick = onBaseClick;
    this.onBaseHover = onBaseHover;
  }

  onAdd(map: maplibregl.Map, gl: WebGLRenderingContext) {
    this.map = map;
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();

    // Geometry templates
    const hexGeom = new THREE.CylinderGeometry(0.8, 0.8, 1.2, 6);
    const edgesGeom = new THREE.EdgesGeometry(hexGeom);
    const ringGeom = new THREE.RingGeometry(0.9, 1.1, 32);

    // Create Pins
    this.locations.forEach(base => {
      const group = new THREE.Group();
      
      // Materials per pin for individual state control
      const edgesMaterial = new THREE.LineBasicMaterial({ 
        color: 0xE4B504, 
        transparent: true, 
        opacity: 0.85 
      });
      const fillMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xE4B504, 
        transparent: true, 
        opacity: 0.06 
      });
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: 0xE4B504,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
      });

      const edges = new THREE.LineSegments(edgesGeom, edgesMaterial);
      const fill = new THREE.Mesh(hexGeom, fillMaterial);
      const halo = new THREE.Mesh(ringGeom, haloMaterial);

      // Positioning - Mercator world is 1x1
      const coord = maplibregl.MercatorCoordinate.fromLngLat(base.coords as [number, number], 0);
      group.position.set(coord.x, coord.y, 0); // Z=0 is surface in standard Custom Layer
      
      // Altitude handling in render loop
      
      // Scale - Mapbox units are tiny
      const scale = 0.0000005; 
      group.scale.set(scale, scale, scale);
      
      // Standard Custom Layer orientation: X, Y is Mercator plane.
      // We need to rotate the pins to stand "up" out of the plane.
      group.rotation.x = Math.PI / 2;

      group.add(edges);
      group.add(fill);
      group.add(halo);
      
      // Halo is flat on the surface
      halo.rotation.x = -Math.PI / 2;
      halo.position.y = -0.6; // Base of the cylinder
      
      group.userData = { 
        base, 
        edges, 
        fill, 
        halo, 
        initialScale: scale,
        edgesMaterial,
        fillMaterial,
        isHovered: false
      };
      
      this.scene!.add(group);
      this.bases.push(group);
    });

    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });
    this.renderer.autoClear = false;
  }

  render(gl: WebGLRenderingContext, matrix: number[]) {
    if (!this.renderer || !this.scene || !this.camera || !this.map) return;

    // Sync camera
    const m = new THREE.Matrix4().fromArray(matrix);
    this.camera.projectionMatrix.copy(m);

    const time = Date.now();
    
    this.bases.forEach(group => {
      const data = group.userData;
      
      // 1. Rotation (Continuous Y axis)
      group.rotation.y += 0.004;

      // 2. Floating + Altitude conversion
      const altitude = 2.0 + Math.sin(time * 0.001) * 0.15;
      const coord = maplibregl.MercatorCoordinate.fromLngLat(data.base.coords, altitude * 100);
      group.position.z = coord.z;

      // 3. Pulse Opacity (only if not hovered)
      if (!data.isHovered) {
        data.edgesMaterial.opacity = Math.sin(time * 0.002) * 0.25 + 0.6;
      }
    });

    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint();
  }

  onMouseAction(e: { point: { x: number, y: number }, originalEvent: MouseEvent }, type: 'click' | 'mousemove') {
    if (!this.map || !this.scene || !this.camera) return;

    // Use map's internal coordinate projection for raycasting if possible
    // but standard canvas-relative NDC is safer for Three.js
    const canvas = this.map.getCanvas();
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((e.originalEvent.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.originalEvent.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    // Find all meshes within our groups
    const meshes: THREE.Object3D[] = [];
    this.bases.forEach(g => g.traverse(child => { if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) meshes.push(child); }));
    
    const intersects = this.raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      // Find the parent group
      let obj = intersects[0].object;
      while (obj.parent && !(obj instanceof THREE.Group)) {
        obj = obj.parent;
      }
      
      if (obj instanceof THREE.Group && obj.userData.base) {
        const data = obj.userData;
        if (type === 'click') {
          this.onBaseClick(data.base);
        } else {
          if (!data.isHovered) {
            data.isHovered = true;
            this.onBaseHover(data.base);
            // Hover effect
            const transitionScale = data.initialScale * 1.2;
            obj.scale.set(transitionScale, transitionScale, transitionScale);
            data.edgesMaterial.opacity = 1.0;
            canvas.style.cursor = 'pointer';
          }
        }
        return;
      }
    }

    // No intersection
    if (type === 'mousemove') {
      let changed = false;
      this.bases.forEach(group => {
        if (group.userData.isHovered) {
          group.userData.isHovered = false;
          const s = group.userData.initialScale;
          group.scale.set(s, s, s);
          group.userData.edgesMaterial.opacity = 0.85;
          changed = true;
        }
      });
      if (changed) {
        this.onBaseHover(null);
        canvas.style.cursor = '';
      }
    }
  }

  updateVisibility(visible: boolean) {
    this.bases.forEach(group => {
      group.visible = visible;
    });
    if (this.map) this.map.triggerRepaint();
  }
}
