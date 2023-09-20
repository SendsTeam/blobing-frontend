import { Quaternion, Matrix3, Vector3, LineSegments, BufferGeometry, BufferAttribute, Float32BufferAttribute, LineBasicMaterial, SphereGeometry, CylinderGeometry, BoxGeometry, PlaneGeometry, CanvasTexture, RepeatWrapping, SRGBColorSpace, Color, Vector2, MeshStandardMaterial, MeshToonMaterial, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshPhysicalMaterial, DoubleSide, Line, EventDispatcher, MathUtils, Matrix4, Layers, InstancedMesh, InstancedBufferAttribute, TrianglesDrawMode, TriangleFanDrawMode, TriangleStripDrawMode, CircleGeometry, Box3, Line3, Plane, Triangle, Object3D, Mesh, Loader, FileLoader, ShapeUtils, Box2, Shape, Path, ShapePath, ShapeGeometry, NearestFilter, NearestMipmapNearestFilter, NearestMipmapLinearFilter, LinearFilter, LinearMipmapNearestFilter, LinearMipmapLinearFilter, ClampToEdgeWrapping, MirroredRepeatWrapping, PropertyBinding, InterpolateLinear, Source, LinearEncoding, RGBAFormat, InterpolateDiscrete, Scene, sRGBEncoding, LoaderUtils, SpotLight, PointLight, DirectionalLight, TextureLoader, ImageBitmapLoader, InterleavedBuffer, InterleavedBufferAttribute, PointsMaterial, Material, SkinnedMesh, LineLoop, Points, Group, PerspectiveCamera, OrthographicCamera, Skeleton, AnimationClip, Bone, FrontSide, Texture, VectorKeyframeTrack, NumberKeyframeTrack, QuaternionKeyframeTrack, Sphere, Interpolant, LinearSRGBColorSpace, Vector4, Curve, Euler, EquirectangularReflectionMapping, AmbientLight, Uint16BufferAttribute, DataTextureLoader, HalfFloatType, FloatType, DataUtils, RedFormat, NoColorSpace, ShaderChunk, AnimationMixer, AdditiveBlending, CustomBlending, ZeroFactor, SrcAlphaFactor, SkeletonHelper, AnimationUtils, Raycaster } from 'three';

const PI = Math.PI;
const torad$1 = PI / 180;
const todeg$1 = 180 / PI;
const EPSILON = Number.EPSILON;//0.00001;
const PI90 = PI * 0.5;


const MathTool = {

	todeg: todeg$1,
	torad: torad$1,


	toFixed: (x, n = 3) => (x.toFixed(n) * 1),

	clamp: (v, min, max) => {
		v = v < min ? min : v;
		v = v > max ? max : v;
		return v;
	},

	clampA: (v, min, max) => {
		return Math.max(min, Math.min(max, v))
	},

	lerp: (x, y, t) => ((1 - t) * x + t * y),
	damp: (x, y, lambda, dt) => (MathTool.lerp(x, y, 1 - Math.exp(- lambda * dt))),

	nearAngle: (s1, s2, deg = false) => (s2 + Math.atan2(Math.sin(s1 - s2), Math.cos(s1 - s2)) * (deg ? todeg$1 : 1)),

	unwrapDeg: (r) => (r - (Math.floor((r + 180) / 360)) * 360),
	//unwrapRad: ( r ) => (r - (Math.floor((r + Math.PI)/(2*Math.PI)))*2*Math.PI),
	unwrapRad: (r) => (Math.atan2(Math.sin(r), Math.cos(r))),

	nearEquals: (a, b, t) => (Math.abs(a - b) <= t ? true : false),

	autoSize: (s = [1, 1, 1], type = 'box') => {

		if (s.length === 1) s[1] = s[0];
		let radius = s[0];
		let height = s[1];
		if (type === 'sphere') s = [radius, radius, radius];
		if (type === 'cylinder' || type === 'wheel' || type === 'capsule') s = [radius, height, radius];
		if (type === 'cone' || type === 'pyramid') s = [radius, height, radius];
		if (s.length === 2) s[2] = s[0];
		return s;

	},

	/*distance: ( a, b = { x:0, y:0, z:0 } ) => { // rotation array in degree

		const dx = a.x ? a.x - b.x : 0
		const dy = a.y ? a.y - b.y : 0
		const dz = a.z ? a.z - b.z : 0
		return Math.sqrt( dx * dx + dy * dy + dz * dz );

	},*/

	// RANDOM

	randomSign: () => (Math.random() < 0.5 ? -1 : 1),
	randSpread: (range) => (range * (0.5 - Math.random())),
	rand: (low = 0, high = 1) => (low + Math.random() * (high - low)),
	randInt: (low, high) => (low + Math.floor(Math.random() * (high - low + 1))),

	// ARRAY

	equalArray: (a, b) => {
		let i = a.length;
		while (i--) { if (a[i] !== b[i]) return false }
		return true
	},

	// MATRIX

	composeMatrixArray: (p, q, s = [1, 1, 1]) => {
		const x = q[0], y = q[1], z = q[2], w = q[3];
		const x2 = x + x, y2 = y + y, z2 = z + z;
		const xx = x * x2, xy = x * y2, xz = x * z2;
		const yy = y * y2, yz = y * z2, zz = z * z2;
		const wx = w * x2, wy = w * y2, wz = w * z2;
		const sx = s[0], sy = s[1], sz = s[2];
		return [
			(1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
			(xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
			(xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
			p[0], p[1], p[2], 1
		]
	},

	decomposeMatrixArray: (m) => {

		return [
			m[12], m[13], m[14],

		]
	},

	// for physx substep 

	applyTransformArray: (v, p, q, s = [1, 1, 1]) => {
		const e = MathTool.composeMatrixArray(p, q, s);
		const x = v[0], y = v[1], z = v[2];
		const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
		return [
			(e[0] * x + e[4] * y + e[8] * z + e[12]) * w,
			(e[1] * x + e[5] * y + e[9] * z + e[13]) * w,
			(e[2] * x + e[6] * y + e[10] * z + e[14]) * w
		]
	},

	equalArray: (a, b) => {
		let i = a.length;
		while (i--) { if (a[i] !== b[i]) return false }
		return true
	},

	lerpArray: (a, b, t) => {
		if (t === 0) return a;
		if (t === 1) return b;
		let i = a.length;
		let r = [];
		while (i--) { r[i] = a[i]; r[i] += (b[i] - r[i]) * t; }
		return r
	},

	slerpQuatArray: (a, b, t) => {

		if (t === 0) return a;
		if (t === 1) return b;
		let r = [...a];
		const x = a[0], y = a[1], z = a[2], w = a[3];
		const qx = b[0], qy = b[1], qz = b[2], qw = b[3];
		let cosHalfTheta = w * qw + x * qx + y * qy + z * qz;

		if (cosHalfTheta < 0) {
			r = [-qx, -qy, -qz, -qw];
			cosHalfTheta = - cosHalfTheta;
		} else {
			r = [...b];
		}

		if (cosHalfTheta >= 1.0) return a

		const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

		if (sqrSinHalfTheta <= EPSILON) {

			const s = 1 - t;
			r[3] = s * w + t * r[3];
			r[0] = s * x + t * r[0];
			r[1] = s * y + t * r[1];
			r[2] = s * z + t * r[2];
			return MathTool.quatNomalize(r);

		}

		const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
		const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
		const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

		r[3] = (w * ratioA + r[3] * ratioB);
		r[0] = (x * ratioA + r[0] * ratioB);
		r[1] = (y * ratioA + r[1] * ratioB);
		r[2] = (z * ratioA + r[2] * ratioB);

		return r;

	},

	// QUAT

	toLocalQuatArray: (rot = [0, 0, 0], b) => { // rotation array in degree

		let q1 = MathTool.quatFromEuler(rot);
		let q2 = MathTool.quatInvert(b.quaternion.toArray());
		return MathTool.quatMultiply(q2, q1)

		/*quat.setFromEuler( euler.fromArray( math.vectorad( rot ) ) )
		quat.premultiply( b.quaternion.invert() );
		return quat.toArray();*/

	},

	quatFromEuler: (r = [0, 0, 0], isDeg = true) => {

		const cos = Math.cos;
		const sin = Math.sin;
		const n = isDeg ? torad$1 : 1;
		const x = (r[0] * n) * 0.5, y = (r[1] * n) * 0.5, z = (r[2] * n) * 0.5;
		const c1 = cos(x), c2 = cos(y), c3 = cos(z);
		const s1 = sin(x), s2 = sin(y), s3 = sin(z);

		return [
			s1 * c2 * c3 + c1 * s2 * s3,
			c1 * s2 * c3 - s1 * c2 * s3,
			c1 * c2 * s3 + s1 * s2 * c3,
			c1 * c2 * c3 - s1 * s2 * s3
		]

	},

	quatFromAxis: (r = [0, 0, 0], angle, isDeg = true) => {

		const n = isDeg ? torad$1 : 1;
		const halfAngle = (angle * 0.5) * n, s = Math.sin(halfAngle);
		return [
			r[0] * s,
			r[1] * s,
			r[2] * s,
			Math.cos(halfAngle)
		]

	},

	quatNomalize: (q) => {
		let l = MathTool.lengthArray(q);
		if (l === 0) {
			return [0, 0, 0, 1]
		} else {
			l = 1 / l;
			return MathTool.scaleArray(q, l, 4)
		}
	},

	quatInvert: (q) => {
		return [-q[0], -q[1], -q[2], q[3]]
	},

	quatMultiply: (a, b) => {
		const qax = a[0], qay = a[1], qaz = a[2], qaw = a[3];
		const qbx = b[0], qby = b[1], qbz = b[2], qbw = b[3];
		return [
			qax * qbw + qaw * qbx + qay * qbz - qaz * qby,
			qay * qbw + qaw * qby + qaz * qbx - qax * qbz,
			qaz * qbw + qaw * qbz + qax * qby - qay * qbx,
			qaw * qbw - qax * qbx - qay * qby - qaz * qbz
		]
	},

	quatToAxis: (q) => {

		let w = 2 * Math.acos(q[3]);
		const s = Math.sqrt(1 - q[3] * q[3]);
		if (s < 0.0001) {
			return [1, 0, 0]
		} else {
			return [q[0] / s, q[1] / s, q[2] / s, w]
		}
	},

	eulerFromMatrix: (te) => {

		const m11 = te[0], m12 = te[4], m13 = te[8];
		te[1]; const m22 = te[5], m23 = te[9];
		te[2]; const m32 = te[6], m33 = te[10];

		let ar = [0, 0, 0];
		ar[1] = Math.asin(MathTool.clamp(m13, - 1, 1));
		if (Math.abs(m13) < 0.9999999) {
			ar[0] = Math.atan2(- m23, m33);
			ar[2] = Math.atan2(- m12, m11);
		} else {
			ar[0] = Math.atan2(m32, m22);
			ar[2] = 0;
		}
		return ar

	},

	angleTo: (a, b) => {

		return 2 * Math.acos(Math.abs(MathTool.clamp(MathTool.dotArray(a, b), - 1, 1)));

	},

	lengthArray: (r) => {
		let i = r.length, l = 0;
		while (i--) l += r[i] * r[i];
		return Math.sqrt(l)
	},

	dotArray: (a, b) => {
		let i = a.length, r = 0;
		while (i--) r += a[i] * b[i];
		return r;
	},

	addArray: (a, b, i) => {
		i = i ?? a.length;
		let r = [];
		while (i--) r[i] = a[i] + b[i];
		return r
	},

	subArray: (a, b, i) => {
		i = i ?? a.length;
		let r = [];
		while (i--) r[i] = a[i] - b[i];
		return r
	},

	//

	mulArray: (r, s, i) => {
		i = i ?? r.length;
		while (i--) r[i] *= s;
		return r
	},

	divArray: (r, s, i) => {
		return MathTool.scaleArray(r, 1 / s, i)
	},


	scaleArray: (r, scale, i) => {
		i = i ?? r.length;
		while (i--) r[i] *= scale;
		return r
	},

	fillArray(ar, ar2, n, i) {
		n = n || 0;
		i = i ?? ar.length;
		while (i--) ar2[n + i] = ar[i];
	},

	copyArray: (a, b) => {
		[...b];
	},

	//

	distanceArray: (a, b = [0, 0, 0]) => (MathTool.lengthArray(MathTool.subArray(a, b))),



	// VOLUME

	getVolume: (type, size, vertex = null) => {

		let volume = 1;
		let s = size;

		switch (type) {

			case 'sphere': volume = (4 * Math.PI * s[0] * s[0] * s[0]) / 3; break;
			case 'cone': volume = Math.PI * s[0] * (s[1] * 0.5) * 2; break;
			case 'box': volume = 8 * (s[0] * 0.5) * (s[1] * 0.5) * (s[2] * 0.5); break;
			case 'cylinder': volume = Math.PI * s[0] * s[0] * (s[1] * 0.5) * 2; break;
			case 'capsule': volume = ((4 * Math.PI * s[0] * s[0] * s[0]) / 3) + (Math.PI * s[0] * s[0] * (s[1] * 0.5) * 2); break;
			case 'convex': case 'mesh': volume = MathTool.getConvexVolume(vertex); break;

		}

		return volume;

	},

	getConvexVolume: (v) => {

		let i = v.length / 3, n;
		let min = [0, 0, 0];
		let max = [0, 0, 0];

		while (i--) {

			n = i * 3;
			if (v[n] < min[0]) min[0] = v[n];
			else if (v[n] > max[0]) max[0] = v[n];
			if (v[n + 1] < min[1]) min[1] = v[n + 1];
			else if (v[n + 1] > max[1]) max[1] = v[n + 1];
			if (v[n + 2] < min[2]) min[2] = v[n + 2];
			else if (v[n + 2] > max[2]) max[2] = v[n + 2];

		}

		let s = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];

		return 8 * (s[0] * 0.5) * (s[1] * 0.5) * (s[2] * 0.5);
		//return (max[0]-min[0])*(max[1]-min[1])*(max[2]-min[2])

	},

	massFromDensity: (density, volume) => (density * volume),
	densityFromMass: (mass, volume) => (mass / volume),


	// GEOMETRY

	getIndex: (g) => {

		if (!g.index) return null
		return g.index.array || null

	},

	getVertex: (g, noIndex) => {

		let c = g.attributes.position.array;

		if (noIndex) {
			let h = g.clone().toNonIndexed();
			c = h.attributes.position.array;
		}

		return c;

	},

	reduce: (x) => {
	},

	barycentric: (simplex, point) => {


	},

	solve: (simplex, point) => {
	}

};

// point weight blend space javascript

/*
get_blend_space_2d_node_influences :: (using space : *Blend_Space_2d, position : Vec2) -> []f32 #must
{
	weights           := alloc_array (f32, nodes.count, temp_allocator);
	sqrd_distances    := alloc_array (f32, nodes.count, temp_allocator);
	angular_distances := alloc_array (f32, nodes.count, temp_allocator);

	total_sqrd_distance, total_angular_distance := 0.0;
	for nodes
	{
		sqrd_distance := dot (position - it.position, position - it.position);
		if sqrd_distance > 0
		{
			angular_distance := -(clamp (dot (normalize (position), normalize (it.position)), -1, 1) - 1) * 0.5;
			total_sqrd_distance += 1 / sqrd_distance;
			if angular_distance > 0 then total_angular_distance += 1 / angular_distance;
			sqrd_distances[it_index] = sqrd_distance;
			angular_distances[it_index] = angular_distance;
		}
		else    // The distance is 0 so it.position == position
		{
			// Weights are already initialized to 0
			weights[it_index] = 1;

			return weights;
		}
	}

	for i : 0..nodes.count - 1
	{
		sqrd_distance    := total_sqrd_distance    * sqrd_distances[i];
		angular_distance := total_angular_distance * angular_distances[i];
		if sqrd_distance > 0 && angular_distance > 0
			weights[i] = (1 / sqrd_distance) * 0.5 + (1 / angular_distance) * 0.5;
		else if sqrd_distance > 0
			weights[i] = (1 / sqrd_distance) * 0.5 + 0.5;
		else
			weight = 0;
	}

	return weights;
}
*/

const Max = {
	body: 2000,
	joint: 500,
	contact: 50,
	ray: 100,
	character: 50,
	vehicle: 50,
	solver: 20,
	//terrain:10,
};

const Num = {
	bodyFull: 14,
	body: 8,
	joint: 16,
	contact: 8,
	ray: 11,
	character: 16,
	vehicle: 72,//max 8 wheels
	solver: 128,//256,
	//terrain:1,
};

const getArray = function (engine, full = false) {

	let ArPos = {};

	let counts = {
		body: Max.body * (full ? Num.bodyFull : Num.body),
		joint: Max.joint * Num.joint,
		ray: Max.ray * Num.ray,
		contact: Max.contact * Num.contact,
		character: Max.character * Num.character
	};

	if (engine === 'PHYSX' || engine === 'AMMO') {
		counts['vehicle'] = Max.vehicle * Num.vehicle;
	}

	if (engine === 'PHYSX') {
		counts['solver'] = Max.solver * Num.solver;
	}

	if (engine === 'HAVOK' || engine === 'RAPIER') {
		Num.joint = 0;
	}

	let prev = 0;

	for (let m in counts) {

		ArPos[m] = prev;
		prev += counts[m];

	}

	ArPos['total'] = prev;

	return ArPos

};

const getType = function (o) {
	switch (o.type) {
		case 'plane': case 'box': case 'sphere': case 'highSphere': case 'cylinder': case 'stair': case 'particle':
		case 'cone': case 'capsule': case 'mesh': case 'convex': case 'compound': case 'null':
			if (!o.mass && !o.density && !o.kinematic) return 'solid'
			else return 'body'
		case 'generic': case 'hinge': case 'slider': case 'spherical': case 'fixe':
		case "dof": case "d6": case 'ragdoll': case 'universal': case 'cylindrical': case "distance":
		case 'revolute': case "prismatic":
			return 'joint'
		default:
			return o.type
	}
};

//import { CircleHelper } from '../3TH/helpers/CircleHelper.js';
//import { CarbonTexture } from '../3TH/textures/CarbonTexture.js';


const map = new Map();

//-------------------
//
//  ROOT
//
//-------------------

const root = {

	Ar: null,
	ArPos: {},

	//AR:null,

	viewSize: null,

	engine: 'OIMO',
	motor: null,
	scene: null,
	scenePlus: null,
	threeScene: null,
	post: null,
	//up:null,
	//update:null,
	//change:null,
	jointVisible: false,
	delta: 0,
	add: null,
	remove: null,
	items: null,
	tmpMesh: [],
	instanceMesh: {},
	tmpTex: [],
	//tmpMat : [],

	//hideMaterial: null,
	//lineMaterial: null,

	mouseDown: false,

	flow: {
		stamp: 0,
		current: '',
		key: [],
		tmp: [],
		add: [],
		remove: []
	},
	reflow: {
		ray: [],
		stat: { fps: 0 },
		point: {},
	},

	extraMaterial: () => { },

	disposeTmp: () => {

		// clear temporary mesh
		let i, j, m;
		for (i in root.tmpMesh) {
			m = root.tmpMesh[i];
			if (m.children) {
				for (j in m.children) root.disposeMesh(m.children[j]);
			}
			root.disposeMesh(m);
			if (m.parent) m.parent.remove(m);
		}
		root.tmpMesh = [];

		// clear temporary textures
		for (i in root.tmpTex) root.tmpTex[i].dispose();

	},

	disposeMesh: (m) => {
		if (m.geometry) m.geometry.dispose();
		if (m.dispose) m.dispose();
	},

};


//-------------------
//
//  UTILS
//
//-------------------

const Utils = {

	byName: (name) => {

		if (!map.has(name)) return null;
		return map.get(name);

	},

	add: (b, parent) => {

		if (b.type !== 'contact' && !b.isInstance && b.isObject3D) {

			//console.log('add', b.name, b.type )

			if (!parent) {
				if (b.isButton) { root.scene.add(b); }
				else {
					switch (b.type) {
						case 'terrain': case 'solid': case 'joint': case 'ray': case 'articulation': root.scenePlus.add(b); break;
						default: root.scene.add(b); break;
					}
				}

			} else {
				parent.add(b);
			}

		}

		//console.log('add', b.name, b.type )

		map.set(b.name, b);

	},

	remove: (b) => {

		if (b.dispose) b.dispose();
		if (b.parent) b.parent.remove(b);
		if (b.instance) b.instance.remove(b.id);
		map.delete(b.name);

	},

	noRay: (b) => {
		if (b.isObject3D) {
			b.raycast = () => { return };
			b.traverse((child) => {
				if (child.isObject3D) child.raycast = () => { return };
			});

		}
	},

	morph: (obj, name, value) => {

		if (!obj.morphTargetInfluences) return
		if (obj.morphTargetDictionary[name] === undefined) return
		obj.morphTargetInfluences[obj.morphTargetDictionary[name]] = value;

	},


	toLocal: (v, obj, isAxe = false) => {

		//if( obj.isObject3D ) obj.updateWorldMatrix( true, false )
		// apply position
		if (!isAxe) v.sub(obj.position);
		// apply invers rotation
		let q = obj.quaternion;
		//v.applyQuaternion(q.clone().invert())
		//v.applyQuaternion({x:-q.x, y:-q.y, z:-q.z, w:q.w})
		v.applyQuaternion({ x: -q._x, y: -q._y, z: -q._z, w: q._w });
		//if(isAxe) v.normalize()
		return v

	},

	quatLocal: (q, obj) => {

		if (obj.isObject3D) obj.updateWorldMatrix(true, false);
		// apply position
		//if(!isAxe) v.sub( obj.position )
		// apply invers rotation
		let q1 = new Quaternion().fromArray(q);
		let q2 = obj.quaternion.clone().invert();
		q1.premultiply(q2);
		//v.applyQuaternion({x:-q.x, y:-q.y, z:-q.z, w:q.w})
		return q1.normalize().toArray()

	},

	axisLocal: (v, obj) => {

		if (obj.isObject3D) obj.updateWorldMatrix(true, false);
		// apply position

		let m3 = new Matrix3().setFromMatrix4(obj.matrixWorld);//.invert()
		//m3.invert()
		let vv = new Vector3().fromArray(v).applyMatrix3(m3);

		//let vv = new Vector3().fromArray(v).applyMatrix4( obj.matrixWorld.clone().invert() );

		return vv.toArray()

	},


	quatToAngular: (qb, qa) => {

		/*const qq1 = new Quaternion().fromArray(qa);
		const qq2 = new Quaternion().fromArray(qb);
		//qq1.normalize()
		//qq2.normalize();



		qq2.multiply( qq1.invert() )*/

		// invert
		qa[0] *= -1;
		qa[1] *= -1;
		qa[2] *= -1;

		let x = qa[0] * qb[3] + qa[3] * qb[0] + qa[1] * qb[2] - qa[2] * qb[1];
		let y = qa[1] * qb[3] + qa[3] * qb[1] + qa[2] * qb[0] - qa[0] * qb[2];
		let z = qa[2] * qb[3] + qa[3] * qb[2] + qa[0] * qb[1] - qa[1] * qb[0];
		let w = qa[3] * qb[3] - qa[0] * qb[0] - qa[1] * qb[1] - qa[2] * qb[2];

		let angle = 2 * Math.acos(w), ax;
		let s = Math.sqrt(1 - w * w); // assuming quaternion normalised then w is less than 1, so term always positive.
		if (s < 0.001) { // test to avoid divide by zero, s is always positive due to sqrt
			// if s close to zero then direction of axis not important
			// if it is important that axis is normalised then replace with x=1; y=z=0;
			ax = [0, 0, 0];
		} else {
			//x = q[0] / s; // normalise axis
			ax = [x / s, y / s, z / s];
		}



		/*const matrix1 = new Matrix4().makeRotationFromQuaternion(qq1);
		const matrix2 = new Matrix4().makeRotationFromQuaternion(qq2);

		matrix2.multiply(matrix1.invert())

		const v = new Vector3().applyMatrix4(matrix2);
		const angle = Math.acos((matrix2.elements[0] + matrix2.elements[5] + matrix2.elements[10] - 1) / 2);
*/
		const v = new Vector3().fromArray(ax);
		const timeDiff = 1;//time2 - time1;
		v.multiplyScalar(angle / timeDiff);

		//console.log('result',v)

	},

	/* matrixToAxix: ( m ) => {
 
		 let p = new Vector3(1,0,0).transformDirection( m )
		 return p.toArray()
 
	 },*/

	refAxis: (m, axe) => {

		let zAxis = new Vector3().fromArray(axe);
		let xAxis = new Vector3(1, 0, 0);
		let yAxis = new Vector3(0, 1, 0);
		if (Math.abs(axe[1]) > 0.9999) {
			yAxis.copy(xAxis).cross(zAxis).normalize();
		} else {
			xAxis.copy(zAxis).cross(yAxis).normalize();
			yAxis.copy(xAxis).cross(zAxis).normalize();
		}

		m.makeBasis(xAxis, yAxis, zAxis);

	}



};

class CircleHelper extends LineSegments {

	constructor(box, color = 0xffff00) {

		let size = 0.6;

		const indices = new Uint16Array([
			0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 0,
			6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 6,
			12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 12,
			18, 19, 20, 21, 22, 23,
		]);
		const positions = [



			0.5, 0.0, 0.0,
			0.25, 0.433, 0.0,
			-0.25, 0.433, 0.0,
			-0.5, 0.0, 0.0,
			-0.25, -0.433, 0.0,
			0.25, -0.433, 0.0,

			0.5, 0.0, 0.0,
			0.25, 0.0, 0.433,
			-0.25, 0.0, 0.433,
			-0.5, 0.0, 0.0,
			-0.25, 0.0, -0.433,
			0.25, 0.0, -0.433,

			0.0, 0.5, 0.0,
			0.0, 0.25, 0.433,
			0.0, -0.25, 0.433,
			0.0, -0.5, 0.0,
			0.0, -0.25, -0.433,
			0.0, 0.25, -0.433,

			0, 0, 0, size, 0, 0,
			0, 0, 0, 0, size, 0,
			0, 0, 0, 0, 0, size,


		];

		const colors = [

			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,

			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,

			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,

			1, 0, 0, 1, 0, 0,
			0, 1, 0, 0, 1, 0,
			0, 0, 1, 0, 0, 1,

		];

		const geometry = new BufferGeometry();

		geometry.setIndex(new BufferAttribute(indices, 1));

		geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
		geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

		super(geometry, new LineBasicMaterial({ color: color, depthTest: false, depthWrite: false, toneMapped: false, transparent: true }));

		this.box = box;

		this.type = 'CircleHelper';

		this.geometry.computeBoundingSphere();

	}

	updateMatrixWorld(force) {

		const box = this.box;

		if (box.isEmpty()) return;

		box.getCenter(this.position);

		box.getSize(this.scale);

		this.scale.multiplyScalar(0.5);

		super.updateMatrixWorld(force);

	}

	dispose() {

		this.geometry.dispose();
		this.material.dispose();

	}

}

//-------------------
//
//  GEOMETRY
//
//-------------------


let geoN = 0;
let geo = {};

const Geo = {

	unic: (g) => {

		geo['geo' + geoN++] = g;

	},

	set: (g) => {

		geo[g.name] = g;

	},

	get: (name, o = {}) => {

		if (!geo[name]) {
			let g;
			switch (name) {
				case 'plane': g = new PlaneGeometry(1, 1); g.rotateX(-Math.PI * 0.5); break
				case 'box': g = new BoxGeometry(1, 1, 1); break
				case 'sphere': g = new SphereGeometry(1, 16, 12); break
				case 'cylinder': g = new CylinderGeometry(1, 1, 1, 16); break
				//case 'wheel':    g = new CylinderGeometry( 1, 1, 1 , 16 ); g.rotateX( -Math.PI * 0.5 ); break
				case 'cone': g = new CylinderGeometry(0.001, 1, 1, 16); break
				//case 'joint':    g = new Box3Helper().geometry; g.scale( 0.05,0.05,0.05 ); break
				case 'particle': g = new SphereGeometry(1.0, 8, 6); break
				case 'joint': g = new CircleHelper().geometry; break
				default: return null;
			}
			geo[name] = g;
		}

		return geo[name]

	},

	dispose: () => {
		//console.log( geo )
		for (let n in geo) geo[n].dispose();
		geo = {};
		geoN = 0;

	}

};

class CarbonTexture {

	constructor(normal, c1 = 'rgb(69,69,69)', c2 = 'rgb(39,39,39)') {

		let s = 128;

		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = s;

		const ctx = canvas.getContext('2d');
		ctx.fillStyle = c1;
		ctx.fillRect(0, 0, s, s);

		if (!normal) {

			ctx.beginPath();
			ctx.fillStyle = c2;
			ctx.rect(0, 0, 32, 64);
			ctx.rect(32, 32, 32, 64);
			ctx.rect(64, 64, 32, 64);
			ctx.rect(96, 96, 32, 64);
			ctx.rect(96, -32, 32, 64);
			ctx.fill();

		} else {

			let i, j, n, d;
			let pos = [[0, 0], [32, 32], [64, 64], [96, 96], [96, -32]];
			let deg = [[0, 64], [32, 96], [64, 128], [96, 160], [-32, 32]];

			let f1 = normal ? 'rgb(128,128,255)' : c1;
			let f2 = normal ? 'rgb(160,100,255)' : c2;
			let f3 = normal ? 'rgba(100,160,255, 0.5)' : 'rgba(0,0,0, 0.1)';

			ctx.strokeStyle = f3;
			ctx.lineWidth = 1;

			for (i = 0; i < 5; i++) {

				d = ctx.createLinearGradient(0, deg[i][0], 0, deg[i][1]);
				d.addColorStop(0, f2);
				d.addColorStop(1, f1);

				ctx.beginPath();
				ctx.fillStyle = d;
				ctx.rect(pos[i][0], pos[i][1], 32, 64);
				ctx.fill();

				for (let j = 0; j < 8; j++) {

					n = (Math.random() - 0.5) * 2;

					ctx.beginPath();
					ctx.moveTo(pos[i][0] + n + 2 + j * 4, pos[i][1]);
					ctx.lineTo(pos[i][0] + n + 2 + j * 4, pos[i][1] + 64);
					ctx.stroke();
				}

			}

			pos = [[32, 0], [64, 32], [96, 64], [-32, 64], [0, 96]];
			deg = [[32, 96], [64, 128], [96, 160], [-32, 32], [0, 64]];

			for (i = 0; i < 5; i++) {

				d = ctx.createLinearGradient(deg[i][0], 0, deg[i][1], 0);
				d.addColorStop(0, f1);
				d.addColorStop(1, f2);

				ctx.beginPath();
				ctx.fillStyle = d;
				ctx.rect(pos[i][0], pos[i][1], 64, 32);
				ctx.fill();

				for (j = 0; j < 8; j++) {

					n = (Math.random() - 0.5) * 2;
					ctx.beginPath();
					ctx.moveTo(pos[i][0], pos[i][1] + n + 2 + j * 4);
					ctx.lineTo(pos[i][0] + 64, pos[i][1] + n + 2 + j * 4);
					ctx.stroke();
				}

			}

		}

		//return canvas;

		const texture = new CanvasTexture(canvas); //new CarbonTexture('#ffffff', '#CCCCCC') )
		texture.wrapS = texture.wrapT = RepeatWrapping;
		texture.repeat.x = texture.repeat.y = 60;

		if (!normal) texture.colorSpace = SRGBColorSpace;

		return texture;

	}

}

//-------------------
//
//  MATERIAL
//
//-------------------

//const mat = new Map()
const mat = {};

let TmpMat = [];

const matExtra = {

	//clearcoat:1.0,
	//clearcoatRoughness:0.1,
	metalness: 0.0,
	roughness: 0.2,
	//normalScale: new Vector2(0.25,0.25),

};

const Colors = {
	body: new Color(0xefefd4),
	sleep: new Color(0xBFBFBD),//0xBFBFAD
	solid: new Color(0x6C6A68),
	base: new Color(0xFFFFFF),
	black: new Color(0x222222),
	gold: new Color(0.944, 0.776, 0.373),
	gold2: new Color(0.998, 0.981, 0.751),
	copper: new Color(0.96467984, 0.37626296, 0.25818297),
	carPaint: new Color(0.1037792, 0.59212029, 0.85064936),
	clay: new Color(0.604, 0.584, 0.497),
	concrete: new Color(0xa9a9a9),
};

const Mat = {

	extendShader: () => { },

	addToTmp: (m) => {

		TmpMat.push(m);
	},

	create: (o) => {

		let m, beforeCompile = null;

		if (o.isMaterial) {
			m = o;
		} else {

			let type = o.type !== undefined ? o.type : 'Standard';
			if (o.type) delete o.type;

			beforeCompile = o.beforeCompile || null;
			if (o.beforeCompile) delete o.beforeCompile;


			if (o.thickness || o.sheen || o.clearcoat || o.transmission || o.specularColor) type = 'Physical';

			if (o.normalScale) {
				if (!o.normalScale.isVector2) o.normalScale = new Vector2().fromArray(o.normalScale);
			}

			type = type.toLowerCase();

			switch (type) {

				case 'physical':
					m = new MeshPhysicalMaterial(o);
					m.defines = {
						'STANDARD': '',
						'PHYSICAL': '',
						'USE_UV': '',
						'USE_SPECULAR': ''
					};
					break;
				case 'phong': m = new MeshPhongMaterial(o); break;
				case 'lambert': m = new MeshLambertMaterial(o); break;
				case 'basic': m = new MeshBasicMaterial(o); break;
				case 'line': m = new LineBasicMaterial(o); break;
				case 'toon': m = new MeshToonMaterial(o); break;
				default: m = new MeshStandardMaterial(o); break;
			}

		}

		if (mat[m.name]) return null;
		Mat.set(m, false, beforeCompile);
		return m;

	},

	set: (m, direct, beforeCompile) => {

		if (!direct) Mat.extendShader(m, beforeCompile);
		mat[m.name] = m;

	},

	changeType: () => {



	},

	setEnvmapIntensity: (v) => {
		let m;
		for (let name in mat) {
			m = mat[name];
			if (!m.userData.envp) m.userData.envp = m.envMapIntensity;
			m.envMapIntensity = m.userData.envp * v;
		}

	},

	getList: () => {

		let l = { ...mat };
		const ignor = ['line', 'debug', 'hide', 'svg'];
		let i = ignor.length;
		while (i--) delete l[ignor[i]];

		return l

	},

	get: (name) => {

		if (!mat[name]) {
			switch (name) {

				case 'body': Mat.create({ name: 'body', color: Colors.body, ...matExtra }); break

				//case 'body':   m = new MeshStandardMaterial({ color:Colors.body, ...matExtra }); break//0xFFF1D2
				case 'sleep': Mat.create({ name: 'sleep', color: Colors.sleep, ...matExtra }); break//0x46B1C9
				case 'solid': Mat.create({ name: 'solid', color: Colors.solid, metalness: 0.1, roughness: 0.8, }); break
				case 'clay': Mat.create({ name: 'clay', color: Colors.clay, metalness: 0.0, roughness: 0.9, }); break
				case 'base': Mat.create({ name: 'base', color: Colors.base, ...matExtra }); break

				case 'concrete': Mat.create({ name: 'concrete', color: Colors.concrete, metalness: 0.0, roughness: 0.9, }); break

				case 'black': Mat.create({ name: 'black', color: Colors.black, metalness: 0, roughness: 0.25 }); break

				// metal
				case 'chrome': Mat.create({ name: 'chrome', color: 0xCCCCCC, metalness: 1, roughness: 0.075 }); break
				case 'gold': Mat.create({ name: 'gold', color: Colors.gold, specularColor: Colors.gold2, metalness: 1, roughness: 0.02 }); break
				case 'copper': Mat.create({ name: 'copper', color: Colors.copper, metalness: 1, roughness: 0.25, clearcoat: 1.0, clearcoatRoughness: 0.2 }); break

				case 'carPaint': Mat.create({ name: 'carPaint', color: Colors.carPaint, metalness: 0, anisotropy: new Vector2(0.5, 0.5), roughness: 0.4, clearcoat: 1.0, clearcoatRoughness: 0, }); break

				//case 'simple': m = Mat.create({ name:'simple', color:0x808080, metalness: 0, roughness: 1 }); break

				case 'carbon': Mat.create({ name: 'carbon', map: new CarbonTexture(), normalMap: new CarbonTexture(true), clearcoat: 1.0, clearcoatRoughness: 0.1, roughness: 0.5 }); break
				case 'cloth': Mat.create({ name: 'cloth', color: 0x8009cf, roughness: 0.5, sheenColor: 0xcb7cff, sheen: 1, sheenRoughness: 0.2 }); break


				//case 'clear':  m = new MeshStandardMaterial({ color:0xFFFFFF, metalness: 0.5, roughness: 0 }); break

				//case 'hero':   m = new MeshStandardMaterial({ color:0x00FF88, ...matExtra }); break
				case 'skinny': Mat.create({ name: 'skinny', color: 0xe0ac69, ...matExtra }); break

				case 'glass': Mat.create({ name: 'glass', color: 0xFFFFff, transparent: true, opacity: 0.8, depthTest: true, depthWrite: true, roughness: 0.02, metalness: 0.0, /*side:DoubleSide,*/ alphaToCoverage: true, premultipliedAlpha: true, transmission: 1, clearcoat: 1, thickness: 0.02 }); break
				case 'glassX': Mat.create({ name: 'glassX', color: 0xeeeeee, transparent: false, opacity: 1.0, roughness: 0.03, metalness: 0, side: DoubleSide, transmission: 1.0, clearcoat: 1, clearcoatRoughness: 0.0, thickness: 0.6, ior: 1.52, envMapIntensity: 1.0, shadowSide: 1, reflectivity: 0.5, iridescence: 0 }); break
				case 'plexi': Mat.create({ name: 'plexi', color: 0xFFFFff, transparent: true, opacity: 0.4, metalness: 1, roughness: 0, clearcoat: 1, side: DoubleSide }); break
				case 'glass2': Mat.create({ name: 'glass2', color: 0xCCCCff, transparent: true, opacity: 0.3 }); break

				case 'car': Mat.create({ name: 'car', color: 0x303030, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03, sheen: 0.5 }); break
				case 'carGlass': Mat.create({ name: 'carGlass', color: 0xffffff, metalness: 0, roughness: 0, transmission: 1.0, ior: 1.52 }); break


				case 'debug': Mat.create({ name: 'debug', type: 'Basic', color: 0xF37042, wireframe: true, toneMapped: false, transparent: true, opacity: 0.25 }); break

				//case 'debug2': m = Mat.create({ name:'debug2', type:'Basic', color:0x00FFFF, wireframe:true, toneMapped: false }); break
				//case 'debug3':  m = Mat.create({ name:'debug3', type:'Basic', color:0x000000, wireframe:true, transparent:true, opacity:0.1, toneMapped: false }); break
				//case 'shadows': m = Mat.create({ name:'shadows', type:'Basic', transparent:true, opacity:0.01 }); break

				//case 'simple': m = Mat.create({ name:'simple', type:'basic'  }); break


				case 'bones': Mat.create({ name: 'bones', color: 0xCCAA33, wireframe: true }); break
				case 'bones2': Mat.create({ name: 'bones2', type: 'basic', color: 0xFF8800, transparent: true, opacity: 0.5, depthTest: true, depthWrite: false, alphaToCoverage: true }); break


				case 'button': Mat.create({ name: 'button', color: 0xFF404B, ...matExtra }); break
				//case 'hide': m = new MeshBasicMaterial({ visible:false }); break

				case 'line':
					Mat.create({ name: 'line', type: 'line', vertexColors: true, toneMapped: false });
					break
				case 'hide':
					Mat.create({ name: 'hide', type: 'basic', visible: false });
					break
				case 'particle':
					Mat.create({ name: 'particle', type: 'basic', toneMapped: false, color: 0x00ff00 });
					break
				case 'svg':
					Mat.create({ name: 'svg', type: 'basic', toneMapped: false, vertexColors: true, transparent: false, side: DoubleSide });
					break




			}

		}

		return mat[name]



	},

	dispose: () => {

		for (let m in mat) {
			mat[m].dispose();
			delete mat[m];
		}

		let i = TmpMat.length;
		while (i--) { TmpMat[i].dispose(); }
		TmpMat = [];

	}

};

class Timer {

	constructor(framerate = -1) {

		this.time = { now: 0, delta: 0, then: 0, interval: 0, tmp: 0, n: 0, dt: 0 };
		this.fps = 0;
		this.delta = 0;
		this.elapsedTime = 0;
		this.unlimited = false;
		this.setFramerate(framerate);
		this.force = false;

	}

	up(stamp = 0) {

		let t = this.time;

		if (this.unlimited) this.force = true;

		t.now = stamp;// !== undefined ? stamp : Date.now();
		t.delta = t.now - t.then;

		if (this.force) {
			t.delta = t.interval;
			this.force = false;
		}

		if (t.delta >= t.interval || this.unlimited) {

			t.then = this.unlimited ? t.now : t.now - (t.delta % t.interval);
			//if(t.delta>)
			//this.delta = t.delta * 0.001 // bug on outside
			this.delta = t.interval * 0.001;
			//if(this.delta>this.time.interval)this.delta=this.time.interval
			this.elapsedTime += this.delta;

			//if ( t.now - 1000 > t.tmp ){ t.tmp = t.now; this.fps = t.n; t.n = 0; }; t.n++;
			return true

		}

		return false

	}

	setFramerate(framerate) {

		this.elapsedTime = 0;
		this.framerate = framerate;
		this.unlimited = this.framerate < 0;
		this.time.interval = 1000 / framerate;
		if (framerate === 60) this.time.interval = 16.67;

	}

}

class User {

	// key map
	// 0 : axe L | left:right  -1>1
	// 1 : axe L | top:down    -1>1
	// 2 : axe R | left:right  -1>1
	// 3 : axe R | top:down    -1>1
	// 4 : bouton A             0-1  jump / space
	// 5 : bouton B             0-1  roulade / shift ctrl
	// 6 : bouton X             0-1  arme principale / E
	// 7 : bouton Y             0-1  arme secondaire
	// 8 : gachette L up        0-1  
	// 9 : gachette R up        0-1
	// 10 : gachette L down     0>1
	// 11 : gachette R down     0>1
	// 12 : bouton setup        0-1
	// 13 : bouton menu         0-1
	// 14 : axe button left     0-1
	// 15 : axe button right    0-1
	// 16 : Xcross axe top      0-1
	// 17 : Xcross axe down     0-1
	// 18 : Xcross axe left     0-1
	// 19 : Xcross axe right    0-1

	// 20 : Keyboard or Gamepad    0-1

	constructor() {

		this.key = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.key2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		this.gamepad = new Gamepad(this.key);

		this.useGamepad = false;
		this.sameAxis = true;

		document.addEventListener('keydown', function (e) { this.keyDown(e); }.bind(this), false);
		document.addEventListener('keyup', function (e) { this.keyUp(e); }.bind(this), false);

	}

	setKey(i, v) {
		this.key[i] = v;
	}

	update() {

		this.gamepad.update();

		if (this.gamepad.ready) {
			if (!this.useGamepad) this.useGamepad = true;
			this.gamepad.getValue(0);
		}

		if (this.sameAxis) {
			this.key[2] = this.key[0];
			this.key[3] = this.key[1];
		}

		//this.axeL[ 0 ] = this.key[ 0 ];
		//this.axeL[ 1 ] = this.key[ 1 ];

		return this.key

	}

	keyDown(e) {

		var key = this.key;
		var key2 = this.key2;
		e = e || window.event;

		if (this.sameAxis) {

			switch (e.which) {
				// axe L
				case 65: case 81: case 37: key[0] = -1; key2[0] = 1; break;//key[0]<=-1 ? -1:key[0]-= 0.1; break; // left, A, Q
				case 68: case 39: key[0] = 1; key2[1] = 1; break; // right, D
				case 87: case 90: case 38: key[1] = -1; break; // up, W, Z
				case 83: case 40: key[1] = 1; break; // down, S

				case 32: key[4] = 1; break; // space
				case 17: case 67: key[5] = 1; break; // ctrl, C
				case 69: key[6] = 1; break; // E

				case 16: key[7] = 1; break; // shift
				//case 71:          view.hideGrid(); break; // G
				//case 121:         noui(); break; // f10
				//case 122:         fscreen(); break; // f11
			}

		} else {

			switch (e.which) {
				// axe L
				case 65: case 81: key[0] = -1; key2[0] = 1; break;//key[0]<=-1 ? -1:key[0]-= 0.1; break; // left, A, Q
				case 68: key[0] = 1; key2[1] = 1; break; // right, D
				case 87: case 90: key[1] = -1; break; // up, W, Z
				case 83: key[1] = 1; break; // down, S
				// axe R
				case 37: key[2] = -1; key2[0] = 1; break; // left
				case 39: key[2] = 1; key2[1] = 1; break; // right
				case 38: key[3] = -1; break; // up
				case 40: key[3] = 1; break; // down


				case 32: key[4] = 1; break; // space
				case 17: case 67: key[5] = 1; break; // ctrl, C
				case 69: key[6] = 1; break; // E

				case 16: key[7] = 1; break; // shift
				//case 121:         noui(); break; // f10
				//case 122:         fscreen(); break; // f11

				//case 71:          view.hideGrid(); break; // G
			}
		}

		this.gamepad.reset();
		//e.preventDefault();

	}

	keyUp(e) {

		var key = this.key;
		var key2 = this.key2;
		e = e || window.event;

		if (this.sameAxis) {

			switch (e.which) {
				// axe L
				case 65: case 81: case 37: key[0] = key[0] < 0 ? 0 : key[0]; key2[0] = 0; break; // left, A, Q
				case 68: case 39: key[0] = key[0] > 0 ? 0 : key[0]; key2[1] = 0; break; // right, D
				case 87: case 90: case 38: key[1] = key[1] < 0 ? 0 : key[1]; break; // up, W, Z
				case 83: case 40: key[1] = key[1] > 0 ? 0 : key[1]; break; // down, S

				case 32: key[4] = 0; break; // space
				case 17: case 67: key[5] = 0; break; // ctrl, C
				case 69: key[6] = 0; break; // E

				case 16: key[7] = 0; break; // shift
			}

		} else {

			switch (e.which) {

				// axe L
				case 65: case 81: key[0] = key[0] < 0 ? 0 : key[0]; key2[0] = 0; break; // left, A, Q
				case 68: key[0] = key[0] > 0 ? 0 : key[0]; key2[1] = 0; break; // right, D
				case 87: case 90: key[1] = key[1] < 0 ? 0 : key[1]; break; // up, W, Z
				case 83: key[1] = key[1] > 0 ? 0 : key[1]; break; // down, S
				// axe R
				case 37: key[2] = key[2] < 0 ? 0 : key[2]; key2[0] = 0; break; // left
				case 39: key[2] = key[2] > 0 ? 0 : key[2]; key2[1] = 0; break; // right
				case 38: key[3] = key[3] < 0 ? 0 : key[3]; break; // up
				case 40: key[3] = key[3] > 0 ? 0 : key[3]; break; // down

				case 32: key[4] = 0; break; // space
				case 17: case 67: key[5] = 0; break; // ctrl, C
				case 69: key[6] = 0; break; // E

				case 16: key[7] = 0; break; // shift


			}
		}

		//e.preventDefault();

	}


}


class Gamepad {

	constructor(key) {

		this.values = [];
		this.ready = 0;
		this.key = key;

	}

	update() {

		var i, j, k, l, v, pad;
		var fix = this.fix;
		var gamepads = navigator.getGamepads();

		for (i = 0; i < gamepads.length; i++) {

			pad = gamepads[i];
			if (pad) {
				k = pad.axes.length;
				l = pad.buttons.length;
				if (l) {
					if (!this.values[i]) this.values[i] = [];
					// axe
					for (j = 0; j < k; j++) {
						v = fix(pad.axes[j], 0.08);
						if (this.ready == 0 && v !== 0) this.ready = 1;
						this.values[i][j] = v;
						//if(i==0) this.key[j] = fix( pad.axes[j], 0.08 );
					}
					// button
					for (j = 0; j < l; j++) {
						v = fix(pad.buttons[j].value);
						if (this.ready == 0 && v !== 0) this.ready = 1;
						this.values[i][k + j] = v;
						//if(i==0) this.key[k+j] = fix( pad.buttons[j].value );
					}
					//info += 'gamepad '+i+'| ' + this.values[i]+ '<br>';
				} else {
					if (this.values[i]) this.values[i] = null;
				}
			}
		}

	}

	getValue(n) {

		var i = 19, v;
		while (i--) {
			v = this.values[n][i];
			if (this.ready == 0 && v !== 0) this.ready = 1;
			this.key[i] = v;
		}

	}

	reset() {

		this.ready = 0;

	}

	fix(v, dead) {

		let n = Number((v.toString()).substring(0, 5));
		if (dead && n < dead && n > -dead) n = 0;
		return n;

	}


}

class Item {

	constructor() {

		this.id = 0;
		this.list = [];
		this.type = 'item';
		this.Utils = null;

	}

	reset() {

		let i = this.list.length;
		while (i--) this.dispose(this.list[i]);
		this.list = [];
		this.id = 0;

	}

	///

	byName(name) {

		return this.Utils.byName(name);

	}

	setName(o = {}) {

		let name = o.name !== undefined ? o.name : this.type + this.id++;

		// clear old item if existe keep id
		o.id = this.remove(name, true);
		o.name = name;
		return name;

	}

	addToWorld(b, id = -1) {

		this.Utils.add(b);
		if (id !== -1) this.list[id] = b;
		else this.list.push(b);

	}

	remove(name, remplace) {

		let b = this.byName(name);
		if (!b) return -1;
		return this.clear(b, remplace);

	}

	clear(b, remplace) {

		let n = this.list.indexOf(b);
		if (n !== - 1 && !remplace) this.list.splice(n, 1);
		else this.list[n] = null;
		this.dispose(b);
		return n;

	}

	dispose(b) {

		if (b !== null) this.Utils.remove(b);

	}

	vecZero(ar, n, i) { while (i--) ar[n + i] = 0; }

	fillArray(ar, ar2, n, i) {
		n = n || 0;
		i = i ?? ar.length;
		while (i--) ar2[n + i] = ar[i];
	}

	arLength(ar) {
		let v = Math.sqrt(ar[0] * ar[0] + ar[1] * ar[1] + ar[2] * ar[2]);
		if (v < 0.001) v = 0;
		return v
	}

	multiplyScalar(ar, v, i) {
		i = i ?? ar.length;
		while (i--) ar[i] *= v;
	}

	divideScalar(ar, v, i) {
		this.multiplyScalar(ar, 1 / v, i);
	}



	add(o = {}) { }

	set(o = {}) { }

	step(AR, N) { }

}

// THREE RAY

class Ray extends Item {

	constructor() {

		super();

		this.Utils = Utils;
		this.type = 'ray';
		this.iType = 'ray';

	}

	step() {

		const AR = root.Ar;
		const N = root.ArPos[this.type];

		let i = this.list.length, r, n;

		while (i--) {

			r = this.list[i];
			n = N + (i * Num.ray);
			r.update(AR, n, root.reflow.ray[i] || null);

		}

	}

	add(o = {}) {

		this.setName(o);

		let r = new ExtraRay(o);

		r.visible = o.visible !== undefined ? o.visible : true;


		// add to world
		this.addToWorld(r, o.id);

		if (o.parent) {
			if (typeof o.parent !== 'string') o.parent = o.parent.name;
		}

		if (o.callback) delete o.callback;



		// add to worker 
		root.post({ m: 'add', o: o });

		return r;

	}

	set(o = {}, r = null) {

		if (r === null) r = this.byName(o.name);
		if (r === null) return;

		r.setRay(o);

	}

}


class ExtraRay extends Line {

	constructor(o = {}) {

		super(new BufferGeometry(), Mat.get('line'));

		this.data = {

			hit: false,
			body: '',
			point: [0, 0, 0],
			normal: [0, 0, 0],
			distance: 0,
			angle: 0

		};

		this.type = 'ray';
		this.name = o.name;

		this.parentMesh = null;
		if (o.parent) {
			this.parentMesh = typeof o.parent === 'string' ? Utils.byName(o.parent) : o.parent;
		}

		this.callback = o.callback || function () { };

		// color
		this.c0 = [0.1, 0.1, 0.3];
		this.c1 = [0.1, 0.4, 0.6];
		this.c2 = [1.0, 0.1, 0.1];
		this.c3 = [0.1, 1.0, 0.1];

		this.begin = new Vector3();
		this.end = new Vector3(0, 1, 0);
		this.fullDistance = 0;

		this.setRay(o);

		this.tmp = new Vector3();
		this.normal = new Vector3();


		this.vv1 = new Vector3();
		this.vv2 = new Vector3();

		const positions = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		const colors = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		//this.geometry = new BufferGeometry();
		this.geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
		this.geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
		//this.geometry.computeBoundingSphere();

		this.vertices = this.geometry.attributes.position;
		this.colors = this.geometry.attributes.color;
		this.local = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		this.matrixAutoUpdate = false;
		this.frustumCulled = false;

	}

	setRay(o) {

		if (o.begin) this.begin.fromArray(o.begin);
		if (o.end) this.end.fromArray(o.end);
		this.fullDistance = this.begin.distanceTo(this.end);

	}

	update(r, n = 0, body = null) {

		this.data.hit = r[n] !== 0 ? true : false;
		this.data.body = body ? body : '';

		this.data.distance = r[n + 1];

		if (this.data.hit) {

			this.local[0] = r[n + 2];
			this.local[1] = r[n + 3];
			this.local[2] = r[n + 4];

			this.tmp.fromArray(r, n + 5);
			this.normal.fromArray(r, n + 8);

			this.data.point = this.tmp.toArray();
			this.data.normal = this.normal.toArray();
			//this.data.distance = this._begin.distanceTo( this.tmp )

			this.tmp.toArray(this.local, 3);
			this.vv1.fromArray(this.local).sub(this.tmp).normalize();
			this.tmp.addScaledVector(this.normal, this.fullDistance - this.data.distance);
			this.tmp.toArray(this.local, 6);


			//vv1.fromArray( r, n+5 ); 

			this.data.angle = Math.floor(MathTool.angleTo(this.vv1.toArray(), this.data.normal) * todeg$1);
			//let angle = MathTool.angleTo( [this.local[0], this.local[2], this.local[2]], [this.local[3], this.local[4], this.local[5]] ) * todeg
			//console.log(this.data.angle)

		} else {
			if (this.parentMesh) {
				//this.parentMesh.updateWorldMatrix(false,false )
				const mtx = this.parentMesh.matrixWorld;
				this.tmp.copy(this.begin).applyMatrix4(mtx).toArray(this.local, 0);
				this.tmp.copy(this.end).applyMatrix4(mtx);
				this.tmp.toArray(this.local, 3);
				this.tmp.toArray(this.local, 6);
			} else {
				this.begin.toArray(this.local, 0);
				this.end.toArray(this.local, 3);
				this.end.toArray(this.local, 6);
			}
		}

		this.updateGeometry();
		//this.updateMatrix()

		this.callback(this.data);

	}

	dispose() {
		this.geometry.dispose();
	}

	raycast() {
		return
	}

	updateGeometry() {

		if (!this.visible) return;

		let v = this.vertices.array;
		let c = this.colors.array;
		let l = this.local;
		let hit = this.data.hit;
		let c1 = hit ? this.c2 : this.c1;
		let c2 = hit ? this.c3 : this.c1;

		c[3] = c1[0];
		c[4] = c1[1];
		c[5] = c1[2];

		c[6] = c2[0];
		c[7] = c2[1];
		c[8] = c2[2];

		v[0] = l[0];
		v[1] = l[1];
		v[2] = l[2];

		v[3] = l[3];
		v[4] = l[4];
		v[5] = l[5];

		v[6] = l[6];
		v[7] = l[7];
		v[8] = l[8];

		this.vertices.needsUpdate = true;
		this.colors.needsUpdate = true;
	}

}

ExtraRay.prototype.isRay = true;

let _object3DId = 0;

const _v1$2 = /*@__PURE__*/ new Vector3();
const _q1 = /*@__PURE__*/ new Quaternion();
const _m1 = /*@__PURE__*/ new Matrix4();
const _target = /*@__PURE__*/ new Vector3();

const _position = /*@__PURE__*/ new Vector3();
const _scale = /*@__PURE__*/ new Vector3();
const _quaternion = /*@__PURE__*/ new Quaternion();

const _xAxis = /*@__PURE__*/ new Vector3(1, 0, 0);
const _yAxis = /*@__PURE__*/ new Vector3(0, 1, 0);
const _zAxis = /*@__PURE__*/ new Vector3(0, 0, 1);

const _addedEvent = { type: 'added' };
const _removedEvent = { type: 'removed' };

class Basic3D extends EventDispatcher {

	constructor() {

		super();

		this.isObject3D = true;

		Object.defineProperty(this, 'id', { value: _object3DId++ });
		this.uuid = MathUtils.generateUUID();

		this.isRay = true;
		this.matrix = new Matrix4();
		this.matrixWorld = new Matrix4();

		this.name = '';
		this.type = 'Object3D';

		this.children = [];
		this.parent = null;


		this.position = new Vector3();
		this.quaternion = new Quaternion();
		this.scale = new Vector3(1, 1, 1);

		this.isKinematic = false;

		this.matrixAutoUpdate = false;
		this.matrixWorldNeedsUpdate = false;

		this.layers = new Layers();
		this.visible = true;
		this.isVisible = true;

		//this.castShadow = false;
		//this.receiveShadow = false;

		this.frustumCulled = true;
		this.renderOrder = 0;

		//this.animations = [];

		this.userData = {};


		this.shapetype = 'box';
		this.size = [1, 1, 1];
		//this.data = {}
		//this._size = new Vector3(1,1,1)
		this.velocity = new Vector3();
		this.angular = new Vector3();
		this.defMat = false;
		this.actif = false;
		this.auto = false;
		this.sleep = false;
		// only for high mesh
		this.mesh = null;
		// if object is link by joint
		this.linked = [];

	}

	// ADD

	select(b) {

	}

	dispose() {

		this.traverse(function (node) {
			if (node.isMesh && node.unic) node.geometry.dispose();
		});

		this.children = [];

	}

	/*set size( value ){
		this._size.fromArray( value )
	}

	get size(){
		return this._size.toArray()
	}*/

	set receiveShadow(value) {
		this.traverse(function (node) {
			if (node.isMesh) node.receiveShadow = value;
		});
	}

	get receiveShadow() {
		if (this.children[0]) return this.children[0].receiveShadow;
		else return false
	}

	set castShadow(value) {
		this.traverse(function (node) {
			if (node.isMesh) node.castShadow = value;
		});
	}

	get castShadow() {
		if (this.children[0]) return this.children[0].castShadow;
		else return false
	}

	set material(value) {
		this.traverse(function (node) {
			if (node.isMesh) node.material = value;
		});
	}

	get material() {
		this.children;
		if (this.children[0]) return this.children[0].material;
		else return null
	}

	//////


	onBeforeRender( /* renderer, scene, camera, geometry, material, group */) { }

	onAfterRender( /* renderer, scene, camera, geometry, material, group */) { }

	applyMatrix4(matrix) {

		if (this.matrixAutoUpdate) this.updateMatrix();

		this.matrix.premultiply(matrix);

		this.matrix.decompose(this.position, this.quaternion, this.scale);

	}

	applyQuaternion(q) {

		this.quaternion.premultiply(q);

		return this;

	}

	setRotationFromAxisAngle(axis, angle) {

		// assumes axis is normalized

		this.quaternion.setFromAxisAngle(axis, angle);

	}

	setRotationFromEuler(euler) {

		this.quaternion.setFromEuler(euler, true);

	}

	setRotationFromMatrix(m) {

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		this.quaternion.setFromRotationMatrix(m);

	}

	setRotationFromQuaternion(q) {

		// assumes q is normalized

		this.quaternion.copy(q);

	}

	rotateOnAxis(axis, angle) {

		// rotate object on axis in object space
		// axis is assumed to be normalized

		_q1.setFromAxisAngle(axis, angle);

		this.quaternion.multiply(_q1);

		return this;

	}

	rotateOnWorldAxis(axis, angle) {

		// rotate object on axis in world space
		// axis is assumed to be normalized
		// method assumes no rotated parent

		_q1.setFromAxisAngle(axis, angle);

		this.quaternion.premultiply(_q1);

		return this;

	}

	rotateX(angle) {

		return this.rotateOnAxis(_xAxis, angle);

	}

	rotateY(angle) {

		return this.rotateOnAxis(_yAxis, angle);

	}

	rotateZ(angle) {

		return this.rotateOnAxis(_zAxis, angle);

	}

	translateOnAxis(axis, distance) {

		// translate object by distance along axis in object space
		// axis is assumed to be normalized

		_v1$2.copy(axis).applyQuaternion(this.quaternion);

		this.position.add(_v1$2.multiplyScalar(distance));

		return this;

	}

	translateX(distance) {

		return this.translateOnAxis(_xAxis, distance);

	}

	translateY(distance) {

		return this.translateOnAxis(_yAxis, distance);

	}

	translateZ(distance) {

		return this.translateOnAxis(_zAxis, distance);

	}

	localToWorld(vector) {

		return vector.applyMatrix4(this.matrixWorld);

	}

	worldToLocal(vector) {

		return vector.applyMatrix4(_m1.copy(this.matrixWorld).invert());

	}

	lookAt(x, y, z) {

		// This method does not support objects having non-uniformly-scaled parent(s)

		if (x.isVector3) {

			_target.copy(x);

		} else {

			_target.set(x, y, z);

		}

		const parent = this.parent;

		this.updateWorldMatrix(true, false);

		_position.setFromMatrixPosition(this.matrixWorld);

		if (this.isCamera || this.isLight) {

			_m1.lookAt(_position, _target, this.up);

		} else {

			_m1.lookAt(_target, _position, this.up);

		}

		this.quaternion.setFromRotationMatrix(_m1);

		if (parent) {

			_m1.extractRotation(parent.matrixWorld);
			_q1.setFromRotationMatrix(_m1);
			this.quaternion.premultiply(_q1.invert());

		}

	}

	add(object) {

		if (arguments.length > 1) {

			for (let i = 0; i < arguments.length; i++) {

				this.add(arguments[i]);

			}

			return this;

		}

		if (object === this) {

			console.error('THREE.Object3D.add: object can\'t be added as a child of itself.', object);
			return this;

		}

		if (object && object.isObject3D) {

			if (object.parent !== null) {

				object.parent.remove(object);

			}

			object.parent = this;
			this.children.push(object);

			object.dispatchEvent(_addedEvent);

		} else {

			console.error('THREE.Object3D.add: object not an instance of THREE.Object3D.', object);

		}

		return this;

	}

	remove(object) {

		if (arguments.length > 1) {

			for (let i = 0; i < arguments.length; i++) {

				this.remove(arguments[i]);

			}

			return this;

		}

		const index = this.children.indexOf(object);

		if (index !== - 1) {

			object.parent = null;
			this.children.splice(index, 1);

			object.dispatchEvent(_removedEvent);

		}

		return this;

	}

	removeFromParent() {

		const parent = this.parent;

		if (parent !== null) {

			parent.remove(this);

		}

		return this;

	}

	clear() {

		const children = this.children;
		let i = children.length;

		while (i--) {
			//for ( let i = 0; i < this.children.length; i ++ ) {

			const object = children[i];
			object.parent = null;
			object.dispatchEvent(_removedEvent);

		}

		this.children.length = 0;

		return this;


	}

	attach(object) {

		// adds object as a child of this, while maintaining the object's world transform
		// Note: This method does not support scene graphs having non-uniformly-scaled nodes(s)

		this.updateWorldMatrix(true, false);

		_m1.copy(this.matrixWorld).invert();

		if (object.parent !== null) {

			object.parent.updateWorldMatrix(true, false);

			_m1.multiply(object.parent.matrixWorld);

		}

		object.applyMatrix4(_m1);

		this.add(object);

		object.updateWorldMatrix(false, true);

		return this;

	}

	getObjectById(id) {

		return this.getObjectByProperty('id', id);

	}

	getObjectByName(name) {

		return this.getObjectByProperty('name', name);

	}

	getObjectByProperty(name, value) {

		if (this[name] === value) return this;

		const children = this.children;
		let i = children.length;

		while (i--) {
			//for ( let i = 0, l = this.children.length; i < l; i ++ ) {

			const child = children[i];
			const object = child.getObjectByProperty(name, value);

			if (object !== undefined) {

				return object;

			}

		}

		return undefined;

	}

	getWorldPosition(target) {

		this.updateWorldMatrix(true, false);

		return target.setFromMatrixPosition(this.matrixWorld);

	}

	getWorldQuaternion(target) {

		this.updateWorldMatrix(true, false);

		this.matrixWorld.decompose(_position, target, _scale);

		return target;

	}

	getWorldScale(target) {

		this.updateWorldMatrix(true, false);

		this.matrixWorld.decompose(_position, _quaternion, target);

		return target;

	}

	getWorldDirection(target) {

		this.updateWorldMatrix(true, false);

		const e = this.matrixWorld.elements;

		return target.set(e[8], e[9], e[10]).normalize();

	}

	setRaycast(v) {
		if (v !== undefined) this.isRay = v;
		if (!this.isRay) {
			let i = this.children.length;
			while (i--) this.children[i].raycast = () => { };
		}
	}

	// direct raycast avoid recursive !!
	raycast(raycaster, intersects) {

		if (!this.isRay) return

		const children = this.children;
		let i = children.length;

		while (i--) {

			if (children[i].layers.test(raycaster.layers)) {

				children[i].raycast(raycaster, intersects);

			}

		}
	}

	traverse(callback) {

		callback(this);

		const children = this.children;
		let i = children.length;

		//for ( let i = 0, l = children.length; i < l; i ++ ) {
		while (i--) {

			children[i].traverse(callback);

		}

	}

	traverseVisible(callback) {

		if (this.visible === false) return;

		callback(this);

		const children = this.children;
		let i = children.length;

		//for ( let i = 0, l = children.length; i < l; i ++ ) {
		while (i--) {

			children[i].traverseVisible(callback);

		}

	}

	traverseAncestors(callback) {

		const parent = this.parent;

		if (parent !== null) {

			callback(parent);

			parent.traverseAncestors(callback);

		}

	}

	/*setTransform( p, q, s ) {

		this.position.fromArray( p )
		this.quaternion.fromArray( q )

		this.matrix.copy( m );
		this.matrix.decompose( this.position, this.quaternion, this.scale );
		this.matrixWorldNeedsUpdate = true;

	}

	setColor( color ) {

		if( this.isInstance ){
			this.instance.setColorAt( this.instanceId, color );
		}
		
	}

	updateMatrix() {

		this.matrix.compose( this.position, this.quaternion, this.scale );
		this.matrixWorldNeedsUpdate = true;

		if( this.isInstance ) {
			this.instance.setTransformAt( this.instanceId, this.position.toArray(), this.quaternion.toArray(), this.size )
			return;
		} else {
			
		}

		

		//if( this.isInstance ) this.instance.setMatrixAt( this.instanceId, this.matrix );
		//else this.matrixWorldNeedsUpdate = true;

	}*/

	updateMatrix() {

		this.matrix.compose(this.position, this.quaternion, this.scale);
		this.matrixWorldNeedsUpdate = true;

	}

	updateMatrixWorld(force) {

		if (this.matrixAutoUpdate) this.updateMatrix();

		if (this.matrixWorldNeedsUpdate || force) {

			if (this.parent === null) {

				this.matrixWorld.copy(this.matrix);

			} else {

				this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);

			}

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		const children = this.children;
		let i = children.length;

		while (i--) {
			//for ( let i = 0, l = children.length; i < l; i ++ ) {
			children[i].updateMatrixWorld(force);

		}

	}

	updateWorldMatrix(updateParents, updateChildren) {

		const parent = this.parent;

		if (updateParents === true && parent !== null) {

			parent.updateWorldMatrix(true, false);

		}

		if (this.matrixAutoUpdate) this.updateMatrix();

		if (this.parent === null) {

			this.matrixWorld.copy(this.matrix);

		} else {

			this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);

		}

		// update children

		if (updateChildren === true) {

			const children = this.children;
			let i = children.length;

			while (i--) {
				//for ( let i = 0, l = children.length; i < l; i ++ ) {
				children[i].updateWorldMatrix(false, true);

			}

		}

	}

}

class Instance extends InstancedMesh {

	constructor(geometry, material, count = 0) {

		super(geometry, material, count);

		//this.instanceMatrix = null;
		this.matrixAutoUpdate = false;
		this.tmpMatrix = new Matrix4();
		this.tmpQuat = new Quaternion();

		this.instanceUv = null;
		this.instanceColor = null;

		this.needSphereUp = false;

		this.isRay = true;

	}

	getInfo(id) {
		this.tmpMatrix.fromArray(this.instanceMatrix.array, id * 16);
		let pos = { x: 0, y: 0, z: 0 };
		let scale = { x: 0, y: 0, z: 0 };
		this.tmpMatrix.decompose(pos, this.tmpQuat, scale);
		return {
			pos: [pos.x, pos.y, pos.z],
			quat: this.tmpQuat.toArray(),
			scale: [scale.x, scale.y, scale.z],
			//worldMatrix:this.tmpMatrix.toArray(),
		}
	}

	add(position = [0, 0, 0], rotation = [0, 0, 0, 1], scale = [1, 1, 1], color = null, uv = null) {
		if (rotation.length === 3) rotation = this.tmpQuat.setFromEuler({ _x: rotation[0], _y: rotation[1], _z: rotation[2], _order: 'XYZ' }, false).toArray();
		if (color) {
			if (color.isColor) color = color.toArray();
			if (this.instanceColor === null) this.instanceColor = new InstancedBufferAttribute(new Float32Array(this.instanceMatrix.count * 3), 3);
		}
		/*if(uv){ 
			if( uv.isVector2 ) uv = uv.toArray()
			if ( this.instanceUv === null ) this.instanceUv = new InstancedBufferAttribute( new Float32Array( this.instanceMatrix.count * 2 ), 2 );
		}*/
		this.expand(position, rotation, scale, color, uv);
	}

	setColorAt(index, color) {

		if (this.instanceColor === null) {

			this.instanceColor = new InstancedBufferAttribute(new Float32Array(this.instanceMatrix.count * 3), 3);

		}
		if (color.isColor) color = color.toArray();

		let id = index * 3;
		this.instanceColor.array[id] = color[0];
		this.instanceColor.array[id + 1] = color[1];
		this.instanceColor.array[id + 2] = color[2];
		//color.toArray( this.instanceColor.array, index * 3 );

	}

	/*setUvAt( index, uv ) {

		if ( this.instanceUv === null ) this.instanceUv = new InstancedBufferAttribute( new Float32Array( this.instanceMatrix.count * 2 ), 2 );
	    
		if( uv.isVector2 ) uv = uv.toArray()
		let id = index * 2
		this.instanceUv.array[id] = uv[0]
		this.instanceUv.array[id +1] = uv[1]

	}*/

	remove(id) {

		if (!this.count) return;
		let old = [...this.instanceMatrix.array];
		old.splice(id * 16, 16);
		this.instanceMatrix = new InstancedBufferAttribute(new Float32Array(old), 16);

		if (this.instanceColor !== null) {
			old = [...this.instanceColor.array];
			old.splice(id * 3, 3);
			this.instanceColor = new InstancedBufferAttribute(new Float32Array(old), 3);
		}

		if (this.instanceUv !== null) {
			old = [...this.instanceUv.array];
			old.splice(id * 2, 2);
			this.instanceUv = new InstancedBufferAttribute(new Float32Array(old), 2);
		}
		this.count--;
	}

	expand(p, q, s, c = [1, 1, 1], uv) {

		let old = this.instanceMatrix !== null ? this.instanceMatrix.array : [];
		this.tmpMatrix.compose({ x: p[0], y: p[1], z: p[2] }, { _x: q[0], _y: q[1], _z: q[2], _w: q[3] }, { x: s[0], y: s[1], z: s[2] });
		this.instanceMatrix = new InstancedBufferAttribute(new Float32Array([...old, ...this.tmpMatrix.toArray()]), 16);
		//this.instanceMatrix.setUsage( DynamicDrawUsage );
		if (this.instanceColor !== null) {
			old = this.instanceColor.array;
			this.instanceColor = new InstancedBufferAttribute(new Float32Array([...old, ...c]), 3);
		}
		/* if ( this.instanceUv !== null ) {
			 old = this.instanceUv.array;
			 this.instanceUv = new InstancedBufferAttribute( new Float32Array([...old, ...uv ]), 2 );
		 }*/
		this.count++;
	}

	setTransformAt(index, p, q, s) {
		this.tmpMatrix.compose({ x: p[0], y: p[1], z: p[2] }, { _x: q[0], _y: q[1], _z: q[2], _w: q[3] }, { x: s[0], y: s[1], z: s[2] });
		this.tmpMatrix.toArray(this.instanceMatrix.array, index * 16);
		this.needSphereUp = true;
	}

	dispose() {
		this.parent.remove(this);
		this.geometry.dispose();
		//this.instanceMatrix = null;
		this.instanceColor = null;
		this.count = 0;
		//console.log(this.name+" is dispose")
		this.dispatchEvent({ type: 'dispose' });

	}

	setRaycast(v) {
		if (v !== undefined) this.isRay = v;
	}

	raycast(raycaster, intersects) {
		if (!this.isRay) return
		super.raycast(raycaster, intersects);
	}

	update() {
		if (this.needSphereUp) this.computeBoundingSphere();
		if (this.instanceMatrix) this.instanceMatrix.needsUpdate = true;
		if (this.instanceColor) this.instanceColor.needsUpdate = true;
		//if( this.instanceUv ) this.instanceUv.needsUpdate = true;
		this.needSphereUp = false;
	}

}

/**
 * @param  {Array<BufferGeometry>} geometries
 * @param  {Boolean} useGroups
 * @return {BufferGeometry}
 */
function mergeGeometries(geometries, useGroups = false) {

	const isIndexed = geometries[0].index !== null;

	const attributesUsed = new Set(Object.keys(geometries[0].attributes));
	const morphAttributesUsed = new Set(Object.keys(geometries[0].morphAttributes));

	const attributes = {};
	const morphAttributes = {};

	const morphTargetsRelative = geometries[0].morphTargetsRelative;

	const mergedGeometry = new BufferGeometry();

	let offset = 0;

	for (let i = 0; i < geometries.length; ++i) {

		const geometry = geometries[i];
		let attributesCount = 0;

		// ensure that all geometries are indexed, or none

		if (isIndexed !== (geometry.index !== null)) {

			console.error('THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.');
			return null;

		}

		// gather attributes, exit early if they're different

		for (const name in geometry.attributes) {

			if (!attributesUsed.has(name)) {

				console.error('THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.');
				return null;

			}

			if (attributes[name] === undefined) attributes[name] = [];

			attributes[name].push(geometry.attributes[name]);

			attributesCount++;

		}

		// ensure geometries have the same number of attributes

		if (attributesCount !== attributesUsed.size) {

			console.error('THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' + i + '. Make sure all geometries have the same number of attributes.');
			return null;

		}

		// gather morph attributes, exit early if they're different

		if (morphTargetsRelative !== geometry.morphTargetsRelative) {

			console.error('THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' + i + '. .morphTargetsRelative must be consistent throughout all geometries.');
			return null;

		}

		for (const name in geometry.morphAttributes) {

			if (!morphAttributesUsed.has(name)) {

				console.error('THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' + i + '.  .morphAttributes must be consistent throughout all geometries.');
				return null;

			}

			if (morphAttributes[name] === undefined) morphAttributes[name] = [];

			morphAttributes[name].push(geometry.morphAttributes[name]);

		}

		if (useGroups) {

			let count;

			if (isIndexed) {

				count = geometry.index.count;

			} else if (geometry.attributes.position !== undefined) {

				count = geometry.attributes.position.count;

			} else {

				console.error('THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ' + i + '. The geometry must have either an index or a position attribute');
				return null;

			}

			mergedGeometry.addGroup(offset, count, i);

			offset += count;

		}

	}

	// merge indices

	if (isIndexed) {

		let indexOffset = 0;
		const mergedIndex = [];

		for (let i = 0; i < geometries.length; ++i) {

			const index = geometries[i].index;

			for (let j = 0; j < index.count; ++j) {

				mergedIndex.push(index.getX(j) + indexOffset);

			}

			indexOffset += geometries[i].attributes.position.count;

		}

		mergedGeometry.setIndex(mergedIndex);

	}

	// merge attributes

	for (const name in attributes) {

		const mergedAttribute = mergeAttributes(attributes[name]);

		if (!mergedAttribute) {

			console.error('THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the ' + name + ' attribute.');
			return null;

		}

		mergedGeometry.setAttribute(name, mergedAttribute);

	}

	// merge morph attributes

	for (const name in morphAttributes) {

		const numMorphTargets = morphAttributes[name][0].length;

		if (numMorphTargets === 0) break;

		mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
		mergedGeometry.morphAttributes[name] = [];

		for (let i = 0; i < numMorphTargets; ++i) {

			const morphAttributesToMerge = [];

			for (let j = 0; j < morphAttributes[name].length; ++j) {

				morphAttributesToMerge.push(morphAttributes[name][j][i]);

			}

			const mergedMorphAttribute = mergeAttributes(morphAttributesToMerge);

			if (!mergedMorphAttribute) {

				console.error('THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the ' + name + ' morphAttribute.');
				return null;

			}

			mergedGeometry.morphAttributes[name].push(mergedMorphAttribute);

		}

	}

	return mergedGeometry;

}

/**
 * @param {Array<BufferAttribute>} attributes
 * @return {BufferAttribute}
 */
function mergeAttributes(attributes) {

	let TypedArray;
	let itemSize;
	let normalized;
	let gpuType = - 1;
	let arrayLength = 0;

	for (let i = 0; i < attributes.length; ++i) {

		const attribute = attributes[i];

		if (attribute.isInterleavedBufferAttribute) {

			console.error('THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported.');
			return null;

		}

		if (TypedArray === undefined) TypedArray = attribute.array.constructor;
		if (TypedArray !== attribute.array.constructor) {

			console.error('THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.');
			return null;

		}

		if (itemSize === undefined) itemSize = attribute.itemSize;
		if (itemSize !== attribute.itemSize) {

			console.error('THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.');
			return null;

		}

		if (normalized === undefined) normalized = attribute.normalized;
		if (normalized !== attribute.normalized) {

			console.error('THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.');
			return null;

		}

		if (gpuType === - 1) gpuType = attribute.gpuType;
		if (gpuType !== attribute.gpuType) {

			console.error('THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.');
			return null;

		}

		arrayLength += attribute.array.length;

	}

	const array = new TypedArray(arrayLength);
	let offset = 0;

	for (let i = 0; i < attributes.length; ++i) {

		array.set(attributes[i].array, offset);

		offset += attributes[i].array.length;

	}

	const result = new BufferAttribute(array, itemSize, normalized);
	if (gpuType !== undefined) {

		result.gpuType = gpuType;

	}

	return result;

}

/**
 * @param {BufferGeometry} geometry
 * @param {number} tolerance
 * @return {BufferGeometry}
 */
function mergeVertices(geometry, tolerance = 1e-4) {

	tolerance = Math.max(tolerance, Number.EPSILON);

	// Generate an index buffer if the geometry doesn't have one, or optimize it
	// if it's already available.
	const hashToIndex = {};
	const indices = geometry.getIndex();
	const positions = geometry.getAttribute('position');
	const vertexCount = indices ? indices.count : positions.count;

	// next value for triangle indices
	let nextIndex = 0;

	// attributes and new attribute arrays
	const attributeNames = Object.keys(geometry.attributes);
	const tmpAttributes = {};
	const tmpMorphAttributes = {};
	const newIndices = [];
	const getters = ['getX', 'getY', 'getZ', 'getW'];
	const setters = ['setX', 'setY', 'setZ', 'setW'];

	// Initialize the arrays, allocating space conservatively. Extra
	// space will be trimmed in the last step.
	for (let i = 0, l = attributeNames.length; i < l; i++) {

		const name = attributeNames[i];
		const attr = geometry.attributes[name];

		tmpAttributes[name] = new BufferAttribute(
			new attr.array.constructor(attr.count * attr.itemSize),
			attr.itemSize,
			attr.normalized
		);

		const morphAttr = geometry.morphAttributes[name];
		if (morphAttr) {

			tmpMorphAttributes[name] = new BufferAttribute(
				new morphAttr.array.constructor(morphAttr.count * morphAttr.itemSize),
				morphAttr.itemSize,
				morphAttr.normalized
			);

		}

	}

	// convert the error tolerance to an amount of decimal places to truncate to
	const decimalShift = Math.log10(1 / tolerance);
	const shiftMultiplier = Math.pow(10, decimalShift);
	for (let i = 0; i < vertexCount; i++) {

		const index = indices ? indices.getX(i) : i;

		// Generate a hash for the vertex attributes at the current index 'i'
		let hash = '';
		for (let j = 0, l = attributeNames.length; j < l; j++) {

			const name = attributeNames[j];
			const attribute = geometry.getAttribute(name);
			const itemSize = attribute.itemSize;

			for (let k = 0; k < itemSize; k++) {

				// double tilde truncates the decimal value
				hash += `${~ ~(attribute[getters[k]](index) * shiftMultiplier)},`;

			}

		}

		// Add another reference to the vertex if it's already
		// used by another index
		if (hash in hashToIndex) {

			newIndices.push(hashToIndex[hash]);

		} else {

			// copy data to the new index in the temporary attributes
			for (let j = 0, l = attributeNames.length; j < l; j++) {

				const name = attributeNames[j];
				const attribute = geometry.getAttribute(name);
				const morphAttr = geometry.morphAttributes[name];
				const itemSize = attribute.itemSize;
				const newarray = tmpAttributes[name];
				const newMorphArrays = tmpMorphAttributes[name];

				for (let k = 0; k < itemSize; k++) {

					const getterFunc = getters[k];
					const setterFunc = setters[k];
					newarray[setterFunc](nextIndex, attribute[getterFunc](index));

					if (morphAttr) {

						for (let m = 0, ml = morphAttr.length; m < ml; m++) {

							newMorphArrays[m][setterFunc](nextIndex, morphAttr[m][getterFunc](index));

						}

					}

				}

			}

			hashToIndex[hash] = nextIndex;
			newIndices.push(nextIndex);
			nextIndex++;

		}

	}

	// generate result BufferGeometry
	const result = geometry.clone();
	for (const name in geometry.attributes) {

		const tmpAttribute = tmpAttributes[name];

		result.setAttribute(name, new BufferAttribute(
			tmpAttribute.array.slice(0, nextIndex * tmpAttribute.itemSize),
			tmpAttribute.itemSize,
			tmpAttribute.normalized,
		));

		if (!(name in tmpMorphAttributes)) continue;

		for (let j = 0; j < tmpMorphAttributes[name].length; j++) {

			const tmpMorphAttribute = tmpMorphAttributes[name][j];

			result.morphAttributes[name][j] = new BufferAttribute(
				tmpMorphAttribute.array.slice(0, nextIndex * tmpMorphAttribute.itemSize),
				tmpMorphAttribute.itemSize,
				tmpMorphAttribute.normalized,
			);

		}

	}

	// indices

	result.setIndex(newIndices);

	return result;

}

/**
 * @param {BufferGeometry} geometry
 * @param {number} drawMode
 * @return {BufferGeometry}
 */
function toTrianglesDrawMode(geometry, drawMode) {

	if (drawMode === TrianglesDrawMode) {

		console.warn('THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.');
		return geometry;

	}

	if (drawMode === TriangleFanDrawMode || drawMode === TriangleStripDrawMode) {

		let index = geometry.getIndex();

		// generate index if not present

		if (index === null) {

			const indices = [];

			const position = geometry.getAttribute('position');

			if (position !== undefined) {

				for (let i = 0; i < position.count; i++) {

					indices.push(i);

				}

				geometry.setIndex(indices);
				index = geometry.getIndex();

			} else {

				console.error('THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.');
				return geometry;

			}

		}

		//

		const numberOfTriangles = index.count - 2;
		const newIndices = [];

		if (drawMode === TriangleFanDrawMode) {

			// gl.TRIANGLE_FAN

			for (let i = 1; i <= numberOfTriangles; i++) {

				newIndices.push(index.getX(0));
				newIndices.push(index.getX(i));
				newIndices.push(index.getX(i + 1));

			}

		} else {

			// gl.TRIANGLE_STRIP

			for (let i = 0; i < numberOfTriangles; i++) {

				if (i % 2 === 0) {

					newIndices.push(index.getX(i));
					newIndices.push(index.getX(i + 1));
					newIndices.push(index.getX(i + 2));

				} else {

					newIndices.push(index.getX(i + 2));
					newIndices.push(index.getX(i + 1));
					newIndices.push(index.getX(i));

				}

			}

		}

		if ((newIndices.length / 3) !== numberOfTriangles) {

			console.error('THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.');

		}

		// build final geometry

		const newGeometry = geometry.clone();
		newGeometry.setIndex(newIndices);
		newGeometry.clearGroups();

		return newGeometry;

	} else {

		console.error('THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:', drawMode);
		return geometry;

	}

}

function mergeBufferGeometries(geometries, useGroups = false) {

	console.warn('THREE.BufferGeometryUtils: mergeBufferGeometries() has been renamed to mergeGeometries().'); // @deprecated, r151
	return mergeGeometries(geometries, useGroups);

}

/**
* SPHERE BOX GEOMETRY
*/
class SphereBox extends BufferGeometry {

	constructor(radius = 1, widthSegs = 10, heightSegs = 10, depthSegs = 10, roundness = 1) {

		super();

		this.type = 'SphereBox';
		this.name = 'SphereBox_' + radius + '_' + widthSegs + '_' + heightSegs + '_' + depthSegs + '_' + roundness;

		radius = radius || 1;

		// segments

		widthSegs = Math.floor(widthSegs);
		heightSegs = Math.floor(heightSegs);
		depthSegs = Math.floor(depthSegs);
		let g = new BoxGeometry(1, 1, 1, widthSegs, heightSegs, depthSegs), v = new Vector3(), r = new Vector3(), n;

		let ar = g.attributes.position.array;
		let nm = g.attributes.normal.array;

		for (let i = 0, l = g.attributes.position.count; i < l; i++) {

			n = i * 3;
			v.set(ar[n], ar[n + 1], ar[n + 2]);
			r.copy(v).normalize();

			v.lerp(r, roundness).multiplyScalar(radius);

			ar[n] = v.x;
			ar[n + 1] = v.y;
			ar[n + 2] = v.z;

			v.normalize();

			nm[n] = v.x;
			nm[n + 1] = v.y;
			nm[n + 2] = v.z;

		}

		this.copy(g);

	}
}

/**
* CAPSULE GEOMETRY
*/
class Capsule extends BufferGeometry {

	constructor(radius = 1, height = 1, radialSegs = 12, heightSegs = 1) {

		super();

		this.type = 'CapsuleGeometry';
		//this.name = 'Capsule_' + radius +'_'+height+'_'+radialSegs+'_'+heightSegs;

		let pi = Math.PI;

		let th = (radius * 2) + height;
		let sy = radius / th;
		let hy = 1 - (2 * sy);

		radialSegs = Math.floor(radialSegs);
		heightSegs = Math.floor(heightSegs);

		let sHeight = Math.floor(radialSegs * 0.5);
		let o0 = Math.PI * 2;
		let o1 = Math.PI * 0.5;
		let m0 = new CylinderGeometry(radius, radius, height, radialSegs, heightSegs, true);
		//let m0 = new CylinderGeometryFix2( radius, radius, height, radialSegs, heightSegs, true );
		//let m0 = new CylinderGeometry( radius, radius, height, radialSegs, heightSegs, true );
		scaleUV(m0, 0, sy, 1, hy);
		let m1 = new SphereGeometry(radius, radialSegs, sHeight, 0, o0, 0, o1);
		scaleUV(m1, 0, 1 - sy, 1, sy);
		let m2 = new SphereGeometry(radius, radialSegs, sHeight, 0, o0, o1, o1);
		scaleUV(m2, 0, 0, 1, sy);
		let mtx0 = new Matrix4().makeRotationY(-pi * 0.5);
		let mtx1 = new Matrix4().makeTranslation(0, height * 0.5, 0);
		let mtx2 = new Matrix4().makeTranslation(0, -height * 0.5, 0);
		m0.applyMatrix4(mtx0);
		m1.applyMatrix4(mtx1);
		m2.applyMatrix4(mtx2);


		let g = mergeVertices(mergeGeometries([m0, m1, m2]));
		this.copy(g);

		/*m0.dispose()
		m1.dispose()
		m2.dispose()
		g.dispose()*/

	}
}


/**
* TORUS EXTRA GEOMETRY
*/
class TorusGeometryFix extends BufferGeometry {

	constructor(radius = 1, tube = 0.4, radialSegments = 8, tubularSegments = 6, arc = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI) {

		super();

		this.type = 'TorusGeometryFix';

		this.parameters = {
			radius: radius,
			tube: tube,
			radialSegments: radialSegments,
			tubularSegments: tubularSegments,
			arc: arc
		};

		radialSegments = Math.floor(radialSegments);
		tubularSegments = Math.floor(tubularSegments);

		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		// helper variables

		const center = new Vector3();
		const vertex = new Vector3();
		const normal = new Vector3();

		let j, i;

		// generate vertices, normals and uvs

		for (j = 0; j <= radialSegments; j++) {

			for (i = 0; i <= tubularSegments; i++) {

				const u = i / tubularSegments * arc;
				//const v = j / radialSegments * Math.PI * 2;

				const v = (j / radialSegments) * thetaLength + thetaStart;

				// vertex

				vertex.x = (radius + tube * Math.cos(v)) * Math.cos(u);
				vertex.y = (radius + tube * Math.cos(v)) * Math.sin(u);
				vertex.z = tube * Math.sin(v);

				vertices.push(vertex.x, vertex.y, vertex.z);

				// normal

				center.x = radius * Math.cos(u);
				center.y = radius * Math.sin(u);
				normal.subVectors(vertex, center).normalize();

				normals.push(normal.x, normal.y, normal.z);

				// uv

				uvs.push(i / tubularSegments);
				uvs.push(j / radialSegments);

			}

		}

		// generate indices

		for (j = 1; j <= radialSegments; j++) {

			for (i = 1; i <= tubularSegments; i++) {

				// indices

				const a = (tubularSegments + 1) * j + i - 1;
				const b = (tubularSegments + 1) * (j - 1) + i - 1;
				const c = (tubularSegments + 1) * (j - 1) + i;
				const d = (tubularSegments + 1) * j + i;

				// faces

				indices.push(a, b, d);
				indices.push(b, c, d);

			}

		}

		// build geometry

		this.setIndex(indices);
		this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
		this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
		this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

	}
}


/**
* CHAMFER CYLINDRE GEOMETRY
*/
class ChamferCyl extends BufferGeometry {

	constructor(radiusTop = 1, radiusBottom = 1, height = 1, filet = 0.01, radialSegs = 12, heightSegs = 1, filetSegs = 2) {

		super();

		this.type = 'ChamferCyl';
		//this.name = 'ChamferCyl_' + radiusTop +'_'+radiusBottom+'_'+height+'_'+filet+'_'+radialSegs+'_'+heightSegs+'_'+filetSegs;

		radialSegs = Math.floor(radialSegs);
		heightSegs = Math.floor(heightSegs);
		filetSegs = Math.floor(filetSegs);

		let mr = new Matrix4();
		let mt = new Matrix4();

		let pi = Math.PI;
		let p90 = pi * 0.5;
		let twoPi = pi * 2;

		let start = 0;//(twoPi / radialSegs)*(3/radialSegs)//;

		let th = height;
		let sy = filet / th;
		let hy = 1 - (2 * sy);
		//console.log(start)

		//let mid = new CylinderGeometryFix( radiusBottom, radiusTop, height-(filet*2), radialSegs, heightSegs, true, start );
		let mid = new CylinderGeometry(radiusTop, radiusBottom, height - (filet * 2), radialSegs, heightSegs, true, start);
		mr.makeRotationY(p90);
		mid.applyMatrix4(mr);

		scaleUV(mid, 0, sy, 1, hy);

		// top
		let c1 = new TorusGeometryFix(radiusTop - filet, filet, filetSegs, radialSegs, twoPi, 0, p90);
		let c2 = new CircleGeometry(radiusTop - filet, radialSegs);

		mt.makeTranslation(0, 0, filet);
		c2.applyMatrix4(mt);

		scaleUV(c1, 0, 1 - sy, 1, sy);

		let top = mergeGeometries([c1, c2]);

		mr.makeTranslation(0, 0, ((height * 0.5) - filet));
		mt.makeRotationX(-p90);

		top.applyMatrix4(mt.multiply(mr));

		/*c1.dispose();
		c2.dispose();*/

		// bottom
		c1 = new TorusGeometryFix(radiusBottom - filet, filet, filetSegs, radialSegs, twoPi, 0, p90);
		c2 = new CircleGeometry(radiusBottom - filet, radialSegs);

		mt.makeTranslation(0, 0, filet);
		c2.applyMatrix4(mt);

		scaleUV(c1, 0, 1 - sy, 1, sy, true);

		let low = mergeGeometries([c1, c2]);

		mr.makeTranslation(0, 0, ((height * 0.5) - filet));
		mt.makeRotationX(p90);
		low.applyMatrix4(mt.multiply(mr));

		/*c1.dispose();
		c2.dispose();*/

		let g = mergeVertices(mergeGeometries([top, mid, low]));

		/*mid.dispose();
		top.dispose();
		low.dispose();*/

		this.copy(g);
		//g.dispose();

	}
}

//ChamferCyl.prototype = Object.create( THREE.BufferGeometry.prototype );

/**
* CHAMFER BOX GEOMETRY
*/
class ChamferBox extends BufferGeometry {

	constructor(width = 1, height = 1, depth = 1, filet = 0.01, widthSegs = 1, heightSegs = 1, depthSegs = 1, filetSegs = 2) {

		super();

		this.type = 'ChamferBox';
		//this.name = 'ChamferBox_' + width +'_'+height+'_'+depth+'_'+filet+'_'+widthSegs+'_'+heightSegs+'_'+depthSegs+'_'+filetSegs;

		widthSegs = Math.floor(widthSegs);
		heightSegs = Math.floor(heightSegs);
		depthSegs = Math.floor(depthSegs);
		filetSegs = Math.floor(filetSegs);

		let pi = Math.PI;
		let p90 = pi * 0.5;
		let twoFilet = filet * 2;

		let midWidth = width * 0.5;
		let midHeight = height * 0.5;
		let midDepth = depth * 0.5;

		let mr = new Matrix4();
		let mt = new Matrix4();
		let mp = new Matrix4();

		// uv calc

		let tw = width;
		let sw = filet / tw;
		let vw = 1 - (2 * sw);

		let th = height;
		let sh = filet / th;
		let vh = 1 - (2 * sw);

		let td = depth;
		let sd = filet / td;
		let vd = 1 - (2 * sd);

		let f = new PlaneGeometry(width - twoFilet, height - twoFilet, widthSegs, heightSegs);
		let c1 = new CylinderGeometry(filet, filet, width - twoFilet, filetSegs, widthSegs, true, 0, p90);
		let c2 = new CylinderGeometry(filet, filet, height - twoFilet, filetSegs, heightSegs, true, 0, p90);
		let s1 = new SphereGeometryFix(filet, filetSegs, filetSegs, 0, p90, 0, -p90);
		let s2 = new SphereGeometryFix(filet, filetSegs, filetSegs, 0, p90, 0, -p90);

		scaleUV(f, -sw, sh, vw, vh);
		scaleUV(c1, 0, sw, sh, vw);
		//scaleUV( c2, 0, -sw, vw, sw )

		mt.makeTranslation(0, midHeight - filet, 0);
		mr.makeRotationX(p90);
		s1.applyMatrix4(mt.multiply(mr));

		mt.makeTranslation(0, -midHeight + filet, 0);
		mr.makeRotationX(p90);
		mp.makeRotationY(-p90);
		s2.applyMatrix4(mt.multiply(mr).multiply(mp));

		let tra = mergeGeometries([c2, s1, s2]);
		let trc = tra.clone();

		/*c2.dispose();
		s1.dispose();
		s2.dispose();*/

		mt.makeTranslation(midWidth - filet, 0, -filet);

		tra.applyMatrix4(mt);

		mt.makeTranslation(-midWidth + filet, 0, -filet);
		mr.makeRotationZ(pi);

		trc.applyMatrix4(mt.multiply(mr));

		// cylinder

		let c3 = c1.clone();

		mr.makeRotationZ(p90);
		mt.makeTranslation(0, midHeight - filet, -filet);
		c1.applyMatrix4(mt.multiply(mr));
		mt.makeTranslation(0, -midHeight + filet, -filet);
		mr.makeRotationZ(-p90);
		c3.applyMatrix4(mt.multiply(mr));

		let rf = mergeGeometries([c1, c3, f, tra, trc]);
		let rg = rf.clone();

		mt.makeTranslation(0, 0, midDepth);
		rf.applyMatrix4(mt);

		mt.makeTranslation(0, 0, -midDepth);
		mr.makeRotationY(pi);
		rg.applyMatrix4(mt.multiply(mr));

		// side left

		/*f.dispose();
		c1.dispose();
		c3.dispose();*/

		f = new PlaneGeometry(depth - twoFilet, height - twoFilet, depthSegs, heightSegs);
		c1 = new CylinderGeometry(filet, filet, depth - twoFilet, filetSegs, depthSegs, true, 0, p90);
		c3 = c1.clone();

		scaleUV(f, -sd, sh, vd, vh);

		mt.makeTranslation(0, -(midHeight - filet), -filet, 0);
		mr.makeRotationZ(-p90);

		c1.applyMatrix4(mt.multiply(mr));

		mt.makeTranslation(0, midHeight - filet, -filet, 0);
		mr.makeRotationZ(p90);

		c3.applyMatrix4(mt.multiply(mr));


		let rr = mergeGeometries([c1, c3, f]);
		let rb = rr.clone();

		/*f.dispose();
		c1.dispose();
		c3.dispose()*/

		mt.makeTranslation(-midWidth, 0, 0);
		mr.makeRotationY(-p90);

		rr.applyMatrix4(mt.multiply(mr));

		// side right

		mt.makeTranslation(midWidth, 0, 0);
		mr.makeRotationY(p90);

		rb.applyMatrix4(mt.multiply(mr));

		// top
		f = new PlaneGeometry(width - twoFilet, depth - twoFilet, widthSegs, depthSegs);
		scaleUV(f, -sw, sd, vw, vd);
		let f2 = f.clone();



		mt.makeTranslation(0, midHeight, 0);
		mr.makeRotationX(-p90);
		f.applyMatrix4(mt.multiply(mr));

		// bottom
		mt.makeTranslation(0, -midHeight, 0);
		mr.makeRotationX(p90);
		f2.applyMatrix4(mt.multiply(mr));

		let g = mergeVertices(mergeGeometries([rf, rg, rr, rb, f, f2]));

		/*rf.dispose();
		rg.dispose();
		rr.dispose();
		rb.dispose();
		f2.dispose();
		f.dispose();*/
		//g.computeVertexNormals()
		//g = g.toNonIndexed()
		//

		createUV(g, 'box');

		this.copy(g);
		/*g.dispose();*/

	}
}

class SphereGeometryFix extends BufferGeometry {

	constructor(radius = 1, widthSegments = 8, heightSegments = 6, phiStart = 0, phiLength = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI) {

		super();

		this.type = 'SphereGeometryFix';

		this.parameters = {
			radius: radius,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			phiStart: phiStart,
			phiLength: phiLength,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};

		widthSegments = Math.floor(widthSegments);
		heightSegments = Math.floor(heightSegments);

		const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);

		let index = 0;
		const grid = [];

		const vertex = new Vector3();
		const normal = new Vector3();

		// buffers

		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		// generate vertices, normals and uvs

		for (let iy = 0; iy <= heightSegments; iy++) {

			const verticesRow = [];

			const v = iy / heightSegments;

			// special case for the poles

			let uOffset = 0;

			if (iy == 0 && thetaStart == 0) {

				uOffset = 0.5 / widthSegments;

			} else if (iy == heightSegments && thetaEnd == Math.PI) {

				uOffset = - 0.5 / widthSegments;

			}

			for (let ix = 0; ix <= widthSegments; ix++) {

				const u = ix / widthSegments;

				// vertex

				vertex.x = - radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
				vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
				vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

				vertices.push(vertex.x, vertex.y, vertex.z);

				// normal

				normal.copy(vertex).normalize();
				normals.push(normal.x, normal.y, normal.z);

				// uv

				uvs.push(u + uOffset, 1 - v);

				verticesRow.push(index++);

			}

			grid.push(verticesRow);

		}

		// indices

		for (let iy = 0; iy < heightSegments; iy++) {

			for (let ix = 0; ix < widthSegments; ix++) {

				const a = grid[iy][ix + 1];
				const b = grid[iy][ix];
				const c = grid[iy + 1][ix];
				const d = grid[iy + 1][ix + 1];

				if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
				if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);

			}

		}

		// build geometry

		this.setIndex(indices);
		this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
		this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
		this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

	}

}

// { SphereGeometryFix };


// UV 

function scaleUV(geometry, x = 0, y = 0, dx = 1, dy = 1, reverse) {

	let uv = geometry.attributes.uv;
	let ar = uv.array;
	let i = uv.count, n = 0;

	while (i--) {
		n = i * 2;
		ar[n] = (ar[n] * dx) - x;
		ar[n + 1] = (ar[n + 1] * dy) + y;

		if (reverse) {
			ar[n] = 1 - ar[n];
			ar[n + 1] = 1 - ar[n + 1];
		}
	}


}

function createUV(geometry, type = 'sphere', boxSize, pos = [0, 0, 0], quat = [0, 0, 0, 1], transformMatrix) {

	//type = type || 'sphere';

	if (transformMatrix === undefined) transformMatrix = new Matrix4();
	transformMatrix.compose({ x: pos[0], y: pos[1], z: pos[2] }, { _x: quat[0], _y: quat[1], _z: quat[2], _w: quat[3] }, { x: 1, y: 1, z: 1 });



	if (boxSize === undefined) {
		if (!geometry.boundingBox) geometry.computeBoundingBox();
		let bbox = geometry.boundingBox;
		boxSize = Math.max(bbox.max.x - bbox.min.x, bbox.max.y - bbox.min.y, bbox.max.z - bbox.min.z);
	}

	//.expandByScalar(0.9);//new THREE.Box3( new THREE.Vector3(-boxSize / 2, -boxSize / 2, -boxSize / 2), new THREE.Vector3(boxSize / 2, boxSize / 2, boxSize / 2));
	//_applyBoxUV( bufferGeometry, transformMatrix, uvBbox, boxSize );

	let uvBbox = new Box3(new Vector3(-boxSize / 2, -boxSize / 2, -boxSize / 2), new Vector3(boxSize / 2, boxSize / 2, boxSize / 2));
	//let uvBbox = bbox



	let coords = [];
	//coords.length = 2 * geometry.attributes.position.array.length / 3;
	coords.length = 2 * geometry.attributes.position.count;

	//if ( geometry.attributes.uv === undefined ) geometry.addAttribute('uv', new Float32BufferAttribute(coords, 2));
	if (geometry.attributes.uv === undefined) geometry.setAttribute('uv', new Float32BufferAttribute(coords, 2));

	let makeSphereUVs = function (v0, v1, v2) {

		//pre-rotate the model so that cube sides match world axis
		v0.applyMatrix4(transformMatrix);
		v1.applyMatrix4(transformMatrix);
		v2.applyMatrix4(transformMatrix);

		let invTwoPi = 1 / (2.0 * Math.PI);
		let invPi = 1 / Math.PI;

		v0.normalize();
		v1.normalize();
		v2.normalize();

		return {
			uv0: new Vector2(.5 - Math.atan(v0.z, - v0.x) * invTwoPi, .5 - Math.asin(v0.y) * invPi),
			uv1: new Vector2(.5 - Math.atan(v1.z, - v1.x) * invTwoPi, .5 - Math.asin(v1.y) * invPi),
			uv2: new Vector2(.5 - Math.atan(v2.z, - v2.x) * invTwoPi, .5 - Math.asin(v2.y) * invPi),
		};

	};



	//maps 3 verts of 1 face on the better side of the cube
	//side of the cube can be XY, XZ or YZ
	let makeCubeUVs = function (v0, v1, v2) {

		//pre-rotate the model so that cube sides match world axis
		v0.applyMatrix4(transformMatrix);
		v1.applyMatrix4(transformMatrix);
		v2.applyMatrix4(transformMatrix);

		//get normal of the face, to know into which cube side it maps better
		let n = new Vector3();
		n.crossVectors(v1.clone().sub(v0), v1.clone().sub(v2)).normalize();
		if (n.x < 0 || n.y < 0 || n.z < 0);

		n.x = Math.abs(n.x);
		n.y = Math.abs(n.y);
		n.z = Math.abs(n.z);

		let uv0 = new Vector2();
		let uv1 = new Vector2();
		let uv2 = new Vector2();
		let max = 1 / boxSize;


		// xz mapping
		if (n.y > n.x && n.y > n.z) {

			uv0.set(v0.x - uvBbox.min.x, uvBbox.max.z - v0.z).multiplyScalar(max);
			uv1.set(v1.x - uvBbox.min.x, uvBbox.max.z - v1.z).multiplyScalar(max);
			uv2.set(v2.x - uvBbox.min.x, uvBbox.max.z - v2.z).multiplyScalar(max);

		} else if (n.x > n.y && n.x > n.z) {

			uv0.set(v0.z - uvBbox.min.z, v0.y - uvBbox.min.y).multiplyScalar(max);
			uv1.set(v1.z - uvBbox.min.z, v1.y - uvBbox.min.y).multiplyScalar(max);
			uv2.set(v2.z - uvBbox.min.z, v2.y - uvBbox.min.y).multiplyScalar(max);

		} else if (n.z > n.y && n.z > n.x) {

			uv0.set(v0.x - uvBbox.min.x, v0.y - uvBbox.min.y).multiplyScalar(max);
			uv1.set(v1.x - uvBbox.min.x, v1.y - uvBbox.min.y).multiplyScalar(max);
			uv2.set(v2.x - uvBbox.min.x, v2.y - uvBbox.min.y).multiplyScalar(max);

		}

		return { uv0: uv0, uv1: uv1, uv2: uv2 }
	};



	let i, id0, id1, id2, uvs;
	let v0 = new Vector3();
	let v1 = new Vector3();
	let v2 = new Vector3();

	new Vector3();
	new Vector3();
	new Vector3();

	const positionAttribute = geometry.getAttribute('position');
	geometry.getAttribute('normal');

	if (geometry.index) { // is it indexed buffer geometry

		for (i = 0; i < geometry.index.count; i += 3) {

			//console.log('is index')

			//n = i*3;
			id0 = geometry.index.getX(i + 0);
			id1 = geometry.index.getX(i + 1);
			id2 = geometry.index.getX(i + 2);

			v0.fromBufferAttribute(positionAttribute, id0);
			v1.fromBufferAttribute(positionAttribute, id1);
			v2.fromBufferAttribute(positionAttribute, id2);

			/*nn0.fromBufferAttribute( normalAttribute, id0 );
			nn1.fromBufferAttribute( normalAttribute, id1 );
			nn2.fromBufferAttribute( normalAttribute, id2 )*/



			if (type === 'sphere') uvs = makeSphereUVs(v0, v1, v2);
			else uvs = makeCubeUVs(v0, v1, v2);

			coords[2 * id0] = uvs.uv0.x;
			coords[2 * id0 + 1] = uvs.uv0.y;

			coords[2 * id1] = uvs.uv1.x;
			coords[2 * id1 + 1] = uvs.uv1.y;

			coords[2 * id2] = uvs.uv2.x;
			coords[2 * id2 + 1] = uvs.uv2.y;
		}
	} else {

		for (i = 0; i < positionAttribute.count; i += 3) {

			v0.fromBufferAttribute(positionAttribute, i + 0);
			v1.fromBufferAttribute(positionAttribute, i + 1);
			v2.fromBufferAttribute(positionAttribute, i + 2);

			if (type === 'sphere') uvs = makeSphereUVs(v0, v1, v2);
			else uvs = makeCubeUVs(v0, v1, v2);

			let idx0 = i;//vi / 3;
			let idx1 = i + 1;//idx0 + 1;
			let idx2 = i + 2;//idx0 + 2;

			coords[2 * idx0] = uvs.uv0.x;
			coords[2 * idx0 + 1] = uvs.uv0.y;

			coords[2 * idx1] = uvs.uv1.x;
			coords[2 * idx1 + 1] = uvs.uv1.y;

			coords[2 * idx2] = uvs.uv2.x;
			coords[2 * idx2 + 1] = uvs.uv2.y;
		}

	}

	geometry.attributes.uv.array = new Float32Array(coords);
	geometry.attributes.uv.needsUpdate = true;

}

/**
 * Ported from: https://github.com/maurizzzio/quickhull3d/ by Mauricio Poppe (https://github.com/maurizzzio)
 */

const Visible = 0;
const Deleted = 1;

const _v1$1 = new Vector3();
const _line3 = new Line3();
const _plane = new Plane();
const _closestPoint = new Vector3();
const _triangle = new Triangle();

class ConvexHull {

	constructor() {

		this.tolerance = - 1;

		this.faces = []; // the generated faces of the convex hull
		this.newFaces = []; // this array holds the faces that are generated within a single iteration

		// the vertex lists work as follows:
		//
		// let 'a' and 'b' be 'Face' instances
		// let 'v' be points wrapped as instance of 'Vertex'
		//
		//     [v, v, ..., v, v, v, ...]
		//      ^             ^
		//      |             |
		//  a.outside     b.outside
		//
		this.assigned = new VertexList();
		this.unassigned = new VertexList();

		this.vertices = []; 	// vertices of the hull (internal representation of given geometry data)

	}

	setFromPoints(points) {

		// The algorithm needs at least four points.

		if (points.length >= 4) {

			this.makeEmpty();

			for (let i = 0, l = points.length; i < l; i++) {

				this.vertices.push(new VertexNode(points[i]));

			}

			this.compute();

		}

		return this;

	}

	setFromObject(object) {

		const points = [];

		object.updateMatrixWorld(true);

		object.traverse(function (node) {

			const geometry = node.geometry;

			if (geometry !== undefined) {

				const attribute = geometry.attributes.position;

				if (attribute !== undefined) {

					for (let i = 0, l = attribute.count; i < l; i++) {

						const point = new Vector3();

						point.fromBufferAttribute(attribute, i).applyMatrix4(node.matrixWorld);

						points.push(point);

					}

				}

			}

		});

		return this.setFromPoints(points);

	}

	containsPoint(point) {

		const faces = this.faces;

		for (let i = 0, l = faces.length; i < l; i++) {

			const face = faces[i];

			// compute signed distance and check on what half space the point lies

			if (face.distanceToPoint(point) > this.tolerance) return false;

		}

		return true;

	}

	intersectRay(ray, target) {

		// based on "Fast Ray-Convex Polyhedron Intersection" by Eric Haines, GRAPHICS GEMS II

		const faces = this.faces;

		let tNear = - Infinity;
		let tFar = Infinity;

		for (let i = 0, l = faces.length; i < l; i++) {

			const face = faces[i];

			// interpret faces as planes for the further computation

			const vN = face.distanceToPoint(ray.origin);
			const vD = face.normal.dot(ray.direction);

			// if the origin is on the positive side of a plane (so the plane can "see" the origin) and
			// the ray is turned away or parallel to the plane, there is no intersection

			if (vN > 0 && vD >= 0) return null;

			// compute the distance from the ray’s origin to the intersection with the plane

			const t = (vD !== 0) ? (- vN / vD) : 0;

			// only proceed if the distance is positive. a negative distance means the intersection point
			// lies "behind" the origin

			if (t <= 0) continue;

			// now categorized plane as front-facing or back-facing

			if (vD > 0) {

				// plane faces away from the ray, so this plane is a back-face

				tFar = Math.min(t, tFar);

			} else {

				// front-face

				tNear = Math.max(t, tNear);

			}

			if (tNear > tFar) {

				// if tNear ever is greater than tFar, the ray must miss the convex hull

				return null;

			}

		}

		// evaluate intersection point

		// always try tNear first since its the closer intersection point

		if (tNear !== - Infinity) {

			ray.at(tNear, target);

		} else {

			ray.at(tFar, target);

		}

		return target;

	}

	intersectsRay(ray) {

		return this.intersectRay(ray, _v1$1) !== null;

	}

	makeEmpty() {

		this.faces = [];
		this.vertices = [];

		return this;

	}

	// Adds a vertex to the 'assigned' list of vertices and assigns it to the given face

	addVertexToFace(vertex, face) {

		vertex.face = face;

		if (face.outside === null) {

			this.assigned.append(vertex);

		} else {

			this.assigned.insertBefore(face.outside, vertex);

		}

		face.outside = vertex;

		return this;

	}

	// Removes a vertex from the 'assigned' list of vertices and from the given face

	removeVertexFromFace(vertex, face) {

		if (vertex === face.outside) {

			// fix face.outside link

			if (vertex.next !== null && vertex.next.face === face) {

				// face has at least 2 outside vertices, move the 'outside' reference

				face.outside = vertex.next;

			} else {

				// vertex was the only outside vertex that face had

				face.outside = null;

			}

		}

		this.assigned.remove(vertex);

		return this;

	}

	// Removes all the visible vertices that a given face is able to see which are stored in the 'assigned' vertex list

	removeAllVerticesFromFace(face) {

		if (face.outside !== null) {

			// reference to the first and last vertex of this face

			const start = face.outside;
			let end = face.outside;

			while (end.next !== null && end.next.face === face) {

				end = end.next;

			}

			this.assigned.removeSubList(start, end);

			// fix references

			start.prev = end.next = null;
			face.outside = null;

			return start;

		}

	}

	// Removes all the visible vertices that 'face' is able to see

	deleteFaceVertices(face, absorbingFace) {

		const faceVertices = this.removeAllVerticesFromFace(face);

		if (faceVertices !== undefined) {

			if (absorbingFace === undefined) {

				// mark the vertices to be reassigned to some other face

				this.unassigned.appendChain(faceVertices);


			} else {

				// if there's an absorbing face try to assign as many vertices as possible to it

				let vertex = faceVertices;

				do {

					// we need to buffer the subsequent vertex at this point because the 'vertex.next' reference
					// will be changed by upcoming method calls

					const nextVertex = vertex.next;

					const distance = absorbingFace.distanceToPoint(vertex.point);

					// check if 'vertex' is able to see 'absorbingFace'

					if (distance > this.tolerance) {

						this.addVertexToFace(vertex, absorbingFace);

					} else {

						this.unassigned.append(vertex);

					}

					// now assign next vertex

					vertex = nextVertex;

				} while (vertex !== null);

			}

		}

		return this;

	}

	// Reassigns as many vertices as possible from the unassigned list to the new faces

	resolveUnassignedPoints(newFaces) {

		if (this.unassigned.isEmpty() === false) {

			let vertex = this.unassigned.first();

			do {

				// buffer 'next' reference, see .deleteFaceVertices()

				const nextVertex = vertex.next;

				let maxDistance = this.tolerance;

				let maxFace = null;

				for (let i = 0; i < newFaces.length; i++) {

					const face = newFaces[i];

					if (face.mark === Visible) {

						const distance = face.distanceToPoint(vertex.point);

						if (distance > maxDistance) {

							maxDistance = distance;
							maxFace = face;

						}

						if (maxDistance > 1000 * this.tolerance) break;

					}

				}

				// 'maxFace' can be null e.g. if there are identical vertices

				if (maxFace !== null) {

					this.addVertexToFace(vertex, maxFace);

				}

				vertex = nextVertex;

			} while (vertex !== null);

		}

		return this;

	}

	// Computes the extremes of a simplex which will be the initial hull

	computeExtremes() {

		const min = new Vector3();
		const max = new Vector3();

		const minVertices = [];
		const maxVertices = [];

		// initially assume that the first vertex is the min/max

		for (let i = 0; i < 3; i++) {

			minVertices[i] = maxVertices[i] = this.vertices[0];

		}

		min.copy(this.vertices[0].point);
		max.copy(this.vertices[0].point);

		// compute the min/max vertex on all six directions

		for (let i = 0, l = this.vertices.length; i < l; i++) {

			const vertex = this.vertices[i];
			const point = vertex.point;

			// update the min coordinates

			for (let j = 0; j < 3; j++) {

				if (point.getComponent(j) < min.getComponent(j)) {

					min.setComponent(j, point.getComponent(j));
					minVertices[j] = vertex;

				}

			}

			// update the max coordinates

			for (let j = 0; j < 3; j++) {

				if (point.getComponent(j) > max.getComponent(j)) {

					max.setComponent(j, point.getComponent(j));
					maxVertices[j] = vertex;

				}

			}

		}

		// use min/max vectors to compute an optimal epsilon

		this.tolerance = 3 * Number.EPSILON * (
			Math.max(Math.abs(min.x), Math.abs(max.x)) +
			Math.max(Math.abs(min.y), Math.abs(max.y)) +
			Math.max(Math.abs(min.z), Math.abs(max.z))
		);

		return { min: minVertices, max: maxVertices };

	}

	// Computes the initial simplex assigning to its faces all the points
	// that are candidates to form part of the hull

	computeInitialHull() {

		const vertices = this.vertices;
		const extremes = this.computeExtremes();
		const min = extremes.min;
		const max = extremes.max;

		// 1. Find the two vertices 'v0' and 'v1' with the greatest 1d separation
		// (max.x - min.x)
		// (max.y - min.y)
		// (max.z - min.z)

		let maxDistance = 0;
		let index = 0;

		for (let i = 0; i < 3; i++) {

			const distance = max[i].point.getComponent(i) - min[i].point.getComponent(i);

			if (distance > maxDistance) {

				maxDistance = distance;
				index = i;

			}

		}

		const v0 = min[index];
		const v1 = max[index];
		let v2;
		let v3;

		// 2. The next vertex 'v2' is the one farthest to the line formed by 'v0' and 'v1'

		maxDistance = 0;
		_line3.set(v0.point, v1.point);

		for (let i = 0, l = this.vertices.length; i < l; i++) {

			const vertex = vertices[i];

			if (vertex !== v0 && vertex !== v1) {

				_line3.closestPointToPoint(vertex.point, true, _closestPoint);

				const distance = _closestPoint.distanceToSquared(vertex.point);

				if (distance > maxDistance) {

					maxDistance = distance;
					v2 = vertex;

				}

			}

		}

		// 3. The next vertex 'v3' is the one farthest to the plane 'v0', 'v1', 'v2'

		maxDistance = - 1;
		_plane.setFromCoplanarPoints(v0.point, v1.point, v2.point);

		for (let i = 0, l = this.vertices.length; i < l; i++) {

			const vertex = vertices[i];

			if (vertex !== v0 && vertex !== v1 && vertex !== v2) {

				const distance = Math.abs(_plane.distanceToPoint(vertex.point));

				if (distance > maxDistance) {

					maxDistance = distance;
					v3 = vertex;

				}

			}

		}

		const faces = [];

		if (_plane.distanceToPoint(v3.point) < 0) {

			// the face is not able to see the point so 'plane.normal' is pointing outside the tetrahedron

			faces.push(
				Face.create(v0, v1, v2),
				Face.create(v3, v1, v0),
				Face.create(v3, v2, v1),
				Face.create(v3, v0, v2)
			);

			// set the twin edge

			for (let i = 0; i < 3; i++) {

				const j = (i + 1) % 3;

				// join face[ i ] i > 0, with the first face

				faces[i + 1].getEdge(2).setTwin(faces[0].getEdge(j));

				// join face[ i ] with face[ i + 1 ], 1 <= i <= 3

				faces[i + 1].getEdge(1).setTwin(faces[j + 1].getEdge(0));

			}

		} else {

			// the face is able to see the point so 'plane.normal' is pointing inside the tetrahedron

			faces.push(
				Face.create(v0, v2, v1),
				Face.create(v3, v0, v1),
				Face.create(v3, v1, v2),
				Face.create(v3, v2, v0)
			);

			// set the twin edge

			for (let i = 0; i < 3; i++) {

				const j = (i + 1) % 3;

				// join face[ i ] i > 0, with the first face

				faces[i + 1].getEdge(2).setTwin(faces[0].getEdge((3 - i) % 3));

				// join face[ i ] with face[ i + 1 ]

				faces[i + 1].getEdge(0).setTwin(faces[j + 1].getEdge(1));

			}

		}

		// the initial hull is the tetrahedron

		for (let i = 0; i < 4; i++) {

			this.faces.push(faces[i]);

		}

		// initial assignment of vertices to the faces of the tetrahedron

		for (let i = 0, l = vertices.length; i < l; i++) {

			const vertex = vertices[i];

			if (vertex !== v0 && vertex !== v1 && vertex !== v2 && vertex !== v3) {

				maxDistance = this.tolerance;
				let maxFace = null;

				for (let j = 0; j < 4; j++) {

					const distance = this.faces[j].distanceToPoint(vertex.point);

					if (distance > maxDistance) {

						maxDistance = distance;
						maxFace = this.faces[j];

					}

				}

				if (maxFace !== null) {

					this.addVertexToFace(vertex, maxFace);

				}

			}

		}

		return this;

	}

	// Removes inactive faces

	reindexFaces() {

		const activeFaces = [];

		for (let i = 0; i < this.faces.length; i++) {

			const face = this.faces[i];

			if (face.mark === Visible) {

				activeFaces.push(face);

			}

		}

		this.faces = activeFaces;

		return this;

	}

	// Finds the next vertex to create faces with the current hull

	nextVertexToAdd() {

		// if the 'assigned' list of vertices is empty, no vertices are left. return with 'undefined'

		if (this.assigned.isEmpty() === false) {

			let eyeVertex, maxDistance = 0;

			// grap the first available face and start with the first visible vertex of that face

			const eyeFace = this.assigned.first().face;
			let vertex = eyeFace.outside;

			// now calculate the farthest vertex that face can see

			do {

				const distance = eyeFace.distanceToPoint(vertex.point);

				if (distance > maxDistance) {

					maxDistance = distance;
					eyeVertex = vertex;

				}

				vertex = vertex.next;

			} while (vertex !== null && vertex.face === eyeFace);

			return eyeVertex;

		}

	}

	// Computes a chain of half edges in CCW order called the 'horizon'.
	// For an edge to be part of the horizon it must join a face that can see
	// 'eyePoint' and a face that cannot see 'eyePoint'.

	computeHorizon(eyePoint, crossEdge, face, horizon) {

		// moves face's vertices to the 'unassigned' vertex list

		this.deleteFaceVertices(face);

		face.mark = Deleted;

		let edge;

		if (crossEdge === null) {

			edge = crossEdge = face.getEdge(0);

		} else {

			// start from the next edge since 'crossEdge' was already analyzed
			// (actually 'crossEdge.twin' was the edge who called this method recursively)

			edge = crossEdge.next;

		}

		do {

			const twinEdge = edge.twin;
			const oppositeFace = twinEdge.face;

			if (oppositeFace.mark === Visible) {

				if (oppositeFace.distanceToPoint(eyePoint) > this.tolerance) {

					// the opposite face can see the vertex, so proceed with next edge

					this.computeHorizon(eyePoint, twinEdge, oppositeFace, horizon);

				} else {

					// the opposite face can't see the vertex, so this edge is part of the horizon

					horizon.push(edge);

				}

			}

			edge = edge.next;

		} while (edge !== crossEdge);

		return this;

	}

	// Creates a face with the vertices 'eyeVertex.point', 'horizonEdge.tail' and 'horizonEdge.head' in CCW order

	addAdjoiningFace(eyeVertex, horizonEdge) {

		// all the half edges are created in ccw order thus the face is always pointing outside the hull

		const face = Face.create(eyeVertex, horizonEdge.tail(), horizonEdge.head());

		this.faces.push(face);

		// join face.getEdge( - 1 ) with the horizon's opposite edge face.getEdge( - 1 ) = face.getEdge( 2 )

		face.getEdge(- 1).setTwin(horizonEdge.twin);

		return face.getEdge(0); // the half edge whose vertex is the eyeVertex


	}

	//  Adds 'horizon.length' faces to the hull, each face will be linked with the
	//  horizon opposite face and the face on the left/right

	addNewFaces(eyeVertex, horizon) {

		this.newFaces = [];

		let firstSideEdge = null;
		let previousSideEdge = null;

		for (let i = 0; i < horizon.length; i++) {

			const horizonEdge = horizon[i];

			// returns the right side edge

			const sideEdge = this.addAdjoiningFace(eyeVertex, horizonEdge);

			if (firstSideEdge === null) {

				firstSideEdge = sideEdge;

			} else {

				// joins face.getEdge( 1 ) with previousFace.getEdge( 0 )

				sideEdge.next.setTwin(previousSideEdge);

			}

			this.newFaces.push(sideEdge.face);
			previousSideEdge = sideEdge;

		}

		// perform final join of new faces

		firstSideEdge.next.setTwin(previousSideEdge);

		return this;

	}

	// Adds a vertex to the hull

	addVertexToHull(eyeVertex) {

		const horizon = [];

		this.unassigned.clear();

		// remove 'eyeVertex' from 'eyeVertex.face' so that it can't be added to the 'unassigned' vertex list

		this.removeVertexFromFace(eyeVertex, eyeVertex.face);

		this.computeHorizon(eyeVertex.point, null, eyeVertex.face, horizon);

		this.addNewFaces(eyeVertex, horizon);

		// reassign 'unassigned' vertices to the new faces

		this.resolveUnassignedPoints(this.newFaces);

		return this;

	}

	cleanup() {

		this.assigned.clear();
		this.unassigned.clear();
		this.newFaces = [];

		return this;

	}

	compute() {

		let vertex;

		this.computeInitialHull();

		// add all available vertices gradually to the hull

		while ((vertex = this.nextVertexToAdd()) !== undefined) {

			this.addVertexToHull(vertex);

		}

		this.reindexFaces();

		this.cleanup();

		return this;

	}

}

//

class Face {

	constructor() {

		this.normal = new Vector3();
		this.midpoint = new Vector3();
		this.area = 0;

		this.constant = 0; // signed distance from face to the origin
		this.outside = null; // reference to a vertex in a vertex list this face can see
		this.mark = Visible;
		this.edge = null;

	}

	static create(a, b, c) {

		const face = new Face();

		const e0 = new HalfEdge(a, face);
		const e1 = new HalfEdge(b, face);
		const e2 = new HalfEdge(c, face);

		// join edges

		e0.next = e2.prev = e1;
		e1.next = e0.prev = e2;
		e2.next = e1.prev = e0;

		// main half edge reference

		face.edge = e0;

		return face.compute();

	}

	getEdge(i) {

		let edge = this.edge;

		while (i > 0) {

			edge = edge.next;
			i--;

		}

		while (i < 0) {

			edge = edge.prev;
			i++;

		}

		return edge;

	}

	compute() {

		const a = this.edge.tail();
		const b = this.edge.head();
		const c = this.edge.next.head();

		_triangle.set(a.point, b.point, c.point);

		_triangle.getNormal(this.normal);
		_triangle.getMidpoint(this.midpoint);
		this.area = _triangle.getArea();

		this.constant = this.normal.dot(this.midpoint);

		return this;

	}

	distanceToPoint(point) {

		return this.normal.dot(point) - this.constant;

	}

}

// Entity for a Doubly-Connected Edge List (DCEL).

class HalfEdge {


	constructor(vertex, face) {

		this.vertex = vertex;
		this.prev = null;
		this.next = null;
		this.twin = null;
		this.face = face;

	}

	head() {

		return this.vertex;

	}

	tail() {

		return this.prev ? this.prev.vertex : null;

	}

	length() {

		const head = this.head();
		const tail = this.tail();

		if (tail !== null) {

			return tail.point.distanceTo(head.point);

		}

		return - 1;

	}

	lengthSquared() {

		const head = this.head();
		const tail = this.tail();

		if (tail !== null) {

			return tail.point.distanceToSquared(head.point);

		}

		return - 1;

	}

	setTwin(edge) {

		this.twin = edge;
		edge.twin = this;

		return this;

	}

}

// A vertex as a double linked list node.

class VertexNode {

	constructor(point) {

		this.point = point;
		this.prev = null;
		this.next = null;
		this.face = null; // the face that is able to see this vertex

	}

}

// A double linked list that contains vertex nodes.

class VertexList {

	constructor() {

		this.head = null;
		this.tail = null;

	}

	first() {

		return this.head;

	}

	last() {

		return this.tail;

	}

	clear() {

		this.head = this.tail = null;

		return this;

	}

	// Inserts a vertex before the target vertex

	insertBefore(target, vertex) {

		vertex.prev = target.prev;
		vertex.next = target;

		if (vertex.prev === null) {

			this.head = vertex;

		} else {

			vertex.prev.next = vertex;

		}

		target.prev = vertex;

		return this;

	}

	// Inserts a vertex after the target vertex

	insertAfter(target, vertex) {

		vertex.prev = target;
		vertex.next = target.next;

		if (vertex.next === null) {

			this.tail = vertex;

		} else {

			vertex.next.prev = vertex;

		}

		target.next = vertex;

		return this;

	}

	// Appends a vertex to the end of the linked list

	append(vertex) {

		if (this.head === null) {

			this.head = vertex;

		} else {

			this.tail.next = vertex;

		}

		vertex.prev = this.tail;
		vertex.next = null; // the tail has no subsequent vertex

		this.tail = vertex;

		return this;

	}

	// Appends a chain of vertices where 'vertex' is the head.

	appendChain(vertex) {

		if (this.head === null) {

			this.head = vertex;

		} else {

			this.tail.next = vertex;

		}

		vertex.prev = this.tail;

		// ensure that the 'tail' reference points to the last vertex of the chain

		while (vertex.next !== null) {

			vertex = vertex.next;

		}

		this.tail = vertex;

		return this;

	}

	// Removes a vertex from the linked list

	remove(vertex) {

		if (vertex.prev === null) {

			this.head = vertex.next;

		} else {

			vertex.prev.next = vertex.next;

		}

		if (vertex.next === null) {

			this.tail = vertex.prev;

		} else {

			vertex.next.prev = vertex.prev;

		}

		return this;

	}

	// Removes a list of vertices whose 'head' is 'a' and whose 'tail' is b

	removeSubList(a, b) {

		if (a.prev === null) {

			this.head = b.next;

		} else {

			a.prev.next = b.next;

		}

		if (b.next === null) {

			this.tail = a.prev;

		} else {

			b.next.prev = a.prev;

		}

		return this;

	}

	isEmpty() {

		return this.head === null;

	}

}

class ConvexGeometry extends BufferGeometry {

	constructor(points = []) {

		super();

		// buffers

		const vertices = [];
		const normals = [];

		const convexHull = new ConvexHull().setFromPoints(points);

		// generate vertices and normals

		const faces = convexHull.faces;

		for (let i = 0; i < faces.length; i++) {

			const face = faces[i];
			let edge = face.edge;

			// we move along a doubly-connected edge list to access all face points (see HalfEdge docs)

			do {

				const point = edge.head().point;

				vertices.push(point.x, point.y, point.z);
				normals.push(face.normal.x, face.normal.y, face.normal.z);

				edge = edge.next;

			} while (edge !== face.edge);

		}

		// build geometry

		this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
		this.setAttribute('normal', new Float32BufferAttribute(normals, 3));

	}

}

class CapsuleHelper extends Object3D {

	constructor(r, h, useDir, material, c1 = [0, 1, 0], c2 = [0, 0.5, 0], full = false) {

		super();

		//this.light = light;

		//this.matrix = light.matrixWorld;
		this.matrixAutoUpdate = false;

		this.type = 'CapsuleHelper';

		const geometry = new BufferGeometry();

		let py = (h * 0.5) - r;
		let side = 32;
		let dir = r * 0.2;

		let colors = [];

		const positions = [
			r, py, 0, r, -py, 0,
			-r, py, 0, -r, -py, 0,
			0, py, r - dir, 0, py, r + dir,
		];

		colors.push(
			...c1, ...c2,
			...c1, ...c2,
			...c2, ...c2
		);

		if (full) {
			positions.push(
				0, py, r, 0, -py, r,
				0, py, -r, 0, -py, -r
			);
			colors.push(
				...c1, ...c2,
				...c1, ...c2,
			);
		}


		// circle top / bottom

		for (let i = 0, j = 1; i < side; i++, j++) {

			const p1 = (i / side) * Math.PI * 2;
			const p2 = (j / side) * Math.PI * 2;

			positions.push(
				r * Math.cos(p1), py, r * Math.sin(p1),
				r * Math.cos(p2), py, r * Math.sin(p2),

				r * Math.cos(p1), -py, r * Math.sin(p1),
				r * Math.cos(p2), -py, r * Math.sin(p2),
			);

			colors.push(
				...c1, ...c1,
				...c2, ...c2,
			);

		}

		// circle start / end

		for (let i = 0, j = 1; i < side; i++, j++) {

			const p1 = (i / side) * Math.PI * 2;
			const p2 = (j / side) * Math.PI * 2;

			let s = j <= side * 0.5 ? 1 : -1;

			positions.push(
				r * Math.cos(p1), py * s + r * Math.sin(p1), 0,
				r * Math.cos(p2), py * s + r * Math.sin(p2), 0,
			);

			if (s === 1) colors.push(...c1, ...c1);
			else colors.push(...c2, ...c2);

			if (full) {
				positions.push(
					0, py * s + r * Math.sin(p1), r * Math.cos(p1),
					0, py * s + r * Math.sin(p2), r * Math.cos(p2),
				);
				if (s === 1) colors.push(...c1, ...c1);
				else colors.push(...c2, ...c2);
			}

		}

		geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
		geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

		//const material = new LineBasicMaterial( { color:0x00ff00, fog: false, toneMapped: false } );

		this.cone = new LineSegments(geometry, material);
		this.cone.raycast = function () { return };
		this.add(this.cone);

		if (!useDir) return

		const geometry2 = new BufferGeometry();

		const positions2 = [
			dir * 0.5, -py, r - dir, dir * 0.5, -py, r + dir,
			-dir * 0.5, -py, r - dir, -dir * 0.5, -py, r + dir,
			dir * 0.5, -py, r - dir, -dir * 0.5, -py, r - dir,

			-dir * 0.5, -py, r + dir, -dir, -py, r + dir,
			dir * 0.5, -py, r + dir, dir, -py, r + dir,

			-dir, -py, r + dir, 0, -py, r + dir * 2,
			dir, -py, r + dir, 0, -py, r + dir * 2,
		];

		colors = [];
		let cc = positions2.length / 3;
		while (cc--) {
			colors.push(1, 0, 0);
		}

		geometry2.setAttribute('position', new Float32BufferAttribute(positions2, 3));
		geometry2.setAttribute('color', new Float32BufferAttribute(colors, 3));

		//const material2 = new LineBasicMaterial( { color:0xFF0000, fog: false, toneMapped: false } );

		this.direction = new LineSegments(geometry2, material);
		this.direction.raycast = function () { return };
		this.add(this.direction);

	}

	setDirection(r) {

		if (!this.direction) return
		this.direction.rotation.y = r;

	}

	dispose() {

		this.cone.geometry.dispose();
		//this.cone.material.dispose();

		if (this.direction) {
			this.direction.geometry.dispose();
			//this.direction.material.dispose();
		}

	}

	raycast() {
		return
	}

	update() {

		/*this.light.updateWorldMatrix( true, false );
		this.light.target.updateWorldMatrix( true, false );

		const coneLength = this.light.distance ? this.light.distance : 1000;
		const coneWidth = coneLength * Math.tan( this.light.angle );

		this.cone.scale.set( coneWidth, coneWidth, coneLength );

		_vector.setFromMatrixPosition( this.light.target.matrixWorld );

		this.cone.lookAt( _vector );*/

		/*if ( this.color !== undefined ) {

			this.cone.material.color.set( this.color );

		} else {

			this.cone.material.color.copy( this.light.color );

		}*/

	}

}

// THREE BODY

class Body extends Item {

	constructor() {

		super();

		this.Utils = Utils;
		this.type = 'body';
		this.num = Num[this.type];
		this.full = false;
		this.extraConvex = false;
		this.needMatrix = root.engine === 'RAPIER' || root.engine === 'HAVOK';
		//this.tmpVolume = 0

	}

	setFull(full) {
		this.num = Num[full ? 'bodyFull' : 'body'];
		this.full = full;
	}

	step() {

		const AR = root.Ar;
		const N = root.ArPos[this.type];

		const list = this.list;
		let i = list.length, b, n, a;

		while (i--) {

			b = list[i];

			if (b === null) continue

			n = N + (i * this.num);

			// update only when physics actif
			if (!b.actif) {
				a = AR[n + 0] + AR[n + 1] + AR[n + 2] + AR[n + 3] + AR[n + 4] + AR[n + 5] + AR[n + 6] + AR[n + 7];
				if (a === 0) continue
				else b.actif = true;
			}

			// test is object sleep
			b.sleep = AR[n] > 0 ? false : true;

			// update default material
			if (b.defMat) {

				if (b.isInstance) {
					b.instance.setColorAt(b.id, b.sleep ? Colors.sleep : Colors.body);
				} else {
					if (!b.sleep && b.material.name === 'sleep') b.material = Mat.get('body');
					if (b.sleep && b.material.name === 'body') b.material = Mat.get('sleep');
				}

			}

			if (b.sleep && !b.isKinematic) continue

			// update position / rotation / velocity

			if (b.isInstance) {
				if (b.speedMat) b.instance.setColorAt(b.id, [Math.abs(AR[n + 8]) * 0.5, Math.abs(AR[n + 9]) * 0.5, Math.abs(AR[n + 10]) * 0.5]);
				b.instance.setTransformAt(b.id, [AR[n + 1], AR[n + 2], AR[n + 3]], [AR[n + 4], AR[n + 5], AR[n + 6], AR[n + 7]], b.noScale ? [1, 1, 1] : b.size);
				b.position = { x: AR[n + 1], y: AR[n + 2], z: AR[n + 3] };
				///b.quaternion = {x:AR[n+4], y:AR[n+5], z:AR[n+6], w:AR[n+7]}
				b.quaternion = { _x: AR[n + 4], _y: AR[n + 5], _z: AR[n + 6], _w: AR[n + 7] };
				if (this.needMatrix) b.matrixWorld.compose(b.position, b.quaternion, { x: 1, y: 1, z: 1 });
				if (this.full) {
					b.velocity = { x: AR[n + 8], y: AR[n + 9], z: AR[n + 10] };
					b.angular = { x: AR[n + 11], y: AR[n + 12], z: AR[n + 13] };
				}
			}
			else {
				b.position.fromArray(AR, n + 1);
				b.quaternion.fromArray(AR, n + 4);
				if (this.full) {
					b.velocity.fromArray(AR, n + 8);
					b.angular.fromArray(AR, n + 11);
				}
				if (!b.auto) b.updateMatrix();
			}
		}

	}

	///

	geometry(o = {}, b = null, material = null) {

		//console.log("geometry is add")

		//console.log( 'geometry', o, b, material)

		let g, i, n, s = o.size, gName = '';
		let t = o.type;
		let noScale = false, unic = false;
		let seg = o.seg || 16;

		//if( o.instance && t!== 'capsule'&& !o.radius) s = o.instanceSize || [1,1,1]

		if (o.instance && t === 'compound') {
			t = o.shapes[0].type;
			s = o.shapes[0].size;
			o.translate = o.shapes[0].pos;
		}

		if (t === 'mesh' || t === 'convex') {
			if (o.shape) {
				if (o.shape.isMesh) o.shape = o.shape.geometry;
			} else {
				if (o.mesh && !o.v) o.shape = o.mesh.geometry;
			}
		}

		if (o.radius) {
			if (!o.breakable) {
				if (t === 'box') t = 'ChamferBox';
				if (t === 'cylinder') t = 'ChamferCyl';
			}
		}

		if (o.geometry) {
			if (t === 'convex') o.shape = o.geometry;
			else t = 'direct';
		}


		if (root.engine === 'PHYSX' && (o.type === 'cylinder' || o.type === 'cone')) {
			// convert geometry to convex if not in physics
			let geom = new CylinderGeometry(o.type === 'cone' ? 0 : o.size[0], o.size[0], o.size[1], seg, 1);//24
			if (o.isWheel) geom.rotateZ(-PI90);
			o.v = MathTool.getVertex(geom);
			o.type = 'convex';

		}

		if (root.engine === 'HAVOK' && o.type === 'cone') {
			// convert geometry to convex if not in physics
			let geom = new CylinderGeometry(o.type === 'cone' ? 0 : o.size[0], o.size[0], o.size[1], seg, 1);//24
			o.v = MathTool.getVertex(geom);
			o.type = 'convex';

		}

		if (o.type === 'stair') {
			o.type = 'box';
			t = 'box';
		}

		switch (t) {

			case 'direct':

				g = o.geometry.clone();
				if (o.size) g.scale(o.size[0], o.size[1], o.size[2]);

				unic = true;
				noScale = true;

				break;

			case 'convex':

				if (o.v) {

					if (o.nogeo) g = new BufferGeometry();
					else {
						let vv = [];
						i = Math.floor(o.v.length / 3);
						while (i--) {
							n = i * 3;
							vv.push(new Vector3(o.v[n], o.v[n + 1], o.v[n + 2]));
						}
						g = new ConvexGeometry(vv);
						//o.v = math.getVertex( g )
						//o.index = math.getIndex( g )
						//console.log(o.v, o.index)
					}
					unic = true;
					noScale = true;
				}

				if (o.shape) {

					g = o.shape.clone();
					if (o.size) g.scale(o.size[0], o.size[0], o.size[0]);
					if (o.shapeScale) g.scale(o.shapeScale[0], o.shapeScale[1], o.shapeScale[2]);
					//o.v = g.attributes.position.array;
					o.v = MathTool.getVertex(g);
					o.index = MathTool.getIndex(g);

					unic = true;
					noScale = true;
				}

				if (!g.boundingBox) g.computeBoundingBox();
				let bx = g.boundingBox;
				o.boxSize = [-bx.min.x + bx.max.x, -bx.min.y + bx.max.y, -bx.min.z + bx.max.z];

				//console.log(g)

				break;

			case 'mesh':

				g = o.shape.clone();
				if (o.size) g.scale(o.size[0], o.size[0], o.size[0]);

				o.v = MathTool.getVertex(g, root.engine === 'OIMO');
				o.index = root.engine === 'OIMO' ? null : MathTool.getIndex(g);

				unic = true;
				noScale = true;

				break;

			case 'highSphere':

				gName = 'highSphere_' + s[0];

				g = Geo.get(gName);
				if (!g) {
					g = new SphereBox(s[0]);
					g.name = gName;
				} else {
					gName = '';
				}
				noScale = true;
				o.type = 'sphere';

				break;

			case 'capsule':

				gName = 'capsule_' + s[0] + '_' + s[1] + '_' + seg;

				g = Geo.get(gName);
				if (!g) {
					//if( o.helper ) g = new CapsuleHelperGeometry( s[ 0 ], s[ 1 ] )
					//else 
					g = new Capsule(s[0], s[1], seg);
					g.name = gName;
				} else {
					gName = '';
				}
				noScale = true;
				break;

			case 'ChamferBox':

				gName = 'ChamferBox_' + s[0] + '_' + s[1] + '_' + s[2] + '_' + o.radius;

				//console.log(s, o.radius)
				g = Geo.get(gName);
				if (!g) {
					g = new ChamferBox(s[0], s[1], s[2], o.radius);
					g.name = gName;
				} else {
					gName = '';
				}
				noScale = true;
				break;

			case 'ChamferCyl':

				gName = 'ChamferCyl_' + s[0] + '_' + s[1] + '_' + s[2] + '_' + o.radius + '_' + seg;



				g = Geo.get(gName);
				if (!g) {
					g = new ChamferCyl(s[0], s[0], s[1], o.radius, seg);
					g.name = gName;
				} else {
					gName = '';
				}
				noScale = true;
				break;

			default:
				if (!o.breakable) g = Geo.get(t); //geo[ t ];
				else {
					g = Geo.get(t).clone();
					g.scale(s[0], s[1], s[2]);
					unic = true;
					noScale = true;
				}
				break;

		}


		if (o.translate) g.translate(o.translate[0], o.translate[1], o.translate[2]);


		// clear untranspherable variable for phy
		if (o.shape) delete o.shape;
		if (o.geometry) delete o.geometry;


		if (g.attributes.uv === undefined || o.autoUV) {
			//console.log(o.shape)
			createUV(g, 'box', 5.0, o.pos, o.quat);
		}


		// reuse complex geometry
		if (gName !== '') Geo.set(g);

		if (o.isWheel) {
			g = g.clone();
			g.rotateZ(-PI90);
			unic = true;
		}

		// unic geometry dispose on reset 
		if (unic) Geo.unic(g);




		if (b === null && material === null) {
			g.noScale = noScale;
			return g
		}

		if (o.meshRemplace && o.debug) material = Mat.get('debug');
		//if( o.helper ) material = Mat.get( 'hide' )

		//if( o.instance ) return

		let m = new Mesh(g, material);

		if (o.button) m.isButton = true;

		//if( o.helper ) m.add( new LineSegments( new CapsuleHelperGeometry( s[ 0 ], s[ 1 ] ),  Mat.get( 'line' ) ))
		if (o.helper) {

			m.add(new CapsuleHelper(s[0], s[1] + (s[0] * 2), false, Mat.get('line'), [0.3, 0.1, 0.0], [0.8, 0.2, 0.0], true));
			//m.material.visible = false

		}

		if (o.localRot) o.localQuat = MathTool.quatFromEuler(o.localRot); //math.toQuatArray( o.localRot )
		if (o.localPos) m.position.fromArray(o.localPos);
		if (o.localQuat) m.quaternion.fromArray(o.localQuat);

		if (!noScale) m.scale.fromArray(o.size);
		//if( unic ) m.unic = true

		// disable raycast
		if (o.ray !== undefined) {
			if (!o.ray) m.raycast = () => { return };
		}

		// add or not add
		if (!o.meshRemplace || o.debug) b.add(m);

	}

	add(o = {}) {

		//this.tmpVolume = 0

		//console.log('add', o.type )

		let i, n, name;

		if (!o.instance) name = this.setName(o);

		o.type = o.type === undefined ? 'box' : o.type;

		if (o.type === 'plane' && !o.visible) o.visible = false;

		if (o.type === 'stair') {

			let v1 = new Vector3(0, 0, o.size[2]);
			let v2 = new Vector3(0, o.size[1] * 0.5, o.size[2] * 0.5);
			let angle = v1.angleTo(v2);
			let dist = v1.distanceTo(v2);
			o.rot = [angle * todeg$1, 0, 0];
			o.size[1] *= o.div || 0.2;
			o.size[2] = dist * 2;

			let p1 = new Vector3(0, -o.size[1] * 0.5, 0);
			p1.applyAxisAngle({ x: 1, y: 0, z: 0 }, angle);
			o.pos[1] += p1.y;
			o.pos[2] += p1.z;
		}

		// change default center of mass 
		if (o.massCenter && root.engine !== 'PHYSX') {
			if (o.type !== 'compound') {
				//o.localPos = o.massCenter
				o.shapes = [{ type: o.type, pos: o.massCenter, size: o.size }];
				if (o.seg) o.shapes[0].seg = o.seg;
				if (o.radius) o.shapes[0].radius = o.radius;
				delete (o.size);
				o.type = 'compound';
			} else {
				for (i = 0; i < o.shapes.length; i++) {
					n = o.shapes[i];
					if (n.pos) n.pos = Utils.vecAdd(n.pos, o.massCenter);
					else n.pos = o.massCenter;
					Geo.unic(n);
				}
			}
		}

		//console.log('add', o.type, )

		// position
		o.pos = o.pos === undefined ? [0, 0, 0] : o.pos;

		// rotation is in degree or Quaternion
		o.quat = o.quat === undefined ? [0, 0, 0, 1] : o.quat;
		if (o.rot !== undefined) { o.quat = MathTool.quatFromEuler(o.rot); delete o.rot; }
		if (o.meshRot !== undefined) { o.meshQuat = MathTool.quatFromEuler(o.meshRot); delete o.meshRot; }
		//if( o.rot !== undefined ){ o.quat =  math.toQuatArray( o.rot ); delete o.rot; }
		//if( o.meshRot !== undefined ){ o.meshQuat = math.toQuatArray( o.meshRot ); delete o.meshRot; }

		//o.size = o.size == undefined ? [ 1, 1, 1 ] : math.correctSize( o.size );
		o.size = MathTool.autoSize(o.size, o.type);
		if (o.meshScale) o.meshScale = MathTool.autoSize(o.meshScale);

		let material, noMat = false;
		//let defMat = false;

		if (o.visible === false) o.material = 'hide';

		if (o.material !== undefined) {
			if (o.material.constructor === String) material = Mat.get(o.material);
			else material = o.material;
		} else {
			noMat = true;
			//defMat = this.type === 'body'
			material = Mat.get(this.type);
			if (o.instance) material = Mat.get('base');
		}

		if (o.unicMat) {
			material = material.clone();
			//root.tmpMat.push( material )
			Mat.addToTmp(material);
		}

		if (o.material) delete o.material;


		//let b = new Basic3D( o.instance )
		let b = o.instance ? {} : new Basic3D();

		if (o.mesh && !o.instance) {

			//if( o.isTerrain ) o.noClone = true
			if (o.mesh.type === 'terrain') o.noClone = true;

			let mm = o.noClone ? o.mesh : o.mesh.clone();

			mm.position.fromArray(o.meshPos || [0, 0, 0]);
			if (o.meshRot) { o.meshQuat = MathTool.quatFromEuler(o.meshRot); delete o.meshRot; }
			//if( o.meshRot ) { o.meshQuat = math.toQuatArray( o.meshRot ); delete o.meshRot; }
			if (o.meshQuat) mm.quaternion.fromArray(o.meshQuat);
			if (o.meshSize) mm.scale.set(1, 1, 1).multiplyScalar(o.meshSize);
			if (o.meshScale) mm.scale.fromArray(o.meshScale);

			if (!noMat) mm.material = material;

			root.tmpMesh.push(mm);

			o.meshRemplace = true;
			b.add(mm);

		}

		switch (o.type) {

			case 'null': break;

			case 'compound':

				for (i = 0; i < o.shapes.length; i++) {

					n = o.shapes[i];

					n.type = n.type === undefined ? 'box' : n.type;
					//n.size = n.size === undefined ? [ 1, 1, 1 ] : math.correctSize( n.size );
					n.size = MathTool.autoSize(n.size, n.type);

					if (n.pos) n.localPos = n.pos;

					if (n.rot !== undefined) { n.quat = MathTool.quatFromEuler(n.rot); delete n.rot; }
					//if( n.rot !== undefined ){ n.quat = math.toQuatArray( n.rot ); delete n.rot; }
					if (n.quat) n.localQuat = n.quat;

					n.debug = o.debug || false;
					n.meshRemplace = o.meshRemplace || false;

					if (!o.instance) this.geometry(n, b, material);
				}

				break;
			default:

				if (!o.instance) this.geometry(o, b, material);

				break;

		}




		b.type = this.type;
		b.size = o.size;
		b.shapetype = o.type;
		b.isKinematic = o.kinematic || false;
		b.link = 0;

		// for buttton only
		if (o.button) b.isButton = true;

		// enable or disable raycast
		b.isRay = true;//b.type === 'body' || b.isButton ? true : false
		if (o.ray !== undefined) b.isRay = o.ray;
		if (!o.instance) b.setRaycast();


		if (!noMat) b.material = material;
		b.defMat = false;

		if (b.material && noMat) b.defMat = b.material.name === 'body';


		//  for instancing
		if (o.instance) {

			b.isInstance = true;
			b.instance = root.instanceMesh[o.instance] || this.addInstance(o, material);
			b.instance.isRay = b.isRay;

			b.defMat = b.instance.material.name === 'base';

			b.id = b.instance.count;
			b.mass = o.mass || 0;

			b.name = b.instance.name + b.id;
			//if( o.name ) b.name = o.name
			o.name = b.name;
			b.noScale = b.instance.noScale;//false//o.type!=='box' || o.type!=='ChamferBox' || o.type!=='sphere';
			if (o.sizeByInstance) b.noScale = false;
			//if(o.type === 'sphere') b.noScale = false
			//if( o.type === 'capsule' ) b.noScale = true
			//if( o.type === 'box' ) b.noScale = true
			//if(o.radius) b.noScale = true

			let color = o.color;
			if (b.defMat) color = o.sleep ? Colors.sleep : Colors.body;

			b.instance.add(o.pos, o.quat, b.noScale ? [1, 1, 1] : b.size, color);

			b.position = { x: o.pos[0], y: o.pos[1], z: o.pos[2] };
			b.quaternion = { _x: o.quat[0], _y: o.quat[1], _z: o.quat[2], _w: o.quat[3] };
			b.velocity = { x: 0, y: 0, z: 0 };
			b.angular = { x: 0, y: 0, z: 0 };
			b.link = 0;
			if (this.needMatrix) b.matrixWorld = new Matrix4();



			// for convex
			if (b.instance.v) o.v = b.instance.v;
			if (b.instance.index) o.index = b.instance.index;
			o.type = b.instance.type;

			//console.log(o.v)

			/*if( this.extraConvex && ( o.type==='cylinder' || o.type==='cone') ){
				o.v = b.instance.v;
				o.type = 'convex';
			}*/


			//console.log( b )

		} else {

			b.name = name;

			if (o.renderOrder) b.renderOrder = o.renderOrder;
			if (o.visible === undefined) o.visible = true;
			if (o.shadow === undefined) o.shadow = o.visible;

			b.visible = o.visible !== undefined ? o.visible : true;
			b.receiveShadow = o.shadow;
			b.castShadow = o.shadow;

			// apply option
			this.set(o, b);

		}

		if (o.instance) delete o.instance;
		if (o.mesh) delete o.mesh;


		if (o.breakable) {

			root.motor.addBreaker();
			let child = b.children[0];
			b.remove(child);
			b = child;
			b.name = name;
			b.type = this.type;
			b.density = o.density;
			b.breakable = true;
			b.breakOption = o.breakOption !== undefined ? o.breakOption : [250, 1, 2, 1];
			//b.userData.mass = o.mass;
		}

		// for skeleton mesh

		/*if( o.bone ){

			b.userData.decal = o.decal;
			b.userData.decalinv = o.decalinv;
			b.userData.bone = o.bone;
		    

			delete o.bone
			delete o.decal
			delete o.decalinv
		}*/

		//o.volume = this.tmpVolume






		// add to world
		this.addToWorld(b, o.id);

		if (o.onlyMakeMesh) return b

		if (o.phySize) o.size = o.phySize;
		if (o.phyPos) o.pos = o.phyPos;

		if (o.parent) delete o.parent;

		// add to physic worker 
		root.post({ m: 'add', o: o });

		//console.log(b)

		return b

	}

	set(o = {}, b = null) {

		if (b === null) b = this.byName(o.name);
		if (b === null) return

		/*if(b.isInstance){

			b.instance.setTransformAt( b.id, o.pos, o.quat, b.noScale ? [1,1,1] : b.size )
			b.position = {x:o.pos[0], y:o.pos[1], z:o.pos[2]}

		}else{*/
		if (o.pos) b.position.fromArray(o.pos);
		if (o.quat) b.quaternion.fromArray(o.quat);

		b.auto = o.auto || false;

		if (!b.auto) {
			b.matrixAutoUpdate = false;
			b.updateMatrix();
		} else {
			b.matrixAutoUpdate = true;
		}
		//}



	}

	addInstance(o, material) {

		//console.log(o)
		if (o.sizeByInstance) o.size = [1, 1, 1];
		let g = this.geometry(o);

		//console.log(g)

		if (o.mesh) {
			g = o.mesh.isObject3D ? o.mesh.geometry.clone() : o.mesh.clone();
			if (o.meshScale) g.scale(o.meshScale[0], o.meshScale[1], o.meshScale[2]);
			g.noScale = true;
		}/* else {
			g = this.geometry( o )
		}*/

		let bb = new Instance(g, material, 0);

		bb.type = o.type;
		bb.noScale = g.noScale;

		//console.log(o)
		if (bb.type === 'convex') bb.v = o.v;
		if (o.index) bb.index = o.index;


		//if( bb.type==='convex' ) bb.v = MathTool.getVertex( bb.geometry )

		//bb.matrixAutoUpdate = false
		//bb.instanceMatrix.setUsage( DynamicDrawUsage )
		bb.receiveShadow = o.shadow !== undefined ? o.shadow : true;
		bb.castShadow = o.shadow !== undefined ? o.shadow : true;

		bb.name = o.instance;
		root.scene.add(bb);
		root.instanceMesh[o.instance] = bb;


		//console.log(bb.name+" is add")

		return bb

	}

}

const COLOR_SPACE_SVG = SRGBColorSpace;

class SVGLoader extends Loader {

	constructor(manager) {

		super(manager);

		// Default dots per inch
		this.defaultDPI = 90;

		// Accepted units: 'mm', 'cm', 'in', 'pt', 'pc', 'px'
		this.defaultUnit = 'px';

	}

	load(url, onLoad, onProgress, onError) {

		const scope = this;

		const loader = new FileLoader(scope.manager);
		loader.setPath(scope.path);
		loader.setRequestHeader(scope.requestHeader);
		loader.setWithCredentials(scope.withCredentials);
		loader.load(url, function (text) {

			try {

				onLoad(scope.parse(text));

			} catch (e) {

				if (onError) {

					onError(e);

				} else {

					console.error(e);

				}

				scope.manager.itemError(url);

			}

		}, onProgress, onError);

	}

	parse(text) {

		const scope = this;

		function parseNode(node, style) {

			if (node.nodeType !== 1) return;

			const transform = getNodeTransform(node);

			let isDefsNode = false;

			let path = null;

			switch (node.nodeName) {

				case 'svg':
					style = parseStyle(node, style);
					break;

				case 'style':
					parseCSSStylesheet(node);
					break;

				case 'g':
					style = parseStyle(node, style);
					break;

				case 'path':
					style = parseStyle(node, style);
					if (node.hasAttribute('d')) path = parsePathNode(node);
					break;

				case 'rect':
					style = parseStyle(node, style);
					path = parseRectNode(node);
					break;

				case 'polygon':
					style = parseStyle(node, style);
					path = parsePolygonNode(node);
					break;

				case 'polyline':
					style = parseStyle(node, style);
					path = parsePolylineNode(node);
					break;

				case 'circle':
					style = parseStyle(node, style);
					path = parseCircleNode(node);
					break;

				case 'ellipse':
					style = parseStyle(node, style);
					path = parseEllipseNode(node);
					break;

				case 'line':
					style = parseStyle(node, style);
					path = parseLineNode(node);
					break;

				case 'defs':
					isDefsNode = true;
					break;

				case 'use':
					style = parseStyle(node, style);

					const href = node.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '';
					const usedNodeId = href.substring(1);
					const usedNode = node.viewportElement.getElementById(usedNodeId);
					if (usedNode) {

						parseNode(usedNode, style);

					} else {

						console.warn('SVGLoader: \'use node\' references non-existent node id: ' + usedNodeId);

					}

					break;
				// console.log( node );

			}

			if (path) {

				if (style.fill !== undefined && style.fill !== 'none') {

					path.color.setStyle(style.fill, COLOR_SPACE_SVG);

				}

				transformPath(path, currentTransform);

				paths.push(path);

				path.userData = { node: node, style: style };

			}

			const childNodes = node.childNodes;

			for (let i = 0; i < childNodes.length; i++) {

				const node = childNodes[i];

				if (isDefsNode && node.nodeName !== 'style' && node.nodeName !== 'defs') {

					// Ignore everything in defs except CSS style definitions
					// and nested defs, because it is OK by the standard to have
					// <style/> there.
					continue;

				}

				parseNode(node, style);

			}


			if (transform) {

				transformStack.pop();

				if (transformStack.length > 0) {

					currentTransform.copy(transformStack[transformStack.length - 1]);

				} else {

					currentTransform.identity();

				}

			}

		}

		function parsePathNode(node) {

			const path = new ShapePath();

			const point = new Vector2();
			const control = new Vector2();

			const firstPoint = new Vector2();
			let isFirstPoint = true;
			let doSetFirstPoint = false;

			const d = node.getAttribute('d');

			if (d === '' || d === 'none') return null;

			// console.log( d );

			const commands = d.match(/[a-df-z][^a-df-z]*/ig);

			for (let i = 0, l = commands.length; i < l; i++) {

				const command = commands[i];

				const type = command.charAt(0);
				const data = command.slice(1).trim();

				if (isFirstPoint === true) {

					doSetFirstPoint = true;
					isFirstPoint = false;

				}

				let numbers;

				switch (type) {

					case 'M':
						numbers = parseFloats(data);
						for (let j = 0, jl = numbers.length; j < jl; j += 2) {

							point.x = numbers[j + 0];
							point.y = numbers[j + 1];
							control.x = point.x;
							control.y = point.y;

							if (j === 0) {

								path.moveTo(point.x, point.y);

							} else {

								path.lineTo(point.x, point.y);

							}

							if (j === 0) firstPoint.copy(point);

						}

						break;

					case 'H':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j++) {

							point.x = numbers[j];
							control.x = point.x;
							control.y = point.y;
							path.lineTo(point.x, point.y);

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'V':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j++) {

							point.y = numbers[j];
							control.x = point.x;
							control.y = point.y;
							path.lineTo(point.x, point.y);

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'L':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j += 2) {

							point.x = numbers[j + 0];
							point.y = numbers[j + 1];
							control.x = point.x;
							control.y = point.y;
							path.lineTo(point.x, point.y);

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'C':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j += 6) {

							path.bezierCurveTo(
								numbers[j + 0],
								numbers[j + 1],
								numbers[j + 2],
								numbers[j + 3],
								numbers[j + 4],
								numbers[j + 5]
							);
							control.x = numbers[j + 2];
							control.y = numbers[j + 3];
							point.x = numbers[j + 4];
							point.y = numbers[j + 5];

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'S':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j += 4) {

							path.bezierCurveTo(
								getReflection(point.x, control.x),
								getReflection(point.y, control.y),
								numbers[j + 0],
								numbers[j + 1],
								numbers[j + 2],
								numbers[j + 3]
							);
							control.x = numbers[j + 0];
							control.y = numbers[j + 1];
							point.x = numbers[j + 2];
							point.y = numbers[j + 3];

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'Q':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j += 4) {

							path.quadraticCurveTo(
								numbers[j + 0],
								numbers[j + 1],
								numbers[j + 2],
								numbers[j + 3]
							);
							control.x = numbers[j + 0];
							control.y = numbers[j + 1];
							point.x = numbers[j + 2];
							point.y = numbers[j + 3];

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'T':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j += 2) {

							const rx = getReflection(point.x, control.x);
							const ry = getReflection(point.y, control.y);
							path.quadraticCurveTo(
								rx,
								ry,
								numbers[j + 0],
								numbers[j + 1]
							);
							control.x = rx;
							control.y = ry;
							point.x = numbers[j + 0];
							point.y = numbers[j + 1];

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'A':
						numbers = parseFloats(data, [3, 4], 7);

						for (let j = 0, jl = numbers.length; j < jl; j += 7) {

							// skip command if start point == end point
							if (numbers[j + 5] == point.x && numbers[j + 6] == point.y) continue;

							const start = point.clone();
							point.x = numbers[j + 5];
							point.y = numbers[j + 6];
							control.x = point.x;
							control.y = point.y;
							parseArcCommand(
								path, numbers[j], numbers[j + 1], numbers[j + 2], numbers[j + 3], numbers[j + 4], start, point
							);

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'm':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j += 2) {

							point.x += numbers[j + 0];
							point.y += numbers[j + 1];
							control.x = point.x;
							control.y = point.y;

							if (j === 0) {

								path.moveTo(point.x, point.y);

							} else {

								path.lineTo(point.x, point.y);

							}

							if (j === 0) firstPoint.copy(point);

						}

						break;

					case 'h':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j++) {

							point.x += numbers[j];
							control.x = point.x;
							control.y = point.y;
							path.lineTo(point.x, point.y);

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'v':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j++) {

							point.y += numbers[j];
							control.x = point.x;
							control.y = point.y;
							path.lineTo(point.x, point.y);

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'l':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j += 2) {

							point.x += numbers[j + 0];
							point.y += numbers[j + 1];
							control.x = point.x;
							control.y = point.y;
							path.lineTo(point.x, point.y);

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'c':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j += 6) {

							path.bezierCurveTo(
								point.x + numbers[j + 0],
								point.y + numbers[j + 1],
								point.x + numbers[j + 2],
								point.y + numbers[j + 3],
								point.x + numbers[j + 4],
								point.y + numbers[j + 5]
							);
							control.x = point.x + numbers[j + 2];
							control.y = point.y + numbers[j + 3];
							point.x += numbers[j + 4];
							point.y += numbers[j + 5];

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 's':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j += 4) {

							path.bezierCurveTo(
								getReflection(point.x, control.x),
								getReflection(point.y, control.y),
								point.x + numbers[j + 0],
								point.y + numbers[j + 1],
								point.x + numbers[j + 2],
								point.y + numbers[j + 3]
							);
							control.x = point.x + numbers[j + 0];
							control.y = point.y + numbers[j + 1];
							point.x += numbers[j + 2];
							point.y += numbers[j + 3];

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'q':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j += 4) {

							path.quadraticCurveTo(
								point.x + numbers[j + 0],
								point.y + numbers[j + 1],
								point.x + numbers[j + 2],
								point.y + numbers[j + 3]
							);
							control.x = point.x + numbers[j + 0];
							control.y = point.y + numbers[j + 1];
							point.x += numbers[j + 2];
							point.y += numbers[j + 3];

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 't':
						numbers = parseFloats(data);

						for (let j = 0, jl = numbers.length; j < jl; j += 2) {

							const rx = getReflection(point.x, control.x);
							const ry = getReflection(point.y, control.y);
							path.quadraticCurveTo(
								rx,
								ry,
								point.x + numbers[j + 0],
								point.y + numbers[j + 1]
							);
							control.x = rx;
							control.y = ry;
							point.x = point.x + numbers[j + 0];
							point.y = point.y + numbers[j + 1];

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'a':
						numbers = parseFloats(data, [3, 4], 7);

						for (let j = 0, jl = numbers.length; j < jl; j += 7) {

							// skip command if no displacement
							if (numbers[j + 5] == 0 && numbers[j + 6] == 0) continue;

							const start = point.clone();
							point.x += numbers[j + 5];
							point.y += numbers[j + 6];
							control.x = point.x;
							control.y = point.y;
							parseArcCommand(
								path, numbers[j], numbers[j + 1], numbers[j + 2], numbers[j + 3], numbers[j + 4], start, point
							);

							if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);

						}

						break;

					case 'Z':
					case 'z':
						path.currentPath.autoClose = true;

						if (path.currentPath.curves.length > 0) {

							// Reset point to beginning of Path
							point.copy(firstPoint);
							path.currentPath.currentPoint.copy(point);
							isFirstPoint = true;

						}

						break;

					default:
						console.warn(command);

				}

				// console.log( type, parseFloats( data ), parseFloats( data ).length  )

				doSetFirstPoint = false;

			}

			return path;

		}

		function parseCSSStylesheet(node) {

			if (!node.sheet || !node.sheet.cssRules || !node.sheet.cssRules.length) return;

			for (let i = 0; i < node.sheet.cssRules.length; i++) {

				const stylesheet = node.sheet.cssRules[i];

				if (stylesheet.type !== 1) continue;

				const selectorList = stylesheet.selectorText
					.split(/,/gm)
					.filter(Boolean)
					.map(i => i.trim());

				for (let j = 0; j < selectorList.length; j++) {

					// Remove empty rules
					const definitions = Object.fromEntries(
						Object.entries(stylesheet.style).filter(([, v]) => v !== '')
					);

					stylesheets[selectorList[j]] = Object.assign(
						stylesheets[selectorList[j]] || {},
						definitions
					);

				}

			}

		}

		/**
		 * https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
		 * https://mortoray.com/2017/02/16/rendering-an-svg-elliptical-arc-as-bezier-curves/ Appendix: Endpoint to center arc conversion
		 * From
		 * rx ry x-axis-rotation large-arc-flag sweep-flag x y
		 * To
		 * aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation
		 */

		function parseArcCommand(path, rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, start, end) {

			if (rx == 0 || ry == 0) {

				// draw a line if either of the radii == 0
				path.lineTo(end.x, end.y);
				return;

			}

			x_axis_rotation = x_axis_rotation * Math.PI / 180;

			// Ensure radii are positive
			rx = Math.abs(rx);
			ry = Math.abs(ry);

			// Compute (x1', y1')
			const dx2 = (start.x - end.x) / 2.0;
			const dy2 = (start.y - end.y) / 2.0;
			const x1p = Math.cos(x_axis_rotation) * dx2 + Math.sin(x_axis_rotation) * dy2;
			const y1p = - Math.sin(x_axis_rotation) * dx2 + Math.cos(x_axis_rotation) * dy2;

			// Compute (cx', cy')
			let rxs = rx * rx;
			let rys = ry * ry;
			const x1ps = x1p * x1p;
			const y1ps = y1p * y1p;

			// Ensure radii are large enough
			const cr = x1ps / rxs + y1ps / rys;

			if (cr > 1) {

				// scale up rx,ry equally so cr == 1
				const s = Math.sqrt(cr);
				rx = s * rx;
				ry = s * ry;
				rxs = rx * rx;
				rys = ry * ry;

			}

			const dq = (rxs * y1ps + rys * x1ps);
			const pq = (rxs * rys - dq) / dq;
			let q = Math.sqrt(Math.max(0, pq));
			if (large_arc_flag === sweep_flag) q = - q;
			const cxp = q * rx * y1p / ry;
			const cyp = - q * ry * x1p / rx;

			// Step 3: Compute (cx, cy) from (cx', cy')
			const cx = Math.cos(x_axis_rotation) * cxp - Math.sin(x_axis_rotation) * cyp + (start.x + end.x) / 2;
			const cy = Math.sin(x_axis_rotation) * cxp + Math.cos(x_axis_rotation) * cyp + (start.y + end.y) / 2;

			// Step 4: Compute θ1 and Δθ
			const theta = svgAngle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
			const delta = svgAngle((x1p - cxp) / rx, (y1p - cyp) / ry, (- x1p - cxp) / rx, (- y1p - cyp) / ry) % (Math.PI * 2);

			path.currentPath.absellipse(cx, cy, rx, ry, theta, theta + delta, sweep_flag === 0, x_axis_rotation);

		}

		function svgAngle(ux, uy, vx, vy) {

			const dot = ux * vx + uy * vy;
			const len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
			let ang = Math.acos(Math.max(- 1, Math.min(1, dot / len))); // floating point precision, slightly over values appear
			if ((ux * vy - uy * vx) < 0) ang = - ang;
			return ang;

		}

		/*
		* According to https://www.w3.org/TR/SVG/shapes.html#RectElementRXAttribute
		* rounded corner should be rendered to elliptical arc, but bezier curve does the job well enough
		*/
		function parseRectNode(node) {

			const x = parseFloatWithUnits(node.getAttribute('x') || 0);
			const y = parseFloatWithUnits(node.getAttribute('y') || 0);
			const rx = parseFloatWithUnits(node.getAttribute('rx') || node.getAttribute('ry') || 0);
			const ry = parseFloatWithUnits(node.getAttribute('ry') || node.getAttribute('rx') || 0);
			const w = parseFloatWithUnits(node.getAttribute('width'));
			const h = parseFloatWithUnits(node.getAttribute('height'));

			// Ellipse arc to Bezier approximation Coefficient (Inversed). See:
			// https://spencermortensen.com/articles/bezier-circle/
			const bci = 1 - 0.551915024494;

			const path = new ShapePath();

			// top left
			path.moveTo(x + rx, y);

			// top right
			path.lineTo(x + w - rx, y);
			if (rx !== 0 || ry !== 0) {

				path.bezierCurveTo(
					x + w - rx * bci,
					y,
					x + w,
					y + ry * bci,
					x + w,
					y + ry
				);

			}

			// bottom right
			path.lineTo(x + w, y + h - ry);
			if (rx !== 0 || ry !== 0) {

				path.bezierCurveTo(
					x + w,
					y + h - ry * bci,
					x + w - rx * bci,
					y + h,
					x + w - rx,
					y + h
				);

			}

			// bottom left
			path.lineTo(x + rx, y + h);
			if (rx !== 0 || ry !== 0) {

				path.bezierCurveTo(
					x + rx * bci,
					y + h,
					x,
					y + h - ry * bci,
					x,
					y + h - ry
				);

			}

			// back to top left
			path.lineTo(x, y + ry);
			if (rx !== 0 || ry !== 0) {

				path.bezierCurveTo(x, y + ry * bci, x + rx * bci, y, x + rx, y);

			}

			return path;

		}

		function parsePolygonNode(node) {

			function iterator(match, a, b) {

				const x = parseFloatWithUnits(a);
				const y = parseFloatWithUnits(b);

				if (index === 0) {

					path.moveTo(x, y);

				} else {

					path.lineTo(x, y);

				}

				index++;

			}

			const regex = /([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g;

			const path = new ShapePath();

			let index = 0;

			node.getAttribute('points').replace(regex, iterator);

			path.currentPath.autoClose = true;

			return path;

		}

		function parsePolylineNode(node) {

			function iterator(match, a, b) {

				const x = parseFloatWithUnits(a);
				const y = parseFloatWithUnits(b);

				if (index === 0) {

					path.moveTo(x, y);

				} else {

					path.lineTo(x, y);

				}

				index++;

			}

			const regex = /([+-]?\d*\.?\d+(?:e[+-]?\d+)?)(?:,|\s)([+-]?\d*\.?\d+(?:e[+-]?\d+)?)/g;

			const path = new ShapePath();

			let index = 0;

			node.getAttribute('points').replace(regex, iterator);

			path.currentPath.autoClose = false;

			return path;

		}

		function parseCircleNode(node) {

			const x = parseFloatWithUnits(node.getAttribute('cx') || 0);
			const y = parseFloatWithUnits(node.getAttribute('cy') || 0);
			const r = parseFloatWithUnits(node.getAttribute('r') || 0);

			const subpath = new Path();
			subpath.absarc(x, y, r, 0, Math.PI * 2);

			const path = new ShapePath();
			path.subPaths.push(subpath);

			return path;

		}

		function parseEllipseNode(node) {

			const x = parseFloatWithUnits(node.getAttribute('cx') || 0);
			const y = parseFloatWithUnits(node.getAttribute('cy') || 0);
			const rx = parseFloatWithUnits(node.getAttribute('rx') || 0);
			const ry = parseFloatWithUnits(node.getAttribute('ry') || 0);

			const subpath = new Path();
			subpath.absellipse(x, y, rx, ry, 0, Math.PI * 2);

			const path = new ShapePath();
			path.subPaths.push(subpath);

			return path;

		}

		function parseLineNode(node) {

			const x1 = parseFloatWithUnits(node.getAttribute('x1') || 0);
			const y1 = parseFloatWithUnits(node.getAttribute('y1') || 0);
			const x2 = parseFloatWithUnits(node.getAttribute('x2') || 0);
			const y2 = parseFloatWithUnits(node.getAttribute('y2') || 0);

			const path = new ShapePath();
			path.moveTo(x1, y1);
			path.lineTo(x2, y2);
			path.currentPath.autoClose = false;

			return path;

		}

		//

		function parseStyle(node, style) {

			style = Object.assign({}, style); // clone style

			let stylesheetStyles = {};

			if (node.hasAttribute('class')) {

				const classSelectors = node.getAttribute('class')
					.split(/\s/)
					.filter(Boolean)
					.map(i => i.trim());

				for (let i = 0; i < classSelectors.length; i++) {

					stylesheetStyles = Object.assign(stylesheetStyles, stylesheets['.' + classSelectors[i]]);

				}

			}

			if (node.hasAttribute('id')) {

				stylesheetStyles = Object.assign(stylesheetStyles, stylesheets['#' + node.getAttribute('id')]);

			}

			function addStyle(svgName, jsName, adjustFunction) {

				if (adjustFunction === undefined) adjustFunction = function copy(v) {

					if (v.startsWith('url')) console.warn('SVGLoader: url access in attributes is not implemented.');

					return v;

				};

				if (node.hasAttribute(svgName)) style[jsName] = adjustFunction(node.getAttribute(svgName));
				if (stylesheetStyles[svgName]) style[jsName] = adjustFunction(stylesheetStyles[svgName]);
				if (node.style && node.style[svgName] !== '') style[jsName] = adjustFunction(node.style[svgName]);

			}

			function clamp(v) {

				return Math.max(0, Math.min(1, parseFloatWithUnits(v)));

			}

			function positive(v) {

				return Math.max(0, parseFloatWithUnits(v));

			}

			addStyle('fill', 'fill');
			addStyle('fill-opacity', 'fillOpacity', clamp);
			addStyle('fill-rule', 'fillRule');
			addStyle('opacity', 'opacity', clamp);
			addStyle('stroke', 'stroke');
			addStyle('stroke-opacity', 'strokeOpacity', clamp);
			addStyle('stroke-width', 'strokeWidth', positive);
			addStyle('stroke-linejoin', 'strokeLineJoin');
			addStyle('stroke-linecap', 'strokeLineCap');
			addStyle('stroke-miterlimit', 'strokeMiterLimit', positive);
			addStyle('visibility', 'visibility');

			return style;

		}

		// http://www.w3.org/TR/SVG11/implnote.html#PathElementImplementationNotes

		function getReflection(a, b) {

			return a - (b - a);

		}

		// from https://github.com/ppvg/svg-numbers (MIT License)

		function parseFloats(input, flags, stride) {

			if (typeof input !== 'string') {

				throw new TypeError('Invalid input: ' + typeof input);

			}

			// Character groups
			const RE = {
				SEPARATOR: /[ \t\r\n\,.\-+]/,
				WHITESPACE: /[ \t\r\n]/,
				DIGIT: /[\d]/,
				SIGN: /[-+]/,
				POINT: /\./,
				COMMA: /,/,
				EXP: /e/i,
				FLAGS: /[01]/
			};

			// States
			const SEP = 0;
			const INT = 1;
			const FLOAT = 2;
			const EXP = 3;

			let state = SEP;
			let seenComma = true;
			let number = '', exponent = '';
			const result = [];

			function throwSyntaxError(current, i, partial) {

				const error = new SyntaxError('Unexpected character "' + current + '" at index ' + i + '.');
				error.partial = partial;
				throw error;

			}

			function newNumber() {

				if (number !== '') {

					if (exponent === '') result.push(Number(number));
					else result.push(Number(number) * Math.pow(10, Number(exponent)));

				}

				number = '';
				exponent = '';

			}

			let current;
			const length = input.length;

			for (let i = 0; i < length; i++) {

				current = input[i];

				// check for flags
				if (Array.isArray(flags) && flags.includes(result.length % stride) && RE.FLAGS.test(current)) {

					state = INT;
					number = current;
					newNumber();
					continue;

				}

				// parse until next number
				if (state === SEP) {

					// eat whitespace
					if (RE.WHITESPACE.test(current)) {

						continue;

					}

					// start new number
					if (RE.DIGIT.test(current) || RE.SIGN.test(current)) {

						state = INT;
						number = current;
						continue;

					}

					if (RE.POINT.test(current)) {

						state = FLOAT;
						number = current;
						continue;

					}

					// throw on double commas (e.g. "1, , 2")
					if (RE.COMMA.test(current)) {

						if (seenComma) {

							throwSyntaxError(current, i, result);

						}

						seenComma = true;

					}

				}

				// parse integer part
				if (state === INT) {

					if (RE.DIGIT.test(current)) {

						number += current;
						continue;

					}

					if (RE.POINT.test(current)) {

						number += current;
						state = FLOAT;
						continue;

					}

					if (RE.EXP.test(current)) {

						state = EXP;
						continue;

					}

					// throw on double signs ("-+1"), but not on sign as separator ("-1-2")
					if (RE.SIGN.test(current)
						&& number.length === 1
						&& RE.SIGN.test(number[0])) {

						throwSyntaxError(current, i, result);

					}

				}

				// parse decimal part
				if (state === FLOAT) {

					if (RE.DIGIT.test(current)) {

						number += current;
						continue;

					}

					if (RE.EXP.test(current)) {

						state = EXP;
						continue;

					}

					// throw on double decimal points (e.g. "1..2")
					if (RE.POINT.test(current) && number[number.length - 1] === '.') {

						throwSyntaxError(current, i, result);

					}

				}

				// parse exponent part
				if (state === EXP) {

					if (RE.DIGIT.test(current)) {

						exponent += current;
						continue;

					}

					if (RE.SIGN.test(current)) {

						if (exponent === '') {

							exponent += current;
							continue;

						}

						if (exponent.length === 1 && RE.SIGN.test(exponent)) {

							throwSyntaxError(current, i, result);

						}

					}

				}


				// end of number
				if (RE.WHITESPACE.test(current)) {

					newNumber();
					state = SEP;
					seenComma = false;

				} else if (RE.COMMA.test(current)) {

					newNumber();
					state = SEP;
					seenComma = true;

				} else if (RE.SIGN.test(current)) {

					newNumber();
					state = INT;
					number = current;

				} else if (RE.POINT.test(current)) {

					newNumber();
					state = FLOAT;
					number = current;

				} else {

					throwSyntaxError(current, i, result);

				}

			}

			// add the last number found (if any)
			newNumber();

			return result;

		}

		// Units

		const units = ['mm', 'cm', 'in', 'pt', 'pc', 'px'];

		// Conversion: [ fromUnit ][ toUnit ] (-1 means dpi dependent)
		const unitConversion = {

			'mm': {
				'mm': 1,
				'cm': 0.1,
				'in': 1 / 25.4,
				'pt': 72 / 25.4,
				'pc': 6 / 25.4,
				'px': - 1
			},
			'cm': {
				'mm': 10,
				'cm': 1,
				'in': 1 / 2.54,
				'pt': 72 / 2.54,
				'pc': 6 / 2.54,
				'px': - 1
			},
			'in': {
				'mm': 25.4,
				'cm': 2.54,
				'in': 1,
				'pt': 72,
				'pc': 6,
				'px': - 1
			},
			'pt': {
				'mm': 25.4 / 72,
				'cm': 2.54 / 72,
				'in': 1 / 72,
				'pt': 1,
				'pc': 6 / 72,
				'px': - 1
			},
			'pc': {
				'mm': 25.4 / 6,
				'cm': 2.54 / 6,
				'in': 1 / 6,
				'pt': 72 / 6,
				'pc': 1,
				'px': - 1
			},
			'px': {
				'px': 1
			}

		};

		function parseFloatWithUnits(string) {

			let theUnit = 'px';

			if (typeof string === 'string' || string instanceof String) {

				for (let i = 0, n = units.length; i < n; i++) {

					const u = units[i];

					if (string.endsWith(u)) {

						theUnit = u;
						string = string.substring(0, string.length - u.length);
						break;

					}

				}

			}

			let scale = undefined;

			if (theUnit === 'px' && scope.defaultUnit !== 'px') {

				// Conversion scale from  pixels to inches, then to default units

				scale = unitConversion['in'][scope.defaultUnit] / scope.defaultDPI;

			} else {

				scale = unitConversion[theUnit][scope.defaultUnit];

				if (scale < 0) {

					// Conversion scale to pixels

					scale = unitConversion[theUnit]['in'] * scope.defaultDPI;

				}

			}

			return scale * parseFloat(string);

		}

		// Transforms

		function getNodeTransform(node) {

			if (!(node.hasAttribute('transform') || (node.nodeName === 'use' && (node.hasAttribute('x') || node.hasAttribute('y'))))) {

				return null;

			}

			const transform = parseNodeTransform(node);

			if (transformStack.length > 0) {

				transform.premultiply(transformStack[transformStack.length - 1]);

			}

			currentTransform.copy(transform);
			transformStack.push(transform);

			return transform;

		}

		function parseNodeTransform(node) {

			const transform = new Matrix3();
			const currentTransform = tempTransform0;

			if (node.nodeName === 'use' && (node.hasAttribute('x') || node.hasAttribute('y'))) {

				const tx = parseFloatWithUnits(node.getAttribute('x'));
				const ty = parseFloatWithUnits(node.getAttribute('y'));

				transform.translate(tx, ty);

			}

			if (node.hasAttribute('transform')) {

				const transformsTexts = node.getAttribute('transform').split(')');

				for (let tIndex = transformsTexts.length - 1; tIndex >= 0; tIndex--) {

					const transformText = transformsTexts[tIndex].trim();

					if (transformText === '') continue;

					const openParPos = transformText.indexOf('(');
					const closeParPos = transformText.length;

					if (openParPos > 0 && openParPos < closeParPos) {

						const transformType = transformText.slice(0, openParPos);

						const array = parseFloats(transformText.slice(openParPos + 1));

						currentTransform.identity();

						switch (transformType) {

							case 'translate':

								if (array.length >= 1) {

									const tx = array[0];
									let ty = 0;

									if (array.length >= 2) {

										ty = array[1];

									}

									currentTransform.translate(tx, ty);

								}

								break;

							case 'rotate':

								if (array.length >= 1) {

									let angle = 0;
									let cx = 0;
									let cy = 0;

									// Angle
									angle = array[0] * Math.PI / 180;

									if (array.length >= 3) {

										// Center x, y
										cx = array[1];
										cy = array[2];

									}

									// Rotate around center (cx, cy)
									tempTransform1.makeTranslation(- cx, - cy);
									tempTransform2.makeRotation(angle);
									tempTransform3.multiplyMatrices(tempTransform2, tempTransform1);
									tempTransform1.makeTranslation(cx, cy);
									currentTransform.multiplyMatrices(tempTransform1, tempTransform3);

								}

								break;

							case 'scale':

								if (array.length >= 1) {

									const scaleX = array[0];
									let scaleY = scaleX;

									if (array.length >= 2) {

										scaleY = array[1];

									}

									currentTransform.scale(scaleX, scaleY);

								}

								break;

							case 'skewX':

								if (array.length === 1) {

									currentTransform.set(
										1, Math.tan(array[0] * Math.PI / 180), 0,
										0, 1, 0,
										0, 0, 1
									);

								}

								break;

							case 'skewY':

								if (array.length === 1) {

									currentTransform.set(
										1, 0, 0,
										Math.tan(array[0] * Math.PI / 180), 1, 0,
										0, 0, 1
									);

								}

								break;

							case 'matrix':

								if (array.length === 6) {

									currentTransform.set(
										array[0], array[2], array[4],
										array[1], array[3], array[5],
										0, 0, 1
									);

								}

								break;

						}

					}

					transform.premultiply(currentTransform);

				}

			}

			return transform;

		}

		function transformPath(path, m) {

			function transfVec2(v2) {

				tempV3.set(v2.x, v2.y, 1).applyMatrix3(m);

				v2.set(tempV3.x, tempV3.y);

			}

			function transfEllipseGeneric(curve) {

				// For math description see:
				// https://math.stackexchange.com/questions/4544164

				const a = curve.xRadius;
				const b = curve.yRadius;

				const cosTheta = Math.cos(curve.aRotation);
				const sinTheta = Math.sin(curve.aRotation);

				const v1 = new Vector3(a * cosTheta, a * sinTheta, 0);
				const v2 = new Vector3(- b * sinTheta, b * cosTheta, 0);

				const f1 = v1.applyMatrix3(m);
				const f2 = v2.applyMatrix3(m);

				const mF = tempTransform0.set(
					f1.x, f2.x, 0,
					f1.y, f2.y, 0,
					0, 0, 1,
				);

				const mFInv = tempTransform1.copy(mF).invert();
				const mFInvT = tempTransform2.copy(mFInv).transpose();
				const mQ = mFInvT.multiply(mFInv);
				const mQe = mQ.elements;

				const ed = eigenDecomposition(mQe[0], mQe[1], mQe[4]);
				const rt1sqrt = Math.sqrt(ed.rt1);
				const rt2sqrt = Math.sqrt(ed.rt2);

				curve.xRadius = 1 / rt1sqrt;
				curve.yRadius = 1 / rt2sqrt;
				curve.aRotation = Math.atan2(ed.sn, ed.cs);

				const isFullEllipse =
					(curve.aEndAngle - curve.aStartAngle) % (2 * Math.PI) < Number.EPSILON;

				// Do not touch angles of a full ellipse because after transformation they
				// would converge to a sinle value effectively removing the whole curve

				if (!isFullEllipse) {

					const mDsqrt = tempTransform1.set(
						rt1sqrt, 0, 0,
						0, rt2sqrt, 0,
						0, 0, 1,
					);

					const mRT = tempTransform2.set(
						ed.cs, ed.sn, 0,
						- ed.sn, ed.cs, 0,
						0, 0, 1,
					);

					const mDRF = mDsqrt.multiply(mRT).multiply(mF);

					const transformAngle = phi => {

						const { x: cosR, y: sinR } =
							new Vector3(Math.cos(phi), Math.sin(phi), 0).applyMatrix3(mDRF);

						return Math.atan2(sinR, cosR);

					};

					curve.aStartAngle = transformAngle(curve.aStartAngle);
					curve.aEndAngle = transformAngle(curve.aEndAngle);

					if (isTransformFlipped(m)) {

						curve.aClockwise = !curve.aClockwise;

					}

				}

			}

			function transfEllipseNoSkew(curve) {

				// Faster shortcut if no skew is applied
				// (e.g, a euclidean transform of a group containing the ellipse)

				const sx = getTransformScaleX(m);
				const sy = getTransformScaleY(m);

				curve.xRadius *= sx;
				curve.yRadius *= sy;

				// Extract rotation angle from the matrix of form:
				//
				//  | cosθ sx   -sinθ sy |
				//  | sinθ sx    cosθ sy |
				//
				// Remembering that tanθ = sinθ / cosθ; and that
				// `sx`, `sy`, or both might be zero.
				const theta =
					sx > Number.EPSILON
						? Math.atan2(m.elements[1], m.elements[0])
						: Math.atan2(- m.elements[3], m.elements[4]);

				curve.aRotation += theta;

				if (isTransformFlipped(m)) {

					curve.aStartAngle *= - 1;
					curve.aEndAngle *= - 1;
					curve.aClockwise = !curve.aClockwise;

				}

			}

			const subPaths = path.subPaths;

			for (let i = 0, n = subPaths.length; i < n; i++) {

				const subPath = subPaths[i];
				const curves = subPath.curves;

				for (let j = 0; j < curves.length; j++) {

					const curve = curves[j];

					if (curve.isLineCurve) {

						transfVec2(curve.v1);
						transfVec2(curve.v2);

					} else if (curve.isCubicBezierCurve) {

						transfVec2(curve.v0);
						transfVec2(curve.v1);
						transfVec2(curve.v2);
						transfVec2(curve.v3);

					} else if (curve.isQuadraticBezierCurve) {

						transfVec2(curve.v0);
						transfVec2(curve.v1);
						transfVec2(curve.v2);

					} else if (curve.isEllipseCurve) {

						// Transform ellipse center point

						tempV2.set(curve.aX, curve.aY);
						transfVec2(tempV2);
						curve.aX = tempV2.x;
						curve.aY = tempV2.y;

						// Transform ellipse shape parameters

						if (isTransformSkewed(m)) {

							transfEllipseGeneric(curve);

						} else {

							transfEllipseNoSkew(curve);

						}

					}

				}

			}

		}

		function isTransformFlipped(m) {

			const te = m.elements;
			return te[0] * te[4] - te[1] * te[3] < 0;

		}

		function isTransformSkewed(m) {

			const te = m.elements;
			const basisDot = te[0] * te[3] + te[1] * te[4];

			// Shortcut for trivial rotations and transformations
			if (basisDot === 0) return false;

			const sx = getTransformScaleX(m);
			const sy = getTransformScaleY(m);

			return Math.abs(basisDot / (sx * sy)) > Number.EPSILON;

		}

		function getTransformScaleX(m) {

			const te = m.elements;
			return Math.sqrt(te[0] * te[0] + te[1] * te[1]);

		}

		function getTransformScaleY(m) {

			const te = m.elements;
			return Math.sqrt(te[3] * te[3] + te[4] * te[4]);

		}

		// Calculates the eigensystem of a real symmetric 2x2 matrix
		//    [ A  B ]
		//    [ B  C ]
		// in the form
		//    [ A  B ]  =  [ cs  -sn ] [ rt1   0  ] [  cs  sn ]
		//    [ B  C ]     [ sn   cs ] [  0   rt2 ] [ -sn  cs ]
		// where rt1 >= rt2.
		//
		// Adapted from: https://www.mpi-hd.mpg.de/personalhomes/globes/3x3/index.html
		// -> Algorithms for real symmetric matrices -> Analytical (2x2 symmetric)
		function eigenDecomposition(A, B, C) {

			let rt1, rt2, cs, sn, t;
			const sm = A + C;
			const df = A - C;
			const rt = Math.sqrt(df * df + 4 * B * B);

			if (sm > 0) {

				rt1 = 0.5 * (sm + rt);
				t = 1 / rt1;
				rt2 = A * t * C - B * t * B;

			} else if (sm < 0) {

				rt2 = 0.5 * (sm - rt);

			} else {

				// This case needs to be treated separately to avoid div by 0

				rt1 = 0.5 * rt;
				rt2 = - 0.5 * rt;

			}

			// Calculate eigenvectors

			if (df > 0) {

				cs = df + rt;

			} else {

				cs = df - rt;

			}

			if (Math.abs(cs) > 2 * Math.abs(B)) {

				t = - 2 * B / cs;
				sn = 1 / Math.sqrt(1 + t * t);
				cs = t * sn;

			} else if (Math.abs(B) === 0) {

				cs = 1;
				sn = 0;

			} else {

				t = - 0.5 * cs / B;
				cs = 1 / Math.sqrt(1 + t * t);
				sn = t * cs;

			}

			if (df > 0) {

				t = cs;
				cs = - sn;
				sn = t;

			}

			return { rt1, rt2, cs, sn };

		}

		//

		const paths = [];
		const stylesheets = {};

		const transformStack = [];

		const tempTransform0 = new Matrix3();
		const tempTransform1 = new Matrix3();
		const tempTransform2 = new Matrix3();
		const tempTransform3 = new Matrix3();
		const tempV2 = new Vector2();
		const tempV3 = new Vector3();

		const currentTransform = new Matrix3();

		const xml = new DOMParser().parseFromString(text, 'image/svg+xml'); // application/xml

		parseNode(xml.documentElement, {
			fill: '#000',
			fillOpacity: 1,
			strokeOpacity: 1,
			strokeWidth: 1,
			strokeLineJoin: 'miter',
			strokeLineCap: 'butt',
			strokeMiterLimit: 4
		});

		const data = { paths: paths, xml: xml.documentElement };

		// console.log( paths );
		return data;

	}

	static createShapes(shapePath) {

		// Param shapePath: a shapepath as returned by the parse function of this class
		// Returns Shape object

		const BIGNUMBER = 999999999;

		const IntersectionLocationType = {
			ORIGIN: 0,
			DESTINATION: 1,
			BETWEEN: 2,
			LEFT: 3,
			RIGHT: 4,
			BEHIND: 5,
			BEYOND: 6
		};

		const classifyResult = {
			loc: IntersectionLocationType.ORIGIN,
			t: 0
		};

		function findEdgeIntersection(a0, a1, b0, b1) {

			const x1 = a0.x;
			const x2 = a1.x;
			const x3 = b0.x;
			const x4 = b1.x;
			const y1 = a0.y;
			const y2 = a1.y;
			const y3 = b0.y;
			const y4 = b1.y;
			const nom1 = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
			const nom2 = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
			const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
			const t1 = nom1 / denom;
			const t2 = nom2 / denom;

			if (((denom === 0) && (nom1 !== 0)) || (t1 <= 0) || (t1 >= 1) || (t2 < 0) || (t2 > 1)) {

				//1. lines are parallel or edges don't intersect

				return null;

			} else if ((nom1 === 0) && (denom === 0)) {

				//2. lines are colinear

				//check if endpoints of edge2 (b0-b1) lies on edge1 (a0-a1)
				for (let i = 0; i < 2; i++) {

					classifyPoint(i === 0 ? b0 : b1, a0, a1);
					//find position of this endpoints relatively to edge1
					if (classifyResult.loc == IntersectionLocationType.ORIGIN) {

						const point = (i === 0 ? b0 : b1);
						return { x: point.x, y: point.y, t: classifyResult.t };

					} else if (classifyResult.loc == IntersectionLocationType.BETWEEN) {

						const x = + ((x1 + classifyResult.t * (x2 - x1)).toPrecision(10));
						const y = + ((y1 + classifyResult.t * (y2 - y1)).toPrecision(10));
						return { x: x, y: y, t: classifyResult.t, };

					}

				}

				return null;

			} else {

				//3. edges intersect

				for (let i = 0; i < 2; i++) {

					classifyPoint(i === 0 ? b0 : b1, a0, a1);

					if (classifyResult.loc == IntersectionLocationType.ORIGIN) {

						const point = (i === 0 ? b0 : b1);
						return { x: point.x, y: point.y, t: classifyResult.t };

					}

				}

				const x = + ((x1 + t1 * (x2 - x1)).toPrecision(10));
				const y = + ((y1 + t1 * (y2 - y1)).toPrecision(10));
				return { x: x, y: y, t: t1 };

			}

		}

		function classifyPoint(p, edgeStart, edgeEnd) {

			const ax = edgeEnd.x - edgeStart.x;
			const ay = edgeEnd.y - edgeStart.y;
			const bx = p.x - edgeStart.x;
			const by = p.y - edgeStart.y;
			const sa = ax * by - bx * ay;

			if ((p.x === edgeStart.x) && (p.y === edgeStart.y)) {

				classifyResult.loc = IntersectionLocationType.ORIGIN;
				classifyResult.t = 0;
				return;

			}

			if ((p.x === edgeEnd.x) && (p.y === edgeEnd.y)) {

				classifyResult.loc = IntersectionLocationType.DESTINATION;
				classifyResult.t = 1;
				return;

			}

			if (sa < - Number.EPSILON) {

				classifyResult.loc = IntersectionLocationType.LEFT;
				return;

			}

			if (sa > Number.EPSILON) {

				classifyResult.loc = IntersectionLocationType.RIGHT;
				return;


			}

			if (((ax * bx) < 0) || ((ay * by) < 0)) {

				classifyResult.loc = IntersectionLocationType.BEHIND;
				return;

			}

			if ((Math.sqrt(ax * ax + ay * ay)) < (Math.sqrt(bx * bx + by * by))) {

				classifyResult.loc = IntersectionLocationType.BEYOND;
				return;

			}

			let t;

			if (ax !== 0) {

				t = bx / ax;

			} else {

				t = by / ay;

			}

			classifyResult.loc = IntersectionLocationType.BETWEEN;
			classifyResult.t = t;

		}

		function getIntersections(path1, path2) {

			const intersectionsRaw = [];
			const intersections = [];

			for (let index = 1; index < path1.length; index++) {

				const path1EdgeStart = path1[index - 1];
				const path1EdgeEnd = path1[index];

				for (let index2 = 1; index2 < path2.length; index2++) {

					const path2EdgeStart = path2[index2 - 1];
					const path2EdgeEnd = path2[index2];

					const intersection = findEdgeIntersection(path1EdgeStart, path1EdgeEnd, path2EdgeStart, path2EdgeEnd);

					if (intersection !== null && intersectionsRaw.find(i => i.t <= intersection.t + Number.EPSILON && i.t >= intersection.t - Number.EPSILON) === undefined) {

						intersectionsRaw.push(intersection);
						intersections.push(new Vector2(intersection.x, intersection.y));

					}

				}

			}

			return intersections;

		}

		function getScanlineIntersections(scanline, boundingBox, paths) {

			const center = new Vector2();
			boundingBox.getCenter(center);

			const allIntersections = [];

			paths.forEach(path => {

				// check if the center of the bounding box is in the bounding box of the paths.
				// this is a pruning method to limit the search of intersections in paths that can't envelop of the current path.
				// if a path envelops another path. The center of that oter path, has to be inside the bounding box of the enveloping path.
				if (path.boundingBox.containsPoint(center)) {

					const intersections = getIntersections(scanline, path.points);

					intersections.forEach(p => {

						allIntersections.push({ identifier: path.identifier, isCW: path.isCW, point: p });

					});

				}

			});

			allIntersections.sort((i1, i2) => {

				return i1.point.x - i2.point.x;

			});

			return allIntersections;

		}

		function isHoleTo(simplePath, allPaths, scanlineMinX, scanlineMaxX, _fillRule) {

			if (_fillRule === null || _fillRule === undefined || _fillRule === '') {

				_fillRule = 'nonzero';

			}

			const centerBoundingBox = new Vector2();
			simplePath.boundingBox.getCenter(centerBoundingBox);

			const scanline = [new Vector2(scanlineMinX, centerBoundingBox.y), new Vector2(scanlineMaxX, centerBoundingBox.y)];

			const scanlineIntersections = getScanlineIntersections(scanline, simplePath.boundingBox, allPaths);

			scanlineIntersections.sort((i1, i2) => {

				return i1.point.x - i2.point.x;

			});

			const baseIntersections = [];
			const otherIntersections = [];

			scanlineIntersections.forEach(i => {

				if (i.identifier === simplePath.identifier) {

					baseIntersections.push(i);

				} else {

					otherIntersections.push(i);

				}

			});

			const firstXOfPath = baseIntersections[0].point.x;

			// build up the path hierarchy
			const stack = [];
			let i = 0;

			while (i < otherIntersections.length && otherIntersections[i].point.x < firstXOfPath) {

				if (stack.length > 0 && stack[stack.length - 1] === otherIntersections[i].identifier) {

					stack.pop();

				} else {

					stack.push(otherIntersections[i].identifier);

				}

				i++;

			}

			stack.push(simplePath.identifier);

			if (_fillRule === 'evenodd') {

				const isHole = stack.length % 2 === 0 ? true : false;
				const isHoleFor = stack[stack.length - 2];

				return { identifier: simplePath.identifier, isHole: isHole, for: isHoleFor };

			} else if (_fillRule === 'nonzero') {

				// check if path is a hole by counting the amount of paths with alternating rotations it has to cross.
				let isHole = true;
				let isHoleFor = null;
				let lastCWValue = null;

				for (let i = 0; i < stack.length; i++) {

					const identifier = stack[i];
					if (isHole) {

						lastCWValue = allPaths[identifier].isCW;
						isHole = false;
						isHoleFor = identifier;

					} else if (lastCWValue !== allPaths[identifier].isCW) {

						lastCWValue = allPaths[identifier].isCW;
						isHole = true;

					}

				}

				return { identifier: simplePath.identifier, isHole: isHole, for: isHoleFor };

			} else {

				console.warn('fill-rule: "' + _fillRule + '" is currently not implemented.');

			}

		}

		// check for self intersecting paths
		// TODO

		// check intersecting paths
		// TODO

		// prepare paths for hole detection
		let scanlineMinX = BIGNUMBER;
		let scanlineMaxX = - BIGNUMBER;

		let simplePaths = shapePath.subPaths.map(p => {

			const points = p.getPoints();
			let maxY = - BIGNUMBER;
			let minY = BIGNUMBER;
			let maxX = - BIGNUMBER;
			let minX = BIGNUMBER;

			//points.forEach(p => p.y *= -1);

			for (let i = 0; i < points.length; i++) {

				const p = points[i];

				if (p.y > maxY) {

					maxY = p.y;

				}

				if (p.y < minY) {

					minY = p.y;

				}

				if (p.x > maxX) {

					maxX = p.x;

				}

				if (p.x < minX) {

					minX = p.x;

				}

			}

			//
			if (scanlineMaxX <= maxX) {

				scanlineMaxX = maxX + 1;

			}

			if (scanlineMinX >= minX) {

				scanlineMinX = minX - 1;

			}

			return { curves: p.curves, points: points, isCW: ShapeUtils.isClockWise(points), identifier: - 1, boundingBox: new Box2(new Vector2(minX, minY), new Vector2(maxX, maxY)) };

		});

		simplePaths = simplePaths.filter(sp => sp.points.length > 1);

		for (let identifier = 0; identifier < simplePaths.length; identifier++) {

			simplePaths[identifier].identifier = identifier;

		}

		// check if path is solid or a hole
		const isAHole = simplePaths.map(p => isHoleTo(p, simplePaths, scanlineMinX, scanlineMaxX, (shapePath.userData ? shapePath.userData.style.fillRule : undefined)));


		const shapesToReturn = [];
		simplePaths.forEach(p => {

			const amIAHole = isAHole[p.identifier];

			if (!amIAHole.isHole) {

				const shape = new Shape();
				shape.curves = p.curves;
				const holes = isAHole.filter(h => h.isHole && h.for === p.identifier);
				holes.forEach(h => {

					const hole = simplePaths[h.identifier];
					const path = new Path();
					path.curves = hole.curves;
					shape.holes.push(path);

				});
				shapesToReturn.push(shape);

			}

		});

		return shapesToReturn;

	}

	static getStrokeStyle(width, color, lineJoin, lineCap, miterLimit) {

		// Param width: Stroke width
		// Param color: As returned by THREE.Color.getStyle()
		// Param lineJoin: One of "round", "bevel", "miter" or "miter-limit"
		// Param lineCap: One of "round", "square" or "butt"
		// Param miterLimit: Maximum join length, in multiples of the "width" parameter (join is truncated if it exceeds that distance)
		// Returns style object

		width = width !== undefined ? width : 1;
		color = color !== undefined ? color : '#000';
		lineJoin = lineJoin !== undefined ? lineJoin : 'miter';
		lineCap = lineCap !== undefined ? lineCap : 'butt';
		miterLimit = miterLimit !== undefined ? miterLimit : 4;

		return {
			strokeColor: color,
			strokeWidth: width,
			strokeLineJoin: lineJoin,
			strokeLineCap: lineCap,
			strokeMiterLimit: miterLimit
		};

	}

	static pointsToStroke(points, style, arcDivisions, minDistance) {

		// Generates a stroke with some width around the given path.
		// The path can be open or closed (last point equals to first point)
		// Param points: Array of Vector2D (the path). Minimum 2 points.
		// Param style: Object with SVG properties as returned by SVGLoader.getStrokeStyle(), or SVGLoader.parse() in the path.userData.style object
		// Params arcDivisions: Arc divisions for round joins and endcaps. (Optional)
		// Param minDistance: Points closer to this distance will be merged. (Optional)
		// Returns BufferGeometry with stroke triangles (In plane z = 0). UV coordinates are generated ('u' along path. 'v' across it, from left to right)

		const vertices = [];
		const normals = [];
		const uvs = [];

		if (SVGLoader.pointsToStrokeWithBuffers(points, style, arcDivisions, minDistance, vertices, normals, uvs) === 0) {

			return null;

		}

		const geometry = new BufferGeometry();
		geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
		geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
		geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

		return geometry;

	}

	static pointsToStrokeWithBuffers(points, style, arcDivisions, minDistance, vertices, normals, uvs, vertexOffset) {

		// This function can be called to update existing arrays or buffers.
		// Accepts same parameters as pointsToStroke, plus the buffers and optional offset.
		// Param vertexOffset: Offset vertices to start writing in the buffers (3 elements/vertex for vertices and normals, and 2 elements/vertex for uvs)
		// Returns number of written vertices / normals / uvs pairs
		// if 'vertices' parameter is undefined no triangles will be generated, but the returned vertices count will still be valid (useful to preallocate the buffers)
		// 'normals' and 'uvs' buffers are optional

		const tempV2_1 = new Vector2();
		const tempV2_2 = new Vector2();
		const tempV2_3 = new Vector2();
		const tempV2_4 = new Vector2();
		const tempV2_5 = new Vector2();
		const tempV2_6 = new Vector2();
		const tempV2_7 = new Vector2();
		const lastPointL = new Vector2();
		const lastPointR = new Vector2();
		const point0L = new Vector2();
		const point0R = new Vector2();
		const currentPointL = new Vector2();
		const currentPointR = new Vector2();
		const nextPointL = new Vector2();
		const nextPointR = new Vector2();
		const innerPoint = new Vector2();
		const outerPoint = new Vector2();

		arcDivisions = arcDivisions !== undefined ? arcDivisions : 12;
		minDistance = minDistance !== undefined ? minDistance : 0.001;
		vertexOffset = vertexOffset !== undefined ? vertexOffset : 0;

		// First ensure there are no duplicated points
		points = removeDuplicatedPoints(points);

		const numPoints = points.length;

		if (numPoints < 2) return 0;

		const isClosed = points[0].equals(points[numPoints - 1]);



		let currentPoint;
		let previousPoint = points[0];
		let nextPoint;

		const strokeWidth2 = style.strokeWidth / 2;

		const deltaU = 1 / (numPoints - 1);
		let u0 = 0, u1;

		let innerSideModified;
		let joinIsOnLeftSide;
		let isMiter;
		let initialJoinIsOnLeftSide = false;

		let numVertices = 0;
		let currentCoordinate = vertexOffset * 3;
		let currentCoordinateUV = vertexOffset * 2;

		// Get initial left and right stroke points
		getNormal(points[0], points[1], tempV2_1).multiplyScalar(strokeWidth2);
		lastPointL.copy(points[0]).sub(tempV2_1);
		lastPointR.copy(points[0]).add(tempV2_1);
		point0L.copy(lastPointL);
		point0R.copy(lastPointR);

		for (let iPoint = 1; iPoint < numPoints; iPoint++) {

			currentPoint = points[iPoint];

			// Get next point
			if (iPoint === numPoints - 1) {

				if (isClosed) {

					// Skip duplicated initial point
					nextPoint = points[1];

				} else nextPoint = undefined;

			} else {

				nextPoint = points[iPoint + 1];

			}

			// Normal of previous segment in tempV2_1
			const normal1 = tempV2_1;
			getNormal(previousPoint, currentPoint, normal1);

			tempV2_3.copy(normal1).multiplyScalar(strokeWidth2);
			currentPointL.copy(currentPoint).sub(tempV2_3);
			currentPointR.copy(currentPoint).add(tempV2_3);

			u1 = u0 + deltaU;

			innerSideModified = false;

			if (nextPoint !== undefined) {

				// Normal of next segment in tempV2_2
				getNormal(currentPoint, nextPoint, tempV2_2);

				tempV2_3.copy(tempV2_2).multiplyScalar(strokeWidth2);
				nextPointL.copy(currentPoint).sub(tempV2_3);
				nextPointR.copy(currentPoint).add(tempV2_3);

				joinIsOnLeftSide = true;
				tempV2_3.subVectors(nextPoint, previousPoint);
				if (normal1.dot(tempV2_3) < 0) {

					joinIsOnLeftSide = false;

				}

				if (iPoint === 1) initialJoinIsOnLeftSide = joinIsOnLeftSide;

				tempV2_3.subVectors(nextPoint, currentPoint);
				tempV2_3.normalize();
				const dot = Math.abs(normal1.dot(tempV2_3));

				// If path is straight, don't create join
				if (dot > Number.EPSILON) {

					// Compute inner and outer segment intersections
					const miterSide = strokeWidth2 / dot;
					tempV2_3.multiplyScalar(- miterSide);
					tempV2_4.subVectors(currentPoint, previousPoint);
					tempV2_5.copy(tempV2_4).setLength(miterSide).add(tempV2_3);
					innerPoint.copy(tempV2_5).negate();
					const miterLength2 = tempV2_5.length();
					const segmentLengthPrev = tempV2_4.length();
					tempV2_4.divideScalar(segmentLengthPrev);
					tempV2_6.subVectors(nextPoint, currentPoint);
					const segmentLengthNext = tempV2_6.length();
					tempV2_6.divideScalar(segmentLengthNext);
					// Check that previous and next segments doesn't overlap with the innerPoint of intersection
					if (tempV2_4.dot(innerPoint) < segmentLengthPrev && tempV2_6.dot(innerPoint) < segmentLengthNext) {

						innerSideModified = true;

					}

					outerPoint.copy(tempV2_5).add(currentPoint);
					innerPoint.add(currentPoint);

					isMiter = false;

					if (innerSideModified) {

						if (joinIsOnLeftSide) {

							nextPointR.copy(innerPoint);
							currentPointR.copy(innerPoint);

						} else {

							nextPointL.copy(innerPoint);
							currentPointL.copy(innerPoint);

						}

					} else {

						// The segment triangles are generated here if there was overlapping

						makeSegmentTriangles();

					}

					switch (style.strokeLineJoin) {

						case 'bevel':

							makeSegmentWithBevelJoin(joinIsOnLeftSide, innerSideModified, u1);

							break;

						case 'round':

							// Segment triangles

							createSegmentTrianglesWithMiddleSection(joinIsOnLeftSide, innerSideModified);

							// Join triangles

							if (joinIsOnLeftSide) {

								makeCircularSector(currentPoint, currentPointL, nextPointL, u1, 0);

							} else {

								makeCircularSector(currentPoint, nextPointR, currentPointR, u1, 1);

							}

							break;

						case 'miter':
						case 'miter-clip':
						default:

							const miterFraction = (strokeWidth2 * style.strokeMiterLimit) / miterLength2;

							if (miterFraction < 1) {

								// The join miter length exceeds the miter limit

								if (style.strokeLineJoin !== 'miter-clip') {

									makeSegmentWithBevelJoin(joinIsOnLeftSide, innerSideModified, u1);
									break;

								} else {

									// Segment triangles

									createSegmentTrianglesWithMiddleSection(joinIsOnLeftSide, innerSideModified);

									// Miter-clip join triangles

									if (joinIsOnLeftSide) {

										tempV2_6.subVectors(outerPoint, currentPointL).multiplyScalar(miterFraction).add(currentPointL);
										tempV2_7.subVectors(outerPoint, nextPointL).multiplyScalar(miterFraction).add(nextPointL);

										addVertex(currentPointL, u1, 0);
										addVertex(tempV2_6, u1, 0);
										addVertex(currentPoint, u1, 0.5);

										addVertex(currentPoint, u1, 0.5);
										addVertex(tempV2_6, u1, 0);
										addVertex(tempV2_7, u1, 0);

										addVertex(currentPoint, u1, 0.5);
										addVertex(tempV2_7, u1, 0);
										addVertex(nextPointL, u1, 0);

									} else {

										tempV2_6.subVectors(outerPoint, currentPointR).multiplyScalar(miterFraction).add(currentPointR);
										tempV2_7.subVectors(outerPoint, nextPointR).multiplyScalar(miterFraction).add(nextPointR);

										addVertex(currentPointR, u1, 1);
										addVertex(tempV2_6, u1, 1);
										addVertex(currentPoint, u1, 0.5);

										addVertex(currentPoint, u1, 0.5);
										addVertex(tempV2_6, u1, 1);
										addVertex(tempV2_7, u1, 1);

										addVertex(currentPoint, u1, 0.5);
										addVertex(tempV2_7, u1, 1);
										addVertex(nextPointR, u1, 1);

									}

								}

							} else {

								// Miter join segment triangles

								if (innerSideModified) {

									// Optimized segment + join triangles

									if (joinIsOnLeftSide) {

										addVertex(lastPointR, u0, 1);
										addVertex(lastPointL, u0, 0);
										addVertex(outerPoint, u1, 0);

										addVertex(lastPointR, u0, 1);
										addVertex(outerPoint, u1, 0);
										addVertex(innerPoint, u1, 1);

									} else {

										addVertex(lastPointR, u0, 1);
										addVertex(lastPointL, u0, 0);
										addVertex(outerPoint, u1, 1);

										addVertex(lastPointL, u0, 0);
										addVertex(innerPoint, u1, 0);
										addVertex(outerPoint, u1, 1);

									}


									if (joinIsOnLeftSide) {

										nextPointL.copy(outerPoint);

									} else {

										nextPointR.copy(outerPoint);

									}


								} else {

									// Add extra miter join triangles

									if (joinIsOnLeftSide) {

										addVertex(currentPointL, u1, 0);
										addVertex(outerPoint, u1, 0);
										addVertex(currentPoint, u1, 0.5);

										addVertex(currentPoint, u1, 0.5);
										addVertex(outerPoint, u1, 0);
										addVertex(nextPointL, u1, 0);

									} else {

										addVertex(currentPointR, u1, 1);
										addVertex(outerPoint, u1, 1);
										addVertex(currentPoint, u1, 0.5);

										addVertex(currentPoint, u1, 0.5);
										addVertex(outerPoint, u1, 1);
										addVertex(nextPointR, u1, 1);

									}

								}

								isMiter = true;

							}

							break;

					}

				} else {

					// The segment triangles are generated here when two consecutive points are collinear

					makeSegmentTriangles();

				}

			} else {

				// The segment triangles are generated here if it is the ending segment

				makeSegmentTriangles();

			}

			if (!isClosed && iPoint === numPoints - 1) {

				// Start line endcap
				addCapGeometry(points[0], point0L, point0R, joinIsOnLeftSide, true, u0);

			}

			// Increment loop variables

			u0 = u1;

			previousPoint = currentPoint;

			lastPointL.copy(nextPointL);
			lastPointR.copy(nextPointR);

		}

		if (!isClosed) {

			// Ending line endcap
			addCapGeometry(currentPoint, currentPointL, currentPointR, joinIsOnLeftSide, false, u1);

		} else if (innerSideModified && vertices) {

			// Modify path first segment vertices to adjust to the segments inner and outer intersections

			let lastOuter = outerPoint;
			let lastInner = innerPoint;

			if (initialJoinIsOnLeftSide !== joinIsOnLeftSide) {

				lastOuter = innerPoint;
				lastInner = outerPoint;

			}

			if (joinIsOnLeftSide) {

				if (isMiter || initialJoinIsOnLeftSide) {

					lastInner.toArray(vertices, 0 * 3);
					lastInner.toArray(vertices, 3 * 3);

					if (isMiter) {

						lastOuter.toArray(vertices, 1 * 3);

					}

				}

			} else {

				if (isMiter || !initialJoinIsOnLeftSide) {

					lastInner.toArray(vertices, 1 * 3);
					lastInner.toArray(vertices, 3 * 3);

					if (isMiter) {

						lastOuter.toArray(vertices, 0 * 3);

					}

				}

			}

		}

		return numVertices;

		// -- End of algorithm

		// -- Functions

		function getNormal(p1, p2, result) {

			result.subVectors(p2, p1);
			return result.set(- result.y, result.x).normalize();

		}

		function addVertex(position, u, v) {

			if (vertices) {

				vertices[currentCoordinate] = position.x;
				vertices[currentCoordinate + 1] = position.y;
				vertices[currentCoordinate + 2] = 0;

				if (normals) {

					normals[currentCoordinate] = 0;
					normals[currentCoordinate + 1] = 0;
					normals[currentCoordinate + 2] = 1;

				}

				currentCoordinate += 3;

				if (uvs) {

					uvs[currentCoordinateUV] = u;
					uvs[currentCoordinateUV + 1] = v;

					currentCoordinateUV += 2;

				}

			}

			numVertices += 3;

		}

		function makeCircularSector(center, p1, p2, u, v) {

			// param p1, p2: Points in the circle arc.
			// p1 and p2 are in clockwise direction.

			tempV2_1.copy(p1).sub(center).normalize();
			tempV2_2.copy(p2).sub(center).normalize();

			let angle = Math.PI;
			const dot = tempV2_1.dot(tempV2_2);
			if (Math.abs(dot) < 1) angle = Math.abs(Math.acos(dot));

			angle /= arcDivisions;

			tempV2_3.copy(p1);

			for (let i = 0, il = arcDivisions - 1; i < il; i++) {

				tempV2_4.copy(tempV2_3).rotateAround(center, angle);

				addVertex(tempV2_3, u, v);
				addVertex(tempV2_4, u, v);
				addVertex(center, u, 0.5);

				tempV2_3.copy(tempV2_4);

			}

			addVertex(tempV2_4, u, v);
			addVertex(p2, u, v);
			addVertex(center, u, 0.5);

		}

		function makeSegmentTriangles() {

			addVertex(lastPointR, u0, 1);
			addVertex(lastPointL, u0, 0);
			addVertex(currentPointL, u1, 0);

			addVertex(lastPointR, u0, 1);
			addVertex(currentPointL, u1, 1);
			addVertex(currentPointR, u1, 0);

		}

		function makeSegmentWithBevelJoin(joinIsOnLeftSide, innerSideModified, u) {

			if (innerSideModified) {

				// Optimized segment + bevel triangles

				if (joinIsOnLeftSide) {

					// Path segments triangles

					addVertex(lastPointR, u0, 1);
					addVertex(lastPointL, u0, 0);
					addVertex(currentPointL, u1, 0);

					addVertex(lastPointR, u0, 1);
					addVertex(currentPointL, u1, 0);
					addVertex(innerPoint, u1, 1);

					// Bevel join triangle

					addVertex(currentPointL, u, 0);
					addVertex(nextPointL, u, 0);
					addVertex(innerPoint, u, 0.5);

				} else {

					// Path segments triangles

					addVertex(lastPointR, u0, 1);
					addVertex(lastPointL, u0, 0);
					addVertex(currentPointR, u1, 1);

					addVertex(lastPointL, u0, 0);
					addVertex(innerPoint, u1, 0);
					addVertex(currentPointR, u1, 1);

					// Bevel join triangle

					addVertex(currentPointR, u, 1);
					addVertex(nextPointR, u, 0);
					addVertex(innerPoint, u, 0.5);

				}

			} else {

				// Bevel join triangle. The segment triangles are done in the main loop

				if (joinIsOnLeftSide) {

					addVertex(currentPointL, u, 0);
					addVertex(nextPointL, u, 0);
					addVertex(currentPoint, u, 0.5);

				} else {

					addVertex(currentPointR, u, 1);
					addVertex(nextPointR, u, 0);
					addVertex(currentPoint, u, 0.5);

				}

			}

		}

		function createSegmentTrianglesWithMiddleSection(joinIsOnLeftSide, innerSideModified) {

			if (innerSideModified) {

				if (joinIsOnLeftSide) {

					addVertex(lastPointR, u0, 1);
					addVertex(lastPointL, u0, 0);
					addVertex(currentPointL, u1, 0);

					addVertex(lastPointR, u0, 1);
					addVertex(currentPointL, u1, 0);
					addVertex(innerPoint, u1, 1);

					addVertex(currentPointL, u0, 0);
					addVertex(currentPoint, u1, 0.5);
					addVertex(innerPoint, u1, 1);

					addVertex(currentPoint, u1, 0.5);
					addVertex(nextPointL, u0, 0);
					addVertex(innerPoint, u1, 1);

				} else {

					addVertex(lastPointR, u0, 1);
					addVertex(lastPointL, u0, 0);
					addVertex(currentPointR, u1, 1);

					addVertex(lastPointL, u0, 0);
					addVertex(innerPoint, u1, 0);
					addVertex(currentPointR, u1, 1);

					addVertex(currentPointR, u0, 1);
					addVertex(innerPoint, u1, 0);
					addVertex(currentPoint, u1, 0.5);

					addVertex(currentPoint, u1, 0.5);
					addVertex(innerPoint, u1, 0);
					addVertex(nextPointR, u0, 1);

				}

			}

		}

		function addCapGeometry(center, p1, p2, joinIsOnLeftSide, start, u) {

			// param center: End point of the path
			// param p1, p2: Left and right cap points

			switch (style.strokeLineCap) {

				case 'round':

					if (start) {

						makeCircularSector(center, p2, p1, u, 0.5);

					} else {

						makeCircularSector(center, p1, p2, u, 0.5);

					}

					break;

				case 'square':

					if (start) {

						tempV2_1.subVectors(p1, center);
						tempV2_2.set(tempV2_1.y, - tempV2_1.x);

						tempV2_3.addVectors(tempV2_1, tempV2_2).add(center);
						tempV2_4.subVectors(tempV2_2, tempV2_1).add(center);

						// Modify already existing vertices
						if (joinIsOnLeftSide) {

							tempV2_3.toArray(vertices, 1 * 3);
							tempV2_4.toArray(vertices, 0 * 3);
							tempV2_4.toArray(vertices, 3 * 3);

						} else {

							tempV2_3.toArray(vertices, 1 * 3);
							tempV2_3.toArray(vertices, 3 * 3);
							tempV2_4.toArray(vertices, 0 * 3);

						}

					} else {

						tempV2_1.subVectors(p2, center);
						tempV2_2.set(tempV2_1.y, - tempV2_1.x);

						tempV2_3.addVectors(tempV2_1, tempV2_2).add(center);
						tempV2_4.subVectors(tempV2_2, tempV2_1).add(center);

						const vl = vertices.length;

						// Modify already existing vertices
						if (joinIsOnLeftSide) {

							tempV2_3.toArray(vertices, vl - 1 * 3);
							tempV2_4.toArray(vertices, vl - 2 * 3);
							tempV2_4.toArray(vertices, vl - 4 * 3);

						} else {

							tempV2_3.toArray(vertices, vl - 2 * 3);
							tempV2_4.toArray(vertices, vl - 1 * 3);
							tempV2_4.toArray(vertices, vl - 4 * 3);

						}

					}

					break;

			}

		}

		function removeDuplicatedPoints(points) {

			// Creates a new array if necessary with duplicated points removed.
			// This does not remove duplicated initial and ending points of a closed path.

			let dupPoints = false;
			for (let i = 1, n = points.length - 1; i < n; i++) {

				if (points[i].distanceTo(points[i + 1]) < minDistance) {

					dupPoints = true;
					break;

				}

			}

			if (!dupPoints) return points;

			const newPoints = [];
			newPoints.push(points[0]);

			for (let i = 1, n = points.length - 1; i < n; i++) {

				if (points[i].distanceTo(points[i + 1]) >= minDistance) {

					newPoints.push(points[i]);

				}

			}

			newPoints.push(points[points.length - 1]);

			return newPoints;

		}

	}


}

class AutoSvg extends Mesh {

	constructor(model, option = {}, material = null) {

		super();

		this.model = model;

		this.material = material;
		this.outMaterial = material ? true : false;

		this.XML = new XMLSerializer();
		this.color = new Color();
		this.opacity = 1;
		this.svgLoader = new SVGLoader();
		this.base = "http://www.w3.org/2000/svg";
		this.svg = document.createElementNS(this.base, 'svg');
		this.layerUp = 0.0001;
		this.fill = true;
		this.stroke = true;

		this.size = option.size || 1;

		//let w = 10
		//this.set( { viewBox:'0 0 '+w+' '+w, width:w, height:w, preserveAspectRatio:'none' })

		if (!this.model) return;

		let o = {};

		switch (this.model) {

			case 'angle':

				o = {
					radius: 5, min: 90, max: 90, strokeSize: 0.25,
					...option
				};

				this.fill = o.fill !== undefined ? o.fill : true;
				this.stroke = o.stroke !== undefined ? o.stroke : true;
				let min = Math.abs(o.min);
				this.add('path', { d: this.circle(0, 0, o.radius, 180, 180 + o.max, true), stroke: 'none', fill: '#FF0000', 'fill-opacity': 0.1 });
				this.add('path', { d: this.circle(0, 0, o.radius, 180, 180 + o.max, false, false, 0.3), stroke: '#FF0000', 'stroke-opacity': 1, 'stroke-width': o.strokeSize, fill: 'none', 'stroke-linecap': 'round' });
				this.add('path', { d: this.circle(0, 0, o.radius, 180 - min, 180, true), stroke: 'none', fill: '#0050FF', 'fill-opacity': 0.1 });
				this.add('path', { d: this.circle(0, 0, o.radius, 180 - min, 180, false, false, 0.3, true), stroke: '#0050FF', 'stroke-opacity': 1, 'stroke-width': o.strokeSize, fill: 'none', 'stroke-linecap': 'round' });
				break;

			case 'needle':
				o = {
					radius: 5, min: 90, max: 90, strokeSize: 0.25,
					...option
				};
				this.fill = o.fill !== undefined ? o.fill : true;
				this.stroke = o.stroke !== undefined ? o.stroke : true;
				this.add('path', { d: this.circle(0, 0, 0.7, 0, 360, false, true, 0), stroke: '#FFFFFF', 'stroke-opacity': 1, 'stroke-width': o.strokeSize, fill: 'none', 'stroke-linecap': 'butt' });
				this.add('path', { d: this.segment({ x: 0, y: 0 }, { x: 0, y: 4.4 }), stroke: '#FFFFFF', 'stroke-opacity': 1, 'stroke-width': o.strokeSize, fill: 'none', 'stroke-linecap': 'round' });
				break;


		}

		this.toMesh();

	}

	raycast() {
		return;
	}

	update(option = {}) {

		let o = {};

		switch (this.model) {

			case 'angle':

				o = {
					radius: 5,
					min: -90,
					max: 90,
					...option
				};

				let min = Math.abs(o.min);

				this.change('d', this.circle(0, 0, o.radius, 180, 180 + o.max, true), 0);
				this.change('d', this.circle(0, 0, o.radius, 180, 180 + o.max, false, false, 0.3), 1);

				this.change('d', this.circle(0, 0, o.radius, 180 - min, 180, true), 2);
				this.change('d', this.circle(0, 0, o.radius, 180 - min, 180, false, false, 0.3, true), 3);



				break;

		}

		if (option.wireframe !== undefined) this.material.wireframe = option.wireframe;

		// redraw
		this.fill = o.fill !== undefined ? o.fill : true;
		this.stroke = o.stroke !== undefined ? o.stroke : true;
		this.toMesh();

	}

	// SVG SIDE

	set(o = {}, parent) {
		for (let t in o) {
			if (parent) parent.setAttributeNS(null, t, o[t]);
			else this.svg.setAttributeNS(null, t, o[t]);
		}
	}

	add(type, o = {}) {

		let g = document.createElementNS(this.base, type);
		this.set(o, g);
		this.svg.appendChild(g);

	}

	change(type, value, id) {

		this.svg.childNodes[id].setAttributeNS(null, type, value);

	}

	getString() {
		return this.XML.serializeToString(this.svg);
	}

	polarToCartesian(x, y, radius, angleInDegrees) {
		var rad = (angleInDegrees - 90) * Math.PI / 180.0;
		return { x: x + (radius * Math.cos(rad)), y: y + (radius * Math.sin(rad)) };
	}

	circle(x, y, radius, startAngle = 0, endAngle = 360, tri = false, close = false, endTag = 0, over = false) {

		if (startAngle === 0 && endAngle === 360) { startAngle = 0.0001; close = true; }
		let start = this.polarToCartesian(x, y, radius, endAngle);
		let end = this.polarToCartesian(x, y, radius, startAngle);
		let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
		let d = [
			"M", start.x, start.y,
			"A", radius, radius, 0, arcSweep, 0, end.x, end.y,
		];
		if (tri) d.push(
			"L", x, y,
			"L", start.x, start.y
		);
		if (close) d.push('Z');

		if (endTag !== 0) {
			let p1 = this.polarToCartesian(x, y, radius - endTag, over ? startAngle : endAngle);
			let p2 = this.polarToCartesian(x, y, radius + endTag, over ? startAngle : endAngle);
			d.push('M', p1.x, p1.y, "L", p2.x, p2.y);
		}

		return d.join(" ");

	}

	segment(p1, p2) {
		let d = ['M', p1.x, p1.y, "L", p2.x, p2.y];
		return d.join(" ");
	}

	// THREE SIDE

	geomColor(g, color, opacity = 1) {

		let i = g.attributes.position.count;
		let cc = [];//, aa = []
		while (i--) {
			cc.push(color.r, color.g, color.b, opacity);
			//aa.push( opacity )
		}

		//g.setAttribute( 'opacity', new Float32BufferAttribute( aa, 1 ) );
		g.setAttribute('color', new Float32BufferAttribute(cc, 4));

	}

	toGeometry() {

		if (!this.fill && !this.stroke) return null;

		let geom = [];
		let layer = 0;
		let opacity = 1;
		let data = this.svgLoader.parse(this.getString());

		for (const path of data.paths) {

			// FILL
			const fillColor = path.userData.style.fill;
			if (this.fill && fillColor !== undefined && fillColor !== 'none') {

				this.color.setStyle(fillColor);
				opacity = path.userData.style.fillOpacity;
				if (opacity < this.opacity) this.opacity = opacity;

				const shapes = SVGLoader.createShapes(path);

				for (const shape of shapes) {

					const geometry = new ShapeGeometry(shape);
					if (geometry) {

						this.geomColor(geometry, this.color, opacity);

						let gg = new BufferGeometry().copy(geometry).toNonIndexed();
						gg.translate(0, 0, -layer * this.layerUp);
						geom.push(gg);

						layer++;
					}

				}
			}

			// STROKE
			const strokeColor = path.userData.style.stroke;
			if (this.stroke && strokeColor !== undefined && strokeColor !== 'none') {

				this.color.setStyle(strokeColor);
				opacity = path.userData.style.strokeOpacity;
				if (opacity < this.opacity) this.opacity = opacity;

				for (const subPath of path.subPaths) {

					const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style, 6);
					if (geometry) {
						this.geomColor(geometry, this.color, opacity);

						geometry.translate(0, 0, -layer * this.layerUp);

						//console.log(geometry)
						geom.push(geometry);

						layer++;
					}
				}
			}

		}

		return geom;

	}

	toMesh() {

		let s = this.size;

		if (this.geometry) this.geometry.dispose();

		let tmpG = this.toGeometry();

		if (tmpG) {
			this.geometry = mergeGeometries(tmpG);
			this.geometry.scale(s, -s, s);
			this.geometry.rotateY(Math.PI);
			this.geometry.rotateZ(-Math.PI * 0.5);
			this.geometry.rotateY(Math.PI * 0.5);
			this.geometry.computeBoundingSphere();
		} else {
			this.geometry = new BufferGeometry();
		}

		if (this.material === null) {
			this.material = new MeshBasicMaterial({ vertexColors: true, transparent: this.opacity !== 1, side: DoubleSide });
			this.material.defines = { 'USE_COLOR_ALPHA': '' };
		}

	}

	dispose() {

		if (this.material && !this.outMaterial) this.material.dispose();
		if (this.geometry) this.geometry.dispose();
	}

}

class JointDebug extends Basic3D {

	constructor(o = {}) {

		super();

		this.type = 'joint';
		this.mode = o.mode || 'hinge';
		this.isJoint = true;


		this.mtx = new Matrix4();
		this.size = o.helperSize || 0.1;

		let material = Mat.get('line');

		switch (this.mode) {
			case 'hinge': case 'slider':
				let mat = Mat.get('svg');
				let dt = {
					min: -180,
					max: 180,
					fill: false,
					stroke: true,
					wireframe: false,
					size: 0.05
				};

				if (o.lm) {
					dt.min = o.lm[0];
					dt.max = o.lm[1];
				}

				if (o.lmr) { // slider
					dt.min = o.lmr[0];
					dt.max = o.lmr[1];
				}

				this.m1 = new AutoSvg('angle', dt, mat);
				this.m2 = new AutoSvg('needle', dt, mat);

				this.add(this.m1);
				this.add(this.m2);
				break;
			default:
				const geom = Geo.get('joint');
				let g = geom.clone();
				g.scale(this.size, this.size, this.size);
				this.m1 = new LineSegments(g, material);


				this.add(this.m1);

				g = geom.clone();
				g.scale(this.size * 0.8, this.size * 0.8, this.size * 0.8);
				this.m2 = new LineSegments(g, material);
				//this.m2.scale.set( this.size, this.size, this.size)
				this.add(this.m2);


				break;
		}


		this.m1.matrixAutoUpdate = false;
		this.m2.matrixAutoUpdate = false;

		//    this.m2.updateMatrix()
		//    this.m1.updateMatrix()




		this.body1 = null;
		this.body2 = null;

		this.mat1 = new Matrix4();
		this.mat2 = new Matrix4();
		this.end = new Vector3();

		// experimental rotation ?
		//Utils.refAxis( this.mat1, o.axis1 )
		//Utils.refAxis( this.mat2, o.axis2 )

		let qq = new Quaternion();
		if (o.quat1) this.mat1.makeRotationFromQuaternion(qq.fromArray(o.quat1));
		if (o.quat2) this.mat2.makeRotationFromQuaternion(qq.fromArray(o.quat2));

		this.mat1.setPosition(o.pos1[0], o.pos1[1], o.pos1[2]);
		this.mat2.setPosition(o.pos2[0], o.pos2[1], o.pos2[2]);


		const positions = [0, 0, 0, 0, 0, 0];
		const colors = [1, 0, 0, 1, 0, 0];
		const gline = new BufferGeometry();
		gline.setAttribute('position', new Float32BufferAttribute(positions, 3));
		gline.setAttribute('color', new Float32BufferAttribute(colors, 3));
		gline.computeBoundingSphere();


		this.m3 = new LineSegments(gline, material);
		this.add(this.m3);
		this.m3.matrixAutoUpdate = false;

		this.pp = this.m3.geometry.attributes.position;

	}

	update() {

		if (!this.visible) return

		if (this.body1) {
			this.matrix.copy(this.body1.matrixWorld).multiply(this.mat1);
		} else {
			this.matrix.copy(this.mat1);
		}

		if (this.body2) {
			this.m2.matrix.copy(this.body2.matrixWorld).multiply(this.mat2);
		} else {
			this.m2.matrix.copy(this.mat2);
		}

		this.m2.matrix.premultiply(this.matrix.clone().invert());
		this.end.setFromMatrixPosition(this.m2.matrix);





		//m.matrix = b.matrixWorld;
		//m.matrixAutoUpdate = false;

		//this.position.fromArray( r, n );
		//this.quaternion.fromArray( r, n + 3 );

		//this.updateMatrix();

		//this.m2.position.fromArray( r, n+7 );
		//this.m2.quaternion.fromArray( r, n+10 );
		//this.m2.matrix.compose( this.m2.position, this.m2.quaternion, {x:1,y:1,z:1} );

		//this.mtx.copy( this.matrix ).invert().multiply( this.m2.matrix );
		//this.mtx.decompose( this.m2.position, this.m2.quaternion, {x:1,y:1,z:1} );
		//this.m2.updateMatrix();

		//const position = this.m3.geometry.attributes.position;
		//position.setXYZ(1, this.m2.position.x, this.m2.position.y, this.m2.position.z)

		this.pp.setXYZ(1, this.end.x, this.end.y, this.end.z);
		this.pp.needsUpdate = true;

		if (this.mode === 'slider') {
			this.m1.position.copy(this.end);
			this.m1.updateMatrix();
		}

		if (!this.visible) this.visible = true;

	}

	updateFromPhy(r, n = 0) {

		//if( !this.isVisible ) return
		if (!this.visible) return


		//m.matrix = b.matrixWorld;
		//m.matrixAutoUpdate = false;

		this.position.fromArray(r, n);
		this.quaternion.fromArray(r, n + 3);

		this.updateMatrix();

		this.m2.position.fromArray(r, n + 7);
		this.m2.quaternion.fromArray(r, n + 10);
		this.m2.matrix.compose(this.m2.position, this.m2.quaternion, { x: 1, y: 1, z: 1 });

		this.mtx.copy(this.matrix).invert().multiply(this.m2.matrix);
		this.mtx.decompose(this.m2.position, this.m2.quaternion, { x: 1, y: 1, z: 1 });
		this.m2.updateMatrix();


		this.pp.setXYZ(1, this.m2.position.x, this.m2.position.y, this.m2.position.z);
		this.pp.needsUpdate = true;

		if (this.mode === 'slider') {
			this.m1.position.copy(this.m2.position);
			this.m1.updateMatrix();
		}

		if (!this.visible) this.visible = true;

	}

	dispose() {

		if (this.body1) this.body1.link--;
		if (this.body2) this.body2.link--;

		this.m1.geometry.dispose();
		this.m2.geometry.dispose();
		this.m3.geometry.dispose();
		this.children = [];

	}

}

//----------------
//  MOTOR JOINT 
//----------------

class Joint extends Item {

	constructor() {

		super();

		this.Utils = Utils;

		this.type = 'joint';

		this.v1 = new Vector3();
		this.v2 = new Vector3();

	}

	step() {

		const AR = root.Ar;
		const N = root.ArPos[this.type];

		let i = this.list.length, j, n;

		while (i--) {

			j = this.list[i];
			n = N + (i * Num.joint);
			if (Num.joint === 16) j.updateFromPhy(AR, n);
			else j.update();

		}

	}

	///

	add(o = {}) {

		let name = this.setName(o);

		let body1 = null;
		let body2 = null;
		let isString;

		if (o.limit) o.lm = o.limit;
		else if (o.lm) o.limit = o.lm;

		// get the bodys

		if (o.b1) {
			isString = typeof o.b1 === 'string';
			body1 = isString ? Utils.byName(o.b1) : o.b1;
			if (!isString) o.b1 = o.b1.name;
			if (body1) body1.link++;
		}

		if (o.b2) {
			isString = typeof o.b2 === 'string';
			body2 = isString ? Utils.byName(o.b2) : o.b2;
			if (!isString) o.b2 = o.b2.name;
			if (body2) body2.link++;
		}

		// world to local

		if (o.worldPos) o.worldAnchor = o.worldPos;
		if (o.worldAnchor) {

			this.v1.fromArray(o.worldAnchor);
			this.v2.fromArray(o.worldAnchor);

			o.pos1 = body1 ? Utils.toLocal(this.v1, body1).toArray() : o.worldAnchor;
			o.pos2 = body2 ? Utils.toLocal(this.v2, body2).toArray() : o.worldAnchor;

			delete o.worldAnchor;

		}

		if (o.worldAxis) {

			this.v1.fromArray(o.worldAxis);
			this.v2.fromArray(o.worldAxis);

			o.axis1 = body1 ? Utils.toLocal(this.v1, body1, true).toArray() : o.worldAxis;
			o.axis2 = body2 ? Utils.toLocal(this.v2, body2, true).toArray() : o.worldAxis;

			//o.quat1 = new Quaternion().setFromUnitVectors( new Vector3(1, 0, 0), new Vector3().fromArray(o.axis1).normalize() ).toArray();
			//o.quat2 = new Quaternion().setFromUnitVectors( new Vector3(1, 0, 0), new Vector3().fromArray(o.axis2).normalize() ).toArray();

			//console.log(o.worldAxis, o.axis1, o.axis2)

			delete o.worldAxis;

		}

		if (o.worldQuat) {

			o.quat1 = Utils.quatLocal(o.worldQuat, body1);
			o.quat2 = Utils.quatLocal(o.worldQuat, body2);

			if (root.engine === 'OIMO' || root.engine === 'HAVOK') {

				//this.v1.fromArray( math.quadToAxisArray( o.worldQuat ) ).normalize()
				//this.v2.fromArray( math.quadToAxisArray( o.worldQuat ) ).normalize()

				//o.axis1 = Utils.axisLocal( math.quadToAxisArray( o.worldQuat ), body1)//this.v1.fromArray( math.quadToAxisArray( o.quat1 ) ).normalize().toArray()
				//o.axis2 = Utils.axisLocal( math.quadToAxisArray( o.worldQuat ), body2)//this.v2.fromArray( math.quadToAxisArray( o.quat2 ) ).normalize().toArray()

				o.axis1 = Utils.axisLocal(MathTool.quatToAxis(o.worldQuat), body1);
				o.axis2 = Utils.axisLocal(MathTool.quatToAxis(o.worldQuat), body2);

				//o.axis1 = body1 ? Utils.toLocal( this.v1, body1, true ).toArray():[1,0,0]
				//o.axis2 = body2 ? Utils.toLocal( this.v2, body2, true ).toArray():[1,0,0]

			}
			/*this.v1.fromArray( o.worldAxis ) 
			this.v2.fromArray( o.worldAxis )

			o.axis1 = body1 ? Utils.toLocal( this.v1, body1, true ).normalize().toArray():o.worldAxis
			o.axis2 = body2 ? Utils.toLocal( this.v2, body2, true ).normalize().toArray():o.worldAxis
*/
			//o.quat1 = new Quaternion().setFromUnitVectors( new Vector3(1, 0, 0), new Vector3().fromArray(o.axis1).normalize() ).toArray();
			//o.quat2 = new Quaternion().setFromUnitVectors( new Vector3(1, 0, 0), new Vector3().fromArray(o.axis2).normalize() ).toArray();

			//console.log(o.worldQuat, o.quat1, o.quat2)

			delete o.worldQuat;

		}

		if (!o.axis1) o.axis1 = [1, 0, 0];
		if (!o.axis2) o.axis2 = [1, 0, 0];

		if (!o.pos1) o.pos1 = [0, 0, 0];
		if (!o.pos2) o.pos2 = [0, 0, 0];

		/*if( o.b2 ) body2 = typeof o.b2 !== 'string' ? o.b2 : Utils.byName(o.b2)
		if( o.b1 && typeof o.b1 !== 'string') o.b1 = o.b1.name;
		if( o.b2 && typeof o.b2 !== 'string') o.b2 = o.b2.name;*/

		if (o.rot1 !== undefined) { o.quat1 = MathTool.quatFromEuler(o.rot1); delete (o.rot1); }
		if (o.rot2 !== undefined) { o.quat2 = MathTool.quatFromEuler(o.rot2); delete (o.rot2); }

		if (!o.quat1) o.quat1 = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0), new Vector3().fromArray(o.axis1).normalize()).toArray();
		if (!o.quat2) o.quat2 = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0), new Vector3().fromArray(o.axis2).normalize()).toArray();

		if (o.drivePosition) if (o.drivePosition.rot !== undefined) { o.drivePosition.quat = MathTool.quatFromEuler(o.drivePosition.rot); delete (o.drivePosition.rot); }

		let j = new JointDebug(o);
		j.name = name;
		j.body1 = body1;
		j.body2 = body2;

		if (o.visible === undefined) o.visible = root.jointVisible || false;

		// apply option
		this.set(o, j);

		// add to world
		this.addToWorld(j, o.id);

		// add to worker 
		root.post({ m: 'add', o: o });

		return j;

	}

	set(o = {}, j = null) {

		if (j === null) j = this.byName(o.name);
		if (j === null) return;
		if (o.visible !== undefined) j.visible = o.visible;

	}

}

class Contact extends Item {

	constructor() {

		super();

		this.Utils = Utils;
		this.type = 'contact';

	}

	step() {

		const AR = root.Ar;
		const N = root.ArPos[this.type];

		let i = this.list.length, c, n;

		while (i--) {

			c = this.list[i];

			n = N + (i * Num.contact);

			//c.update( AR.slice( n, n+8 ) )
			c.update(AR, n);

		}

	}

	add(o = {}) {

		this.setName(o);

		let c = new Pair(o);

		if (o.callback) delete (o.callback);

		// add to world
		this.addToWorld(c, o.id);

		// add to worker 
		root.post({ m: 'add', o: o });

		return c;

	}


}


class Pair {

	constructor(o = {}) {

		this.type = 'contact';

		this.name = o.name;
		this.callback = o.callback || function () { };

		this.b1 = o.b1 || null;
		this.b2 = o.b2 || null;
		this.ignore = o.ignore || [];

		this.always = o.always !== undefined ? o.always : true;
		this.simple = o.simple || false;

		this.data = {

			hit: false,
			point: [0, 0, 0],
			normal: [0, 0, 0],
			//object: null,
		};

	}

	update(r, n = 0) {
		let hitChange = this.data.hit;
		this.data.hit = r[n] > 0 ? true : false;
		hitChange = this.data.hit !== hitChange

		if (!this.simple) {

			this.data.point = [r[n + 1], r[n + 2], r[n + 3]];
			this.data.normal = [r[n + 4], r[n + 5], r[n + 6]];

		}

		if (hitChange || this.always) this.callback(this.data);

	}


}

// THREE VEHICLE

class Vehicle extends Item {

	constructor() {

		super();

		this.Utils = Utils;
		this.type = 'vehicle';
		this.num = Num[this.type];

	}

	step() {

		const AR = root.Ar;
		const N = root.ArPos[this.type];

		let i = this.list.length, n, s;

		while (i--) {

			s = this.list[i];
			n = N + (i * this.num);
			s.step(AR, n);

		}

	}

	add(o = {}) {

		this.setName(o);
		const car = new Car(o);

		// add to world
		this.addToWorld(car, o.id);

		// add to physics
		root.post({ m: 'add', o: car.o });

		return car

	}

	set(o = {}, b = null) {

		if (b === null) b = this.byName(o.name);
		if (b === null) return

	}

}



// CAR

class Car extends Basic3D {//extends Object3D {

	constructor(o) {

		super();

		// extra function // ex car selection
		if (o.extra) {
			this.extra = o.extra;
			delete o.extra;
		}

		this.type = 'vehicle';
		this.name = o.name || 'car';
		this.isRay = o.ray || false;
		//this.withBody = false;
		this.actif = false;
		//this.position = new THREE.Vector3();
		this.steering = 0;
		this.suspension = [];
		this.rolling = [];
		this.init(o);

	}

	drive() {

	}

	raycast() {
		return
	}

	init(o) {

		this.mass = o.mass || 2000;

		this.model = null;

		//this.decal = o.bodyDecalY || 0;
		//this.circum = (Math.PI * 2 * o.radius);// in metter

		// CHASSIS
		this.size = o.size || [0.85 * 2, 0.5 * 2, 2.5 * 2];
		this.massCenter = o.massCenter || [0, 0.55, 1.594];
		this.chassisPos = o.chassisPos || [0, 0.83, 0];

		this.maxSteering = o.maxSteering || 24;
		this.incSteering = o.incSteering || 2;

		this.s_travel = o.s_travel || 0.4;
		this.s_ratio = 1 / (this.s_travel * 0.5);
		this.decaly = root.engine === 'PHYSX' ? this.s_travel * 0.5 : 0;


		//this.diff = math.vecSub( this.chassisPos, this.massCenter )
		//this.diff[2] = 0

		// WHEELS
		this.numWheel = o.numWheel || 4;
		this.radius = o.radius || 0.35;
		this.radiusBack = o.radiusBack || this.radius;
		this.deep = o.deep || 0.3;
		this.deepBack = o.deepBack || this.deep;

		let byAxe = this.numWheel < 4 ? 1 : 2;

		if (!o.wPos) o.wPos = [0.8, 0.1, 1.4];

		if (o.wPos) {

			this.wPos = o.wPos;

			var p, wp = o.wPos, axe, pp = [], s = 1, back = 0, y, x, z, pzz;
			wp.length === 3 ? true : false;
			wp.length === 4 ? true : false;

			for (let i = 0; i < this.numWheel; i++) {

				s = i % 2 === 0 ? -1 : 1;
				axe = Math.floor(i * 0.5);
				back = i >= byAxe ? true : false;

				y = wp[1];
				if (y === 0) y = back ? this.radiusBack : this.radius;

				x = wp[0];
				//if( x === 0 ) x = (back ? this.deepBack : this.deep)*0.5
				if (x instanceof Array) x = wp[0][axe];

				z = back ? -wp[2] : wp[2];
				if (wp[2] instanceof Array) z = wp[2][axe];




				p = [x * s, y, z];

				pp.push(p);

			}

			//console.log(this.name, pp)

			this.wheelsPosition = pp;
			delete o.wPos;

		}

		if (o.wheelsPosition) this.wheelsPosition = o.wheelsPosition;

		//console.log(this.wheelsPosition)

		const scale = o.meshScale || 1;


		const chassisShapes = [];// { type:'convex', shape:bodyShape, pos:[0,0,0], flag:8|2|1 } ];//, isExclusive:true

		//if( o.chassisShape ) chassisShapes.push( { type:'convex', shape:o.chassisShape, pos:[0,0,0], flag:8|2|1 } );
		//else chassisShapes.push( { type:'box', size:this.size, pos:[0,0,0], flag:8|2|1 } );

		if (o.chassisShape) chassisShapes.push({ type: 'convex', shape: o.chassisShape, size: [scale], pos: this.chassisPos, filter: [1, -1, 0, 0], isExclusive: true, ray: this.isRay });
		else chassisShapes.push({ type: 'box', size: this.size, pos: this.chassisPos });

		for (let i = 0; i < this.numWheel; i++) {
			if (i < byAxe) chassisShapes.push({ type: 'cylinder', size: [this.radius, this.deep], isWheel: true, radius: o.rad || 0.05, shadow: false, ray: false });
			else chassisShapes.push({ type: 'cylinder', size: [this.radiusBack, this.deepBack], isWheel: true, radius: o.rad || 0.05, shadow: false, ray: false });

		}

		/*for( var i=0; i < o.numWheel; i++ ){

			if( this.radiusBack !== this.radius ){
				if(i<2) chassisShapes.push( { type:'convex', shape:wheelShape, pos:[0,0,0] } );
				else chassisShapes.push(  { type:'convex', shape:wheelShapeBack, pos:[0,0,0] } );
			} else {
				chassisShapes.push(  { type:'convex', shape:wheelShape, pos:[0,0,0] } );
			}

		}*/

		var material = Mat.get(o.debug ? 'debug' : (o.chassisMesh === undefined ? 'body' : 'hide'));
		//if( o.body === undefined ) material = 'move';

		let n;

		for (let i = 0; i < chassisShapes.length; i++) {
			n = chassisShapes[i];
			if (n.pos) n.localPos = n.pos;
			n.size = MathTool.autoSize(n.size, n.type);
			root.items.body.geometry(n, this, material);
		}

		//if( o.chassisShape ) console.log(  )


		let m;

		if (o.chassisMesh) {
			m = o.noClone ? o.chassisMesh : o.chassisMesh.clone();
			m.position.set(0, 0, 0);
			Utils.noRay(m);
			m.scale.set(scale, scale, scale);
			this.children[0].add(m);
			this.model = m;
			delete o.chassisMesh;

			//this.chassis.children[0].castShadow = false;
			//this.chassis.children[0].receiveShadow = false;
		}


		//let back = false, 

		// wheel model
		if (o.wheelMesh) {


			for (let i = 1; i < this.numWheel + 1; i++) {
				back = i >= byAxe + 1;
				if (o.wheelMeshBack) m = back ? o.wheelMeshBack.clone() : o.wheelMesh.clone();
				else m = o.wheelMesh.clone();
				Utils.noRay(m);
				m.position.set(0, 0, 0);
				if (i == 2 || i == 4) m.scale.set(-scale, scale, scale);
				else m.scale.set(scale, scale, scale);
				this.children[i].add(m);

				//this.chassis.children[i].castShadow = false;
				//this.chassis.children[i].receiveShadow = false;
			}
			delete o.wheelMesh;
		}



		// suspension model
		if (o.suspensionMesh) {

			this.suspensionMesh = [];

			for (let i = 1; i < this.numWheel + 1; i++) {

				m = o.suspensionMesh.clone();
				Utils.noRay(m);
				m.position.set(0, 0, 0);
				m.position.fromArray(this.wheelsPosition[i - 1]);
				m.position.x = 0;
				if (i == 2 || i == 4) m.scale.set(scale, scale, scale);
				else m.scale.set(-scale, scale, scale);
				this.children[0].add(m);
				this.suspensionMesh.push(m);

			}
			delete o.suspensionMesh;

		}

		// suspension model
		if (o.brakeMesh) {

			this.brake = [];

			for (let i = 1; i < this.numWheel + 1; i++) {
				back = i > 2;
				if (o.brakeMeshBack) m = back ? o.brakeMeshBack.clone() : o.brakeMesh.clone();
				else m = o.brakeMesh.clone();
				Utils.noRay(m);
				m.position.set(0, 0, 0);
				m.position.fromArray(this.wheelsPosition[i - 1]);
				if (o.brakeMeshBack) pzz = scale;
				else pzz = back ? scale : -scale;
				if (i == 2 || i == 4) m.scale.set(-scale, scale, pzz);
				else m.scale.set(scale, scale, pzz);
				this.children[0].add(m);
				this.brake.push(m);

			}
			delete o.brakeMesh;

		}

		o.mass = this.mass;

		o.size = o.chassisShape ? chassisShapes[0].boxSize : this.size;
		o.numWheel = this.numWheel;
		o.wheelsPosition = this.wheelsPosition;
		o.radius = this.radius;
		o.radiusBack = this.radiusBack;
		o.deep = this.deep;
		o.deepBack = this.deepBack;

		o.chassisShape = chassisShapes[0];

		o.maxSteering = this.maxSteering;
		o.incSteering = this.incSteering;
		o.s_travel = this.s_travel;

		o.massCenter = this.massCenter;
		o.chassisPos = this.chassisPos;

		this.o = o;

	}

	respawn(o) {

		//{ pos:[0,0,0], rot:[0,0,0], keepVelocity:false }

		o = o || {};
		o.respawn = true;
		o.name = this.name;

		if (o.keepRotation) o.quat = this.quaternion.toArray();


		//root.view.up( o );
		root.motor.change(o);

	}

	move() {

		/*phy.update({ 
			name:this.name,
			key: key
		});*/
	}

	dispose() {

		/*if(this.withBody){
			root.content.remove( this.body );
		}*/

		//root.remove( this.name + '_chassis' );
	}

	step(AR, n) {

		if (!this.actif) {
			let a = AR[n + 0] + AR[n + 1] + AR[n + 2] + AR[n + 3] + AR[n + 4] + AR[n + 5] + AR[n + 6] + AR[n + 7];
			if (a === 0) return;
			else this.actif = true;
		}



		this.position.fromArray(AR, n + 1);
		this.quaternion.fromArray(AR, n + 4);
		this.updateMatrix();

		let num = this.numWheel + 1;
		let mesh;
		let s1 = 0, s2 = 0;
		let sp = [];
		let k = 0;

		for (let i = 0; i < num; i++) {

			k = (i * 8) + n;

			if (i === 0) ((AR[k]) / this.circum);
			if (i === 1) s1 = AR[k];
			if (i === 2) s2 = AR[k];

			mesh = this.children[i];


			if (mesh && i > 0) {

				//sp[i-1] = this.wheelsPosition[i-1][1] - AR[k+2]
				sp[i - 1] = (this.wheelsPosition[i - 1][1] - this.decaly) - AR[k + 2];

				// local

				mesh.position.fromArray(AR, k + 1);
				//mesh.position.y += this.massCenter[1]
				mesh.quaternion.fromArray(AR, k + 4);

				this.rolling[i - 1] = mesh.rotation.x;

				if (this.brake) {
					this.brake[i - 1].position.copy(mesh.position);
					if (i == 1 || i == 2) this.brake[i - 1].rotation.y = AR[k];
				}

			}

		}


		k = 4;
		while (k--) {

			this.suspension[k] = MathTool.clamp(sp[k] * this.s_ratio, -1, 1);

			if (this.suspensionMesh) {
				if (this.suspension[k] > 0) {
					Utils.morph(this.suspensionMesh[k].children[0], 'low', this.suspension[k]);
					Utils.morph(this.suspensionMesh[k].children[0], 'top', 0);
				} else {
					Utils.morph(this.suspensionMesh[k].children[0], 'low', 0);
					Utils.morph(this.suspensionMesh[k].children[0], 'top', -this.suspension[k]);
				}
			}

		}

		this.steering = Math.round(((s1 + s2) * 0.5) * todeg$1) / this.maxSteering;

		//console.log(this.steering)
		//console.log(acc)




	}
}

/**
 * The KHR_mesh_quantization extension allows these extra attribute component types
 *
 * @see https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_mesh_quantization/README.md#extending-mesh-attributes
 */
const KHR_mesh_quantization_ExtraAttrTypes = {
	POSITION: [
		'byte',
		'byte normalized',
		'unsigned byte',
		'unsigned byte normalized',
		'short',
		'short normalized',
		'unsigned short',
		'unsigned short normalized',
	],
	NORMAL: [
		'byte normalized',
		'short normalized',
	],
	TANGENT: [
		'byte normalized',
		'short normalized',
	],
	TEXCOORD: [
		'byte',
		'byte normalized',
		'unsigned byte',
		'short',
		'short normalized',
		'unsigned short',
	],
};


class GLTFExporter {

	constructor() {

		this.pluginCallbacks = [];

		this.register(function (writer) {

			return new GLTFLightExtension(writer);

		});

		this.register(function (writer) {

			return new GLTFMaterialsUnlitExtension$1(writer);

		});

		this.register(function (writer) {

			return new GLTFMaterialsTransmissionExtension$1(writer);

		});

		this.register(function (writer) {

			return new GLTFMaterialsVolumeExtension$1(writer);

		});

		this.register(function (writer) {

			return new GLTFMaterialsIorExtension$1(writer);

		});

		this.register(function (writer) {

			return new GLTFMaterialsSpecularExtension$1(writer);

		});

		this.register(function (writer) {

			return new GLTFMaterialsClearcoatExtension$1(writer);

		});

		this.register(function (writer) {

			return new GLTFMaterialsIridescenceExtension$1(writer);

		});

		this.register(function (writer) {

			return new GLTFMaterialsSheenExtension$1(writer);

		});

		this.register(function (writer) {

			return new GLTFMaterialsEmissiveStrengthExtension$1(writer);

		});

	}

	register(callback) {

		if (this.pluginCallbacks.indexOf(callback) === - 1) {

			this.pluginCallbacks.push(callback);

		}

		return this;

	}

	unregister(callback) {

		if (this.pluginCallbacks.indexOf(callback) !== - 1) {

			this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(callback), 1);

		}

		return this;

	}

	/**
	 * Parse scenes and generate GLTF output
	 * @param  {Scene or [THREE.Scenes]} input   Scene or Array of THREE.Scenes
	 * @param  {Function} onDone  Callback on completed
	 * @param  {Function} onError  Callback on errors
	 * @param  {Object} options options
	 */
	parse(input, onDone, onError, options) {

		const writer = new GLTFWriter();
		const plugins = [];

		for (let i = 0, il = this.pluginCallbacks.length; i < il; i++) {

			plugins.push(this.pluginCallbacks[i](writer));

		}

		writer.setPlugins(plugins);
		writer.write(input, onDone, options).catch(onError);

	}

	parseAsync(input, options) {

		const scope = this;

		return new Promise(function (resolve, reject) {

			scope.parse(input, resolve, reject, options);

		});

	}

}

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const WEBGL_CONSTANTS$1 = {
	POINTS: 0x0000,
	LINES: 0x0001,
	LINE_LOOP: 0x0002,
	LINE_STRIP: 0x0003,
	TRIANGLES: 0x0004,
	TRIANGLE_STRIP: 0x0005,
	TRIANGLE_FAN: 0x0006,

	BYTE: 0x1400,
	UNSIGNED_BYTE: 0x1401,
	SHORT: 0x1402,
	UNSIGNED_SHORT: 0x1403,
	INT: 0x1404,
	UNSIGNED_INT: 0x1405,
	FLOAT: 0x1406,

	ARRAY_BUFFER: 0x8892,
	ELEMENT_ARRAY_BUFFER: 0x8893,

	NEAREST: 0x2600,
	LINEAR: 0x2601,
	NEAREST_MIPMAP_NEAREST: 0x2700,
	LINEAR_MIPMAP_NEAREST: 0x2701,
	NEAREST_MIPMAP_LINEAR: 0x2702,
	LINEAR_MIPMAP_LINEAR: 0x2703,

	CLAMP_TO_EDGE: 33071,
	MIRRORED_REPEAT: 33648,
	REPEAT: 10497
};

const KHR_MESH_QUANTIZATION = 'KHR_mesh_quantization';

const THREE_TO_WEBGL = {};

THREE_TO_WEBGL[NearestFilter] = WEBGL_CONSTANTS$1.NEAREST;
THREE_TO_WEBGL[NearestMipmapNearestFilter] = WEBGL_CONSTANTS$1.NEAREST_MIPMAP_NEAREST;
THREE_TO_WEBGL[NearestMipmapLinearFilter] = WEBGL_CONSTANTS$1.NEAREST_MIPMAP_LINEAR;
THREE_TO_WEBGL[LinearFilter] = WEBGL_CONSTANTS$1.LINEAR;
THREE_TO_WEBGL[LinearMipmapNearestFilter] = WEBGL_CONSTANTS$1.LINEAR_MIPMAP_NEAREST;
THREE_TO_WEBGL[LinearMipmapLinearFilter] = WEBGL_CONSTANTS$1.LINEAR_MIPMAP_LINEAR;

THREE_TO_WEBGL[ClampToEdgeWrapping] = WEBGL_CONSTANTS$1.CLAMP_TO_EDGE;
THREE_TO_WEBGL[RepeatWrapping] = WEBGL_CONSTANTS$1.REPEAT;
THREE_TO_WEBGL[MirroredRepeatWrapping] = WEBGL_CONSTANTS$1.MIRRORED_REPEAT;

const PATH_PROPERTIES$1 = {
	scale: 'scale',
	position: 'translation',
	quaternion: 'rotation',
	morphTargetInfluences: 'weights'
};

const DEFAULT_SPECULAR_COLOR = new Color();

// GLB constants
// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#glb-file-format-specification

const GLB_HEADER_BYTES = 12;
const GLB_HEADER_MAGIC = 0x46546C67;
const GLB_VERSION = 2;

const GLB_CHUNK_PREFIX_BYTES = 8;
const GLB_CHUNK_TYPE_JSON = 0x4E4F534A;
const GLB_CHUNK_TYPE_BIN = 0x004E4942;

//------------------------------------------------------------------------------
// Utility functions
//------------------------------------------------------------------------------

/**
 * Compare two arrays
 * @param  {Array} array1 Array 1 to compare
 * @param  {Array} array2 Array 2 to compare
 * @return {Boolean}        Returns true if both arrays are equal
 */
function equalArray(array1, array2) {

	return (array1.length === array2.length) && array1.every(function (element, index) {

		return element === array2[index];

	});

}

/**
 * Converts a string to an ArrayBuffer.
 * @param  {string} text
 * @return {ArrayBuffer}
 */
function stringToArrayBuffer(text) {

	return new TextEncoder().encode(text).buffer;

}

/**
 * Is identity matrix
 *
 * @param {Matrix4} matrix
 * @returns {Boolean} Returns true, if parameter is identity matrix
 */
function isIdentityMatrix(matrix) {

	return equalArray(matrix.elements, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

}

/**
 * Get the min and max vectors from the given attribute
 * @param  {BufferAttribute} attribute Attribute to find the min/max in range from start to start + count
 * @param  {Integer} start
 * @param  {Integer} count
 * @return {Object} Object containing the `min` and `max` values (As an array of attribute.itemSize components)
 */
function getMinMax(attribute, start, count) {

	const output = {

		min: new Array(attribute.itemSize).fill(Number.POSITIVE_INFINITY),
		max: new Array(attribute.itemSize).fill(Number.NEGATIVE_INFINITY)

	};

	for (let i = start; i < start + count; i++) {

		for (let a = 0; a < attribute.itemSize; a++) {

			let value;

			if (attribute.itemSize > 4) {

				// no support for interleaved data for itemSize > 4

				value = attribute.array[i * attribute.itemSize + a];

			} else {

				if (a === 0) value = attribute.getX(i);
				else if (a === 1) value = attribute.getY(i);
				else if (a === 2) value = attribute.getZ(i);
				else if (a === 3) value = attribute.getW(i);

				if (attribute.normalized === true) {

					value = MathUtils.normalize(value, attribute.array);

				}

			}

			output.min[a] = Math.min(output.min[a], value);
			output.max[a] = Math.max(output.max[a], value);

		}

	}

	return output;

}

/**
 * Get the required size + padding for a buffer, rounded to the next 4-byte boundary.
 * https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#data-alignment
 *
 * @param {Integer} bufferSize The size the original buffer.
 * @returns {Integer} new buffer size with required padding.
 *
 */
function getPaddedBufferSize(bufferSize) {

	return Math.ceil(bufferSize / 4) * 4;

}

/**
 * Returns a buffer aligned to 4-byte boundary.
 *
 * @param {ArrayBuffer} arrayBuffer Buffer to pad
 * @param {Integer} paddingByte (Optional)
 * @returns {ArrayBuffer} The same buffer if it's already aligned to 4-byte boundary or a new buffer
 */
function getPaddedArrayBuffer(arrayBuffer, paddingByte = 0) {

	const paddedLength = getPaddedBufferSize(arrayBuffer.byteLength);

	if (paddedLength !== arrayBuffer.byteLength) {

		const array = new Uint8Array(paddedLength);
		array.set(new Uint8Array(arrayBuffer));

		if (paddingByte !== 0) {

			for (let i = arrayBuffer.byteLength; i < paddedLength; i++) {

				array[i] = paddingByte;

			}

		}

		return array.buffer;

	}

	return arrayBuffer;

}

function getCanvas() {

	if (typeof document === 'undefined' && typeof OffscreenCanvas !== 'undefined') {

		return new OffscreenCanvas(1, 1);

	}

	return document.createElement('canvas');

}

function getToBlobPromise(canvas, mimeType) {

	if (canvas.toBlob !== undefined) {

		return new Promise((resolve) => canvas.toBlob(resolve, mimeType));

	}

	let quality;

	// Blink's implementation of convertToBlob seems to default to a quality level of 100%
	// Use the Blink default quality levels of toBlob instead so that file sizes are comparable.
	if (mimeType === 'image/jpeg') {

		quality = 0.92;

	} else if (mimeType === 'image/webp') {

		quality = 0.8;

	}

	return canvas.convertToBlob({

		type: mimeType,
		quality: quality

	});

}

/**
 * Writer
 */
class GLTFWriter {

	constructor() {

		this.plugins = [];

		this.options = {};
		this.pending = [];
		this.buffers = [];

		this.byteOffset = 0;
		this.buffers = [];
		this.nodeMap = new Map();
		this.skins = [];

		this.extensionsUsed = {};
		this.extensionsRequired = {};

		this.uids = new Map();
		this.uid = 0;

		this.json = {
			asset: {
				version: '2.0',
				generator: 'THREE.GLTFExporter'
			}
		};

		this.cache = {
			meshes: new Map(),
			attributes: new Map(),
			attributesNormalized: new Map(),
			materials: new Map(),
			textures: new Map(),
			images: new Map()
		};

	}

	setPlugins(plugins) {

		this.plugins = plugins;

	}

	/**
	 * Parse scenes and generate GLTF output
	 * @param  {Scene or [THREE.Scenes]} input   Scene or Array of THREE.Scenes
	 * @param  {Function} onDone  Callback on completed
	 * @param  {Object} options options
	 */
	async write(input, onDone, options = {}) {

		this.options = Object.assign({
			// default options
			binary: false,
			trs: false,
			onlyVisible: true,
			maxTextureSize: Infinity,
			animations: [],
			includeCustomExtensions: false
		}, options);

		if (this.options.animations.length > 0) {

			// Only TRS properties, and not matrices, may be targeted by animation.
			this.options.trs = true;

		}

		this.processInput(input);

		await Promise.all(this.pending);

		const writer = this;
		const buffers = writer.buffers;
		const json = writer.json;
		options = writer.options;

		const extensionsUsed = writer.extensionsUsed;
		const extensionsRequired = writer.extensionsRequired;

		// Merge buffers.
		const blob = new Blob(buffers, { type: 'application/octet-stream' });

		// Declare extensions.
		const extensionsUsedList = Object.keys(extensionsUsed);
		const extensionsRequiredList = Object.keys(extensionsRequired);

		if (extensionsUsedList.length > 0) json.extensionsUsed = extensionsUsedList;
		if (extensionsRequiredList.length > 0) json.extensionsRequired = extensionsRequiredList;

		// Update bytelength of the single buffer.
		if (json.buffers && json.buffers.length > 0) json.buffers[0].byteLength = blob.size;

		if (options.binary === true) {

			// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#glb-file-format-specification

			const reader = new FileReader();
			reader.readAsArrayBuffer(blob);
			reader.onloadend = function () {

				// Binary chunk.
				const binaryChunk = getPaddedArrayBuffer(reader.result);
				const binaryChunkPrefix = new DataView(new ArrayBuffer(GLB_CHUNK_PREFIX_BYTES));
				binaryChunkPrefix.setUint32(0, binaryChunk.byteLength, true);
				binaryChunkPrefix.setUint32(4, GLB_CHUNK_TYPE_BIN, true);

				// JSON chunk.
				const jsonChunk = getPaddedArrayBuffer(stringToArrayBuffer(JSON.stringify(json)), 0x20);
				const jsonChunkPrefix = new DataView(new ArrayBuffer(GLB_CHUNK_PREFIX_BYTES));
				jsonChunkPrefix.setUint32(0, jsonChunk.byteLength, true);
				jsonChunkPrefix.setUint32(4, GLB_CHUNK_TYPE_JSON, true);

				// GLB header.
				const header = new ArrayBuffer(GLB_HEADER_BYTES);
				const headerView = new DataView(header);
				headerView.setUint32(0, GLB_HEADER_MAGIC, true);
				headerView.setUint32(4, GLB_VERSION, true);
				const totalByteLength = GLB_HEADER_BYTES
					+ jsonChunkPrefix.byteLength + jsonChunk.byteLength
					+ binaryChunkPrefix.byteLength + binaryChunk.byteLength;
				headerView.setUint32(8, totalByteLength, true);

				const glbBlob = new Blob([
					header,
					jsonChunkPrefix,
					jsonChunk,
					binaryChunkPrefix,
					binaryChunk
				], { type: 'application/octet-stream' });

				const glbReader = new FileReader();
				glbReader.readAsArrayBuffer(glbBlob);
				glbReader.onloadend = function () {

					onDone(glbReader.result);

				};

			};

		} else {

			if (json.buffers && json.buffers.length > 0) {

				const reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = function () {

					const base64data = reader.result;
					json.buffers[0].uri = base64data;
					onDone(json);

				};

			} else {

				onDone(json);

			}

		}


	}

	/**
	 * Serializes a userData.
	 *
	 * @param {THREE.Object3D|THREE.Material} object
	 * @param {Object} objectDef
	 */
	serializeUserData(object, objectDef) {

		if (Object.keys(object.userData).length === 0) return;

		const options = this.options;
		const extensionsUsed = this.extensionsUsed;

		try {

			const json = JSON.parse(JSON.stringify(object.userData));

			if (options.includeCustomExtensions && json.gltfExtensions) {

				if (objectDef.extensions === undefined) objectDef.extensions = {};

				for (const extensionName in json.gltfExtensions) {

					objectDef.extensions[extensionName] = json.gltfExtensions[extensionName];
					extensionsUsed[extensionName] = true;

				}

				delete json.gltfExtensions;

			}

			if (Object.keys(json).length > 0) objectDef.extras = json;

		} catch (error) {

			console.warn('THREE.GLTFExporter: userData of \'' + object.name + '\' ' +
				'won\'t be serialized because of JSON.stringify error - ' + error.message);

		}

	}

	/**
	 * Returns ids for buffer attributes.
	 * @param  {Object} object
	 * @return {Integer}
	 */
	getUID(attribute, isRelativeCopy = false) {

		if (this.uids.has(attribute) === false) {

			const uids = new Map();

			uids.set(true, this.uid++);
			uids.set(false, this.uid++);

			this.uids.set(attribute, uids);

		}

		const uids = this.uids.get(attribute);

		return uids.get(isRelativeCopy);

	}

	/**
	 * Checks if normal attribute values are normalized.
	 *
	 * @param {BufferAttribute} normal
	 * @returns {Boolean}
	 */
	isNormalizedNormalAttribute(normal) {

		const cache = this.cache;

		if (cache.attributesNormalized.has(normal)) return false;

		const v = new Vector3();

		for (let i = 0, il = normal.count; i < il; i++) {

			// 0.0005 is from glTF-validator
			if (Math.abs(v.fromBufferAttribute(normal, i).length() - 1.0) > 0.0005) return false;

		}

		return true;

	}

	/**
	 * Creates normalized normal buffer attribute.
	 *
	 * @param {BufferAttribute} normal
	 * @returns {BufferAttribute}
	 *
	 */
	createNormalizedNormalAttribute(normal) {

		const cache = this.cache;

		if (cache.attributesNormalized.has(normal)) return cache.attributesNormalized.get(normal);

		const attribute = normal.clone();
		const v = new Vector3();

		for (let i = 0, il = attribute.count; i < il; i++) {

			v.fromBufferAttribute(attribute, i);

			if (v.x === 0 && v.y === 0 && v.z === 0) {

				// if values can't be normalized set (1, 0, 0)
				v.setX(1.0);

			} else {

				v.normalize();

			}

			attribute.setXYZ(i, v.x, v.y, v.z);

		}

		cache.attributesNormalized.set(normal, attribute);

		return attribute;

	}

	/**
	 * Applies a texture transform, if present, to the map definition. Requires
	 * the KHR_texture_transform extension.
	 *
	 * @param {Object} mapDef
	 * @param {THREE.Texture} texture
	 */
	applyTextureTransform(mapDef, texture) {

		let didTransform = false;
		const transformDef = {};

		if (texture.offset.x !== 0 || texture.offset.y !== 0) {

			transformDef.offset = texture.offset.toArray();
			didTransform = true;

		}

		if (texture.rotation !== 0) {

			transformDef.rotation = texture.rotation;
			didTransform = true;

		}

		if (texture.repeat.x !== 1 || texture.repeat.y !== 1) {

			transformDef.scale = texture.repeat.toArray();
			didTransform = true;

		}

		if (didTransform) {

			mapDef.extensions = mapDef.extensions || {};
			mapDef.extensions['KHR_texture_transform'] = transformDef;
			this.extensionsUsed['KHR_texture_transform'] = true;

		}

	}

	buildMetalRoughTexture(metalnessMap, roughnessMap) {

		if (metalnessMap === roughnessMap) return metalnessMap;

		function getEncodingConversion(map) {

			if (map.encoding === sRGBEncoding) {

				return function SRGBToLinear(c) {

					return (c < 0.04045) ? c * 0.0773993808 : Math.pow(c * 0.9478672986 + 0.0521327014, 2.4);

				};

			}

			return function LinearToLinear(c) {

				return c;

			};

		}

		console.warn('THREE.GLTFExporter: Merged metalnessMap and roughnessMap textures.');

		const metalness = metalnessMap ? metalnessMap.image : null;
		const roughness = roughnessMap ? roughnessMap.image : null;

		const width = Math.max(metalness ? metalness.width : 0, roughness ? roughness.width : 0);
		const height = Math.max(metalness ? metalness.height : 0, roughness ? roughness.height : 0);

		const canvas = getCanvas();
		canvas.width = width;
		canvas.height = height;

		const context = canvas.getContext('2d');
		context.fillStyle = '#00ffff';
		context.fillRect(0, 0, width, height);

		const composite = context.getImageData(0, 0, width, height);

		if (metalness) {

			context.drawImage(metalness, 0, 0, width, height);

			const convert = getEncodingConversion(metalnessMap);
			const data = context.getImageData(0, 0, width, height).data;

			for (let i = 2; i < data.length; i += 4) {

				composite.data[i] = convert(data[i] / 256) * 256;

			}

		}

		if (roughness) {

			context.drawImage(roughness, 0, 0, width, height);

			const convert = getEncodingConversion(roughnessMap);
			const data = context.getImageData(0, 0, width, height).data;

			for (let i = 1; i < data.length; i += 4) {

				composite.data[i] = convert(data[i] / 256) * 256;

			}

		}

		context.putImageData(composite, 0, 0);

		//

		const reference = metalnessMap || roughnessMap;

		const texture = reference.clone();

		texture.source = new Source(canvas);
		texture.encoding = LinearEncoding;

		return texture;

	}

	/**
	 * Process a buffer to append to the default one.
	 * @param  {ArrayBuffer} buffer
	 * @return {Integer}
	 */
	processBuffer(buffer) {

		const json = this.json;
		const buffers = this.buffers;

		if (!json.buffers) json.buffers = [{ byteLength: 0 }];

		// All buffers are merged before export.
		buffers.push(buffer);

		return 0;

	}

	/**
	 * Process and generate a BufferView
	 * @param  {BufferAttribute} attribute
	 * @param  {number} componentType
	 * @param  {number} start
	 * @param  {number} count
	 * @param  {number} target (Optional) Target usage of the BufferView
	 * @return {Object}
	 */
	processBufferView(attribute, componentType, start, count, target) {

		const json = this.json;

		if (!json.bufferViews) json.bufferViews = [];

		// Create a new dataview and dump the attribute's array into it

		let componentSize;

		switch (componentType) {

			case WEBGL_CONSTANTS$1.BYTE:
			case WEBGL_CONSTANTS$1.UNSIGNED_BYTE:

				componentSize = 1;

				break;

			case WEBGL_CONSTANTS$1.SHORT:
			case WEBGL_CONSTANTS$1.UNSIGNED_SHORT:

				componentSize = 2;

				break;

			default:

				componentSize = 4;

		}

		const byteLength = getPaddedBufferSize(count * attribute.itemSize * componentSize);
		const dataView = new DataView(new ArrayBuffer(byteLength));
		let offset = 0;

		for (let i = start; i < start + count; i++) {

			for (let a = 0; a < attribute.itemSize; a++) {

				let value;

				if (attribute.itemSize > 4) {

					// no support for interleaved data for itemSize > 4

					value = attribute.array[i * attribute.itemSize + a];

				} else {

					if (a === 0) value = attribute.getX(i);
					else if (a === 1) value = attribute.getY(i);
					else if (a === 2) value = attribute.getZ(i);
					else if (a === 3) value = attribute.getW(i);

					if (attribute.normalized === true) {

						value = MathUtils.normalize(value, attribute.array);

					}

				}

				if (componentType === WEBGL_CONSTANTS$1.FLOAT) {

					dataView.setFloat32(offset, value, true);

				} else if (componentType === WEBGL_CONSTANTS$1.INT) {

					dataView.setInt32(offset, value, true);

				} else if (componentType === WEBGL_CONSTANTS$1.UNSIGNED_INT) {

					dataView.setUint32(offset, value, true);

				} else if (componentType === WEBGL_CONSTANTS$1.SHORT) {

					dataView.setInt16(offset, value, true);

				} else if (componentType === WEBGL_CONSTANTS$1.UNSIGNED_SHORT) {

					dataView.setUint16(offset, value, true);

				} else if (componentType === WEBGL_CONSTANTS$1.BYTE) {

					dataView.setInt8(offset, value);

				} else if (componentType === WEBGL_CONSTANTS$1.UNSIGNED_BYTE) {

					dataView.setUint8(offset, value);

				}

				offset += componentSize;

			}

		}

		const bufferViewDef = {

			buffer: this.processBuffer(dataView.buffer),
			byteOffset: this.byteOffset,
			byteLength: byteLength

		};

		if (target !== undefined) bufferViewDef.target = target;

		if (target === WEBGL_CONSTANTS$1.ARRAY_BUFFER) {

			// Only define byteStride for vertex attributes.
			bufferViewDef.byteStride = attribute.itemSize * componentSize;

		}

		this.byteOffset += byteLength;

		json.bufferViews.push(bufferViewDef);

		// @TODO Merge bufferViews where possible.
		const output = {

			id: json.bufferViews.length - 1,
			byteLength: 0

		};

		return output;

	}

	/**
	 * Process and generate a BufferView from an image Blob.
	 * @param {Blob} blob
	 * @return {Promise<Integer>}
	 */
	processBufferViewImage(blob) {

		const writer = this;
		const json = writer.json;

		if (!json.bufferViews) json.bufferViews = [];

		return new Promise(function (resolve) {

			const reader = new FileReader();
			reader.readAsArrayBuffer(blob);
			reader.onloadend = function () {

				const buffer = getPaddedArrayBuffer(reader.result);

				const bufferViewDef = {
					buffer: writer.processBuffer(buffer),
					byteOffset: writer.byteOffset,
					byteLength: buffer.byteLength
				};

				writer.byteOffset += buffer.byteLength;
				resolve(json.bufferViews.push(bufferViewDef) - 1);

			};

		});

	}

	/**
	 * Process attribute to generate an accessor
	 * @param  {BufferAttribute} attribute Attribute to process
	 * @param  {THREE.BufferGeometry} geometry (Optional) Geometry used for truncated draw range
	 * @param  {Integer} start (Optional)
	 * @param  {Integer} count (Optional)
	 * @return {Integer|null} Index of the processed accessor on the "accessors" array
	 */
	processAccessor(attribute, geometry, start, count) {

		const json = this.json;

		const types = {

			1: 'SCALAR',
			2: 'VEC2',
			3: 'VEC3',
			4: 'VEC4',
			9: 'MAT3',
			16: 'MAT4'

		};

		let componentType;

		// Detect the component type of the attribute array
		if (attribute.array.constructor === Float32Array) {

			componentType = WEBGL_CONSTANTS$1.FLOAT;

		} else if (attribute.array.constructor === Int32Array) {

			componentType = WEBGL_CONSTANTS$1.INT;

		} else if (attribute.array.constructor === Uint32Array) {

			componentType = WEBGL_CONSTANTS$1.UNSIGNED_INT;

		} else if (attribute.array.constructor === Int16Array) {

			componentType = WEBGL_CONSTANTS$1.SHORT;

		} else if (attribute.array.constructor === Uint16Array) {

			componentType = WEBGL_CONSTANTS$1.UNSIGNED_SHORT;

		} else if (attribute.array.constructor === Int8Array) {

			componentType = WEBGL_CONSTANTS$1.BYTE;

		} else if (attribute.array.constructor === Uint8Array) {

			componentType = WEBGL_CONSTANTS$1.UNSIGNED_BYTE;

		} else {

			throw new Error('THREE.GLTFExporter: Unsupported bufferAttribute component type.');

		}

		if (start === undefined) start = 0;
		if (count === undefined) count = attribute.count;

		// Skip creating an accessor if the attribute doesn't have data to export
		if (count === 0) return null;

		const minMax = getMinMax(attribute, start, count);
		let bufferViewTarget;

		// If geometry isn't provided, don't infer the target usage of the bufferView. For
		// animation samplers, target must not be set.
		if (geometry !== undefined) {

			bufferViewTarget = attribute === geometry.index ? WEBGL_CONSTANTS$1.ELEMENT_ARRAY_BUFFER : WEBGL_CONSTANTS$1.ARRAY_BUFFER;

		}

		const bufferView = this.processBufferView(attribute, componentType, start, count, bufferViewTarget);

		const accessorDef = {

			bufferView: bufferView.id,
			byteOffset: bufferView.byteOffset,
			componentType: componentType,
			count: count,
			max: minMax.max,
			min: minMax.min,
			type: types[attribute.itemSize]

		};

		if (attribute.normalized === true) accessorDef.normalized = true;
		if (!json.accessors) json.accessors = [];

		return json.accessors.push(accessorDef) - 1;

	}

	/**
	 * Process image
	 * @param  {Image} image to process
	 * @param  {Integer} format of the image (RGBAFormat)
	 * @param  {Boolean} flipY before writing out the image
	 * @param  {String} mimeType export format
	 * @return {Integer}     Index of the processed texture in the "images" array
	 */
	processImage(image, format, flipY, mimeType = 'image/png') {

		if (image !== null) {

			const writer = this;
			const cache = writer.cache;
			const json = writer.json;
			const options = writer.options;
			const pending = writer.pending;

			if (!cache.images.has(image)) cache.images.set(image, {});

			const cachedImages = cache.images.get(image);

			const key = mimeType + ':flipY/' + flipY.toString();

			if (cachedImages[key] !== undefined) return cachedImages[key];

			if (!json.images) json.images = [];

			const imageDef = { mimeType: mimeType };

			const canvas = getCanvas();

			canvas.width = Math.min(image.width, options.maxTextureSize);
			canvas.height = Math.min(image.height, options.maxTextureSize);

			const ctx = canvas.getContext('2d');

			if (flipY === true) {

				ctx.translate(0, canvas.height);
				ctx.scale(1, - 1);

			}

			if (image.data !== undefined) { // THREE.DataTexture

				if (format !== RGBAFormat) {

					console.error('GLTFExporter: Only RGBAFormat is supported.');

				}

				if (image.width > options.maxTextureSize || image.height > options.maxTextureSize) {

					console.warn('GLTFExporter: Image size is bigger than maxTextureSize', image);

				}

				const data = new Uint8ClampedArray(image.height * image.width * 4);

				for (let i = 0; i < data.length; i += 4) {

					data[i + 0] = image.data[i + 0];
					data[i + 1] = image.data[i + 1];
					data[i + 2] = image.data[i + 2];
					data[i + 3] = image.data[i + 3];

				}

				ctx.putImageData(new ImageData(data, image.width, image.height), 0, 0);

			} else {

				ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

			}

			if (options.binary === true) {

				pending.push(

					getToBlobPromise(canvas, mimeType)
						.then(blob => writer.processBufferViewImage(blob))
						.then(bufferViewIndex => {

							imageDef.bufferView = bufferViewIndex;

						})

				);

			} else {

				if (canvas.toDataURL !== undefined) {

					imageDef.uri = canvas.toDataURL(mimeType);

				} else {

					pending.push(

						getToBlobPromise(canvas, mimeType)
							.then(blob => new FileReader().readAsDataURL(blob))
							.then(dataURL => {

								imageDef.uri = dataURL;

							})

					);

				}

			}

			const index = json.images.push(imageDef) - 1;
			cachedImages[key] = index;
			return index;

		} else {

			throw new Error('THREE.GLTFExporter: No valid image data found. Unable to process texture.');

		}

	}

	/**
	 * Process sampler
	 * @param  {Texture} map Texture to process
	 * @return {Integer}     Index of the processed texture in the "samplers" array
	 */
	processSampler(map) {

		const json = this.json;

		if (!json.samplers) json.samplers = [];

		const samplerDef = {
			magFilter: THREE_TO_WEBGL[map.magFilter],
			minFilter: THREE_TO_WEBGL[map.minFilter],
			wrapS: THREE_TO_WEBGL[map.wrapS],
			wrapT: THREE_TO_WEBGL[map.wrapT]
		};

		return json.samplers.push(samplerDef) - 1;

	}

	/**
	 * Process texture
	 * @param  {Texture} map Map to process
	 * @return {Integer} Index of the processed texture in the "textures" array
	 */
	processTexture(map) {

		const cache = this.cache;
		const json = this.json;

		if (cache.textures.has(map)) return cache.textures.get(map);

		if (!json.textures) json.textures = [];

		let mimeType = map.userData.mimeType;

		if (mimeType === 'image/webp') mimeType = 'image/png';

		const textureDef = {
			sampler: this.processSampler(map),
			source: this.processImage(map.image, map.format, map.flipY, mimeType)
		};

		if (map.name) textureDef.name = map.name;

		this._invokeAll(function (ext) {

			ext.writeTexture && ext.writeTexture(map, textureDef);

		});

		const index = json.textures.push(textureDef) - 1;
		cache.textures.set(map, index);
		return index;

	}

	/**
	 * Process material
	 * @param  {THREE.Material} material Material to process
	 * @return {Integer|null} Index of the processed material in the "materials" array
	 */
	processMaterial(material) {

		const cache = this.cache;
		const json = this.json;

		if (cache.materials.has(material)) return cache.materials.get(material);

		if (material.isShaderMaterial) {

			console.warn('GLTFExporter: THREE.ShaderMaterial not supported.');
			return null;

		}

		if (!json.materials) json.materials = [];

		// @QUESTION Should we avoid including any attribute that has the default value?
		const materialDef = { pbrMetallicRoughness: {} };

		if (material.isMeshStandardMaterial !== true && material.isMeshBasicMaterial !== true) {

			console.warn('GLTFExporter: Use MeshStandardMaterial or MeshBasicMaterial for best results.');

		}

		// pbrMetallicRoughness.baseColorFactor
		const color = material.color.toArray().concat([material.opacity]);

		if (!equalArray(color, [1, 1, 1, 1])) {

			materialDef.pbrMetallicRoughness.baseColorFactor = color;

		}

		if (material.isMeshStandardMaterial) {

			materialDef.pbrMetallicRoughness.metallicFactor = material.metalness;
			materialDef.pbrMetallicRoughness.roughnessFactor = material.roughness;

		} else {

			materialDef.pbrMetallicRoughness.metallicFactor = 0.5;
			materialDef.pbrMetallicRoughness.roughnessFactor = 0.5;

		}

		// pbrMetallicRoughness.metallicRoughnessTexture
		if (material.metalnessMap || material.roughnessMap) {

			const metalRoughTexture = this.buildMetalRoughTexture(material.metalnessMap, material.roughnessMap);

			const metalRoughMapDef = { index: this.processTexture(metalRoughTexture) };
			this.applyTextureTransform(metalRoughMapDef, metalRoughTexture);
			materialDef.pbrMetallicRoughness.metallicRoughnessTexture = metalRoughMapDef;

		}

		// pbrMetallicRoughness.baseColorTexture
		if (material.map) {

			const baseColorMapDef = { index: this.processTexture(material.map) };
			this.applyTextureTransform(baseColorMapDef, material.map);
			materialDef.pbrMetallicRoughness.baseColorTexture = baseColorMapDef;

		}

		if (material.emissive) {

			const emissive = material.emissive;
			const maxEmissiveComponent = Math.max(emissive.r, emissive.g, emissive.b);

			if (maxEmissiveComponent > 0) {

				materialDef.emissiveFactor = material.emissive.toArray();

			}

			// emissiveTexture
			if (material.emissiveMap) {

				const emissiveMapDef = { index: this.processTexture(material.emissiveMap) };
				this.applyTextureTransform(emissiveMapDef, material.emissiveMap);
				materialDef.emissiveTexture = emissiveMapDef;

			}

		}

		// normalTexture
		if (material.normalMap) {

			const normalMapDef = { index: this.processTexture(material.normalMap) };

			if (material.normalScale && material.normalScale.x !== 1) {

				// glTF normal scale is univariate. Ignore `y`, which may be flipped.
				// Context: https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
				normalMapDef.scale = material.normalScale.x;

			}

			this.applyTextureTransform(normalMapDef, material.normalMap);
			materialDef.normalTexture = normalMapDef;

		}

		// occlusionTexture
		if (material.aoMap) {

			const occlusionMapDef = {
				index: this.processTexture(material.aoMap),
				texCoord: 1
			};

			if (material.aoMapIntensity !== 1.0) {

				occlusionMapDef.strength = material.aoMapIntensity;

			}

			this.applyTextureTransform(occlusionMapDef, material.aoMap);
			materialDef.occlusionTexture = occlusionMapDef;

		}

		// alphaMode
		if (material.transparent) {

			materialDef.alphaMode = 'BLEND';

		} else {

			if (material.alphaTest > 0.0) {

				materialDef.alphaMode = 'MASK';
				materialDef.alphaCutoff = material.alphaTest;

			}

		}

		// doubleSided
		if (material.side === DoubleSide) materialDef.doubleSided = true;
		if (material.name !== '') materialDef.name = material.name;

		this.serializeUserData(material, materialDef);

		this._invokeAll(function (ext) {

			ext.writeMaterial && ext.writeMaterial(material, materialDef);

		});

		const index = json.materials.push(materialDef) - 1;
		cache.materials.set(material, index);
		return index;

	}

	/**
	 * Process mesh
	 * @param  {THREE.Mesh} mesh Mesh to process
	 * @return {Integer|null} Index of the processed mesh in the "meshes" array
	 */
	processMesh(mesh) {

		const cache = this.cache;
		const json = this.json;

		const meshCacheKeyParts = [mesh.geometry.uuid];

		if (Array.isArray(mesh.material)) {

			for (let i = 0, l = mesh.material.length; i < l; i++) {

				meshCacheKeyParts.push(mesh.material[i].uuid);

			}

		} else {

			meshCacheKeyParts.push(mesh.material.uuid);

		}

		const meshCacheKey = meshCacheKeyParts.join(':');

		if (cache.meshes.has(meshCacheKey)) return cache.meshes.get(meshCacheKey);

		const geometry = mesh.geometry;

		let mode;

		// Use the correct mode
		if (mesh.isLineSegments) {

			mode = WEBGL_CONSTANTS$1.LINES;

		} else if (mesh.isLineLoop) {

			mode = WEBGL_CONSTANTS$1.LINE_LOOP;

		} else if (mesh.isLine) {

			mode = WEBGL_CONSTANTS$1.LINE_STRIP;

		} else if (mesh.isPoints) {

			mode = WEBGL_CONSTANTS$1.POINTS;

		} else {

			mode = mesh.material.wireframe ? WEBGL_CONSTANTS$1.LINES : WEBGL_CONSTANTS$1.TRIANGLES;

		}

		const meshDef = {};
		const attributes = {};
		const primitives = [];
		const targets = [];

		// Conversion between attributes names in threejs and gltf spec
		const nameConversion = {
			uv: 'TEXCOORD_0',
			uv2: 'TEXCOORD_1',
			color: 'COLOR_0',
			skinWeight: 'WEIGHTS_0',
			skinIndex: 'JOINTS_0'
		};

		const originalNormal = geometry.getAttribute('normal');

		if (originalNormal !== undefined && !this.isNormalizedNormalAttribute(originalNormal)) {

			console.warn('THREE.GLTFExporter: Creating normalized normal attribute from the non-normalized one.');

			geometry.setAttribute('normal', this.createNormalizedNormalAttribute(originalNormal));

		}

		// @QUESTION Detect if .vertexColors = true?
		// For every attribute create an accessor
		let modifiedAttribute = null;

		for (let attributeName in geometry.attributes) {

			// Ignore morph target attributes, which are exported later.
			if (attributeName.slice(0, 5) === 'morph') continue;

			const attribute = geometry.attributes[attributeName];
			attributeName = nameConversion[attributeName] || attributeName.toUpperCase();

			// Prefix all geometry attributes except the ones specifically
			// listed in the spec; non-spec attributes are considered custom.
			const validVertexAttributes =
				/^(POSITION|NORMAL|TANGENT|TEXCOORD_\d+|COLOR_\d+|JOINTS_\d+|WEIGHTS_\d+)$/;

			if (!validVertexAttributes.test(attributeName)) attributeName = '_' + attributeName;

			if (cache.attributes.has(this.getUID(attribute))) {

				attributes[attributeName] = cache.attributes.get(this.getUID(attribute));
				continue;

			}

			// JOINTS_0 must be UNSIGNED_BYTE or UNSIGNED_SHORT.
			modifiedAttribute = null;
			const array = attribute.array;

			if (attributeName === 'JOINTS_0' &&
				!(array instanceof Uint16Array) &&
				!(array instanceof Uint8Array)) {

				console.warn('GLTFExporter: Attribute "skinIndex" converted to type UNSIGNED_SHORT.');
				modifiedAttribute = new BufferAttribute(new Uint16Array(array), attribute.itemSize, attribute.normalized);

			}

			const accessor = this.processAccessor(modifiedAttribute || attribute, geometry);

			if (accessor !== null) {

				if (!attributeName.startsWith('_')) {

					this.detectMeshQuantization(attributeName, attribute);

				}

				attributes[attributeName] = accessor;
				cache.attributes.set(this.getUID(attribute), accessor);

			}

		}

		if (originalNormal !== undefined) geometry.setAttribute('normal', originalNormal);

		// Skip if no exportable attributes found
		if (Object.keys(attributes).length === 0) return null;

		// Morph targets
		if (mesh.morphTargetInfluences !== undefined && mesh.morphTargetInfluences.length > 0) {

			const weights = [];
			const targetNames = [];
			const reverseDictionary = {};

			if (mesh.morphTargetDictionary !== undefined) {

				for (const key in mesh.morphTargetDictionary) {

					reverseDictionary[mesh.morphTargetDictionary[key]] = key;

				}

			}

			for (let i = 0; i < mesh.morphTargetInfluences.length; ++i) {

				const target = {};
				let warned = false;

				for (const attributeName in geometry.morphAttributes) {

					// glTF 2.0 morph supports only POSITION/NORMAL/TANGENT.
					// Three.js doesn't support TANGENT yet.

					if (attributeName !== 'position' && attributeName !== 'normal') {

						if (!warned) {

							console.warn('GLTFExporter: Only POSITION and NORMAL morph are supported.');
							warned = true;

						}

						continue;

					}

					const attribute = geometry.morphAttributes[attributeName][i];
					const gltfAttributeName = attributeName.toUpperCase();

					// Three.js morph attribute has absolute values while the one of glTF has relative values.
					//
					// glTF 2.0 Specification:
					// https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#morph-targets

					const baseAttribute = geometry.attributes[attributeName];

					if (cache.attributes.has(this.getUID(attribute, true))) {

						target[gltfAttributeName] = cache.attributes.get(this.getUID(attribute, true));
						continue;

					}

					// Clones attribute not to override
					const relativeAttribute = attribute.clone();

					if (!geometry.morphTargetsRelative) {

						for (let j = 0, jl = attribute.count; j < jl; j++) {

							for (let a = 0; a < attribute.itemSize; a++) {

								if (a === 0) relativeAttribute.setX(j, attribute.getX(j) - baseAttribute.getX(j));
								if (a === 1) relativeAttribute.setY(j, attribute.getY(j) - baseAttribute.getY(j));
								if (a === 2) relativeAttribute.setZ(j, attribute.getZ(j) - baseAttribute.getZ(j));
								if (a === 3) relativeAttribute.setW(j, attribute.getW(j) - baseAttribute.getW(j));

							}

						}

					}

					target[gltfAttributeName] = this.processAccessor(relativeAttribute, geometry);
					cache.attributes.set(this.getUID(baseAttribute, true), target[gltfAttributeName]);

				}

				targets.push(target);

				weights.push(mesh.morphTargetInfluences[i]);

				if (mesh.morphTargetDictionary !== undefined) targetNames.push(reverseDictionary[i]);

			}

			meshDef.weights = weights;

			if (targetNames.length > 0) {

				meshDef.extras = {};
				meshDef.extras.targetNames = targetNames;

			}

		}

		const isMultiMaterial = Array.isArray(mesh.material);

		if (isMultiMaterial && geometry.groups.length === 0) return null;

		const materials = isMultiMaterial ? mesh.material : [mesh.material];
		const groups = isMultiMaterial ? geometry.groups : [{ materialIndex: 0, start: undefined, count: undefined }];

		for (let i = 0, il = groups.length; i < il; i++) {

			const primitive = {
				mode: mode,
				attributes: attributes,
			};

			this.serializeUserData(geometry, primitive);

			if (targets.length > 0) primitive.targets = targets;

			if (geometry.index !== null) {

				let cacheKey = this.getUID(geometry.index);

				if (groups[i].start !== undefined || groups[i].count !== undefined) {

					cacheKey += ':' + groups[i].start + ':' + groups[i].count;

				}

				if (cache.attributes.has(cacheKey)) {

					primitive.indices = cache.attributes.get(cacheKey);

				} else {

					primitive.indices = this.processAccessor(geometry.index, geometry, groups[i].start, groups[i].count);
					cache.attributes.set(cacheKey, primitive.indices);

				}

				if (primitive.indices === null) delete primitive.indices;

			}

			const material = this.processMaterial(materials[groups[i].materialIndex]);

			if (material !== null) primitive.material = material;

			primitives.push(primitive);

		}

		meshDef.primitives = primitives;

		if (!json.meshes) json.meshes = [];

		this._invokeAll(function (ext) {

			ext.writeMesh && ext.writeMesh(mesh, meshDef);

		});

		const index = json.meshes.push(meshDef) - 1;
		cache.meshes.set(meshCacheKey, index);
		return index;

	}

	/**
	 * If a vertex attribute with a
	 * [non-standard data type](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#meshes-overview)
	 * is used, it is checked whether it is a valid data type according to the
	 * [KHR_mesh_quantization](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_mesh_quantization/README.md)
	 * extension.
	 * In this case the extension is automatically added to the list of used extensions.
	 *
	 * @param {string} attributeName
	 * @param {THREE.BufferAttribute} attribute
	 */
	detectMeshQuantization(attributeName, attribute) {

		if (this.extensionsUsed[KHR_MESH_QUANTIZATION]) return;

		let attrType = undefined;

		switch (attribute.array.constructor) {

			case Int8Array:

				attrType = 'byte';

				break;

			case Uint8Array:

				attrType = 'unsigned byte';

				break;

			case Int16Array:

				attrType = 'short';

				break;

			case Uint16Array:

				attrType = 'unsigned short';

				break;

			default:

				return;

		}

		if (attribute.normalized) attrType += ' normalized';

		const attrNamePrefix = attributeName.split('_', 1)[0];

		if (KHR_mesh_quantization_ExtraAttrTypes[attrNamePrefix] && KHR_mesh_quantization_ExtraAttrTypes[attrNamePrefix].includes(attrType)) {

			this.extensionsUsed[KHR_MESH_QUANTIZATION] = true;
			this.extensionsRequired[KHR_MESH_QUANTIZATION] = true;

		}

	}

	/**
	 * Process camera
	 * @param  {THREE.Camera} camera Camera to process
	 * @return {Integer}      Index of the processed mesh in the "camera" array
	 */
	processCamera(camera) {

		const json = this.json;

		if (!json.cameras) json.cameras = [];

		const isOrtho = camera.isOrthographicCamera;

		const cameraDef = {
			type: isOrtho ? 'orthographic' : 'perspective'
		};

		if (isOrtho) {

			cameraDef.orthographic = {
				xmag: camera.right * 2,
				ymag: camera.top * 2,
				zfar: camera.far <= 0 ? 0.001 : camera.far,
				znear: camera.near < 0 ? 0 : camera.near
			};

		} else {

			cameraDef.perspective = {
				aspectRatio: camera.aspect,
				yfov: MathUtils.degToRad(camera.fov),
				zfar: camera.far <= 0 ? 0.001 : camera.far,
				znear: camera.near < 0 ? 0 : camera.near
			};

		}

		// Question: Is saving "type" as name intentional?
		if (camera.name !== '') cameraDef.name = camera.type;

		return json.cameras.push(cameraDef) - 1;

	}

	/**
	 * Creates glTF animation entry from AnimationClip object.
	 *
	 * Status:
	 * - Only properties listed in PATH_PROPERTIES may be animated.
	 *
	 * @param {THREE.AnimationClip} clip
	 * @param {THREE.Object3D} root
	 * @return {number|null}
	 */
	processAnimation(clip, root) {

		const json = this.json;
		const nodeMap = this.nodeMap;

		if (!json.animations) json.animations = [];

		clip = GLTFExporter.Utils.mergeMorphTargetTracks(clip.clone(), root);

		const tracks = clip.tracks;
		const channels = [];
		const samplers = [];

		for (let i = 0; i < tracks.length; ++i) {

			const track = tracks[i];
			const trackBinding = PropertyBinding.parseTrackName(track.name);
			let trackNode = PropertyBinding.findNode(root, trackBinding.nodeName);
			const trackProperty = PATH_PROPERTIES$1[trackBinding.propertyName];

			if (trackBinding.objectName === 'bones') {

				if (trackNode.isSkinnedMesh === true) {

					trackNode = trackNode.skeleton.getBoneByName(trackBinding.objectIndex);

				} else {

					trackNode = undefined;

				}

			}

			if (!trackNode || !trackProperty) {

				console.warn('THREE.GLTFExporter: Could not export animation track "%s".', track.name);
				return null;

			}

			const inputItemSize = 1;
			let outputItemSize = track.values.length / track.times.length;

			if (trackProperty === PATH_PROPERTIES$1.morphTargetInfluences) {

				outputItemSize /= trackNode.morphTargetInfluences.length;

			}

			let interpolation;

			// @TODO export CubicInterpolant(InterpolateSmooth) as CUBICSPLINE

			// Detecting glTF cubic spline interpolant by checking factory method's special property
			// GLTFCubicSplineInterpolant is a custom interpolant and track doesn't return
			// valid value from .getInterpolation().
			if (track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline === true) {

				interpolation = 'CUBICSPLINE';

				// itemSize of CUBICSPLINE keyframe is 9
				// (VEC3 * 3: inTangent, splineVertex, and outTangent)
				// but needs to be stored as VEC3 so dividing by 3 here.
				outputItemSize /= 3;

			} else if (track.getInterpolation() === InterpolateDiscrete) {

				interpolation = 'STEP';

			} else {

				interpolation = 'LINEAR';

			}

			samplers.push({
				input: this.processAccessor(new BufferAttribute(track.times, inputItemSize)),
				output: this.processAccessor(new BufferAttribute(track.values, outputItemSize)),
				interpolation: interpolation
			});

			channels.push({
				sampler: samplers.length - 1,
				target: {
					node: nodeMap.get(trackNode),
					path: trackProperty
				}
			});

		}

		json.animations.push({
			name: clip.name || 'clip_' + json.animations.length,
			samplers: samplers,
			channels: channels
		});

		return json.animations.length - 1;

	}

	/**
	 * @param {THREE.Object3D} object
	 * @return {number|null}
	 */
	processSkin(object) {

		const json = this.json;
		const nodeMap = this.nodeMap;

		const node = json.nodes[nodeMap.get(object)];

		const skeleton = object.skeleton;

		if (skeleton === undefined) return null;

		const rootJoint = object.skeleton.bones[0];

		if (rootJoint === undefined) return null;

		const joints = [];
		const inverseBindMatrices = new Float32Array(skeleton.bones.length * 16);
		const temporaryBoneInverse = new Matrix4();

		for (let i = 0; i < skeleton.bones.length; ++i) {

			joints.push(nodeMap.get(skeleton.bones[i]));
			temporaryBoneInverse.copy(skeleton.boneInverses[i]);
			temporaryBoneInverse.multiply(object.bindMatrix).toArray(inverseBindMatrices, i * 16);

		}

		if (json.skins === undefined) json.skins = [];

		json.skins.push({
			inverseBindMatrices: this.processAccessor(new BufferAttribute(inverseBindMatrices, 16)),
			joints: joints,
			skeleton: nodeMap.get(rootJoint)
		});

		const skinIndex = node.skin = json.skins.length - 1;

		return skinIndex;

	}

	/**
	 * Process Object3D node
	 * @param  {THREE.Object3D} node Object3D to processNode
	 * @return {Integer} Index of the node in the nodes list
	 */
	processNode(object) {

		const json = this.json;
		const options = this.options;
		const nodeMap = this.nodeMap;

		if (!json.nodes) json.nodes = [];

		const nodeDef = {};

		if (options.trs) {

			const rotation = object.quaternion.toArray();
			const position = object.position.toArray();
			const scale = object.scale.toArray();

			if (!equalArray(rotation, [0, 0, 0, 1])) {

				nodeDef.rotation = rotation;

			}

			if (!equalArray(position, [0, 0, 0])) {

				nodeDef.translation = position;

			}

			if (!equalArray(scale, [1, 1, 1])) {

				nodeDef.scale = scale;

			}

		} else {

			if (object.matrixAutoUpdate) {

				object.updateMatrix();

			}

			if (isIdentityMatrix(object.matrix) === false) {

				nodeDef.matrix = object.matrix.elements;

			}

		}

		// We don't export empty strings name because it represents no-name in Three.js.
		if (object.name !== '') nodeDef.name = String(object.name);

		this.serializeUserData(object, nodeDef);

		if (object.isMesh || object.isLine || object.isPoints) {

			const meshIndex = this.processMesh(object);

			if (meshIndex !== null) nodeDef.mesh = meshIndex;

		} else if (object.isCamera) {

			nodeDef.camera = this.processCamera(object);

		}

		if (object.isSkinnedMesh) this.skins.push(object);

		if (object.children.length > 0) {

			const children = [];

			for (let i = 0, l = object.children.length; i < l; i++) {

				const child = object.children[i];

				if (child.visible || options.onlyVisible === false) {

					const nodeIndex = this.processNode(child);

					if (nodeIndex !== null) children.push(nodeIndex);

				}

			}

			if (children.length > 0) nodeDef.children = children;

		}

		this._invokeAll(function (ext) {

			ext.writeNode && ext.writeNode(object, nodeDef);

		});

		const nodeIndex = json.nodes.push(nodeDef) - 1;
		nodeMap.set(object, nodeIndex);
		return nodeIndex;

	}

	/**
	 * Process Scene
	 * @param  {Scene} node Scene to process
	 */
	processScene(scene) {

		const json = this.json;
		const options = this.options;

		if (!json.scenes) {

			json.scenes = [];
			json.scene = 0;

		}

		const sceneDef = {};

		if (scene.name !== '') sceneDef.name = scene.name;

		json.scenes.push(sceneDef);

		const nodes = [];

		for (let i = 0, l = scene.children.length; i < l; i++) {

			const child = scene.children[i];

			if (child.visible || options.onlyVisible === false) {

				const nodeIndex = this.processNode(child);

				if (nodeIndex !== null) nodes.push(nodeIndex);

			}

		}

		if (nodes.length > 0) sceneDef.nodes = nodes;

		this.serializeUserData(scene, sceneDef);

	}

	/**
	 * Creates a Scene to hold a list of objects and parse it
	 * @param  {Array} objects List of objects to process
	 */
	processObjects(objects) {

		const scene = new Scene();
		scene.name = 'AuxScene';

		for (let i = 0; i < objects.length; i++) {

			// We push directly to children instead of calling `add` to prevent
			// modify the .parent and break its original scene and hierarchy
			scene.children.push(objects[i]);

		}

		this.processScene(scene);

	}

	/**
	 * @param {THREE.Object3D|Array<THREE.Object3D>} input
	 */
	processInput(input) {

		const options = this.options;

		input = input instanceof Array ? input : [input];

		this._invokeAll(function (ext) {

			ext.beforeParse && ext.beforeParse(input);

		});

		const objectsWithoutScene = [];

		for (let i = 0; i < input.length; i++) {

			if (input[i] instanceof Scene) {

				this.processScene(input[i]);

			} else {

				objectsWithoutScene.push(input[i]);

			}

		}

		if (objectsWithoutScene.length > 0) this.processObjects(objectsWithoutScene);

		for (let i = 0; i < this.skins.length; ++i) {

			this.processSkin(this.skins[i]);

		}

		for (let i = 0; i < options.animations.length; ++i) {

			this.processAnimation(options.animations[i], input[0]);

		}

		this._invokeAll(function (ext) {

			ext.afterParse && ext.afterParse(input);

		});

	}

	_invokeAll(func) {

		for (let i = 0, il = this.plugins.length; i < il; i++) {

			func(this.plugins[i]);

		}

	}

}

/**
 * Punctual Lights Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
 */
class GLTFLightExtension {

	constructor(writer) {

		this.writer = writer;
		this.name = 'KHR_lights_punctual';

	}

	writeNode(light, nodeDef) {

		if (!light.isLight) return;

		if (!light.isDirectionalLight && !light.isPointLight && !light.isSpotLight) {

			console.warn('THREE.GLTFExporter: Only directional, point, and spot lights are supported.', light);
			return;

		}

		const writer = this.writer;
		const json = writer.json;
		const extensionsUsed = writer.extensionsUsed;

		const lightDef = {};

		if (light.name) lightDef.name = light.name;

		lightDef.color = light.color.toArray();

		lightDef.intensity = light.intensity;

		if (light.isDirectionalLight) {

			lightDef.type = 'directional';

		} else if (light.isPointLight) {

			lightDef.type = 'point';

			if (light.distance > 0) lightDef.range = light.distance;

		} else if (light.isSpotLight) {

			lightDef.type = 'spot';

			if (light.distance > 0) lightDef.range = light.distance;

			lightDef.spot = {};
			lightDef.spot.innerConeAngle = (light.penumbra - 1.0) * light.angle * - 1.0;
			lightDef.spot.outerConeAngle = light.angle;

		}

		if (light.decay !== undefined && light.decay !== 2) {

			console.warn('THREE.GLTFExporter: Light decay may be lost. glTF is physically-based, '
				+ 'and expects light.decay=2.');

		}

		if (light.target
			&& (light.target.parent !== light
				|| light.target.position.x !== 0
				|| light.target.position.y !== 0
				|| light.target.position.z !== - 1)) {

			console.warn('THREE.GLTFExporter: Light direction may be lost. For best results, '
				+ 'make light.target a child of the light with position 0,0,-1.');

		}

		if (!extensionsUsed[this.name]) {

			json.extensions = json.extensions || {};
			json.extensions[this.name] = { lights: [] };
			extensionsUsed[this.name] = true;

		}

		const lights = json.extensions[this.name].lights;
		lights.push(lightDef);

		nodeDef.extensions = nodeDef.extensions || {};
		nodeDef.extensions[this.name] = { light: lights.length - 1 };

	}

}

/**
 * Unlit Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
 */
class GLTFMaterialsUnlitExtension$1 {

	constructor(writer) {

		this.writer = writer;
		this.name = 'KHR_materials_unlit';

	}

	writeMaterial(material, materialDef) {

		if (!material.isMeshBasicMaterial) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[this.name] = {};

		extensionsUsed[this.name] = true;

		materialDef.pbrMetallicRoughness.metallicFactor = 0.0;
		materialDef.pbrMetallicRoughness.roughnessFactor = 0.9;

	}

}

/**
 * Clearcoat Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
 */
class GLTFMaterialsClearcoatExtension$1 {

	constructor(writer) {

		this.writer = writer;
		this.name = 'KHR_materials_clearcoat';

	}

	writeMaterial(material, materialDef) {

		if (!material.isMeshPhysicalMaterial || material.clearcoat === 0) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.clearcoatFactor = material.clearcoat;

		if (material.clearcoatMap) {

			const clearcoatMapDef = { index: writer.processTexture(material.clearcoatMap) };
			writer.applyTextureTransform(clearcoatMapDef, material.clearcoatMap);
			extensionDef.clearcoatTexture = clearcoatMapDef;

		}

		extensionDef.clearcoatRoughnessFactor = material.clearcoatRoughness;

		if (material.clearcoatRoughnessMap) {

			const clearcoatRoughnessMapDef = { index: writer.processTexture(material.clearcoatRoughnessMap) };
			writer.applyTextureTransform(clearcoatRoughnessMapDef, material.clearcoatRoughnessMap);
			extensionDef.clearcoatRoughnessTexture = clearcoatRoughnessMapDef;

		}

		if (material.clearcoatNormalMap) {

			const clearcoatNormalMapDef = { index: writer.processTexture(material.clearcoatNormalMap) };
			writer.applyTextureTransform(clearcoatNormalMapDef, material.clearcoatNormalMap);
			extensionDef.clearcoatNormalTexture = clearcoatNormalMapDef;

		}

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[this.name] = extensionDef;

		extensionsUsed[this.name] = true;


	}

}

/**
 * Iridescence Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_iridescence
 */
class GLTFMaterialsIridescenceExtension$1 {

	constructor(writer) {

		this.writer = writer;
		this.name = 'KHR_materials_iridescence';

	}

	writeMaterial(material, materialDef) {

		if (!material.isMeshPhysicalMaterial || material.iridescence === 0) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.iridescenceFactor = material.iridescence;

		if (material.iridescenceMap) {

			const iridescenceMapDef = { index: writer.processTexture(material.iridescenceMap) };
			writer.applyTextureTransform(iridescenceMapDef, material.iridescenceMap);
			extensionDef.iridescenceTexture = iridescenceMapDef;

		}

		extensionDef.iridescenceIor = material.iridescenceIOR;
		extensionDef.iridescenceThicknessMinimum = material.iridescenceThicknessRange[0];
		extensionDef.iridescenceThicknessMaximum = material.iridescenceThicknessRange[1];

		if (material.iridescenceThicknessMap) {

			const iridescenceThicknessMapDef = { index: writer.processTexture(material.iridescenceThicknessMap) };
			writer.applyTextureTransform(iridescenceThicknessMapDef, material.iridescenceThicknessMap);
			extensionDef.iridescenceThicknessTexture = iridescenceThicknessMapDef;

		}

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[this.name] = extensionDef;

		extensionsUsed[this.name] = true;

	}

}

/**
 * Transmission Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
 */
class GLTFMaterialsTransmissionExtension$1 {

	constructor(writer) {

		this.writer = writer;
		this.name = 'KHR_materials_transmission';

	}

	writeMaterial(material, materialDef) {

		if (!material.isMeshPhysicalMaterial || material.transmission === 0) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.transmissionFactor = material.transmission;

		if (material.transmissionMap) {

			const transmissionMapDef = { index: writer.processTexture(material.transmissionMap) };
			writer.applyTextureTransform(transmissionMapDef, material.transmissionMap);
			extensionDef.transmissionTexture = transmissionMapDef;

		}

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[this.name] = extensionDef;

		extensionsUsed[this.name] = true;

	}

}

/**
 * Materials Volume Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_volume
 */
class GLTFMaterialsVolumeExtension$1 {

	constructor(writer) {

		this.writer = writer;
		this.name = 'KHR_materials_volume';

	}

	writeMaterial(material, materialDef) {

		if (!material.isMeshPhysicalMaterial || material.transmission === 0) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.thicknessFactor = material.thickness;

		if (material.thicknessMap) {

			const thicknessMapDef = { index: writer.processTexture(material.thicknessMap) };
			writer.applyTextureTransform(thicknessMapDef, material.thicknessMap);
			extensionDef.thicknessTexture = thicknessMapDef;

		}

		extensionDef.attenuationDistance = material.attenuationDistance;
		extensionDef.attenuationColor = material.attenuationColor.toArray();

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[this.name] = extensionDef;

		extensionsUsed[this.name] = true;

	}

}

/**
 * Materials ior Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_ior
 */
class GLTFMaterialsIorExtension$1 {

	constructor(writer) {

		this.writer = writer;
		this.name = 'KHR_materials_ior';

	}

	writeMaterial(material, materialDef) {

		if (!material.isMeshPhysicalMaterial || material.ior === 1.5) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.ior = material.ior;

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[this.name] = extensionDef;

		extensionsUsed[this.name] = true;

	}

}

/**
 * Materials specular Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_specular
 */
class GLTFMaterialsSpecularExtension$1 {

	constructor(writer) {

		this.writer = writer;
		this.name = 'KHR_materials_specular';

	}

	writeMaterial(material, materialDef) {

		if (!material.isMeshPhysicalMaterial || (material.specularIntensity === 1.0 &&
			material.specularColor.equals(DEFAULT_SPECULAR_COLOR) &&
			!material.specularIntensityMap && !material.specularColorTexture)) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		if (material.specularIntensityMap) {

			const specularIntensityMapDef = { index: writer.processTexture(material.specularIntensityMap) };
			writer.applyTextureTransform(specularIntensityMapDef, material.specularIntensityMap);
			extensionDef.specularTexture = specularIntensityMapDef;

		}

		if (material.specularColorMap) {

			const specularColorMapDef = { index: writer.processTexture(material.specularColorMap) };
			writer.applyTextureTransform(specularColorMapDef, material.specularColorMap);
			extensionDef.specularColorTexture = specularColorMapDef;

		}

		extensionDef.specularFactor = material.specularIntensity;
		extensionDef.specularColorFactor = material.specularColor.toArray();

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[this.name] = extensionDef;

		extensionsUsed[this.name] = true;

	}

}

/**
 * Sheen Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_sheen
 */
class GLTFMaterialsSheenExtension$1 {

	constructor(writer) {

		this.writer = writer;
		this.name = 'KHR_materials_sheen';

	}

	writeMaterial(material, materialDef) {

		if (!material.isMeshPhysicalMaterial || material.sheen == 0.0) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		if (material.sheenRoughnessMap) {

			const sheenRoughnessMapDef = { index: writer.processTexture(material.sheenRoughnessMap) };
			writer.applyTextureTransform(sheenRoughnessMapDef, material.sheenRoughnessMap);
			extensionDef.sheenRoughnessTexture = sheenRoughnessMapDef;

		}

		if (material.sheenColorMap) {

			const sheenColorMapDef = { index: writer.processTexture(material.sheenColorMap) };
			writer.applyTextureTransform(sheenColorMapDef, material.sheenColorMap);
			extensionDef.sheenColorTexture = sheenColorMapDef;

		}

		extensionDef.sheenRoughnessFactor = material.sheenRoughness;
		extensionDef.sheenColorFactor = material.sheenColor.toArray();

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[this.name] = extensionDef;

		extensionsUsed[this.name] = true;

	}

}

/**
 * Materials Emissive Strength Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/blob/5768b3ce0ef32bc39cdf1bef10b948586635ead3/extensions/2.0/Khronos/KHR_materials_emissive_strength/README.md
 */
class GLTFMaterialsEmissiveStrengthExtension$1 {

	constructor(writer) {

		this.writer = writer;
		this.name = 'KHR_materials_emissive_strength';

	}

	writeMaterial(material, materialDef) {

		if (!material.isMeshStandardMaterial || material.emissiveIntensity === 1.0) return;

		const writer = this.writer;
		const extensionsUsed = writer.extensionsUsed;

		const extensionDef = {};

		extensionDef.emissiveStrength = material.emissiveIntensity;

		materialDef.extensions = materialDef.extensions || {};
		materialDef.extensions[this.name] = extensionDef;

		extensionsUsed[this.name] = true;

	}

}

/**
 * Static utility functions
 */
GLTFExporter.Utils = {

	insertKeyframe: function (track, time) {

		const tolerance = 0.001; // 1ms
		const valueSize = track.getValueSize();

		const times = new track.TimeBufferType(track.times.length + 1);
		const values = new track.ValueBufferType(track.values.length + valueSize);
		const interpolant = track.createInterpolant(new track.ValueBufferType(valueSize));

		let index;

		if (track.times.length === 0) {

			times[0] = time;

			for (let i = 0; i < valueSize; i++) {

				values[i] = 0;

			}

			index = 0;

		} else if (time < track.times[0]) {

			if (Math.abs(track.times[0] - time) < tolerance) return 0;

			times[0] = time;
			times.set(track.times, 1);

			values.set(interpolant.evaluate(time), 0);
			values.set(track.values, valueSize);

			index = 0;

		} else if (time > track.times[track.times.length - 1]) {

			if (Math.abs(track.times[track.times.length - 1] - time) < tolerance) {

				return track.times.length - 1;

			}

			times[times.length - 1] = time;
			times.set(track.times, 0);

			values.set(track.values, 0);
			values.set(interpolant.evaluate(time), track.values.length);

			index = times.length - 1;

		} else {

			for (let i = 0; i < track.times.length; i++) {

				if (Math.abs(track.times[i] - time) < tolerance) return i;

				if (track.times[i] < time && track.times[i + 1] > time) {

					times.set(track.times.slice(0, i + 1), 0);
					times[i + 1] = time;
					times.set(track.times.slice(i + 1), i + 2);

					values.set(track.values.slice(0, (i + 1) * valueSize), 0);
					values.set(interpolant.evaluate(time), (i + 1) * valueSize);
					values.set(track.values.slice((i + 1) * valueSize), (i + 2) * valueSize);

					index = i + 1;

					break;

				}

			}

		}

		track.times = times;
		track.values = values;

		return index;

	},

	mergeMorphTargetTracks: function (clip, root) {

		const tracks = [];
		const mergedTracks = {};
		const sourceTracks = clip.tracks;

		for (let i = 0; i < sourceTracks.length; ++i) {

			let sourceTrack = sourceTracks[i];
			const sourceTrackBinding = PropertyBinding.parseTrackName(sourceTrack.name);
			const sourceTrackNode = PropertyBinding.findNode(root, sourceTrackBinding.nodeName);

			if (sourceTrackBinding.propertyName !== 'morphTargetInfluences' || sourceTrackBinding.propertyIndex === undefined) {

				// Tracks that don't affect morph targets, or that affect all morph targets together, can be left as-is.
				tracks.push(sourceTrack);
				continue;

			}

			if (sourceTrack.createInterpolant !== sourceTrack.InterpolantFactoryMethodDiscrete
				&& sourceTrack.createInterpolant !== sourceTrack.InterpolantFactoryMethodLinear) {

				if (sourceTrack.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline) {

					// This should never happen, because glTF morph target animations
					// affect all targets already.
					throw new Error('THREE.GLTFExporter: Cannot merge tracks with glTF CUBICSPLINE interpolation.');

				}

				console.warn('THREE.GLTFExporter: Morph target interpolation mode not yet supported. Using LINEAR instead.');

				sourceTrack = sourceTrack.clone();
				sourceTrack.setInterpolation(InterpolateLinear);

			}

			const targetCount = sourceTrackNode.morphTargetInfluences.length;
			const targetIndex = sourceTrackNode.morphTargetDictionary[sourceTrackBinding.propertyIndex];

			if (targetIndex === undefined) {

				throw new Error('THREE.GLTFExporter: Morph target name not found: ' + sourceTrackBinding.propertyIndex);

			}

			let mergedTrack;

			// If this is the first time we've seen this object, create a new
			// track to store merged keyframe data for each morph target.
			if (mergedTracks[sourceTrackNode.uuid] === undefined) {

				mergedTrack = sourceTrack.clone();

				const values = new mergedTrack.ValueBufferType(targetCount * mergedTrack.times.length);

				for (let j = 0; j < mergedTrack.times.length; j++) {

					values[j * targetCount + targetIndex] = mergedTrack.values[j];

				}

				// We need to take into consideration the intended target node
				// of our original un-merged morphTarget animation.
				mergedTrack.name = (sourceTrackBinding.nodeName || '') + '.morphTargetInfluences';
				mergedTrack.values = values;

				mergedTracks[sourceTrackNode.uuid] = mergedTrack;
				tracks.push(mergedTrack);

				continue;

			}

			const sourceInterpolant = sourceTrack.createInterpolant(new sourceTrack.ValueBufferType(1));

			mergedTrack = mergedTracks[sourceTrackNode.uuid];

			// For every existing keyframe of the merged track, write a (possibly
			// interpolated) value from the source track.
			for (let j = 0; j < mergedTrack.times.length; j++) {

				mergedTrack.values[j * targetCount + targetIndex] = sourceInterpolant.evaluate(mergedTrack.times[j]);

			}

			// For every existing keyframe of the source track, write a (possibly
			// new) keyframe to the merged track. Values from the previous loop may
			// be written again, but keyframes are de-duplicated.
			for (let j = 0; j < sourceTrack.times.length; j++) {

				const keyframeIndex = this.insertKeyframe(mergedTrack, sourceTrack.times[j]);
				mergedTrack.values[keyframeIndex * targetCount + targetIndex] = sourceTrack.values[j];

			}

		}

		clip.tracks = tracks;

		return clip;

	}

};

function clone(source) {

	const sourceLookup = new Map();
	const cloneLookup = new Map();

	const clone = source.clone();

	parallelTraverse(source, clone, function (sourceNode, clonedNode) {

		sourceLookup.set(clonedNode, sourceNode);
		cloneLookup.set(sourceNode, clonedNode);

	});

	clone.traverse(function (node) {

		if (!node.isSkinnedMesh) return;

		const clonedMesh = node;
		const sourceMesh = sourceLookup.get(node);
		const sourceBones = sourceMesh.skeleton.bones;

		clonedMesh.skeleton = sourceMesh.skeleton.clone();
		clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);

		clonedMesh.skeleton.bones = sourceBones.map(function (bone) {

			return cloneLookup.get(bone);

		});

		clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);

	});

	return clone;

}

function parallelTraverse(a, b, callback) {

	callback(a, b);

	for (let i = 0; i < a.children.length; i++) {

		parallelTraverse(a.children[i], b.children[i], callback);

	}

}

class GLTFLoader extends Loader {

	constructor(manager) {

		super(manager);

		this.dracoLoader = null;
		this.ktx2Loader = null;
		this.meshoptDecoder = null;

		this.pluginCallbacks = [];

		this.register(function (parser) {

			return new GLTFMaterialsClearcoatExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFTextureBasisUExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFTextureWebPExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFTextureAVIFExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFMaterialsSheenExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFMaterialsTransmissionExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFMaterialsVolumeExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFMaterialsIorExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFMaterialsEmissiveStrengthExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFMaterialsSpecularExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFMaterialsIridescenceExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFMaterialsAnisotropyExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFLightsExtension(parser);

		});

		this.register(function (parser) {

			return new GLTFMeshoptCompression(parser);

		});

		this.register(function (parser) {

			return new GLTFMeshGpuInstancing(parser);

		});

	}

	load(url, onLoad, onProgress, onError) {

		const scope = this;

		let resourcePath;

		if (this.resourcePath !== '') {

			resourcePath = this.resourcePath;

		} else if (this.path !== '') {

			resourcePath = this.path;

		} else {

			resourcePath = LoaderUtils.extractUrlBase(url);

		}

		// Tells the LoadingManager to track an extra item, which resolves after
		// the model is fully loaded. This means the count of items loaded will
		// be incorrect, but ensures manager.onLoad() does not fire early.
		this.manager.itemStart(url);

		const _onError = function (e) {

			if (onError) {

				onError(e);

			} else {

				console.error(e);

			}

			scope.manager.itemError(url);
			scope.manager.itemEnd(url);

		};

		const loader = new FileLoader(this.manager);

		loader.setPath(this.path);
		loader.setResponseType('arraybuffer');
		loader.setRequestHeader(this.requestHeader);
		loader.setWithCredentials(this.withCredentials);

		loader.load(url, function (data) {

			try {

				scope.parse(data, resourcePath, function (gltf) {

					onLoad(gltf);

					scope.manager.itemEnd(url);

				}, _onError);

			} catch (e) {

				_onError(e);

			}

		}, onProgress, _onError);

	}

	setDRACOLoader(dracoLoader) {

		this.dracoLoader = dracoLoader;
		return this;

	}

	setDDSLoader() {

		throw new Error(

			'THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".'

		);

	}

	setKTX2Loader(ktx2Loader) {

		this.ktx2Loader = ktx2Loader;
		return this;

	}

	setMeshoptDecoder(meshoptDecoder) {

		this.meshoptDecoder = meshoptDecoder;
		return this;

	}

	register(callback) {

		if (this.pluginCallbacks.indexOf(callback) === - 1) {

			this.pluginCallbacks.push(callback);

		}

		return this;

	}

	unregister(callback) {

		if (this.pluginCallbacks.indexOf(callback) !== - 1) {

			this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(callback), 1);

		}

		return this;

	}

	parse(data, path, onLoad, onError) {

		let json;
		const extensions = {};
		const plugins = {};
		const textDecoder = new TextDecoder();

		if (typeof data === 'string') {

			json = JSON.parse(data);

		} else if (data instanceof ArrayBuffer) {

			const magic = textDecoder.decode(new Uint8Array(data, 0, 4));

			if (magic === BINARY_EXTENSION_HEADER_MAGIC) {

				try {

					extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);

				} catch (error) {

					if (onError) onError(error);
					return;

				}

				json = JSON.parse(extensions[EXTENSIONS.KHR_BINARY_GLTF].content);

			} else {

				json = JSON.parse(textDecoder.decode(data));

			}

		} else {

			json = data;

		}

		if (json.asset === undefined || json.asset.version[0] < 2) {

			if (onError) onError(new Error('THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.'));
			return;

		}

		const parser = new GLTFParser(json, {

			path: path || this.resourcePath || '',
			crossOrigin: this.crossOrigin,
			requestHeader: this.requestHeader,
			manager: this.manager,
			ktx2Loader: this.ktx2Loader,
			meshoptDecoder: this.meshoptDecoder

		});

		parser.fileLoader.setRequestHeader(this.requestHeader);

		for (let i = 0; i < this.pluginCallbacks.length; i++) {

			const plugin = this.pluginCallbacks[i](parser);
			plugins[plugin.name] = plugin;

			// Workaround to avoid determining as unknown extension
			// in addUnknownExtensionsToUserData().
			// Remove this workaround if we move all the existing
			// extension handlers to plugin system
			extensions[plugin.name] = true;

		}

		if (json.extensionsUsed) {

			for (let i = 0; i < json.extensionsUsed.length; ++i) {

				const extensionName = json.extensionsUsed[i];
				const extensionsRequired = json.extensionsRequired || [];

				switch (extensionName) {

					case EXTENSIONS.KHR_MATERIALS_UNLIT:
						extensions[extensionName] = new GLTFMaterialsUnlitExtension();
						break;

					case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
						extensions[extensionName] = new GLTFDracoMeshCompressionExtension(json, this.dracoLoader);
						break;

					case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
						extensions[extensionName] = new GLTFTextureTransformExtension();
						break;

					case EXTENSIONS.KHR_MESH_QUANTIZATION:
						extensions[extensionName] = new GLTFMeshQuantizationExtension();
						break;

					default:

						if (extensionsRequired.indexOf(extensionName) >= 0 && plugins[extensionName] === undefined) {

							console.warn('THREE.GLTFLoader: Unknown extension "' + extensionName + '".');

						}

				}

			}

		}

		parser.setExtensions(extensions);
		parser.setPlugins(plugins);
		parser.parse(onLoad, onError);

	}

	parseAsync(data, path) {

		const scope = this;

		return new Promise(function (resolve, reject) {

			scope.parse(data, path, resolve, reject);

		});

	}

}

/* GLTFREGISTRY */

function GLTFRegistry() {

	let objects = {};

	return {

		get: function (key) {

			return objects[key];

		},

		add: function (key, object) {

			objects[key] = object;

		},

		remove: function (key) {

			delete objects[key];

		},

		removeAll: function () {

			objects = {};

		}

	};

}

/*********************************/
/********** EXTENSIONS ***********/
/*********************************/

const EXTENSIONS = {
	KHR_BINARY_GLTF: 'KHR_binary_glTF',
	KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
	KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
	KHR_MATERIALS_CLEARCOAT: 'KHR_materials_clearcoat',
	KHR_MATERIALS_IOR: 'KHR_materials_ior',
	KHR_MATERIALS_SHEEN: 'KHR_materials_sheen',
	KHR_MATERIALS_SPECULAR: 'KHR_materials_specular',
	KHR_MATERIALS_TRANSMISSION: 'KHR_materials_transmission',
	KHR_MATERIALS_IRIDESCENCE: 'KHR_materials_iridescence',
	KHR_MATERIALS_ANISOTROPY: 'KHR_materials_anisotropy',
	KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
	KHR_MATERIALS_VOLUME: 'KHR_materials_volume',
	KHR_TEXTURE_BASISU: 'KHR_texture_basisu',
	KHR_TEXTURE_TRANSFORM: 'KHR_texture_transform',
	KHR_MESH_QUANTIZATION: 'KHR_mesh_quantization',
	KHR_MATERIALS_EMISSIVE_STRENGTH: 'KHR_materials_emissive_strength',
	EXT_TEXTURE_WEBP: 'EXT_texture_webp',
	EXT_TEXTURE_AVIF: 'EXT_texture_avif',
	EXT_MESHOPT_COMPRESSION: 'EXT_meshopt_compression',
	EXT_MESH_GPU_INSTANCING: 'EXT_mesh_gpu_instancing'
};

/**
 * Punctual Lights Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
 */
class GLTFLightsExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;

		// Object3D instance caches
		this.cache = { refs: {}, uses: {} };

	}

	_markDefs() {

		const parser = this.parser;
		const nodeDefs = this.parser.json.nodes || [];

		for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {

			const nodeDef = nodeDefs[nodeIndex];

			if (nodeDef.extensions
				&& nodeDef.extensions[this.name]
				&& nodeDef.extensions[this.name].light !== undefined) {

				parser._addNodeRef(this.cache, nodeDef.extensions[this.name].light);

			}

		}

	}

	_loadLight(lightIndex) {

		const parser = this.parser;
		const cacheKey = 'light:' + lightIndex;
		let dependency = parser.cache.get(cacheKey);

		if (dependency) return dependency;

		const json = parser.json;
		const extensions = (json.extensions && json.extensions[this.name]) || {};
		const lightDefs = extensions.lights || [];
		const lightDef = lightDefs[lightIndex];
		let lightNode;

		const color = new Color(0xffffff);

		if (lightDef.color !== undefined) color.fromArray(lightDef.color);

		const range = lightDef.range !== undefined ? lightDef.range : 0;

		switch (lightDef.type) {

			case 'directional':
				lightNode = new DirectionalLight(color);
				lightNode.target.position.set(0, 0, - 1);
				lightNode.add(lightNode.target);
				break;

			case 'point':
				lightNode = new PointLight(color);
				lightNode.distance = range;
				break;

			case 'spot':
				lightNode = new SpotLight(color);
				lightNode.distance = range;
				// Handle spotlight properties.
				lightDef.spot = lightDef.spot || {};
				lightDef.spot.innerConeAngle = lightDef.spot.innerConeAngle !== undefined ? lightDef.spot.innerConeAngle : 0;
				lightDef.spot.outerConeAngle = lightDef.spot.outerConeAngle !== undefined ? lightDef.spot.outerConeAngle : Math.PI / 4.0;
				lightNode.angle = lightDef.spot.outerConeAngle;
				lightNode.penumbra = 1.0 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
				lightNode.target.position.set(0, 0, - 1);
				lightNode.add(lightNode.target);
				break;

			default:
				throw new Error('THREE.GLTFLoader: Unexpected light type: ' + lightDef.type);

		}

		// Some lights (e.g. spot) default to a position other than the origin. Reset the position
		// here, because node-level parsing will only override position if explicitly specified.
		lightNode.position.set(0, 0, 0);

		lightNode.decay = 2;

		assignExtrasToUserData(lightNode, lightDef);

		if (lightDef.intensity !== undefined) lightNode.intensity = lightDef.intensity;

		lightNode.name = parser.createUniqueName(lightDef.name || ('light_' + lightIndex));

		dependency = Promise.resolve(lightNode);

		parser.cache.add(cacheKey, dependency);

		return dependency;

	}

	getDependency(type, index) {

		if (type !== 'light') return;

		return this._loadLight(index);

	}

	createNodeAttachment(nodeIndex) {

		const self = this;
		const parser = this.parser;
		const json = parser.json;
		const nodeDef = json.nodes[nodeIndex];
		const lightDef = (nodeDef.extensions && nodeDef.extensions[this.name]) || {};
		const lightIndex = lightDef.light;

		if (lightIndex === undefined) return null;

		return this._loadLight(lightIndex).then(function (light) {

			return parser._getNodeRef(self.cache, lightIndex, light);

		});

	}

}

/**
 * Unlit Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit
 */
class GLTFMaterialsUnlitExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;

	}

	getMaterialType() {

		return MeshBasicMaterial;

	}

	extendParams(materialParams, materialDef, parser) {

		const pending = [];

		materialParams.color = new Color(1.0, 1.0, 1.0);
		materialParams.opacity = 1.0;

		const metallicRoughness = materialDef.pbrMetallicRoughness;

		if (metallicRoughness) {

			if (Array.isArray(metallicRoughness.baseColorFactor)) {

				const array = metallicRoughness.baseColorFactor;

				materialParams.color.fromArray(array);
				materialParams.opacity = array[3];

			}

			if (metallicRoughness.baseColorTexture !== undefined) {

				pending.push(parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture, SRGBColorSpace));

			}

		}

		return Promise.all(pending);

	}

}

/**
 * Materials Emissive Strength Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/blob/5768b3ce0ef32bc39cdf1bef10b948586635ead3/extensions/2.0/Khronos/KHR_materials_emissive_strength/README.md
 */
class GLTFMaterialsEmissiveStrengthExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_EMISSIVE_STRENGTH;

	}

	extendMaterialParams(materialIndex, materialParams) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) {

			return Promise.resolve();

		}

		const emissiveStrength = materialDef.extensions[this.name].emissiveStrength;

		if (emissiveStrength !== undefined) {

			materialParams.emissiveIntensity = emissiveStrength;

		}

		return Promise.resolve();

	}

}

/**
 * Clearcoat Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_clearcoat
 */
class GLTFMaterialsClearcoatExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;

	}

	getMaterialType(materialIndex) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams(materialIndex, materialParams) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[this.name];

		if (extension.clearcoatFactor !== undefined) {

			materialParams.clearcoat = extension.clearcoatFactor;

		}

		if (extension.clearcoatTexture !== undefined) {

			pending.push(parser.assignTexture(materialParams, 'clearcoatMap', extension.clearcoatTexture));

		}

		if (extension.clearcoatRoughnessFactor !== undefined) {

			materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;

		}

		if (extension.clearcoatRoughnessTexture !== undefined) {

			pending.push(parser.assignTexture(materialParams, 'clearcoatRoughnessMap', extension.clearcoatRoughnessTexture));

		}

		if (extension.clearcoatNormalTexture !== undefined) {

			pending.push(parser.assignTexture(materialParams, 'clearcoatNormalMap', extension.clearcoatNormalTexture));

			if (extension.clearcoatNormalTexture.scale !== undefined) {

				const scale = extension.clearcoatNormalTexture.scale;

				materialParams.clearcoatNormalScale = new Vector2(scale, scale);

			}

		}

		return Promise.all(pending);

	}

}

/**
 * Iridescence Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_iridescence
 */
class GLTFMaterialsIridescenceExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_IRIDESCENCE;

	}

	getMaterialType(materialIndex) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams(materialIndex, materialParams) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[this.name];

		if (extension.iridescenceFactor !== undefined) {

			materialParams.iridescence = extension.iridescenceFactor;

		}

		if (extension.iridescenceTexture !== undefined) {

			pending.push(parser.assignTexture(materialParams, 'iridescenceMap', extension.iridescenceTexture));

		}

		if (extension.iridescenceIor !== undefined) {

			materialParams.iridescenceIOR = extension.iridescenceIor;

		}

		if (materialParams.iridescenceThicknessRange === undefined) {

			materialParams.iridescenceThicknessRange = [100, 400];

		}

		if (extension.iridescenceThicknessMinimum !== undefined) {

			materialParams.iridescenceThicknessRange[0] = extension.iridescenceThicknessMinimum;

		}

		if (extension.iridescenceThicknessMaximum !== undefined) {

			materialParams.iridescenceThicknessRange[1] = extension.iridescenceThicknessMaximum;

		}

		if (extension.iridescenceThicknessTexture !== undefined) {

			pending.push(parser.assignTexture(materialParams, 'iridescenceThicknessMap', extension.iridescenceThicknessTexture));

		}

		return Promise.all(pending);

	}

}

/**
 * Sheen Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Khronos/KHR_materials_sheen
 */
class GLTFMaterialsSheenExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SHEEN;

	}

	getMaterialType(materialIndex) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams(materialIndex, materialParams) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) {

			return Promise.resolve();

		}

		const pending = [];

		materialParams.sheenColor = new Color(0, 0, 0);
		materialParams.sheenRoughness = 0;
		materialParams.sheen = 1;

		const extension = materialDef.extensions[this.name];

		if (extension.sheenColorFactor !== undefined) {

			materialParams.sheenColor.fromArray(extension.sheenColorFactor);

		}

		if (extension.sheenRoughnessFactor !== undefined) {

			materialParams.sheenRoughness = extension.sheenRoughnessFactor;

		}

		if (extension.sheenColorTexture !== undefined) {

			pending.push(parser.assignTexture(materialParams, 'sheenColorMap', extension.sheenColorTexture, SRGBColorSpace));

		}

		if (extension.sheenRoughnessTexture !== undefined) {

			pending.push(parser.assignTexture(materialParams, 'sheenRoughnessMap', extension.sheenRoughnessTexture));

		}

		return Promise.all(pending);

	}

}

/**
 * Transmission Materials Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_transmission
 * Draft: https://github.com/KhronosGroup/glTF/pull/1698
 */
class GLTFMaterialsTransmissionExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;

	}

	getMaterialType(materialIndex) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams(materialIndex, materialParams) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[this.name];

		if (extension.transmissionFactor !== undefined) {

			materialParams.transmission = extension.transmissionFactor;

		}

		if (extension.transmissionTexture !== undefined) {

			pending.push(parser.assignTexture(materialParams, 'transmissionMap', extension.transmissionTexture));

		}

		return Promise.all(pending);

	}

}

/**
 * Materials Volume Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_volume
 */
class GLTFMaterialsVolumeExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_VOLUME;

	}

	getMaterialType(materialIndex) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams(materialIndex, materialParams) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[this.name];

		materialParams.thickness = extension.thicknessFactor !== undefined ? extension.thicknessFactor : 0;

		if (extension.thicknessTexture !== undefined) {

			pending.push(parser.assignTexture(materialParams, 'thicknessMap', extension.thicknessTexture));

		}

		materialParams.attenuationDistance = extension.attenuationDistance || Infinity;

		const colorArray = extension.attenuationColor || [1, 1, 1];
		materialParams.attenuationColor = new Color(colorArray[0], colorArray[1], colorArray[2]);

		return Promise.all(pending);

	}

}

/**
 * Materials ior Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_ior
 */
class GLTFMaterialsIorExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_IOR;

	}

	getMaterialType(materialIndex) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams(materialIndex, materialParams) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) {

			return Promise.resolve();

		}

		const extension = materialDef.extensions[this.name];

		materialParams.ior = extension.ior !== undefined ? extension.ior : 1.5;

		return Promise.resolve();

	}

}

/**
 * Materials specular Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_specular
 */
class GLTFMaterialsSpecularExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_SPECULAR;

	}

	getMaterialType(materialIndex) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams(materialIndex, materialParams) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[this.name];

		materialParams.specularIntensity = extension.specularFactor !== undefined ? extension.specularFactor : 1.0;

		if (extension.specularTexture !== undefined) {

			pending.push(parser.assignTexture(materialParams, 'specularIntensityMap', extension.specularTexture));

		}

		const colorArray = extension.specularColorFactor || [1, 1, 1];
		materialParams.specularColor = new Color(colorArray[0], colorArray[1], colorArray[2]);

		if (extension.specularColorTexture !== undefined) {

			pending.push(parser.assignTexture(materialParams, 'specularColorMap', extension.specularColorTexture, SRGBColorSpace));

		}

		return Promise.all(pending);

	}

}

/**
 * Materials anisotropy Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_anisotropy
 */
class GLTFMaterialsAnisotropyExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_MATERIALS_ANISOTROPY;

	}

	getMaterialType(materialIndex) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;

		return MeshPhysicalMaterial;

	}

	extendMaterialParams(materialIndex, materialParams) {

		const parser = this.parser;
		const materialDef = parser.json.materials[materialIndex];

		if (!materialDef.extensions || !materialDef.extensions[this.name]) {

			return Promise.resolve();

		}

		const pending = [];

		const extension = materialDef.extensions[this.name];

		if (extension.anisotropyStrength !== undefined) {

			materialParams.anisotropy = extension.anisotropyStrength;

		}

		if (extension.anisotropyRotation !== undefined) {

			materialParams.anisotropyRotation = extension.anisotropyRotation;

		}

		if (extension.anisotropyTexture !== undefined) {

			pending.push(parser.assignTexture(materialParams, 'anisotropyMap', extension.anisotropyTexture));

		}

		return Promise.all(pending);

	}

}

/**
 * BasisU Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_basisu
 */
class GLTFTextureBasisUExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.KHR_TEXTURE_BASISU;

	}

	loadTexture(textureIndex) {

		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[textureIndex];

		if (!textureDef.extensions || !textureDef.extensions[this.name]) {

			return null;

		}

		const extension = textureDef.extensions[this.name];
		const loader = parser.options.ktx2Loader;

		if (!loader) {

			if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) {

				throw new Error('THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures');

			} else {

				// Assumes that the extension is optional and that a fallback texture is present
				return null;

			}

		}

		return parser.loadTextureImage(textureIndex, extension.source, loader);

	}

}

/**
 * WebP Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_webp
 */
class GLTFTextureWebPExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.EXT_TEXTURE_WEBP;
		this.isSupported = null;

	}

	loadTexture(textureIndex) {

		const name = this.name;
		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[textureIndex];

		if (!textureDef.extensions || !textureDef.extensions[name]) {

			return null;

		}

		const extension = textureDef.extensions[name];
		const source = json.images[extension.source];

		let loader = parser.textureLoader;
		if (source.uri) {

			const handler = parser.options.manager.getHandler(source.uri);
			if (handler !== null) loader = handler;

		}

		return this.detectSupport().then(function (isSupported) {

			if (isSupported) return parser.loadTextureImage(textureIndex, extension.source, loader);

			if (json.extensionsRequired && json.extensionsRequired.indexOf(name) >= 0) {

				throw new Error('THREE.GLTFLoader: WebP required by asset but unsupported.');

			}

			// Fall back to PNG or JPEG.
			return parser.loadTexture(textureIndex);

		});

	}

	detectSupport() {

		if (!this.isSupported) {

			this.isSupported = new Promise(function (resolve) {

				const image = new Image();

				// Lossy test image. Support for lossy images doesn't guarantee support for all
				// WebP images, unfortunately.
				image.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

				image.onload = image.onerror = function () {

					resolve(image.height === 1);

				};

			});

		}

		return this.isSupported;

	}

}

/**
 * AVIF Texture Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_texture_avif
 */
class GLTFTextureAVIFExtension {

	constructor(parser) {

		this.parser = parser;
		this.name = EXTENSIONS.EXT_TEXTURE_AVIF;
		this.isSupported = null;

	}

	loadTexture(textureIndex) {

		const name = this.name;
		const parser = this.parser;
		const json = parser.json;

		const textureDef = json.textures[textureIndex];

		if (!textureDef.extensions || !textureDef.extensions[name]) {

			return null;

		}

		const extension = textureDef.extensions[name];
		const source = json.images[extension.source];

		let loader = parser.textureLoader;
		if (source.uri) {

			const handler = parser.options.manager.getHandler(source.uri);
			if (handler !== null) loader = handler;

		}

		return this.detectSupport().then(function (isSupported) {

			if (isSupported) return parser.loadTextureImage(textureIndex, extension.source, loader);

			if (json.extensionsRequired && json.extensionsRequired.indexOf(name) >= 0) {

				throw new Error('THREE.GLTFLoader: AVIF required by asset but unsupported.');

			}

			// Fall back to PNG or JPEG.
			return parser.loadTexture(textureIndex);

		});

	}

	detectSupport() {

		if (!this.isSupported) {

			this.isSupported = new Promise(function (resolve) {

				const image = new Image();

				// Lossy test image.
				image.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
				image.onload = image.onerror = function () {

					resolve(image.height === 1);

				};

			});

		}

		return this.isSupported;

	}

}

/**
 * meshopt BufferView Compression Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_meshopt_compression
 */
class GLTFMeshoptCompression {

	constructor(parser) {

		this.name = EXTENSIONS.EXT_MESHOPT_COMPRESSION;
		this.parser = parser;

	}

	loadBufferView(index) {

		const json = this.parser.json;
		const bufferView = json.bufferViews[index];

		if (bufferView.extensions && bufferView.extensions[this.name]) {

			const extensionDef = bufferView.extensions[this.name];

			const buffer = this.parser.getDependency('buffer', extensionDef.buffer);
			const decoder = this.parser.options.meshoptDecoder;

			if (!decoder || !decoder.supported) {

				if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) {

					throw new Error('THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files');

				} else {

					// Assumes that the extension is optional and that fallback buffer data is present
					return null;

				}

			}

			return buffer.then(function (res) {

				const byteOffset = extensionDef.byteOffset || 0;
				const byteLength = extensionDef.byteLength || 0;

				const count = extensionDef.count;
				const stride = extensionDef.byteStride;

				const source = new Uint8Array(res, byteOffset, byteLength);

				if (decoder.decodeGltfBufferAsync) {

					return decoder.decodeGltfBufferAsync(count, stride, source, extensionDef.mode, extensionDef.filter).then(function (res) {

						return res.buffer;

					});

				} else {

					// Support for MeshoptDecoder 0.18 or earlier, without decodeGltfBufferAsync
					return decoder.ready.then(function () {

						const result = new ArrayBuffer(count * stride);
						decoder.decodeGltfBuffer(new Uint8Array(result), count, stride, source, extensionDef.mode, extensionDef.filter);
						return result;

					});

				}

			});

		} else {

			return null;

		}

	}

}

/**
 * GPU Instancing Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_mesh_gpu_instancing
 *
 */
class GLTFMeshGpuInstancing {

	constructor(parser) {

		this.name = EXTENSIONS.EXT_MESH_GPU_INSTANCING;
		this.parser = parser;

	}

	createNodeMesh(nodeIndex) {

		const json = this.parser.json;
		const nodeDef = json.nodes[nodeIndex];

		if (!nodeDef.extensions || !nodeDef.extensions[this.name] ||
			nodeDef.mesh === undefined) {

			return null;

		}

		const meshDef = json.meshes[nodeDef.mesh];

		// No Points or Lines + Instancing support yet

		for (const primitive of meshDef.primitives) {

			if (primitive.mode !== WEBGL_CONSTANTS.TRIANGLES &&
				primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_STRIP &&
				primitive.mode !== WEBGL_CONSTANTS.TRIANGLE_FAN &&
				primitive.mode !== undefined) {

				return null;

			}

		}

		const extensionDef = nodeDef.extensions[this.name];
		const attributesDef = extensionDef.attributes;

		// @TODO: Can we support InstancedMesh + SkinnedMesh?

		const pending = [];
		const attributes = {};

		for (const key in attributesDef) {

			pending.push(this.parser.getDependency('accessor', attributesDef[key]).then(accessor => {

				attributes[key] = accessor;
				return attributes[key];

			}));

		}

		if (pending.length < 1) {

			return null;

		}

		pending.push(this.parser.createNodeMesh(nodeIndex));

		return Promise.all(pending).then(results => {

			const nodeObject = results.pop();
			const meshes = nodeObject.isGroup ? nodeObject.children : [nodeObject];
			const count = results[0].count; // All attribute counts should be same
			const instancedMeshes = [];

			for (const mesh of meshes) {

				// Temporal variables
				const m = new Matrix4();
				const p = new Vector3();
				const q = new Quaternion();
				const s = new Vector3(1, 1, 1);

				const instancedMesh = new InstancedMesh(mesh.geometry, mesh.material, count);

				for (let i = 0; i < count; i++) {

					if (attributes.TRANSLATION) {

						p.fromBufferAttribute(attributes.TRANSLATION, i);

					}

					if (attributes.ROTATION) {

						q.fromBufferAttribute(attributes.ROTATION, i);

					}

					if (attributes.SCALE) {

						s.fromBufferAttribute(attributes.SCALE, i);

					}

					instancedMesh.setMatrixAt(i, m.compose(p, q, s));

				}

				// Add instance attributes to the geometry, excluding TRS.
				for (const attributeName in attributes) {

					if (attributeName !== 'TRANSLATION' &&
						attributeName !== 'ROTATION' &&
						attributeName !== 'SCALE') {

						mesh.geometry.setAttribute(attributeName, attributes[attributeName]);

					}

				}

				// Just in case
				Object3D.prototype.copy.call(instancedMesh, mesh);

				this.parser.assignFinalMaterial(instancedMesh);

				instancedMeshes.push(instancedMesh);

			}

			if (nodeObject.isGroup) {

				nodeObject.clear();

				nodeObject.add(...instancedMeshes);

				return nodeObject;

			}

			return instancedMeshes[0];

		});

	}

}

/* BINARY EXTENSION */
const BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
const BINARY_EXTENSION_HEADER_LENGTH = 12;
const BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4E4F534A, BIN: 0x004E4942 };

class GLTFBinaryExtension {

	constructor(data) {

		this.name = EXTENSIONS.KHR_BINARY_GLTF;
		this.content = null;
		this.body = null;

		const headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);
		const textDecoder = new TextDecoder();

		this.header = {
			magic: textDecoder.decode(new Uint8Array(data.slice(0, 4))),
			version: headerView.getUint32(4, true),
			length: headerView.getUint32(8, true)
		};

		if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {

			throw new Error('THREE.GLTFLoader: Unsupported glTF-Binary header.');

		} else if (this.header.version < 2.0) {

			throw new Error('THREE.GLTFLoader: Legacy binary file detected.');

		}

		const chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
		const chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
		let chunkIndex = 0;

		while (chunkIndex < chunkContentsLength) {

			const chunkLength = chunkView.getUint32(chunkIndex, true);
			chunkIndex += 4;

			const chunkType = chunkView.getUint32(chunkIndex, true);
			chunkIndex += 4;

			if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {

				const contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength);
				this.content = textDecoder.decode(contentArray);

			} else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {

				const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
				this.body = data.slice(byteOffset, byteOffset + chunkLength);

			}

			// Clients must ignore chunks with unknown types.

			chunkIndex += chunkLength;

		}

		if (this.content === null) {

			throw new Error('THREE.GLTFLoader: JSON content not found.');

		}

	}

}

/**
 * DRACO Mesh Compression Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression
 */
class GLTFDracoMeshCompressionExtension {

	constructor(json, dracoLoader) {

		if (!dracoLoader) {

			throw new Error('THREE.GLTFLoader: No DRACOLoader instance provided.');

		}

		this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
		this.json = json;
		this.dracoLoader = dracoLoader;
		this.dracoLoader.preload();

	}

	decodePrimitive(primitive, parser) {

		const json = this.json;
		const dracoLoader = this.dracoLoader;
		const bufferViewIndex = primitive.extensions[this.name].bufferView;
		const gltfAttributeMap = primitive.extensions[this.name].attributes;
		const threeAttributeMap = {};
		const attributeNormalizedMap = {};
		const attributeTypeMap = {};

		for (const attributeName in gltfAttributeMap) {

			const threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();

			threeAttributeMap[threeAttributeName] = gltfAttributeMap[attributeName];

		}

		for (const attributeName in primitive.attributes) {

			const threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();

			if (gltfAttributeMap[attributeName] !== undefined) {

				const accessorDef = json.accessors[primitive.attributes[attributeName]];
				const componentType = WEBGL_COMPONENT_TYPES[accessorDef.componentType];

				attributeTypeMap[threeAttributeName] = componentType.name;
				attributeNormalizedMap[threeAttributeName] = accessorDef.normalized === true;

			}

		}

		return parser.getDependency('bufferView', bufferViewIndex).then(function (bufferView) {

			return new Promise(function (resolve) {

				dracoLoader.decodeDracoFile(bufferView, function (geometry) {

					for (const attributeName in geometry.attributes) {

						const attribute = geometry.attributes[attributeName];
						const normalized = attributeNormalizedMap[attributeName];

						if (normalized !== undefined) attribute.normalized = normalized;

					}

					resolve(geometry);

				}, threeAttributeMap, attributeTypeMap);

			});

		});

	}

}

/**
 * Texture Transform Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_transform
 */
class GLTFTextureTransformExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;

	}

	extendTexture(texture, transform) {

		if ((transform.texCoord === undefined || transform.texCoord === texture.channel)
			&& transform.offset === undefined
			&& transform.rotation === undefined
			&& transform.scale === undefined) {

			// See https://github.com/mrdoob/three.js/issues/21819.
			return texture;

		}

		texture = texture.clone();

		if (transform.texCoord !== undefined) {

			texture.channel = transform.texCoord;

		}

		if (transform.offset !== undefined) {

			texture.offset.fromArray(transform.offset);

		}

		if (transform.rotation !== undefined) {

			texture.rotation = transform.rotation;

		}

		if (transform.scale !== undefined) {

			texture.repeat.fromArray(transform.scale);

		}

		texture.needsUpdate = true;

		return texture;

	}

}

/**
 * Mesh Quantization Extension
 *
 * Specification: https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization
 */
class GLTFMeshQuantizationExtension {

	constructor() {

		this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;

	}

}

/*********************************/
/********** INTERPOLATION ********/
/*********************************/

// Spline Interpolation
// Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#appendix-c-spline-interpolation
class GLTFCubicSplineInterpolant extends Interpolant {

	constructor(parameterPositions, sampleValues, sampleSize, resultBuffer) {

		super(parameterPositions, sampleValues, sampleSize, resultBuffer);

	}

	copySampleValue_(index) {

		// Copies a sample value to the result buffer. See description of glTF
		// CUBICSPLINE values layout in interpolate_() function below.

		const result = this.resultBuffer,
			values = this.sampleValues,
			valueSize = this.valueSize,
			offset = index * valueSize * 3 + valueSize;

		for (let i = 0; i !== valueSize; i++) {

			result[i] = values[offset + i];

		}

		return result;

	}

	interpolate_(i1, t0, t, t1) {

		const result = this.resultBuffer;
		const values = this.sampleValues;
		const stride = this.valueSize;

		const stride2 = stride * 2;
		const stride3 = stride * 3;

		const td = t1 - t0;

		const p = (t - t0) / td;
		const pp = p * p;
		const ppp = pp * p;

		const offset1 = i1 * stride3;
		const offset0 = offset1 - stride3;

		const s2 = - 2 * ppp + 3 * pp;
		const s3 = ppp - pp;
		const s0 = 1 - s2;
		const s1 = s3 - pp + p;

		// Layout of keyframe output values for CUBICSPLINE animations:
		//   [ inTangent_1, splineVertex_1, outTangent_1, inTangent_2, splineVertex_2, ... ]
		for (let i = 0; i !== stride; i++) {

			const p0 = values[offset0 + i + stride]; // splineVertex_k
			const m0 = values[offset0 + i + stride2] * td; // outTangent_k * (t_k+1 - t_k)
			const p1 = values[offset1 + i + stride]; // splineVertex_k+1
			const m1 = values[offset1 + i] * td; // inTangent_k+1 * (t_k+1 - t_k)

			result[i] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;

		}

		return result;

	}

}

const _q$1 = new Quaternion();

class GLTFCubicSplineQuaternionInterpolant extends GLTFCubicSplineInterpolant {

	interpolate_(i1, t0, t, t1) {

		const result = super.interpolate_(i1, t0, t, t1);

		_q$1.fromArray(result).normalize().toArray(result);

		return result;

	}

}


/*********************************/
/********** INTERNALS ************/
/*********************************/

/* CONSTANTS */

const WEBGL_CONSTANTS = {
	FLOAT: 5126,
	//FLOAT_MAT2: 35674,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	LINEAR: 9729,
	REPEAT: 10497,
	SAMPLER_2D: 35678,
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_SHORT: 5123
};

const WEBGL_COMPONENT_TYPES = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
};

const WEBGL_FILTERS = {
	9728: NearestFilter,
	9729: LinearFilter,
	9984: NearestMipmapNearestFilter,
	9985: LinearMipmapNearestFilter,
	9986: NearestMipmapLinearFilter,
	9987: LinearMipmapLinearFilter
};

const WEBGL_WRAPPINGS = {
	33071: ClampToEdgeWrapping,
	33648: MirroredRepeatWrapping,
	10497: RepeatWrapping
};

const WEBGL_TYPE_SIZES = {
	'SCALAR': 1,
	'VEC2': 2,
	'VEC3': 3,
	'VEC4': 4,
	'MAT2': 4,
	'MAT3': 9,
	'MAT4': 16
};

const ATTRIBUTES = {
	POSITION: 'position',
	NORMAL: 'normal',
	TANGENT: 'tangent',
	TEXCOORD_0: 'uv',
	TEXCOORD_1: 'uv1',
	TEXCOORD_2: 'uv2',
	TEXCOORD_3: 'uv3',
	COLOR_0: 'color',
	WEIGHTS_0: 'skinWeight',
	JOINTS_0: 'skinIndex',
};

const PATH_PROPERTIES = {
	scale: 'scale',
	translation: 'position',
	rotation: 'quaternion',
	weights: 'morphTargetInfluences'
};

const INTERPOLATION = {
	CUBICSPLINE: undefined, // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
	// keyframe track will be initialized with a default interpolation type, then modified.
	LINEAR: InterpolateLinear,
	STEP: InterpolateDiscrete
};

const ALPHA_MODES = {
	OPAQUE: 'OPAQUE',
	MASK: 'MASK',
	BLEND: 'BLEND'
};

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#default-material
 */
function createDefaultMaterial(cache) {

	if (cache['DefaultMaterial'] === undefined) {

		cache['DefaultMaterial'] = new MeshStandardMaterial({
			color: 0xFFFFFF,
			emissive: 0x000000,
			metalness: 1,
			roughness: 1,
			transparent: false,
			depthTest: true,
			side: FrontSide
		});

	}

	return cache['DefaultMaterial'];

}

function addUnknownExtensionsToUserData(knownExtensions, object, objectDef) {

	// Add unknown glTF extensions to an object's userData.

	for (const name in objectDef.extensions) {

		if (knownExtensions[name] === undefined) {

			object.userData.gltfExtensions = object.userData.gltfExtensions || {};
			object.userData.gltfExtensions[name] = objectDef.extensions[name];

		}

	}

}

/**
 * @param {Object3D|Material|BufferGeometry} object
 * @param {GLTF.definition} gltfDef
 */
function assignExtrasToUserData(object, gltfDef) {

	if (gltfDef.extras !== undefined) {

		if (typeof gltfDef.extras === 'object') {

			Object.assign(object.userData, gltfDef.extras);

		} else {

			console.warn('THREE.GLTFLoader: Ignoring primitive type .extras, ' + gltfDef.extras);

		}

	}

}

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
 *
 * @param {BufferGeometry} geometry
 * @param {Array<GLTF.Target>} targets
 * @param {GLTFParser} parser
 * @return {Promise<BufferGeometry>}
 */
function addMorphTargets(geometry, targets, parser) {

	let hasMorphPosition = false;
	let hasMorphNormal = false;
	let hasMorphColor = false;

	for (let i = 0, il = targets.length; i < il; i++) {

		const target = targets[i];

		if (target.POSITION !== undefined) hasMorphPosition = true;
		if (target.NORMAL !== undefined) hasMorphNormal = true;
		if (target.COLOR_0 !== undefined) hasMorphColor = true;

		if (hasMorphPosition && hasMorphNormal && hasMorphColor) break;

	}

	if (!hasMorphPosition && !hasMorphNormal && !hasMorphColor) return Promise.resolve(geometry);

	const pendingPositionAccessors = [];
	const pendingNormalAccessors = [];
	const pendingColorAccessors = [];

	for (let i = 0, il = targets.length; i < il; i++) {

		const target = targets[i];

		if (hasMorphPosition) {

			const pendingAccessor = target.POSITION !== undefined
				? parser.getDependency('accessor', target.POSITION)
				: geometry.attributes.position;

			pendingPositionAccessors.push(pendingAccessor);

		}

		if (hasMorphNormal) {

			const pendingAccessor = target.NORMAL !== undefined
				? parser.getDependency('accessor', target.NORMAL)
				: geometry.attributes.normal;

			pendingNormalAccessors.push(pendingAccessor);

		}

		if (hasMorphColor) {

			const pendingAccessor = target.COLOR_0 !== undefined
				? parser.getDependency('accessor', target.COLOR_0)
				: geometry.attributes.color;

			pendingColorAccessors.push(pendingAccessor);

		}

	}

	return Promise.all([
		Promise.all(pendingPositionAccessors),
		Promise.all(pendingNormalAccessors),
		Promise.all(pendingColorAccessors)
	]).then(function (accessors) {

		const morphPositions = accessors[0];
		const morphNormals = accessors[1];
		const morphColors = accessors[2];

		if (hasMorphPosition) geometry.morphAttributes.position = morphPositions;
		if (hasMorphNormal) geometry.morphAttributes.normal = morphNormals;
		if (hasMorphColor) geometry.morphAttributes.color = morphColors;
		geometry.morphTargetsRelative = true;

		return geometry;

	});

}

/**
 * @param {Mesh} mesh
 * @param {GLTF.Mesh} meshDef
 */
function updateMorphTargets(mesh, meshDef) {

	mesh.updateMorphTargets();

	if (meshDef.weights !== undefined) {

		for (let i = 0, il = meshDef.weights.length; i < il; i++) {

			mesh.morphTargetInfluences[i] = meshDef.weights[i];

		}

	}

	// .extras has user-defined data, so check that .extras.targetNames is an array.
	if (meshDef.extras && Array.isArray(meshDef.extras.targetNames)) {

		const targetNames = meshDef.extras.targetNames;

		if (mesh.morphTargetInfluences.length === targetNames.length) {

			mesh.morphTargetDictionary = {};

			for (let i = 0, il = targetNames.length; i < il; i++) {

				mesh.morphTargetDictionary[targetNames[i]] = i;

			}

		} else {

			console.warn('THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.');

		}

	}

}

function createPrimitiveKey(primitiveDef) {

	let geometryKey;

	const dracoExtension = primitiveDef.extensions && primitiveDef.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION];

	if (dracoExtension) {

		geometryKey = 'draco:' + dracoExtension.bufferView
			+ ':' + dracoExtension.indices
			+ ':' + createAttributesKey(dracoExtension.attributes);

	} else {

		geometryKey = primitiveDef.indices + ':' + createAttributesKey(primitiveDef.attributes) + ':' + primitiveDef.mode;

	}

	if (primitiveDef.targets !== undefined) {

		for (let i = 0, il = primitiveDef.targets.length; i < il; i++) {

			geometryKey += ':' + createAttributesKey(primitiveDef.targets[i]);

		}

	}

	return geometryKey;

}

function createAttributesKey(attributes) {

	let attributesKey = '';

	const keys = Object.keys(attributes).sort();

	for (let i = 0, il = keys.length; i < il; i++) {

		attributesKey += keys[i] + ':' + attributes[keys[i]] + ';';

	}

	return attributesKey;

}

function getNormalizedComponentScale(constructor) {

	// Reference:
	// https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization#encoding-quantized-data

	switch (constructor) {

		case Int8Array:
			return 1 / 127;

		case Uint8Array:
			return 1 / 255;

		case Int16Array:
			return 1 / 32767;

		case Uint16Array:
			return 1 / 65535;

		default:
			throw new Error('THREE.GLTFLoader: Unsupported normalized accessor component type.');

	}

}

function getImageURIMimeType(uri) {

	if (uri.search(/\.jpe?g($|\?)/i) > 0 || uri.search(/^data\:image\/jpeg/) === 0) return 'image/jpeg';
	if (uri.search(/\.webp($|\?)/i) > 0 || uri.search(/^data\:image\/webp/) === 0) return 'image/webp';

	return 'image/png';

}

const _identityMatrix$1 = new Matrix4();

/* GLTF PARSER */

class GLTFParser {

	constructor(json = {}, options = {}) {

		this.json = json;
		this.extensions = {};
		this.plugins = {};
		this.options = options;

		// loader object cache
		this.cache = new GLTFRegistry();

		// associations between Three.js objects and glTF elements
		this.associations = new Map();

		// BufferGeometry caching
		this.primitiveCache = {};

		// Node cache
		this.nodeCache = {};

		// Object3D instance caches
		this.meshCache = { refs: {}, uses: {} };
		this.cameraCache = { refs: {}, uses: {} };
		this.lightCache = { refs: {}, uses: {} };

		this.sourceCache = {};
		this.textureCache = {};

		// Track node names, to ensure no duplicates
		this.nodeNamesUsed = {};

		// Use an ImageBitmapLoader if imageBitmaps are supported. Moves much of the
		// expensive work of uploading a texture to the GPU off the main thread.

		let isSafari = false;
		let isFirefox = false;
		let firefoxVersion = - 1;

		if (typeof navigator !== 'undefined') {

			isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) === true;
			isFirefox = navigator.userAgent.indexOf('Firefox') > - 1;
			firefoxVersion = isFirefox ? navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1] : - 1;

		}

		if (typeof createImageBitmap === 'undefined' || isSafari || (isFirefox && firefoxVersion < 98)) {

			this.textureLoader = new TextureLoader(this.options.manager);

		} else {

			this.textureLoader = new ImageBitmapLoader(this.options.manager);

		}

		this.textureLoader.setCrossOrigin(this.options.crossOrigin);
		this.textureLoader.setRequestHeader(this.options.requestHeader);

		this.fileLoader = new FileLoader(this.options.manager);
		this.fileLoader.setResponseType('arraybuffer');

		if (this.options.crossOrigin === 'use-credentials') {

			this.fileLoader.setWithCredentials(true);

		}

	}

	setExtensions(extensions) {

		this.extensions = extensions;

	}

	setPlugins(plugins) {

		this.plugins = plugins;

	}

	parse(onLoad, onError) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;

		// Clear the loader cache
		this.cache.removeAll();
		this.nodeCache = {};

		// Mark the special nodes/meshes in json for efficient parse
		this._invokeAll(function (ext) {

			return ext._markDefs && ext._markDefs();

		});

		Promise.all(this._invokeAll(function (ext) {

			return ext.beforeRoot && ext.beforeRoot();

		})).then(function () {

			return Promise.all([

				parser.getDependencies('scene'),
				parser.getDependencies('animation'),
				parser.getDependencies('camera'),

			]);

		}).then(function (dependencies) {

			const result = {
				scene: dependencies[0][json.scene || 0],
				scenes: dependencies[0],
				animations: dependencies[1],
				cameras: dependencies[2],
				asset: json.asset,
				parser: parser,
				userData: {}
			};

			addUnknownExtensionsToUserData(extensions, result, json);

			assignExtrasToUserData(result, json);

			Promise.all(parser._invokeAll(function (ext) {

				return ext.afterRoot && ext.afterRoot(result);

			})).then(function () {

				onLoad(result);

			});

		}).catch(onError);

	}

	/**
	 * Marks the special nodes/meshes in json for efficient parse.
	 */
	_markDefs() {

		const nodeDefs = this.json.nodes || [];
		const skinDefs = this.json.skins || [];
		const meshDefs = this.json.meshes || [];

		// Nothing in the node definition indicates whether it is a Bone or an
		// Object3D. Use the skins' joint references to mark bones.
		for (let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {

			const joints = skinDefs[skinIndex].joints;

			for (let i = 0, il = joints.length; i < il; i++) {

				nodeDefs[joints[i]].isBone = true;

			}

		}

		// Iterate over all nodes, marking references to shared resources,
		// as well as skeleton joints.
		for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {

			const nodeDef = nodeDefs[nodeIndex];

			if (nodeDef.mesh !== undefined) {

				this._addNodeRef(this.meshCache, nodeDef.mesh);

				// Nothing in the mesh definition indicates whether it is
				// a SkinnedMesh or Mesh. Use the node's mesh reference
				// to mark SkinnedMesh if node has skin.
				if (nodeDef.skin !== undefined) {

					meshDefs[nodeDef.mesh].isSkinnedMesh = true;

				}

			}

			if (nodeDef.camera !== undefined) {

				this._addNodeRef(this.cameraCache, nodeDef.camera);

			}

		}

	}

	/**
	 * Counts references to shared node / Object3D resources. These resources
	 * can be reused, or "instantiated", at multiple nodes in the scene
	 * hierarchy. Mesh, Camera, and Light instances are instantiated and must
	 * be marked. Non-scenegraph resources (like Materials, Geometries, and
	 * Textures) can be reused directly and are not marked here.
	 *
	 * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
	 */
	_addNodeRef(cache, index) {

		if (index === undefined) return;

		if (cache.refs[index] === undefined) {

			cache.refs[index] = cache.uses[index] = 0;

		}

		cache.refs[index]++;

	}

	/** Returns a reference to a shared resource, cloning it if necessary. */
	_getNodeRef(cache, index, object) {

		if (cache.refs[index] <= 1) return object;

		const ref = object.clone();

		// Propagates mappings to the cloned object, prevents mappings on the
		// original object from being lost.
		const updateMappings = (original, clone) => {

			const mappings = this.associations.get(original);
			if (mappings != null) {

				this.associations.set(clone, mappings);

			}

			for (const [i, child] of original.children.entries()) {

				updateMappings(child, clone.children[i]);

			}

		};

		updateMappings(object, ref);

		ref.name += '_instance_' + (cache.uses[index]++);

		return ref;

	}

	_invokeOne(func) {

		const extensions = Object.values(this.plugins);
		extensions.push(this);

		for (let i = 0; i < extensions.length; i++) {

			const result = func(extensions[i]);

			if (result) return result;

		}

		return null;

	}

	_invokeAll(func) {

		const extensions = Object.values(this.plugins);
		extensions.unshift(this);

		const pending = [];

		for (let i = 0; i < extensions.length; i++) {

			const result = func(extensions[i]);

			if (result) pending.push(result);

		}

		return pending;

	}

	/**
	 * Requests the specified dependency asynchronously, with caching.
	 * @param {string} type
	 * @param {number} index
	 * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
	 */
	getDependency(type, index) {

		const cacheKey = type + ':' + index;
		let dependency = this.cache.get(cacheKey);

		if (!dependency) {

			switch (type) {

				case 'scene':
					dependency = this.loadScene(index);
					break;

				case 'node':
					dependency = this._invokeOne(function (ext) {

						return ext.loadNode && ext.loadNode(index);

					});
					break;

				case 'mesh':
					dependency = this._invokeOne(function (ext) {

						return ext.loadMesh && ext.loadMesh(index);

					});
					break;

				case 'accessor':
					dependency = this.loadAccessor(index);
					break;

				case 'bufferView':
					dependency = this._invokeOne(function (ext) {

						return ext.loadBufferView && ext.loadBufferView(index);

					});
					break;

				case 'buffer':
					dependency = this.loadBuffer(index);
					break;

				case 'material':
					dependency = this._invokeOne(function (ext) {

						return ext.loadMaterial && ext.loadMaterial(index);

					});
					break;

				case 'texture':
					dependency = this._invokeOne(function (ext) {

						return ext.loadTexture && ext.loadTexture(index);

					});
					break;

				case 'skin':
					dependency = this.loadSkin(index);
					break;

				case 'animation':
					dependency = this._invokeOne(function (ext) {

						return ext.loadAnimation && ext.loadAnimation(index);

					});
					break;

				case 'camera':
					dependency = this.loadCamera(index);
					break;

				default:
					dependency = this._invokeOne(function (ext) {

						return ext != this && ext.getDependency && ext.getDependency(type, index);

					});

					if (!dependency) {

						throw new Error('Unknown type: ' + type);

					}

					break;

			}

			this.cache.add(cacheKey, dependency);

		}

		return dependency;

	}

	/**
	 * Requests all dependencies of the specified type asynchronously, with caching.
	 * @param {string} type
	 * @return {Promise<Array<Object>>}
	 */
	getDependencies(type) {

		let dependencies = this.cache.get(type);

		if (!dependencies) {

			const parser = this;
			const defs = this.json[type + (type === 'mesh' ? 'es' : 's')] || [];

			dependencies = Promise.all(defs.map(function (def, index) {

				return parser.getDependency(type, index);

			}));

			this.cache.add(type, dependencies);

		}

		return dependencies;

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferIndex
	 * @return {Promise<ArrayBuffer>}
	 */
	loadBuffer(bufferIndex) {

		const bufferDef = this.json.buffers[bufferIndex];
		const loader = this.fileLoader;

		if (bufferDef.type && bufferDef.type !== 'arraybuffer') {

			throw new Error('THREE.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.');

		}

		// If present, GLB container is required to be the first buffer.
		if (bufferDef.uri === undefined && bufferIndex === 0) {

			return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);

		}

		const options = this.options;

		return new Promise(function (resolve, reject) {

			loader.load(LoaderUtils.resolveURL(bufferDef.uri, options.path), resolve, undefined, function () {

				reject(new Error('THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".'));

			});

		});

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferViewIndex
	 * @return {Promise<ArrayBuffer>}
	 */
	loadBufferView(bufferViewIndex) {

		const bufferViewDef = this.json.bufferViews[bufferViewIndex];

		return this.getDependency('buffer', bufferViewDef.buffer).then(function (buffer) {

			const byteLength = bufferViewDef.byteLength || 0;
			const byteOffset = bufferViewDef.byteOffset || 0;
			return buffer.slice(byteOffset, byteOffset + byteLength);

		});

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
	 * @param {number} accessorIndex
	 * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
	 */
	loadAccessor(accessorIndex) {

		const parser = this;
		const json = this.json;

		const accessorDef = this.json.accessors[accessorIndex];

		if (accessorDef.bufferView === undefined && accessorDef.sparse === undefined) {

			const itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
			const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
			const normalized = accessorDef.normalized === true;

			const array = new TypedArray(accessorDef.count * itemSize);
			return Promise.resolve(new BufferAttribute(array, itemSize, normalized));

		}

		const pendingBufferViews = [];

		if (accessorDef.bufferView !== undefined) {

			pendingBufferViews.push(this.getDependency('bufferView', accessorDef.bufferView));

		} else {

			pendingBufferViews.push(null);

		}

		if (accessorDef.sparse !== undefined) {

			pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.indices.bufferView));
			pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.values.bufferView));

		}

		return Promise.all(pendingBufferViews).then(function (bufferViews) {

			const bufferView = bufferViews[0];

			const itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
			const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];

			// For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
			const elementBytes = TypedArray.BYTES_PER_ELEMENT;
			const itemBytes = elementBytes * itemSize;
			const byteOffset = accessorDef.byteOffset || 0;
			const byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[accessorDef.bufferView].byteStride : undefined;
			const normalized = accessorDef.normalized === true;
			let array, bufferAttribute;

			// The buffer is not interleaved if the stride is the item size in bytes.
			if (byteStride && byteStride !== itemBytes) {

				// Each "slice" of the buffer, as defined by 'count' elements of 'byteStride' bytes, gets its own InterleavedBuffer
				// This makes sure that IBA.count reflects accessor.count properly
				const ibSlice = Math.floor(byteOffset / byteStride);
				const ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType + ':' + ibSlice + ':' + accessorDef.count;
				let ib = parser.cache.get(ibCacheKey);

				if (!ib) {

					array = new TypedArray(bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes);

					// Integer parameters to IB/IBA are in array elements, not bytes.
					ib = new InterleavedBuffer(array, byteStride / elementBytes);

					parser.cache.add(ibCacheKey, ib);

				}

				bufferAttribute = new InterleavedBufferAttribute(ib, itemSize, (byteOffset % byteStride) / elementBytes, normalized);

			} else {

				if (bufferView === null) {

					array = new TypedArray(accessorDef.count * itemSize);

				} else {

					array = new TypedArray(bufferView, byteOffset, accessorDef.count * itemSize);

				}

				bufferAttribute = new BufferAttribute(array, itemSize, normalized);

			}

			// https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
			if (accessorDef.sparse !== undefined) {

				const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
				const TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];

				const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
				const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;

				const sparseIndices = new TypedArrayIndices(bufferViews[1], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices);
				const sparseValues = new TypedArray(bufferViews[2], byteOffsetValues, accessorDef.sparse.count * itemSize);

				if (bufferView !== null) {

					// Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
					bufferAttribute = new BufferAttribute(bufferAttribute.array.slice(), bufferAttribute.itemSize, bufferAttribute.normalized);

				}

				for (let i = 0, il = sparseIndices.length; i < il; i++) {

					const index = sparseIndices[i];

					bufferAttribute.setX(index, sparseValues[i * itemSize]);
					if (itemSize >= 2) bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
					if (itemSize >= 3) bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
					if (itemSize >= 4) bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
					if (itemSize >= 5) throw new Error('THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.');

				}

			}

			return bufferAttribute;

		});

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
	 * @param {number} textureIndex
	 * @return {Promise<THREE.Texture|null>}
	 */
	loadTexture(textureIndex) {

		const json = this.json;
		const options = this.options;
		const textureDef = json.textures[textureIndex];
		const sourceIndex = textureDef.source;
		const sourceDef = json.images[sourceIndex];

		let loader = this.textureLoader;

		if (sourceDef.uri) {

			const handler = options.manager.getHandler(sourceDef.uri);
			if (handler !== null) loader = handler;

		}

		return this.loadTextureImage(textureIndex, sourceIndex, loader);

	}

	loadTextureImage(textureIndex, sourceIndex, loader) {

		const parser = this;
		const json = this.json;

		const textureDef = json.textures[textureIndex];
		const sourceDef = json.images[sourceIndex];

		const cacheKey = (sourceDef.uri || sourceDef.bufferView) + ':' + textureDef.sampler;

		if (this.textureCache[cacheKey]) {

			// See https://github.com/mrdoob/three.js/issues/21559.
			return this.textureCache[cacheKey];

		}

		const promise = this.loadImageSource(sourceIndex, loader).then(function (texture) {

			texture.flipY = false;

			texture.name = textureDef.name || sourceDef.name || '';

			if (texture.name === '' && typeof sourceDef.uri === 'string' && sourceDef.uri.startsWith('data:image/') === false) {

				texture.name = sourceDef.uri;

			}

			const samplers = json.samplers || {};
			const sampler = samplers[textureDef.sampler] || {};

			texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || LinearFilter;
			texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || LinearMipmapLinearFilter;
			texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || RepeatWrapping;
			texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || RepeatWrapping;

			parser.associations.set(texture, { textures: textureIndex });

			return texture;

		}).catch(function () {

			return null;

		});

		this.textureCache[cacheKey] = promise;

		return promise;

	}

	loadImageSource(sourceIndex, loader) {

		const parser = this;
		const json = this.json;
		const options = this.options;

		if (this.sourceCache[sourceIndex] !== undefined) {

			return this.sourceCache[sourceIndex].then((texture) => texture.clone());

		}

		const sourceDef = json.images[sourceIndex];

		const URL = self.URL || self.webkitURL;

		let sourceURI = sourceDef.uri || '';
		let isObjectURL = false;

		if (sourceDef.bufferView !== undefined) {

			// Load binary image data from bufferView, if provided.

			sourceURI = parser.getDependency('bufferView', sourceDef.bufferView).then(function (bufferView) {

				isObjectURL = true;
				const blob = new Blob([bufferView], { type: sourceDef.mimeType });
				sourceURI = URL.createObjectURL(blob);
				return sourceURI;

			});

		} else if (sourceDef.uri === undefined) {

			throw new Error('THREE.GLTFLoader: Image ' + sourceIndex + ' is missing URI and bufferView');

		}

		const promise = Promise.resolve(sourceURI).then(function (sourceURI) {

			return new Promise(function (resolve, reject) {

				let onLoad = resolve;

				if (loader.isImageBitmapLoader === true) {

					onLoad = function (imageBitmap) {

						const texture = new Texture(imageBitmap);
						texture.needsUpdate = true;

						resolve(texture);

					};

				}

				loader.load(LoaderUtils.resolveURL(sourceURI, options.path), onLoad, undefined, reject);

			});

		}).then(function (texture) {

			// Clean up resources and configure Texture.

			if (isObjectURL === true) {

				URL.revokeObjectURL(sourceURI);

			}

			texture.userData.mimeType = sourceDef.mimeType || getImageURIMimeType(sourceDef.uri);

			return texture;

		}).catch(function (error) {

			console.error('THREE.GLTFLoader: Couldn\'t load texture', sourceURI);
			throw error;

		});

		this.sourceCache[sourceIndex] = promise;
		return promise;

	}

	/**
	 * Asynchronously assigns a texture to the given material parameters.
	 * @param {Object} materialParams
	 * @param {string} mapName
	 * @param {Object} mapDef
	 * @return {Promise<Texture>}
	 */
	assignTexture(materialParams, mapName, mapDef, colorSpace) {

		const parser = this;

		return this.getDependency('texture', mapDef.index).then(function (texture) {

			if (!texture) return null;

			if (mapDef.texCoord !== undefined && mapDef.texCoord > 0) {

				texture = texture.clone();
				texture.channel = mapDef.texCoord;

			}

			if (parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM]) {

				const transform = mapDef.extensions !== undefined ? mapDef.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM] : undefined;

				if (transform) {

					const gltfReference = parser.associations.get(texture);
					texture = parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM].extendTexture(texture, transform);
					parser.associations.set(texture, gltfReference);

				}

			}

			if (colorSpace !== undefined) {

				texture.colorSpace = colorSpace;

			}

			materialParams[mapName] = texture;

			return texture;

		});

	}

	/**
	 * Assigns final material to a Mesh, Line, or Points instance. The instance
	 * already has a material (generated from the glTF material options alone)
	 * but reuse of the same glTF material may require multiple threejs materials
	 * to accommodate different primitive types, defines, etc. New materials will
	 * be created if necessary, and reused from a cache.
	 * @param  {Object3D} mesh Mesh, Line, or Points instance.
	 */
	assignFinalMaterial(mesh) {

		const geometry = mesh.geometry;
		let material = mesh.material;

		const useDerivativeTangents = geometry.attributes.tangent === undefined;
		const useVertexColors = geometry.attributes.color !== undefined;
		const useFlatShading = geometry.attributes.normal === undefined;

		if (mesh.isPoints) {

			const cacheKey = 'PointsMaterial:' + material.uuid;

			let pointsMaterial = this.cache.get(cacheKey);

			if (!pointsMaterial) {

				pointsMaterial = new PointsMaterial();
				Material.prototype.copy.call(pointsMaterial, material);
				pointsMaterial.color.copy(material.color);
				pointsMaterial.map = material.map;
				pointsMaterial.sizeAttenuation = false; // glTF spec says points should be 1px

				this.cache.add(cacheKey, pointsMaterial);

			}

			material = pointsMaterial;

		} else if (mesh.isLine) {

			const cacheKey = 'LineBasicMaterial:' + material.uuid;

			let lineMaterial = this.cache.get(cacheKey);

			if (!lineMaterial) {

				lineMaterial = new LineBasicMaterial();
				Material.prototype.copy.call(lineMaterial, material);
				lineMaterial.color.copy(material.color);
				lineMaterial.map = material.map;

				this.cache.add(cacheKey, lineMaterial);

			}

			material = lineMaterial;

		}

		// Clone the material if it will be modified
		if (useDerivativeTangents || useVertexColors || useFlatShading) {

			let cacheKey = 'ClonedMaterial:' + material.uuid + ':';

			if (useDerivativeTangents) cacheKey += 'derivative-tangents:';
			if (useVertexColors) cacheKey += 'vertex-colors:';
			if (useFlatShading) cacheKey += 'flat-shading:';

			let cachedMaterial = this.cache.get(cacheKey);

			if (!cachedMaterial) {

				cachedMaterial = material.clone();

				if (useVertexColors) cachedMaterial.vertexColors = true;
				if (useFlatShading) cachedMaterial.flatShading = true;

				if (useDerivativeTangents) {

					// https://github.com/mrdoob/three.js/issues/11438#issuecomment-507003995
					if (cachedMaterial.normalScale) cachedMaterial.normalScale.y *= - 1;
					if (cachedMaterial.clearcoatNormalScale) cachedMaterial.clearcoatNormalScale.y *= - 1;

				}

				this.cache.add(cacheKey, cachedMaterial);

				this.associations.set(cachedMaterial, this.associations.get(material));

			}

			material = cachedMaterial;

		}

		mesh.material = material;

	}

	getMaterialType( /* materialIndex */) {

		return MeshStandardMaterial;

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
	 * @param {number} materialIndex
	 * @return {Promise<Material>}
	 */
	loadMaterial(materialIndex) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;
		const materialDef = json.materials[materialIndex];

		let materialType;
		const materialParams = {};
		const materialExtensions = materialDef.extensions || {};

		const pending = [];

		if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {

			const kmuExtension = extensions[EXTENSIONS.KHR_MATERIALS_UNLIT];
			materialType = kmuExtension.getMaterialType();
			pending.push(kmuExtension.extendParams(materialParams, materialDef, parser));

		} else {

			// Specification:
			// https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material

			const metallicRoughness = materialDef.pbrMetallicRoughness || {};

			materialParams.color = new Color(1.0, 1.0, 1.0);
			materialParams.opacity = 1.0;

			if (Array.isArray(metallicRoughness.baseColorFactor)) {

				const array = metallicRoughness.baseColorFactor;

				materialParams.color.fromArray(array);
				materialParams.opacity = array[3];

			}

			if (metallicRoughness.baseColorTexture !== undefined) {

				pending.push(parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture, SRGBColorSpace));

			}

			materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
			materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;

			if (metallicRoughness.metallicRoughnessTexture !== undefined) {

				pending.push(parser.assignTexture(materialParams, 'metalnessMap', metallicRoughness.metallicRoughnessTexture));
				pending.push(parser.assignTexture(materialParams, 'roughnessMap', metallicRoughness.metallicRoughnessTexture));

			}

			materialType = this._invokeOne(function (ext) {

				return ext.getMaterialType && ext.getMaterialType(materialIndex);

			});

			pending.push(Promise.all(this._invokeAll(function (ext) {

				return ext.extendMaterialParams && ext.extendMaterialParams(materialIndex, materialParams);

			})));

		}

		if (materialDef.doubleSided === true) {

			materialParams.side = DoubleSide;

		}

		const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;

		if (alphaMode === ALPHA_MODES.BLEND) {

			materialParams.transparent = true;

			// See: https://github.com/mrdoob/three.js/issues/17706
			materialParams.depthWrite = false;

		} else {

			materialParams.transparent = false;

			if (alphaMode === ALPHA_MODES.MASK) {

				materialParams.alphaTest = materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5;

			}

		}

		if (materialDef.normalTexture !== undefined && materialType !== MeshBasicMaterial) {

			pending.push(parser.assignTexture(materialParams, 'normalMap', materialDef.normalTexture));

			materialParams.normalScale = new Vector2(1, 1);

			if (materialDef.normalTexture.scale !== undefined) {

				const scale = materialDef.normalTexture.scale;

				materialParams.normalScale.set(scale, scale);

			}

		}

		if (materialDef.occlusionTexture !== undefined && materialType !== MeshBasicMaterial) {

			pending.push(parser.assignTexture(materialParams, 'aoMap', materialDef.occlusionTexture));

			if (materialDef.occlusionTexture.strength !== undefined) {

				materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;

			}

		}

		if (materialDef.emissiveFactor !== undefined && materialType !== MeshBasicMaterial) {

			materialParams.emissive = new Color().fromArray(materialDef.emissiveFactor);

		}

		if (materialDef.emissiveTexture !== undefined && materialType !== MeshBasicMaterial) {

			pending.push(parser.assignTexture(materialParams, 'emissiveMap', materialDef.emissiveTexture, SRGBColorSpace));

		}

		return Promise.all(pending).then(function () {

			const material = new materialType(materialParams);

			if (materialDef.name) material.name = materialDef.name;

			assignExtrasToUserData(material, materialDef);

			parser.associations.set(material, { materials: materialIndex });

			if (materialDef.extensions) addUnknownExtensionsToUserData(extensions, material, materialDef);

			return material;

		});

	}

	/** When Object3D instances are targeted by animation, they need unique names. */
	createUniqueName(originalName) {

		const sanitizedName = PropertyBinding.sanitizeNodeName(originalName || '');

		if (sanitizedName in this.nodeNamesUsed) {

			return sanitizedName + '_' + (++this.nodeNamesUsed[sanitizedName]);

		} else {

			this.nodeNamesUsed[sanitizedName] = 0;

			return sanitizedName;

		}

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
	 *
	 * Creates BufferGeometries from primitives.
	 *
	 * @param {Array<GLTF.Primitive>} primitives
	 * @return {Promise<Array<BufferGeometry>>}
	 */
	loadGeometries(primitives) {

		const parser = this;
		const extensions = this.extensions;
		const cache = this.primitiveCache;

		function createDracoPrimitive(primitive) {

			return extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]
				.decodePrimitive(primitive, parser)
				.then(function (geometry) {

					return addPrimitiveAttributes(geometry, primitive, parser);

				});

		}

		const pending = [];

		for (let i = 0, il = primitives.length; i < il; i++) {

			const primitive = primitives[i];
			const cacheKey = createPrimitiveKey(primitive);

			// See if we've already created this geometry
			const cached = cache[cacheKey];

			if (cached) {

				// Use the cached geometry if it exists
				pending.push(cached.promise);

			} else {

				let geometryPromise;

				if (primitive.extensions && primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]) {

					// Use DRACO geometry if available
					geometryPromise = createDracoPrimitive(primitive);

				} else {

					// Otherwise create a new geometry
					geometryPromise = addPrimitiveAttributes(new BufferGeometry(), primitive, parser);

				}

				// Cache this geometry
				cache[cacheKey] = { primitive: primitive, promise: geometryPromise };

				pending.push(geometryPromise);

			}

		}

		return Promise.all(pending);

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
	 * @param {number} meshIndex
	 * @return {Promise<Group|Mesh|SkinnedMesh>}
	 */
	loadMesh(meshIndex) {

		const parser = this;
		const json = this.json;
		const extensions = this.extensions;

		const meshDef = json.meshes[meshIndex];
		const primitives = meshDef.primitives;

		const pending = [];

		for (let i = 0, il = primitives.length; i < il; i++) {

			const material = primitives[i].material === undefined
				? createDefaultMaterial(this.cache)
				: this.getDependency('material', primitives[i].material);

			pending.push(material);

		}

		pending.push(parser.loadGeometries(primitives));

		return Promise.all(pending).then(function (results) {

			const materials = results.slice(0, results.length - 1);
			const geometries = results[results.length - 1];

			const meshes = [];

			for (let i = 0, il = geometries.length; i < il; i++) {

				const geometry = geometries[i];
				const primitive = primitives[i];

				// 1. create Mesh

				let mesh;

				const material = materials[i];

				if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
					primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
					primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
					primitive.mode === undefined) {

					// .isSkinnedMesh isn't in glTF spec. See ._markDefs()
					mesh = meshDef.isSkinnedMesh === true
						? new SkinnedMesh(geometry, material)
						: new Mesh(geometry, material);

					if (mesh.isSkinnedMesh === true) {

						// normalize skin weights to fix malformed assets (see #15319)
						mesh.normalizeSkinWeights();

					}

					if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {

						mesh.geometry = toTrianglesDrawMode(mesh.geometry, TriangleStripDrawMode);

					} else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {

						mesh.geometry = toTrianglesDrawMode(mesh.geometry, TriangleFanDrawMode);

					}

				} else if (primitive.mode === WEBGL_CONSTANTS.LINES) {

					mesh = new LineSegments(geometry, material);

				} else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {

					mesh = new Line(geometry, material);

				} else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {

					mesh = new LineLoop(geometry, material);

				} else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {

					mesh = new Points(geometry, material);

				} else {

					throw new Error('THREE.GLTFLoader: Primitive mode unsupported: ' + primitive.mode);

				}

				if (Object.keys(mesh.geometry.morphAttributes).length > 0) {

					updateMorphTargets(mesh, meshDef);

				}

				mesh.name = parser.createUniqueName(meshDef.name || ('mesh_' + meshIndex));

				assignExtrasToUserData(mesh, meshDef);

				if (primitive.extensions) addUnknownExtensionsToUserData(extensions, mesh, primitive);

				parser.assignFinalMaterial(mesh);

				meshes.push(mesh);

			}

			for (let i = 0, il = meshes.length; i < il; i++) {

				parser.associations.set(meshes[i], {
					meshes: meshIndex,
					primitives: i
				});

			}

			if (meshes.length === 1) {

				if (meshDef.extensions) addUnknownExtensionsToUserData(extensions, meshes[0], meshDef);

				return meshes[0];

			}

			const group = new Group();

			if (meshDef.extensions) addUnknownExtensionsToUserData(extensions, group, meshDef);

			parser.associations.set(group, { meshes: meshIndex });

			for (let i = 0, il = meshes.length; i < il; i++) {

				group.add(meshes[i]);

			}

			return group;

		});

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
	 * @param {number} cameraIndex
	 * @return {Promise<THREE.Camera>}
	 */
	loadCamera(cameraIndex) {

		let camera;
		const cameraDef = this.json.cameras[cameraIndex];
		const params = cameraDef[cameraDef.type];

		if (!params) {

			console.warn('THREE.GLTFLoader: Missing camera parameters.');
			return;

		}

		if (cameraDef.type === 'perspective') {

			camera = new PerspectiveCamera(MathUtils.radToDeg(params.yfov), params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6);

		} else if (cameraDef.type === 'orthographic') {

			camera = new OrthographicCamera(- params.xmag, params.xmag, params.ymag, - params.ymag, params.znear, params.zfar);

		}

		if (cameraDef.name) camera.name = this.createUniqueName(cameraDef.name);

		assignExtrasToUserData(camera, cameraDef);

		return Promise.resolve(camera);

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
	 * @param {number} skinIndex
	 * @return {Promise<Skeleton>}
	 */
	loadSkin(skinIndex) {

		const skinDef = this.json.skins[skinIndex];

		const pending = [];

		for (let i = 0, il = skinDef.joints.length; i < il; i++) {

			pending.push(this._loadNodeShallow(skinDef.joints[i]));

		}

		if (skinDef.inverseBindMatrices !== undefined) {

			pending.push(this.getDependency('accessor', skinDef.inverseBindMatrices));

		} else {

			pending.push(null);

		}

		return Promise.all(pending).then(function (results) {

			const inverseBindMatrices = results.pop();
			const jointNodes = results;

			// Note that bones (joint nodes) may or may not be in the
			// scene graph at this time.

			const bones = [];
			const boneInverses = [];

			for (let i = 0, il = jointNodes.length; i < il; i++) {

				const jointNode = jointNodes[i];

				if (jointNode) {

					bones.push(jointNode);

					const mat = new Matrix4();

					if (inverseBindMatrices !== null) {

						mat.fromArray(inverseBindMatrices.array, i * 16);

					}

					boneInverses.push(mat);

				} else {

					console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', skinDef.joints[i]);

				}

			}

			return new Skeleton(bones, boneInverses);

		});

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
	 * @param {number} animationIndex
	 * @return {Promise<AnimationClip>}
	 */
	loadAnimation(animationIndex) {

		const json = this.json;
		const parser = this;

		const animationDef = json.animations[animationIndex];
		const animationName = animationDef.name ? animationDef.name : 'animation_' + animationIndex;

		const pendingNodes = [];
		const pendingInputAccessors = [];
		const pendingOutputAccessors = [];
		const pendingSamplers = [];
		const pendingTargets = [];

		for (let i = 0, il = animationDef.channels.length; i < il; i++) {

			const channel = animationDef.channels[i];
			const sampler = animationDef.samplers[channel.sampler];
			const target = channel.target;
			const name = target.node;
			const input = animationDef.parameters !== undefined ? animationDef.parameters[sampler.input] : sampler.input;
			const output = animationDef.parameters !== undefined ? animationDef.parameters[sampler.output] : sampler.output;

			if (target.node === undefined) continue;

			pendingNodes.push(this.getDependency('node', name));
			pendingInputAccessors.push(this.getDependency('accessor', input));
			pendingOutputAccessors.push(this.getDependency('accessor', output));
			pendingSamplers.push(sampler);
			pendingTargets.push(target);

		}

		return Promise.all([

			Promise.all(pendingNodes),
			Promise.all(pendingInputAccessors),
			Promise.all(pendingOutputAccessors),
			Promise.all(pendingSamplers),
			Promise.all(pendingTargets)

		]).then(function (dependencies) {

			const nodes = dependencies[0];
			const inputAccessors = dependencies[1];
			const outputAccessors = dependencies[2];
			const samplers = dependencies[3];
			const targets = dependencies[4];

			const tracks = [];

			for (let i = 0, il = nodes.length; i < il; i++) {

				const node = nodes[i];
				const inputAccessor = inputAccessors[i];
				const outputAccessor = outputAccessors[i];
				const sampler = samplers[i];
				const target = targets[i];

				if (node === undefined) continue;

				if (node.updateMatrix) {

					node.updateMatrix();

				}

				const createdTracks = parser._createAnimationTracks(node, inputAccessor, outputAccessor, sampler, target);

				if (createdTracks) {

					for (let k = 0; k < createdTracks.length; k++) {

						tracks.push(createdTracks[k]);

					}

				}

			}

			return new AnimationClip(animationName, undefined, tracks);

		});

	}

	createNodeMesh(nodeIndex) {

		const json = this.json;
		const parser = this;
		const nodeDef = json.nodes[nodeIndex];

		if (nodeDef.mesh === undefined) return null;

		return parser.getDependency('mesh', nodeDef.mesh).then(function (mesh) {

			const node = parser._getNodeRef(parser.meshCache, nodeDef.mesh, mesh);

			// if weights are provided on the node, override weights on the mesh.
			if (nodeDef.weights !== undefined) {

				node.traverse(function (o) {

					if (!o.isMesh) return;

					for (let i = 0, il = nodeDef.weights.length; i < il; i++) {

						o.morphTargetInfluences[i] = nodeDef.weights[i];

					}

				});

			}

			return node;

		});

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
	 * @param {number} nodeIndex
	 * @return {Promise<Object3D>}
	 */
	loadNode(nodeIndex) {

		const json = this.json;
		const parser = this;

		const nodeDef = json.nodes[nodeIndex];

		const nodePending = parser._loadNodeShallow(nodeIndex);

		const childPending = [];
		const childrenDef = nodeDef.children || [];

		for (let i = 0, il = childrenDef.length; i < il; i++) {

			childPending.push(parser.getDependency('node', childrenDef[i]));

		}

		const skeletonPending = nodeDef.skin === undefined
			? Promise.resolve(null)
			: parser.getDependency('skin', nodeDef.skin);

		return Promise.all([
			nodePending,
			Promise.all(childPending),
			skeletonPending
		]).then(function (results) {

			const node = results[0];
			const children = results[1];
			const skeleton = results[2];

			if (skeleton !== null) {

				// This full traverse should be fine because
				// child glTF nodes have not been added to this node yet.
				node.traverse(function (mesh) {

					if (!mesh.isSkinnedMesh) return;

					mesh.bind(skeleton, _identityMatrix$1);

				});

			}

			for (let i = 0, il = children.length; i < il; i++) {

				node.add(children[i]);

			}

			return node;

		});

	}

	// ._loadNodeShallow() parses a single node.
	// skin and child nodes are created and added in .loadNode() (no '_' prefix).
	_loadNodeShallow(nodeIndex) {

		const json = this.json;
		const extensions = this.extensions;
		const parser = this;

		// This method is called from .loadNode() and .loadSkin().
		// Cache a node to avoid duplication.

		if (this.nodeCache[nodeIndex] !== undefined) {

			return this.nodeCache[nodeIndex];

		}

		const nodeDef = json.nodes[nodeIndex];

		// reserve node's name before its dependencies, so the root has the intended name.
		const nodeName = nodeDef.name ? parser.createUniqueName(nodeDef.name) : '';

		const pending = [];

		const meshPromise = parser._invokeOne(function (ext) {

			return ext.createNodeMesh && ext.createNodeMesh(nodeIndex);

		});

		if (meshPromise) {

			pending.push(meshPromise);

		}

		if (nodeDef.camera !== undefined) {

			pending.push(parser.getDependency('camera', nodeDef.camera).then(function (camera) {

				return parser._getNodeRef(parser.cameraCache, nodeDef.camera, camera);

			}));

		}

		parser._invokeAll(function (ext) {

			return ext.createNodeAttachment && ext.createNodeAttachment(nodeIndex);

		}).forEach(function (promise) {

			pending.push(promise);

		});

		this.nodeCache[nodeIndex] = Promise.all(pending).then(function (objects) {

			let node;

			// .isBone isn't in glTF spec. See ._markDefs
			if (nodeDef.isBone === true) {

				node = new Bone();

			} else if (objects.length > 1) {

				node = new Group();

			} else if (objects.length === 1) {

				node = objects[0];

			} else {

				node = new Object3D();

			}

			if (node !== objects[0]) {

				for (let i = 0, il = objects.length; i < il; i++) {

					node.add(objects[i]);

				}

			}

			if (nodeDef.name) {

				node.userData.name = nodeDef.name;
				node.name = nodeName;

			}

			assignExtrasToUserData(node, nodeDef);

			if (nodeDef.extensions) addUnknownExtensionsToUserData(extensions, node, nodeDef);

			if (nodeDef.matrix !== undefined) {

				const matrix = new Matrix4();
				matrix.fromArray(nodeDef.matrix);
				node.applyMatrix4(matrix);

			} else {

				if (nodeDef.translation !== undefined) {

					node.position.fromArray(nodeDef.translation);

				}

				if (nodeDef.rotation !== undefined) {

					node.quaternion.fromArray(nodeDef.rotation);

				}

				if (nodeDef.scale !== undefined) {

					node.scale.fromArray(nodeDef.scale);

				}

			}

			if (!parser.associations.has(node)) {

				parser.associations.set(node, {});

			}

			parser.associations.get(node).nodes = nodeIndex;

			return node;

		});

		return this.nodeCache[nodeIndex];

	}

	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
	 * @param {number} sceneIndex
	 * @return {Promise<Group>}
	 */
	loadScene(sceneIndex) {

		const extensions = this.extensions;
		const sceneDef = this.json.scenes[sceneIndex];
		const parser = this;

		// Loader returns Group, not Scene.
		// See: https://github.com/mrdoob/three.js/issues/18342#issuecomment-578981172
		const scene = new Group();
		if (sceneDef.name) scene.name = parser.createUniqueName(sceneDef.name);

		assignExtrasToUserData(scene, sceneDef);

		if (sceneDef.extensions) addUnknownExtensionsToUserData(extensions, scene, sceneDef);

		const nodeIds = sceneDef.nodes || [];

		const pending = [];

		for (let i = 0, il = nodeIds.length; i < il; i++) {

			pending.push(parser.getDependency('node', nodeIds[i]));

		}

		return Promise.all(pending).then(function (nodes) {

			for (let i = 0, il = nodes.length; i < il; i++) {

				scene.add(nodes[i]);

			}

			// Removes dangling associations, associations that reference a node that
			// didn't make it into the scene.
			const reduceAssociations = (node) => {

				const reducedAssociations = new Map();

				for (const [key, value] of parser.associations) {

					if (key instanceof Material || key instanceof Texture) {

						reducedAssociations.set(key, value);

					}

				}

				node.traverse((node) => {

					const mappings = parser.associations.get(node);

					if (mappings != null) {

						reducedAssociations.set(node, mappings);

					}

				});

				return reducedAssociations;

			};

			parser.associations = reduceAssociations(scene);

			return scene;

		});

	}

	_createAnimationTracks(node, inputAccessor, outputAccessor, sampler, target) {

		const tracks = [];

		const targetName = node.name ? node.name : node.uuid;
		const targetNames = [];

		if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {

			node.traverse(function (object) {

				if (object.morphTargetInfluences) {

					targetNames.push(object.name ? object.name : object.uuid);

				}

			});

		} else {

			targetNames.push(targetName);

		}

		let TypedKeyframeTrack;

		switch (PATH_PROPERTIES[target.path]) {

			case PATH_PROPERTIES.weights:

				TypedKeyframeTrack = NumberKeyframeTrack;
				break;

			case PATH_PROPERTIES.rotation:

				TypedKeyframeTrack = QuaternionKeyframeTrack;
				break;

			case PATH_PROPERTIES.position:
			case PATH_PROPERTIES.scale:

				TypedKeyframeTrack = VectorKeyframeTrack;
				break;

			default:

				switch (outputAccessor.itemSize) {

					case 1:
						TypedKeyframeTrack = NumberKeyframeTrack;
						break;
					case 2:
					case 3:
					default:
						TypedKeyframeTrack = VectorKeyframeTrack;
						break;

				}

				break;

		}

		const interpolation = sampler.interpolation !== undefined ? INTERPOLATION[sampler.interpolation] : InterpolateLinear;


		const outputArray = this._getArrayFromAccessor(outputAccessor);

		for (let j = 0, jl = targetNames.length; j < jl; j++) {

			const track = new TypedKeyframeTrack(
				targetNames[j] + '.' + PATH_PROPERTIES[target.path],
				inputAccessor.array,
				outputArray,
				interpolation
			);

			// Override interpolation with custom factory method.
			if (sampler.interpolation === 'CUBICSPLINE') {

				this._createCubicSplineTrackInterpolant(track);

			}

			tracks.push(track);

		}

		return tracks;

	}

	_getArrayFromAccessor(accessor) {

		let outputArray = accessor.array;

		if (accessor.normalized) {

			const scale = getNormalizedComponentScale(outputArray.constructor);
			const scaled = new Float32Array(outputArray.length);

			for (let j = 0, jl = outputArray.length; j < jl; j++) {

				scaled[j] = outputArray[j] * scale;

			}

			outputArray = scaled;

		}

		return outputArray;

	}

	_createCubicSplineTrackInterpolant(track) {

		track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline(result) {

			// A CUBICSPLINE keyframe in glTF has three output values for each input value,
			// representing inTangent, splineVertex, and outTangent. As a result, track.getValueSize()
			// must be divided by three to get the interpolant's sampleSize argument.

			const interpolantType = (this instanceof QuaternionKeyframeTrack) ? GLTFCubicSplineQuaternionInterpolant : GLTFCubicSplineInterpolant;

			return new interpolantType(this.times, this.values, this.getValueSize() / 3, result);

		};

		// Mark as CUBICSPLINE. `track.getInterpolation()` doesn't support custom interpolants.
		track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;

	}

}

/**
 * @param {BufferGeometry} geometry
 * @param {GLTF.Primitive} primitiveDef
 * @param {GLTFParser} parser
 */
function computeBounds(geometry, primitiveDef, parser) {

	const attributes = primitiveDef.attributes;

	const box = new Box3();

	if (attributes.POSITION !== undefined) {

		const accessor = parser.json.accessors[attributes.POSITION];

		const min = accessor.min;
		const max = accessor.max;

		// glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

		if (min !== undefined && max !== undefined) {

			box.set(
				new Vector3(min[0], min[1], min[2]),
				new Vector3(max[0], max[1], max[2])
			);

			if (accessor.normalized) {

				const boxScale = getNormalizedComponentScale(WEBGL_COMPONENT_TYPES[accessor.componentType]);
				box.min.multiplyScalar(boxScale);
				box.max.multiplyScalar(boxScale);

			}

		} else {

			console.warn('THREE.GLTFLoader: Missing min/max properties for accessor POSITION.');

			return;

		}

	} else {

		return;

	}

	const targets = primitiveDef.targets;

	if (targets !== undefined) {

		const maxDisplacement = new Vector3();
		const vector = new Vector3();

		for (let i = 0, il = targets.length; i < il; i++) {

			const target = targets[i];

			if (target.POSITION !== undefined) {

				const accessor = parser.json.accessors[target.POSITION];
				const min = accessor.min;
				const max = accessor.max;

				// glTF requires 'min' and 'max', but VRM (which extends glTF) currently ignores that requirement.

				if (min !== undefined && max !== undefined) {

					// we need to get max of absolute components because target weight is [-1,1]
					vector.setX(Math.max(Math.abs(min[0]), Math.abs(max[0])));
					vector.setY(Math.max(Math.abs(min[1]), Math.abs(max[1])));
					vector.setZ(Math.max(Math.abs(min[2]), Math.abs(max[2])));


					if (accessor.normalized) {

						const boxScale = getNormalizedComponentScale(WEBGL_COMPONENT_TYPES[accessor.componentType]);
						vector.multiplyScalar(boxScale);

					}

					// Note: this assumes that the sum of all weights is at most 1. This isn't quite correct - it's more conservative
					// to assume that each target can have a max weight of 1. However, for some use cases - notably, when morph targets
					// are used to implement key-frame animations and as such only two are active at a time - this results in very large
					// boxes. So for now we make a box that's sometimes a touch too small but is hopefully mostly of reasonable size.
					maxDisplacement.max(vector);

				} else {

					console.warn('THREE.GLTFLoader: Missing min/max properties for accessor POSITION.');

				}

			}

		}

		// As per comment above this box isn't conservative, but has a reasonable size for a very large number of morph targets.
		box.expandByVector(maxDisplacement);

	}

	geometry.boundingBox = box;

	const sphere = new Sphere();

	box.getCenter(sphere.center);
	sphere.radius = box.min.distanceTo(box.max) / 2;

	geometry.boundingSphere = sphere;

}

/**
 * @param {BufferGeometry} geometry
 * @param {GLTF.Primitive} primitiveDef
 * @param {GLTFParser} parser
 * @return {Promise<BufferGeometry>}
 */
function addPrimitiveAttributes(geometry, primitiveDef, parser) {

	const attributes = primitiveDef.attributes;

	const pending = [];

	function assignAttributeAccessor(accessorIndex, attributeName) {

		return parser.getDependency('accessor', accessorIndex)
			.then(function (accessor) {

				geometry.setAttribute(attributeName, accessor);

			});

	}

	for (const gltfAttributeName in attributes) {

		const threeAttributeName = ATTRIBUTES[gltfAttributeName] || gltfAttributeName.toLowerCase();

		// Skip attributes already provided by e.g. Draco extension.
		if (threeAttributeName in geometry.attributes) continue;

		pending.push(assignAttributeAccessor(attributes[gltfAttributeName], threeAttributeName));

	}

	if (primitiveDef.indices !== undefined && !geometry.index) {

		const accessor = parser.getDependency('accessor', primitiveDef.indices).then(function (accessor) {

			geometry.setIndex(accessor);

		});

		pending.push(accessor);

	}

	assignExtrasToUserData(geometry, primitiveDef);

	computeBounds(geometry, primitiveDef, parser);

	return Promise.all(pending).then(function () {

		return primitiveDef.targets !== undefined
			? addMorphTargets(geometry, primitiveDef.targets, parser)
			: geometry;

	});

}

const _taskCache = new WeakMap();

class DRACOLoader extends Loader {

	constructor(manager) {

		super(manager);

		this.decoderPath = '';
		this.decoderConfig = {};
		this.decoderBinary = null;
		this.decoderPending = null;

		this.workerLimit = 4;
		this.workerPool = [];
		this.workerNextTaskID = 1;
		this.workerSourceURL = '';

		this.defaultAttributeIDs = {
			position: 'POSITION',
			normal: 'NORMAL',
			color: 'COLOR',
			uv: 'TEX_COORD'
		};
		this.defaultAttributeTypes = {
			position: 'Float32Array',
			normal: 'Float32Array',
			color: 'Float32Array',
			uv: 'Float32Array'
		};

	}

	setDecoderPath(path) {

		this.decoderPath = path;

		return this;

	}

	setDecoderConfig(config) {

		this.decoderConfig = config;

		return this;

	}

	setWorkerLimit(workerLimit) {

		this.workerLimit = workerLimit;

		return this;

	}

	load(url, onLoad, onProgress, onError) {

		const loader = new FileLoader(this.manager);

		loader.setPath(this.path);
		loader.setResponseType('arraybuffer');
		loader.setRequestHeader(this.requestHeader);
		loader.setWithCredentials(this.withCredentials);

		loader.load(url, (buffer) => {

			this.parse(buffer, onLoad, onError);

		}, onProgress, onError);

	}

	parse(buffer, onLoad, onError) {

		this.decodeDracoFile(buffer, onLoad, null, null, SRGBColorSpace).catch(onError);

	}

	decodeDracoFile(buffer, callback, attributeIDs, attributeTypes, vertexColorSpace = LinearSRGBColorSpace) {

		const taskConfig = {
			attributeIDs: attributeIDs || this.defaultAttributeIDs,
			attributeTypes: attributeTypes || this.defaultAttributeTypes,
			useUniqueIDs: !!attributeIDs,
			vertexColorSpace: vertexColorSpace,
		};

		return this.decodeGeometry(buffer, taskConfig).then(callback);

	}

	decodeGeometry(buffer, taskConfig) {

		const taskKey = JSON.stringify(taskConfig);

		// Check for an existing task using this buffer. A transferred buffer cannot be transferred
		// again from this thread.
		if (_taskCache.has(buffer)) {

			const cachedTask = _taskCache.get(buffer);

			if (cachedTask.key === taskKey) {

				return cachedTask.promise;

			} else if (buffer.byteLength === 0) {

				// Technically, it would be possible to wait for the previous task to complete,
				// transfer the buffer back, and decode again with the second configuration. That
				// is complex, and I don't know of any reason to decode a Draco buffer twice in
				// different ways, so this is left unimplemented.
				throw new Error(

					'THREE.DRACOLoader: Unable to re-decode a buffer with different ' +
					'settings. Buffer has already been transferred.'

				);

			}

		}

		//

		let worker;
		const taskID = this.workerNextTaskID++;
		const taskCost = buffer.byteLength;

		// Obtain a worker and assign a task, and construct a geometry instance
		// when the task completes.
		const geometryPending = this._getWorker(taskID, taskCost)
			.then((_worker) => {

				worker = _worker;

				return new Promise((resolve, reject) => {

					worker._callbacks[taskID] = { resolve, reject };

					worker.postMessage({ type: 'decode', id: taskID, taskConfig, buffer }, [buffer]);

					// this.debug();

				});

			})
			.then((message) => this._createGeometry(message.geometry));

		// Remove task from the task list.
		// Note: replaced '.finally()' with '.catch().then()' block - iOS 11 support (#19416)
		geometryPending
			.catch(() => true)
			.then(() => {

				if (worker && taskID) {

					this._releaseTask(worker, taskID);

					// this.debug();

				}

			});

		// Cache the task result.
		_taskCache.set(buffer, {

			key: taskKey,
			promise: geometryPending

		});

		return geometryPending;

	}

	_createGeometry(geometryData) {

		const geometry = new BufferGeometry();

		if (geometryData.index) {

			geometry.setIndex(new BufferAttribute(geometryData.index.array, 1));

		}

		for (let i = 0; i < geometryData.attributes.length; i++) {

			const result = geometryData.attributes[i];
			const name = result.name;
			const array = result.array;
			const itemSize = result.itemSize;

			const attribute = new BufferAttribute(array, itemSize);

			if (name === 'color') {

				this._assignVertexColorSpace(attribute, result.vertexColorSpace);

				attribute.normalized = (array instanceof Float32Array) === false;

			}

			geometry.setAttribute(name, attribute);

		}

		return geometry;

	}

	_assignVertexColorSpace(attribute, inputColorSpace) {

		// While .drc files do not specify colorspace, the only 'official' tooling
		// is PLY and OBJ converters, which use sRGB. We'll assume sRGB when a .drc
		// file is passed into .load() or .parse(). GLTFLoader uses internal APIs
		// to decode geometry, and vertex colors are already Linear-sRGB in there.

		if (inputColorSpace !== SRGBColorSpace) return;

		const _color = new Color();

		for (let i = 0, il = attribute.count; i < il; i++) {

			_color.fromBufferAttribute(attribute, i).convertSRGBToLinear();
			attribute.setXYZ(i, _color.r, _color.g, _color.b);

		}

	}

	_loadLibrary(url, responseType) {

		const loader = new FileLoader(this.manager);
		loader.setPath(this.decoderPath);
		loader.setResponseType(responseType);
		loader.setWithCredentials(this.withCredentials);

		return new Promise((resolve, reject) => {

			loader.load(url, resolve, undefined, reject);

		});

	}

	preload() {

		this._initDecoder();

		return this;

	}

	_initDecoder() {

		if (this.decoderPending) return this.decoderPending;

		const useJS = typeof WebAssembly !== 'object' || this.decoderConfig.type === 'js';
		const librariesPending = [];

		if (useJS) {

			librariesPending.push(this._loadLibrary('draco_decoder.js', 'text'));

		} else {

			librariesPending.push(this._loadLibrary('draco_wasm_wrapper.js', 'text'));
			librariesPending.push(this._loadLibrary('draco_decoder.wasm', 'arraybuffer'));

		}

		this.decoderPending = Promise.all(librariesPending)
			.then((libraries) => {

				const jsContent = libraries[0];

				if (!useJS) {

					this.decoderConfig.wasmBinary = libraries[1];

				}

				const fn = DRACOWorker.toString();

				const body = [
					'/* draco decoder */',
					jsContent,
					'',
					'/* worker */',
					fn.substring(fn.indexOf('{') + 1, fn.lastIndexOf('}'))
				].join('\n');

				this.workerSourceURL = URL.createObjectURL(new Blob([body]));

			});

		return this.decoderPending;

	}

	_getWorker(taskID, taskCost) {

		return this._initDecoder().then(() => {

			if (this.workerPool.length < this.workerLimit) {

				const worker = new Worker(this.workerSourceURL);

				worker._callbacks = {};
				worker._taskCosts = {};
				worker._taskLoad = 0;

				worker.postMessage({ type: 'init', decoderConfig: this.decoderConfig });

				worker.onmessage = function (e) {

					const message = e.data;

					switch (message.type) {

						case 'decode':
							worker._callbacks[message.id].resolve(message);
							break;

						case 'error':
							worker._callbacks[message.id].reject(message);
							break;

						default:
							console.error('THREE.DRACOLoader: Unexpected message, "' + message.type + '"');

					}

				};

				this.workerPool.push(worker);

			} else {

				this.workerPool.sort(function (a, b) {

					return a._taskLoad > b._taskLoad ? - 1 : 1;

				});

			}

			const worker = this.workerPool[this.workerPool.length - 1];
			worker._taskCosts[taskID] = taskCost;
			worker._taskLoad += taskCost;
			return worker;

		});

	}

	_releaseTask(worker, taskID) {

		worker._taskLoad -= worker._taskCosts[taskID];
		delete worker._callbacks[taskID];
		delete worker._taskCosts[taskID];

	}

	debug() {

		console.log('Task load: ', this.workerPool.map((worker) => worker._taskLoad));

	}

	dispose() {

		for (let i = 0; i < this.workerPool.length; ++i) {

			this.workerPool[i].terminate();

		}

		this.workerPool.length = 0;

		if (this.workerSourceURL !== '') {

			URL.revokeObjectURL(this.workerSourceURL);

		}

		return this;

	}

}

/* WEB WORKER */

function DRACOWorker() {

	let decoderConfig;
	let decoderPending;

	onmessage = function (e) {

		const message = e.data;

		switch (message.type) {

			case 'init':
				decoderConfig = message.decoderConfig;
				decoderPending = new Promise(function (resolve/*, reject*/) {

					decoderConfig.onModuleLoaded = function (draco) {

						// Module is Promise-like. Wrap before resolving to avoid loop.
						resolve({ draco: draco });

					};

					DracoDecoderModule(decoderConfig); // eslint-disable-line no-undef

				});
				break;

			case 'decode':
				const buffer = message.buffer;
				const taskConfig = message.taskConfig;
				decoderPending.then((module) => {

					const draco = module.draco;
					const decoder = new draco.Decoder();

					try {

						const geometry = decodeGeometry(draco, decoder, new Int8Array(buffer), taskConfig);

						const buffers = geometry.attributes.map((attr) => attr.array.buffer);

						if (geometry.index) buffers.push(geometry.index.array.buffer);

						self.postMessage({ type: 'decode', id: message.id, geometry }, buffers);

					} catch (error) {

						console.error(error);

						self.postMessage({ type: 'error', id: message.id, error: error.message });

					} finally {

						draco.destroy(decoder);

					}

				});
				break;

		}

	};

	function decodeGeometry(draco, decoder, array, taskConfig) {

		const attributeIDs = taskConfig.attributeIDs;
		const attributeTypes = taskConfig.attributeTypes;

		let dracoGeometry;
		let decodingStatus;

		const geometryType = decoder.GetEncodedGeometryType(array);

		if (geometryType === draco.TRIANGULAR_MESH) {

			dracoGeometry = new draco.Mesh();
			decodingStatus = decoder.DecodeArrayToMesh(array, array.byteLength, dracoGeometry);

		} else if (geometryType === draco.POINT_CLOUD) {

			dracoGeometry = new draco.PointCloud();
			decodingStatus = decoder.DecodeArrayToPointCloud(array, array.byteLength, dracoGeometry);

		} else {

			throw new Error('THREE.DRACOLoader: Unexpected geometry type.');

		}

		if (!decodingStatus.ok() || dracoGeometry.ptr === 0) {

			throw new Error('THREE.DRACOLoader: Decoding failed: ' + decodingStatus.error_msg());

		}

		const geometry = { index: null, attributes: [] };

		// Gather all vertex attributes.
		for (const attributeName in attributeIDs) {

			const attributeType = self[attributeTypes[attributeName]];

			let attribute;
			let attributeID;

			// A Draco file may be created with default vertex attributes, whose attribute IDs
			// are mapped 1:1 from their semantic name (POSITION, NORMAL, ...). Alternatively,
			// a Draco file may contain a custom set of attributes, identified by known unique
			// IDs. glTF files always do the latter, and `.drc` files typically do the former.
			if (taskConfig.useUniqueIDs) {

				attributeID = attributeIDs[attributeName];
				attribute = decoder.GetAttributeByUniqueId(dracoGeometry, attributeID);

			} else {

				attributeID = decoder.GetAttributeId(dracoGeometry, draco[attributeIDs[attributeName]]);

				if (attributeID === - 1) continue;

				attribute = decoder.GetAttribute(dracoGeometry, attributeID);

			}

			const attributeResult = decodeAttribute(draco, decoder, dracoGeometry, attributeName, attributeType, attribute);

			if (attributeName === 'color') {

				attributeResult.vertexColorSpace = taskConfig.vertexColorSpace;

			}

			geometry.attributes.push(attributeResult);

		}

		// Add index.
		if (geometryType === draco.TRIANGULAR_MESH) {

			geometry.index = decodeIndex(draco, decoder, dracoGeometry);

		}

		draco.destroy(dracoGeometry);

		return geometry;

	}

	function decodeIndex(draco, decoder, dracoGeometry) {

		const numFaces = dracoGeometry.num_faces();
		const numIndices = numFaces * 3;
		const byteLength = numIndices * 4;

		const ptr = draco._malloc(byteLength);
		decoder.GetTrianglesUInt32Array(dracoGeometry, byteLength, ptr);
		const index = new Uint32Array(draco.HEAPF32.buffer, ptr, numIndices).slice();
		draco._free(ptr);

		return { array: index, itemSize: 1 };

	}

	function decodeAttribute(draco, decoder, dracoGeometry, attributeName, attributeType, attribute) {

		const numComponents = attribute.num_components();
		const numPoints = dracoGeometry.num_points();
		const numValues = numPoints * numComponents;
		const byteLength = numValues * attributeType.BYTES_PER_ELEMENT;
		const dataType = getDracoDataType(draco, attributeType);

		const ptr = draco._malloc(byteLength);
		decoder.GetAttributeDataArrayForAllPoints(dracoGeometry, attribute, dataType, byteLength, ptr);
		const array = new attributeType(draco.HEAPF32.buffer, ptr, numValues).slice();
		draco._free(ptr);

		return {
			name: attributeName,
			array: array,
			itemSize: numComponents
		};

	}

	function getDracoDataType(draco, attributeType) {

		switch (attributeType) {

			case Float32Array: return draco.DT_FLOAT32;
			case Int8Array: return draco.DT_INT8;
			case Int16Array: return draco.DT_INT16;
			case Int32Array: return draco.DT_INT32;
			case Uint8Array: return draco.DT_UINT8;
			case Uint16Array: return draco.DT_UINT16;
			case Uint32Array: return draco.DT_UINT32;

		}

	}

}

/*!
fflate - fast JavaScript compression/decompression
<https://101arrowz.github.io/fflate>
Licensed under MIT. https://github.com/101arrowz/fflate/blob/master/LICENSE
version 0.6.9
*/
var durl = function (c) { return URL.createObjectURL(new Blob([c], { type: 'text/javascript' })); };
try {
	URL.revokeObjectURL(durl(''));
}
catch (e) {
	// We're in Deno or a very old browser
	durl = function (c) { return 'data:application/javascript;charset=UTF-8,' + encodeURI(c); };
}

// aliases for shorter compressed code (most minifers don't do this)
var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
// fixed length extra bits
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, /* unused */ 0, 0, /* impossible */ 0]);
// fixed distance extra bits
// see fleb note
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, /* unused */ 0, 0]);
// code length index map
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
// get base, reverse index map from extra bits
var freb = function (eb, start) {
	var b = new u16(31);
	for (var i = 0; i < 31; ++i) {
		b[i] = start += 1 << eb[i - 1];
	}
	// numbers here are at max 18 bits
	var r = new u32(b[30]);
	for (var i = 1; i < 30; ++i) {
		for (var j = b[i]; j < b[i + 1]; ++j) {
			r[j] = ((j - b[i]) << 5) | i;
		}
	}
	return [b, r];
};
var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
// we can ignore the fact that the other numbers are wrong; they never happen anyway
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b[0];
// map of value to reverse (assuming 16 bits)
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
	// reverse table algorithm from SO
	var x = ((i & 0xAAAA) >>> 1) | ((i & 0x5555) << 1);
	x = ((x & 0xCCCC) >>> 2) | ((x & 0x3333) << 2);
	x = ((x & 0xF0F0) >>> 4) | ((x & 0x0F0F) << 4);
	rev[i] = (((x & 0xFF00) >>> 8) | ((x & 0x00FF) << 8)) >>> 1;
}
// create huffman tree from u8 "map": index -> code length for code index
// mb (max bits) must be at most 15
// TODO: optimize/split up?
var hMap = (function (cd, mb, r) {
	var s = cd.length;
	// index
	var i = 0;
	// u16 "map": index -> # of codes with bit length = index
	var l = new u16(mb);
	// length of cd must be 288 (total # of codes)
	for (; i < s; ++i)
		++l[cd[i] - 1];
	// u16 "map": index -> minimum code for bit length = index
	var le = new u16(mb);
	for (i = 0; i < mb; ++i) {
		le[i] = (le[i - 1] + l[i - 1]) << 1;
	}
	var co;
	if (r) {
		// u16 "map": index -> number of actual bits, symbol for code
		co = new u16(1 << mb);
		// bits to remove for reverser
		var rvb = 15 - mb;
		for (i = 0; i < s; ++i) {
			// ignore 0 lengths
			if (cd[i]) {
				// num encoding both symbol and bits read
				var sv = (i << 4) | cd[i];
				// free bits
				var r_1 = mb - cd[i];
				// start value
				var v = le[cd[i] - 1]++ << r_1;
				// m is end value
				for (var m = v | ((1 << r_1) - 1); v <= m; ++v) {
					// every 16 bit value starting with the code yields the same result
					co[rev[v] >>> rvb] = sv;
				}
			}
		}
	}
	else {
		co = new u16(s);
		for (i = 0; i < s; ++i) {
			if (cd[i]) {
				co[i] = rev[le[cd[i] - 1]++] >>> (15 - cd[i]);
			}
		}
	}
	return co;
});
// fixed length tree
var flt = new u8(288);
for (var i = 0; i < 144; ++i)
	flt[i] = 8;
for (var i = 144; i < 256; ++i)
	flt[i] = 9;
for (var i = 256; i < 280; ++i)
	flt[i] = 7;
for (var i = 280; i < 288; ++i)
	flt[i] = 8;
// fixed distance tree
var fdt = new u8(32);
for (var i = 0; i < 32; ++i)
	fdt[i] = 5;
// fixed length map
var flrm = /*#__PURE__*/ hMap(flt, 9, 1);
// fixed distance map
var fdrm = /*#__PURE__*/ hMap(fdt, 5, 1);
// find max of array
var max = function (a) {
	var m = a[0];
	for (var i = 1; i < a.length; ++i) {
		if (a[i] > m)
			m = a[i];
	}
	return m;
};
// read d, starting at bit p and mask with m
var bits = function (d, p, m) {
	var o = (p / 8) | 0;
	return ((d[o] | (d[o + 1] << 8)) >> (p & 7)) & m;
};
// read d, starting at bit p continuing for at least 16 bits
var bits16 = function (d, p) {
	var o = (p / 8) | 0;
	return ((d[o] | (d[o + 1] << 8) | (d[o + 2] << 16)) >> (p & 7));
};
// get end of byte
var shft = function (p) { return ((p / 8) | 0) + (p & 7 && 1); };
// typed array slice - allows garbage collector to free original reference,
// while being more compatible than .slice
var slc = function (v, s, e) {
	if (s == null || s < 0)
		s = 0;
	if (e == null || e > v.length)
		e = v.length;
	// can't use .constructor in case user-supplied
	var n = new (v instanceof u16 ? u16 : v instanceof u32 ? u32 : u8)(e - s);
	n.set(v.subarray(s, e));
	return n;
};
// expands raw DEFLATE data
var inflt = function (dat, buf, st) {
	// source length
	var sl = dat.length;
	if (!sl || (st && !st.l && sl < 5))
		return buf || new u8(0);
	// have to estimate size
	var noBuf = !buf || st;
	// no state
	var noSt = !st || st.i;
	if (!st)
		st = {};
	// Assumes roughly 33% compression ratio average
	if (!buf)
		buf = new u8(sl * 3);
	// ensure buffer can fit at least l elements
	var cbuf = function (l) {
		var bl = buf.length;
		// need to increase size to fit
		if (l > bl) {
			// Double or set to necessary, whichever is greater
			var nbuf = new u8(Math.max(bl * 2, l));
			nbuf.set(buf);
			buf = nbuf;
		}
	};
	//  last chunk         bitpos           bytes
	var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
	// total bits
	var tbts = sl * 8;
	do {
		if (!lm) {
			// BFINAL - this is only 1 when last chunk is next
			st.f = final = bits(dat, pos, 1);
			// type: 0 = no compression, 1 = fixed huffman, 2 = dynamic huffman
			var type = bits(dat, pos + 1, 3);
			pos += 3;
			if (!type) {
				// go to end of byte boundary
				var s = shft(pos) + 4, l = dat[s - 4] | (dat[s - 3] << 8), t = s + l;
				if (t > sl) {
					if (noSt)
						throw 'unexpected EOF';
					break;
				}
				// ensure size
				if (noBuf)
					cbuf(bt + l);
				// Copy over uncompressed data
				buf.set(dat.subarray(s, t), bt);
				// Get new bitpos, update byte count
				st.b = bt += l, st.p = pos = t * 8;
				continue;
			}
			else if (type == 1)
				lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
			else if (type == 2) {
				//  literal                            lengths
				var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
				var tl = hLit + bits(dat, pos + 5, 31) + 1;
				pos += 14;
				// length+distance tree
				var ldt = new u8(tl);
				// code length tree
				var clt = new u8(19);
				for (var i = 0; i < hcLen; ++i) {
					// use index map to get real code
					clt[clim[i]] = bits(dat, pos + i * 3, 7);
				}
				pos += hcLen * 3;
				// code lengths bits
				var clb = max(clt), clbmsk = (1 << clb) - 1;
				// code lengths map
				var clm = hMap(clt, clb, 1);
				for (var i = 0; i < tl;) {
					var r = clm[bits(dat, pos, clbmsk)];
					// bits read
					pos += r & 15;
					// symbol
					var s = r >>> 4;
					// code length to copy
					if (s < 16) {
						ldt[i++] = s;
					}
					else {
						//  copy   count
						var c = 0, n = 0;
						if (s == 16)
							n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
						else if (s == 17)
							n = 3 + bits(dat, pos, 7), pos += 3;
						else if (s == 18)
							n = 11 + bits(dat, pos, 127), pos += 7;
						while (n--)
							ldt[i++] = c;
					}
				}
				//    length tree                 distance tree
				var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
				// max length bits
				lbt = max(lt);
				// max dist bits
				dbt = max(dt);
				lm = hMap(lt, lbt, 1);
				dm = hMap(dt, dbt, 1);
			}
			else
				throw 'invalid block type';
			if (pos > tbts) {
				if (noSt)
					throw 'unexpected EOF';
				break;
			}
		}
		// Make sure the buffer can hold this + the largest possible addition
		// Maximum chunk size (practically, theoretically infinite) is 2^17;
		if (noBuf)
			cbuf(bt + 131072);
		var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
		var lpos = pos;
		for (; ; lpos = pos) {
			// bits read, code
			var c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
			pos += c & 15;
			if (pos > tbts) {
				if (noSt)
					throw 'unexpected EOF';
				break;
			}
			if (!c)
				throw 'invalid length/literal';
			if (sym < 256)
				buf[bt++] = sym;
			else if (sym == 256) {
				lpos = pos, lm = null;
				break;
			}
			else {
				var add = sym - 254;
				// no extra bits needed if less
				if (sym > 264) {
					// index
					var i = sym - 257, b = fleb[i];
					add = bits(dat, pos, (1 << b) - 1) + fl[i];
					pos += b;
				}
				// dist
				var d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
				if (!d)
					throw 'invalid distance';
				pos += d & 15;
				var dt = fd[dsym];
				if (dsym > 3) {
					var b = fdeb[dsym];
					dt += bits16(dat, pos) & ((1 << b) - 1), pos += b;
				}
				if (pos > tbts) {
					if (noSt)
						throw 'unexpected EOF';
					break;
				}
				if (noBuf)
					cbuf(bt + 131072);
				var end = bt + add;
				for (; bt < end; bt += 4) {
					buf[bt] = buf[bt - dt];
					buf[bt + 1] = buf[bt + 1 - dt];
					buf[bt + 2] = buf[bt + 2 - dt];
					buf[bt + 3] = buf[bt + 3 - dt];
				}
				bt = end;
			}
		}
		st.l = lm, st.p = lpos, st.b = bt;
		if (lm)
			final = 1, st.m = lbt, st.d = dm, st.n = dbt;
	} while (!final);
	return bt == buf.length ? buf : slc(buf, 0, bt);
};
// empty
var et = /*#__PURE__*/ new u8(0);
// zlib valid
var zlv = function (d) {
	if ((d[0] & 15) != 8 || (d[0] >>> 4) > 7 || ((d[0] << 8 | d[1]) % 31))
		throw 'invalid zlib data';
	if (d[1] & 32)
		throw 'invalid zlib data: preset dictionaries not supported';
};
/**
 * Expands Zlib data
 * @param data The data to decompress
 * @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
 * @returns The decompressed version of the data
 */
function unzlibSync(data, out) {
	return inflt((zlv(data), data.subarray(2, -4)), out);
}
// text decoder
var td = typeof TextDecoder != 'undefined' && /*#__PURE__*/ new TextDecoder();
// text decoder stream
var tds = 0;
try {
	td.decode(et, { stream: true });
	tds = 1;
}
catch (e) { }

/**
 * NURBS utils
 *
 * See NURBSCurve and NURBSSurface.
 **/


/**************************************************************
 *	NURBS Utils
 **************************************************************/

/*
Finds knot vector span.

p : degree
u : parametric value
U : knot vector

returns the span
*/
function findSpan(p, u, U) {

	const n = U.length - p - 1;

	if (u >= U[n]) {

		return n - 1;

	}

	if (u <= U[p]) {

		return p;

	}

	let low = p;
	let high = n;
	let mid = Math.floor((low + high) / 2);

	while (u < U[mid] || u >= U[mid + 1]) {

		if (u < U[mid]) {

			high = mid;

		} else {

			low = mid;

		}

		mid = Math.floor((low + high) / 2);

	}

	return mid;

}


/*
Calculate basis functions. See The NURBS Book, page 70, algorithm A2.2

span : span in which u lies
u    : parametric point
p    : degree
U    : knot vector

returns array[p+1] with basis functions values.
*/
function calcBasisFunctions(span, u, p, U) {

	const N = [];
	const left = [];
	const right = [];
	N[0] = 1.0;

	for (let j = 1; j <= p; ++j) {

		left[j] = u - U[span + 1 - j];
		right[j] = U[span + j] - u;

		let saved = 0.0;

		for (let r = 0; r < j; ++r) {

			const rv = right[r + 1];
			const lv = left[j - r];
			const temp = N[r] / (rv + lv);
			N[r] = saved + rv * temp;
			saved = lv * temp;

		}

		N[j] = saved;

	}

	return N;

}


/*
Calculate B-Spline curve points. See The NURBS Book, page 82, algorithm A3.1.

p : degree of B-Spline
U : knot vector
P : control points (x, y, z, w)
u : parametric point

returns point for given u
*/
function calcBSplinePoint(p, U, P, u) {

	const span = findSpan(p, u, U);
	const N = calcBasisFunctions(span, u, p, U);
	const C = new Vector4(0, 0, 0, 0);

	for (let j = 0; j <= p; ++j) {

		const point = P[span - p + j];
		const Nj = N[j];
		const wNj = point.w * Nj;
		C.x += point.x * wNj;
		C.y += point.y * wNj;
		C.z += point.z * wNj;
		C.w += point.w * Nj;

	}

	return C;

}


/*
Calculate basis functions derivatives. See The NURBS Book, page 72, algorithm A2.3.

span : span in which u lies
u    : parametric point
p    : degree
n    : number of derivatives to calculate
U    : knot vector

returns array[n+1][p+1] with basis functions derivatives
*/
function calcBasisFunctionDerivatives(span, u, p, n, U) {

	const zeroArr = [];
	for (let i = 0; i <= p; ++i)
		zeroArr[i] = 0.0;

	const ders = [];

	for (let i = 0; i <= n; ++i)
		ders[i] = zeroArr.slice(0);

	const ndu = [];

	for (let i = 0; i <= p; ++i)
		ndu[i] = zeroArr.slice(0);

	ndu[0][0] = 1.0;

	const left = zeroArr.slice(0);
	const right = zeroArr.slice(0);

	for (let j = 1; j <= p; ++j) {

		left[j] = u - U[span + 1 - j];
		right[j] = U[span + j] - u;

		let saved = 0.0;

		for (let r = 0; r < j; ++r) {

			const rv = right[r + 1];
			const lv = left[j - r];
			ndu[j][r] = rv + lv;

			const temp = ndu[r][j - 1] / ndu[j][r];
			ndu[r][j] = saved + rv * temp;
			saved = lv * temp;

		}

		ndu[j][j] = saved;

	}

	for (let j = 0; j <= p; ++j) {

		ders[0][j] = ndu[j][p];

	}

	for (let r = 0; r <= p; ++r) {

		let s1 = 0;
		let s2 = 1;

		const a = [];
		for (let i = 0; i <= p; ++i) {

			a[i] = zeroArr.slice(0);

		}

		a[0][0] = 1.0;

		for (let k = 1; k <= n; ++k) {

			let d = 0.0;
			const rk = r - k;
			const pk = p - k;

			if (r >= k) {

				a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
				d = a[s2][0] * ndu[rk][pk];

			}

			const j1 = (rk >= - 1) ? 1 : - rk;
			const j2 = (r - 1 <= pk) ? k - 1 : p - r;

			for (let j = j1; j <= j2; ++j) {

				a[s2][j] = (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j];
				d += a[s2][j] * ndu[rk + j][pk];

			}

			if (r <= pk) {

				a[s2][k] = - a[s1][k - 1] / ndu[pk + 1][r];
				d += a[s2][k] * ndu[r][pk];

			}

			ders[k][r] = d;

			const j = s1;
			s1 = s2;
			s2 = j;

		}

	}

	let r = p;

	for (let k = 1; k <= n; ++k) {

		for (let j = 0; j <= p; ++j) {

			ders[k][j] *= r;

		}

		r *= p - k;

	}

	return ders;

}


/*
	Calculate derivatives of a B-Spline. See The NURBS Book, page 93, algorithm A3.2.

	p  : degree
	U  : knot vector
	P  : control points
	u  : Parametric points
	nd : number of derivatives

	returns array[d+1] with derivatives
	*/
function calcBSplineDerivatives(p, U, P, u, nd) {

	const du = nd < p ? nd : p;
	const CK = [];
	const span = findSpan(p, u, U);
	const nders = calcBasisFunctionDerivatives(span, u, p, du, U);
	const Pw = [];

	for (let i = 0; i < P.length; ++i) {

		const point = P[i].clone();
		const w = point.w;

		point.x *= w;
		point.y *= w;
		point.z *= w;

		Pw[i] = point;

	}

	for (let k = 0; k <= du; ++k) {

		const point = Pw[span - p].clone().multiplyScalar(nders[k][0]);

		for (let j = 1; j <= p; ++j) {

			point.add(Pw[span - p + j].clone().multiplyScalar(nders[k][j]));

		}

		CK[k] = point;

	}

	for (let k = du + 1; k <= nd + 1; ++k) {

		CK[k] = new Vector4(0, 0, 0);

	}

	return CK;

}


/*
Calculate "K over I"

returns k!/(i!(k-i)!)
*/
function calcKoverI(k, i) {

	let nom = 1;

	for (let j = 2; j <= k; ++j) {

		nom *= j;

	}

	let denom = 1;

	for (let j = 2; j <= i; ++j) {

		denom *= j;

	}

	for (let j = 2; j <= k - i; ++j) {

		denom *= j;

	}

	return nom / denom;

}


/*
Calculate derivatives (0-nd) of rational curve. See The NURBS Book, page 127, algorithm A4.2.

Pders : result of function calcBSplineDerivatives

returns array with derivatives for rational curve.
*/
function calcRationalCurveDerivatives(Pders) {

	const nd = Pders.length;
	const Aders = [];
	const wders = [];

	for (let i = 0; i < nd; ++i) {

		const point = Pders[i];
		Aders[i] = new Vector3(point.x, point.y, point.z);
		wders[i] = point.w;

	}

	const CK = [];

	for (let k = 0; k < nd; ++k) {

		const v = Aders[k].clone();

		for (let i = 1; i <= k; ++i) {

			v.sub(CK[k - i].clone().multiplyScalar(calcKoverI(k, i) * wders[i]));

		}

		CK[k] = v.divideScalar(wders[0]);

	}

	return CK;

}


/*
Calculate NURBS curve derivatives. See The NURBS Book, page 127, algorithm A4.2.

p  : degree
U  : knot vector
P  : control points in homogeneous space
u  : parametric points
nd : number of derivatives

returns array with derivatives.
*/
function calcNURBSDerivatives(p, U, P, u, nd) {

	const Pders = calcBSplineDerivatives(p, U, P, u, nd);
	return calcRationalCurveDerivatives(Pders);

}

/**
 * NURBS curve object
 *
 * Derives from Curve, overriding getPoint and getTangent.
 *
 * Implementation is based on (x, y [, z=0 [, w=1]]) control points with w=weight.
 *
 **/

class NURBSCurve extends Curve {

	constructor(
		degree,
		knots /* array of reals */,
		controlPoints /* array of Vector(2|3|4) */,
		startKnot /* index in knots */,
		endKnot /* index in knots */
	) {

		super();

		this.degree = degree;
		this.knots = knots;
		this.controlPoints = [];
		// Used by periodic NURBS to remove hidden spans
		this.startKnot = startKnot || 0;
		this.endKnot = endKnot || (this.knots.length - 1);

		for (let i = 0; i < controlPoints.length; ++i) {

			// ensure Vector4 for control points
			const point = controlPoints[i];
			this.controlPoints[i] = new Vector4(point.x, point.y, point.z, point.w);

		}

	}

	getPoint(t, optionalTarget = new Vector3()) {

		const point = optionalTarget;

		const u = this.knots[this.startKnot] + t * (this.knots[this.endKnot] - this.knots[this.startKnot]); // linear mapping t->u

		// following results in (wx, wy, wz, w) homogeneous point
		const hpoint = calcBSplinePoint(this.degree, this.knots, this.controlPoints, u);

		if (hpoint.w !== 1.0) {

			// project to 3D space: (wx, wy, wz, w) -> (x, y, z, 1)
			hpoint.divideScalar(hpoint.w);

		}

		return point.set(hpoint.x, hpoint.y, hpoint.z);

	}

	getTangent(t, optionalTarget = new Vector3()) {

		const tangent = optionalTarget;

		const u = this.knots[0] + t * (this.knots[this.knots.length - 1] - this.knots[0]);
		const ders = calcNURBSDerivatives(this.degree, this.knots, this.controlPoints, u, 1);
		tangent.copy(ders[1]).normalize();

		return tangent;

	}

}

/**
 * Loader loads FBX file and generates Group representing FBX scene.
 * Requires FBX file to be >= 7.0 and in ASCII or >= 6400 in Binary format
 * Versions lower than this may load but will probably have errors
 *
 * Needs Support:
 *  Morph normals / blend shape normals
 *
 * FBX format references:
 * 	https://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_index_html (C++ SDK reference)
 *
 * Binary format specification:
 *	https://code.blender.org/2013/08/fbx-binary-file-format-specification/
 */


let fbxTree;
let connections;
let sceneGraph;

class FBXLoader extends Loader {

	constructor(manager) {

		super(manager);

	}

	load(url, onLoad, onProgress, onError) {

		const scope = this;

		const path = (scope.path === '') ? LoaderUtils.extractUrlBase(url) : scope.path;

		const loader = new FileLoader(this.manager);
		loader.setPath(scope.path);
		loader.setResponseType('arraybuffer');
		loader.setRequestHeader(scope.requestHeader);
		loader.setWithCredentials(scope.withCredentials);

		loader.load(url, function (buffer) {

			try {

				onLoad(scope.parse(buffer, path));

			} catch (e) {

				if (onError) {

					onError(e);

				} else {

					console.error(e);

				}

				scope.manager.itemError(url);

			}

		}, onProgress, onError);

	}

	parse(FBXBuffer, path) {

		if (isFbxFormatBinary(FBXBuffer)) {

			fbxTree = new BinaryParser().parse(FBXBuffer);

		} else {

			const FBXText = convertArrayBufferToString(FBXBuffer);

			if (!isFbxFormatASCII(FBXText)) {

				throw new Error('THREE.FBXLoader: Unknown format.');

			}

			if (getFbxVersion(FBXText) < 7000) {

				throw new Error('THREE.FBXLoader: FBX version not supported, FileVersion: ' + getFbxVersion(FBXText));

			}

			fbxTree = new TextParser().parse(FBXText);

		}

		// console.log( fbxTree );

		const textureLoader = new TextureLoader(this.manager).setPath(this.resourcePath || path).setCrossOrigin(this.crossOrigin);

		return new FBXTreeParser(textureLoader, this.manager).parse(fbxTree);

	}

}

// Parse the FBXTree object returned by the BinaryParser or TextParser and return a Group
class FBXTreeParser {

	constructor(textureLoader, manager) {

		this.textureLoader = textureLoader;
		this.manager = manager;

	}

	parse() {

		connections = this.parseConnections();

		const images = this.parseImages();
		const textures = this.parseTextures(images);
		const materials = this.parseMaterials(textures);
		const deformers = this.parseDeformers();
		const geometryMap = new GeometryParser().parse(deformers);

		this.parseScene(deformers, geometryMap, materials);

		return sceneGraph;

	}

	// Parses FBXTree.Connections which holds parent-child connections between objects (e.g. material -> texture, model->geometry )
	// and details the connection type
	parseConnections() {

		const connectionMap = new Map();

		if ('Connections' in fbxTree) {

			const rawConnections = fbxTree.Connections.connections;

			rawConnections.forEach(function (rawConnection) {

				const fromID = rawConnection[0];
				const toID = rawConnection[1];
				const relationship = rawConnection[2];

				if (!connectionMap.has(fromID)) {

					connectionMap.set(fromID, {
						parents: [],
						children: []
					});

				}

				const parentRelationship = { ID: toID, relationship: relationship };
				connectionMap.get(fromID).parents.push(parentRelationship);

				if (!connectionMap.has(toID)) {

					connectionMap.set(toID, {
						parents: [],
						children: []
					});

				}

				const childRelationship = { ID: fromID, relationship: relationship };
				connectionMap.get(toID).children.push(childRelationship);

			});

		}

		return connectionMap;

	}

	// Parse FBXTree.Objects.Video for embedded image data
	// These images are connected to textures in FBXTree.Objects.Textures
	// via FBXTree.Connections.
	parseImages() {

		const images = {};
		const blobs = {};

		if ('Video' in fbxTree.Objects) {

			const videoNodes = fbxTree.Objects.Video;

			for (const nodeID in videoNodes) {

				const videoNode = videoNodes[nodeID];

				const id = parseInt(nodeID);

				images[id] = videoNode.RelativeFilename || videoNode.Filename;

				// raw image data is in videoNode.Content
				if ('Content' in videoNode) {

					const arrayBufferContent = (videoNode.Content instanceof ArrayBuffer) && (videoNode.Content.byteLength > 0);
					const base64Content = (typeof videoNode.Content === 'string') && (videoNode.Content !== '');

					if (arrayBufferContent || base64Content) {

						const image = this.parseImage(videoNodes[nodeID]);

						blobs[videoNode.RelativeFilename || videoNode.Filename] = image;

					}

				}

			}

		}

		for (const id in images) {

			const filename = images[id];

			if (blobs[filename] !== undefined) images[id] = blobs[filename];
			else images[id] = images[id].split('\\').pop();

		}

		return images;

	}

	// Parse embedded image data in FBXTree.Video.Content
	parseImage(videoNode) {

		const content = videoNode.Content;
		const fileName = videoNode.RelativeFilename || videoNode.Filename;
		const extension = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();

		let type;

		switch (extension) {

			case 'bmp':

				type = 'image/bmp';
				break;

			case 'jpg':
			case 'jpeg':

				type = 'image/jpeg';
				break;

			case 'png':

				type = 'image/png';
				break;

			case 'tif':

				type = 'image/tiff';
				break;

			case 'tga':

				if (this.manager.getHandler('.tga') === null) {

					console.warn('FBXLoader: TGA loader not found, skipping ', fileName);

				}

				type = 'image/tga';
				break;

			default:

				console.warn('FBXLoader: Image type "' + extension + '" is not supported.');
				return;

		}

		if (typeof content === 'string') { // ASCII format

			return 'data:' + type + ';base64,' + content;

		} else { // Binary Format

			const array = new Uint8Array(content);
			return window.URL.createObjectURL(new Blob([array], { type: type }));

		}

	}

	// Parse nodes in FBXTree.Objects.Texture
	// These contain details such as UV scaling, cropping, rotation etc and are connected
	// to images in FBXTree.Objects.Video
	parseTextures(images) {

		const textureMap = new Map();

		if ('Texture' in fbxTree.Objects) {

			const textureNodes = fbxTree.Objects.Texture;
			for (const nodeID in textureNodes) {

				const texture = this.parseTexture(textureNodes[nodeID], images);
				textureMap.set(parseInt(nodeID), texture);

			}

		}

		return textureMap;

	}

	// Parse individual node in FBXTree.Objects.Texture
	parseTexture(textureNode, images) {

		const texture = this.loadTexture(textureNode, images);

		texture.ID = textureNode.id;

		texture.name = textureNode.attrName;

		const wrapModeU = textureNode.WrapModeU;
		const wrapModeV = textureNode.WrapModeV;

		const valueU = wrapModeU !== undefined ? wrapModeU.value : 0;
		const valueV = wrapModeV !== undefined ? wrapModeV.value : 0;

		// http://download.autodesk.com/us/fbx/SDKdocs/FBX_SDK_Help/files/fbxsdkref/class_k_fbx_texture.html#889640e63e2e681259ea81061b85143a
		// 0: repeat(default), 1: clamp

		texture.wrapS = valueU === 0 ? RepeatWrapping : ClampToEdgeWrapping;
		texture.wrapT = valueV === 0 ? RepeatWrapping : ClampToEdgeWrapping;

		if ('Scaling' in textureNode) {

			const values = textureNode.Scaling.value;

			texture.repeat.x = values[0];
			texture.repeat.y = values[1];

		}

		if ('Translation' in textureNode) {

			const values = textureNode.Translation.value;

			texture.offset.x = values[0];
			texture.offset.y = values[1];

		}

		return texture;

	}

	// load a texture specified as a blob or data URI, or via an external URL using TextureLoader
	loadTexture(textureNode, images) {

		let fileName;

		const currentPath = this.textureLoader.path;

		const children = connections.get(textureNode.id).children;

		if (children !== undefined && children.length > 0 && images[children[0].ID] !== undefined) {

			fileName = images[children[0].ID];

			if (fileName.indexOf('blob:') === 0 || fileName.indexOf('data:') === 0) {

				this.textureLoader.setPath(undefined);

			}

		}

		let texture;

		const extension = textureNode.FileName.slice(- 3).toLowerCase();

		if (extension === 'tga') {

			const loader = this.manager.getHandler('.tga');

			if (loader === null) {

				console.warn('FBXLoader: TGA loader not found, creating placeholder texture for', textureNode.RelativeFilename);
				texture = new Texture();

			} else {

				loader.setPath(this.textureLoader.path);
				texture = loader.load(fileName);

			}

		} else if (extension === 'psd') {

			console.warn('FBXLoader: PSD textures are not supported, creating placeholder texture for', textureNode.RelativeFilename);
			texture = new Texture();

		} else {

			texture = this.textureLoader.load(fileName);

		}

		this.textureLoader.setPath(currentPath);

		return texture;

	}

	// Parse nodes in FBXTree.Objects.Material
	parseMaterials(textureMap) {

		const materialMap = new Map();

		if ('Material' in fbxTree.Objects) {

			const materialNodes = fbxTree.Objects.Material;

			for (const nodeID in materialNodes) {

				const material = this.parseMaterial(materialNodes[nodeID], textureMap);

				if (material !== null) materialMap.set(parseInt(nodeID), material);

			}

		}

		return materialMap;

	}

	// Parse single node in FBXTree.Objects.Material
	// Materials are connected to texture maps in FBXTree.Objects.Textures
	// FBX format currently only supports Lambert and Phong shading models
	parseMaterial(materialNode, textureMap) {

		const ID = materialNode.id;
		const name = materialNode.attrName;
		let type = materialNode.ShadingModel;

		// Case where FBX wraps shading model in property object.
		if (typeof type === 'object') {

			type = type.value;

		}

		// Ignore unused materials which don't have any connections.
		if (!connections.has(ID)) return null;

		const parameters = this.parseParameters(materialNode, textureMap, ID);

		let material;

		switch (type.toLowerCase()) {

			case 'phong':
				material = new MeshPhongMaterial();
				break;
			case 'lambert':
				material = new MeshLambertMaterial();
				break;
			default:
				console.warn('THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.', type);
				material = new MeshPhongMaterial();
				break;

		}

		material.setValues(parameters);
		material.name = name;

		return material;

	}

	// Parse FBX material and return parameters suitable for a three.js material
	// Also parse the texture map and return any textures associated with the material
	parseParameters(materialNode, textureMap, ID) {

		const parameters = {};

		if (materialNode.BumpFactor) {

			parameters.bumpScale = materialNode.BumpFactor.value;

		}

		if (materialNode.Diffuse) {

			parameters.color = new Color().fromArray(materialNode.Diffuse.value).convertSRGBToLinear();

		} else if (materialNode.DiffuseColor && (materialNode.DiffuseColor.type === 'Color' || materialNode.DiffuseColor.type === 'ColorRGB')) {

			// The blender exporter exports diffuse here instead of in materialNode.Diffuse
			parameters.color = new Color().fromArray(materialNode.DiffuseColor.value).convertSRGBToLinear();

		}

		if (materialNode.DisplacementFactor) {

			parameters.displacementScale = materialNode.DisplacementFactor.value;

		}

		if (materialNode.Emissive) {

			parameters.emissive = new Color().fromArray(materialNode.Emissive.value).convertSRGBToLinear();

		} else if (materialNode.EmissiveColor && (materialNode.EmissiveColor.type === 'Color' || materialNode.EmissiveColor.type === 'ColorRGB')) {

			// The blender exporter exports emissive color here instead of in materialNode.Emissive
			parameters.emissive = new Color().fromArray(materialNode.EmissiveColor.value).convertSRGBToLinear();

		}

		if (materialNode.EmissiveFactor) {

			parameters.emissiveIntensity = parseFloat(materialNode.EmissiveFactor.value);

		}

		if (materialNode.Opacity) {

			parameters.opacity = parseFloat(materialNode.Opacity.value);

		}

		if (parameters.opacity < 1.0) {

			parameters.transparent = true;

		}

		if (materialNode.ReflectionFactor) {

			parameters.reflectivity = materialNode.ReflectionFactor.value;

		}

		if (materialNode.Shininess) {

			parameters.shininess = materialNode.Shininess.value;

		}

		if (materialNode.Specular) {

			parameters.specular = new Color().fromArray(materialNode.Specular.value).convertSRGBToLinear();

		} else if (materialNode.SpecularColor && materialNode.SpecularColor.type === 'Color') {

			// The blender exporter exports specular color here instead of in materialNode.Specular
			parameters.specular = new Color().fromArray(materialNode.SpecularColor.value).convertSRGBToLinear();

		}

		const scope = this;
		connections.get(ID).children.forEach(function (child) {

			const type = child.relationship;

			switch (type) {

				case 'Bump':
					parameters.bumpMap = scope.getTexture(textureMap, child.ID);
					break;

				case 'Maya|TEX_ao_map':
					parameters.aoMap = scope.getTexture(textureMap, child.ID);
					break;

				case 'DiffuseColor':
				case 'Maya|TEX_color_map':
					parameters.map = scope.getTexture(textureMap, child.ID);
					if (parameters.map !== undefined) {

						parameters.map.colorSpace = SRGBColorSpace;

					}

					break;

				case 'DisplacementColor':
					parameters.displacementMap = scope.getTexture(textureMap, child.ID);
					break;

				case 'EmissiveColor':
					parameters.emissiveMap = scope.getTexture(textureMap, child.ID);
					if (parameters.emissiveMap !== undefined) {

						parameters.emissiveMap.colorSpace = SRGBColorSpace;

					}

					break;

				case 'NormalMap':
				case 'Maya|TEX_normal_map':
					parameters.normalMap = scope.getTexture(textureMap, child.ID);
					break;

				case 'ReflectionColor':
					parameters.envMap = scope.getTexture(textureMap, child.ID);
					if (parameters.envMap !== undefined) {

						parameters.envMap.mapping = EquirectangularReflectionMapping;
						parameters.envMap.colorSpace = SRGBColorSpace;

					}

					break;

				case 'SpecularColor':
					parameters.specularMap = scope.getTexture(textureMap, child.ID);
					if (parameters.specularMap !== undefined) {

						parameters.specularMap.colorSpace = SRGBColorSpace;

					}

					break;

				case 'TransparentColor':
				case 'TransparencyFactor':
					parameters.alphaMap = scope.getTexture(textureMap, child.ID);
					parameters.transparent = true;
					break;

				case 'AmbientColor':
				case 'ShininessExponent': // AKA glossiness map
				case 'SpecularFactor': // AKA specularLevel
				case 'VectorDisplacementColor': // NOTE: Seems to be a copy of DisplacementColor
				default:
					console.warn('THREE.FBXLoader: %s map is not supported in three.js, skipping texture.', type);
					break;

			}

		});

		return parameters;

	}

	// get a texture from the textureMap for use by a material.
	getTexture(textureMap, id) {

		// if the texture is a layered texture, just use the first layer and issue a warning
		if ('LayeredTexture' in fbxTree.Objects && id in fbxTree.Objects.LayeredTexture) {

			console.warn('THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer.');
			id = connections.get(id).children[0].ID;

		}

		return textureMap.get(id);

	}

	// Parse nodes in FBXTree.Objects.Deformer
	// Deformer node can contain skinning or Vertex Cache animation data, however only skinning is supported here
	// Generates map of Skeleton-like objects for use later when generating and binding skeletons.
	parseDeformers() {

		const skeletons = {};
		const morphTargets = {};

		if ('Deformer' in fbxTree.Objects) {

			const DeformerNodes = fbxTree.Objects.Deformer;

			for (const nodeID in DeformerNodes) {

				const deformerNode = DeformerNodes[nodeID];

				const relationships = connections.get(parseInt(nodeID));

				if (deformerNode.attrType === 'Skin') {

					const skeleton = this.parseSkeleton(relationships, DeformerNodes);
					skeleton.ID = nodeID;

					if (relationships.parents.length > 1) console.warn('THREE.FBXLoader: skeleton attached to more than one geometry is not supported.');
					skeleton.geometryID = relationships.parents[0].ID;

					skeletons[nodeID] = skeleton;

				} else if (deformerNode.attrType === 'BlendShape') {

					const morphTarget = {
						id: nodeID,
					};

					morphTarget.rawTargets = this.parseMorphTargets(relationships, DeformerNodes);
					morphTarget.id = nodeID;

					if (relationships.parents.length > 1) console.warn('THREE.FBXLoader: morph target attached to more than one geometry is not supported.');

					morphTargets[nodeID] = morphTarget;

				}

			}

		}

		return {

			skeletons: skeletons,
			morphTargets: morphTargets,

		};

	}

	// Parse single nodes in FBXTree.Objects.Deformer
	// The top level skeleton node has type 'Skin' and sub nodes have type 'Cluster'
	// Each skin node represents a skeleton and each cluster node represents a bone
	parseSkeleton(relationships, deformerNodes) {

		const rawBones = [];

		relationships.children.forEach(function (child) {

			const boneNode = deformerNodes[child.ID];

			if (boneNode.attrType !== 'Cluster') return;

			const rawBone = {

				ID: child.ID,
				indices: [],
				weights: [],
				transformLink: new Matrix4().fromArray(boneNode.TransformLink.a),
				// transform: new Matrix4().fromArray( boneNode.Transform.a ),
				// linkMode: boneNode.Mode,

			};

			if ('Indexes' in boneNode) {

				rawBone.indices = boneNode.Indexes.a;
				rawBone.weights = boneNode.Weights.a;

			}

			rawBones.push(rawBone);

		});

		return {

			rawBones: rawBones,
			bones: []

		};

	}

	// The top level morph deformer node has type "BlendShape" and sub nodes have type "BlendShapeChannel"
	parseMorphTargets(relationships, deformerNodes) {

		const rawMorphTargets = [];

		for (let i = 0; i < relationships.children.length; i++) {

			const child = relationships.children[i];

			const morphTargetNode = deformerNodes[child.ID];

			const rawMorphTarget = {

				name: morphTargetNode.attrName,
				initialWeight: morphTargetNode.DeformPercent,
				id: morphTargetNode.id,
				fullWeights: morphTargetNode.FullWeights.a

			};

			if (morphTargetNode.attrType !== 'BlendShapeChannel') return;

			rawMorphTarget.geoID = connections.get(parseInt(child.ID)).children.filter(function (child) {

				return child.relationship === undefined;

			})[0].ID;

			rawMorphTargets.push(rawMorphTarget);

		}

		return rawMorphTargets;

	}

	// create the main Group() to be returned by the loader
	parseScene(deformers, geometryMap, materialMap) {

		sceneGraph = new Group();

		const modelMap = this.parseModels(deformers.skeletons, geometryMap, materialMap);

		const modelNodes = fbxTree.Objects.Model;

		const scope = this;
		modelMap.forEach(function (model) {

			const modelNode = modelNodes[model.ID];
			scope.setLookAtProperties(model, modelNode);

			const parentConnections = connections.get(model.ID).parents;

			parentConnections.forEach(function (connection) {

				const parent = modelMap.get(connection.ID);
				if (parent !== undefined) parent.add(model);

			});

			if (model.parent === null) {

				sceneGraph.add(model);

			}


		});

		this.bindSkeleton(deformers.skeletons, geometryMap, modelMap);

		this.createAmbientLight();

		sceneGraph.traverse(function (node) {

			if (node.userData.transformData) {

				if (node.parent) {

					node.userData.transformData.parentMatrix = node.parent.matrix;
					node.userData.transformData.parentMatrixWorld = node.parent.matrixWorld;

				}

				const transform = generateTransform(node.userData.transformData);

				node.applyMatrix4(transform);
				node.updateWorldMatrix();

			}

		});

		const animations = new AnimationParser().parse();

		// if all the models where already combined in a single group, just return that
		if (sceneGraph.children.length === 1 && sceneGraph.children[0].isGroup) {

			sceneGraph.children[0].animations = animations;
			sceneGraph = sceneGraph.children[0];

		}

		sceneGraph.animations = animations;

	}

	// parse nodes in FBXTree.Objects.Model
	parseModels(skeletons, geometryMap, materialMap) {

		const modelMap = new Map();
		const modelNodes = fbxTree.Objects.Model;

		for (const nodeID in modelNodes) {

			const id = parseInt(nodeID);
			const node = modelNodes[nodeID];
			const relationships = connections.get(id);

			let model = this.buildSkeleton(relationships, skeletons, id, node.attrName);

			if (!model) {

				switch (node.attrType) {

					case 'Camera':
						model = this.createCamera(relationships);
						break;
					case 'Light':
						model = this.createLight(relationships);
						break;
					case 'Mesh':
						model = this.createMesh(relationships, geometryMap, materialMap);
						break;
					case 'NurbsCurve':
						model = this.createCurve(relationships, geometryMap);
						break;
					case 'LimbNode':
					case 'Root':
						model = new Bone();
						break;
					case 'Null':
					default:
						model = new Group();
						break;

				}

				model.name = node.attrName ? PropertyBinding.sanitizeNodeName(node.attrName) : '';

				model.ID = id;

			}

			this.getTransformData(model, node);
			modelMap.set(id, model);

		}

		return modelMap;

	}

	buildSkeleton(relationships, skeletons, id, name) {

		let bone = null;

		relationships.parents.forEach(function (parent) {

			for (const ID in skeletons) {

				const skeleton = skeletons[ID];

				skeleton.rawBones.forEach(function (rawBone, i) {

					if (rawBone.ID === parent.ID) {

						const subBone = bone;
						bone = new Bone();

						bone.matrixWorld.copy(rawBone.transformLink);

						// set name and id here - otherwise in cases where "subBone" is created it will not have a name / id

						bone.name = name ? PropertyBinding.sanitizeNodeName(name) : '';
						bone.ID = id;

						skeleton.bones[i] = bone;

						// In cases where a bone is shared between multiple meshes
						// duplicate the bone here and and it as a child of the first bone
						if (subBone !== null) {

							bone.add(subBone);

						}

					}

				});

			}

		});

		return bone;

	}

	// create a PerspectiveCamera or OrthographicCamera
	createCamera(relationships) {

		let model;
		let cameraAttribute;

		relationships.children.forEach(function (child) {

			const attr = fbxTree.Objects.NodeAttribute[child.ID];

			if (attr !== undefined) {

				cameraAttribute = attr;

			}

		});

		if (cameraAttribute === undefined) {

			model = new Object3D();

		} else {

			let type = 0;
			if (cameraAttribute.CameraProjectionType !== undefined && cameraAttribute.CameraProjectionType.value === 1) {

				type = 1;

			}

			let nearClippingPlane = 1;
			if (cameraAttribute.NearPlane !== undefined) {

				nearClippingPlane = cameraAttribute.NearPlane.value / 1000;

			}

			let farClippingPlane = 1000;
			if (cameraAttribute.FarPlane !== undefined) {

				farClippingPlane = cameraAttribute.FarPlane.value / 1000;

			}


			let width = window.innerWidth;
			let height = window.innerHeight;

			if (cameraAttribute.AspectWidth !== undefined && cameraAttribute.AspectHeight !== undefined) {

				width = cameraAttribute.AspectWidth.value;
				height = cameraAttribute.AspectHeight.value;

			}

			const aspect = width / height;

			let fov = 45;
			if (cameraAttribute.FieldOfView !== undefined) {

				fov = cameraAttribute.FieldOfView.value;

			}

			const focalLength = cameraAttribute.FocalLength ? cameraAttribute.FocalLength.value : null;

			switch (type) {

				case 0: // Perspective
					model = new PerspectiveCamera(fov, aspect, nearClippingPlane, farClippingPlane);
					if (focalLength !== null) model.setFocalLength(focalLength);
					break;

				case 1: // Orthographic
					model = new OrthographicCamera(- width / 2, width / 2, height / 2, - height / 2, nearClippingPlane, farClippingPlane);
					break;

				default:
					console.warn('THREE.FBXLoader: Unknown camera type ' + type + '.');
					model = new Object3D();
					break;

			}

		}

		return model;

	}

	// Create a DirectionalLight, PointLight or SpotLight
	createLight(relationships) {

		let model;
		let lightAttribute;

		relationships.children.forEach(function (child) {

			const attr = fbxTree.Objects.NodeAttribute[child.ID];

			if (attr !== undefined) {

				lightAttribute = attr;

			}

		});

		if (lightAttribute === undefined) {

			model = new Object3D();

		} else {

			let type;

			// LightType can be undefined for Point lights
			if (lightAttribute.LightType === undefined) {

				type = 0;

			} else {

				type = lightAttribute.LightType.value;

			}

			let color = 0xffffff;

			if (lightAttribute.Color !== undefined) {

				color = new Color().fromArray(lightAttribute.Color.value).convertSRGBToLinear();

			}

			let intensity = (lightAttribute.Intensity === undefined) ? 1 : lightAttribute.Intensity.value / 100;

			// light disabled
			if (lightAttribute.CastLightOnObject !== undefined && lightAttribute.CastLightOnObject.value === 0) {

				intensity = 0;

			}

			let distance = 0;
			if (lightAttribute.FarAttenuationEnd !== undefined) {

				if (lightAttribute.EnableFarAttenuation !== undefined && lightAttribute.EnableFarAttenuation.value === 0) {

					distance = 0;

				} else {

					distance = lightAttribute.FarAttenuationEnd.value;

				}

			}

			// TODO: could this be calculated linearly from FarAttenuationStart to FarAttenuationEnd?
			const decay = 1;

			switch (type) {

				case 0: // Point
					model = new PointLight(color, intensity, distance, decay);
					break;

				case 1: // Directional
					model = new DirectionalLight(color, intensity);
					break;

				case 2: // Spot
					let angle = Math.PI / 3;

					if (lightAttribute.InnerAngle !== undefined) {

						angle = MathUtils.degToRad(lightAttribute.InnerAngle.value);

					}

					let penumbra = 0;
					if (lightAttribute.OuterAngle !== undefined) {

						// TODO: this is not correct - FBX calculates outer and inner angle in degrees
						// with OuterAngle > InnerAngle && OuterAngle <= Math.PI
						// while three.js uses a penumbra between (0, 1) to attenuate the inner angle
						penumbra = MathUtils.degToRad(lightAttribute.OuterAngle.value);
						penumbra = Math.max(penumbra, 1);

					}

					model = new SpotLight(color, intensity, distance, angle, penumbra, decay);
					break;

				default:
					console.warn('THREE.FBXLoader: Unknown light type ' + lightAttribute.LightType.value + ', defaulting to a PointLight.');
					model = new PointLight(color, intensity);
					break;

			}

			if (lightAttribute.CastShadows !== undefined && lightAttribute.CastShadows.value === 1) {

				model.castShadow = true;

			}

		}

		return model;

	}

	createMesh(relationships, geometryMap, materialMap) {

		let model;
		let geometry = null;
		let material = null;
		const materials = [];

		// get geometry and materials(s) from connections
		relationships.children.forEach(function (child) {

			if (geometryMap.has(child.ID)) {

				geometry = geometryMap.get(child.ID);

			}

			if (materialMap.has(child.ID)) {

				materials.push(materialMap.get(child.ID));

			}

		});

		if (materials.length > 1) {

			material = materials;

		} else if (materials.length > 0) {

			material = materials[0];

		} else {

			material = new MeshPhongMaterial({
				name: Loader.DEFAULT_MATERIAL_NAME,
				color: 0xcccccc
			});
			materials.push(material);

		}

		if ('color' in geometry.attributes) {

			materials.forEach(function (material) {

				material.vertexColors = true;

			});

		}

		if (geometry.FBX_Deformer) {

			model = new SkinnedMesh(geometry, material);
			model.normalizeSkinWeights();

		} else {

			model = new Mesh(geometry, material);

		}

		return model;

	}

	createCurve(relationships, geometryMap) {

		const geometry = relationships.children.reduce(function (geo, child) {

			if (geometryMap.has(child.ID)) geo = geometryMap.get(child.ID);

			return geo;

		}, null);

		// FBX does not list materials for Nurbs lines, so we'll just put our own in here.
		const material = new LineBasicMaterial({
			name: Loader.DEFAULT_MATERIAL_NAME,
			color: 0x3300ff,
			linewidth: 1
		});
		return new Line(geometry, material);

	}

	// parse the model node for transform data
	getTransformData(model, modelNode) {

		const transformData = {};

		if ('InheritType' in modelNode) transformData.inheritType = parseInt(modelNode.InheritType.value);

		if ('RotationOrder' in modelNode) transformData.eulerOrder = getEulerOrder(modelNode.RotationOrder.value);
		else transformData.eulerOrder = 'ZYX';

		if ('Lcl_Translation' in modelNode) transformData.translation = modelNode.Lcl_Translation.value;

		if ('PreRotation' in modelNode) transformData.preRotation = modelNode.PreRotation.value;
		if ('Lcl_Rotation' in modelNode) transformData.rotation = modelNode.Lcl_Rotation.value;
		if ('PostRotation' in modelNode) transformData.postRotation = modelNode.PostRotation.value;

		if ('Lcl_Scaling' in modelNode) transformData.scale = modelNode.Lcl_Scaling.value;

		if ('ScalingOffset' in modelNode) transformData.scalingOffset = modelNode.ScalingOffset.value;
		if ('ScalingPivot' in modelNode) transformData.scalingPivot = modelNode.ScalingPivot.value;

		if ('RotationOffset' in modelNode) transformData.rotationOffset = modelNode.RotationOffset.value;
		if ('RotationPivot' in modelNode) transformData.rotationPivot = modelNode.RotationPivot.value;

		model.userData.transformData = transformData;

	}

	setLookAtProperties(model, modelNode) {

		if ('LookAtProperty' in modelNode) {

			const children = connections.get(model.ID).children;

			children.forEach(function (child) {

				if (child.relationship === 'LookAtProperty') {

					const lookAtTarget = fbxTree.Objects.Model[child.ID];

					if ('Lcl_Translation' in lookAtTarget) {

						const pos = lookAtTarget.Lcl_Translation.value;

						// DirectionalLight, SpotLight
						if (model.target !== undefined) {

							model.target.position.fromArray(pos);
							sceneGraph.add(model.target);

						} else { // Cameras and other Object3Ds

							model.lookAt(new Vector3().fromArray(pos));

						}

					}

				}

			});

		}

	}

	bindSkeleton(skeletons, geometryMap, modelMap) {

		const bindMatrices = this.parsePoseNodes();

		for (const ID in skeletons) {

			const skeleton = skeletons[ID];

			const parents = connections.get(parseInt(skeleton.ID)).parents;

			parents.forEach(function (parent) {

				if (geometryMap.has(parent.ID)) {

					const geoID = parent.ID;
					const geoRelationships = connections.get(geoID);

					geoRelationships.parents.forEach(function (geoConnParent) {

						if (modelMap.has(geoConnParent.ID)) {

							const model = modelMap.get(geoConnParent.ID);

							model.bind(new Skeleton(skeleton.bones), bindMatrices[geoConnParent.ID]);

						}

					});

				}

			});

		}

	}

	parsePoseNodes() {

		const bindMatrices = {};

		if ('Pose' in fbxTree.Objects) {

			const BindPoseNode = fbxTree.Objects.Pose;

			for (const nodeID in BindPoseNode) {

				if (BindPoseNode[nodeID].attrType === 'BindPose' && BindPoseNode[nodeID].NbPoseNodes > 0) {

					const poseNodes = BindPoseNode[nodeID].PoseNode;

					if (Array.isArray(poseNodes)) {

						poseNodes.forEach(function (poseNode) {

							bindMatrices[poseNode.Node] = new Matrix4().fromArray(poseNode.Matrix.a);

						});

					} else {

						bindMatrices[poseNodes.Node] = new Matrix4().fromArray(poseNodes.Matrix.a);

					}

				}

			}

		}

		return bindMatrices;

	}

	// Parse ambient color in FBXTree.GlobalSettings - if it's not set to black (default), create an ambient light
	createAmbientLight() {

		if ('GlobalSettings' in fbxTree && 'AmbientColor' in fbxTree.GlobalSettings) {

			const ambientColor = fbxTree.GlobalSettings.AmbientColor.value;
			const r = ambientColor[0];
			const g = ambientColor[1];
			const b = ambientColor[2];

			if (r !== 0 || g !== 0 || b !== 0) {

				const color = new Color(r, g, b).convertSRGBToLinear();
				sceneGraph.add(new AmbientLight(color, 1));

			}

		}

	}

}

// parse Geometry data from FBXTree and return map of BufferGeometries
class GeometryParser {

	constructor() {

		this.negativeMaterialIndices = false;

	}

	// Parse nodes in FBXTree.Objects.Geometry
	parse(deformers) {

		const geometryMap = new Map();

		if ('Geometry' in fbxTree.Objects) {

			const geoNodes = fbxTree.Objects.Geometry;

			for (const nodeID in geoNodes) {

				const relationships = connections.get(parseInt(nodeID));
				const geo = this.parseGeometry(relationships, geoNodes[nodeID], deformers);

				geometryMap.set(parseInt(nodeID), geo);

			}

		}

		// report warnings

		if (this.negativeMaterialIndices === true) {

			console.warn('THREE.FBXLoader: The FBX file contains invalid (negative) material indices. The asset might not render as expected.');

		}

		return geometryMap;

	}

	// Parse single node in FBXTree.Objects.Geometry
	parseGeometry(relationships, geoNode, deformers) {

		switch (geoNode.attrType) {

			case 'Mesh':
				return this.parseMeshGeometry(relationships, geoNode, deformers);

			case 'NurbsCurve':
				return this.parseNurbsGeometry(geoNode);

		}

	}

	// Parse single node mesh geometry in FBXTree.Objects.Geometry
	parseMeshGeometry(relationships, geoNode, deformers) {

		const skeletons = deformers.skeletons;
		const morphTargets = [];

		const modelNodes = relationships.parents.map(function (parent) {

			return fbxTree.Objects.Model[parent.ID];

		});

		// don't create geometry if it is not associated with any models
		if (modelNodes.length === 0) return;

		const skeleton = relationships.children.reduce(function (skeleton, child) {

			if (skeletons[child.ID] !== undefined) skeleton = skeletons[child.ID];

			return skeleton;

		}, null);

		relationships.children.forEach(function (child) {

			if (deformers.morphTargets[child.ID] !== undefined) {

				morphTargets.push(deformers.morphTargets[child.ID]);

			}

		});

		// Assume one model and get the preRotation from that
		// if there is more than one model associated with the geometry this may cause problems
		const modelNode = modelNodes[0];

		const transformData = {};

		if ('RotationOrder' in modelNode) transformData.eulerOrder = getEulerOrder(modelNode.RotationOrder.value);
		if ('InheritType' in modelNode) transformData.inheritType = parseInt(modelNode.InheritType.value);

		if ('GeometricTranslation' in modelNode) transformData.translation = modelNode.GeometricTranslation.value;
		if ('GeometricRotation' in modelNode) transformData.rotation = modelNode.GeometricRotation.value;
		if ('GeometricScaling' in modelNode) transformData.scale = modelNode.GeometricScaling.value;

		const transform = generateTransform(transformData);

		return this.genGeometry(geoNode, skeleton, morphTargets, transform);

	}

	// Generate a BufferGeometry from a node in FBXTree.Objects.Geometry
	genGeometry(geoNode, skeleton, morphTargets, preTransform) {

		const geo = new BufferGeometry();
		if (geoNode.attrName) geo.name = geoNode.attrName;

		const geoInfo = this.parseGeoNode(geoNode, skeleton);
		const buffers = this.genBuffers(geoInfo);

		const positionAttribute = new Float32BufferAttribute(buffers.vertex, 3);

		positionAttribute.applyMatrix4(preTransform);

		geo.setAttribute('position', positionAttribute);

		if (buffers.colors.length > 0) {

			geo.setAttribute('color', new Float32BufferAttribute(buffers.colors, 3));

		}

		if (skeleton) {

			geo.setAttribute('skinIndex', new Uint16BufferAttribute(buffers.weightsIndices, 4));

			geo.setAttribute('skinWeight', new Float32BufferAttribute(buffers.vertexWeights, 4));

			// used later to bind the skeleton to the model
			geo.FBX_Deformer = skeleton;

		}

		if (buffers.normal.length > 0) {

			const normalMatrix = new Matrix3().getNormalMatrix(preTransform);

			const normalAttribute = new Float32BufferAttribute(buffers.normal, 3);
			normalAttribute.applyNormalMatrix(normalMatrix);

			geo.setAttribute('normal', normalAttribute);

		}

		buffers.uvs.forEach(function (uvBuffer, i) {

			const name = i === 0 ? 'uv' : `uv${i}`;

			geo.setAttribute(name, new Float32BufferAttribute(buffers.uvs[i], 2));

		});

		if (geoInfo.material && geoInfo.material.mappingType !== 'AllSame') {

			// Convert the material indices of each vertex into rendering groups on the geometry.
			let prevMaterialIndex = buffers.materialIndex[0];
			let startIndex = 0;

			buffers.materialIndex.forEach(function (currentIndex, i) {

				if (currentIndex !== prevMaterialIndex) {

					geo.addGroup(startIndex, i - startIndex, prevMaterialIndex);

					prevMaterialIndex = currentIndex;
					startIndex = i;

				}

			});

			// the loop above doesn't add the last group, do that here.
			if (geo.groups.length > 0) {

				const lastGroup = geo.groups[geo.groups.length - 1];
				const lastIndex = lastGroup.start + lastGroup.count;

				if (lastIndex !== buffers.materialIndex.length) {

					geo.addGroup(lastIndex, buffers.materialIndex.length - lastIndex, prevMaterialIndex);

				}

			}

			// case where there are multiple materials but the whole geometry is only
			// using one of them
			if (geo.groups.length === 0) {

				geo.addGroup(0, buffers.materialIndex.length, buffers.materialIndex[0]);

			}

		}

		this.addMorphTargets(geo, geoNode, morphTargets, preTransform);

		return geo;

	}

	parseGeoNode(geoNode, skeleton) {

		const geoInfo = {};

		geoInfo.vertexPositions = (geoNode.Vertices !== undefined) ? geoNode.Vertices.a : [];
		geoInfo.vertexIndices = (geoNode.PolygonVertexIndex !== undefined) ? geoNode.PolygonVertexIndex.a : [];

		if (geoNode.LayerElementColor) {

			geoInfo.color = this.parseVertexColors(geoNode.LayerElementColor[0]);

		}

		if (geoNode.LayerElementMaterial) {

			geoInfo.material = this.parseMaterialIndices(geoNode.LayerElementMaterial[0]);

		}

		if (geoNode.LayerElementNormal) {

			geoInfo.normal = this.parseNormals(geoNode.LayerElementNormal[0]);

		}

		if (geoNode.LayerElementUV) {

			geoInfo.uv = [];

			let i = 0;
			while (geoNode.LayerElementUV[i]) {

				if (geoNode.LayerElementUV[i].UV) {

					geoInfo.uv.push(this.parseUVs(geoNode.LayerElementUV[i]));

				}

				i++;

			}

		}

		geoInfo.weightTable = {};

		if (skeleton !== null) {

			geoInfo.skeleton = skeleton;

			skeleton.rawBones.forEach(function (rawBone, i) {

				// loop over the bone's vertex indices and weights
				rawBone.indices.forEach(function (index, j) {

					if (geoInfo.weightTable[index] === undefined) geoInfo.weightTable[index] = [];

					geoInfo.weightTable[index].push({

						id: i,
						weight: rawBone.weights[j],

					});

				});

			});

		}

		return geoInfo;

	}

	genBuffers(geoInfo) {

		const buffers = {
			vertex: [],
			normal: [],
			colors: [],
			uvs: [],
			materialIndex: [],
			vertexWeights: [],
			weightsIndices: [],
		};

		let polygonIndex = 0;
		let faceLength = 0;
		let displayedWeightsWarning = false;

		// these will hold data for a single face
		let facePositionIndexes = [];
		let faceNormals = [];
		let faceColors = [];
		let faceUVs = [];
		let faceWeights = [];
		let faceWeightIndices = [];

		const scope = this;
		geoInfo.vertexIndices.forEach(function (vertexIndex, polygonVertexIndex) {

			let materialIndex;
			let endOfFace = false;

			// Face index and vertex index arrays are combined in a single array
			// A cube with quad faces looks like this:
			// PolygonVertexIndex: *24 {
			//  a: 0, 1, 3, -3, 2, 3, 5, -5, 4, 5, 7, -7, 6, 7, 1, -1, 1, 7, 5, -4, 6, 0, 2, -5
			//  }
			// Negative numbers mark the end of a face - first face here is 0, 1, 3, -3
			// to find index of last vertex bit shift the index: ^ - 1
			if (vertexIndex < 0) {

				vertexIndex = vertexIndex ^ - 1; // equivalent to ( x * -1 ) - 1
				endOfFace = true;

			}

			let weightIndices = [];
			let weights = [];

			facePositionIndexes.push(vertexIndex * 3, vertexIndex * 3 + 1, vertexIndex * 3 + 2);

			if (geoInfo.color) {

				const data = getData(polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.color);

				faceColors.push(data[0], data[1], data[2]);

			}

			if (geoInfo.skeleton) {

				if (geoInfo.weightTable[vertexIndex] !== undefined) {

					geoInfo.weightTable[vertexIndex].forEach(function (wt) {

						weights.push(wt.weight);
						weightIndices.push(wt.id);

					});


				}

				if (weights.length > 4) {

					if (!displayedWeightsWarning) {

						console.warn('THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights.');
						displayedWeightsWarning = true;

					}

					const wIndex = [0, 0, 0, 0];
					const Weight = [0, 0, 0, 0];

					weights.forEach(function (weight, weightIndex) {

						let currentWeight = weight;
						let currentIndex = weightIndices[weightIndex];

						Weight.forEach(function (comparedWeight, comparedWeightIndex, comparedWeightArray) {

							if (currentWeight > comparedWeight) {

								comparedWeightArray[comparedWeightIndex] = currentWeight;
								currentWeight = comparedWeight;

								const tmp = wIndex[comparedWeightIndex];
								wIndex[comparedWeightIndex] = currentIndex;
								currentIndex = tmp;

							}

						});

					});

					weightIndices = wIndex;
					weights = Weight;

				}

				// if the weight array is shorter than 4 pad with 0s
				while (weights.length < 4) {

					weights.push(0);
					weightIndices.push(0);

				}

				for (let i = 0; i < 4; ++i) {

					faceWeights.push(weights[i]);
					faceWeightIndices.push(weightIndices[i]);

				}

			}

			if (geoInfo.normal) {

				const data = getData(polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.normal);

				faceNormals.push(data[0], data[1], data[2]);

			}

			if (geoInfo.material && geoInfo.material.mappingType !== 'AllSame') {

				materialIndex = getData(polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.material)[0];

				if (materialIndex < 0) {

					scope.negativeMaterialIndices = true;
					materialIndex = 0; // fallback

				}

			}

			if (geoInfo.uv) {

				geoInfo.uv.forEach(function (uv, i) {

					const data = getData(polygonVertexIndex, polygonIndex, vertexIndex, uv);

					if (faceUVs[i] === undefined) {

						faceUVs[i] = [];

					}

					faceUVs[i].push(data[0]);
					faceUVs[i].push(data[1]);

				});

			}

			faceLength++;

			if (endOfFace) {

				if (faceLength > 4) console.warn('THREE.FBXLoader: Polygons with more than four sides are not supported. Make sure to triangulate the geometry during export.');

				scope.genFace(buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength);

				polygonIndex++;
				faceLength = 0;

				// reset arrays for the next face
				facePositionIndexes = [];
				faceNormals = [];
				faceColors = [];
				faceUVs = [];
				faceWeights = [];
				faceWeightIndices = [];

			}

		});

		return buffers;

	}

	// Generate data for a single face in a geometry. If the face is a quad then split it into 2 tris
	genFace(buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength) {

		for (let i = 2; i < faceLength; i++) {

			buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[0]]);
			buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[1]]);
			buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[2]]);

			buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[(i - 1) * 3]]);
			buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[(i - 1) * 3 + 1]]);
			buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[(i - 1) * 3 + 2]]);

			buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i * 3]]);
			buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i * 3 + 1]]);
			buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i * 3 + 2]]);

			if (geoInfo.skeleton) {

				buffers.vertexWeights.push(faceWeights[0]);
				buffers.vertexWeights.push(faceWeights[1]);
				buffers.vertexWeights.push(faceWeights[2]);
				buffers.vertexWeights.push(faceWeights[3]);

				buffers.vertexWeights.push(faceWeights[(i - 1) * 4]);
				buffers.vertexWeights.push(faceWeights[(i - 1) * 4 + 1]);
				buffers.vertexWeights.push(faceWeights[(i - 1) * 4 + 2]);
				buffers.vertexWeights.push(faceWeights[(i - 1) * 4 + 3]);

				buffers.vertexWeights.push(faceWeights[i * 4]);
				buffers.vertexWeights.push(faceWeights[i * 4 + 1]);
				buffers.vertexWeights.push(faceWeights[i * 4 + 2]);
				buffers.vertexWeights.push(faceWeights[i * 4 + 3]);

				buffers.weightsIndices.push(faceWeightIndices[0]);
				buffers.weightsIndices.push(faceWeightIndices[1]);
				buffers.weightsIndices.push(faceWeightIndices[2]);
				buffers.weightsIndices.push(faceWeightIndices[3]);

				buffers.weightsIndices.push(faceWeightIndices[(i - 1) * 4]);
				buffers.weightsIndices.push(faceWeightIndices[(i - 1) * 4 + 1]);
				buffers.weightsIndices.push(faceWeightIndices[(i - 1) * 4 + 2]);
				buffers.weightsIndices.push(faceWeightIndices[(i - 1) * 4 + 3]);

				buffers.weightsIndices.push(faceWeightIndices[i * 4]);
				buffers.weightsIndices.push(faceWeightIndices[i * 4 + 1]);
				buffers.weightsIndices.push(faceWeightIndices[i * 4 + 2]);
				buffers.weightsIndices.push(faceWeightIndices[i * 4 + 3]);

			}

			if (geoInfo.color) {

				buffers.colors.push(faceColors[0]);
				buffers.colors.push(faceColors[1]);
				buffers.colors.push(faceColors[2]);

				buffers.colors.push(faceColors[(i - 1) * 3]);
				buffers.colors.push(faceColors[(i - 1) * 3 + 1]);
				buffers.colors.push(faceColors[(i - 1) * 3 + 2]);

				buffers.colors.push(faceColors[i * 3]);
				buffers.colors.push(faceColors[i * 3 + 1]);
				buffers.colors.push(faceColors[i * 3 + 2]);

			}

			if (geoInfo.material && geoInfo.material.mappingType !== 'AllSame') {

				buffers.materialIndex.push(materialIndex);
				buffers.materialIndex.push(materialIndex);
				buffers.materialIndex.push(materialIndex);

			}

			if (geoInfo.normal) {

				buffers.normal.push(faceNormals[0]);
				buffers.normal.push(faceNormals[1]);
				buffers.normal.push(faceNormals[2]);

				buffers.normal.push(faceNormals[(i - 1) * 3]);
				buffers.normal.push(faceNormals[(i - 1) * 3 + 1]);
				buffers.normal.push(faceNormals[(i - 1) * 3 + 2]);

				buffers.normal.push(faceNormals[i * 3]);
				buffers.normal.push(faceNormals[i * 3 + 1]);
				buffers.normal.push(faceNormals[i * 3 + 2]);

			}

			if (geoInfo.uv) {

				geoInfo.uv.forEach(function (uv, j) {

					if (buffers.uvs[j] === undefined) buffers.uvs[j] = [];

					buffers.uvs[j].push(faceUVs[j][0]);
					buffers.uvs[j].push(faceUVs[j][1]);

					buffers.uvs[j].push(faceUVs[j][(i - 1) * 2]);
					buffers.uvs[j].push(faceUVs[j][(i - 1) * 2 + 1]);

					buffers.uvs[j].push(faceUVs[j][i * 2]);
					buffers.uvs[j].push(faceUVs[j][i * 2 + 1]);

				});

			}

		}

	}

	addMorphTargets(parentGeo, parentGeoNode, morphTargets, preTransform) {

		if (morphTargets.length === 0) return;

		parentGeo.morphTargetsRelative = true;

		parentGeo.morphAttributes.position = [];
		// parentGeo.morphAttributes.normal = []; // not implemented

		const scope = this;
		morphTargets.forEach(function (morphTarget) {

			morphTarget.rawTargets.forEach(function (rawTarget) {

				const morphGeoNode = fbxTree.Objects.Geometry[rawTarget.geoID];

				if (morphGeoNode !== undefined) {

					scope.genMorphGeometry(parentGeo, parentGeoNode, morphGeoNode, preTransform, rawTarget.name);

				}

			});

		});

	}

	// a morph geometry node is similar to a standard  node, and the node is also contained
	// in FBXTree.Objects.Geometry, however it can only have attributes for position, normal
	// and a special attribute Index defining which vertices of the original geometry are affected
	// Normal and position attributes only have data for the vertices that are affected by the morph
	genMorphGeometry(parentGeo, parentGeoNode, morphGeoNode, preTransform, name) {

		const vertexIndices = (parentGeoNode.PolygonVertexIndex !== undefined) ? parentGeoNode.PolygonVertexIndex.a : [];

		const morphPositionsSparse = (morphGeoNode.Vertices !== undefined) ? morphGeoNode.Vertices.a : [];
		const indices = (morphGeoNode.Indexes !== undefined) ? morphGeoNode.Indexes.a : [];

		const length = parentGeo.attributes.position.count * 3;
		const morphPositions = new Float32Array(length);

		for (let i = 0; i < indices.length; i++) {

			const morphIndex = indices[i] * 3;

			morphPositions[morphIndex] = morphPositionsSparse[i * 3];
			morphPositions[morphIndex + 1] = morphPositionsSparse[i * 3 + 1];
			morphPositions[morphIndex + 2] = morphPositionsSparse[i * 3 + 2];

		}

		// TODO: add morph normal support
		const morphGeoInfo = {
			vertexIndices: vertexIndices,
			vertexPositions: morphPositions,

		};

		const morphBuffers = this.genBuffers(morphGeoInfo);

		const positionAttribute = new Float32BufferAttribute(morphBuffers.vertex, 3);
		positionAttribute.name = name || morphGeoNode.attrName;

		positionAttribute.applyMatrix4(preTransform);

		parentGeo.morphAttributes.position.push(positionAttribute);

	}

	// Parse normal from FBXTree.Objects.Geometry.LayerElementNormal if it exists
	parseNormals(NormalNode) {

		const mappingType = NormalNode.MappingInformationType;
		const referenceType = NormalNode.ReferenceInformationType;
		const buffer = NormalNode.Normals.a;
		let indexBuffer = [];
		if (referenceType === 'IndexToDirect') {

			if ('NormalIndex' in NormalNode) {

				indexBuffer = NormalNode.NormalIndex.a;

			} else if ('NormalsIndex' in NormalNode) {

				indexBuffer = NormalNode.NormalsIndex.a;

			}

		}

		return {
			dataSize: 3,
			buffer: buffer,
			indices: indexBuffer,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Parse UVs from FBXTree.Objects.Geometry.LayerElementUV if it exists
	parseUVs(UVNode) {

		const mappingType = UVNode.MappingInformationType;
		const referenceType = UVNode.ReferenceInformationType;
		const buffer = UVNode.UV.a;
		let indexBuffer = [];
		if (referenceType === 'IndexToDirect') {

			indexBuffer = UVNode.UVIndex.a;

		}

		return {
			dataSize: 2,
			buffer: buffer,
			indices: indexBuffer,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Parse Vertex Colors from FBXTree.Objects.Geometry.LayerElementColor if it exists
	parseVertexColors(ColorNode) {

		const mappingType = ColorNode.MappingInformationType;
		const referenceType = ColorNode.ReferenceInformationType;
		const buffer = ColorNode.Colors.a;
		let indexBuffer = [];
		if (referenceType === 'IndexToDirect') {

			indexBuffer = ColorNode.ColorIndex.a;

		}

		for (let i = 0, c = new Color(); i < buffer.length; i += 4) {

			c.fromArray(buffer, i).convertSRGBToLinear().toArray(buffer, i);

		}

		return {
			dataSize: 4,
			buffer: buffer,
			indices: indexBuffer,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Parse mapping and material data in FBXTree.Objects.Geometry.LayerElementMaterial if it exists
	parseMaterialIndices(MaterialNode) {

		const mappingType = MaterialNode.MappingInformationType;
		const referenceType = MaterialNode.ReferenceInformationType;

		if (mappingType === 'NoMappingInformation') {

			return {
				dataSize: 1,
				buffer: [0],
				indices: [0],
				mappingType: 'AllSame',
				referenceType: referenceType
			};

		}

		const materialIndexBuffer = MaterialNode.Materials.a;

		// Since materials are stored as indices, there's a bit of a mismatch between FBX and what
		// we expect.So we create an intermediate buffer that points to the index in the buffer,
		// for conforming with the other functions we've written for other data.
		const materialIndices = [];

		for (let i = 0; i < materialIndexBuffer.length; ++i) {

			materialIndices.push(i);

		}

		return {
			dataSize: 1,
			buffer: materialIndexBuffer,
			indices: materialIndices,
			mappingType: mappingType,
			referenceType: referenceType
		};

	}

	// Generate a NurbGeometry from a node in FBXTree.Objects.Geometry
	parseNurbsGeometry(geoNode) {

		const order = parseInt(geoNode.Order);

		if (isNaN(order)) {

			console.error('THREE.FBXLoader: Invalid Order %s given for geometry ID: %s', geoNode.Order, geoNode.id);
			return new BufferGeometry();

		}

		const degree = order - 1;

		const knots = geoNode.KnotVector.a;
		const controlPoints = [];
		const pointsValues = geoNode.Points.a;

		for (let i = 0, l = pointsValues.length; i < l; i += 4) {

			controlPoints.push(new Vector4().fromArray(pointsValues, i));

		}

		let startKnot, endKnot;

		if (geoNode.Form === 'Closed') {

			controlPoints.push(controlPoints[0]);

		} else if (geoNode.Form === 'Periodic') {

			startKnot = degree;
			endKnot = knots.length - 1 - startKnot;

			for (let i = 0; i < degree; ++i) {

				controlPoints.push(controlPoints[i]);

			}

		}

		const curve = new NURBSCurve(degree, knots, controlPoints, startKnot, endKnot);
		const points = curve.getPoints(controlPoints.length * 12);

		return new BufferGeometry().setFromPoints(points);

	}

}

// parse animation data from FBXTree
class AnimationParser {

	// take raw animation clips and turn them into three.js animation clips
	parse() {

		const animationClips = [];

		const rawClips = this.parseClips();

		if (rawClips !== undefined) {

			for (const key in rawClips) {

				const rawClip = rawClips[key];

				const clip = this.addClip(rawClip);

				animationClips.push(clip);

			}

		}

		return animationClips;

	}

	parseClips() {

		// since the actual transformation data is stored in FBXTree.Objects.AnimationCurve,
		// if this is undefined we can safely assume there are no animations
		if (fbxTree.Objects.AnimationCurve === undefined) return undefined;

		const curveNodesMap = this.parseAnimationCurveNodes();

		this.parseAnimationCurves(curveNodesMap);

		const layersMap = this.parseAnimationLayers(curveNodesMap);
		const rawClips = this.parseAnimStacks(layersMap);

		return rawClips;

	}

	// parse nodes in FBXTree.Objects.AnimationCurveNode
	// each AnimationCurveNode holds data for an animation transform for a model (e.g. left arm rotation )
	// and is referenced by an AnimationLayer
	parseAnimationCurveNodes() {

		const rawCurveNodes = fbxTree.Objects.AnimationCurveNode;

		const curveNodesMap = new Map();

		for (const nodeID in rawCurveNodes) {

			const rawCurveNode = rawCurveNodes[nodeID];

			if (rawCurveNode.attrName.match(/S|R|T|DeformPercent/) !== null) {

				const curveNode = {

					id: rawCurveNode.id,
					attr: rawCurveNode.attrName,
					curves: {},

				};

				curveNodesMap.set(curveNode.id, curveNode);

			}

		}

		return curveNodesMap;

	}

	// parse nodes in FBXTree.Objects.AnimationCurve and connect them up to
	// previously parsed AnimationCurveNodes. Each AnimationCurve holds data for a single animated
	// axis ( e.g. times and values of x rotation)
	parseAnimationCurves(curveNodesMap) {

		const rawCurves = fbxTree.Objects.AnimationCurve;

		// TODO: Many values are identical up to roundoff error, but won't be optimised
		// e.g. position times: [0, 0.4, 0. 8]
		// position values: [7.23538335023477e-7, 93.67518615722656, -0.9982695579528809, 7.23538335023477e-7, 93.67518615722656, -0.9982695579528809, 7.235384487103147e-7, 93.67520904541016, -0.9982695579528809]
		// clearly, this should be optimised to
		// times: [0], positions [7.23538335023477e-7, 93.67518615722656, -0.9982695579528809]
		// this shows up in nearly every FBX file, and generally time array is length > 100

		for (const nodeID in rawCurves) {

			const animationCurve = {

				id: rawCurves[nodeID].id,
				times: rawCurves[nodeID].KeyTime.a.map(convertFBXTimeToSeconds),
				values: rawCurves[nodeID].KeyValueFloat.a,

			};

			const relationships = connections.get(animationCurve.id);

			if (relationships !== undefined) {

				const animationCurveID = relationships.parents[0].ID;
				const animationCurveRelationship = relationships.parents[0].relationship;

				if (animationCurveRelationship.match(/X/)) {

					curveNodesMap.get(animationCurveID).curves['x'] = animationCurve;

				} else if (animationCurveRelationship.match(/Y/)) {

					curveNodesMap.get(animationCurveID).curves['y'] = animationCurve;

				} else if (animationCurveRelationship.match(/Z/)) {

					curveNodesMap.get(animationCurveID).curves['z'] = animationCurve;

				} else if (animationCurveRelationship.match(/DeformPercent/) && curveNodesMap.has(animationCurveID)) {

					curveNodesMap.get(animationCurveID).curves['morph'] = animationCurve;

				}

			}

		}

	}

	// parse nodes in FBXTree.Objects.AnimationLayer. Each layers holds references
	// to various AnimationCurveNodes and is referenced by an AnimationStack node
	// note: theoretically a stack can have multiple layers, however in practice there always seems to be one per stack
	parseAnimationLayers(curveNodesMap) {

		const rawLayers = fbxTree.Objects.AnimationLayer;

		const layersMap = new Map();

		for (const nodeID in rawLayers) {

			const layerCurveNodes = [];

			const connection = connections.get(parseInt(nodeID));

			if (connection !== undefined) {

				// all the animationCurveNodes used in the layer
				const children = connection.children;

				children.forEach(function (child, i) {

					if (curveNodesMap.has(child.ID)) {

						const curveNode = curveNodesMap.get(child.ID);

						// check that the curves are defined for at least one axis, otherwise ignore the curveNode
						if (curveNode.curves.x !== undefined || curveNode.curves.y !== undefined || curveNode.curves.z !== undefined) {

							if (layerCurveNodes[i] === undefined) {

								const modelID = connections.get(child.ID).parents.filter(function (parent) {

									return parent.relationship !== undefined;

								})[0].ID;

								if (modelID !== undefined) {

									const rawModel = fbxTree.Objects.Model[modelID.toString()];

									if (rawModel === undefined) {

										console.warn('THREE.FBXLoader: Encountered a unused curve.', child);
										return;

									}

									const node = {

										modelName: rawModel.attrName ? PropertyBinding.sanitizeNodeName(rawModel.attrName) : '',
										ID: rawModel.id,
										initialPosition: [0, 0, 0],
										initialRotation: [0, 0, 0],
										initialScale: [1, 1, 1],

									};

									sceneGraph.traverse(function (child) {

										if (child.ID === rawModel.id) {

											node.transform = child.matrix;

											if (child.userData.transformData) node.eulerOrder = child.userData.transformData.eulerOrder;

										}

									});

									if (!node.transform) node.transform = new Matrix4();

									// if the animated model is pre rotated, we'll have to apply the pre rotations to every
									// animation value as well
									if ('PreRotation' in rawModel) node.preRotation = rawModel.PreRotation.value;
									if ('PostRotation' in rawModel) node.postRotation = rawModel.PostRotation.value;

									layerCurveNodes[i] = node;

								}

							}

							if (layerCurveNodes[i]) layerCurveNodes[i][curveNode.attr] = curveNode;

						} else if (curveNode.curves.morph !== undefined) {

							if (layerCurveNodes[i] === undefined) {

								const deformerID = connections.get(child.ID).parents.filter(function (parent) {

									return parent.relationship !== undefined;

								})[0].ID;

								const morpherID = connections.get(deformerID).parents[0].ID;
								const geoID = connections.get(morpherID).parents[0].ID;

								// assuming geometry is not used in more than one model
								const modelID = connections.get(geoID).parents[0].ID;

								const rawModel = fbxTree.Objects.Model[modelID];

								const node = {

									modelName: rawModel.attrName ? PropertyBinding.sanitizeNodeName(rawModel.attrName) : '',
									morphName: fbxTree.Objects.Deformer[deformerID].attrName,

								};

								layerCurveNodes[i] = node;

							}

							layerCurveNodes[i][curveNode.attr] = curveNode;

						}

					}

				});

				layersMap.set(parseInt(nodeID), layerCurveNodes);

			}

		}

		return layersMap;

	}

	// parse nodes in FBXTree.Objects.AnimationStack. These are the top level node in the animation
	// hierarchy. Each Stack node will be used to create a AnimationClip
	parseAnimStacks(layersMap) {

		const rawStacks = fbxTree.Objects.AnimationStack;

		// connect the stacks (clips) up to the layers
		const rawClips = {};

		for (const nodeID in rawStacks) {

			const children = connections.get(parseInt(nodeID)).children;

			if (children.length > 1) {

				// it seems like stacks will always be associated with a single layer. But just in case there are files
				// where there are multiple layers per stack, we'll display a warning
				console.warn('THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.');

			}

			const layer = layersMap.get(children[0].ID);

			rawClips[nodeID] = {

				name: rawStacks[nodeID].attrName,
				layer: layer,

			};

		}

		return rawClips;

	}

	addClip(rawClip) {

		let tracks = [];

		const scope = this;
		rawClip.layer.forEach(function (rawTracks) {

			tracks = tracks.concat(scope.generateTracks(rawTracks));

		});

		return new AnimationClip(rawClip.name, - 1, tracks);

	}

	generateTracks(rawTracks) {

		const tracks = [];

		let initialPosition = new Vector3();
		let initialRotation = new Quaternion();
		let initialScale = new Vector3();

		if (rawTracks.transform) rawTracks.transform.decompose(initialPosition, initialRotation, initialScale);

		initialPosition = initialPosition.toArray();
		initialRotation = new Euler().setFromQuaternion(initialRotation, rawTracks.eulerOrder).toArray();
		initialScale = initialScale.toArray();

		if (rawTracks.T !== undefined && Object.keys(rawTracks.T.curves).length > 0) {

			const positionTrack = this.generateVectorTrack(rawTracks.modelName, rawTracks.T.curves, initialPosition, 'position');
			if (positionTrack !== undefined) tracks.push(positionTrack);

		}

		if (rawTracks.R !== undefined && Object.keys(rawTracks.R.curves).length > 0) {

			const rotationTrack = this.generateRotationTrack(rawTracks.modelName, rawTracks.R.curves, initialRotation, rawTracks.preRotation, rawTracks.postRotation, rawTracks.eulerOrder);
			if (rotationTrack !== undefined) tracks.push(rotationTrack);

		}

		if (rawTracks.S !== undefined && Object.keys(rawTracks.S.curves).length > 0) {

			const scaleTrack = this.generateVectorTrack(rawTracks.modelName, rawTracks.S.curves, initialScale, 'scale');
			if (scaleTrack !== undefined) tracks.push(scaleTrack);

		}

		if (rawTracks.DeformPercent !== undefined) {

			const morphTrack = this.generateMorphTrack(rawTracks);
			if (morphTrack !== undefined) tracks.push(morphTrack);

		}

		return tracks;

	}

	generateVectorTrack(modelName, curves, initialValue, type) {

		const times = this.getTimesForAllAxes(curves);
		const values = this.getKeyframeTrackValues(times, curves, initialValue);

		return new VectorKeyframeTrack(modelName + '.' + type, times, values);

	}

	generateRotationTrack(modelName, curves, initialValue, preRotation, postRotation, eulerOrder) {

		if (curves.x !== undefined) {

			this.interpolateRotations(curves.x);
			curves.x.values = curves.x.values.map(MathUtils.degToRad);

		}

		if (curves.y !== undefined) {

			this.interpolateRotations(curves.y);
			curves.y.values = curves.y.values.map(MathUtils.degToRad);

		}

		if (curves.z !== undefined) {

			this.interpolateRotations(curves.z);
			curves.z.values = curves.z.values.map(MathUtils.degToRad);

		}

		const times = this.getTimesForAllAxes(curves);
		const values = this.getKeyframeTrackValues(times, curves, initialValue);

		if (preRotation !== undefined) {

			preRotation = preRotation.map(MathUtils.degToRad);
			preRotation.push(eulerOrder);

			preRotation = new Euler().fromArray(preRotation);
			preRotation = new Quaternion().setFromEuler(preRotation);

		}

		if (postRotation !== undefined) {

			postRotation = postRotation.map(MathUtils.degToRad);
			postRotation.push(eulerOrder);

			postRotation = new Euler().fromArray(postRotation);
			postRotation = new Quaternion().setFromEuler(postRotation).invert();

		}

		const quaternion = new Quaternion();
		const euler = new Euler();

		const quaternionValues = [];

		for (let i = 0; i < values.length; i += 3) {

			euler.set(values[i], values[i + 1], values[i + 2], eulerOrder);

			quaternion.setFromEuler(euler);

			if (preRotation !== undefined) quaternion.premultiply(preRotation);
			if (postRotation !== undefined) quaternion.multiply(postRotation);

			quaternion.toArray(quaternionValues, (i / 3) * 4);

		}

		return new QuaternionKeyframeTrack(modelName + '.quaternion', times, quaternionValues);

	}

	generateMorphTrack(rawTracks) {

		const curves = rawTracks.DeformPercent.curves.morph;
		const values = curves.values.map(function (val) {

			return val / 100;

		});

		const morphNum = sceneGraph.getObjectByName(rawTracks.modelName).morphTargetDictionary[rawTracks.morphName];

		return new NumberKeyframeTrack(rawTracks.modelName + '.morphTargetInfluences[' + morphNum + ']', curves.times, values);

	}

	// For all animated objects, times are defined separately for each axis
	// Here we'll combine the times into one sorted array without duplicates
	getTimesForAllAxes(curves) {

		let times = [];

		// first join together the times for each axis, if defined
		if (curves.x !== undefined) times = times.concat(curves.x.times);
		if (curves.y !== undefined) times = times.concat(curves.y.times);
		if (curves.z !== undefined) times = times.concat(curves.z.times);

		// then sort them
		times = times.sort(function (a, b) {

			return a - b;

		});

		// and remove duplicates
		if (times.length > 1) {

			let targetIndex = 1;
			let lastValue = times[0];
			for (let i = 1; i < times.length; i++) {

				const currentValue = times[i];
				if (currentValue !== lastValue) {

					times[targetIndex] = currentValue;
					lastValue = currentValue;
					targetIndex++;

				}

			}

			times = times.slice(0, targetIndex);

		}

		return times;

	}

	getKeyframeTrackValues(times, curves, initialValue) {

		const prevValue = initialValue;

		const values = [];

		let xIndex = - 1;
		let yIndex = - 1;
		let zIndex = - 1;

		times.forEach(function (time) {

			if (curves.x) xIndex = curves.x.times.indexOf(time);
			if (curves.y) yIndex = curves.y.times.indexOf(time);
			if (curves.z) zIndex = curves.z.times.indexOf(time);

			// if there is an x value defined for this frame, use that
			if (xIndex !== - 1) {

				const xValue = curves.x.values[xIndex];
				values.push(xValue);
				prevValue[0] = xValue;

			} else {

				// otherwise use the x value from the previous frame
				values.push(prevValue[0]);

			}

			if (yIndex !== - 1) {

				const yValue = curves.y.values[yIndex];
				values.push(yValue);
				prevValue[1] = yValue;

			} else {

				values.push(prevValue[1]);

			}

			if (zIndex !== - 1) {

				const zValue = curves.z.values[zIndex];
				values.push(zValue);
				prevValue[2] = zValue;

			} else {

				values.push(prevValue[2]);

			}

		});

		return values;

	}

	// Rotations are defined as Euler angles which can have values  of any size
	// These will be converted to quaternions which don't support values greater than
	// PI, so we'll interpolate large rotations
	interpolateRotations(curve) {

		for (let i = 1; i < curve.values.length; i++) {

			const initialValue = curve.values[i - 1];
			const valuesSpan = curve.values[i] - initialValue;

			const absoluteSpan = Math.abs(valuesSpan);

			if (absoluteSpan >= 180) {

				const numSubIntervals = absoluteSpan / 180;

				const step = valuesSpan / numSubIntervals;
				let nextValue = initialValue + step;

				const initialTime = curve.times[i - 1];
				const timeSpan = curve.times[i] - initialTime;
				const interval = timeSpan / numSubIntervals;
				let nextTime = initialTime + interval;

				const interpolatedTimes = [];
				const interpolatedValues = [];

				while (nextTime < curve.times[i]) {

					interpolatedTimes.push(nextTime);
					nextTime += interval;

					interpolatedValues.push(nextValue);
					nextValue += step;

				}

				curve.times = inject(curve.times, i, interpolatedTimes);
				curve.values = inject(curve.values, i, interpolatedValues);

			}

		}

	}

}

// parse an FBX file in ASCII format
class TextParser {

	getPrevNode() {

		return this.nodeStack[this.currentIndent - 2];

	}

	getCurrentNode() {

		return this.nodeStack[this.currentIndent - 1];

	}

	getCurrentProp() {

		return this.currentProp;

	}

	pushStack(node) {

		this.nodeStack.push(node);
		this.currentIndent += 1;

	}

	popStack() {

		this.nodeStack.pop();
		this.currentIndent -= 1;

	}

	setCurrentProp(val, name) {

		this.currentProp = val;
		this.currentPropName = name;

	}

	parse(text) {

		this.currentIndent = 0;

		this.allNodes = new FBXTree();
		this.nodeStack = [];
		this.currentProp = [];
		this.currentPropName = '';

		const scope = this;

		const split = text.split(/[\r\n]+/);

		split.forEach(function (line, i) {

			const matchComment = line.match(/^[\s\t]*;/);
			const matchEmpty = line.match(/^[\s\t]*$/);

			if (matchComment || matchEmpty) return;

			const matchBeginning = line.match('^\\t{' + scope.currentIndent + '}(\\w+):(.*){', '');
			const matchProperty = line.match('^\\t{' + (scope.currentIndent) + '}(\\w+):[\\s\\t\\r\\n](.*)');
			const matchEnd = line.match('^\\t{' + (scope.currentIndent - 1) + '}}');

			if (matchBeginning) {

				scope.parseNodeBegin(line, matchBeginning);

			} else if (matchProperty) {

				scope.parseNodeProperty(line, matchProperty, split[++i]);

			} else if (matchEnd) {

				scope.popStack();

			} else if (line.match(/^[^\s\t}]/)) {

				// large arrays are split over multiple lines terminated with a ',' character
				// if this is encountered the line needs to be joined to the previous line
				scope.parseNodePropertyContinued(line);

			}

		});

		return this.allNodes;

	}

	parseNodeBegin(line, property) {

		const nodeName = property[1].trim().replace(/^"/, '').replace(/"$/, '');

		const nodeAttrs = property[2].split(',').map(function (attr) {

			return attr.trim().replace(/^"/, '').replace(/"$/, '');

		});

		const node = { name: nodeName };
		const attrs = this.parseNodeAttr(nodeAttrs);

		const currentNode = this.getCurrentNode();

		// a top node
		if (this.currentIndent === 0) {

			this.allNodes.add(nodeName, node);

		} else { // a subnode

			// if the subnode already exists, append it
			if (nodeName in currentNode) {

				// special case Pose needs PoseNodes as an array
				if (nodeName === 'PoseNode') {

					currentNode.PoseNode.push(node);

				} else if (currentNode[nodeName].id !== undefined) {

					currentNode[nodeName] = {};
					currentNode[nodeName][currentNode[nodeName].id] = currentNode[nodeName];

				}

				if (attrs.id !== '') currentNode[nodeName][attrs.id] = node;

			} else if (typeof attrs.id === 'number') {

				currentNode[nodeName] = {};
				currentNode[nodeName][attrs.id] = node;

			} else if (nodeName !== 'Properties70') {

				if (nodeName === 'PoseNode') currentNode[nodeName] = [node];
				else currentNode[nodeName] = node;

			}

		}

		if (typeof attrs.id === 'number') node.id = attrs.id;
		if (attrs.name !== '') node.attrName = attrs.name;
		if (attrs.type !== '') node.attrType = attrs.type;

		this.pushStack(node);

	}

	parseNodeAttr(attrs) {

		let id = attrs[0];

		if (attrs[0] !== '') {

			id = parseInt(attrs[0]);

			if (isNaN(id)) {

				id = attrs[0];

			}

		}

		let name = '', type = '';

		if (attrs.length > 1) {

			name = attrs[1].replace(/^(\w+)::/, '');
			type = attrs[2];

		}

		return { id: id, name: name, type: type };

	}

	parseNodeProperty(line, property, contentLine) {

		let propName = property[1].replace(/^"/, '').replace(/"$/, '').trim();
		let propValue = property[2].replace(/^"/, '').replace(/"$/, '').trim();

		// for special case: base64 image data follows "Content: ," line
		//	Content: ,
		//	 "/9j/4RDaRXhpZgAATU0A..."
		if (propName === 'Content' && propValue === ',') {

			propValue = contentLine.replace(/"/g, '').replace(/,$/, '').trim();

		}

		const currentNode = this.getCurrentNode();
		const parentName = currentNode.name;

		if (parentName === 'Properties70') {

			this.parseNodeSpecialProperty(line, propName, propValue);
			return;

		}

		// Connections
		if (propName === 'C') {

			const connProps = propValue.split(',').slice(1);
			const from = parseInt(connProps[0]);
			const to = parseInt(connProps[1]);

			let rest = propValue.split(',').slice(3);

			rest = rest.map(function (elem) {

				return elem.trim().replace(/^"/, '');

			});

			propName = 'connections';
			propValue = [from, to];
			append(propValue, rest);

			if (currentNode[propName] === undefined) {

				currentNode[propName] = [];

			}

		}

		// Node
		if (propName === 'Node') currentNode.id = propValue;

		// connections
		if (propName in currentNode && Array.isArray(currentNode[propName])) {

			currentNode[propName].push(propValue);

		} else {

			if (propName !== 'a') currentNode[propName] = propValue;
			else currentNode.a = propValue;

		}

		this.setCurrentProp(currentNode, propName);

		// convert string to array, unless it ends in ',' in which case more will be added to it
		if (propName === 'a' && propValue.slice(- 1) !== ',') {

			currentNode.a = parseNumberArray(propValue);

		}

	}

	parseNodePropertyContinued(line) {

		const currentNode = this.getCurrentNode();

		currentNode.a += line;

		// if the line doesn't end in ',' we have reached the end of the property value
		// so convert the string to an array
		if (line.slice(- 1) !== ',') {

			currentNode.a = parseNumberArray(currentNode.a);

		}

	}

	// parse "Property70"
	parseNodeSpecialProperty(line, propName, propValue) {

		// split this
		// P: "Lcl Scaling", "Lcl Scaling", "", "A",1,1,1
		// into array like below
		// ["Lcl Scaling", "Lcl Scaling", "", "A", "1,1,1" ]
		const props = propValue.split('",').map(function (prop) {

			return prop.trim().replace(/^\"/, '').replace(/\s/, '_');

		});

		const innerPropName = props[0];
		const innerPropType1 = props[1];
		const innerPropType2 = props[2];
		const innerPropFlag = props[3];
		let innerPropValue = props[4];

		// cast values where needed, otherwise leave as strings
		switch (innerPropType1) {

			case 'int':
			case 'enum':
			case 'bool':
			case 'ULongLong':
			case 'double':
			case 'Number':
			case 'FieldOfView':
				innerPropValue = parseFloat(innerPropValue);
				break;

			case 'Color':
			case 'ColorRGB':
			case 'Vector3D':
			case 'Lcl_Translation':
			case 'Lcl_Rotation':
			case 'Lcl_Scaling':
				innerPropValue = parseNumberArray(innerPropValue);
				break;

		}

		// CAUTION: these props must append to parent's parent
		this.getPrevNode()[innerPropName] = {

			'type': innerPropType1,
			'type2': innerPropType2,
			'flag': innerPropFlag,
			'value': innerPropValue

		};

		this.setCurrentProp(this.getPrevNode(), innerPropName);

	}

}

// Parse an FBX file in Binary format
class BinaryParser {

	parse(buffer) {

		const reader = new BinaryReader(buffer);
		reader.skip(23); // skip magic 23 bytes

		const version = reader.getUint32();

		if (version < 6400) {

			throw new Error('THREE.FBXLoader: FBX version not supported, FileVersion: ' + version);

		}

		const allNodes = new FBXTree();

		while (!this.endOfContent(reader)) {

			const node = this.parseNode(reader, version);
			if (node !== null) allNodes.add(node.name, node);

		}

		return allNodes;

	}

	// Check if reader has reached the end of content.
	endOfContent(reader) {

		// footer size: 160bytes + 16-byte alignment padding
		// - 16bytes: magic
		// - padding til 16-byte alignment (at least 1byte?)
		//	(seems like some exporters embed fixed 15 or 16bytes?)
		// - 4bytes: magic
		// - 4bytes: version
		// - 120bytes: zero
		// - 16bytes: magic
		if (reader.size() % 16 === 0) {

			return ((reader.getOffset() + 160 + 16) & ~0xf) >= reader.size();

		} else {

			return reader.getOffset() + 160 + 16 >= reader.size();

		}

	}

	// recursively parse nodes until the end of the file is reached
	parseNode(reader, version) {

		const node = {};

		// The first three data sizes depends on version.
		const endOffset = (version >= 7500) ? reader.getUint64() : reader.getUint32();
		const numProperties = (version >= 7500) ? reader.getUint64() : reader.getUint32();

		(version >= 7500) ? reader.getUint64() : reader.getUint32(); // the returned propertyListLen is not used

		const nameLen = reader.getUint8();
		const name = reader.getString(nameLen);

		// Regards this node as NULL-record if endOffset is zero
		if (endOffset === 0) return null;

		const propertyList = [];

		for (let i = 0; i < numProperties; i++) {

			propertyList.push(this.parseProperty(reader));

		}

		// Regards the first three elements in propertyList as id, attrName, and attrType
		const id = propertyList.length > 0 ? propertyList[0] : '';
		const attrName = propertyList.length > 1 ? propertyList[1] : '';
		const attrType = propertyList.length > 2 ? propertyList[2] : '';

		// check if this node represents just a single property
		// like (name, 0) set or (name2, [0, 1, 2]) set of {name: 0, name2: [0, 1, 2]}
		node.singleProperty = (numProperties === 1 && reader.getOffset() === endOffset) ? true : false;

		while (endOffset > reader.getOffset()) {

			const subNode = this.parseNode(reader, version);

			if (subNode !== null) this.parseSubNode(name, node, subNode);

		}

		node.propertyList = propertyList; // raw property list used by parent

		if (typeof id === 'number') node.id = id;
		if (attrName !== '') node.attrName = attrName;
		if (attrType !== '') node.attrType = attrType;
		if (name !== '') node.name = name;

		return node;

	}

	parseSubNode(name, node, subNode) {

		// special case: child node is single property
		if (subNode.singleProperty === true) {

			const value = subNode.propertyList[0];

			if (Array.isArray(value)) {

				node[subNode.name] = subNode;

				subNode.a = value;

			} else {

				node[subNode.name] = value;

			}

		} else if (name === 'Connections' && subNode.name === 'C') {

			const array = [];

			subNode.propertyList.forEach(function (property, i) {

				// first Connection is FBX type (OO, OP, etc.). We'll discard these
				if (i !== 0) array.push(property);

			});

			if (node.connections === undefined) {

				node.connections = [];

			}

			node.connections.push(array);

		} else if (subNode.name === 'Properties70') {

			const keys = Object.keys(subNode);

			keys.forEach(function (key) {

				node[key] = subNode[key];

			});

		} else if (name === 'Properties70' && subNode.name === 'P') {

			let innerPropName = subNode.propertyList[0];
			let innerPropType1 = subNode.propertyList[1];
			const innerPropType2 = subNode.propertyList[2];
			const innerPropFlag = subNode.propertyList[3];
			let innerPropValue;

			if (innerPropName.indexOf('Lcl ') === 0) innerPropName = innerPropName.replace('Lcl ', 'Lcl_');
			if (innerPropType1.indexOf('Lcl ') === 0) innerPropType1 = innerPropType1.replace('Lcl ', 'Lcl_');

			if (innerPropType1 === 'Color' || innerPropType1 === 'ColorRGB' || innerPropType1 === 'Vector' || innerPropType1 === 'Vector3D' || innerPropType1.indexOf('Lcl_') === 0) {

				innerPropValue = [
					subNode.propertyList[4],
					subNode.propertyList[5],
					subNode.propertyList[6]
				];

			} else {

				innerPropValue = subNode.propertyList[4];

			}

			// this will be copied to parent, see above
			node[innerPropName] = {

				'type': innerPropType1,
				'type2': innerPropType2,
				'flag': innerPropFlag,
				'value': innerPropValue

			};

		} else if (node[subNode.name] === undefined) {

			if (typeof subNode.id === 'number') {

				node[subNode.name] = {};
				node[subNode.name][subNode.id] = subNode;

			} else {

				node[subNode.name] = subNode;

			}

		} else {

			if (subNode.name === 'PoseNode') {

				if (!Array.isArray(node[subNode.name])) {

					node[subNode.name] = [node[subNode.name]];

				}

				node[subNode.name].push(subNode);

			} else if (node[subNode.name][subNode.id] === undefined) {

				node[subNode.name][subNode.id] = subNode;

			}

		}

	}

	parseProperty(reader) {

		const type = reader.getString(1);
		let length;

		switch (type) {

			case 'C':
				return reader.getBoolean();

			case 'D':
				return reader.getFloat64();

			case 'F':
				return reader.getFloat32();

			case 'I':
				return reader.getInt32();

			case 'L':
				return reader.getInt64();

			case 'R':
				length = reader.getUint32();
				return reader.getArrayBuffer(length);

			case 'S':
				length = reader.getUint32();
				return reader.getString(length);

			case 'Y':
				return reader.getInt16();

			case 'b':
			case 'c':
			case 'd':
			case 'f':
			case 'i':
			case 'l':

				const arrayLength = reader.getUint32();
				const encoding = reader.getUint32(); // 0: non-compressed, 1: compressed
				const compressedLength = reader.getUint32();

				if (encoding === 0) {

					switch (type) {

						case 'b':
						case 'c':
							return reader.getBooleanArray(arrayLength);

						case 'd':
							return reader.getFloat64Array(arrayLength);

						case 'f':
							return reader.getFloat32Array(arrayLength);

						case 'i':
							return reader.getInt32Array(arrayLength);

						case 'l':
							return reader.getInt64Array(arrayLength);

					}

				}

				const data = unzlibSync(new Uint8Array(reader.getArrayBuffer(compressedLength)));
				const reader2 = new BinaryReader(data.buffer);

				switch (type) {

					case 'b':
					case 'c':
						return reader2.getBooleanArray(arrayLength);

					case 'd':
						return reader2.getFloat64Array(arrayLength);

					case 'f':
						return reader2.getFloat32Array(arrayLength);

					case 'i':
						return reader2.getInt32Array(arrayLength);

					case 'l':
						return reader2.getInt64Array(arrayLength);

				}

				break; // cannot happen but is required by the DeepScan

			default:
				throw new Error('THREE.FBXLoader: Unknown property type ' + type);

		}

	}

}

class BinaryReader {

	constructor(buffer, littleEndian) {

		this.dv = new DataView(buffer);
		this.offset = 0;
		this.littleEndian = (littleEndian !== undefined) ? littleEndian : true;
		this._textDecoder = new TextDecoder();

	}

	getOffset() {

		return this.offset;

	}

	size() {

		return this.dv.buffer.byteLength;

	}

	skip(length) {

		this.offset += length;

	}

	// seems like true/false representation depends on exporter.
	// true: 1 or 'Y'(=0x59), false: 0 or 'T'(=0x54)
	// then sees LSB.
	getBoolean() {

		return (this.getUint8() & 1) === 1;

	}

	getBooleanArray(size) {

		const a = [];

		for (let i = 0; i < size; i++) {

			a.push(this.getBoolean());

		}

		return a;

	}

	getUint8() {

		const value = this.dv.getUint8(this.offset);
		this.offset += 1;
		return value;

	}

	getInt16() {

		const value = this.dv.getInt16(this.offset, this.littleEndian);
		this.offset += 2;
		return value;

	}

	getInt32() {

		const value = this.dv.getInt32(this.offset, this.littleEndian);
		this.offset += 4;
		return value;

	}

	getInt32Array(size) {

		const a = [];

		for (let i = 0; i < size; i++) {

			a.push(this.getInt32());

		}

		return a;

	}

	getUint32() {

		const value = this.dv.getUint32(this.offset, this.littleEndian);
		this.offset += 4;
		return value;

	}

	// JavaScript doesn't support 64-bit integer so calculate this here
	// 1 << 32 will return 1 so using multiply operation instead here.
	// There's a possibility that this method returns wrong value if the value
	// is out of the range between Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER.
	// TODO: safely handle 64-bit integer
	getInt64() {

		let low, high;

		if (this.littleEndian) {

			low = this.getUint32();
			high = this.getUint32();

		} else {

			high = this.getUint32();
			low = this.getUint32();

		}

		// calculate negative value
		if (high & 0x80000000) {

			high = ~high & 0xFFFFFFFF;
			low = ~low & 0xFFFFFFFF;

			if (low === 0xFFFFFFFF) high = (high + 1) & 0xFFFFFFFF;

			low = (low + 1) & 0xFFFFFFFF;

			return - (high * 0x100000000 + low);

		}

		return high * 0x100000000 + low;

	}

	getInt64Array(size) {

		const a = [];

		for (let i = 0; i < size; i++) {

			a.push(this.getInt64());

		}

		return a;

	}

	// Note: see getInt64() comment
	getUint64() {

		let low, high;

		if (this.littleEndian) {

			low = this.getUint32();
			high = this.getUint32();

		} else {

			high = this.getUint32();
			low = this.getUint32();

		}

		return high * 0x100000000 + low;

	}

	getFloat32() {

		const value = this.dv.getFloat32(this.offset, this.littleEndian);
		this.offset += 4;
		return value;

	}

	getFloat32Array(size) {

		const a = [];

		for (let i = 0; i < size; i++) {

			a.push(this.getFloat32());

		}

		return a;

	}

	getFloat64() {

		const value = this.dv.getFloat64(this.offset, this.littleEndian);
		this.offset += 8;
		return value;

	}

	getFloat64Array(size) {

		const a = [];

		for (let i = 0; i < size; i++) {

			a.push(this.getFloat64());

		}

		return a;

	}

	getArrayBuffer(size) {

		const value = this.dv.buffer.slice(this.offset, this.offset + size);
		this.offset += size;
		return value;

	}

	getString(size) {

		const start = this.offset;
		let a = new Uint8Array(this.dv.buffer, start, size);

		this.skip(size);

		const nullByte = a.indexOf(0);
		if (nullByte >= 0) a = new Uint8Array(this.dv.buffer, start, nullByte);

		return this._textDecoder.decode(a);

	}

}

// FBXTree holds a representation of the FBX data, returned by the TextParser ( FBX ASCII format)
// and BinaryParser( FBX Binary format)
class FBXTree {

	add(key, val) {

		this[key] = val;

	}

}

// ************** UTILITY FUNCTIONS **************

function isFbxFormatBinary(buffer) {

	const CORRECT = 'Kaydara\u0020FBX\u0020Binary\u0020\u0020\0';

	return buffer.byteLength >= CORRECT.length && CORRECT === convertArrayBufferToString(buffer, 0, CORRECT.length);

}

function isFbxFormatASCII(text) {

	const CORRECT = ['K', 'a', 'y', 'd', 'a', 'r', 'a', '\\', 'F', 'B', 'X', '\\', 'B', 'i', 'n', 'a', 'r', 'y', '\\', '\\'];

	let cursor = 0;

	function read(offset) {

		const result = text[offset - 1];
		text = text.slice(cursor + offset);
		cursor++;
		return result;

	}

	for (let i = 0; i < CORRECT.length; ++i) {

		const num = read(1);
		if (num === CORRECT[i]) {

			return false;

		}

	}

	return true;

}

function getFbxVersion(text) {

	const versionRegExp = /FBXVersion: (\d+)/;
	const match = text.match(versionRegExp);

	if (match) {

		const version = parseInt(match[1]);
		return version;

	}

	throw new Error('THREE.FBXLoader: Cannot find the version number for the file given.');

}

// Converts FBX ticks into real time seconds.
function convertFBXTimeToSeconds(time) {

	return time / 46186158000;

}

const dataArray = [];

// extracts the data from the correct position in the FBX array based on indexing type
function getData(polygonVertexIndex, polygonIndex, vertexIndex, infoObject) {

	let index;

	switch (infoObject.mappingType) {

		case 'ByPolygonVertex':
			index = polygonVertexIndex;
			break;
		case 'ByPolygon':
			index = polygonIndex;
			break;
		case 'ByVertice':
			index = vertexIndex;
			break;
		case 'AllSame':
			index = infoObject.indices[0];
			break;
		default:
			console.warn('THREE.FBXLoader: unknown attribute mapping type ' + infoObject.mappingType);

	}

	if (infoObject.referenceType === 'IndexToDirect') index = infoObject.indices[index];

	const from = index * infoObject.dataSize;
	const to = from + infoObject.dataSize;

	return slice(dataArray, infoObject.buffer, from, to);

}

const tempEuler = new Euler();
const tempVec = new Vector3();

// generate transformation from FBX transform data
// ref: https://help.autodesk.com/view/FBX/2017/ENU/?guid=__files_GUID_10CDD63C_79C1_4F2D_BB28_AD2BE65A02ED_htm
// ref: http://docs.autodesk.com/FBX/2014/ENU/FBX-SDK-Documentation/index.html?url=cpp_ref/_transformations_2main_8cxx-example.html,topicNumber=cpp_ref__transformations_2main_8cxx_example_htmlfc10a1e1-b18d-4e72-9dc0-70d0f1959f5e
function generateTransform(transformData) {

	const lTranslationM = new Matrix4();
	const lPreRotationM = new Matrix4();
	const lRotationM = new Matrix4();
	const lPostRotationM = new Matrix4();

	const lScalingM = new Matrix4();
	const lScalingPivotM = new Matrix4();
	const lScalingOffsetM = new Matrix4();
	const lRotationOffsetM = new Matrix4();
	const lRotationPivotM = new Matrix4();

	const lParentGX = new Matrix4();
	const lParentLX = new Matrix4();
	const lGlobalT = new Matrix4();

	const inheritType = (transformData.inheritType) ? transformData.inheritType : 0;

	if (transformData.translation) lTranslationM.setPosition(tempVec.fromArray(transformData.translation));

	if (transformData.preRotation) {

		const array = transformData.preRotation.map(MathUtils.degToRad);
		array.push(transformData.eulerOrder || Euler.DEFAULT_ORDER);
		lPreRotationM.makeRotationFromEuler(tempEuler.fromArray(array));

	}

	if (transformData.rotation) {

		const array = transformData.rotation.map(MathUtils.degToRad);
		array.push(transformData.eulerOrder || Euler.DEFAULT_ORDER);
		lRotationM.makeRotationFromEuler(tempEuler.fromArray(array));

	}

	if (transformData.postRotation) {

		const array = transformData.postRotation.map(MathUtils.degToRad);
		array.push(transformData.eulerOrder || Euler.DEFAULT_ORDER);
		lPostRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
		lPostRotationM.invert();

	}

	if (transformData.scale) lScalingM.scale(tempVec.fromArray(transformData.scale));

	// Pivots and offsets
	if (transformData.scalingOffset) lScalingOffsetM.setPosition(tempVec.fromArray(transformData.scalingOffset));
	if (transformData.scalingPivot) lScalingPivotM.setPosition(tempVec.fromArray(transformData.scalingPivot));
	if (transformData.rotationOffset) lRotationOffsetM.setPosition(tempVec.fromArray(transformData.rotationOffset));
	if (transformData.rotationPivot) lRotationPivotM.setPosition(tempVec.fromArray(transformData.rotationPivot));

	// parent transform
	if (transformData.parentMatrixWorld) {

		lParentLX.copy(transformData.parentMatrix);
		lParentGX.copy(transformData.parentMatrixWorld);

	}

	const lLRM = lPreRotationM.clone().multiply(lRotationM).multiply(lPostRotationM);
	// Global Rotation
	const lParentGRM = new Matrix4();
	lParentGRM.extractRotation(lParentGX);

	// Global Shear*Scaling
	const lParentTM = new Matrix4();
	lParentTM.copyPosition(lParentGX);

	const lParentGRSM = lParentTM.clone().invert().multiply(lParentGX);
	const lParentGSM = lParentGRM.clone().invert().multiply(lParentGRSM);
	const lLSM = lScalingM;

	const lGlobalRS = new Matrix4();

	if (inheritType === 0) {

		lGlobalRS.copy(lParentGRM).multiply(lLRM).multiply(lParentGSM).multiply(lLSM);

	} else if (inheritType === 1) {

		lGlobalRS.copy(lParentGRM).multiply(lParentGSM).multiply(lLRM).multiply(lLSM);

	} else {

		const lParentLSM = new Matrix4().scale(new Vector3().setFromMatrixScale(lParentLX));
		const lParentLSM_inv = lParentLSM.clone().invert();
		const lParentGSM_noLocal = lParentGSM.clone().multiply(lParentLSM_inv);

		lGlobalRS.copy(lParentGRM).multiply(lLRM).multiply(lParentGSM_noLocal).multiply(lLSM);

	}

	const lRotationPivotM_inv = lRotationPivotM.clone().invert();
	const lScalingPivotM_inv = lScalingPivotM.clone().invert();
	// Calculate the local transform matrix
	let lTransform = lTranslationM.clone().multiply(lRotationOffsetM).multiply(lRotationPivotM).multiply(lPreRotationM).multiply(lRotationM).multiply(lPostRotationM).multiply(lRotationPivotM_inv).multiply(lScalingOffsetM).multiply(lScalingPivotM).multiply(lScalingM).multiply(lScalingPivotM_inv);

	const lLocalTWithAllPivotAndOffsetInfo = new Matrix4().copyPosition(lTransform);

	const lGlobalTranslation = lParentGX.clone().multiply(lLocalTWithAllPivotAndOffsetInfo);
	lGlobalT.copyPosition(lGlobalTranslation);

	lTransform = lGlobalT.clone().multiply(lGlobalRS);

	// from global to local
	lTransform.premultiply(lParentGX.invert());

	return lTransform;

}

// Returns the three.js intrinsic Euler order corresponding to FBX extrinsic Euler order
// ref: http://help.autodesk.com/view/FBX/2017/ENU/?guid=__cpp_ref_class_fbx_euler_html
function getEulerOrder(order) {

	order = order || 0;

	const enums = [
		'ZYX', // -> XYZ extrinsic
		'YZX', // -> XZY extrinsic
		'XZY', // -> YZX extrinsic
		'ZXY', // -> YXZ extrinsic
		'YXZ', // -> ZXY extrinsic
		'XYZ', // -> ZYX extrinsic
		//'SphericXYZ', // not possible to support
	];

	if (order === 6) {

		console.warn('THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect.');
		return enums[0];

	}

	return enums[order];

}

// Parses comma separated list of numbers and returns them an array.
// Used internally by the TextParser
function parseNumberArray(value) {

	const array = value.split(',').map(function (val) {

		return parseFloat(val);

	});

	return array;

}

function convertArrayBufferToString(buffer, from, to) {

	if (from === undefined) from = 0;
	if (to === undefined) to = buffer.byteLength;

	return new TextDecoder().decode(new Uint8Array(buffer, from, to));

}

function append(a, b) {

	for (let i = 0, j = a.length, l = b.length; i < l; i++, j++) {

		a[j] = b[i];

	}

}

function slice(a, b, from, to) {

	for (let i = from, j = 0; i < to; i++, j++) {

		a[j] = b[i];

	}

	return a;

}

// inject array a2 into array a1 at index
function inject(a1, index, a2) {

	return a1.slice(0, index).concat(a2).concat(a1.slice(index));

}

// https://github.com/mrdoob/three.js/issues/5552
// http://en.wikipedia.org/wiki/RGBE_image_format

class RGBELoader extends DataTextureLoader {

	constructor(manager) {

		super(manager);

		this.type = HalfFloatType;

	}

	// adapted from http://www.graphics.cornell.edu/~bjw/rgbe.html

	parse(buffer) {

		const
			/* default error routine.  change this to change error handling */
			rgbe_read_error = 1,
			rgbe_write_error = 2,
			rgbe_format_error = 3,
			rgbe_memory_error = 4,
			rgbe_error = function (rgbe_error_code, msg) {

				switch (rgbe_error_code) {

					case rgbe_read_error: throw new Error('THREE.RGBELoader: Read Error: ' + (msg || ''));
					case rgbe_write_error: throw new Error('THREE.RGBELoader: Write Error: ' + (msg || ''));
					case rgbe_format_error: throw new Error('THREE.RGBELoader: Bad File Format: ' + (msg || ''));
					default:
					case rgbe_memory_error: throw new Error('THREE.RGBELoader: Memory Error: ' + (msg || ''));

				}

			},

			/* offsets to red, green, and blue components in a data (float) pixel */
			//RGBE_DATA_RED = 0,
			//RGBE_DATA_GREEN = 1,
			//RGBE_DATA_BLUE = 2,

			/* number of floats per pixel, use 4 since stored in rgba image format */
			//RGBE_DATA_SIZE = 4,

			/* flags indicating which fields in an rgbe_header_info are valid */
			RGBE_VALID_PROGRAMTYPE = 1,
			RGBE_VALID_FORMAT = 2,
			RGBE_VALID_DIMENSIONS = 4,

			NEWLINE = '\n',

			fgets = function (buffer, lineLimit, consume) {

				const chunkSize = 128;

				lineLimit = !lineLimit ? 1024 : lineLimit;
				let p = buffer.pos,
					i = - 1, len = 0, s = '',
					chunk = String.fromCharCode.apply(null, new Uint16Array(buffer.subarray(p, p + chunkSize)));

				while ((0 > (i = chunk.indexOf(NEWLINE))) && (len < lineLimit) && (p < buffer.byteLength)) {

					s += chunk; len += chunk.length;
					p += chunkSize;
					chunk += String.fromCharCode.apply(null, new Uint16Array(buffer.subarray(p, p + chunkSize)));

				}

				if (- 1 < i) {

					/*for (i=l-1; i>=0; i--) {
						byteCode = m.charCodeAt(i);
						if (byteCode > 0x7f && byteCode <= 0x7ff) byteLen++;
						else if (byteCode > 0x7ff && byteCode <= 0xffff) byteLen += 2;
						if (byteCode >= 0xDC00 && byteCode <= 0xDFFF) i--; //trail surrogate
					}*/
					if (false !== consume) buffer.pos += len + i + 1;
					return s + chunk.slice(0, i);

				}

				return false;

			},

			/* minimal header reading.  modify if you want to parse more information */
			RGBE_ReadHeader = function (buffer) {


				// regexes to parse header info fields
				const magic_token_re = /^#\?(\S+)/,
					gamma_re = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,
					exposure_re = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,
					format_re = /^\s*FORMAT=(\S+)\s*$/,
					dimensions_re = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,

					// RGBE format header struct
					header = {

						valid: 0, /* indicate which fields are valid */

						string: '', /* the actual header string */

						comments: '', /* comments found in header */

						programtype: 'RGBE', /* listed at beginning of file to identify it after "#?". defaults to "RGBE" */

						format: '', /* RGBE format, default 32-bit_rle_rgbe */

						gamma: 1.0, /* image has already been gamma corrected with given gamma. defaults to 1.0 (no correction) */

						exposure: 1.0, /* a value of 1.0 in an image corresponds to <exposure> watts/steradian/m^2. defaults to 1.0 */

						width: 0, height: 0 /* image dimensions, width/height */

					};

				let line, match;

				if (buffer.pos >= buffer.byteLength || !(line = fgets(buffer))) {

					rgbe_error(rgbe_read_error, 'no header found');

				}

				/* if you want to require the magic token then uncomment the next line */
				if (!(match = line.match(magic_token_re))) {

					rgbe_error(rgbe_format_error, 'bad initial token');

				}

				header.valid |= RGBE_VALID_PROGRAMTYPE;
				header.programtype = match[1];
				header.string += line + '\n';

				while (true) {

					line = fgets(buffer);
					if (false === line) break;
					header.string += line + '\n';

					if ('#' === line.charAt(0)) {

						header.comments += line + '\n';
						continue; // comment line

					}

					if (match = line.match(gamma_re)) {

						header.gamma = parseFloat(match[1]);

					}

					if (match = line.match(exposure_re)) {

						header.exposure = parseFloat(match[1]);

					}

					if (match = line.match(format_re)) {

						header.valid |= RGBE_VALID_FORMAT;
						header.format = match[1];//'32-bit_rle_rgbe';

					}

					if (match = line.match(dimensions_re)) {

						header.valid |= RGBE_VALID_DIMENSIONS;
						header.height = parseInt(match[1], 10);
						header.width = parseInt(match[2], 10);

					}

					if ((header.valid & RGBE_VALID_FORMAT) && (header.valid & RGBE_VALID_DIMENSIONS)) break;

				}

				if (!(header.valid & RGBE_VALID_FORMAT)) {

					rgbe_error(rgbe_format_error, 'missing format specifier');

				}

				if (!(header.valid & RGBE_VALID_DIMENSIONS)) {

					rgbe_error(rgbe_format_error, 'missing image size specifier');

				}

				return header;

			},

			RGBE_ReadPixels_RLE = function (buffer, w, h) {

				const scanline_width = w;

				if (
					// run length encoding is not allowed so read flat
					((scanline_width < 8) || (scanline_width > 0x7fff)) ||
					// this file is not run length encoded
					((2 !== buffer[0]) || (2 !== buffer[1]) || (buffer[2] & 0x80))
				) {

					// return the flat buffer
					return new Uint8Array(buffer);

				}

				if (scanline_width !== ((buffer[2] << 8) | buffer[3])) {

					rgbe_error(rgbe_format_error, 'wrong scanline width');

				}

				const data_rgba = new Uint8Array(4 * w * h);

				if (!data_rgba.length) {

					rgbe_error(rgbe_memory_error, 'unable to allocate buffer space');

				}

				let offset = 0, pos = 0;

				const ptr_end = 4 * scanline_width;
				const rgbeStart = new Uint8Array(4);
				const scanline_buffer = new Uint8Array(ptr_end);
				let num_scanlines = h;

				// read in each successive scanline
				while ((num_scanlines > 0) && (pos < buffer.byteLength)) {

					if (pos + 4 > buffer.byteLength) {

						rgbe_error(rgbe_read_error);

					}

					rgbeStart[0] = buffer[pos++];
					rgbeStart[1] = buffer[pos++];
					rgbeStart[2] = buffer[pos++];
					rgbeStart[3] = buffer[pos++];

					if ((2 != rgbeStart[0]) || (2 != rgbeStart[1]) || (((rgbeStart[2] << 8) | rgbeStart[3]) != scanline_width)) {

						rgbe_error(rgbe_format_error, 'bad rgbe scanline format');

					}

					// read each of the four channels for the scanline into the buffer
					// first red, then green, then blue, then exponent
					let ptr = 0, count;

					while ((ptr < ptr_end) && (pos < buffer.byteLength)) {

						count = buffer[pos++];
						const isEncodedRun = count > 128;
						if (isEncodedRun) count -= 128;

						if ((0 === count) || (ptr + count > ptr_end)) {

							rgbe_error(rgbe_format_error, 'bad scanline data');

						}

						if (isEncodedRun) {

							// a (encoded) run of the same value
							const byteValue = buffer[pos++];
							for (let i = 0; i < count; i++) {

								scanline_buffer[ptr++] = byteValue;

							}
							//ptr += count;

						} else {

							// a literal-run
							scanline_buffer.set(buffer.subarray(pos, pos + count), ptr);
							ptr += count; pos += count;

						}

					}


					// now convert data from buffer into rgba
					// first red, then green, then blue, then exponent (alpha)
					const l = scanline_width; //scanline_buffer.byteLength;
					for (let i = 0; i < l; i++) {

						let off = 0;
						data_rgba[offset] = scanline_buffer[i + off];
						off += scanline_width; //1;
						data_rgba[offset + 1] = scanline_buffer[i + off];
						off += scanline_width; //1;
						data_rgba[offset + 2] = scanline_buffer[i + off];
						off += scanline_width; //1;
						data_rgba[offset + 3] = scanline_buffer[i + off];
						offset += 4;

					}

					num_scanlines--;

				}

				return data_rgba;

			};

		const RGBEByteToRGBFloat = function (sourceArray, sourceOffset, destArray, destOffset) {

			const e = sourceArray[sourceOffset + 3];
			const scale = Math.pow(2.0, e - 128.0) / 255.0;

			destArray[destOffset + 0] = sourceArray[sourceOffset + 0] * scale;
			destArray[destOffset + 1] = sourceArray[sourceOffset + 1] * scale;
			destArray[destOffset + 2] = sourceArray[sourceOffset + 2] * scale;
			destArray[destOffset + 3] = 1;

		};

		const RGBEByteToRGBHalf = function (sourceArray, sourceOffset, destArray, destOffset) {

			const e = sourceArray[sourceOffset + 3];
			const scale = Math.pow(2.0, e - 128.0) / 255.0;

			// clamping to 65504, the maximum representable value in float16
			destArray[destOffset + 0] = DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 0] * scale, 65504));
			destArray[destOffset + 1] = DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 1] * scale, 65504));
			destArray[destOffset + 2] = DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 2] * scale, 65504));
			destArray[destOffset + 3] = DataUtils.toHalfFloat(1);

		};

		const byteArray = new Uint8Array(buffer);
		byteArray.pos = 0;
		const rgbe_header_info = RGBE_ReadHeader(byteArray);

		const w = rgbe_header_info.width,
			h = rgbe_header_info.height,
			image_rgba_data = RGBE_ReadPixels_RLE(byteArray.subarray(byteArray.pos), w, h);


		let data, type;
		let numElements;

		switch (this.type) {

			case FloatType:

				numElements = image_rgba_data.length / 4;
				const floatArray = new Float32Array(numElements * 4);

				for (let j = 0; j < numElements; j++) {

					RGBEByteToRGBFloat(image_rgba_data, j * 4, floatArray, j * 4);

				}

				data = floatArray;
				type = FloatType;
				break;

			case HalfFloatType:

				numElements = image_rgba_data.length / 4;
				const halfArray = new Uint16Array(numElements * 4);

				for (let j = 0; j < numElements; j++) {

					RGBEByteToRGBHalf(image_rgba_data, j * 4, halfArray, j * 4);

				}

				data = halfArray;
				type = HalfFloatType;
				break;

			default:

				throw new Error('THREE.RGBELoader: unsupported type: ', this.type);

		}

		return {
			width: w, height: h,
			data: data,
			header: rgbe_header_info.string,
			gamma: rgbe_header_info.gamma,
			exposure: rgbe_header_info.exposure,
			type: type
		};

	}

	setDataType(value) {

		this.type = value;
		return this;

	}

	load(url, onLoad, onProgress, onError) {

		function onLoadCallback(texture, texData) {

			switch (texture.type) {

				case FloatType:
				case HalfFloatType:

					texture.colorSpace = LinearSRGBColorSpace;
					texture.minFilter = LinearFilter;
					texture.magFilter = LinearFilter;
					texture.generateMipmaps = false;
					texture.flipY = true;

					break;

			}

			if (onLoad) onLoad(texture, texData);

		}

		return super.load(url, onLoadCallback, onProgress, onError);

	}

}

/**
 * OpenEXR loader currently supports uncompressed, ZIP(S), RLE, PIZ and DWA/B compression.
 * Supports reading as UnsignedByte, HalfFloat and Float type data texture.
 *
 * Referred to the original Industrial Light & Magic OpenEXR implementation and the TinyEXR / Syoyo Fujita
 * implementation, so I have preserved their copyright notices.
 */

// /*
// Copyright (c) 2014 - 2017, Syoyo Fujita
// All rights reserved.

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Syoyo Fujita nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// */

// // TinyEXR contains some OpenEXR code, which is licensed under ------------

// ///////////////////////////////////////////////////////////////////////////
// //
// // Copyright (c) 2002, Industrial Light & Magic, a division of Lucas
// // Digital Ltd. LLC
// //
// // All rights reserved.
// //
// // Redistribution and use in source and binary forms, with or without
// // modification, are permitted provided that the following conditions are
// // met:
// // *       Redistributions of source code must retain the above copyright
// // notice, this list of conditions and the following disclaimer.
// // *       Redistributions in binary form must reproduce the above
// // copyright notice, this list of conditions and the following disclaimer
// // in the documentation and/or other materials provided with the
// // distribution.
// // *       Neither the name of Industrial Light & Magic nor the names of
// // its contributors may be used to endorse or promote products derived
// // from this software without specific prior written permission.
// //
// // THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// // "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// // LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// // A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// // OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// // SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// // LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// // DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// // THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// // (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// // OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// //
// ///////////////////////////////////////////////////////////////////////////

// // End of OpenEXR license -------------------------------------------------

class EXRLoader extends DataTextureLoader {

	constructor(manager) {

		super(manager);

		this.type = HalfFloatType;

	}

	parse(buffer) {

		const USHORT_RANGE = (1 << 16);
		const BITMAP_SIZE = (USHORT_RANGE >> 3);

		const HUF_ENCBITS = 16; // literal (value) bit length
		const HUF_DECBITS = 14; // decoding bit size (>= 8)

		const HUF_ENCSIZE = (1 << HUF_ENCBITS) + 1; // encoding table size
		const HUF_DECSIZE = 1 << HUF_DECBITS; // decoding table size
		const HUF_DECMASK = HUF_DECSIZE - 1;

		const NBITS = 16;
		const A_OFFSET = 1 << (NBITS - 1);
		const MOD_MASK = (1 << NBITS) - 1;

		const SHORT_ZEROCODE_RUN = 59;
		const LONG_ZEROCODE_RUN = 63;
		const SHORTEST_LONG_RUN = 2 + LONG_ZEROCODE_RUN - SHORT_ZEROCODE_RUN;

		const ULONG_SIZE = 8;
		const FLOAT32_SIZE = 4;
		const INT32_SIZE = 4;
		const INT16_SIZE = 2;
		const INT8_SIZE = 1;

		const STATIC_HUFFMAN = 0;
		const DEFLATE = 1;

		const UNKNOWN = 0;
		const LOSSY_DCT = 1;
		const RLE = 2;

		const logBase = Math.pow(2.7182818, 2.2);

		function reverseLutFromBitmap(bitmap, lut) {

			let k = 0;

			for (let i = 0; i < USHORT_RANGE; ++i) {

				if ((i == 0) || (bitmap[i >> 3] & (1 << (i & 7)))) {

					lut[k++] = i;

				}

			}

			const n = k - 1;

			while (k < USHORT_RANGE) lut[k++] = 0;

			return n;

		}

		function hufClearDecTable(hdec) {

			for (let i = 0; i < HUF_DECSIZE; i++) {

				hdec[i] = {};
				hdec[i].len = 0;
				hdec[i].lit = 0;
				hdec[i].p = null;

			}

		}

		const getBitsReturn = { l: 0, c: 0, lc: 0 };

		function getBits(nBits, c, lc, uInt8Array, inOffset) {

			while (lc < nBits) {

				c = (c << 8) | parseUint8Array(uInt8Array, inOffset);
				lc += 8;

			}

			lc -= nBits;

			getBitsReturn.l = (c >> lc) & ((1 << nBits) - 1);
			getBitsReturn.c = c;
			getBitsReturn.lc = lc;

		}

		const hufTableBuffer = new Array(59);

		function hufCanonicalCodeTable(hcode) {

			for (let i = 0; i <= 58; ++i) hufTableBuffer[i] = 0;
			for (let i = 0; i < HUF_ENCSIZE; ++i) hufTableBuffer[hcode[i]] += 1;

			let c = 0;

			for (let i = 58; i > 0; --i) {

				const nc = ((c + hufTableBuffer[i]) >> 1);
				hufTableBuffer[i] = c;
				c = nc;

			}

			for (let i = 0; i < HUF_ENCSIZE; ++i) {

				const l = hcode[i];
				if (l > 0) hcode[i] = l | (hufTableBuffer[l]++ << 6);

			}

		}

		function hufUnpackEncTable(uInt8Array, inOffset, ni, im, iM, hcode) {

			const p = inOffset;
			let c = 0;
			let lc = 0;

			for (; im <= iM; im++) {

				if (p.value - inOffset.value > ni) return false;

				getBits(6, c, lc, uInt8Array, p);

				const l = getBitsReturn.l;
				c = getBitsReturn.c;
				lc = getBitsReturn.lc;

				hcode[im] = l;

				if (l == LONG_ZEROCODE_RUN) {

					if (p.value - inOffset.value > ni) {

						throw new Error('Something wrong with hufUnpackEncTable');

					}

					getBits(8, c, lc, uInt8Array, p);

					let zerun = getBitsReturn.l + SHORTEST_LONG_RUN;
					c = getBitsReturn.c;
					lc = getBitsReturn.lc;

					if (im + zerun > iM + 1) {

						throw new Error('Something wrong with hufUnpackEncTable');

					}

					while (zerun--) hcode[im++] = 0;

					im--;

				} else if (l >= SHORT_ZEROCODE_RUN) {

					let zerun = l - SHORT_ZEROCODE_RUN + 2;

					if (im + zerun > iM + 1) {

						throw new Error('Something wrong with hufUnpackEncTable');

					}

					while (zerun--) hcode[im++] = 0;

					im--;

				}

			}

			hufCanonicalCodeTable(hcode);

		}

		function hufLength(code) {

			return code & 63;

		}

		function hufCode(code) {

			return code >> 6;

		}

		function hufBuildDecTable(hcode, im, iM, hdecod) {

			for (; im <= iM; im++) {

				const c = hufCode(hcode[im]);
				const l = hufLength(hcode[im]);

				if (c >> l) {

					throw new Error('Invalid table entry');

				}

				if (l > HUF_DECBITS) {

					const pl = hdecod[(c >> (l - HUF_DECBITS))];

					if (pl.len) {

						throw new Error('Invalid table entry');

					}

					pl.lit++;

					if (pl.p) {

						const p = pl.p;
						pl.p = new Array(pl.lit);

						for (let i = 0; i < pl.lit - 1; ++i) {

							pl.p[i] = p[i];

						}

					} else {

						pl.p = new Array(1);

					}

					pl.p[pl.lit - 1] = im;

				} else if (l) {

					let plOffset = 0;

					for (let i = 1 << (HUF_DECBITS - l); i > 0; i--) {

						const pl = hdecod[(c << (HUF_DECBITS - l)) + plOffset];

						if (pl.len || pl.p) {

							throw new Error('Invalid table entry');

						}

						pl.len = l;
						pl.lit = im;

						plOffset++;

					}

				}

			}

			return true;

		}

		const getCharReturn = { c: 0, lc: 0 };

		function getChar(c, lc, uInt8Array, inOffset) {

			c = (c << 8) | parseUint8Array(uInt8Array, inOffset);
			lc += 8;

			getCharReturn.c = c;
			getCharReturn.lc = lc;

		}

		const getCodeReturn = { c: 0, lc: 0 };

		function getCode(po, rlc, c, lc, uInt8Array, inOffset, outBuffer, outBufferOffset, outBufferEndOffset) {

			if (po == rlc) {

				if (lc < 8) {

					getChar(c, lc, uInt8Array, inOffset);
					c = getCharReturn.c;
					lc = getCharReturn.lc;

				}

				lc -= 8;

				let cs = (c >> lc);
				cs = new Uint8Array([cs])[0];

				if (outBufferOffset.value + cs > outBufferEndOffset) {

					return false;

				}

				const s = outBuffer[outBufferOffset.value - 1];

				while (cs-- > 0) {

					outBuffer[outBufferOffset.value++] = s;

				}

			} else if (outBufferOffset.value < outBufferEndOffset) {

				outBuffer[outBufferOffset.value++] = po;

			} else {

				return false;

			}

			getCodeReturn.c = c;
			getCodeReturn.lc = lc;

		}

		function UInt16(value) {

			return (value & 0xFFFF);

		}

		function Int16(value) {

			const ref = UInt16(value);
			return (ref > 0x7FFF) ? ref - 0x10000 : ref;

		}

		const wdec14Return = { a: 0, b: 0 };

		function wdec14(l, h) {

			const ls = Int16(l);
			const hs = Int16(h);

			const hi = hs;
			const ai = ls + (hi & 1) + (hi >> 1);

			const as = ai;
			const bs = ai - hi;

			wdec14Return.a = as;
			wdec14Return.b = bs;

		}

		function wdec16(l, h) {

			const m = UInt16(l);
			const d = UInt16(h);

			const bb = (m - (d >> 1)) & MOD_MASK;
			const aa = (d + bb - A_OFFSET) & MOD_MASK;

			wdec14Return.a = aa;
			wdec14Return.b = bb;

		}

		function wav2Decode(buffer, j, nx, ox, ny, oy, mx) {

			const w14 = mx < (1 << 14);
			const n = (nx > ny) ? ny : nx;
			let p = 1;
			let p2;
			let py;

			while (p <= n) p <<= 1;

			p >>= 1;
			p2 = p;
			p >>= 1;

			while (p >= 1) {

				py = 0;
				const ey = py + oy * (ny - p2);
				const oy1 = oy * p;
				const oy2 = oy * p2;
				const ox1 = ox * p;
				const ox2 = ox * p2;
				let i00, i01, i10, i11;

				for (; py <= ey; py += oy2) {

					let px = py;
					const ex = py + ox * (nx - p2);

					for (; px <= ex; px += ox2) {

						const p01 = px + ox1;
						const p10 = px + oy1;
						const p11 = p10 + ox1;

						if (w14) {

							wdec14(buffer[px + j], buffer[p10 + j]);

							i00 = wdec14Return.a;
							i10 = wdec14Return.b;

							wdec14(buffer[p01 + j], buffer[p11 + j]);

							i01 = wdec14Return.a;
							i11 = wdec14Return.b;

							wdec14(i00, i01);

							buffer[px + j] = wdec14Return.a;
							buffer[p01 + j] = wdec14Return.b;

							wdec14(i10, i11);

							buffer[p10 + j] = wdec14Return.a;
							buffer[p11 + j] = wdec14Return.b;

						} else {

							wdec16(buffer[px + j], buffer[p10 + j]);

							i00 = wdec14Return.a;
							i10 = wdec14Return.b;

							wdec16(buffer[p01 + j], buffer[p11 + j]);

							i01 = wdec14Return.a;
							i11 = wdec14Return.b;

							wdec16(i00, i01);

							buffer[px + j] = wdec14Return.a;
							buffer[p01 + j] = wdec14Return.b;

							wdec16(i10, i11);

							buffer[p10 + j] = wdec14Return.a;
							buffer[p11 + j] = wdec14Return.b;


						}

					}

					if (nx & p) {

						const p10 = px + oy1;

						if (w14)
							wdec14(buffer[px + j], buffer[p10 + j]);
						else
							wdec16(buffer[px + j], buffer[p10 + j]);

						i00 = wdec14Return.a;
						buffer[p10 + j] = wdec14Return.b;

						buffer[px + j] = i00;

					}

				}

				if (ny & p) {

					let px = py;
					const ex = py + ox * (nx - p2);

					for (; px <= ex; px += ox2) {

						const p01 = px + ox1;

						if (w14)
							wdec14(buffer[px + j], buffer[p01 + j]);
						else
							wdec16(buffer[px + j], buffer[p01 + j]);

						i00 = wdec14Return.a;
						buffer[p01 + j] = wdec14Return.b;

						buffer[px + j] = i00;

					}

				}

				p2 = p;
				p >>= 1;

			}

			return py;

		}

		function hufDecode(encodingTable, decodingTable, uInt8Array, inOffset, ni, rlc, no, outBuffer, outOffset) {

			let c = 0;
			let lc = 0;
			const outBufferEndOffset = no;
			const inOffsetEnd = Math.trunc(inOffset.value + (ni + 7) / 8);

			while (inOffset.value < inOffsetEnd) {

				getChar(c, lc, uInt8Array, inOffset);

				c = getCharReturn.c;
				lc = getCharReturn.lc;

				while (lc >= HUF_DECBITS) {

					const index = (c >> (lc - HUF_DECBITS)) & HUF_DECMASK;
					const pl = decodingTable[index];

					if (pl.len) {

						lc -= pl.len;

						getCode(pl.lit, rlc, c, lc, uInt8Array, inOffset, outBuffer, outOffset, outBufferEndOffset);

						c = getCodeReturn.c;
						lc = getCodeReturn.lc;

					} else {

						if (!pl.p) {

							throw new Error('hufDecode issues');

						}

						let j;

						for (j = 0; j < pl.lit; j++) {

							const l = hufLength(encodingTable[pl.p[j]]);

							while (lc < l && inOffset.value < inOffsetEnd) {

								getChar(c, lc, uInt8Array, inOffset);

								c = getCharReturn.c;
								lc = getCharReturn.lc;

							}

							if (lc >= l) {

								if (hufCode(encodingTable[pl.p[j]]) == ((c >> (lc - l)) & ((1 << l) - 1))) {

									lc -= l;

									getCode(pl.p[j], rlc, c, lc, uInt8Array, inOffset, outBuffer, outOffset, outBufferEndOffset);

									c = getCodeReturn.c;
									lc = getCodeReturn.lc;

									break;

								}

							}

						}

						if (j == pl.lit) {

							throw new Error('hufDecode issues');

						}

					}

				}

			}

			const i = (8 - ni) & 7;

			c >>= i;
			lc -= i;

			while (lc > 0) {

				const pl = decodingTable[(c << (HUF_DECBITS - lc)) & HUF_DECMASK];

				if (pl.len) {

					lc -= pl.len;

					getCode(pl.lit, rlc, c, lc, uInt8Array, inOffset, outBuffer, outOffset, outBufferEndOffset);

					c = getCodeReturn.c;
					lc = getCodeReturn.lc;

				} else {

					throw new Error('hufDecode issues');

				}

			}

			return true;

		}

		function hufUncompress(uInt8Array, inDataView, inOffset, nCompressed, outBuffer, nRaw) {

			const outOffset = { value: 0 };
			const initialInOffset = inOffset.value;

			const im = parseUint32(inDataView, inOffset);
			const iM = parseUint32(inDataView, inOffset);

			inOffset.value += 4;

			const nBits = parseUint32(inDataView, inOffset);

			inOffset.value += 4;

			if (im < 0 || im >= HUF_ENCSIZE || iM < 0 || iM >= HUF_ENCSIZE) {

				throw new Error('Something wrong with HUF_ENCSIZE');

			}

			const freq = new Array(HUF_ENCSIZE);
			const hdec = new Array(HUF_DECSIZE);

			hufClearDecTable(hdec);

			const ni = nCompressed - (inOffset.value - initialInOffset);

			hufUnpackEncTable(uInt8Array, inOffset, ni, im, iM, freq);

			if (nBits > 8 * (nCompressed - (inOffset.value - initialInOffset))) {

				throw new Error('Something wrong with hufUncompress');

			}

			hufBuildDecTable(freq, im, iM, hdec);

			hufDecode(freq, hdec, uInt8Array, inOffset, nBits, iM, nRaw, outBuffer, outOffset);

		}

		function applyLut(lut, data, nData) {

			for (let i = 0; i < nData; ++i) {

				data[i] = lut[data[i]];

			}

		}

		function predictor(source) {

			for (let t = 1; t < source.length; t++) {

				const d = source[t - 1] + source[t] - 128;
				source[t] = d;

			}

		}

		function interleaveScalar(source, out) {

			let t1 = 0;
			let t2 = Math.floor((source.length + 1) / 2);
			let s = 0;
			const stop = source.length - 1;

			while (true) {

				if (s > stop) break;
				out[s++] = source[t1++];

				if (s > stop) break;
				out[s++] = source[t2++];

			}

		}

		function decodeRunLength(source) {

			let size = source.byteLength;
			const out = new Array();
			let p = 0;

			const reader = new DataView(source);

			while (size > 0) {

				const l = reader.getInt8(p++);

				if (l < 0) {

					const count = - l;
					size -= count + 1;

					for (let i = 0; i < count; i++) {

						out.push(reader.getUint8(p++));

					}


				} else {

					const count = l;
					size -= 2;

					const value = reader.getUint8(p++);

					for (let i = 0; i < count + 1; i++) {

						out.push(value);

					}

				}

			}

			return out;

		}

		function lossyDctDecode(cscSet, rowPtrs, channelData, acBuffer, dcBuffer, outBuffer) {

			let dataView = new DataView(outBuffer.buffer);

			const width = channelData[cscSet.idx[0]].width;
			const height = channelData[cscSet.idx[0]].height;

			const numComp = 3;

			const numFullBlocksX = Math.floor(width / 8.0);
			const numBlocksX = Math.ceil(width / 8.0);
			const numBlocksY = Math.ceil(height / 8.0);
			const leftoverX = width - (numBlocksX - 1) * 8;
			const leftoverY = height - (numBlocksY - 1) * 8;

			const currAcComp = { value: 0 };
			const currDcComp = new Array(numComp);
			const dctData = new Array(numComp);
			const halfZigBlock = new Array(numComp);
			const rowBlock = new Array(numComp);
			const rowOffsets = new Array(numComp);

			for (let comp = 0; comp < numComp; ++comp) {

				rowOffsets[comp] = rowPtrs[cscSet.idx[comp]];
				currDcComp[comp] = (comp < 1) ? 0 : currDcComp[comp - 1] + numBlocksX * numBlocksY;
				dctData[comp] = new Float32Array(64);
				halfZigBlock[comp] = new Uint16Array(64);
				rowBlock[comp] = new Uint16Array(numBlocksX * 64);

			}

			for (let blocky = 0; blocky < numBlocksY; ++blocky) {

				let maxY = 8;

				if (blocky == numBlocksY - 1)
					maxY = leftoverY;

				let maxX = 8;

				for (let blockx = 0; blockx < numBlocksX; ++blockx) {

					if (blockx == numBlocksX - 1)
						maxX = leftoverX;

					for (let comp = 0; comp < numComp; ++comp) {

						halfZigBlock[comp].fill(0);

						// set block DC component
						halfZigBlock[comp][0] = dcBuffer[currDcComp[comp]++];
						// set block AC components
						unRleAC(currAcComp, acBuffer, halfZigBlock[comp]);

						// UnZigZag block to float
						unZigZag(halfZigBlock[comp], dctData[comp]);
						// decode float dct
						dctInverse(dctData[comp]);

					}

					{

						csc709Inverse(dctData);

					}

					for (let comp = 0; comp < numComp; ++comp) {

						convertToHalf(dctData[comp], rowBlock[comp], blockx * 64);

					}

				} // blockx

				let offset = 0;

				for (let comp = 0; comp < numComp; ++comp) {

					const type = channelData[cscSet.idx[comp]].type;

					for (let y = 8 * blocky; y < 8 * blocky + maxY; ++y) {

						offset = rowOffsets[comp][y];

						for (let blockx = 0; blockx < numFullBlocksX; ++blockx) {

							const src = blockx * 64 + ((y & 0x7) * 8);

							dataView.setUint16(offset + 0 * INT16_SIZE * type, rowBlock[comp][src + 0], true);
							dataView.setUint16(offset + 1 * INT16_SIZE * type, rowBlock[comp][src + 1], true);
							dataView.setUint16(offset + 2 * INT16_SIZE * type, rowBlock[comp][src + 2], true);
							dataView.setUint16(offset + 3 * INT16_SIZE * type, rowBlock[comp][src + 3], true);

							dataView.setUint16(offset + 4 * INT16_SIZE * type, rowBlock[comp][src + 4], true);
							dataView.setUint16(offset + 5 * INT16_SIZE * type, rowBlock[comp][src + 5], true);
							dataView.setUint16(offset + 6 * INT16_SIZE * type, rowBlock[comp][src + 6], true);
							dataView.setUint16(offset + 7 * INT16_SIZE * type, rowBlock[comp][src + 7], true);

							offset += 8 * INT16_SIZE * type;

						}

					}

					// handle partial X blocks
					if (numFullBlocksX != numBlocksX) {

						for (let y = 8 * blocky; y < 8 * blocky + maxY; ++y) {

							const offset = rowOffsets[comp][y] + 8 * numFullBlocksX * INT16_SIZE * type;
							const src = numFullBlocksX * 64 + ((y & 0x7) * 8);

							for (let x = 0; x < maxX; ++x) {

								dataView.setUint16(offset + x * INT16_SIZE * type, rowBlock[comp][src + x], true);

							}

						}

					}

				} // comp

			} // blocky

			const halfRow = new Uint16Array(width);
			dataView = new DataView(outBuffer.buffer);

			// convert channels back to float, if needed
			for (let comp = 0; comp < numComp; ++comp) {

				channelData[cscSet.idx[comp]].decoded = true;
				const type = channelData[cscSet.idx[comp]].type;

				if (channelData[comp].type != 2) continue;

				for (let y = 0; y < height; ++y) {

					const offset = rowOffsets[comp][y];

					for (let x = 0; x < width; ++x) {

						halfRow[x] = dataView.getUint16(offset + x * INT16_SIZE * type, true);

					}

					for (let x = 0; x < width; ++x) {

						dataView.setFloat32(offset + x * INT16_SIZE * type, decodeFloat16(halfRow[x]), true);

					}

				}

			}

		}

		function unRleAC(currAcComp, acBuffer, halfZigBlock) {

			let acValue;
			let dctComp = 1;

			while (dctComp < 64) {

				acValue = acBuffer[currAcComp.value];

				if (acValue == 0xff00) {

					dctComp = 64;

				} else if (acValue >> 8 == 0xff) {

					dctComp += acValue & 0xff;

				} else {

					halfZigBlock[dctComp] = acValue;
					dctComp++;

				}

				currAcComp.value++;

			}

		}

		function unZigZag(src, dst) {

			dst[0] = decodeFloat16(src[0]);
			dst[1] = decodeFloat16(src[1]);
			dst[2] = decodeFloat16(src[5]);
			dst[3] = decodeFloat16(src[6]);
			dst[4] = decodeFloat16(src[14]);
			dst[5] = decodeFloat16(src[15]);
			dst[6] = decodeFloat16(src[27]);
			dst[7] = decodeFloat16(src[28]);
			dst[8] = decodeFloat16(src[2]);
			dst[9] = decodeFloat16(src[4]);

			dst[10] = decodeFloat16(src[7]);
			dst[11] = decodeFloat16(src[13]);
			dst[12] = decodeFloat16(src[16]);
			dst[13] = decodeFloat16(src[26]);
			dst[14] = decodeFloat16(src[29]);
			dst[15] = decodeFloat16(src[42]);
			dst[16] = decodeFloat16(src[3]);
			dst[17] = decodeFloat16(src[8]);
			dst[18] = decodeFloat16(src[12]);
			dst[19] = decodeFloat16(src[17]);

			dst[20] = decodeFloat16(src[25]);
			dst[21] = decodeFloat16(src[30]);
			dst[22] = decodeFloat16(src[41]);
			dst[23] = decodeFloat16(src[43]);
			dst[24] = decodeFloat16(src[9]);
			dst[25] = decodeFloat16(src[11]);
			dst[26] = decodeFloat16(src[18]);
			dst[27] = decodeFloat16(src[24]);
			dst[28] = decodeFloat16(src[31]);
			dst[29] = decodeFloat16(src[40]);

			dst[30] = decodeFloat16(src[44]);
			dst[31] = decodeFloat16(src[53]);
			dst[32] = decodeFloat16(src[10]);
			dst[33] = decodeFloat16(src[19]);
			dst[34] = decodeFloat16(src[23]);
			dst[35] = decodeFloat16(src[32]);
			dst[36] = decodeFloat16(src[39]);
			dst[37] = decodeFloat16(src[45]);
			dst[38] = decodeFloat16(src[52]);
			dst[39] = decodeFloat16(src[54]);

			dst[40] = decodeFloat16(src[20]);
			dst[41] = decodeFloat16(src[22]);
			dst[42] = decodeFloat16(src[33]);
			dst[43] = decodeFloat16(src[38]);
			dst[44] = decodeFloat16(src[46]);
			dst[45] = decodeFloat16(src[51]);
			dst[46] = decodeFloat16(src[55]);
			dst[47] = decodeFloat16(src[60]);
			dst[48] = decodeFloat16(src[21]);
			dst[49] = decodeFloat16(src[34]);

			dst[50] = decodeFloat16(src[37]);
			dst[51] = decodeFloat16(src[47]);
			dst[52] = decodeFloat16(src[50]);
			dst[53] = decodeFloat16(src[56]);
			dst[54] = decodeFloat16(src[59]);
			dst[55] = decodeFloat16(src[61]);
			dst[56] = decodeFloat16(src[35]);
			dst[57] = decodeFloat16(src[36]);
			dst[58] = decodeFloat16(src[48]);
			dst[59] = decodeFloat16(src[49]);

			dst[60] = decodeFloat16(src[57]);
			dst[61] = decodeFloat16(src[58]);
			dst[62] = decodeFloat16(src[62]);
			dst[63] = decodeFloat16(src[63]);

		}

		function dctInverse(data) {

			const a = 0.5 * Math.cos(3.14159 / 4.0);
			const b = 0.5 * Math.cos(3.14159 / 16.0);
			const c = 0.5 * Math.cos(3.14159 / 8.0);
			const d = 0.5 * Math.cos(3.0 * 3.14159 / 16.0);
			const e = 0.5 * Math.cos(5.0 * 3.14159 / 16.0);
			const f = 0.5 * Math.cos(3.0 * 3.14159 / 8.0);
			const g = 0.5 * Math.cos(7.0 * 3.14159 / 16.0);

			const alpha = new Array(4);
			const beta = new Array(4);
			const theta = new Array(4);
			const gamma = new Array(4);

			for (let row = 0; row < 8; ++row) {

				const rowPtr = row * 8;

				alpha[0] = c * data[rowPtr + 2];
				alpha[1] = f * data[rowPtr + 2];
				alpha[2] = c * data[rowPtr + 6];
				alpha[3] = f * data[rowPtr + 6];

				beta[0] = b * data[rowPtr + 1] + d * data[rowPtr + 3] + e * data[rowPtr + 5] + g * data[rowPtr + 7];
				beta[1] = d * data[rowPtr + 1] - g * data[rowPtr + 3] - b * data[rowPtr + 5] - e * data[rowPtr + 7];
				beta[2] = e * data[rowPtr + 1] - b * data[rowPtr + 3] + g * data[rowPtr + 5] + d * data[rowPtr + 7];
				beta[3] = g * data[rowPtr + 1] - e * data[rowPtr + 3] + d * data[rowPtr + 5] - b * data[rowPtr + 7];

				theta[0] = a * (data[rowPtr + 0] + data[rowPtr + 4]);
				theta[3] = a * (data[rowPtr + 0] - data[rowPtr + 4]);
				theta[1] = alpha[0] + alpha[3];
				theta[2] = alpha[1] - alpha[2];

				gamma[0] = theta[0] + theta[1];
				gamma[1] = theta[3] + theta[2];
				gamma[2] = theta[3] - theta[2];
				gamma[3] = theta[0] - theta[1];

				data[rowPtr + 0] = gamma[0] + beta[0];
				data[rowPtr + 1] = gamma[1] + beta[1];
				data[rowPtr + 2] = gamma[2] + beta[2];
				data[rowPtr + 3] = gamma[3] + beta[3];

				data[rowPtr + 4] = gamma[3] - beta[3];
				data[rowPtr + 5] = gamma[2] - beta[2];
				data[rowPtr + 6] = gamma[1] - beta[1];
				data[rowPtr + 7] = gamma[0] - beta[0];

			}

			for (let column = 0; column < 8; ++column) {

				alpha[0] = c * data[16 + column];
				alpha[1] = f * data[16 + column];
				alpha[2] = c * data[48 + column];
				alpha[3] = f * data[48 + column];

				beta[0] = b * data[8 + column] + d * data[24 + column] + e * data[40 + column] + g * data[56 + column];
				beta[1] = d * data[8 + column] - g * data[24 + column] - b * data[40 + column] - e * data[56 + column];
				beta[2] = e * data[8 + column] - b * data[24 + column] + g * data[40 + column] + d * data[56 + column];
				beta[3] = g * data[8 + column] - e * data[24 + column] + d * data[40 + column] - b * data[56 + column];

				theta[0] = a * (data[column] + data[32 + column]);
				theta[3] = a * (data[column] - data[32 + column]);

				theta[1] = alpha[0] + alpha[3];
				theta[2] = alpha[1] - alpha[2];

				gamma[0] = theta[0] + theta[1];
				gamma[1] = theta[3] + theta[2];
				gamma[2] = theta[3] - theta[2];
				gamma[3] = theta[0] - theta[1];

				data[0 + column] = gamma[0] + beta[0];
				data[8 + column] = gamma[1] + beta[1];
				data[16 + column] = gamma[2] + beta[2];
				data[24 + column] = gamma[3] + beta[3];

				data[32 + column] = gamma[3] - beta[3];
				data[40 + column] = gamma[2] - beta[2];
				data[48 + column] = gamma[1] - beta[1];
				data[56 + column] = gamma[0] - beta[0];

			}

		}

		function csc709Inverse(data) {

			for (let i = 0; i < 64; ++i) {

				const y = data[0][i];
				const cb = data[1][i];
				const cr = data[2][i];

				data[0][i] = y + 1.5747 * cr;
				data[1][i] = y - 0.1873 * cb - 0.4682 * cr;
				data[2][i] = y + 1.8556 * cb;

			}

		}

		function convertToHalf(src, dst, idx) {

			for (let i = 0; i < 64; ++i) {

				dst[idx + i] = DataUtils.toHalfFloat(toLinear(src[i]));

			}

		}

		function toLinear(float) {

			if (float <= 1) {

				return Math.sign(float) * Math.pow(Math.abs(float), 2.2);

			} else {

				return Math.sign(float) * Math.pow(logBase, Math.abs(float) - 1.0);

			}

		}

		function uncompressRAW(info) {

			return new DataView(info.array.buffer, info.offset.value, info.size);

		}

		function uncompressRLE(info) {

			const compressed = info.viewer.buffer.slice(info.offset.value, info.offset.value + info.size);

			const rawBuffer = new Uint8Array(decodeRunLength(compressed));
			const tmpBuffer = new Uint8Array(rawBuffer.length);

			predictor(rawBuffer); // revert predictor

			interleaveScalar(rawBuffer, tmpBuffer); // interleave pixels

			return new DataView(tmpBuffer.buffer);

		}

		function uncompressZIP(info) {

			const compressed = info.array.slice(info.offset.value, info.offset.value + info.size);

			const rawBuffer = unzlibSync(compressed);
			const tmpBuffer = new Uint8Array(rawBuffer.length);

			predictor(rawBuffer); // revert predictor

			interleaveScalar(rawBuffer, tmpBuffer); // interleave pixels

			return new DataView(tmpBuffer.buffer);

		}

		function uncompressPIZ(info) {

			const inDataView = info.viewer;
			const inOffset = { value: info.offset.value };

			const outBuffer = new Uint16Array(info.width * info.scanlineBlockSize * (info.channels * info.type));
			const bitmap = new Uint8Array(BITMAP_SIZE);

			// Setup channel info
			let outBufferEnd = 0;
			const pizChannelData = new Array(info.channels);
			for (let i = 0; i < info.channels; i++) {

				pizChannelData[i] = {};
				pizChannelData[i]['start'] = outBufferEnd;
				pizChannelData[i]['end'] = pizChannelData[i]['start'];
				pizChannelData[i]['nx'] = info.width;
				pizChannelData[i]['ny'] = info.lines;
				pizChannelData[i]['size'] = info.type;

				outBufferEnd += pizChannelData[i].nx * pizChannelData[i].ny * pizChannelData[i].size;

			}

			// Read range compression data

			const minNonZero = parseUint16(inDataView, inOffset);
			const maxNonZero = parseUint16(inDataView, inOffset);

			if (maxNonZero >= BITMAP_SIZE) {

				throw new Error('Something is wrong with PIZ_COMPRESSION BITMAP_SIZE');

			}

			if (minNonZero <= maxNonZero) {

				for (let i = 0; i < maxNonZero - minNonZero + 1; i++) {

					bitmap[i + minNonZero] = parseUint8(inDataView, inOffset);

				}

			}

			// Reverse LUT
			const lut = new Uint16Array(USHORT_RANGE);
			const maxValue = reverseLutFromBitmap(bitmap, lut);

			const length = parseUint32(inDataView, inOffset);

			// Huffman decoding
			hufUncompress(info.array, inDataView, inOffset, length, outBuffer, outBufferEnd);

			// Wavelet decoding
			for (let i = 0; i < info.channels; ++i) {

				const cd = pizChannelData[i];

				for (let j = 0; j < pizChannelData[i].size; ++j) {

					wav2Decode(
						outBuffer,
						cd.start + j,
						cd.nx,
						cd.size,
						cd.ny,
						cd.nx * cd.size,
						maxValue
					);

				}

			}

			// Expand the pixel data to their original range
			applyLut(lut, outBuffer, outBufferEnd);

			// Rearrange the pixel data into the format expected by the caller.
			let tmpOffset = 0;
			const tmpBuffer = new Uint8Array(outBuffer.buffer.byteLength);
			for (let y = 0; y < info.lines; y++) {

				for (let c = 0; c < info.channels; c++) {

					const cd = pizChannelData[c];

					const n = cd.nx * cd.size;
					const cp = new Uint8Array(outBuffer.buffer, cd.end * INT16_SIZE, n * INT16_SIZE);

					tmpBuffer.set(cp, tmpOffset);
					tmpOffset += n * INT16_SIZE;
					cd.end += n;

				}

			}

			return new DataView(tmpBuffer.buffer);

		}

		function uncompressPXR(info) {

			const compressed = info.array.slice(info.offset.value, info.offset.value + info.size);

			const rawBuffer = unzlibSync(compressed);

			const sz = info.lines * info.channels * info.width;
			const tmpBuffer = (info.type == 1) ? new Uint16Array(sz) : new Uint32Array(sz);

			let tmpBufferEnd = 0;
			let writePtr = 0;
			const ptr = new Array(4);

			for (let y = 0; y < info.lines; y++) {

				for (let c = 0; c < info.channels; c++) {

					let pixel = 0;

					switch (info.type) {

						case 1:

							ptr[0] = tmpBufferEnd;
							ptr[1] = ptr[0] + info.width;
							tmpBufferEnd = ptr[1] + info.width;

							for (let j = 0; j < info.width; ++j) {

								const diff = (rawBuffer[ptr[0]++] << 8) | rawBuffer[ptr[1]++];

								pixel += diff;

								tmpBuffer[writePtr] = pixel;
								writePtr++;

							}

							break;

						case 2:

							ptr[0] = tmpBufferEnd;
							ptr[1] = ptr[0] + info.width;
							ptr[2] = ptr[1] + info.width;
							tmpBufferEnd = ptr[2] + info.width;

							for (let j = 0; j < info.width; ++j) {

								const diff = (rawBuffer[ptr[0]++] << 24) | (rawBuffer[ptr[1]++] << 16) | (rawBuffer[ptr[2]++] << 8);

								pixel += diff;

								tmpBuffer[writePtr] = pixel;
								writePtr++;

							}

							break;

					}

				}

			}

			return new DataView(tmpBuffer.buffer);

		}

		function uncompressDWA(info) {

			const inDataView = info.viewer;
			const inOffset = { value: info.offset.value };
			const outBuffer = new Uint8Array(info.width * info.lines * (info.channels * info.type * INT16_SIZE));

			// Read compression header information
			const dwaHeader = {

				version: parseInt64(inDataView, inOffset),
				unknownUncompressedSize: parseInt64(inDataView, inOffset),
				unknownCompressedSize: parseInt64(inDataView, inOffset),
				acCompressedSize: parseInt64(inDataView, inOffset),
				dcCompressedSize: parseInt64(inDataView, inOffset),
				rleCompressedSize: parseInt64(inDataView, inOffset),
				rleUncompressedSize: parseInt64(inDataView, inOffset),
				rleRawSize: parseInt64(inDataView, inOffset),
				totalAcUncompressedCount: parseInt64(inDataView, inOffset),
				totalDcUncompressedCount: parseInt64(inDataView, inOffset),
				acCompression: parseInt64(inDataView, inOffset)

			};

			if (dwaHeader.version < 2)
				throw new Error('EXRLoader.parse: ' + EXRHeader.compression + ' version ' + dwaHeader.version + ' is unsupported');

			// Read channel ruleset information
			const channelRules = new Array();
			let ruleSize = parseUint16(inDataView, inOffset) - INT16_SIZE;

			while (ruleSize > 0) {

				const name = parseNullTerminatedString(inDataView.buffer, inOffset);
				const value = parseUint8(inDataView, inOffset);
				const compression = (value >> 2) & 3;
				const csc = (value >> 4) - 1;
				const index = new Int8Array([csc])[0];
				const type = parseUint8(inDataView, inOffset);

				channelRules.push({
					name: name,
					index: index,
					type: type,
					compression: compression,
				});

				ruleSize -= name.length + 3;

			}

			// Classify channels
			const channels = EXRHeader.channels;
			const channelData = new Array(info.channels);

			for (let i = 0; i < info.channels; ++i) {

				const cd = channelData[i] = {};
				const channel = channels[i];

				cd.name = channel.name;
				cd.compression = UNKNOWN;
				cd.decoded = false;
				cd.type = channel.pixelType;
				cd.pLinear = channel.pLinear;
				cd.width = info.width;
				cd.height = info.lines;

			}

			const cscSet = {
				idx: new Array(3)
			};

			for (let offset = 0; offset < info.channels; ++offset) {

				const cd = channelData[offset];

				for (let i = 0; i < channelRules.length; ++i) {

					const rule = channelRules[i];

					if (cd.name == rule.name) {

						cd.compression = rule.compression;

						if (rule.index >= 0) {

							cscSet.idx[rule.index] = offset;

						}

						cd.offset = offset;

					}

				}

			}

			let acBuffer, dcBuffer, rleBuffer;

			// Read DCT - AC component data
			if (dwaHeader.acCompressedSize > 0) {

				switch (dwaHeader.acCompression) {

					case STATIC_HUFFMAN:

						acBuffer = new Uint16Array(dwaHeader.totalAcUncompressedCount);
						hufUncompress(info.array, inDataView, inOffset, dwaHeader.acCompressedSize, acBuffer, dwaHeader.totalAcUncompressedCount);
						break;

					case DEFLATE:

						const compressed = info.array.slice(inOffset.value, inOffset.value + dwaHeader.totalAcUncompressedCount);
						const data = unzlibSync(compressed);
						acBuffer = new Uint16Array(data.buffer);
						inOffset.value += dwaHeader.totalAcUncompressedCount;
						break;

				}


			}

			// Read DCT - DC component data
			if (dwaHeader.dcCompressedSize > 0) {

				const zlibInfo = {
					array: info.array,
					offset: inOffset,
					size: dwaHeader.dcCompressedSize
				};
				dcBuffer = new Uint16Array(uncompressZIP(zlibInfo).buffer);
				inOffset.value += dwaHeader.dcCompressedSize;

			}

			// Read RLE compressed data
			if (dwaHeader.rleRawSize > 0) {

				const compressed = info.array.slice(inOffset.value, inOffset.value + dwaHeader.rleCompressedSize);
				const data = unzlibSync(compressed);
				rleBuffer = decodeRunLength(data.buffer);

				inOffset.value += dwaHeader.rleCompressedSize;

			}

			// Prepare outbuffer data offset
			let outBufferEnd = 0;
			const rowOffsets = new Array(channelData.length);
			for (let i = 0; i < rowOffsets.length; ++i) {

				rowOffsets[i] = new Array();

			}

			for (let y = 0; y < info.lines; ++y) {

				for (let chan = 0; chan < channelData.length; ++chan) {

					rowOffsets[chan].push(outBufferEnd);
					outBufferEnd += channelData[chan].width * info.type * INT16_SIZE;

				}

			}

			// Lossy DCT decode RGB channels
			lossyDctDecode(cscSet, rowOffsets, channelData, acBuffer, dcBuffer, outBuffer);

			// Decode other channels
			for (let i = 0; i < channelData.length; ++i) {

				const cd = channelData[i];

				if (cd.decoded) continue;

				switch (cd.compression) {

					case RLE:

						let row = 0;
						let rleOffset = 0;

						for (let y = 0; y < info.lines; ++y) {

							let rowOffsetBytes = rowOffsets[i][row];

							for (let x = 0; x < cd.width; ++x) {

								for (let byte = 0; byte < INT16_SIZE * cd.type; ++byte) {

									outBuffer[rowOffsetBytes++] = rleBuffer[rleOffset + byte * cd.width * cd.height];

								}

								rleOffset++;

							}

							row++;

						}

						break;

					case LOSSY_DCT: // skip

					default:
						throw new Error('EXRLoader.parse: unsupported channel compression');

				}

			}

			return new DataView(outBuffer.buffer);

		}

		function parseNullTerminatedString(buffer, offset) {

			const uintBuffer = new Uint8Array(buffer);
			let endOffset = 0;

			while (uintBuffer[offset.value + endOffset] != 0) {

				endOffset += 1;

			}

			const stringValue = new TextDecoder().decode(
				uintBuffer.slice(offset.value, offset.value + endOffset)
			);

			offset.value = offset.value + endOffset + 1;

			return stringValue;

		}

		function parseFixedLengthString(buffer, offset, size) {

			const stringValue = new TextDecoder().decode(
				new Uint8Array(buffer).slice(offset.value, offset.value + size)
			);

			offset.value = offset.value + size;

			return stringValue;

		}

		function parseRational(dataView, offset) {

			const x = parseInt32(dataView, offset);
			const y = parseUint32(dataView, offset);

			return [x, y];

		}

		function parseTimecode(dataView, offset) {

			const x = parseUint32(dataView, offset);
			const y = parseUint32(dataView, offset);

			return [x, y];

		}

		function parseInt32(dataView, offset) {

			const Int32 = dataView.getInt32(offset.value, true);

			offset.value = offset.value + INT32_SIZE;

			return Int32;

		}

		function parseUint32(dataView, offset) {

			const Uint32 = dataView.getUint32(offset.value, true);

			offset.value = offset.value + INT32_SIZE;

			return Uint32;

		}

		function parseUint8Array(uInt8Array, offset) {

			const Uint8 = uInt8Array[offset.value];

			offset.value = offset.value + INT8_SIZE;

			return Uint8;

		}

		function parseUint8(dataView, offset) {

			const Uint8 = dataView.getUint8(offset.value);

			offset.value = offset.value + INT8_SIZE;

			return Uint8;

		}

		const parseInt64 = function (dataView, offset) {

			let int;

			if ('getBigInt64' in DataView.prototype) {

				int = Number(dataView.getBigInt64(offset.value, true));

			} else {

				int = dataView.getUint32(offset.value + 4, true) + Number(dataView.getUint32(offset.value, true) << 32);

			}

			offset.value += ULONG_SIZE;

			return int;

		};

		function parseFloat32(dataView, offset) {

			const float = dataView.getFloat32(offset.value, true);

			offset.value += FLOAT32_SIZE;

			return float;

		}

		function decodeFloat32(dataView, offset) {

			return DataUtils.toHalfFloat(parseFloat32(dataView, offset));

		}

		// https://stackoverflow.com/questions/5678432/decompressing-half-precision-floats-in-javascript
		function decodeFloat16(binary) {

			const exponent = (binary & 0x7C00) >> 10,
				fraction = binary & 0x03FF;

			return (binary >> 15 ? - 1 : 1) * (
				exponent ?
					(
						exponent === 0x1F ?
							fraction ? NaN : Infinity :
							Math.pow(2, exponent - 15) * (1 + fraction / 0x400)
					) :
					6.103515625e-5 * (fraction / 0x400)
			);

		}

		function parseUint16(dataView, offset) {

			const Uint16 = dataView.getUint16(offset.value, true);

			offset.value += INT16_SIZE;

			return Uint16;

		}

		function parseFloat16(buffer, offset) {

			return decodeFloat16(parseUint16(buffer, offset));

		}

		function parseChlist(dataView, buffer, offset, size) {

			const startOffset = offset.value;
			const channels = [];

			while (offset.value < (startOffset + size - 1)) {

				const name = parseNullTerminatedString(buffer, offset);
				const pixelType = parseInt32(dataView, offset);
				const pLinear = parseUint8(dataView, offset);
				offset.value += 3; // reserved, three chars
				const xSampling = parseInt32(dataView, offset);
				const ySampling = parseInt32(dataView, offset);

				channels.push({
					name: name,
					pixelType: pixelType,
					pLinear: pLinear,
					xSampling: xSampling,
					ySampling: ySampling
				});

			}

			offset.value += 1;

			return channels;

		}

		function parseChromaticities(dataView, offset) {

			const redX = parseFloat32(dataView, offset);
			const redY = parseFloat32(dataView, offset);
			const greenX = parseFloat32(dataView, offset);
			const greenY = parseFloat32(dataView, offset);
			const blueX = parseFloat32(dataView, offset);
			const blueY = parseFloat32(dataView, offset);
			const whiteX = parseFloat32(dataView, offset);
			const whiteY = parseFloat32(dataView, offset);

			return { redX: redX, redY: redY, greenX: greenX, greenY: greenY, blueX: blueX, blueY: blueY, whiteX: whiteX, whiteY: whiteY };

		}

		function parseCompression(dataView, offset) {

			const compressionCodes = [
				'NO_COMPRESSION',
				'RLE_COMPRESSION',
				'ZIPS_COMPRESSION',
				'ZIP_COMPRESSION',
				'PIZ_COMPRESSION',
				'PXR24_COMPRESSION',
				'B44_COMPRESSION',
				'B44A_COMPRESSION',
				'DWAA_COMPRESSION',
				'DWAB_COMPRESSION'
			];

			const compression = parseUint8(dataView, offset);

			return compressionCodes[compression];

		}

		function parseBox2i(dataView, offset) {

			const xMin = parseUint32(dataView, offset);
			const yMin = parseUint32(dataView, offset);
			const xMax = parseUint32(dataView, offset);
			const yMax = parseUint32(dataView, offset);

			return { xMin: xMin, yMin: yMin, xMax: xMax, yMax: yMax };

		}

		function parseLineOrder(dataView, offset) {

			const lineOrders = [
				'INCREASING_Y'
			];

			const lineOrder = parseUint8(dataView, offset);

			return lineOrders[lineOrder];

		}

		function parseV2f(dataView, offset) {

			const x = parseFloat32(dataView, offset);
			const y = parseFloat32(dataView, offset);

			return [x, y];

		}

		function parseV3f(dataView, offset) {

			const x = parseFloat32(dataView, offset);
			const y = parseFloat32(dataView, offset);
			const z = parseFloat32(dataView, offset);

			return [x, y, z];

		}

		function parseValue(dataView, buffer, offset, type, size) {

			if (type === 'string' || type === 'stringvector' || type === 'iccProfile') {

				return parseFixedLengthString(buffer, offset, size);

			} else if (type === 'chlist') {

				return parseChlist(dataView, buffer, offset, size);

			} else if (type === 'chromaticities') {

				return parseChromaticities(dataView, offset);

			} else if (type === 'compression') {

				return parseCompression(dataView, offset);

			} else if (type === 'box2i') {

				return parseBox2i(dataView, offset);

			} else if (type === 'lineOrder') {

				return parseLineOrder(dataView, offset);

			} else if (type === 'float') {

				return parseFloat32(dataView, offset);

			} else if (type === 'v2f') {

				return parseV2f(dataView, offset);

			} else if (type === 'v3f') {

				return parseV3f(dataView, offset);

			} else if (type === 'int') {

				return parseInt32(dataView, offset);

			} else if (type === 'rational') {

				return parseRational(dataView, offset);

			} else if (type === 'timecode') {

				return parseTimecode(dataView, offset);

			} else if (type === 'preview') {

				offset.value += size;
				return 'skipped';

			} else {

				offset.value += size;
				return undefined;

			}

		}

		function parseHeader(dataView, buffer, offset) {

			const EXRHeader = {};

			if (dataView.getUint32(0, true) != 20000630) { // magic

				throw new Error('THREE.EXRLoader: provided file doesn\'t appear to be in OpenEXR format.');

			}

			EXRHeader.version = dataView.getUint8(4);

			const spec = dataView.getUint8(5); // fullMask

			EXRHeader.spec = {
				singleTile: !!(spec & 2),
				longName: !!(spec & 4),
				deepFormat: !!(spec & 8),
				multiPart: !!(spec & 16),
			};

			// start of header

			offset.value = 8; // start at 8 - after pre-amble

			let keepReading = true;

			while (keepReading) {

				const attributeName = parseNullTerminatedString(buffer, offset);

				if (attributeName == 0) {

					keepReading = false;

				} else {

					const attributeType = parseNullTerminatedString(buffer, offset);
					const attributeSize = parseUint32(dataView, offset);
					const attributeValue = parseValue(dataView, buffer, offset, attributeType, attributeSize);

					if (attributeValue === undefined) {

						console.warn(`EXRLoader.parse: skipped unknown header attribute type \'${attributeType}\'.`);

					} else {

						EXRHeader[attributeName] = attributeValue;

					}

				}

			}

			if ((spec & ~0x04) != 0) { // unsupported tiled, deep-image, multi-part

				console.error('EXRHeader:', EXRHeader);
				throw new Error('THREE.EXRLoader: provided file is currently unsupported.');

			}

			return EXRHeader;

		}

		function setupDecoder(EXRHeader, dataView, uInt8Array, offset, outputType) {

			const EXRDecoder = {
				size: 0,
				viewer: dataView,
				array: uInt8Array,
				offset: offset,
				width: EXRHeader.dataWindow.xMax - EXRHeader.dataWindow.xMin + 1,
				height: EXRHeader.dataWindow.yMax - EXRHeader.dataWindow.yMin + 1,
				channels: EXRHeader.channels.length,
				bytesPerLine: null,
				lines: null,
				inputSize: null,
				type: EXRHeader.channels[0].pixelType,
				uncompress: null,
				getter: null,
				format: null,
				colorSpace: LinearSRGBColorSpace,
			};

			switch (EXRHeader.compression) {

				case 'NO_COMPRESSION':
					EXRDecoder.lines = 1;
					EXRDecoder.uncompress = uncompressRAW;
					break;

				case 'RLE_COMPRESSION':
					EXRDecoder.lines = 1;
					EXRDecoder.uncompress = uncompressRLE;
					break;

				case 'ZIPS_COMPRESSION':
					EXRDecoder.lines = 1;
					EXRDecoder.uncompress = uncompressZIP;
					break;

				case 'ZIP_COMPRESSION':
					EXRDecoder.lines = 16;
					EXRDecoder.uncompress = uncompressZIP;
					break;

				case 'PIZ_COMPRESSION':
					EXRDecoder.lines = 32;
					EXRDecoder.uncompress = uncompressPIZ;
					break;

				case 'PXR24_COMPRESSION':
					EXRDecoder.lines = 16;
					EXRDecoder.uncompress = uncompressPXR;
					break;

				case 'DWAA_COMPRESSION':
					EXRDecoder.lines = 32;
					EXRDecoder.uncompress = uncompressDWA;
					break;

				case 'DWAB_COMPRESSION':
					EXRDecoder.lines = 256;
					EXRDecoder.uncompress = uncompressDWA;
					break;

				default:
					throw new Error('EXRLoader.parse: ' + EXRHeader.compression + ' is unsupported');

			}

			EXRDecoder.scanlineBlockSize = EXRDecoder.lines;

			if (EXRDecoder.type == 1) {

				// half
				switch (outputType) {

					case FloatType:
						EXRDecoder.getter = parseFloat16;
						EXRDecoder.inputSize = INT16_SIZE;
						break;

					case HalfFloatType:
						EXRDecoder.getter = parseUint16;
						EXRDecoder.inputSize = INT16_SIZE;
						break;

				}

			} else if (EXRDecoder.type == 2) {

				// float
				switch (outputType) {

					case FloatType:
						EXRDecoder.getter = parseFloat32;
						EXRDecoder.inputSize = FLOAT32_SIZE;
						break;

					case HalfFloatType:
						EXRDecoder.getter = decodeFloat32;
						EXRDecoder.inputSize = FLOAT32_SIZE;

				}

			} else {

				throw new Error('EXRLoader.parse: unsupported pixelType ' + EXRDecoder.type + ' for ' + EXRHeader.compression + '.');

			}

			EXRDecoder.blockCount = (EXRHeader.dataWindow.yMax + 1) / EXRDecoder.scanlineBlockSize;

			for (let i = 0; i < EXRDecoder.blockCount; i++)
				parseInt64(dataView, offset); // scanlineOffset

			// we should be passed the scanline offset table, ready to start reading pixel data.

			// RGB images will be converted to RGBA format, preventing software emulation in select devices.
			EXRDecoder.outputChannels = ((EXRDecoder.channels == 3) ? 4 : EXRDecoder.channels);
			const size = EXRDecoder.width * EXRDecoder.height * EXRDecoder.outputChannels;

			switch (outputType) {

				case FloatType:
					EXRDecoder.byteArray = new Float32Array(size);

					// Fill initially with 1s for the alpha value if the texture is not RGBA, RGB values will be overwritten
					if (EXRDecoder.channels < EXRDecoder.outputChannels)
						EXRDecoder.byteArray.fill(1, 0, size);

					break;

				case HalfFloatType:
					EXRDecoder.byteArray = new Uint16Array(size);

					if (EXRDecoder.channels < EXRDecoder.outputChannels)
						EXRDecoder.byteArray.fill(0x3C00, 0, size); // Uint16Array holds half float data, 0x3C00 is 1

					break;

				default:
					console.error('THREE.EXRLoader: unsupported type: ', outputType);
					break;

			}

			EXRDecoder.bytesPerLine = EXRDecoder.width * EXRDecoder.inputSize * EXRDecoder.channels;

			if (EXRDecoder.outputChannels == 4) {

				EXRDecoder.format = RGBAFormat;
				EXRDecoder.colorSpace = LinearSRGBColorSpace;

			} else {

				EXRDecoder.format = RedFormat;
				EXRDecoder.colorSpace = NoColorSpace;

			}

			return EXRDecoder;

		}

		// start parsing file [START]

		const bufferDataView = new DataView(buffer);
		const uInt8Array = new Uint8Array(buffer);
		const offset = { value: 0 };

		// get header information and validate format.
		const EXRHeader = parseHeader(bufferDataView, buffer, offset);

		// get input compression information and prepare decoding.
		const EXRDecoder = setupDecoder(EXRHeader, bufferDataView, uInt8Array, offset, this.type);

		const tmpOffset = { value: 0 };
		const channelOffsets = { R: 0, G: 1, B: 2, A: 3, Y: 0 };

		for (let scanlineBlockIdx = 0; scanlineBlockIdx < EXRDecoder.height / EXRDecoder.scanlineBlockSize; scanlineBlockIdx++) {

			const line = parseUint32(bufferDataView, offset); // line_no
			EXRDecoder.size = parseUint32(bufferDataView, offset); // data_len
			EXRDecoder.lines = ((line + EXRDecoder.scanlineBlockSize > EXRDecoder.height) ? (EXRDecoder.height - line) : EXRDecoder.scanlineBlockSize);

			const isCompressed = EXRDecoder.size < EXRDecoder.lines * EXRDecoder.bytesPerLine;
			const viewer = isCompressed ? EXRDecoder.uncompress(EXRDecoder) : uncompressRAW(EXRDecoder);

			offset.value += EXRDecoder.size;

			for (let line_y = 0; line_y < EXRDecoder.scanlineBlockSize; line_y++) {

				const true_y = line_y + scanlineBlockIdx * EXRDecoder.scanlineBlockSize;
				if (true_y >= EXRDecoder.height) break;

				for (let channelID = 0; channelID < EXRDecoder.channels; channelID++) {

					const cOff = channelOffsets[EXRHeader.channels[channelID].name];

					for (let x = 0; x < EXRDecoder.width; x++) {

						tmpOffset.value = (line_y * (EXRDecoder.channels * EXRDecoder.width) + channelID * EXRDecoder.width + x) * EXRDecoder.inputSize;
						const outIndex = (EXRDecoder.height - 1 - true_y) * (EXRDecoder.width * EXRDecoder.outputChannels) + x * EXRDecoder.outputChannels + cOff;
						EXRDecoder.byteArray[outIndex] = EXRDecoder.getter(viewer, tmpOffset);

					}

				}

			}

		}

		return {
			header: EXRHeader,
			width: EXRDecoder.width,
			height: EXRDecoder.height,
			data: EXRDecoder.byteArray,
			format: EXRDecoder.format,
			colorSpace: EXRDecoder.colorSpace,
			type: this.type,
		};

	}

	setDataType(value) {

		this.type = value;
		return this;

	}

	load(url, onLoad, onProgress, onError) {

		function onLoadCallback(texture, texData) {

			texture.colorSpace = texData.colorSpace;
			texture.minFilter = LinearFilter;
			texture.magFilter = LinearFilter;
			texture.generateMipmaps = false;
			texture.flipY = false;

			if (onLoad) onLoad(texture, texData);

		}

		return super.load(url, onLoadCallback, onProgress, onError);

	}

}

var action_compress = 1, action_decompress = 2, action_progress = 3;

class LZMA {

	constructor(lzma_path) {
		// export class LZMA = function (lzma_path) {


		this.callback_obj = {};

		///NOTE: Node.js needs something like "./" or "../" at the beginning.
		this.lzma_worker = new Worker(lzma_path || "./lzma_worker-min.js");

		this.lzma_worker.onmessage = function onmessage(e) {
			if (e.data.action === action_progress) {
				if (this.callback_obj[e.data.cbn] && typeof this.callback_obj[e.data.cbn].on_progress === "function") {
					this.callback_obj[e.data.cbn].on_progress(e.data.result);
				}
			} else {
				if (this.callback_obj[e.data.cbn] && typeof this.callback_obj[e.data.cbn].on_finish === "function") {
					this.callback_obj[e.data.cbn].on_finish(e.data.result, e.data.error);

					/// Since the (de)compression is complete, the callbacks are no longer needed.
					delete this.callback_obj[e.data.cbn];
				}
			}
		}.bind(this);

		/// Very simple error handling.
		this.lzma_worker.onerror = function (event) {
			var err = new Error(event.message + " (" + event.filename + ":" + event.lineno + ")");

			for (var cbn in this.callback_obj) {
				this.callback_obj[cbn].on_finish(null, err);
			}

			console.error('Uncaught error in lzma_worker', err);
		}.bind(this);

	}

	send_to_worker(action, data, mode, on_finish, on_progress) {
		var cbn;

		do {
			cbn = Math.floor(Math.random() * (10000000));
		} while (typeof this.callback_obj[cbn] !== "undefined");

		this.callback_obj[cbn] = {
			on_finish: on_finish,
			on_progress: on_progress
		};

		this.lzma_worker.postMessage({
			action: action, /// action_compress = 1, action_decompress = 2, action_progress = 3
			cbn: cbn,    /// callback number
			data: data,
			mode: mode
		});
	}

	compress(mixed, mode, on_finish, on_progress) {
		this.send_to_worker(action_compress, mixed, mode, on_finish, on_progress);
	}
	decompress(byte_arr, on_finish, on_progress) {
		this.send_to_worker(action_decompress, byte_arr, false, on_finish, on_progress);
	}
	worker() {
		return this.lzma_worker;
	}
}

/** __
*    _)_|_|_
*   __) |_| | 2022
* @author lo.th / https://github.com/lo-th
*/

let isGL2 = true;
let isInit = false;

let renderer = null;
//let mode = ''

//const mats = {}

const materials = new Map();

const uniforms = {

	renderMode: { value: 0 },
	fogMode: { value: 1 },
	depthPacking: { value: 1 },

	time: { value: 0.0 },

	shadow: { value: 0.5 },
	shadowGamma: { value: 0.25 },//1
	shadowLuma: { value: 0 },//0.75
	shadowContrast: { value: 1 },//2.5

	//shadowAlpha: { value: 1.0 }

	lightSizeUV: { value: 3 },
	nearPlane: { value: 9.5 },
	rings: { value: 11 },
	nSample: { value: 17 },

	noiseIntensity: { value: 1 },
	softness: { value: 1.6 },

	noiseMap: { value: null },
	useNoiseMap: { value: 0 },


};


class Shader {

	get renderer() { return renderer; }
	set renderer(r) { renderer = r; }

	static setGl2(b) { isGL2 = b; }
	static getGl2(b) { return isGL2 }

	static setting() {
		return uniforms
	}

	static getRandomUv() {
		return randomUV;
	}

	static addParsFragment(s, adds) {
		s.fragmentShader = s.fragmentShader.replace('#include <clipping_planes_pars_fragment>', '#include <clipping_planes_pars_fragment>' + adds);
	}

	/*static addToParsFragment( fragment, adds ){
		return fragment.replace( '#include <clipping_planes_pars_fragment>', '#include <clipping_planes_pars_fragment>' + adds );
	}*/


	static init(o = {}) {

		// Set CustomToneMapping to Uncharted2
		// source: http://filmicworlds.com/blog/filmic-tonemapping-operators/

		ShaderChunk.tonemapping_pars_fragment = ShaderChunk.tonemapping_pars_fragment.replace(
			'vec3 CustomToneMapping( vec3 color ) { return color; }',
			`#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
            float toneMappingWhitePoint = 1.0;
            vec3 CustomToneMapping( vec3 color ) {
                color *= toneMappingExposure;
                return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
            }`
		);



		//mode = o.mode

		//if( mode === 'LOW' ) return

		let s;

		this.up(o);

		{

			//defines['NUM_SAMPLES'] = 17
			//defines['NUM_RINGS'] = 11

			s = ShaderChunk.shadowmap_pars_fragment;

			s = s.replace(
				'#ifdef USE_SHADOWMAP', shadowPCSS
			);

			s = s.replace(//BasicShadowMap
				'shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );', `
                return PCSS( shadowMap, shadowCoord );
            `);

			/*s = s.replace(
				'#if defined( SHADOWMAP_TYPE_PCF )',`
				return PCSS( shadowMap, shadowCoord );
				#if defined( SHADOWMAP_TYPE_PCF )
			`)*/

			ShaderChunk.shadowmap_pars_fragment = s;

		}

		//return;

		s = ShaderChunk.common;
		s = s.replace('#define EPSILON 1e-6', `
        	#define EPSILON 1e-6
        	uniform float shadow;
            uniform float shadowLuma;
            uniform float shadowContrast;
            uniform float shadowGamma;

            uniform int renderMode;
            uniform int fogMode;
            uniform int depthPacking;

            varying vec2 vZW;
            varying vec3 rayDir;
            varying vec3 rayDir2;
            varying vec3 rayOri;
            //varying float fDist;

            float shadowValue = 1.0;
            float shadowTmp = 1.0;
            vec3 shadowColor = vec3(1.0);
            
            float color_distance( vec3 a, vec3 b){
                vec3 s = vec3( a - b );
                float dist = sqrt( s.r * s.r + s.g * s.g + s.b * s.b );
                return clamp(dist, 0.0, 1.0);
            }

            vec3 adjustContrast(vec3 color, float value) {
                const vec3 zero = vec3(0.);
                return max(zero, 0.5 + value * (color - 0.5));
            }

            vec3 hsv2rgb(vec3 c){
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }

            vec3 rgb2hsv(vec3 rgb) {
                float Cmax = max(rgb.r, max(rgb.g, rgb.b));
                float Cmin = min(rgb.r, min(rgb.g, rgb.b));
                float delta = Cmax - Cmin;
                vec3 hsv = vec3(0., 0., Cmax);
                if (Cmax > Cmin) {
                    hsv.y = delta / Cmax;
                    if (rgb.r == Cmax) hsv.x = (rgb.g - rgb.b) / delta;
                    else {
                        if (rgb.g == Cmax) hsv.x = 2. + (rgb.b - rgb.r) / delta;
                        else hsv.x = 4. + (rgb.r - rgb.g) / delta;
                    }
                    hsv.x = fract(hsv.x / 6.);
                }
                return hsv;
            }

            /*
            vec3 rgb2hsv(vec3 c){
                vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
                vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

                float d = q.x - min(q.w, q.y);
                float e = 1.0e-10;
                return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
            }

            vec3 brightnessContrastCorrection(vec3 value, float brightness, float contrast){
                return (value - 0.5) * contrast + 0.5 + brightness;
            }

            vec3 GammaCorrection(vec3 value, float param){
                return vec3(pow(abs(value.r), param),pow(abs(value.g), param),pow(abs(value.b), param));
            }
            */
            

        `);

		ShaderChunk.common = s;

		/*ShaderChunk.project_vertex = `
			vec4 mvPosition = vec4( transformed, 1.0 );

			#ifdef USE_INSTANCING
				mvPosition = instanceMatrix * mvPosition;
			#endif

			mvPosition = modelViewMatrix * mvPosition;
			gl_Position = projectionMatrix * mvPosition;
		`;*/





		/*ShaderChunk.begin_vertex = `
		vZW = gl_Position.zw;
		vec3 transformed = vec3( position );
		`;*/


		ShaderChunk.clipping_planes_vertex = `
            #if NUM_CLIPPING_PLANES > 0
                vClipPosition = - mvPosition.xyz;
            #endif
            vZW = gl_Position.zw;
        `;

		s = ShaderChunk.lights_fragment_begin;

		// point
		s = s.replace('directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;', `
            shadowTmp = 1.0;
            shadowTmp *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;;
            //directLight.color *= shadowTmp;
            shadowValue *= shadowTmp;
        `);

		// spot
		s = s.replace('directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;', `
            shadowTmp = 1.0;
            shadowTmp *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
            //directLight.color *= shadowTmp;
            shadowValue *= shadowTmp;
        `);

		// directional
		s = s.replace('directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;', `
            shadowTmp = 1.0;
            shadowTmp *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
            //directLight.color *= shadowTmp;
            shadowValue *= shadowTmp;
        `);

		ShaderChunk.lights_fragment_begin = s;

		/* s = ShaderChunk.tonemapping_fragment;
 
		 s = s.replace( '#if defined( TONE_MAPPING )', `
			 #if defined( USE_SHADOWMAP )
			 gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * shadowR, Shadow);
			 #endif
 
			 #if defined( TONE_MAPPING )
		 `);
 
		 ShaderChunk.tonemapping_fragment = s;*/

		{
			ShaderChunk.fog_vertex = FogVertex;
			ShaderChunk.fog_fragment = FogFragment;
		}







		s = ShaderChunk.opaque_fragment;//output_fragment;

		s = s.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', `

            gl_FragColor = vec4( outgoingLight, diffuseColor.a );

        	#if defined( USE_SHADOWMAP )

            shadowValue = (shadowValue - 0.5) * shadowContrast + 0.5 + shadowLuma;
            shadowValue = pow(abs(shadowValue), shadowGamma );
            shadowValue = clamp( shadowValue, 0.0, 1.0 );

            shadowColor = vec3( shadowValue );

            ///shadowColor = vec3( 0.0,0.0,1.0-shadowValue );

            //vec3 sColor = vec3( 0.1, 0.1, 0.8 );
            //shadowColor.b += 1.0-shadowValue ;



            // TODO find better shadow variation

            vec3 invert = vec3( 1.0 - gl_FragColor.rgb );
            vec3 dd = vec3(0.38,0.42,0.63);
            float gray = ((gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0);
            vec3 invColor = gray * dd;
            invColor = invColor * mix( invColor, invert, 1.0-gray*0.5 );




                    


            //gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * shadowColor, (1.0-shadowValue) * shadow );

            //gl_FragColor.rgb *= ((1.0-shadowValue) * (1.0-shadow)) + shadowColor;

            //gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * invColor, (1.0-shadowValue) * shadow );

            gl_FragColor.rgb = mix( gl_FragColor.rgb, invColor, (1.0-shadowValue) * shadow );

            //gl_FragColor.rgb = invColor;

            //gl_FragColor.rgb = gl_FragColor.rgb * shadowColor;

            //gl_FragColor.rgb *= ((1.0-shadowValue) * shadow) * invColor;


        	#endif
            
        `);

		//ShaderChunk.fog_fragment = s;
		ShaderChunk.opaque_fragment = s;//output_fragment = s

		//  ShaderChunk.tonemapping_fragment = s;


		//console.log('shadow modif on')

		s = ShaderChunk.dithering_fragment;

		s = s.replace('#endif', `

            #endif

            #ifdef STANDARD

            if( renderMode == 1 ){ 
                float fz = 0.5 * vZW[0] / vZW[1] + 0.5;
                gl_FragColor = depthPacking == 1 ? packDepthToRGBA( fz ) : vec4( vec3( 1.0 - fz ), opacity );// depth render
            }
            if( renderMode == 2 ) gl_FragColor = vec4(  packNormalToRGB( normal ), opacity );// normal render
            if( renderMode == 3 ) gl_FragColor = vec4(  shadowColor, opacity );// normal render

            #else

            if( renderMode != 0 ) discard;

            #endif

        `);

		ShaderChunk.dithering_fragment = s;



		s = ShaderChunk.color_vertex;
		s = s.replace('vColor.xyz *= instanceColor.xyz;', `vColor.xyz = instanceColor.xyz;`);
		ShaderChunk.color_vertex = s;


		isInit = true;






		//this.shaders=[];
		//this.uniforms = {};

	}

	static add(m, beforeCompile = null) {

		if (!isInit) return

		if (!m) return

		let name = m.name;
		if (materials.has(name)) {
			console.log('already add', name);
			return
		}

		//console.log('add', name)
		materials.set(name, true);

		if (m.shadowSide === null) m.shadowSide = DoubleSide;

		//m.format = sRGBEncoding;
		/*if(!m.isEncod){
			if( m.map ) m.map.colorSpace = SRGBColorSpace
			m.color.convertSRGBToLinear()
			m.isEncod = true
		}*/

		m.onBeforeCompile = function (shader) {
			Shader.modify(shader);
			if (beforeCompile) beforeCompile(shader);
		};

		/*if(!m.defines){ 
			m.defines = defines
		} else {
			Shader.setDefines( m )
		}*/
		//

	}

	static refresh() {

		/* console.log( 'refresh', materials )
  
		  materials.forEach( (value, key)=>{
  
  
			  //console.log( value, key )
  
  
  
			  value.needsUpdate = true 
  
		  })*/
	}

	static setDefines(m) {

		//for( var o in defines ) m.defines[o] = defines[o]

		//if(!mats[m.name]) mats[m.name] = m

		// console.log(m.name)

	}


	static modify(s) {

		if (!isInit) return

		// if( mode === 'LOW' ) return

		//shaders.push( s );
		// apply global uniform
		for (let n in uniforms) {

			s.uniforms[n] = uniforms[n];

		}

		// start add

		/*let fragment = s.fragmentShader;
 
		 fragment.replace( 'vec4 diffuseColor = vec4( diffuse, opacity );', `
			 vec4 diffuseColor = vec4( diffuse, opacity );
			 vec3 shadowR = vec3(1.0);
		 `);
		 s.fragmentShader = fragment;*/

	}

	static up(o) {

		//if( mode === 'LOW' ) return

		for (let n in o) {

			if (uniforms[n]) {
				if (uniforms[n].value.isColor) uniforms[n].value.setHex(o[n]);
				else uniforms[n].value = o[n];

			}

			/*if( defines[n] ){

				for( let m in mats ){ 
					console.log(m)
					mats[m].defines[n] = o[n]
				}

			}*/


		}

		/*for ( let s of shaders ){

			for( let n in o ){

				if( s.uniforms[n] ){ 
					if( s.uniforms[n].value.isColor ) s.uniforms[n].value.setHex( o[n] );
					else s.uniforms[n].value = o[n];

				}
			}

		}*/

	}

	static reset() {
		materials.clear();
	}

}
/*THREE.ShaderChunk.fog_fragment = THREE.ShaderChunk.fog_fragment.replace(
					'gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );',
					`
					vec4 CCF = vec4(fogColor, 1.0);
					#if defined( TONE_MAPPING )
					CCF.rgb = toneMapping( CCF.rgb );
					CCF = linearToOutputTexel( CCF );
					#endif
					gl_FragColor.rgb = mix( gl_FragColor.rgb, CCF.rgb, fogFactor );
					`
				);*/

// https://iquilezles.org/articles/fog/
const FogVertex = `
#ifdef USE_FOG

    vFogDepth = - mvPosition.z;

    rayDir2 = normalize( worldPosition.xyz - cameraPosition );
    rayDir = normalize( mvPosition.xyz );
    rayOri = cameraPosition.xyz;

    //rayOri = worldPosition.xyz; //( cameraPosition-worldPosition.xyz  );
    //vec3 tt = vec3(cameraPosition-mvPosition);
    //float fDist = sqrt(tt.x*tt.x+tt.y*tt.y+tt.z*tt.z);
    //fDist = distance(cameraPosition.xyz, mvPosition.xyz);

#endif
`;

const FogFragment = `
#ifdef USE_FOG

    #ifdef FOG_EXP2

        float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );

    #else

        float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
        float fogDensity = 0.01;

    #endif

    

    /*vec4 CCF = vec4(fogColor, 1.0);
    #if defined( TONE_MAPPING )
        CCF.rgb = toneMapping( CCF.rgb );
        //CCF = linearToOutputTexel( CCF );
    #endif*/

    if( fogMode == 0 ){

        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
    } 

    if( fogMode == 1 ){

        vec3 fcolor = fogColor;

        #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

            float aa = fogDensity * fogDensity * 1.0;
            float bb = fogDensity * fogDensity * 12.0;
            //bb = pow(bb, 0.8);
            float distance = vFogDepth * vFogDepth;

            fogFactor = 1.0 - exp( -distance*bb );
            fogFactor = (aa/bb) * exp(-rayOri.y*bb) * (1.0-exp( -distance*rayDir2.y*bb ))/rayDir2.y;
            fogFactor = clamp( fogFactor, 0.0, 1.0 );

            vec3 sunDir = normalize( directionalLights[ 0 ].direction );
            vec3 sunColor = directionalLights[ 0 ].color;
            // sunColor = vec3(1,0,0);
            float sunAmount = max( dot( rayDir, sunDir ), 0.0 );
            //float sunAdd = clamp( pow(sunAmount, 60.0), 0.0, 1.0 );
            float sunAdd = pow(sunAmount, 16.0);
            fcolor = mix( fogColor, sunColor, sunAdd ); // 8.0

        #endif

        gl_FragColor.rgb = gl_FragColor.rgb * (1.0-fogFactor) + fcolor * fogFactor;

    }

#endif
`;


const shadowPCSS = `
#ifdef USE_SHADOWMAP

uniform float lightSizeUV;
uniform float nearPlane;
uniform float rings;
uniform int nSample;
uniform float noiseIntensity;
uniform float softness;

//#define LIGHT_WORLD_SIZE 0.005
//#define LIGHT_FRUSTUM_WIDTH 3.75
//#define LIGHT_SIZE_UV (LIGHT_WORLD_SIZE / LIGHT_FRUSTUM_WIDTH)
//#define NEAR_PLANE 9.5

#define SAMPLE 16
#define RINGS 4

vec2 poissonDisk[32];

void initPoissonSamples( const in vec2 randomSeed ) {

    float ANGLE_STEP = PI2 * float(RINGS) / float( SAMPLE );
    float INV_NUM_SAMPLES = 1.0 / float( SAMPLE );

    // jsfiddle that shows sample pattern: https://jsfiddle.net/a16ff1p7/
    float angle = rand( randomSeed ) * PI2;
    float radius = INV_NUM_SAMPLES;
    float radiusStep = radius;

    for( int i = 0; i < SAMPLE; i ++ ) {
        poissonDisk[i] = vec2( cos( angle ), sin( angle ) ) * pow( radius, 0.75 );
        radius += radiusStep;
        angle += ANGLE_STEP;
    }
}

float penumbraSize( const in float zReceiver, const in float zBlocker ) { // Parallel plane estimation
    return (zReceiver - zBlocker) / zBlocker;
}

float findBlocker( sampler2D shadowMap, const in vec2 uv, const in float zReceiver, float ls ) {

    // This uses similar triangles to compute what
    // area of the shadow map we should search
    float searchRadius = ls * ( zReceiver - nearPlane ) / zReceiver;
    float blockerDepthSum = 0.0;
    int numBlockers = 0;
    float shadowMapDepth = 0.0;

    for( int i = 0; i < SAMPLE; i++ ) {
        shadowMapDepth = unpackRGBAToDepth(texture2D(shadowMap, uv + poissonDisk[i] * searchRadius));
        if ( shadowMapDepth < zReceiver ) {
            blockerDepthSum += shadowMapDepth;
            numBlockers ++;
        }
    }

    if( numBlockers == 0 ) return -1.0;

    return blockerDepthSum / float( numBlockers );

}

float PCF_Filter(sampler2D shadowMap, vec2 uv, float zReceiver, float filterRadius ) {
    
    /*
    int numSample = SAMPLE;
    float sum = 0.0;
    float depth;
    #pragma unroll_loop_start
    for( int i = 0; i < SAMPLE; i ++ ) {
        depth = unpackRGBAToDepth( texture2D( shadowMap, uv + poissonDisk[ i ] * filterRadius ) );
        if( zReceiver <= depth ) sum += 1.0;
    }
    #pragma unroll_loop_end
    #pragma unroll_loop_start
    for( int i = 0; i < SAMPLE; i ++ ) {
        depth = unpackRGBAToDepth( texture2D( shadowMap, uv + -poissonDisk[ i ].yx * filterRadius ) );
        if( zReceiver <= depth ) sum += 1.0;
    }
    #pragma unroll_loop_end
    return sum / ( 2.0 * float( nSample ) );
    */

    
    float sum = 0.0;
    float top = 0.0;
    float low = 0.0;
    #pragma unroll_loop_start
    for( int i = 0; i < 16; i ++ ) {
        top = unpackRGBAToDepth( texture2D( shadowMap, uv + poissonDisk[ i ] * filterRadius ) );
        low = unpackRGBAToDepth( texture2D( shadowMap, uv + -poissonDisk[ i ].yx * filterRadius ) );
        if( zReceiver <= top ) sum += 1.0;
        if( zReceiver <= low ) sum += 1.0;
    }
    #pragma unroll_loop_end
    return sum / ( 2.0 * float( SAMPLE ) );
}

float PCSS ( sampler2D shadowMap, vec4 coords ) {

    vec2 uv = coords.xy;
    float zReceiver = coords.z; // Assumed to be eye-space z in this code
    //float lightSizeUV = LIGHT_WORLD_SIZE / LIGHT_FRUSTUM_WIDTH;

    float ls = lightSizeUV * 0.001;

    initPoissonSamples( uv );
    // STEP 1: blocker search
    float avgBlockerDepth = findBlocker( shadowMap, uv, zReceiver, ls );

    //There are no occluders so early out (this saves filtering)
    if( avgBlockerDepth == -1.0 ) return 1.0;

    // STEP 2: penumbra size
    float penumbraRatio = penumbraSize( zReceiver, avgBlockerDepth );
    float filterRadius = penumbraRatio * ls * nearPlane / zReceiver;

    // STEP 3: filtering
    //return avgBlockerDepth;
    return PCF_Filter( shadowMap, uv, zReceiver, filterRadius * softness );
}
`;

const randomUV = `

uniform sampler2D noiseMap;
uniform float useNoiseMap;

float directNoise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    
    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

float sum( vec4 v ) { return v.x+v.y+v.z; }

vec4 textureNoTile( sampler2D mapper, in vec2 uv ){

    // sample variation pattern
    float k = 0.0;
    if( useNoiseMap == 1.0 ) k = texture2D( noiseMap, 0.005*uv ).x;
    else k = directNoise( uv );
    
    // compute index    
    float index = k*8.0;
    float f = fract( index );

    float ia = floor( index );
    float ib = ia + 1.0;
    // or
    //float ia = floor(index+0.5); // suslik's method (see comments)
    //float ib = floor(index);
    //f = min(f, 1.0-f)*2.0;

    // offsets for the different virtual patterns    
    vec2 offa = sin(vec2(3.0,7.0)*ia); // can replace with any other hash    
    vec2 offb = sin(vec2(3.0,7.0)*ib); // can replace with any other hash    

    // compute derivatives for mip-mapping    
    vec2 dx = dFdx(uv);
    vec2 dy = dFdy(uv);
    
    // sample the two closest virtual patterns    
    vec4 cola = textureGrad( mapper, uv + offa, dx, dy );
    vec4 colb = textureGrad( mapper, uv + offb, dx, dy );

    // interpolate between the two virtual patterns    
    return mix( cola, colb, smoothstep(0.2,0.8,f-0.1*sum(cola-colb)) );

}
`;

const GlbTool = {

	getMesh: (scene, keepMaterial) => {
		let meshs = {};
		//if( keepMaterial ) GlbTool.keepMaterial( scene )
		scene.traverse((child) => {
			if (child.isMesh) meshs[child.name] = child;
		});
		return meshs;
	},

	keepMaterial: (scene) => {

		let Mats = {}, m;

		scene.traverse((child) => {
			if (child.isMesh) {
				m = child.material;
				if (!Mats[m.name]) {
					Shader.add(m);
					//console.log(m.name)
					Mats[m.name] = true;
				}
			}
		});

	},

	getGroup: (scene, autoMesh, autoMaterial) => {
		const groups = {};
		let mats = null;
		if (autoMaterial) mats = GlbTool.getMaterial(scene, true);
		scene.traverse((child) => {
			if (child.isGroup) {
				//if( autoMaterial ) mats = GlbTool.getMaterial( scene, true ) 
				groups[child.name] = autoMesh ? GlbTool.groupToMesh(child, mats) : child;
			}
		});
		return groups;
	},

	// Material should be name like 
	// 0_concret
	// 10_silver ...

	getMaterial: (scene, toArray) => {
		const Mats = {};
		const mats = [];
		let m, n;
		scene.traverse((child) => {
			if (child.isMesh) {
				m = child.material;
				if (!Mats[m.name]) {
					Shader.add(m);
					Mats[m.name] = m;
					n = Number(m.name.substring(0, m.name.lastIndexOf('_')));
					mats[n] = m;
				}
			}
		});
		return toArray ? mats : Mats;
	},

	groupToMesh: (group, autoMaterial) => {

		if (group.children[0].name !== (group.name + '_1')) return group
		if (!group.children[0].isMesh) return group

		let g = [];
		let lng = group.children.length, n = 0, mName;

		for (let i = 0; i < lng; i++) {

			mName = group.children[i].material.name;

			n = Number(mName.substring(0, mName.lastIndexOf('_')));
			group.children[i].material.dispose();

			g[i] = group.children[i].geometry;
			g[i].forceMatId = n;
		}

		let mesh = new THREE.Mesh(new mergeGeometries(g, true), autoMaterial);
		mesh.name = group.name;

		return mesh

	},

	symetric: (g) => {

		if (g.isMesh) g = g.geometry;

		let uv = g.attributes.uv.array;
		let i = uv.length * 0.5;

		while (i--) {
			if (uv[i * 2] < 0) uv[i * 2] *= -1;
		}
		g.attributes.uv.needsUpdate = true;

	},

	uv2: (g) => {

		if (g.isMesh) g = g.geometry;
		g.setAttribute('uv2', g.attributes.uv);

	},


	autoMorph: (mod, meshs, normal = true, relative = false) => {

		let morph = {};
		let tmpMesh = [];
		mod.traverse((node) => {
			if (node.isMesh && node.name.search('__M__') !== -1) {
				morph[node.name] = node.geometry;
				tmpMesh.push(node);
			}
		});

		let oName, tName, target, id, g, gm, j, dp, dn, ar, m;


		for (let name in morph) {

			oName = name.substring(0, name.indexOf('__'));
			tName = name.substring(name.lastIndexOf('__') + 2);

			target = meshs[oName];

			if (target) {

				g = target.geometry;
				gm = morph[name];

				g.morphTargetsRelative = relative;

				if (g.attributes.position.count === gm.attributes.position.count) {

					if (!g.morphAttributes.position) {
						g.morphAttributes.position = [];
						if (normal) g.morphAttributes.normal = [];
						target.morphTargetInfluences = [];
						target.morphTargetDictionary = {};
					}

					id = g.morphAttributes.position.length;

					// position
					if (relative) {
						j = gm.attributes.position.array.length;
						ar = [];
						while (j--) ar[j] = gm.attributes.position.array[j] - g.attributes.position.array[j];
						dp = new Float32BufferAttribute(ar, 3);
					} else {
						dp = new Float32BufferAttribute(gm.attributes.position.array, 3);
					}

					g.morphAttributes.position.push(dp);

					// normal
					if (normal) {
						/*if( relative ){
							j = gm.attributes.normal.length;
							ar = [];
							while(j--) ar[j] = gm.attributes.normal.array[j] - g.attributes.normal.array[j]
							dn = new Float32BufferAttribute( ar, 3 );
						} else {
							dn = new Float32BufferAttribute( gm.attributes.normal.array, 3 );
						}*/

						dn = new Float32BufferAttribute(gm.attributes.normal.array, 3);

						g.morphAttributes.normal.push(dn);

					}

					target.morphTargetInfluences.push(0);
					target.morphTargetDictionary[tName] = id;

					/*if( !target.morph ) {
						target.morph = function ( name, value ){
							//console.log(this.morphTargetInfluences)
							if(!this.morphTargetInfluences) return
							if(this.morphTargetDictionary[name] === undefined ) return
							this.morphTargetInfluences[ this.morphTargetDictionary[name] ] = value;
						}

					    
					}*/
					//console.log( target.name + ' have morph call '+ tName )

				} else {
					console.warn('Morph ' + tName + ' target is no good on ' + target.name);
				}

			}

		}

		morph = {};

		// claer garbege
		j = tmpMesh.length;
		while (j--) {
			m = tmpMesh[j];
			if (m.parent) m.parent.remove(m);
			if (m.material) m.material.dispose();
			if (m.geometry) m.geometry.dispose();
		}

	},


};

/** __
*    _)_|_|_
*   __) |_| | 2023
* @author lo.th / https://github.com/lo-th
*/

const Pool = {

	msg: '',
	inLoad: false,

	clip: [],
	data: new Map(),
	tmp: [],
	//extraTexture: [],
	dracoLoader: null,
	dracoLoaderType: 'js',
	dracoPath: './phy/libs/draco/',

	maxAnisotropy: 1,

	onLoad: () => { },
	onEnd: () => { },
	log: (msg) => { },

	materialRoot: (n) => { console.log(n); },

	setLoadEvent: (onload, onend) => {
		Pool.onLoad = onload;
		Pool.onEnd = onend;
	},

	prefix: (type) => {
		let p = '';
		switch (type) {
			case 'S': case 'sound': case 'mp3': case 'wav': case 'ogg': p = 'S_'; break;
			case 'I': case 'image': case 'jpg': case 'png': p = 'I_'; break;
			case 'E': case 'hdr': case 'env': p = 'T_'; break;
			case 'J': case 'json': p = 'J_'; break;
			case 'JS': case 'js': p = 'JS_'; break;

			case 'O': case 'object3d': p = 'O_'; break;
			case 'M': case 'material': p = 'M_'; break;
			case 'T': case 'texture': p = 'T_'; break;
		}
		return p
	},

	dispose: () => {

		Pool.data.forEach(function (node, key) {

			if (node.isMaterial || node.isTexture) {
				node.dispose();
				Pool.data.delete(key);
				//console.log( key + ' is delete')
			}

			if (node.isObject3D) {
				node.traverse(function (snode) {
					if (snode.isMesh) {
						if (snode.geometry) snode.geometry.dispose();
						if (snode.material) snode.material.dispose();
					}
				});
				Pool.data.delete(key);
			}


		});

		//console.log('clear extra texture !!')
		/*let i = Pool.extraTexture.length
		while(i--){
			let p = Pool.get( Pool.extraTexture[i], 'T' )
			if(p) p.dispose();
			Pool.delete( Pool.extraTexture[i], 'T' )
		}
		Pool.extraTexture = [];*/

	},

	createElementNS: (name) => (document.createElementNS('http://www.w3.org/1999/xhtml', name)),
	exist: (name, type = '') => (Pool.get(name, type) ? true : false),
	delete: (name, type = '') => (Pool.data.delete(Pool.prefix(type) + name)),
	get: (name, type = '') => (Pool.data.get(Pool.prefix(type) + name)),

	set: (name, node, type = '', direct) => {
		if (node.isMaterial) {
			type = 'material';
			node.name = name;

			Pool.materialRoot(node, direct);
		}
		if (node.isTexture) type = 'texture';
		if (node.isObject3D) type = 'object3d';

		if (Pool.get(name, type)) return
		Pool.data.set(Pool.prefix(type) + name, node);
	},

	getScript: (name) => (Pool.data.get(Pool.prefix('js') + name)),

	getMaterials: (obj, toArray) => {
		if (typeof obj === 'string') obj = Pool.get(obj, 'O');
		return GlbTool.getMaterial(obj, toArray)
	},

	getMesh: (obj, keepMaterial) => {
		if (typeof obj === 'string') obj = Pool.get(obj, 'O');
		return GlbTool.getMesh(obj, keepMaterial)
	},

	getGroup: (obj, autoMesh, autoMaterial) => {
		if (typeof obj === 'string') obj = Pool.get(obj, 'O');
		return GlbTool.getGroup(obj, autoMesh, autoMaterial)
	},

	applyMorph(modelName, meshs = null, normal = true, relative = true) {

		let model;
		if (modelName.isObject3D) model = modelName;
		else model = Pool.get(modelName, 'O');

		if (!meshs) meshs = Pool.getMesh(modelName);
		if (!model || !meshs) return
		GlbTool.autoMorph(model, meshs, normal, relative);

	},

	uv2(model) {
		GlbTool.uv2(model);
	},

	add: (name, node, type) => {
		Pool.set(name, node, type);
		Pool.next();
		//console.log( name, type )
	},

	getMaterial: (name) => (Pool.data.get('M_' + name)),

	//getMap:( name, o = {} ) => ( Pool.getTexture(name, o) ),


	//--------------------
	//   TEXTURES
	//--------------------

	texture: (o = {}) => {

		if (!Pool.loaderMap) Pool.loaderMap = new TextureLoader();

		let name = o.name || '';

		if (o.url) {
			if (o.url.lastIndexOf('.') !== -1) name = o.url.substring(o.url.lastIndexOf('/') + 1, o.url.lastIndexOf('.'));
			else name = o.url.substring(o.url.lastIndexOf('/') + 1);
		}

		if (name.search('_c') !== -1 || name.search('_l') !== -1 || name.search('_u') !== -1 || name.search('_d') !== -1) o.srgb = true;

		if (Pool.exist(name, 'texture')) return Pool.get(name, 'texture');
		else if (Pool.exist(name, 'image')) {
			//console.log('preload', name )
			return Pool.getTexture(name, o);
		} else {

			return Pool.loaderMap.load(o.url, function (t) {
				//console.log('use TextureLoader !!', name )
				Pool.setTextureOption(t, o);
				Pool.data.set('T_' + name, t);
				if (o.callback) o.callback();
				return t
			})
		}



	},

	getTexture: (name, o = {}) => {

		let t = Pool.get(name, 'texture');
		if (!t) {
			let im = Pool.get(name, 'image');
			if (!im) {
				console.log('not find image', name);
				return null
			}
			t = new Texture(im);
			if (name.search('_c') !== -1 || name.search('_d') !== -1 || name.search('_l') !== -1 || name.search('_u') !== -1) o.srgb = true;
			Pool.data.set('T_' + name, t);
		}
		Pool.setTextureOption(t, o);
		return t;
	},

	setTextureOption: (t, o = {}) => {

		//if( o.colorSpace ) t.colorSpace = o.colorSpace;
		if (o.encoding) t.colorSpace = SRGBColorSpace;
		if (o.srgb) t.colorSpace = SRGBColorSpace;
		t.flipY = (o.flipY || o.flip) !== undefined ? o.flipY : false;
		t.anisotropy = o.anisotropy !== undefined ? o.anisotropy : Pool.maxAnisotropy;
		//if( o.anisotropy !== undefined ) t.anisotropy = o.anisotropy
		if (o.generateMipmaps !== undefined) t.generateMipmaps = o.generateMipmaps;
		if (o.repeat) {
			t.repeat.fromArray(o.repeat);
			t.wrapS = t.wrapT = RepeatWrapping;
		}

		if (o.center) t.center.fromArray(o.center);
		if (o.offset) t.offset.fromArray(o.offset);

		if (o.filter) {
			if (o.filter === 'near') {
				t.minFilter = NearestFilter;
				t.magFilter = NearestFilter;
			}
		}

		if (o.channel) t.channel = o.channel;
		t.needsUpdate = true;

	},



	///



	///

	load: (Urls, Callback, Path = '', msg = '') => {

		Pool.msg = msg;

		let urls = [];
		let callback = Callback || function () { };
		let start = (typeof performance === 'undefined' ? Date : performance).now();

		if (typeof Urls === 'string' || Urls instanceof String) urls.push(Urls);
		else urls = urls.concat(Urls);

		Pool.tmp.push({ urls: urls, path: Path, callback: callback, start: start });

		if (!Pool.inLoad) Pool.loadOne();

	},

	loadOne: () => {

		Pool.inLoad = true;
		Pool.onLoad();

		let url = Pool.tmp[0].path + Pool.tmp[0].urls[0];
		let name = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
		let type = url.substring(url.lastIndexOf('.') + 1).toLowerCase();

		if (Pool.exist(name, type)) Pool.next();
		else Pool.loading(url, name, type);

	},

	next: () => {

		Pool.tmp[0].urls.shift();

		if (Pool.tmp[0].urls.length === 0) {

			Math.floor((typeof performance === 'undefined' ? Date : performance).now() - Pool.tmp[0].start);

			//if( end !== 0 ) console.log( 'pool load time:', end, 'ms' );

			Pool.tmp[0].callback();
			Pool.tmp.shift();

			if (Pool.tmp.length > 0) Pool.loadOne();
			else {
				Pool.inLoad = false;
				Pool.onEnd();
			}

		} else {

			Pool.loadOne();

		}

	},

	loading: (url, name, type) => {

		Pool.log(Pool.msg);

		switch (type) {
			case 'glb': case 'gltf': Pool.load_GLTF(url, name); break;
			case 'fbx': case 'FBX': Pool.load_FBX(url, name); break;
			case 'hdr': Pool.load_RGBE(url, name); break;
			case 'exr': Pool.load_EXR(url, name); break;
			default: Pool.extand(url, name, type);
		}

	},

	extand: (url, name, type) => {

		if (!Pool.XHTTP) Pool.XHTTP = new XMLHttpRequest();
		const xml = Pool.XHTTP;

		xml.open('GET', url, true);
		if (type === "json") xml.overrideMimeType("application/json");

		switch (type) {

			case 'hex': case 'wasm': case 'mp3': case 'wav': case 'ogg': xml.responseType = "arraybuffer"; break;
			case 'jpg': case 'png': xml.responseType = 'blob'; break;
			case 'bvh': case 'glsl': case 'js': case 'json': xml.responseType = 'text'; break;

		}

		xml.onreadystatechange = function () {

			if (xml.readyState === 4) {
				if (xml.status >= 300) {
					console.log("Error, status code = " + xml.status);
				} else {
					Pool.direct(xml.response, name, type);
					//Pool.add( name, JSON.parse( xhr.responseText ), 'json' )
				}
				//if ( Pool.XML.status === 200 || Pool.XML.status === 0 ) Pool.load_direct( Pool.XML.response, name, type );
				//else console.error( "Couldn't load ["+ name + "] [" + Pool.XML.status + "]" );
			}

		};

		if ('onprogress' in xml) {
			xml.onprogress = function (e) {
				//console.log( parseInt((e.loaded / e.total) * 100) );
			};
		}

		xml.send(null);

	},

	direct: (response, name, type) => {

		switch (type) {
			case 'jpg': case 'png':
				let img = Pool.createElementNS('img');
				img.onload = function (e) {
					window.URL.revokeObjectURL(img.src); // Clean up after yourself.
					Pool.add(name, img, 'image');
				};
				img.src = window.URL.createObjectURL(response);

				/*let img = Pool.createElementNS('img');
				img.src = window.URL.createObjectURL( new Blob([response]) );
				//img.onload = function(){
					console.log(img)
					Pool.add( name, img, 'image' );
				//}*/
				break;
			case 'mp3': case 'wav': case 'ogg':
				new (window.AudioContext || window.webkitAudioContext)().decodeAudioData(
					response.slice(0),
					function (buffer) { Pool.add(name, buffer, 'sound'); },
					function (error) { console.error('decodeAudioData error', error); }
				);
				break;
			case 'hex': LzmaUnpack.parse(response, function (result) { Pool.add(name, result, type); }); break;
			case 'wasm': Pool.add(name, new Uint8Array(response), type); break;
			case 'json': Pool.add(name, JSON.parse(response), type); break;
			case 'js': Pool.add(name, response, type); break;
			default: Pool.add(name, response, type);

		}

	},

	//////////////////////////////////

	loaderDRACO: () => {

		if (Pool.dracoLoader) return Pool.dracoLoader

		if (!Pool.dracoLoaderType) {
			if (navigator.userAgentData) Pool.dracoLoaderType = 'wasm';
			else {
				let ua = navigator.userAgent.toLowerCase();
				Pool.dracoLoaderType = (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) ? 'js' : 'wasm';
			}
		}

		Pool.dracoLoader = new DRACOLoader().setDecoderPath(Pool.dracoPath);
		Pool.dracoLoader.setDecoderConfig({ type: Pool.dracoLoaderType });
		return Pool.dracoLoader

	},

	loaderGLTF: () => {

		if (!Pool.GLTF) {
			Pool.GLTF = new GLTFLoader();
			Pool.GLTF.setDRACOLoader(Pool.loaderDRACO());
		}
		return Pool.GLTF

	},

	loaderFBX: () => {

		if (!Pool.FBX) Pool.FBX = new FBXLoader();
		return Pool.FBX

	},

	loaderRGBE: () => {

		if (!Pool.RGBE) Pool.RGBE = new RGBELoader();
		return Pool.RGBE

	},

	loaderEXR: () => {

		if (!Pool.EXR) Pool.EXR = new EXRLoader();
		return Pool.EXR

	},

	//////////////////////////////////

	load_GLTF: (url, name) => {

		/*Pool.loaderGLTF().setDRACOLoader( Pool.loaderDRACO() ).load( url, function ( gltf ) { 
			Pool.add( name, gltf.scene )
			Pool.dracoLoader.dispose()
		})*/

		Pool.loaderGLTF().load(url, function (gltf) {

			const model = gltf.scene;

			//console.log(gltf.animations)

			if (gltf.animations) {
				const animations = gltf.animations;
				const mixer = new AnimationMixer(gltf.scene);
				model.mixer = mixer;
				model.actions = {};
				for (let i = 0; i < animations.length; i++) {
					let anim = animations[i];
					model.actions[anim.name] = mixer.clipAction(anim);
					//model.actions[ anim.name ].play()
				}

				model.play = (name) => {
					if (model.actions[name]) {
						model.actions[name].paused = false;
						model.actions[name].time = 0;
						model.actions[name].play();
					}
				};
				model.pause = (name, v = true) => {
					if (model.actions[name]) model.actions[name].paused = v;
				};
			}

			Pool.add(name, model);
		});

	},

	load_FBX: (url, name) => {

		Pool.loaderFBX().load(url, function (node) { Pool.add(name, node); });

	},

	load_RGBE: (url, name) => {

		Pool.loaderRGBE().load(url, function (texture) {
			texture.mapping = EquirectangularReflectionMapping;
			Pool.add(name, texture);
		});

	},

	load_EXR: (url, name, cb) => {

		Pool.loaderEXR().load(url, function (texture) {
			//Pool.add( name, texture ) 
			//console.log(texture)
			if (cb) cb(texture);
			return texture
		});

	},

	direct_EXR: (data, name) => {

		Pool.loaderEXR().parse(url, function (texture) {
			Pool.add(name, texture);

			return texture
		});

	},

};

class Tension {

	constructor(origin, target) {


		this.target = target || origin;

		this.baseGeometry = origin.geometry;
		this.geometry = this.target.geometry;

		this.V = [new Vector3(), new Vector3(), new Vector3()];
		this.X = [new Vector4(), new Vector4(), new Matrix4()];
		this.M = [new Vector3(), new Vector3(), new Vector3()];

		this.isMorph = this.target.morphTargetInfluences ? true : false;
		this.isSkin = this.target.isSkinnedMesh ? true : false;

		this.init();

	}

	init() {

		if (this.geometry.attributes.position.count !== this.baseGeometry.attributes.position.count) {
			console.log('object not have same number of vertices !!');
			return
		}

		this.length = this.baseGeometry.attributes.position.count;
		this.indexLength = this.baseGeometry.index.count / 3;

		//console.log( this.length, this.indexLength )


		this.originEdges = new Array(this.length).fill(0);
		this.targetEdges = new Array(this.length).fill(0);

		if (this.isSkin || this.isMorph) this.back = new Array(this.length * 3).fill(0);
		this.num = new Array(this.length).fill(0);

		this.getEdge(this.baseGeometry, this.originEdges);
		this.addColor();

		setTimeout(this.start.bind(this), 100);

	}

	start() {
		this.ready = true;
		this.update();
	}

	addColor() {

		const g = this.geometry;
		//if( g.attributes.color ) return;
		let lng = g.attributes.position.array.length;
		g.setAttribute('color', new Float32BufferAttribute(new Array(lng).fill(0), 3));

	}

	resetEdge(edges) {
		let j = edges.length;
		while (j--) edges[j] = 0;
	}

	getEdge(g, edges, isSkin = false, isMorph = false) {
		let positions = g.attributes.position.array;
		const indices = g.index.array;
		let vA = this.V[0], vB = this.V[1], vC = this.V[2];
		let j, i = 0, a, b, c, ab, ac, bc;

		if (isMorph) positions = this.getMorph();
		if (isSkin) positions = this.getSkinned(positions);
		if (isSkin || isMorph) this.resetEdge(edges);

		j = this.indexLength;

		while (j--) {
			a = indices[i];
			b = indices[i + 1];
			c = indices[i + 2];
			vA.fromArray(positions, a * 3);
			vB.fromArray(positions, b * 3);
			vC.fromArray(positions, c * 3);

			ab = vA.distanceTo(vB);
			ac = vA.distanceTo(vC);
			bc = vB.distanceTo(vC);


			edges[a] += (ab + ac) * 0.5;
			edges[b] += (ab + bc) * 0.5;
			edges[c] += (ac + bc) * 0.5;

			/*
			edges[a] += (ab + ac);
			edges[b] += (ab + bc);
			edges[c] += (ac + bc);

			num[a] += 2;
			num[b] += 2;
			num[c] += 2;
			*/

			i += 3;
		}

		//j = this.length;
		//while( j-- ){ edges[j] /= num[j]; }
	}

	isZero(v) {

		if (v.x === 0 && v.y === 0 && v.z === 0) return true
		return false

	}

	getMorph() {
		const morphInfluences = this.target.morphTargetInfluences;
		const morphRef = this.geometry.morphAttributes.position;
		const morphsMax = morphInfluences.length;
		const position = this.geometry.attributes.position.array;
		let lng = this.geometry.attributes.position.count, id, i, j;
		let vertex = this.M[0];
		let base = this.M[1];
		let temp = this.M[2];
		let relative = this.geometry.morphTargetsRelative;
		let data;

		// the following code section is normally implemented in the vertex shader

		i = lng;
		while (i--) {
			id = i * 3;
			base.fromArray(position, id);
			vertex.set(0, 0, 0);
			j = morphsMax;
			while (j--) {

				if (morphInfluences[j] != 0.0) {
					data = morphRef[j].data ? morphRef[j].data.array : morphRef[j].array;
					if (relative) vertex.addScaledVector(temp.fromArray(data, id), morphInfluences[j]);
					else vertex.addScaledVector(temp.fromArray(data, id).sub(base), morphInfluences[j]);
				}

			}
			base.add(vertex);
			base.toArray(this.back, id);
		}
		return this.back

	}

	getSkinned(position) {

		const skeleton = this.target.skeleton;
		skeleton.boneMatrices;
		const geometry = this.geometry;
		//const position = geometry.attributes.position.array;
		const skinIndex = geometry.attributes.skinIndex.array;
		const skinWeigth = geometry.attributes.skinWeight.array;

		const bindMatrix = this.target.bindMatrix;
		const bindMatrixInverse = this.target.bindMatrixInverse;

		let vertex = this.V[0];
		let skin = this.V[1];
		let temp = this.V[2];
		let skinIndices = this.X[0];
		let skinWeights = this.X[1];
		let boneMatrix = this.X[2];

		let lng = geometry.attributes.position.count;
		let i, j, boneIndex, weight, id;

		// the following code section is normally implemented in the vertex shader
		i = lng;
		while (i--) {
			id = i * 3;
			skinIndices.fromArray(skinIndex, i * 4);
			skinWeights.fromArray(skinWeigth, i * 4);
			vertex.fromArray(position, id).applyMatrix4(bindMatrix); // transform to bind space
			skin.set(0, 0, 0);
			j = 4;
			while (j--) {
				weight = skinWeights.getComponent(j);
				if (weight > 0) {
					boneIndex = skinIndices.getComponent(j);
					boneMatrix.multiplyMatrices(skeleton.bones[boneIndex].matrixWorld, skeleton.boneInverses[boneIndex]);
					// weighted vertex transformation
					skin.addScaledVector(temp.copy(vertex).applyMatrix4(boneMatrix), weight);
				}

			}

			skin.applyMatrix4(bindMatrixInverse); // back to local space
			skin.toArray(this.back, id);
		}
		return this.back
	}

	update() {

		if (!this.ready) return

		this.getEdge(this.geometry, this.targetEdges, this.isSkin, this.isMorph);
		const color = this.geometry.attributes.color.array;
		let o, delta, n, i = this.length;

		while (i--) {
			o = this.originEdges[i];
			delta = ((o - this.targetEdges[i]) / o) + 0.5;
			n = i * 3;
			color[n] = delta > 0.5 ? (delta - 0.5) * 2 : 0;
			color[n + 1] = 0;
			color[n + 2] = delta < 0.5 ? (1 - (delta * 2)) : 0;
		}
		this.geometry.attributes.color.needsUpdate = true;
	}

}

class ExoSkeleton extends Object3D {

	constructor(object, skeleton) {

		super();

		this.isReady = false;

		this.skeleton = skeleton;

		this.bones = this.skeleton.bones;//getBoneList( object );
		this.root = object;

		this.box = new BoxGeometry();

		//console.log(this.bones)

		//this.avatar = avatar;
		//this.nodes = [];
		this.mtxr = new Matrix4();
		this.mtx0 = new Matrix4();
		this.mtx1 = new Matrix4();

		this.mtx = new Matrix4();
		this.mtx2 = new Matrix4();

		this.p = new Vector3();
		this.s = new Vector3();
		this.q = new Quaternion();
		this.e = new Euler();

		this.mat = new MeshBasicMaterial({ color: 0xCCCC80, wireframe: true, toneMapped: false });//root.mat.skinCollider;

		this.init();

		this.matrix = object.matrixWorld;
		this.matrixAutoUpdate = false;

	}

	updateMatrixWorld(force) {

		if (!this.isReady) return;

		//THREE.Object3D.prototype.updateMatrixWorld.call( this, force );

		let nodes = this.children;
		let i = nodes.length, node, bone;

		this.mtxr.copy(this.root.matrixWorld).invert();

		//console.log('up', i)

		while (i--) {

			node = nodes[i];
			bone = node.userData.bone;

			//this.mtx1.fromArray( this.skeleton.boneMatrices, bone.idx )

			this.mtx0.multiplyMatrices(this.mtxr, bone.matrixWorld);
			//this.mtx0.scale( bone.scalling );

			this.mtx.multiplyMatrices(this.mtx0, node.userData.decal);
			//this.mtx.multiplyMatrices( this.mtx1, this.mtx );


			this.mtx.decompose(this.p, this.q, this.s);


			node.position.copy(this.p);
			node.quaternion.copy(this.q);

			node.updateMatrix();

		}

		super.updateMatrixWorld(force);

	}

	init() {

		this.mtxr.copy(this.root.matrixWorld).invert();

		// get character bones
		const bones = this.bones; //object.skeleton.bones;
		//let nodes = [];

		let p1 = new Vector3();
		let p2 = new Vector3();

		let i, lng = bones.length, name, n, bone, parent;
		let size, dist, type, translate, rot, fx;

		for (i = 0; i < lng; i++) {

			type = null;
			bone = bones[i];
			name = bone.name;
			parent = bone.parent;

			//bone.updateMatrix()


			if (parent) {

				//parent.updateMatrix()

				n = parent.name;

				p1.setFromMatrixPosition(parent.matrixWorld);
				p2.setFromMatrixPosition(bone.matrixWorld);

				//p1.setFromMatrixPosition( this.mtx.multiplyMatrices(this.mtxr, parent.matrixWorld ) ) //parent.matrixWorld );
				//p2.setFromMatrixPosition( this.mtx.multiplyMatrices(this.mtxr, bone.matrixWorld ) ) //bone.matrixWorld );
				dist = p1.distanceTo(p2);

				//console.log(n, dist)

				translate = [0, 0, dist * 0.5];
				size = [dist, 1, 1];
				rot = [0, 0, 0];

				fx = '_C';

				if (n === 'head' && name === 'End_head') { type = 'box'; size = [0.16, 0.2, dist]; translate = [0, 0.025, -dist * 0.5]; }
				if (n === 'chest' && name === 'neck') { type = 'box'; size = [0.30, 0.28, dist]; translate = [0, 0, -dist * 0.5]; }
				if (n === 'abdomen') { type = 'box'; size = [0.28, 0.24, dist + 0.14]; rot[2] = 0; translate = [0, 0, -dist * 0.5]; translate[2] += 0.07; }

				// legs
				if (n === 'rThigh') { type = 'box'; size = [0.15, 0.15, dist]; }
				if (n === 'lThigh') { type = 'box'; size = [0.15, 0.15, dist]; }
				if (n === 'rShin') { type = 'box'; size = [0.12, 0.12, dist + 0.1,]; translate[2] += 0.05; }
				if (n === 'lShin') { type = 'box'; size = [0.12, 0.12, dist + 0.1,]; translate[2] += 0.05; }

				// arm
				if (n === 'rShldr') { type = 'box'; size = [dist + 0.06, 0.12, 0.12]; translate[0] = -translate[2] + 0.03; translate[2] = 0; }
				if (n === 'lShldr') { type = 'box'; size = [dist + 0.06, 0.12, 0.12,]; translate[0] = translate[2] - 0.03; translate[2] = 0; }
				if (n === 'rForeArm') { type = 'box'; size = [dist + 0.1, 0.1, 0.1]; translate[0] = -translate[2] - 0.05; translate[2] = 0; }
				if (n === 'lForeArm') { type = 'box'; size = [dist + 0.1, 0.1, 0.1]; translate[0] = translate[2] + 0.05; translate[2] = 0; }

				if (type !== null) this.addMesh(parent, type, size, translate, rot, fx);

			}
		}

		this.isReady = true;

	}

	addMesh(parent, type, size, translate, rot, fx) {

		// translation
		//this.mtx.makeTranslation( translate[0], translate[1], translate[2] );
		this.mtx.makeTranslation(translate[0], translate[1], translate[2]);
		// rotation
		//this.mtx2.makeRotationFromEuler( this.e.set( rot[0]*math.torad, rot[1]*math.torad, rot[2]*math.torad ) );
		//this.mtx.multiply( this.mtx2 );

		//let box = new BoxGeometry( size[0], size[1], size[2])


		var mesh = new Mesh(this.box, this.mat);
		mesh.scale.fromArray(size);

		//mesh.name = fx;
		mesh.userData.decal = this.mtx.clone();
		mesh.userData.bone = parent;
		mesh.userData.size = size;


		this.add(mesh);

		//mesh.userData.avatar = this.avatar;

	}

	dispose() {
		this.children = [];
		this.box.dispose();
		this.mat.dispose();
		this.isReady = false;
	}

}

/*
function getBoneList( object ) {

	const boneList = [];

	if ( object.isBone === true ) {

		boneList.push( object );

	}

	for ( let i = 0; i < object.children.length; i ++ ) {

		boneList.push.apply( boneList, getBoneList( object.children[ i ] ) );

	}

	return boneList;

}*/

const setting$2 = {

	mixRatio: 0.0,
	threshold: 0.1,
	normal: 0.25,
	hair: 0xa43412,
	bow: 0x100402,
	sheen: 1,//2.25,
	sheenRoughness: 1.0,//1.0,
	metalness: 0.6,
	roughness: 0.4,

	vertexColors: false,
	alphaTest: 0.3,
	h_metal: 0.4,
	h_rough: 0.6,
	clearcoat: 1.0,

	wireframe: false,
	transparent: false,
	opacity: 1.0,

};

const Human = {

	isBreath: false,
	isEyeMove: false,
	haveMorph: false,


	skeletonRef: 'body',
	fullMorph: ['MUSCLE', 'LOW', 'BIG', 'MONSTER'],

	haveQuality: true,
	textureRef: 'avatar_c',
	texturePath: 'assets/textures/avatar_',
	textures: [
		'avatar_c.jpg', 'avatar_n.jpg', 'avatar_m.jpg', 'avatar_r.jpg', 'avatar_u.jpg',
		'mouth_c.jpg', 'mouth_a.jpg', 'mouth_n.jpg',
		'eye_c.jpg', 'eye_n.jpg', 'hair.jpg', 'hair_a.jpg',
		'eyelash_c.jpg', 'eyelash_a.jpg', 'eyelash_n.jpg',
		'hair_man.jpg', 'hair_man_a.jpg', //'avatar_ao.jpg',
	],

	modelPath: 'assets/models/avatar/',
	forceModel: null,

	setting: setting$2,

	materialRef: 'skin',
	materials: {
		skin: {
			type: 'Physical',
			map: 'avatar_c',
			normalMap: 'avatar_n',
			roughness: 1,
			metalness: 1,
			metalnessMap: 'avatar_m',
			roughnessMap: 'avatar_r',
			normalScale: new Vector2(setting$2.normal, -setting$2.normal),

			sheen: setting$2.sheen,
			sheenRoughness: setting$2.sheenRoughness,
			sheenColor: 0xffffff,
			sheenColorMap: 'avatar_u',
			iridescence: 1.0,
			wireframe: setting$2.wireframe,

			/*aoMap:'avatar_ao',
			aoMapIntensity:1,*/


			//envMapIntensity:1,

		},
		mouth: {
			type: 'Standard',
			map: 'mouth_c',
			roughness: 0.6,
			metalness: 0.6,
			alphaMap: 'mouth_a',
			alphaTest: 0.5,
			normalMap: 'mouth_n'
		},
		sub_eye: {
			type: 'Physical',
			roughness: 0,//0.568,
			metalness: 1,
			ior: 1.376,
			opacity: 1,
			blending: AdditiveBlending,
			clearcoat: 1,
			transparent: true,
			envMapIntensity: 0,
			//wireframe:true
		},
		eye: {
			type: 'Physical',
			map: 'eye_c',
			roughness: 0.7,
			metalness: 0.15,
			normalMap: 'eye_n',
			normalScale: new Vector2(2, -2),
			clearcoat: 0.25,
			//clearcoatRoughness:0.5,
		},
		hair: {
			type: 'Standard',
			map: 'hair',
			color: setting$2.hair,
			roughness: setting$2.h_rough,
			metalness: setting$2.h_metal,
			alphaMap: 'hair_a',
			alphaTest: setting$2.alphaTest,
			side: DoubleSide,
			opacity: 1.0,
			transparent: true,
			blending: CustomBlending,
			blendDst: ZeroFactor,
			blendDstAlpha: SrcAlphaFactor,
			alphaToCoverage: true,
		},
		hair_man: {
			type: 'Standard',
			map: 'hair_man',
			color: setting$2.hair,
			roughness: setting$2.h_rough,
			metalness: setting$2.h_metal,
			alphaMap: 'hair_man_a',
			alphaTest: setting$2.alphaTest,
			side: DoubleSide,
			opacity: 1.0,
			transparent: true,
			blending: CustomBlending,
			blendDst: ZeroFactor,
			blendDstAlpha: SrcAlphaFactor,
			alphaToCoverage: true,
		},
		eyelash: {
			type: 'Standard',
			color: setting$2.hair,
			map: 'eyelash_c',
			roughness: setting$2.h_rough,
			metalness: setting$2.h_metal,
			alphaMap: 'eyelash_a',
			alphaTest: setting$2.alphaTest,
			transparent: true,
			opacity: 1,
			side: DoubleSide,
			alphaToCoverage: true,
			polygonOffset: true,
			polygonOffsetFactor: - 4,
			//normalMap:'eyelash_n',
			//normalScale:new Vector2( 1, -1)
		},
		tear: {
			type: 'Physical',
			map: 'eyelash_c',
			roughness: 0.5,
			metalness: 0.5,
			alphaMap: 'eyelash_a',
			transparent: true,
			alphaToCoverage: true,
			opacity: 1,
		},
		low: {
			type: 'Basic',
			color: 0x000000,
			wireframe: true,
		}

	},

	changeMaterial: (sx = {}, def = false) => {

		if (!Pool.getMaterial(Human.materialRef)) return

		const s = Human.setting;
		const defMat = Human.materials;

		let change = false;

		for (let v in sx) {
			if (s[v] !== undefined) {
				if (s[v] !== sx[v]) {
					s[v] = sx[v];
					change = true;
				}
			}
		}

		let m;

		if (change) {

			for (let key in defMat) {
				m = Pool.getMaterial(key);
				for (let v in sx) {
					if (m[v] !== undefined) {

						if (def && defMat[key][v]) m[v] = defMat[key][v];
						else m[v] = sx[v];

					}
				}
			}

		}



		/*
		 m = Pool.getMaterial( 'skin' );
	    
		//m.roughness = s.roughness;
		//m.metalness = s.metalness;
		m.wireframe = s.wireframe;
		m.vertexColors = s.vertexColors;
		m.normalScale.set( s.normal, -s.normal )
		m.sheen = s.sheen;
		m.sheenRoughness = s.sheenRoughness;
		*/

		/* let c = s.hair;
		 m = Pool.getMaterial( 'hair' )
		 m.color.setHex( c )
		 m.alphaTest = s.alphaTest
		 m.metalness = s.h_metal
		 m.roughness = s.h_rough
		 m = Pool.getMaterial( 'hair_man' )
		 m.color.setHex( c )
		 m.alphaTest = s.alphaTest
		 m.metalness = s.h_metal
		 m.roughness = s.h_rough
		 m = Pool.getMaterial( 'eyelash' )
		 m.color.setHex( c )
		 m.alphaTest = s.alphaTest
		 m.metalness = s.h_metal
		 m.roughness = s.h_rough*/

		//if( s.vertexColors && m.map !== null ){ m.map = null; this.tensionActive = true; m.sheen = 0;}
		///if( !s.vertexColors && m.map === null ){ m.map = this.skin; this.tensionActive = false; }

	},



	applyMaterial: (root, model) => {

		// apply Material

		const def = Pool.getMaterial('skin');

		root.traverse((node) => {

			if (node.isMesh) {
				switch (node.name) {
					case 'body':

						//Pool.addUv2( node )
						node.material = def;
						node.receiveShadow = true;
						node.castShadow = true;
						break;
					case 'body_low':
						node.material = def;
						node.receiveShadow = false;
						node.castShadow = false;
						node.visible = false;
						break;
					case 'Head':
						//Pool.addUv2( node )
						node.material = def;
						node.receiveShadow = true;
						node.castShadow = true;
						break;
					case 'mouth':
						node.material = Pool.getMaterial('mouth') || def;
						node.receiveShadow = false;
						node.castShadow = false;
						break;
					case 'eyelash': case 'eyebrow':
						node.material = Pool.getMaterial('eyelash') || def;
						node.receiveShadow = false;
						node.castShadow = false;
						break;
					case 'tear':
						node.material = Pool.getMaterial('tear') || def;
						node.receiveShadow = false;
						node.castShadow = false;
						break;
					case 'eye_l': case 'eye_r':
						node.material = Pool.getMaterial('eye') || def;
						node.receiveShadow = false;
						node.castShadow = false;
						break;
					case 'eye_l_s': case 'eye_r_s':
						node.material = Pool.getMaterial('sub_eye') || def;
						node.receiveShadow = false;
						node.castShadow = false;
						//node.visible = false
						break;
					case 'hair':
						node.material = Pool.getMaterial('hair') || def;
						node.receiveShadow = false;
						node.castShadow = true;
						node.matrixWorldAutoUpdate = false;
						break;
					case 'hair_man':
						node.material = Pool.getMaterial('hair_man') || def;
						node.receiveShadow = false;
						node.castShadow = true;
						node.matrixWorldAutoUpdate = false;
						break;
				}
			}

		});

	},





};

const setting$1 = {

	metalness: 0.6,
	roughness: 0.1,
	clearcoat: 1.0,
	wireframe: false,

};

const Eva = {

	decalY: 0.02,

	isBreath: false,
	isEyeMove: false,
	haveMorph: false,

	skeletonRef: 'eva_SKIN',

	fullMorph: [],

	haveQuality: false,
	skinRef: 'eva_00',
	texturePath: 'assets/textures/eva/',
	textures: ['eva00_c.jpg', 'eva01_c.jpg', 'eva02_c.jpg', 'eva_l.jpg'],

	modelPath: 'assets/models/',
	forceModel: 'eva',

	setting: setting$1,

	materialRef: 'eva00',
	materials: {
		eva00: {
			type: 'Physical',
			map: 'eva00_c',
			emissiveMap: 'eva_l',
			emissive: 0xffffff,
			roughness: setting$1.roughness,
			metalness: setting$1.metalness,
			wireframe: setting$1.wireframe,
			clearcoat: setting$1.clearcoat,
			iridescence: 0.5,
		},
		eva01: {
			type: 'Physical',
			map: 'eva01_c',
			emissiveMap: 'eva_l',
			emissive: 0xffffff,
			roughness: setting$1.roughness,
			metalness: setting$1.metalness,
			wireframe: setting$1.wireframe,
			clearcoat: setting$1.clearcoat,
			iridescence: 0.5,
		},
		eva02: {
			type: 'Physical',
			map: 'eva02_c',
			emissiveMap: 'eva_l',
			emissive: 0xffffff,
			roughness: setting$1.roughness,
			metalness: setting$1.metalness,
			wireframe: setting$1.wireframe,
			clearcoat: setting$1.clearcoat,
			iridescence: 0.5,
		}
	},

	changeMaterial: (sx, def = false) => {

		if (!Pool.getMaterial(Eva.materialRef)) return

		//const s = Eva.setting;
		const defMat = Eva.materials;

		/*let change = false;

		for(let v in sx){
			if(s[v]!== undefined){ 
				if(s[v] !== sx[v]){ 
					s[v] = sx[v]
					change = true;
				}}
		}*/

		let m;

		//if(change){

		for (let key in defMat) {
			m = Pool.getMaterial(key);
			for (let v in sx) {
				if (m[v] !== undefined) {
					if (def && defMat[key][v]) m[v] = defMat[key][v];
					else m[v] = sx[v];
				}
			}
			m.needsUpdate = true;
		}

		//}

		/*

		const s = Eva.setting;

		if(Setting){
			for(let o in Setting){
				if( s[o] !== undefined) s[o] = Setting[o]
			}
		}
	    
		let m = Pool.getMaterial( 'eva00' );
		m.roughness = s.roughness;
		m.metalness = s.metalness;
		m.wireframe = s.wireframe;
		m.clearcoat = s.clearcoat;
		m = Pool.getMaterial( 'eva01' );
		m.roughness = s.roughness;
		m.metalness = s.metalness;
		m.wireframe = s.wireframe;
		m.clearcoat = s.clearcoat;
		m = Pool.getMaterial( 'eva02' );
		m.roughness = s.roughness;
		m.metalness = s.metalness;
		m.wireframe = s.wireframe;
		m.clearcoat = s.clearcoat;*/

	},

	applyMaterial: (root, model) => {

		const def = Pool.getMaterial(model);

		root.traverse((node) => {

			if (node.isMesh) {

				node.material = def;
				node.receiveShadow = true;
				node.castShadow = true;
				//node.matrixWorldAutoUpdate = false

				switch (node.name) {

					case 'eva_2_head': case 'eva_2_mach':
						node.visible = model === 'eva02' ? true : false;
						break;

					case 'eva_L_COLLAR': case 'eva_R_COLLAR':
						node.visible = model === 'eva00' ? false : true;
						break;

					case 'eva_HEAD': case 'eva_MACHOIR':
						node.visible = model === 'eva01' ? true : false;
						break;

					case 'eva_0_R_COLLAR': case 'eva_0_L_COLLAR': case 'eva_0_head': case 'eva_0_head2':
						node.visible = model === 'eva00' ? true : false;
						break;

					case 'eva_0_CHEST2':
						node.visible = model === 'eva01' ? false : true;
						break;
				}
			}

		});

	}




};

const setting = {

	metalness: 0.2,
	roughness: 0.8,
	wireframe: false,

};

const Lee = {

	decalY: -0.06,

	isBreath: false,
	isEyeMove: false,
	haveMorph: false,

	skeletonRef: 'leeSkin',

	fullMorph: [],

	haveQuality: false,
	//skinRef:'leeSkin',
	texturePath: 'assets/textures/',
	textures: ['lee_c.jpg', 'lee_ao.jpg'],

	modelPath: 'assets/models/',
	forceModel: 'lee',

	setting: setting,

	materialRef: 'lee_material',
	materials: {
		lee_material: {
			type: 'Physical',
			map: 'lee_c',

			roughness: 0.3,
			metalness: 0.08,
			//aoMap: 'lee_ao',
			wireframe: setting.wireframe,
			sheen: 2.2,
			//emissive:0xFFFFFF,
			//emissiveMap:'lee_c',
			sheenColorMap: 'lee_c',
			sheenColor: 0xFFFFFF,
			sheenRoughness: 0.4,
			envMapIntensity: 1,
			//aoMapIntensity:0.5,
			//emissiveIntensity:0.25,

		},
	},

	/*changeMaterial:( Setting ) => {

		const s = Lee.setting;

		if(Setting){
			for(let o in Setting){
				if( s[o] !== undefined) s[o] = Setting[o]
			}
		}
	    
		let m = Pool.getMaterial( 'lee_material' );
		m.roughness = s.roughness;
		m.metalness = s.metalness;
		m.wireframe = s.wireframe;

	},*/

	changeMaterial: (sx, def = false) => {

		if (!Pool.getMaterial(Lee.materialRef)) return

		const defMat = Lee.materials;
		let m;

		for (let key in defMat) {
			m = Pool.getMaterial(key);
			for (let v in sx) {
				if (m[v] !== undefined) {
					if (def && defMat[key][v]) m[v] = defMat[key][v];
					else m[v] = sx[v];
				}
			}
			//m.needsUpdate = true
		}

	},

	applyMaterial: (root, model) => {

		const def = Pool.getMaterial('lee_material');

		root.traverse((node) => {

			if (node.isMesh) {

				node.material = def;
				node.receiveShadow = true;
				node.castShadow = true;

			}

		});

	},

	adjustment: () => {

		return [
			//{name:'lShldr', values:[0,-70,0]},
			{ name: 'lHand', values: [-60, 0, 0] },
			//{name:'rShldr', values:[0,70,0]},
			{ name: 'rHand', values: [-60, 0, 0] }
		]

	}




};

/** __
*    _)_|_|_
*   __) |_| | 2023
*  @author lo.th / https://github.com/lo-th
* 
*  AVATAR
*/

const FrameTime = 30;
const TimeFrame = 1 / 30;
const torad = Math.PI / 180;
const todeg = 180 / Math.PI;
const V = new Vector3();

class Avatar extends Group {

	constructor(o = {}) {

		super();

		this.fixWeight = o.fixWeight !== undefined ? o.fixWeight : true;

		this.rootPath = o.path || './';
		this.lzmaPath = this.rootPath + 'src/libs/lzma_worker.js';
		Pool.dracoPath = this.rootPath + 'phy/libs/draco/';

		this.callback = o.callback || function () { };

		this.matrixAutoUpdate = false;
		this.isPause = true;

		this.textureQuality = o.quality || 1;

		this.model = o.type || 'man';
		this.startAnimation = o.anim || 'idle';

		this.ref = null;

		switch (this.model) {
			case 'lee': this.ref = Lee; break;
			case 'man': case 'woman': this.ref = Human; break;
			case 'eva00': case 'eva01': case 'eva02': this.ref = Eva; break;
		}


		this.compact = o.compact !== undefined ? o.compact : true;
		this.haveMorph = o.morph !== undefined ? o.morph : false;
		this.fullMaterial = o.material !== undefined ? o.material : true;

		this.size = o.size || 1;

		this.fullMorph = this.ref.fullMorph;


		this.skeleton = null;
		//this.root = null;
		this.mixer = null;
		this.mesh = {};
		this.bones = {};
		this.done = false;
		this.isClone = false;

		this.isBreath = this.ref.isBreath || false;
		this.isEyeMove = this.ref.isEyeMove || false;

		this.decalY = this.ref.decalY || 0;

		this.tensionTest = false;
		this.tensionActive = false;

		this.fixToe = false;
		this.clipsToesFix = [];

		this.n = Math.round(Math.random() * 1000);

		this.actions = new Map();
		this.current = null;
		this.old = null;

		this.breath = 0;
		this.breathSide = -1;

		this.q = new Quaternion().setFromAxisAngle({ x: 0, y: 1, z: 0 }, Math.PI * 0.5);
		this.headBoneLook = new Vector3();
		this.eyeTarget = new Group();//new AxesHelper(0.01)//
		this.eyeTarget.position.set(0, 1, 0);

		this.tmpMtx = new Matrix4();
		this.tmpQ = new Quaternion();

		this.setting = {};

		//this.initMaterial();

		this.root = Pool.get(this.ref.forceModel ? this.ref.forceModel : this.model, 'O');

		if (this.root) {
			this.isClone = true;
			this.tensionTest = false;
			this.root = clone(this.root);
			this.init();

		} else {
			if (this.fullMaterial) this.load();
			else this.loadModels();
		}

	}

	load() {

		this.skin = Pool.getTexture(this.ref.textureRef);
		if (!this.skin) {

			const path = this.rootPath + this.ref.texturePath + (this.ref.haveQuality ? this.textureQuality + 'k/' : '');
			Pool.load(this.ref.textures, this.loadModels.bind(this), path, 'loading images...');

		} else {

			this.loadModels();

		}

	}

	loadModels() {

		const model = this.ref.forceModel ? this.ref.forceModel : this.model;
		const asset = [model + '.glb'];
		const path = this.rootPath + this.ref.modelPath;
		if (this.ref.haveMorph && this.haveMorph) asset.push(model + '_morph.glb');
		Pool.load(asset, this.init.bind(this), path, 'loading models...');

	}

	update(delta) {

		if (!this.done) return;
		if (this.mixer) {

			this.mixer.update(delta);

			// blink
			const n = this.n;
			if (n <= 20) this.eyeControl((n * 0.05));
			if (n > 10 && n <= 40) this.eyeControl(1 - ((n - 20) * 0.05));
			this.n++;
			if (this.n === 1000) this.n = 0;

			if (!this.isClone) {
				this.look(delta * 10);
				this.breathing();
				this.autoToes();
			}

			if (this.tensionActive) {
				this.tension1.update();
				this.tension2.update();
			}

			/*if( this.ref.adjustment && !this.isClone ) {
				let dt = this.ref.adjustment()
				let m = dt.length, l
				while(m--){
					l = dt[m]
					this.setRot2( l.name, l.x, l.y, l.z )
				}
			}*/

			if (window.gui && this.current) {
				window.gui.updateTimeBarre(Math.round(this.current.time * FrameTime), this.current.frameMax);
			}
		}

	}

	look(delta) {

		if (!this.isEyeMove) return;
		if (this.isPause) return;

		const v = window.mouse || { x: 0, y: 0 };

		if (delta > 1) delta = 1;

		this.headBoneLook.lerp({ x: -(v.y * 20) * torad, y: 0, z: -(v.x * 20) * torad }, delta);
		this.eyeTarget.position.lerp({ x: v.x * 0.5, y: 1, z: -v.y * 0.25 }, delta);

		let e = this.headBoneLook;
		this.tmpQ.setFromEuler({ _x: e.x, _y: e.y, _z: e.z, _order: 'XYZ' }, false);
		this.bones.head.quaternion.multiply(this.tmpQ);

		let ER = this.bones.ER;
		let EL = this.bones.EL;
		let up = { x: 0, y: 0, z: 1 };

		this.tmpMtx.lookAt(EL.position, this.eyeTarget.position.clone().add({ x: 0.03, y: 0, z: -0.074 }), up);
		EL.quaternion.setFromRotationMatrix(this.tmpMtx).multiply(this.q);

		this.tmpMtx.lookAt(ER.position, this.eyeTarget.position.clone().add({ x: -0.03, y: 0, z: -0.074 }), up);
		ER.quaternion.setFromRotationMatrix(this.tmpMtx).multiply(this.q);

	}

	breathing() {

		if (!this.bones) return;
		if (!this.isBreath) return;
		if (!this.skeleton.setScalling) return;

		let a = this.breath * 0.01;

		if (this.breathSide > 0) {
			this.skeleton.setScalling(this.bones.chest, this.lerp(1, 1.02, a), this.lerp(1, 1.04, a), 1);
			this.skeleton.setScalling(this.bones.abdomen, 1, this.lerp(1, 0.92, a), 1);
		} else {
			this.skeleton.setScalling(this.bones.chest, this.lerp(1.02, 1, a), this.lerp(1.04, 1, a), 1);
			this.skeleton.setScalling(this.bones.abdomen, 1, this.lerp(0.92, 1, a), 1);
		}


		// !! just for testing 
		//this.skeleton.setScalling( this.bones.lShldr, 1.3, 2, 2 )
		//this.skeleton.setScalling( this.bones.lForeArm, 1.3, 2, 2 )

		this.breath++;
		if (this.breath === 100) { this.breath = 0; this.breathSide = this.breathSide > 0 ? -1 : 1; }

	}

	setPosition(x, y, z) {

		this.position.set(x, y, z);
		this.updateMatrix();

	}

	setRotation(x, y, z, a) {

		let r = this.lerp(this.rotation.y, y, a);
		this.rotation.set(x, r, z);
		this.updateMatrix();

	}

	lerp(x, y, t) { return (1 - t) * x + t * y }

	onReady() { }

	initMaterial() {

		if (Pool.getMaterial(this.ref.materialRef)) return

		if (!this.fullMaterial) {
			Pool.set(this.ref.materialRef, new MeshStandardMaterial());
			return
		}

		let m, type, data;

		for (const name in this.ref.materials) {

			data = { ...this.ref.materials[name] };
			type = data.type;
			delete data.type;
			for (const t in data) {

				if (t !== 'envMapIntensity') if (t === 'map' || t.search('Map') !== -1) data[t] = Pool.getTexture(data[t]);
			}
			if (type === 'Basic') m = new MeshBasicMaterial(data);
			else if (type === 'Standard') m = new MeshStandardMaterial(data);
			else if (type === 'Physical') m = new MeshPhysicalMaterial(data);
			m.name = name;

			//console.log(m)
			//Shader.add( m )
			Pool.set(name, m);
		}

		this.setting = this.ref.setting;

	}


	setMaterial(s, b) {

		//console.log('material change !!')
		this.ref.changeMaterial(s, b);

	}

	getMaterial(name) {

		return Pool.getMaterial(name)

	}

	init() {

		this.initMaterial();

		if (!this.isClone) {
			this.root = Pool.get(this.ref.forceModel ? this.ref.forceModel : this.model, 'O');
			this.ref.applyMaterial(this.root, this.model);
		}

		if (this.ref.forceModel && this.isClone) this.ref.applyMaterial(this.root, this.model);

		// get data
		this.root.traverse(function (node) {

			node.raycast = function () { return };

			if (node.isMesh) {

				if (node.name === this.ref.skeletonRef) {
					node.matrixAutoUpdate = false;

					this.skeleton = node.skeleton;
					if (this.skeleton.resetScalling) this.skeleton.resetScalling();

					//console.log( node.geometry.boundingSphere, node.geometry.boundingBox, node.frustumCulled )
					//node.geometry.boundingSphere.radius = 0.1;
				}

				this.mesh[node.name] = node;
			}
			if (node.isBone) {
				this.bones[node.name] = node;
				//if(node.name==='rShldr' ) node.rotation.x = 80 * torad
				// console.log(node.name, node.rotation.x*todeg, node.rotation.y*todeg, node.rotation.z*todeg)
			}
		}.bind(this));

		if (this.ref.isEyeMove) {
			this.bones.neck.add(this.eyeTarget);
		}

		//if( !this.isClone ){
		// for extra skin
		for (let m in this.mesh) {
			if (this.mesh[m].isSkinnedMesh && m !== this.ref.skeletonRef) {
				this.mesh[m].skeleton.dispose();
				this.mesh[m].skeleton = this.skeleton;
			}
		}

		if (!this.isClone) {
			// add morph 
			if (this.haveMorph) Pool.applyMorph(this.model + '_morph', this.mesh, true, false);
			Pool.set(this.model, this.root, 'O');

		}

		if (this.size !== 1) this.root.scale.set(1, 1, 1).multiplyScalar(this.size);

		//if( this.tensionTest ) this.addTensionMap()



		// animation
		this.mixer = new AnimationMixer(this);



		if (Pool.clip.length === 0) {
			// load animation include in json or the compacted version
			if (this.compact) this.loadCompactAnimation(this.rootPath + 'assets/animation/animations.bin');
			else this.loadAnimationJson(this.rootPath + 'assets/animation/animations.json', this.start.bind(this));

		} else {
			let i = Pool.clip.length;
			while (i--) this.addAction(Pool.clip[i]);
			this.start();
		}



	}

	addTensionMap() {

		this.tension1 = new Tension(this.mesh.body);
		this.tension2 = new Tension(this.mesh.Head);
	}

	setBounding(r) {

		for (let m in this.mesh) {
			if (this.mesh[m].isMesh) {
				this.mesh[m].geometry.boundingSphere.radius = r;
			}
		}

	}

	/*setBoneScale( v ){

		const ingnor = [ 'head', 'lToes', 'rToes', 'rCollar', 'lCollar', 'rBreast', 'lBreast', 'neck'];
		const center = ['hip', 'abdomen', 'chest'];
		const legs = ['lThigh', 'rThigh', 'lShin', 'rShin'];
		const b = this.bones

		for( let n in b ){
			if(ingnor.indexOf(n) === -1) {
				if(center.indexOf(n) !== -1) b[n].scalling.z = v
				else if(legs.indexOf(n) !== -1) b[n].scalling.z = v
				else if( n === 'root' ) b[n].scalling.y = v
				else if( n === 'rFoot' || n === 'lFoot') b[n].scalling.y = v
				else b[n].scalling.x = v
			} 
		}

		this.setBounding(v)
	}*/


	eyeControl(v) {

		this.setMorph('EyeBlink', v);

	}

	setMorph(name, v) {

		if (!this.haveMorph) return
		this.morpher('eyelash', name, v);
		this.morpher('eyebrow', name, v);
		this.morpher('tear', name, v);
		this.morpher('mouth', name, v);
		this.morpher('body', name, v);
		this.morpher('Head', name, v);
		this.morpher('body_low', name, v);
	}

	morpher(obj, name, value) {

		if (!this.mesh[obj]) return
		if (!this.mesh[obj].morphTargetInfluences) return
		if (this.mesh[obj].morphTargetDictionary[name] === undefined) return
		this.mesh[obj].morphTargetInfluences[this.mesh[obj].morphTargetDictionary[name]] = value;
	}

	lerp(x, y, t) { return (1 - t) * x + t * y; }

	clone(o) {

		return new this.constructor({ type: o.type }, this);

	}

	dispose() {

		if (this.exoskel) this.addExo();
		if (this.helper) this.addHelper();

		this.stop();
		//if( this.skeleton.resetScalling ) this.skeleton.resetScalling()
		this.mixer.uncacheRoot(this);

		//if(this.skeleton.boneTexture)this.skeleton.boneTexture.dispose();
		this.remove(this.root);

		this.skeleton.dispose();
		this.parent.remove(this);


		//console.log('hero remove')
		if (!this.isClone);
	}

	start() {


		if (this.done) return;

		//this.updateMatrix()

		this.done = true;

		this.add(this.root);

		this.onReady();
		this.playAll();

		this.play(this.startAnimation);


		if (this.ref.adjustment) {
			this.makePoseTrack('adjustment', this.ref.adjustment());
		}


		setTimeout(this.callback, 10);
		//this.callback()

	}

	addHelper() {

		if (this.helper) {
			this.helper.dispose();
			this.remove(this.helper);
			this.helper = null;
		} else {
			this.helper = new SkeletonHelper(this.root);
			this.helper.raycast = function () { return };
			this.helper.matrix = this.root.matrix;
			this.add(this.helper);
		}
	}

	addExo() {
		if (this.exoskel) {
			this.exoskel.dispose();
			this.remove(this.exoskel);
			this.exoskel = null;
		} else {
			this.exoskel = new ExoSkeleton(this.root, this.skeleton);
			this.exoskel.matrix = this.root.matrix;
			this.add(this.exoskel);

		}
		return this.exoskel;
	}

	attachToBone(m, b) {

		m.matrix = b.matrixWorld;
		m.matrixAutoUpdate = false;
	}

	loadAnimationJson(url, callback) {

		const request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				if (request.status === 200 || request.status === 0) {
					let data = JSON.parse(request.responseText);
					this.urls = [];
					for (let g in data) {
						if (g === 'main') this.urls.push(...data[g]);
						else this.urls.push(...data[g].map(x => g + '/' + x));
					}
					this.endCallback = callback || function () { };
					this.loadOne();
				}
			}
		}.bind(this);
		request.send();

	}

	loadOne() {

		let name = this.urls[0];
		this.loadAnimationFbx(this.rootPath + 'assets/animation/fbx/' + name + '.fbx', this.next.bind(this));

	}

	next() {

		this.urls.shift();
		if (this.urls.length === 0) this.endCallback();
		else this.loadOne();

	}

	loadCompactAnimation(url = './assets/models/animations.bin') {

		if (!this.lzma) this.lzma = new LZMA(this.lzmaPath);

		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		const glb = { animations: [] };
		const self = this;

		request.onload = function () {
			self.lzma.decompress(new Uint8Array(request.response), function (result) {
				const data = JSON.parse(result);

				for (let c in data) glb.animations.push(AnimationClip.parse(data[c]));
				//console.log( glb )
				self.applydAnimation(glb);
				self.start();
			});
		};
		request.send();

	}

	loadAnimationGlb(url, callback) {

		let name = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
		Pool.loaderGLTF().load(url, function (glb) {
			this.applydAnimation(glb, name);
			if (callback) callback();
		}.bind(this), null, callback);
	}

	directGlb(data, name) {

		Pool.loaderGLTF().parse(data, '', function (glb) {
			this.stop();
			this.applydAnimation(glb, name);
		}.bind(this));
	}

	loadAnimationFbx(url, callback) {

		//if( !this.loaderFbx ) this.loaderFbx = new FBXLoader();
		let name = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
		Pool.loaderFBX().load(url, function (node) {
			this.convertFbx(name, node.animations[0]);
			if (callback) callback();
		}.bind(this), null, callback);
	}

	directFbx(data, name) {

		//if( !this.loaderFbx ) this.loaderFbx = new FBXLoader();
		try {
			let node = Pool.loaderFBX().parse(data, '');
			this.convertFbx(name, node.animations[0], true);
		} catch (e) {
			console.error('bug', e);
		}
	}

	applydAnimation(glb, name) {

		let i = glb.animations.length, autoplay = false;
		if (i === 1) {
			if (name) glb.animations[0].name = name;
			autoplay = true;
		}
		while (i--) {
			this.addClip(glb.animations[i]);
			this.addAction(glb.animations[i], autoplay);
		}

	}

	addClip(clip, additive = false) {

		// Make the clip additive and remove the reference frame
		if (additive) {
			AnimationUtils.makeClipAdditive(clip);
			//clip = AnimationUtils.subclip( clip, clip.name, 2, 3, 30 );
		}

		///console.log(clip)

		let i = Pool.clip.length, removeId = -1;
		while (i--) { if (Pool.clip[i].name === clip.name) removeId = i; }
		if (removeId !== -1) Pool.clip.slice(removeId, 1);


		//clip.optimize();
		Pool.clip.push(clip);
	}

	addAction(clip, play) {

		const action = this.mixer.clipAction(clip);
		action.frameMax = Math.round(clip.duration * FrameTime);
		action.play();
		action.enabled = true;//false;
		if (clip.name.search('idle') !== -1) action.enabled = true;
		//action.setEffectiveWeight( 0 );
		if (clip.name === 'Jumping Up') action.loop = LoopPingPong;
		//action.play()
		this.actions.set(clip.name, action);

		if (clip.name.search('walk') !== -1) this.clipsToesFix.push(clip.name);
		if (clip.name.search('run') !== -1) this.clipsToesFix.push(clip.name);
		if (clip.name.search('strafe') !== -1) this.clipsToesFix.push(clip.name);
		if (clip.name.search('jog') !== -1) this.clipsToesFix.push(clip.name);
		if (clip.name.search('RUN') !== -1) this.clipsToesFix.push(clip.name);

		//console.log(clip)

		if (window.gui) window.gui.getAnimation();

		// if( play ) this.play( clip.name )


	}


	/// EXPORT

	getAnimation(toJson = false, fromPool = false) {

		let anim = [], n = 0;
		if (fromPool) {
			let i = Pool.clip.length;
			while (i--) {

				if (toJson) anim[n] = Pool.clip[n].toJSON();
				else anim[n] = Pool.clip[n];
				// delete animations[n].uuid
				n++;
			}
		} else {
			this.actions.forEach(function (action, key) {
				if (toJson) anim[n] = action._clip.toJSON();
				else anim[n] = action._clip;
				//delete data[n].uuid
				n++;
			});
		}

		return anim;

	}

	exportAnimationLzma(callback) {

		if (!this.lzma) this.lzma = new LZMA(this.lzmaPath);

		const data = this.getAnimation(true);

		this.lzma.compress(JSON.stringify(data), 2, function (result) {

			if (callback) callback({ name: 'animations', data: new Uint8Array(result), type: 'bin' });
			else {
				let link = document.createElement("a");
				link.style.display = "none";
				document.body.appendChild(link);
				link.href = URL.createObjectURL(new Blob([new Uint8Array(result)], { type: "application/octet-stream" }));
				link.download = 'animations.bin';
				link.click();
			}
		});
	}

	exportGLB(callback) {

		if (!this.exporter) this.exporter = new GLTFExporter();

		const animations = this.getAnimation();

		this.exporter.parse(this.root, function (gltf) {

			if (callback) callback({ name: 'model', data: gltf, type: 'glb' });
			else {
				let link = document.createElement("a");
				link.style.display = "none";
				document.body.appendChild(link);
				link.href = URL.createObjectURL(new Blob([gltf], { type: "application/octet-stream" }));
				link.download = 'model.glb';
				link.click();
			}

			//self.loader.parse( JSON.stringify(glb, null, 2), '', function (r){ console.log(r) } )

		}, null, { animations: animations, binary: true, onlyVisible: true });

	}

	armAngle() {

	}

	autoToes() {

		if (!this.fixToe) return;
		let r = this.getRot('rFoot');
		let l = this.getRot('lFoot');
		let v = this.getWorldPos('hip');
		let v0 = this.getWorldPos('rToes');
		let v1 = this.getWorldPos('lToes');
		if (r[0] > 0 && (v0.z - v.z) < 0) this.setRot('rToes', -r[0] * 1.5, 0, 0);
		else if (r[0] !== 0) this.setRot('rToes', 0, 0, 0);
		if (l[0] > 0 && (v1.z - v.z) < 0) this.setRot('lToes', -l[0] * 1.5, 0, 0);
		else if (l[0] !== 0) this.setRot('lToes', 0, 0, 0);
	}

	resetToes() {

		if (!this.fixToe) return;
		this.fixToe = false;
		this.setRot('rToes', 0, 0, 0);
		this.setRot('lToes', 0, 0, 0);
	}

	convertFbx(name, anim, autoplay) {

		const torad = Math.PI / 180;
		let p = new Vector3();
		let q = new Quaternion();
		let RX = new Quaternion().setFromAxisAngle({ x: 1, y: 0, z: 0 }, 90 * torad);

		const baseTracks = anim.tracks;
		const tracks = [];

		let i = baseTracks.length, j, n, t, b, k = 0;

		while (i--) {
			t = baseTracks[k];
			b = t.name.substring(0, t.name.lastIndexOf('.'));

			if (t.name === 'hip.position') {
				let rp = [];
				j = t.values.length / 3;
				while (j--) {
					n = j * 3;
					p.set(t.values[n], t.values[n + 1], 0).multiplyScalar(0.01);
					p.toArray(rp, n);
				}
				tracks.push(new VectorKeyframeTrack(t.name, t.times, rp));

			} else {
				let rq = [];
				j = t.values.length / 4;
				while (j--) {
					n = j * 4;
					if (b === 'hip') q.set(t.values[n], t.values[n + 1], t.values[n + 2], t.values[n + 3]).multiply(RX);
					else q.set(t.values[n], t.values[n + 2], -t.values[n + 1], t.values[n + 3]);
					q.toArray(rq, n);
				}
				tracks.push(new QuaternionKeyframeTrack(t.name, t.times, rq));
			}
			k++;
		}

		let clip = new AnimationClip(name, -1, tracks);
		clip.duration = anim.duration;



		this.stop();
		this.addClip(clip);
		this.addAction(clip, autoplay);

	}

	makePoseTrack(name, data) {

		const torad = Math.PI / 180;
		//let lockPosition = true;
		//let p = new Vector3();
		let q = new Quaternion();
		//let RX = new Quaternion().setFromAxisAngle({x:1, y:0, z:0}, 90 * torad );

		const baseTracks = data;// anim.tracks;
		const tracks = [];

		let i = baseTracks.length, j, n, n2, t, k = 0;

		let numFrame = 3;//3



		while (i--) {
			t = baseTracks[i];

			/*if( t.name === 'hip.position' ){
				let rp = []
				j = t.values.length / 3;
				while(j--){
					n = j * 3;
					if( lockPosition ) p.set( t.values[n], t.values[n+1], 0).multiplyScalar(0.01);
					else p.set( t.values[n], t.values[n+1], t.values[n+2]).multiplyScalar(0.01);
					p.toArray( rp, n );
				}
				tracks.push( new VectorKeyframeTrack( t.name, t.times, rp ) );

			} else {*/
			let rq = [];
			let tt = [];
			k = 0;
			j = numFrame;//t.values.length / 3 
			while (j--) {
				n = 0;//j * 3
				n2 = k * 4;

				tt.push(k * 0.03333333507180214);
				//if( b==='hip') q.set(t.values[n], t.values[n+1], t.values[n+2], t.values[n+3]).multiply( RX );
				//else q.set(t.values[n], t.values[n+2], -t.values[n+1], t.values[n+3]);
				q.setFromEuler({ _x: t.values[n] * torad, _y: t.values[n + 1] * torad, _z: t.values[n + 2] * torad, _order: 'XYZ' });
				q.toArray(rq, n2);
				k++;
			}
			tracks.push(new QuaternionKeyframeTrack(t.name + '.quaternion', tt, rq));
			//}

		}



		let clip = new AnimationClip(name, -1, tracks);
		clip.duration = numFrame * 0.03333333507180214;//anim.duration;

		// additive not work???
		//clip = AnimationUtils.makeClipAdditive( clip, 0, this.getAction( 'idle' ).clip, 30 )
		//clip = THREE.AnimationUtils.subclip( clip, clip.name, 2, 3, 30 );

		//console.log(clip)

		const action = this.mixer.clipAction(clip);
		//action.frameMax = numFrame;
		action.enabled = true;
		//action.time = 0;
		action.setEffectiveTimeScale(1);
		//action.setEffectiveWeight( 1 );
		action.play();

		//console.log(action)
		//action.paused = true;
		//this.actions.set( clip.name, action );

		//this.stop();
		//this.addClip( clip, true );
		//this.addAction( clip, autoplay );

	}


	//---------------------
	//
	//  ANIMATION CONTROL
	//
	//---------------------

	prepareCrossFade(startAction, endAction, duration) {
		//singleStepMode = false;

		this.isPause = false;
		this.unPause();
		// If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
		// else wait until the current action has finished its current loop

		if (endAction._clip.name !== 'idle') {
			this.executeCrossFade(startAction, endAction, duration);
		} else {
			this.synchronizeCrossFade(startAction, endAction, duration);
		}

	}

	synchronizeCrossFade(startAction, endAction, duration) {

		this.mixer.addEventListener('loop', onLoopFinished);
		const self = this;
		function onLoopFinished(event) {
			if (event.action === startAction) {
				self.mixer.removeEventListener('loop', onLoopFinished);
				self.executeCrossFade(startAction, endAction, duration);
			}
		}

	}

	executeCrossFade(startAction, endAction, duration, warping = true) {
		// Not only the start action, but also the end action must get a weight of 1 before fading
		// (concerning the start action this is already guaranteed in this place)
		this.setWeight(endAction, 1);
		endAction.time = 0;
		// Crossfade with warping - you can also try without warping by setting the third parameter to false
		startAction.crossFadeTo(endAction, duration, true);
	}

	pause() {
		this.actions.forEach(function (action) { action.paused = true; });
		this.isPause = true;
	}

	unPause() {
		this.actions.forEach(function (action) { action.paused = false; });
		this.isPause = false;
	}

	playAll() {
		this.actions.forEach(function (action) { action.play(); });
	}

	setTimescale(timescale) {

		this.actions.forEach(function (action) { action.setEffectiveTimeScale(timescale); });

	}

	syncro(name) {

		let action = this.getAction(name);
		if (!action) return;
		let time = action.time;
		this.actions.forEach(function (action) { action.time = time; });

	}

	/*setTimescale( action, timescale ) {

		action.enabled = true;
		action.setEffectiveTimeScale( timescale );

	}*/

	setWeight(action, weight) {

		//if( typeof action === 'string' ) action = this.getAction( action );
		//if ( !action ) return;

		action.enabled = true;
		if (weight < 0) weight = 0;
		if (weight > 1) weight = 1;
		//let old = action.getEffectiveWeight()
		//if(old===0 && weight!== 0) action.time = 0;
		//action.setEffectiveTimeScale( weight );
		action.setEffectiveWeight(weight);

	}


	getAnimInfo(name) {

		let action = this.getAction(name);
		if (!action) return;
		return {
			name: name,
			time: action.time,
			frame: Math.round(action.time * FrameTime),
			frameMax: action.frameMax,
			timeScale: action.timeScale,
		}

		//if( ui ) ui.updateTimeBarre( anim.frame, anim.frameTime, anim.frameMax );

	}

	getAction(name) {
		//if ( !this.actions.has( name ) ) return;
		return this.actions.get(name);
	}

	play(name, fade = 0.5) {

		let action = this.getAction(name);
		if (!action) return false;

		if (!this.current) {
			this.stop();
			this.current = action;
			//action.play();
			action.setEffectiveWeight(1);
			//console.log(name)
		} else {

			if (this.current !== action) {

				this.old = this.current;
				this.current = action;

				let isIdle = this.current.getClip().name !== 'idle';

				if (this.clipsToesFix.indexOf(name) !== -1) this.fixToe = true;
				else this.resetToes();
				/*this.current.play();

				 

				this.executeCrossFade( this.old, this.current, fade );*/




				//this.old.fadeOut( fade );

				const ratio = this.current.getClip().duration / this.old.getClip().duration;

				//else {
				//this.current.paused = false
				//this.current.time = 0

				this.current.reset();
				//this.current.clampWhenFinished = true;

				// sycro if not idle
				if (!isIdle) this.current.time = this.old.time * ratio;
				//this.current.setEffectiveTimeScale( 1 )
				//this.current.setEffectiveWeight( 1 )

				//}

				if (this.fixWeight) {

					this.current.weight = 1.0;
					this.current.stopFading();
					this.old.stopFading();
					this.old._scheduleFading(fade, this.old.getEffectiveWeight(), 0);
					this.current._scheduleFading(fade, this.current.getEffectiveWeight(), 1);

				} else {

					this.executeCrossFade(this.old, this.current, fade);

					//this.current.crossFadeFrom( this.old, fade, true );

				}



				//this.current.play()


				//console.log( action )

				//this.prepareCrossFade(this.old, this.current, fade)

				/*this.setWeight( this.current, 1 );
				//this.current.time = 0;

				this.old.fadeOut(fade)
				//this.current.reset()
				this.current.fadeIn(fade)
				this.current.play()*/

				//this.current.fadeIn( fade );
				//this.old.fadeOut( fade );

				//this.setWeight( this.current, 1 );

				//this.old.crossFadeFrom( this.current, fade, true );

				/*if ( this.current._clip.name === 'idle' ) {
					this.old.fadeOut(fade)
					this.current.reset()
					this.current.fadeIn(fade)
					console.log('idle')
				}*/




				// this.stop()
				//this.current = action;
				//

			}
		}

		this.isPause = false;

		return true;
	}

	playFrame(name, frame, weight = 1) {

		let action = this.getAction(name);
		if (!action) return;

		action.time = frame * TimeFrame;
		action.setEffectiveWeight(weight);
		action.play();
		action.paused = true;
		this.isPause = true;

	}

	playOne(frame, weight = 1) {

		if (!this.current) return;

		this.current.time = frame * TimeFrame;
		this.current.setEffectiveWeight(weight);
		this.current.play();
		this.current.paused = true;
		this.isPause = true;

	}

	stop() {

		this.actions.forEach(function (action) { action.setEffectiveWeight(0); });
		//this.mixer.stopAllAction()
	}



	// bone control

	setRot(name, x, y, z) {

		let n = this.bones[name];
		if (!n) return
		n.rotation.set(x * torad, y * torad, z * torad, 'XYZ');
		n.updateMatrix();
	}

	setRot2(name, x, y, z) {

		let n = this.bones[name];
		if (!n) return
		//let q1 = n.quaternion
		let q2 = new Quaternion().setFromEuler({ _x: x * todeg, _y: y * todeg, _z: z * todeg, _order: 'XYZ' }).invert();

		n.quaternion.premultiply(q2);
		// n.rotation.set( x*torad, y*torad, z*torad, 'XYZ' );
		n.updateMatrix();
	}

	getRot(name) {

		let n = this.bones[name];
		if (!n) return
		let r = n.rotation.toArray();
		return [Math.round(r[0] * todeg), Math.round(r[1] * todeg), Math.round(r[2] * todeg)];
	}

	getWorldPos(name) {

		let n = this.bones[name];
		if (!n) return
		V.set(0, 0, 0);
		n.localToWorld(V);
		return { x: V.x, y: V.y, z: V.z };

	}


	//---------------------
	//  HIDE PART OF BODY
	//---------------------

	bodyMask(o = { arm: true, leg: true, foot: true, chest: true }) {

		let s = 0.25;
		if (!this.canvas) {
			this.canvas = document.createElement('canvas');
			this.canvas.width = this.canvas.height = 1024 * s;
		}

		const ctx = this.canvas.getContext('2d');
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, 1024 * s, 1024 * s);
		ctx.fillStyle = 'black';
		if (o.arm) ctx.fillRect(784 * s, 448 * s, 236 * s, 186 * s);
		if (o.leg) ctx.fillRect(512 * s, 734 * s, 287 * s, 290 * s);
		if (o.foot) ctx.fillRect(817 * s, 822 * s, 206 * s, 200 * s);
		if (o.chest) {
			ctx.fillRect(480 * s, 576 * s, 300 * s, 160 * s);
			ctx.fillRect(553 * s, 466 * s, 228 * s, 110 * s);
			ctx.fillRect(533 * s, 531 * s, 20 * s, 45 * s);
		}

		let img = new Image();
		img.src = this.canvas.toDataURL();

		if (this.mask) this.mask.dispose();
		//this.mask = new CanvasTexture( this.canvas );

		this.mask = new Texture(img);
		this.mask.flipY = false;
		this.mask.needsUpdate = true;
		const m = Pool.getMaterial('skin');
		m.alphaTest = 0.9;
		m.alphaMap = this.mask;
		//m.needsUpdate = true;
	}


	//---------------------
	//   TOOLS
	//---------------------

	zeroColor(g) {

		if (g.isMesh) g = g.geometry;
		let lng = g.attributes.position.array.length;
		g.setAttribute('color', new Float32BufferAttribute(new Array(lng).fill(0), 3));

	}

	/*uv2( g, uv2 = true, tangent = true ) {

		if( g.isMesh ) g = g.geometry;
		g.setAttribute( 'uv2', g.attributes.uv );

	}*/

}

const _endMatrix = /*@__PURE__*/ new Matrix4();
const _p = /*@__PURE__*/ new Vector3();
const _q = /*@__PURE__*/ new Quaternion();
const _s = /*@__PURE__*/ new Vector3();

class SkeletonBody extends Object3D {

	constructor(character) {

		super();

		this.prefix = character.name || 'yoo_';

		this.mode = 'follow';

		this.withFinger = false;

		this.nodes = [];
		this.bones = character.model.skeleton.bones;
		this.model = character.model.root;
		this.posRef = {};
		this.quatRef = {};

		this.useSolver = false;
		if (root.engine !== 'PHYSX') this.useSolver = false;

		this.nameList = [];
		this.jointList = [];

		this.breast = false;

		this.ready = false;

		this.init();

	}

	setMode(mode) {

		if (mode === this.mode) return

		this.mode = mode;
		const data = [];

		let kinematic = this.mode === 'follow';

		let i = this.nodes.length, node;

		while (i--) {

			node = this.nodes[i];

			data.push({ name: node.name, kinematic: kinematic });
			node.kinematic = kinematic;
			node.bone.isPhysics = !kinematic;

		}

		root.motor.change(data);

	}

	freeBone(node) {

		if (!node.kinematic) return
		node.cc++;
		if (node.cc === 20) {
			node.cc = 0;
			node.kinematic = false;
			node.bone.isPhysics = true;
			root.motor.change({ name: node.name, kinematic: false });
		}

	}

	isVisible(v) {

		//let i = this.nodes.length, node
		//while( i-- ) Utils.byName( this.nodes[i].name ).visible = v

		let i = this.nameList.length;
		while (i--) Utils.byName(this.nameList[i]).visible = v;

		let data = [];
		i = this.jointList.length;
		while (i--) data.push({ name: this.jointList[i], visible: v });
		root.motor.change(data);

	}


	init() {

		if (this.useSolver) this.solver = root.motor.add({
			type: 'solver', name: this.prefix + '_solver', iteration: 32,
			fix: true, needData: true
		});

		const data = [];

		// get character bones var bones = character.skeleton.bones;


		let p = new Vector3();
		let s = new Vector3();
		let q = new Quaternion();
		let e = new Euler();
		let mtx = new Matrix4();

		let tmpMtx = new Matrix4();
		let tmpMtxR = new Matrix4();

		let p1 = new Vector3();
		let p2 = new Vector3();

		//let headDone = false

		let i, lng = this.bones.length, name, n, bone, parent;///, child, o, parentName;
		let size, dist, rot, type, kinematic, translate, phyName, motion;

		for (i = 0; i < lng; i++) {

			type = null;
			bone = this.bones[i];
			name = bone.name;
			parent = bone.parent;

			if (parent) {

				n = parent.name;

				p1.setFromMatrixPosition(parent.matrixWorld);
				p2.setFromMatrixPosition(bone.matrixWorld);
				dist = p1.distanceTo(p2);

				//translate = [ -dist * 0.5, 0, 0 ];
				translate = [0, 0, dist * 0.5];
				size = [dist, 1, 1];
				rot = null;//[0,0,0];
				kinematic = true;
				motion = false;


				// body

				if (n === 'hip' && name === 'abdomen') { type = 'capsule'; size = [dist * 1.8, 0.08]; translate = [0, 0, -dist * 0.5]; rot = [0, 0, 90]; }
				if (n === 'abdomen' && name === 'chest') { type = 'capsule'; size = [dist * 0.7, 0.08]; translate = [0, 0, (-dist * 0.5) - 0.06]; rot = [90, 0, 0]; }
				if (n === 'chest' && name === 'neck') { type = 'capsule'; size = [dist * 0.4, 0.04]; translate = [0, 0, (-dist * 0.5) - 0.02]; rot = [0, 0, 90]; }
				if (n === 'neck' && name === 'head') { type = 'capsule'; size = [0.06, dist]; translate = [0, 0, -dist * 0.5]; rot = [90, 0, 0]; }
				if (n === 'head' && name === 'End_head') { type = 'capsule'; size = [0.1, dist - 0.17]; translate = [0, 0.02, (-dist * 0.5) + 0.02]; rot = [90, 0, 0]; }

				//if( n==='head' && !headDone ){ console.log(name); headDone = true; type = 'sphere'; dist=0.08; size = [ 0.08, 0.2, dist ]; translate = [ 0, 0.025, -0.08 ]; }

				/*if( n==='chest' && name==='neck' ){ type = 'box'; size = [  0.28, 0.24, dist ]; translate = [ 0, 0, -dist * 0.5 ]; }
				if( n==='abdomen' && name==='chest'  ){ type = 'box'; size = [ 0.24, 0.20,  dist ]; translate = [ 0, 0, -dist * 0.5 ]; }
				if( n==='hip' && name==='abdomen' ){ type = 'box'; size = [  0.28, 0.24, dist ]; translate = [ 0, 0, -dist * 0.5 ]; }*/






				if (n === 'chest' && name === 'rBreast' && root.engine !== 'HAVOK') { n = 'rBreast'; parent = bone; type = 'sphere'; size = [0.065]; translate = [0.065, 0, 0]; this.breast = true; motion = true; }
				if (n === 'chest' && name === 'lBreast' && root.engine !== 'HAVOK') { n = 'lBreast'; parent = bone; type = 'sphere'; size = [0.065]; translate = [0.065, 0, 0]; this.breast = true; motion = true; }


				// arm

				if (n === 'lCollar' && name === 'lShldr') { type = 'capsule'; size = [0.05, dist * 0.3]; translate = [dist * 0.6, 0, 0]; rot = [0, 0, 90]; }
				if (n === 'lShldr' && name === 'lForeArm') { type = 'capsule'; size = [0.05, dist]; translate = [dist * 0.5, 0, 0]; rot = [0, 0, 90]; }
				if (n === 'lForeArm' && name === 'lHand') { type = 'capsule'; size = [0.04, dist]; translate = [dist * 0.5, 0, 0]; rot = [0, 0, 90]; }
				if (n === 'lHand' && name === 'lMid1') { type = 'box'; size = [dist * 2, 0.09, 0.05]; translate = [dist, 0, 0]; }

				if (n === 'rCollar' && name === 'rShldr') { type = 'capsule'; size = [0.05, dist * 0.3]; translate = [-dist * 0.6, 0, 0]; rot = [0, 0, 90]; }
				if (n === 'rShldr' && name === 'rForeArm') { type = 'capsule'; size = [0.05, dist]; translate = [-dist * 0.5, 0, 0]; rot = [0, 0, 90]; }
				if (n === 'rForeArm' && name === 'rHand') { type = 'capsule'; size = [0.04, dist]; translate = [-dist * 0.5, 0, 0]; rot = [0, 0, 90]; }
				if (n === 'rHand' && name === 'rMid1') { type = 'box'; size = [dist * 2, 0.09, 0.05]; translate = [-dist, 0, 0]; }




				// legs

				if (n === 'lThigh') { type = 'capsule'; size = [0.08, dist]; rot = [90, 0, 0]; }
				if (n === 'lShin') { type = 'capsule'; size = [0.065, dist]; rot = [90, 0, 0]; }
				//if( n==='lFoot' ){ type = 'box'; size = [  0.1, dist*1.4, 0.06 ]; translate = [0, (dist * 0.5)-0.025, 0.06 ]; link:'lShin'; }
				if (n === 'lFoot') { type = 'capsule'; size = [0.05, dist]; translate = [0, (dist * 0.5) - 0.025, 0.04]; }

				if (n === 'rThigh') { type = 'capsule'; size = [0.08, dist]; rot = [90, 0, 0]; }
				if (n === 'rShin') { type = 'capsule'; size = [0.065, dist]; rot = [90, 0, 0]; }
				//if( n==='rFoot' ){ type = 'box'; size = [  0.1, dist*1.4, 0.06 ]; translate = [0, (dist * 0.5)-0.025, 0.06 ]; link:'rShin';}
				if (n === 'rFoot') { type = 'capsule'; size = [0.05, dist]; translate = [0, (dist * 0.5) - 0.025, 0.04]; }



				//if( n==='rFoot' && name==='lToes' ){ n='lToes'; parent = bone; type = 'capsule'; size = [  0.05, 0.1 ]; translate = [0, 0, 0 ]; link='rFoot'; rot = [0,0,0]; }
				//if( n==='lFoot' && name==='rToes' ){ n='rToes'; parent = bone; type = 'capsule'; size = [  0.05, 0.1 ]; translate = [0, 0, 0 ]; link='rFoot'; rot = [0,0,0]; }

				if (this.withFinger) {

					if (n === 'lHand' && name === 'lMid1') { type = 'box'; size = [dist, 0.09, 0.05]; translate = [dist * 0.5, 0, 0]; }
					if (n === 'rHand' && name === 'rMid1') { type = 'box'; size = [dist, 0.09, 0.05]; translate = [-dist * 0.5, 0, 0]; }


					if (n === 'rThumb1' && name === 'rThumb2') { type = 'capsule'; size = [0.02, dist]; rot = [0, 0, 90]; }
					if (n === 'rThumb2' && name === 'rThumb3') { type = 'capsule'; size = [0.02, dist]; rot = [0, 0, 90]; }


					if (n === 'rHand' && name === 'rMid1') { type = 'capsule'; size = [0.02, dist]; rot = [0, 0, 90]; translate = [-dist * 0.6, 0, 0]; }
					if (n === 'rMid1' && name === 'rMid2') { type = 'capsule'; size = [0.02, dist]; rot = [0, 0, 90]; translate = [-dist * 0.6, 0, 0]; }
					if (n === 'rMid2' && name === 'rMid3') { type = 'capsule'; size = [0.02, dist]; rot = [0, 0, 90]; translate = [-dist * 0.6, 0, 0]; }

				}





				if (type !== null) {

					phyName = this.prefix + '_bone_' + n;

					// translation
					tmpMtx.makeTranslation(translate[0], translate[1], translate[2]);
					// rotation
					if (rot) {
						tmpMtxR.makeRotationFromEuler(e.set(rot[0] * torad$1, rot[1] * torad$1, rot[2] * torad$1));
						tmpMtx.multiply(tmpMtxR);
					}

					mtx.copy(parent.matrixWorld);
					mtx.decompose(p, q, s);

					this.posRef[phyName] = p.toArray();
					if (n === 'lForeArm' || n === 'rForeArm') {
						_q.setFromAxisAngle({ x: 0, y: 1, z: 0 }, -90 * torad$1);
						q.multiply(_q);
					}

					this.quatRef[phyName] = q.toArray();

					mtx.multiplyMatrices(parent.matrixWorld, tmpMtx);
					mtx.decompose(p, q, s);

					let physicData = {

						name: phyName,
						density: 1,
						//mass:1,
						type: type,
						size: MathTool.scaleArray(size, 1, 3),
						pos: p.toArray(),
						//rot: rot,
						quat: q.toArray(),
						kinematic: kinematic,
						friction: 0.5,
						restitution: 0.1,
						group: 1,
						mask: 1 | 2,
						material: 'bones2',
						shadow: false,
						neverSleep: true,
						helper: true,

						//linked:link,
						//iterations:[4,4],


						/*bone:parent,
						decal:tmpMtx.clone(),
						decalinv:tmpMtx.clone().invert(),*/

					};

					/*if( this.useSolver ){
						physicData['solver'] = this.prefix+'_solver'
						physicData['linked'] = this.prefix+'_bone_'+link
						physicData['kinematic'] = false
					}*/

					data.push(physicData);

					this.nameList.push(phyName);

					this.nodes.push({
						name: phyName,
						kinematic: kinematic,
						motion: motion,// auto move
						bone: parent,
						decal: tmpMtx.clone(),
						decalinv: tmpMtx.clone().invert(),
						quat: q.toArray(),
						pos: p.toArray(),
						cc: 0,
					});
				}

			}
		}

		//console.log( data )

		root.motor.add(data);

		//if( this.useSolver ) this.solver.start();

		this.addLink();

		this.ready = true;

	}

	addLink() {

		// Stiffness / Damping
		// raideur / amortissement
		//let sp = [0.05,1]
		let sp = [0.05, 1, 0];
		if (root.engine === 'PHYSX') {
			// stiffness / damping / restitution / bounceThreshold / contactDistance
			//[0,0, 0, 0.5]
			// raideur / amortissement
			sp = [50, 10, 0, 0.5];
		}




		let p = this.prefix + '_bone_';
		let data = [];
		let sett = {
			type: 'joint',
			mode: 'd6',
			visible: false,
			lm: [['ry', -180, 180, ...sp], ['rz', -180, 180, ...sp]],

			collision: false,
			helperSize: 0.05,

			//acc:true,

			//worldAxis:[1,0,0],

			autoDrive: true,

		};

		let breastMotion = [-0.001, 0.001, 100, 0.2, 0.5];


		data.push({ ...sett, b1: p + 'hip', b2: p + 'abdomen', worldPos: this.posRef[p + 'abdomen'], worldQuat: this.quatRef[p + 'hip'], lm: [['rx', -20, 20, ...sp], ['ry', -20, 20, ...sp], ['rz', -20, 20, ...sp]] });
		data.push({ ...sett, b1: p + 'abdomen', b2: p + 'chest', worldPos: this.posRef[p + 'chest'], worldQuat: this.quatRef[p + 'chest'], lm: [['rx', -20, 20, ...sp], ['ry', -20, 20, ...sp], ['rz', -20, 20, ...sp]] });
		data.push({ ...sett, b1: p + 'chest', b2: p + 'neck', worldPos: this.posRef[p + 'neck'], worldQuat: this.quatRef[p + 'neck'], lm: [['rx', -60, 60, ...sp], ['ry', -1, 1, ...sp], ['rz', -30, 30, ...sp]] });
		data.push({ ...sett, b1: p + 'neck', b2: p + 'head', worldPos: this.posRef[p + 'head'], worldQuat: this.quatRef[p + 'head'], lm: [['rx', -60, 60, ...sp], ['ry', -1, 1, ...sp], ['rz', -30, 30, ...sp]] });
		//data.push({ type:'joint', mode:'d6', b1:this.prefix*'chest', b2:this.prefix*'abdomen' })

		// arm

		data.push({ ...sett, b1: p + 'chest', b2: p + 'rCollar', worldPos: this.posRef[p + 'rCollar'], worldQuat: this.quatRef[p + 'rCollar'], lm: [['rx', -10, 10, ...sp], ['ry', -10, 10, ...sp], ['rz', -10, 10, ...sp]] });
		data.push({ ...sett, b1: p + 'chest', b2: p + 'lCollar', worldPos: this.posRef[p + 'lCollar'], worldQuat: this.quatRef[p + 'lCollar'], lm: [['rx', -10, 10, ...sp], ['ry', -10, 10, ...sp], ['rz', -10, 10, ...sp]] });

		data.push({ ...sett, b1: p + 'rCollar', b2: p + 'rShldr', worldPos: this.posRef[p + 'rShldr'], worldQuat: this.quatRef[p + 'rShldr'] });
		data.push({ ...sett, b1: p + 'lCollar', b2: p + 'lShldr', worldPos: this.posRef[p + 'lShldr'], worldQuat: this.quatRef[p + 'lShldr'] });

		//data.push({ ...sett, b1:p+'chest', b2:p+'rShldr', worldPos:this.posRef[p+'rShldr'], worldQuat:this.quatRef[p+'rShldr'] })
		//data.push({ ...sett, b1:p+'chest', b2:p+'lShldr', worldPos:this.posRef[p+'lShldr'], worldQuat:this.quatRef[p+'lShldr'] })

		data.push({ ...sett, b1: p + 'rShldr', b2: p + 'rForeArm', worldPos: this.posRef[p + 'rForeArm'], worldQuat: this.quatRef[p + 'rForeArm'], lm: [['rx', 0, 160, ...sp]] });
		data.push({ ...sett, b1: p + 'lShldr', b2: p + 'lForeArm', worldPos: this.posRef[p + 'lForeArm'], worldQuat: this.quatRef[p + 'lForeArm'], lm: [['rx', 0, 160, ...sp]] });

		data.push({ ...sett, b1: p + 'rForeArm', b2: p + 'rHand', worldPos: this.posRef[p + 'rHand'], worldQuat: this.quatRef[p + 'rHand'], lm: [['rx', 0, 160, ...sp], ['ry', -10, 10, ...sp]] });
		data.push({ ...sett, b1: p + 'lForeArm', b2: p + 'lHand', worldPos: this.posRef[p + 'lHand'], worldQuat: this.quatRef[p + 'lHand'], lm: [['rx', 0, 160, ...sp], ['ry', -10, 10, ...sp]] });

		//data.push({ ...sett, b1:p+'rShldr', b2:p+'rForeArm', worldPos:this.posRef[p+'rForeArm'], worldAxis:[1,0,0], lm:[['rx',-120, 0]] })
		//data.push({ ...sett, b1:p+'lShldr', b2:p+'lForeArm', worldPos:this.posRef[p+'lForeArm'], worldAxis:[1,0,0], lm:[['rx',-120, 0]] })

		// leg

		data.push({ ...sett, b1: p + 'hip', b2: p + 'rThigh', worldPos: this.posRef[p + 'rThigh'], worldQuat: this.quatRef[p + 'rThigh'] });
		data.push({ ...sett, b1: p + 'hip', b2: p + 'lThigh', worldPos: this.posRef[p + 'lThigh'], worldQuat: this.quatRef[p + 'lThigh'] });

		data.push({ ...sett, b1: p + 'rThigh', b2: p + 'rShin', worldPos: this.posRef[p + 'rShin'], lm: [['rx', 0, 160, ...sp]], worldQuat: this.quatRef[p + 'rShin'] });
		data.push({ ...sett, b1: p + 'lThigh', b2: p + 'lShin', worldPos: this.posRef[p + 'lShin'], lm: [['rx', 0, 160, ...sp]], worldQuat: this.quatRef[p + 'lShin'] });

		data.push({ ...sett, b1: p + 'rShin', b2: p + 'rFoot', worldPos: this.posRef[p + 'rFoot'], lm: [['rx', -10, 30, ...sp], ['rz', -10, 10, ...sp]], worldQuat: this.quatRef[p + 'rFoot'] });
		data.push({ ...sett, b1: p + 'lShin', b2: p + 'lFoot', worldPos: this.posRef[p + 'lFoot'], lm: [['rx', -10, 30, ...sp], ['rz', -10, 10, ...sp]], worldQuat: this.quatRef[p + 'lFoot'] });

		if (this.breast) {
			data.push({ ...sett, b1: p + 'chest', b2: p + 'rBreast', worldPos: this.posRef[p + 'rBreast'], worldQuat: this.quatRef[p + 'rBreast'], lm: [['x', ...breastMotion], ['y', ...breastMotion], ['z', ...breastMotion]] });
			data.push({ ...sett, b1: p + 'chest', b2: p + 'lBreast', worldPos: this.posRef[p + 'lBreast'], worldQuat: this.quatRef[p + 'lBreast'], lm: [['x', ...breastMotion], ['y', ...breastMotion], ['z', ...breastMotion]] });
		}

		let x = 0;
		for (let j in data) {
			data[j].name = this.prefix + '_joint_' + x;
			this.nameList.push(data[j].name);
			this.jointList.push(data[j].name);
			x++;
		}


		root.motor.add(data);

	}





	/*makeLink () {

		let p = this.prefix;
		let data = []
		data.push({ type:'joint', mode:'d6', b1:p+'hip', b2:p+'abdomen', visible:true })
		data.push({ type:'joint', mode:'d6', b1:p+'abdomen', b2:p+'chest', visible:true })
		//data.push({ type:'joint', mode:'d6', b1:this.prefix*'chest', b2:this.prefix*'abdomen' })

		//console.log(this.prefix, data)

		root.motor.add( data )

	}*/

	updateMatrixWorld(force) {

		if (!this.ready) return

		let up = [];

		const nodes = this.nodes;
		let i = nodes.length, node, bone, body;


		while (i--) {

			node = nodes[i];
			bone = node.bone;

			if (node.kinematic) {


				//_tmpMatrix.multiplyMatrices( _rootMatrix, bone.matrixWorld );
				_endMatrix.multiplyMatrices(bone.matrixWorld, node.decal);
				_endMatrix.decompose(_p, _q, _s);

				node.pos = _p.toArray();
				node.quat = _q.toArray();

				up.push({ name: node.name, pos: node.pos, quat: node.quat });

				if (node.motion) this.freeBone(node);

			} else {

				body = Utils.byName(node.name);

				if (body) {

					_endMatrix.copy(body.matrixWorld).multiply(node.decalinv);

					//_endMatrix.multiplyMatrices( node.decalinv, bone.matrixWorld );

					//_endMatrix
					//.copy( body.matrixWorld )
					//.decompose( _p, _q, _s )
					//.compose( _p, _q, _s.set( 1, 1, 1 ) )
					//.multiply( node.decalinv );

					/*if ( bone.parent && bone.parent.isBone ) {

						//_tmpMatrix.getInverse( bone.parent.matrixWorld );
						_tmpMatrix.copy( bone.parent.matrixWorld ).invert()
						_tmpMatrix.multiply( _endMatrix );

					} else {

						_tmpMatrix.copy( _endMatrix );

					}*/

					bone.phyMtx.copy(_endMatrix);
					bone.isPhysics = true;// .copy( _endMatrix );
				}
			}

		}

		if (up.length !== 0) root.motor.change(up, true);

	}

	dispose() {

		root.motor.remove(this.nameList);

		this.nodes = [];
		this.posRef = {};
		this.quatRef = {};
		this.parent.remove(this);

		this.nameList = [];
		this.jointList = [];

	}

}

// THREE CHARACTER

class Character extends Item {

	constructor() {

		super();

		this.Utils = Utils;
		this.type = 'character';
		this.num = Num[this.type];

	}

	/*prestep () {

		let i = this.list.length;

		while( i-- ){

			this.list[i].preStep( );

		}

	}*/

	step() {

		const AR = root.Ar;
		const N = root.ArPos[this.type];

		let i = this.list.length, n, s;

		while (i--) {

			s = this.list[i];
			n = N + (i * this.num);
			s.step(AR, n);

		}

	}

	add(o = {}) {

		this.setName(o);
		const hero = new Hero(o);

		return hero

	}

	set(o = {}, b = null) {

		if (b === null) b = this.byName(o.name);
		if (b === null) return

		b.set(o);

	}

}

// HERO

class Hero extends Basic3D {

	constructor(o = {}) {

		super();

		this.fixWeight = o.fixWeight !== undefined ? o.fixWeight : true;

		this.type = 'character';
		this.name = o.name || 'hero';
		o.name = this.name;

		this.isRay = false;

		this.ray = null;
		this.model = null;
		this.static = false;

		this.radius = o.radius || 0.3;
		this.height = o.height || 1.8;
		if (o.radius) delete o.radius;

		this.fall = false;
		this.floor = true;

		this.distance = 0;
		this.rayAngle = 0;
		this.rayStart = -(this.height * 0.5) + this.radius;
		this.rayEnd = this.rayStart - this.height;
		this.maxRayDistance = this.height;

		this.contact = false;

		this.tmpV1 = new Vector3();
		this.tmpV2 = new Vector3();
		this.ease = new Vector3();
		this.tmpAcc = 0;
		this.rs = 0;
		this.ts = 0;
		this.diagonal = 1 / Math.sqrt(2);

		this.jump = false;
		this.crouch = false;
		this.toggle = true;
		this.oy = 0;
		this.vy = 0;

		this.timeScale = 1.25;

		this.angle = (o.angle || 0) * torad$1;

		this.speed = {
			idle: 1,
			fight: 1,
			walk: 7.8,
			crouch: 7,
			run: 12,
		};

		this.valheimStyle = true;
		this.globalRay = o.ray || false;

		this.callback = o.callback || function () { };

		if (o.callback) delete o.callback;

		this.init(o);

	}

	init(o) {

		if (!o.size) o.size = [this.radius, this.height - (2 * this.radius)];
		if (!o.pos) o.pos = [0, this.height * 0.5, 0];

		this.py = -this.height * 0.5;//(o.size[1]*0.5)-o.size[0]

		if (this.globalRay) root.items.body.geometry({ ...o, type: 'capsule', ray: true }, this, Mat.get('hide'));

		o.density = o.density || 1;
		//o.damping = [0.01,0] 
		o.friction = 0.5;

		o.angularFactor = [0, 0, 0];
		//o.maxDamping = 1000
		o.group = 16;
		//o.mask = o.mask !== undefined ? o.mask : 1|2
		o.regular = true;
		o.filter = [1, -1, [1, 3, 4, 5, 9], 0];
		o.inertia = [0, 0, 0];
		//o.kinematic = true
		o.noGravity = true;

		o.volume = MathTool.getVolume('capsule', o.size);


		// add to world
		root.items.character.addToWorld(this, o.id);

		// add capsule to physics
		root.post({ m: 'add', o: o });


		this.ray = root.motor.add({ type: 'ray', name: this.name + '_ray', begin: [0, this.rayStart, 0], end: [0, this.rayEnd, 0], callback: this.selfRay.bind(this), visible: false, parent: this.name });


		// add skinning character model
		if (o.gender) this.addModel(o);
		else this.showHelper(true);

	}

	selfRay(r) {

		if (r.hit) {
			this.distance = MathTool.toFixed(r.distance - this.radius);
			this.rayAngle = r.angle;
		} else {
			this.distance = this.maxRayDistance;
			this.rayAngle = 0;
		}

	}

	hit(d) {
		this.contact = d;
	}

	showHelper(b) {

		if (b) {
			if (!this.helper) {
				this.helper = new CapsuleHelper(this.radius, this.height, true, Mat.get('line'));
				this.add(this.helper);
			}
		} else {
			if (this.helper) {
				this.remove(this.helper);
				this.helper.dispose();
				this.helper = null;
			}
		}

		if (this.ray) this.ray.visible = b;

	}

	addSkeleton() {

		if (this.skeletonBody) return

		this.skeletonBody = new SkeletonBody(this);
		root.scene.add(this.skeletonBody);
		this.skeletonBody.isVisible(false);

	}

	debugMode(v) {

		if (this.skeletonBody) this.skeletonBody.isVisible(v);
		//if( this.model ) this.model.setMaterial( { wireframe: v, visible:!v })
		if (this.model) this.model.setMaterial({ wireframe: v, transparent: v, opacity: v ? 0.25 : 1.0 }, !v);

		this.showHelper(v);


	}

	setMode(name) {

		if (this.skeletonBody) this.skeletonBody.setMode(name);

		//this.skeletonBody = new SkeletonBody( this )
		//this.model.add( this.skeletonBody )

	}

	addModel(o) {

		this.model = new Avatar({
			type: o.gender,
			anim: o.anim !== undefined ? o.anim : 'idle',
			compact: true,
			material: !o.noMat,
			morph: o.morph || false,
			callback: this.callback,
			fixWeight: this.fixWeight,
		});

		this.add(this.model);
		///this.model.rotation.order = 'YXZ'
		this.model.setPosition(0, this.py + this.model.decalY, 0);
		this.model.rotation.y = this.angle;
		this.model.updateMatrix();

	}

	raycast() {
		return
	}

	/*preStep(){
		if(this.skeletonBody) this.skeletonBody.update()
	}*/

	step(AR, n) {

		this.position.fromArray(AR, n + 1);
		this.quaternion.fromArray(AR, n + 4);
		this.fall = this.position.y < this.oy;
		this.floor = MathTool.nearEquals(this.position.y, this.oy, 0.1);
		this.oy = this.position.y;
		this.updateMatrix();

		if (this.model) this.model.update(root.delta);
		//if(this.skeletonBody) this.skeletonBody.update()

	}

	set(o) {

		//console.log('set', o)
		if (o.morph) {
			if (this.model) this.model.setMorph(o.morph, o.value);
		}

	}

	dispose() {

		this.callback = null;
		if (this.skeletonBody) this.skeletonBody.dispose();
		if (this.model) this.model.dispose();
		if (this.helper) this.showHelper();

		console.log('model remove');

		super.dispose();
	}

	move() {

		const key = root.motor.getKey();
		const azimut = root.motor.getAzimut();
		const delta = root.delta;


		let anim = key[7] !== 0 ? 'run' : 'walk';
		if (key[0] === 0 && key[1] === 0) anim = 'idle';//*= 0.9
		let m = key[0] !== 0 && key[1] !== 0 ? this.diagonal : 1;

		if (key[5] && this.toggle) {
			this.crouch = !this.crouch;
			this.toggle = false;
		}

		if (key[5] === 0) this.toggle = true;

		if ((anim === 'walk' || anim === 'run') && this.crouch) anim = 'crouch';

		if (key[6] === 1) anim = 'fight';



		if (!this.jump && key[4]) { this.vy = 22; this.jump = true; } // SPACE KEY

		if (this.jump) {
			this.vy -= 1;
			if (this.vy <= 0) {
				this.vy = 0;
				if (this.floor) this.jump = false;

				//if( MathTool.nearEquals(this.position.y, this.oy, 0.1)) this.jump = false;
				//this.position.y === this.oy 
			}
		}

		//this.oy = this.position.y;

		/*if(this.crouch){
			if( anim==='run' || anim==='walk' ) anim = 'crouch'
			if( anim==='idle' ) anim = 'crouchIdle'
		}*/


		let mAnim = 'idle';
		switch (anim) {
			case 'idle':
				mAnim = this.crouch ? 'Crouch Idle' : 'idle';
				//if( key[6] === 1 ) mAnim = 'Attack';
				break;
			case 'walk':
				mAnim = 'Jog Forward';
				break;
			case 'run': mAnim = 'Standard Run'; break;
			case 'crouch': mAnim = 'Crouch Walk'; break;
			case 'fight': mAnim = 'Attack'; break;
			//case 'crouchIdle': mAnim = 'Crouch Idle'; break;
		}

		//if(this.jump) 
		//this.model.setWeight(, this.jump ? 1:0 )

		const genSpeed = 1.0;

		let speed = this.speed[anim] * genSpeed;


		//this.tmpAcc *= 0.9


		if (key[0] !== 0 || key[1] !== 0) {

			this.tmpAcc += delta * 4;//MathTool.lerp( tmpAcc, 1, delta/10 )
			//this.tmpAcc += MathTool.lerp( this.tmpAcc, 1, delta/10 )
			//this.tmpAcc = MathTool.clamp( this.tmpAcc, 1, speed )

			//this.rs += key[0] //* this.tmpAcc 
			//this.ts += key[1] //* this.tmpAcc

			this.rs = key[0] * speed;//* this.tmpAcc 
			this.ts = key[1] * speed;//* this.tmpAcc
		}

		if (key[0] === 0 && key[1] === 0) this.tmpAcc = 0;//*= 0.9
		//if( key[0] === 0 ) this.rs = 0
		//if( key[1] === 0 ) this.ts = 0

		//if( key[0] === 0 ) this.rs *= 0.9
		//if( key[1] === 0 ) this.ts *= 0.9

		if (this.tmpAcc > 1) this.tmpAcc = 1;

		//dir.multiplyScalar(tmpAcc)

		//this.rs = MathTool.clamp( this.rs, -speed, speed ) 
		//this.ts = MathTool.clamp( this.ts, -speed, speed ) 

		//this.ease.set( this.ts/speed, 0, this.rs/speed )
		//this.ease.set( this.rs/speed, 0, this.ts/speed )
		this.ease.set(this.rs, 0, this.ts).multiplyScalar(this.tmpAcc * m);

		//let angle = math.unwrapRad( (Math.atan2(this.ease.z, this.ease.x)) + azimut );
		let angle = MathTool.unwrapRad((Math.atan2(this.ease.x, this.ease.z)) + azimut);

		this.ease.length(); //((Math.abs(this.ease.x) + Math.abs(this.ease.z)))

		//console.log(jj, this.ease.length() )

		//if(jj!== 0)

		// help climb montagne
		/* if( !this.jump ){ 
			 if( !this.fall ) this.vy = acc*8
			 else this.vy = 0
		 }*/




		//if(anim==='walk' || anim==='run')

		//if(this.static) this.ts = this.rs = 0
		if (this.static) this.ease.x = this.ease.z = 0;


		// gravity
		//let g = this.vy - (this.distance>0.1 ? 9.81 : 0);
		let g = this.vy - 9.81;

		// console.log(this.distance)

		this.ease.y = g;

		//this.tmpV1.set( this.rs, g, this.ts ).applyAxisAngle( { x:0, y:1, z:0 }, azimut );

		this.tmpV1.copy(this.ease).applyAxisAngle({ x: 0, y: 1, z: 0 }, azimut);
		//math.tmpV2.set( 0, rs, 0 );
		this.tmpV2.set(0, 0, 0);

		root.motor.change({

			name: this.name,
			//force: this.tmpV1.toArray(), forceMode:'velocity', 
			linearVelocity: this.tmpV1.toArray(),
			///angularVelocity: this.tmpV2.toArray(), 
			//wake:true, 
			//noGravity:true 
		});


		if (this.helper) {

			//this.helper.updateMatrix()
			this.helper.cone.rotation.y = azimut;//angle
			if (anim !== 'idle') this.helper.setDirection(angle);

		}


		// if(anim!=='idle') this.model.setRotation( 0, azimut + Math.PI, 0, 0.25 )

		if (!this.model) return

		//this.model.setTimescale(this.tmpAcc)

		//this.model.setWeight( 'idle', 1-jj )
		/*this.model.setWeight( 'Jog Forward', -this.ease.x )
		this.model.setWeight( 'Jog Backward', this.ease.x )
		this.model.setWeight( 'Jog Strafe Left',-this.ease.z )
		this.model.setWeight( 'Jog Strafe Right', this.ease.z )*/



		//if(anim!=='idle') this.model.syncro('Jog Forward')

		//console.log(tmpAcc)


		if (this.jump) {
			this.model.play('Jump', 0);
			//this.model.setTimescale( 1 )
		} else {
			this.model.play(mAnim, 0.5);
			//this.model.setTimescale( this.timeScale )
			//this.model.setTimescale( 1 )
		}

		if (anim !== 'idle') {

			//this.model.setTimescale( 0.5 )

			let pp = MathTool.unwrapRad(this.model.rotation.y);
			//if( anim === 'fight' ) pp = math.unwrapRad( azimut + Math.PI )
			let aa = MathTool.nearAngle(angle, pp);
			let diff = Math.abs(Math.floor((pp - aa) * math.todeg) / 180);
			//console.log(diff)
			//this.model.rotation.y = anim === 'fight' ? (azimut + Math.PI) : math.lerp( pp, aa, 0.25 )
			this.model.rotation.y = anim === 'fight' ? (azimut + Math.PI) : MathTool.lerp(pp, aa, 0.2 - (diff * 0.1));
			this.model.updateMatrix();
			//this.model.setTimescale( this.tmpAcc * (1*genSpeed) )

			//let m = this.model.getAction( anim )
			//if( m ) m.setEffectiveTimeScale( this.tmpAcc * (1*genSpeed) );
			//if( m ) m.setEffectiveTimeScale( 0 );
		}

		//if( this.helper ) this.helper.setDirection( this.model.rotation.y )

	}


}

const math$1 = {

	torad: Math.PI / 180,
	todeg: 180 / Math.PI,
	Pi: Math.PI,
	TwoPI: Math.PI * 2,
	PI90: Math.PI * 0.5,
	PI45: Math.PI * 0.25,
	PI270: (Math.PI * 0.5) * 3,
	inv255: 0.003921569,
	golden: 1.618033,
	epsilon: Math.pow(2, - 52),

	randomSign: () => (Math.random() < 0.5 ? -1 : 1),
	randSpread: (range) => (range * (0.5 - Math.random())),
	rand: (low = 0, high = 1) => (low + Math.random() * (high - low)),
	randInt: (low, high) => (low + Math.floor(Math.random() * (high - low + 1))),
	toFixed: (x, n = 3) => (x.toFixed(n) * 1),
	int: (x) => (Math.floor(x)),
	lerp: (x, y, t) => ((1 - t) * x + t * y),
	clamp: (v, min, max) => (Math.max(min, Math.min(max, v))),
	nearEquals: (a, b, t) => (Math.abs(a - b) <= t ? true : false),
	lerpAr: (ar, arx, ary, t) => {
		let i = ar.length;
		while (i--) ar[i] = math$1.lerp(arx[i], ary[i], t);
	},

	unwrapDeg: (r) => (r - (Math.floor((r + 180) / 360)) * 360),
	//unwrapRad: ( r ) => (r - (Math.floor((r + Math.PI)/(2*Math.PI)))*2*Math.PI),
	unwrapRad: (r) => (Math.atan2(Math.sin(r), Math.cos(r))),


	scaleArray: (ar, scale) => {

		var i = ar.length;
		while (i--) { ar[i] *= scale; } return ar;

	},

	addArray: (ar, ar2) => {

		var r = [];
		var i = ar.length;
		while (i--) { r[i] = ar[i] + ar2[i]; } return r;

	},

	angleDistance: (cur, prv) => {
		var diff = (cur - prv + 180) % 360 - 180;
		return diff < -180 ? diff + 360 : diff;
	},




	/*map: ( value, in_min, in_max, out_min, out_max ) => ( (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min ),
	
	smoothLerp: ( a, b, c, t, k ) => {

		var f = a - b + (c - b) / (k * t);
		return c - (c - b) / ( k * t ) + f * Math.exp(-k*t);

	},

	smoothLerpV: ( a, b, c, t, k ) => {

		let x = math.smoothLerp( a.x, b.x, c.x, t, k );
		let y = math.smoothLerp( a.y, b.y, c.y, t, k );
		let z = math.smoothLerp( a.z, b.z, c.z, t, k );

		return { x:x, y:y, z:z }

	},

	minValue: ( ar ) => {

		let v = ar[0];
		for (let i = 1, l=ar.length; i<l; i++){ if( ar[i] < v ) v = ar[i]; }
		return v;

	},

	clamp: function (v, min, max) {

		//return Math.max( min, Math.min( max, value ) );
		v = v < min ? min : v;
		v = v > max ? max : v;
		return v;
	},

	autoSize: ( o ) => {

		let s = o.size === undefined ? [ 1, 1, 1 ] : o.size;
		if ( s.length === 1 ) s[ 1 ] = s[ 0 ];

		let type = o.type === undefined ? 'box' : o.type;
		let radius = o.radius === undefined ? s[0] : o.radius;
		let height = o.height === undefined ? s[1] : o.height;

		if( type === 'sphere' ) s = [ radius, radius, radius ];
		if( type === 'cylinder' || type === 'wheel' || type === 'capsule' ) s = [ radius, height, radius ];
		if( type === 'cone' || type === 'pyramid' ) s = [ radius, height, 0 ];

		if ( s.length === 2 ) s[ 2 ] = s[ 0 ];
		return s;

	},

	correctSize: ( s ) => {

		if ( s.length === 1 ) s[ 1 ] = s[ 0 ];
		if ( s.length === 2 ) s[ 2 ] = s[ 0 ];
		return s;

	},*/

	tmpE: new Euler(),
	tmpM: new Matrix4(),
	tmpM2: new Matrix4(),
	tmpV: new Vector3(),
	tmpQ: new Quaternion(),

	fromTransformToQ: (p, q, inv) => {

		inv = inv || false;

		math$1.tmpM.compose(math$1.tmpV.fromArray(p), math$1.tmpQ.fromArray(q), { x: 1, y: 1, z: 1 });
		math$1.tmpM.decompose(math$1.tmpV, math$1.tmpQ, { x: 1, y: 1, z: 1 });

		//math.tmpQ.fromArray( q )

		if (inv) math$1.tmpQ.invert();

		return math$1.tmpQ.toArray();

	},

	fromTransform: (p, q, p2, q2, inv) => {

		inv = inv || false;
		q2 = q2 || [0, 0, 0, 1];

		math$1.tmpM.compose(math$1.tmpV.fromArray(p), math$1.tmpQ.fromArray(q), { x: 1, y: 1, z: 1 });
		math$1.tmpM2.compose(math$1.tmpV.fromArray(p2), math$1.tmpQ.fromArray(q2), { x: 1, y: 1, z: 1 });
		if (inv) {
			//math.tmpM.getInverse( math.tmpM );
			math$1.tmpM.invert();
			math$1.tmpM.multiply(math$1.tmpM2);
		} else {
			math$1.tmpM.multiply(math$1.tmpM2);
		}

		math$1.tmpM.decompose(math$1.tmpV, math$1.tmpQ, { x: 1, y: 1, z: 1 });

		return math$1.tmpV.toArray();

	},

	arCopy: (a, b) => {

		[...b];

		//for( var i = 0; i< b.length; i++ ) a[i] = b[i];

	},

	axisToQuatArray: (r, isdeg) => { // r[0] array in degree

		isdeg = isdeg || false;
		return math$1.tmpQ.setFromAxisAngle(math$1.tmpV.fromArray(r, 1), isdeg ? r[0] * math$1.torad : r[0]).normalize().toArray();

	},

	toQuatArray: (rotation) => { // rotation array in degree

		return math$1.tmpQ.setFromEuler(math$1.tmpE.fromArray(math$1.vectorad(rotation))).toArray();

	},

	vectorad: (r) => {

		let i = 3, nr = [];
		while (i--) nr[i] = r[i] * math$1.torad;
		nr[3] = r[3];
		return nr;

	},
	/*
		directionVector: ( a, b ) => {
	
			var x = b.x-a.x;
			var y = b.y-a.y;
			var z = b.z-a.z;
			var d = math.tmpV.set( x, 0, z ).normalize().toArray();
			return d;
	
		},
	
		distanceVector: ( a, b ) => {
	
			var x = b.x-a.x;
			var y = b.y-a.y;
			var z = b.z-a.z;
			var d = Math.sqrt( x*x + y*y + z*z );
			return d;
	
		},*/


	//--------------------
	//   COLORS
	//--------------------

	rgbToHex: (rgb) => {

		return '0x' + ('000000' + ((rgb[0] * 255) << 16 ^ (rgb[1] * 255) << 8 ^ (rgb[2] * 255) << 0).toString(16)).slice(- 6);

	},

	hexToRgb: (hex) => {

		hex = Math.floor(hex);
		var r = (hex >> 16 & 255) / 255;
		var g = (hex >> 8 & 255) / 255;
		var b = (hex & 255) / 255;
		return [r, g, b];

	},

	htmlToHex: (v) => {

		return v.toUpperCase().replace("#", "0x");

	},

	hexToHtml: (v) => {

		v = v === undefined ? 0x000000 : v;
		return "#" + ("000000" + v.toString(16)).substr(-6);

	},

	rgbToHtml: (rgb) => {

		return '#' + ('000000' + ((rgb[0] * 255) << 16 ^ (rgb[1] * 255) << 8 ^ (rgb[2] * 255) << 0).toString(16)).slice(- 6);

	},


	//--------------------
	//   NOISE
	//--------------------

	perlin: null,

	resetPerlin: () => {
		if (math$1.perlin !== null) math$1.perlin = null;
	},

	noise: (v, o) => {

		if (math$1.perlin === null) math$1.perlin = new SimplexNoise();

		o = o || {};

		let level = o.level || [1, 0.2, 0.05];
		let frequency = o.frequency || [0.016, 0.05, 0.2];

		let i, f, c = 0, d = 0;

		for (i = 0; i < level.length; i++) {

			f = frequency[i];
			c += level[i] * (0.5 + math$1.perlin.noise3d(v.x * f, v.y * f, v.z * f) * 0.5);
			d += level[i];

		}

		c /= d;

		return c;

	},

	/*radArray: (arr) => {
		var ret = [];
		for(var i = 0; i < 3; i++)
			ret[i] = arr[i] * math.torad;

		return ret;
	},

	degArray: (arr) => {
		var ret = [];
		for(var i = 0; i < 3; i++)
			ret[i] = arr[i] * math.todeg;

		return ret;
	},

	angleDistance: (cur, prv) =>{
		var diff = (cur - prv + 180) % 360 - 180;
		return diff < -180 ? diff + 360 : diff;
	}*/

};

class SimplexNoise {

	constructor(r) {

		if (r == undefined) r = Math;
		this.grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
		[1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
		[0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];

		this.grad4 = [[0, 1, 1, 1], [0, 1, 1, -1], [0, 1, -1, 1], [0, 1, -1, -1],
		[0, -1, 1, 1], [0, -1, 1, -1], [0, -1, -1, 1], [0, -1, -1, -1],
		[1, 0, 1, 1], [1, 0, 1, -1], [1, 0, -1, 1], [1, 0, -1, -1],
		[-1, 0, 1, 1], [-1, 0, 1, -1], [-1, 0, -1, 1], [-1, 0, -1, -1],
		[1, 1, 0, 1], [1, 1, 0, -1], [1, -1, 0, 1], [1, -1, 0, -1],
		[-1, 1, 0, 1], [-1, 1, 0, -1], [-1, -1, 0, 1], [-1, -1, 0, -1],
		[1, 1, 1, 0], [1, 1, -1, 0], [1, -1, 1, 0], [1, -1, -1, 0],
		[-1, 1, 1, 0], [-1, 1, -1, 0], [-1, -1, 1, 0], [-1, -1, -1, 0]];

		this.p = [];
		for (var i = 0; i < 256; i++) {
			this.p[i] = Math.floor(r.random() * 256);
		}
		// To remove the need for index wrapping, double the permutation table length
		this.perm = [];
		for (var i = 0; i < 512; i++) {
			this.perm[i] = this.p[i & 255];
		}

		// A lookup table to traverse the simplex around a given point in 4D.
		// Details can be found where this table is used, in the 4D noise method.
		this.simplex = [
			[0, 1, 2, 3], [0, 1, 3, 2], [0, 0, 0, 0], [0, 2, 3, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 3, 0],
			[0, 2, 1, 3], [0, 0, 0, 0], [0, 3, 1, 2], [0, 3, 2, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 3, 2, 0],
			[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
			[1, 2, 0, 3], [0, 0, 0, 0], [1, 3, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 3, 0, 1], [2, 3, 1, 0],
			[1, 0, 2, 3], [1, 0, 3, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 3, 1], [0, 0, 0, 0], [2, 1, 3, 0],
			[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
			[2, 0, 1, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 0, 1, 2], [3, 0, 2, 1], [0, 0, 0, 0], [3, 1, 2, 0],
			[2, 1, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 1, 0, 2], [0, 0, 0, 0], [3, 2, 0, 1], [3, 2, 1, 0]];
	}

	dot(g, x, y) {
		return g[0] * x + g[1] * y;
	}

	dot3(g, x, y, z) {
		return g[0] * x + g[1] * y + g[2] * z;
	}

	dot4(g, x, y, z, w) {
		return g[0] * x + g[1] * y + g[2] * z + g[3] * w;
	}

	noise(xin, yin) {
		var n0, n1, n2; // Noise contributions from the three corners
		// Skew the input space to determine which simplex cell we're in
		var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
		var s = (xin + yin) * F2; // Hairy factor for 2D
		var i = Math.floor(xin + s);
		var j = Math.floor(yin + s);
		var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
		var t = (i + j) * G2;
		var X0 = i - t; // Unskew the cell origin back to (x,y) space
		var Y0 = j - t;
		var x0 = xin - X0; // The x,y distances from the cell origin
		var y0 = yin - Y0;
		// For the 2D case, the simplex shape is an equilateral triangle.
		// Determine which simplex we are in.
		var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
		if (x0 > y0) { i1 = 1; j1 = 0; } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
		else { i1 = 0; j1 = 1; }      // upper triangle, YX order: (0,0)->(0,1)->(1,1)
		// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
		// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
		// c = (3-sqrt(3))/6
		var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
		var y1 = y0 - j1 + G2;
		var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
		var y2 = y0 - 1.0 + 2.0 * G2;
		// Work out the hashed gradient indices of the three simplex corners
		var ii = i & 255;
		var jj = j & 255;
		var gi0 = this.perm[ii + this.perm[jj]] % 12;
		var gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
		var gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
		// Calculate the contribution from the three corners
		var t0 = 0.5 - x0 * x0 - y0 * y0;
		if (t0 < 0) n0 = 0.0;
		else {
			t0 *= t0;
			n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);  // (x,y) of grad3 used for 2D gradient
		}
		var t1 = 0.5 - x1 * x1 - y1 * y1;
		if (t1 < 0) n1 = 0.0;
		else {
			t1 *= t1;
			n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
		}
		var t2 = 0.5 - x2 * x2 - y2 * y2;
		if (t2 < 0) n2 = 0.0;
		else {
			t2 *= t2;
			n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
		}
		// Add contributions from each corner to get the final noise value.
		// The result is scaled to return values in the interval [-1,1].
		return 70.0 * (n0 + n1 + n2);
	}

	// 3D simplex noise
	noise3d(xin, yin, zin) {
		var n0, n1, n2, n3; // Noise contributions from the four corners
		// Skew the input space to determine which simplex cell we're in
		var F3 = 1.0 / 3.0;
		var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
		var i = Math.floor(xin + s);
		var j = Math.floor(yin + s);
		var k = Math.floor(zin + s);
		var G3 = 1.0 / 6.0; // Very nice and simple unskew factor, too
		var t = (i + j + k) * G3;
		var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
		var Y0 = j - t;
		var Z0 = k - t;
		var x0 = xin - X0; // The x,y,z distances from the cell origin
		var y0 = yin - Y0;
		var z0 = zin - Z0;
		// For the 3D case, the simplex shape is a slightly irregular tetrahedron.
		// Determine which simplex we are in.
		var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
		var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
		if (x0 >= y0) {
			if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } // X Y Z order
			else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; } // X Z Y order
			else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; } // Z X Y order
		}
		else { // x0<y0
			if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; } // Z Y X order
			else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; } // Y Z X order
			else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } // Y X Z order
		}
		// A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
		// a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
		// a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
		// c = 1/6.
		var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
		var y1 = y0 - j1 + G3;
		var z1 = z0 - k1 + G3;
		var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
		var y2 = y0 - j2 + 2.0 * G3;
		var z2 = z0 - k2 + 2.0 * G3;
		var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
		var y3 = y0 - 1.0 + 3.0 * G3;
		var z3 = z0 - 1.0 + 3.0 * G3;
		// Work out the hashed gradient indices of the four simplex corners
		var ii = i & 255;
		var jj = j & 255;
		var kk = k & 255;
		var gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
		var gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
		var gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
		var gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;
		// Calculate the contribution from the four corners
		var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
		if (t0 < 0) n0 = 0.0;
		else {
			t0 *= t0;
			n0 = t0 * t0 * this.dot3(this.grad3[gi0], x0, y0, z0);
		}
		var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
		if (t1 < 0) n1 = 0.0;
		else {
			t1 *= t1;
			n1 = t1 * t1 * this.dot3(this.grad3[gi1], x1, y1, z1);
		}
		var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
		if (t2 < 0) n2 = 0.0;
		else {
			t2 *= t2;
			n2 = t2 * t2 * this.dot3(this.grad3[gi2], x2, y2, z2);
		}
		var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
		if (t3 < 0) n3 = 0.0;
		else {
			t3 *= t3;
			n3 = t3 * t3 * this.dot3(this.grad3[gi3], x3, y3, z3);
		}
		// Add contributions from each corner to get the final noise value.
		// The result is scaled to stay just inside [-1,1]
		return 32.0 * (n0 + n1 + n2 + n3);
	}

	// 4D simplex noise
	noise4d(x, y, z, w) {
		// For faster and easier lookups
		var grad4 = this.grad4;
		var simplex = this.simplex;
		var perm = this.perm;

		// The skewing and unskewing factors are hairy again for the 4D case
		var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
		var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;
		var n0, n1, n2, n3, n4; // Noise contributions from the five corners
		// Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
		var s = (x + y + z + w) * F4; // Factor for 4D skewing
		var i = Math.floor(x + s);
		var j = Math.floor(y + s);
		var k = Math.floor(z + s);
		var l = Math.floor(w + s);
		var t = (i + j + k + l) * G4; // Factor for 4D unskewing
		var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
		var Y0 = j - t;
		var Z0 = k - t;
		var W0 = l - t;
		var x0 = x - X0;  // The x,y,z,w distances from the cell origin
		var y0 = y - Y0;
		var z0 = z - Z0;
		var w0 = w - W0;

		// For the 4D case, the simplex is a 4D shape I won't even try to describe.
		// To find out which of the 24 possible simplices we're in, we need to
		// determine the magnitude ordering of x0, y0, z0 and w0.
		// The method below is a good way of finding the ordering of x,y,z,w and
		// then find the correct traversal order for the simplex we’re in.
		// First, six pair-wise comparisons are performed between each possible pair
		// of the four coordinates, and the results are used to add up binary bits
		// for an integer index.
		var c1 = (x0 > y0) ? 32 : 0;
		var c2 = (x0 > z0) ? 16 : 0;
		var c3 = (y0 > z0) ? 8 : 0;
		var c4 = (x0 > w0) ? 4 : 0;
		var c5 = (y0 > w0) ? 2 : 0;
		var c6 = (z0 > w0) ? 1 : 0;
		var c = c1 + c2 + c3 + c4 + c5 + c6;
		var i1, j1, k1, l1; // The integer offsets for the second simplex corner
		var i2, j2, k2, l2; // The integer offsets for the third simplex corner
		var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
		// simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
		// Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
		// impossible. Only the 24 indices which have non-zero entries make any sense.
		// We use a thresholding to set the coordinates in turn from the largest magnitude.
		// The number 3 in the "simplex" array is at the position of the largest coordinate.
		i1 = simplex[c][0] >= 3 ? 1 : 0;
		j1 = simplex[c][1] >= 3 ? 1 : 0;
		k1 = simplex[c][2] >= 3 ? 1 : 0;
		l1 = simplex[c][3] >= 3 ? 1 : 0;
		// The number 2 in the "simplex" array is at the second largest coordinate.
		i2 = simplex[c][0] >= 2 ? 1 : 0;
		j2 = simplex[c][1] >= 2 ? 1 : 0; k2 = simplex[c][2] >= 2 ? 1 : 0;
		l2 = simplex[c][3] >= 2 ? 1 : 0;
		// The number 1 in the "simplex" array is at the second smallest coordinate.
		i3 = simplex[c][0] >= 1 ? 1 : 0;
		j3 = simplex[c][1] >= 1 ? 1 : 0;
		k3 = simplex[c][2] >= 1 ? 1 : 0;
		l3 = simplex[c][3] >= 1 ? 1 : 0;
		// The fifth corner has all coordinate offsets = 1, so no need to look that up.
		var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
		var y1 = y0 - j1 + G4;
		var z1 = z0 - k1 + G4;
		var w1 = w0 - l1 + G4;
		var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
		var y2 = y0 - j2 + 2.0 * G4;
		var z2 = z0 - k2 + 2.0 * G4;
		var w2 = w0 - l2 + 2.0 * G4;
		var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
		var y3 = y0 - j3 + 3.0 * G4;
		var z3 = z0 - k3 + 3.0 * G4;
		var w3 = w0 - l3 + 3.0 * G4;
		var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
		var y4 = y0 - 1.0 + 4.0 * G4;
		var z4 = z0 - 1.0 + 4.0 * G4;
		var w4 = w0 - 1.0 + 4.0 * G4;
		// Work out the hashed gradient indices of the five simplex corners
		var ii = i & 255;
		var jj = j & 255;
		var kk = k & 255;
		var ll = l & 255;
		var gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32;
		var gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32;
		var gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32;
		var gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32;
		var gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32;
		// Calculate the contribution from the five corners
		var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
		if (t0 < 0) n0 = 0.0;
		else {
			t0 *= t0;
			n0 = t0 * t0 * this.dot4(grad4[gi0], x0, y0, z0, w0);
		}
		var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
		if (t1 < 0) n1 = 0.0;
		else {
			t1 *= t1;
			n1 = t1 * t1 * this.dot4(grad4[gi1], x1, y1, z1, w1);
		}
		var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
		if (t2 < 0) n2 = 0.0;
		else {
			t2 *= t2;
			n2 = t2 * t2 * this.dot4(grad4[gi2], x2, y2, z2, w2);
		} var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
		if (t3 < 0) n3 = 0.0;
		else {
			t3 *= t3;
			n3 = t3 * t3 * this.dot4(grad4[gi3], x3, y3, z3, w3);
		}
		var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
		if (t4 < 0) n4 = 0.0;
		else {
			t4 *= t4;
			n4 = t4 * t4 * this.dot4(grad4[gi4], x4, y4, z4, w4);
		}
		// Sum up and scale the result to cover the range [-1,1]
		return 27.0 * (n0 + n1 + n2 + n3 + n4);
	}

}

class Landscape extends Mesh {

	constructor(o = {}) {

		super();

		this.ready = false;
		this.needUpdate = false;

		this.type = 'terrain';
		this.name = o.name;

		this.folder = o.folder || './assets/textures/terrain/';

		this.mapN = 0;
		this.mapMax = 7;//7

		// terrain, water, road
		this.ttype = o.terrainType || 'terrain';

		this.callback = o.callback || function () { };

		this.physicsUpdate = () => { };

		this.uvx = [o.uv || 18, o.uv || 18];


		this.sample = o.sample == undefined ? [128, 128] : o.sample;
		this.size = o.size === undefined ? [100, 30, 100] : o.size;

		let sx = this.sample[0] - 1;
		let sz = this.sample[1] - 1;

		this.rx = sx / this.size[0];
		this.rz = sz / this.size[2];

		this.zone = o.zone || 1;

		// why ??
		/*let pp = 0
		if( this.zone === 0.5 ) pp=2
		if( this.zone === 0.25 ) pp=3
		if( this.zone === 0.125 ) pp=7*/
		let square = [this.size[0] / sx, this.size[2] / sz];
		//let dx = (this.size[0]/sx)//*pp
		//let dz = (this.size[2]/sz)//**pp



		this.sampleZ = [o.sample[0] * this.zone, o.sample[1] * this.zone];
		//this.sizeZ = [(o.size[0]-dx) * this.zone, o.size[1], (o.size[2]-dz) * this.zone];

		this.sizeZ = [(this.sampleZ[0] - 1) * square[0], o.size[1], ((this.sampleZ[1] - 1)) * square[1]];

		this.lng = this.sample[0] * this.sample[1];
		this.lngZ = this.sampleZ[0] * this.sampleZ[1];

		//console.log(  this.sample, this.sampleZ)

		this.getZid();


		this.data = {
			level: o.level || [1, 0.2, 0.05],
			frequency: o.frequency || [0.016, 0.05, 0.2],
			expo: o.expo || 1,
		};

		this.isWater = o.water || false;

		this.isBorder = false;
		this.wantBorder = o.border || false;

		this.isBottom = false;
		this.wantBottom = o.bottom || false;
		this.wantBorder = o.border || false;

		this.colorBase = this.isWater ? { r: 0, g: 0.7, b: 1 } : { r: 0.25, g: 0.25, b: 0.25 };

		this.maxspeed = o.maxSpeed || 0.1;
		this.acc = o.acc == undefined ? 0.01 : o.acc;
		this.dec = o.dec == undefined ? 0.01 : o.dec;

		this.deep = o.deep == undefined ? 0 : o.deep;

		this.ease = new Vector2();

		// for perlin
		this.complexity = o.complexity == undefined ? 30 : o.complexity;
		this.complexity2 = o.complexity2 == undefined ? null : o.complexity2;

		this.local = new Vector3();
		if (o.local) this.local.fromArray(o.local);

		this.pp = new Vector3();

		this.ratioZ = 1 / this.sampleZ[0];
		this.ratio = 1 / this.sample[0];
		this.ruvx = 1.0 / (this.size[0] / this.uvx[0]);
		this.ruvy = - (1.0 / (this.size[2] / this.uvx[1]));

		this.is64 = o.is64 || false;
		this.isTurn = o.turn || false;

		this.heightData = new Float32Array(this.lngZ);
		this.height = [];

		// for physx 
		this.isAbsolute = o.isAbsolute || false;
		this.isTurned = o.isTurned || false;

		this.isReverse = o.isReverse || false;

		this.changeId = this.isReverse || this.isTurned;
		// console.log(this.changeId)


		if (this.changeId) this.getReverseID();

		this.colors = new Float32Array(this.lng * 3);
		this.geometry = new PlaneGeometry(this.size[0], this.size[2], this.sample[0] - 1, this.sample[1] - 1);
		this.geometry.rotateX(-math$1.PI90);
		//if( this.isTurn ) 
		//this.geometry.rotateY( -math.PI90 );
		//if( this.isTurned ) this.geometry.rotateY( math.PI90 );


		// this.geometry.computeBoundingSphere();

		this.geometry.setAttribute('color', new BufferAttribute(this.colors, 3));
		//this.geometry.setAttribute( 'uv2', this.geometry.attributes.uv );
		this.vertices = this.geometry.attributes.position.array;
		var clevels = new Quaternion(0.5, 0.5, 0.1, 0.2);//0.95, 0.8, 0.1, 0.05 ); 
		if (o.maplevels) clevels.fromArray(o.maplevels);
		var T = TerrainShader;
		var maps = o.maps || ['sand', 'grass3', 'rock'], txt = {};
		var name;

		if (this.isWater) maps = ['water'];

		for (let i in maps) {

			name = maps[i];

			txt[name + '_c'] = Pool.texture({ url: this.folder + name + '_c.jpg', flip: false, repeat: this.uvx, encoding: o.encoding || true, callback: this.mapcallback.bind(this) });
			txt[name + '_n'] = Pool.texture({ url: this.folder + name + '_n.jpg', flip: false, repeat: this.uvx, callback: this.mapcallback.bind(this) });

			//txt[name+'_c'] = Pool.directTexture(this.folder + name +'_c.jpg', { flip:false, repeat:this.uvx, encoding:o.encoding || true , callback: this.mapcallback.bind(this)  });
			//txt[name+'_n'] = Pool.directTexture(this.folder + name +'_n.jpg', { flip:false, repeat:this.uvx, callback: this.mapcallback.bind(this) });
			// if( isORM )txt[name+'_n'] = Pool.directTexture('./assets/textures/terrain/'+name+'_n.jpg', { flip:false, repeat:this.uvx, callback: this.mapcallback.bind(this) });

		}

		//txt['noise'] = Pool.directTexture(this.folder + 'noise.png', { flip:false, repeat:[1,1], encoding:false , callback: this.mapcallback.bind(this)  });
		txt['noise'] = Pool.texture({ url: this.folder + 'noise.png', flip: false, repeat: [1, 1], encoding: false, callback: this.mapcallback.bind(this) });

		this.txt = txt;

		this.material = new MeshPhysicalMaterial({ name: 'terrain', vertexColors: true, color: 0xFFFFFF, map: txt[maps[0] + '_c'], normalMap: txt[maps[0] + '_n'] });

		if (o.envmap !== undefined) this.material.envMap = o.envmap;

		if (this.isWater) {
			this.material.transparent = true;
			this.material.opacity = o.opacity || 0.4;
			this.material.side = DoubleSide;
			this.material.alphaMap = txt[maps[0] + '_c'];
			this.material.map = null;
			this.material.metalness = 0.9;
			this.material.roughness = 0.1;
		} else {
			this.material.reflectivity = 0.0;
			this.material.metalness = o.metalness || 0.0;
			this.material.roughness = o.roughness || 0.77;
		}

		var ns = o.nScale || 1;
		this.material.normalScale.set(ns, ns);

		if (!this.isWater) {

			this.material.onBeforeCompile = function (shader) {

				let uniforms = shader.uniforms;

				//uniforms['fogTime'] = { value: 0 };

				uniforms['clevels'] = { value: clevels };

				uniforms['map1'] = { value: txt[maps[1] + '_c'] };
				uniforms['map2'] = { value: txt[maps[2] + '_c'] };

				uniforms['randomUv'] = { value: 1 };

				uniforms['normalMap1'] = { value: txt[maps[1] + '_n'] };
				uniforms['normalMap2'] = { value: txt[maps[2] + '_n'] };

				//uniforms['noise'] = { value: txt['noise'] };
				uniforms['noiseMap'] = { value: txt['noise'] };
				uniforms['useNoiseMap'] = { value: 1 };

				shader.uniforms = uniforms;

				Shader.addParsFragment(shader, Shader.getRandomUv() + T.fragmentAdd);

				let fragment = shader.fragmentShader;

				fragment = fragment.replace('#include <map_fragment>', T.map);
				fragment = fragment.replace('#include <normal_fragment_maps>', T.normal);
				fragment = fragment.replace('#include <color_fragment>', '');

				shader.fragmentShader = fragment;

				this.userData.shader = shader;

				//if( o.shader ) o.shader.modify( shader );

				Shader.modify(shader);

			};


			Object.defineProperty(this.material, 'randomUv', {
				get() { return this.userData.shader.uniforms.randomUv.value ? true : false; },
				set(value) { this.userData.shader.uniforms.randomUv.value = value ? 1 : 0; }
			});

			Object.defineProperty(this.material, 'map1', {
				get() { return this.userData.shader.uniforms.map1.value; },
				set(value) { this.userData.shader.uniforms.map1.value = value; }
			});

			Object.defineProperty(this.material, 'map2', {
				get() { return this.userData.shader.uniforms.map2.value; },
				set(value) { this.userData.shader.uniforms.map2.value = value; }
			});

			Object.defineProperty(this.material, 'normalMap1', {
				get() { return this.userData.shader.uniforms.normalMap1.value; },
				set(value) { this.userData.shader.uniforms.normalMap1.value = value; }
			});

			Object.defineProperty(this.material, 'normalMap2', {
				get() { return this.userData.shader.uniforms.normalMap2.value; },
				set(value) { this.userData.shader.uniforms.normalMap2.value = value; }
			});

		} else {

			this.material.onBeforeCompile = function (shader) {

				var fragment = shader.fragmentShader;

				fragment = fragment.replace('#include <alphamap_fragment>', T.alphamap);

				shader.fragmentShader = fragment;

			};

		}


		//THREE.Mesh.call( this, this.geometry, this.material );

		// super( this.geometry, this.material );

		if (o.debug) {
			this.debugZone(o);
		}

		//root.garbage.push( this.geometry );


		if (this.wantBorder) this.addBorder(o);
		if (this.wantBottom) this.addBottom(o);

		if (o.pos) this.position.fromArray(o.pos);


		// rotation is in degree or Quaternion
		o.quat = o.quat === undefined ? [0, 0, 0, 1] : o.quat;
		if (o.rot !== undefined) { o.quat = math$1.toQuatArray(o.rot); delete o.rot; }
		//console.log(o.quat)
		this.quaternion.fromArray(o.quat);

		if (o.decal) this.position.y += o.decal;

		this.castShadow = true;
		this.receiveShadow = true;

		Pool.set('terrain' + this.name, this.material, 'material', true);

		this.update();

	}

	getZid() {

		this.zid = {};

		let lx = (this.sample[0] - this.sampleZ[0]) * 0.5;
		let lz = (this.sample[1] - this.sampleZ[1]) * 0.5;
		let first = (this.sample[0] * lz) + lx;
		let line = 0;
		for (let j = 0; j < this.lngZ; j++) {
			//line = j % this.sampleZ[0];
			line = Math.floor(j / this.sampleZ[0]);
			this.zid[first + j + (line * ((lx * 2)))] = j;
		}
	}

	debugZone(o) {

		this.geometryZ = new PlaneGeometry(this.sizeZ[0], this.sizeZ[2], this.sampleZ[0] - 1, this.sampleZ[1] - 1);
		this.geometryZ.rotateX(-math$1.PI90);
		this.verticesZ = this.geometryZ.attributes.position.array;

		const debuger = new Mesh(this.geometryZ, new MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
		if (o.pos) debuger.position.fromArray(o.pos);
		this.add(debuger);



	}

	mapcallback() {

		this.mapN++;
		if (this.mapN == this.mapMax) {
			// this.material.needsUpdate = true;
			this.callback();
		}

	}

	addBottom(o) {

		var geometry = new PlaneGeometry(this.size[0], this.size[2], 1, 1);
		geometry.rotateX(math$1.PI90);


		this.bottomMesh = new Mesh(geometry, this.borderMaterial);

		this.add(this.bottomMesh);

		this.isBottom = true;
	}

	addBorder(o) {

		this.borderMaterial = new MeshStandardMaterial({

			vertexColors: true,
			metalness: this.isWater ? 0.8 : 0.4,
			roughness: this.isWater ? 0.2 : 0.6,

			//envMap: view.getEnvMap(),
			//normalMap:this.wn,
			normalScale: this.isWater ? [0.25, 0.25] : [2, 2],
			transparent: this.isWater ? true : false,
			opacity: this.isWater ? (o.opacity || 0.8) : 1,
			envMap: o.envmap || null,

			//shadowSide : false

		});

		//view.getMat()[this.name+'border'] = this.borderMaterial;

		var front = new PlaneGeometry(this.size[0], 2, this.sample[0] - 1, 1);
		var back = new PlaneGeometry(this.size[0], 2, this.sample[0] - 1, 1);
		var left = new PlaneGeometry(this.size[2], 2, this.sample[1] - 1, 1);
		var right = new PlaneGeometry(this.size[2], 2, this.sample[1] - 1, 1);

		front.translate(0, 1, this.size[2] * 0.5);
		back.rotateY(-math$1.Pi);
		back.translate(0, 1, -this.size[2] * 0.5);
		left.rotateY(-math$1.PI90);
		left.translate(-this.size[0] * 0.5, 1, 0);
		right.rotateY(math$1.PI90);
		right.translate(this.size[0] * 0.5, 1, 0);

		this.borderGeometry = mergeVertices(mergeBufferGeometries([front, back, left, right]));
		this.borderVertices = this.borderGeometry.attributes.position.array;
		this.lng2 = this.borderVertices.length / 3;
		this.list = new Array(this.lng2);
		this.borderColors = new Float32Array(this.lng * 3);
		this.borderGeometry.setAttribute('color', new BufferAttribute(this.borderColors, 3));
		this.borderMesh = new Mesh(this.borderGeometry, this.borderMaterial);

		var j = this.lng2, n, i;
		while (j--) {
			n = j * 3;
			i = this.borderVertices[n + 1] > 0 ? this.findPoint(this.borderVertices[n], this.borderVertices[n + 2]) : -1;
			this.list[j] = i;

		}

		this.add(this.borderMesh);

		this.borderMesh.castShadow = true;
		this.borderMesh.receiveShadow = true;

		this.isBorder = true;

	}

	dispose() {

		if (this.isBottom) {
			this.remove(this.bottomMesh);
			this.bottomMesh.geometry.dispose();
		}

		if (this.isBorder) {
			this.remove(this.borderMesh);
			this.borderMesh.geometry.dispose();
			this.borderMesh.material.dispose();
		}

		this.geometry.dispose();
		this.material.dispose();
		for (let t in this.txt) this.txt[t].dispose();

	}

	easing(key, azimuthal, wait) {

		//var key = user.key;
		if (key[0] === 0 && key[1] === 0) return;

		//if( !key[0] || !key[1] ) return;

		var r = azimuthal || 0;//view.getAzimuthal();

		if (key[7]) this.maxspeed = 1.5;
		else this.maxspeed = 0.25;

		//acceleration
		this.ease.y += key[1] * this.acc; // up down
		this.ease.x += key[0] * this.acc; // left right
		//speed limite
		this.ease.x = this.ease.x > this.maxspeed ? this.maxspeed : this.ease.x;
		this.ease.x = this.ease.x < -this.maxspeed ? -this.maxspeed : this.ease.x;
		this.ease.y = this.ease.y > this.maxspeed ? this.maxspeed : this.ease.y;
		this.ease.y = this.ease.y < -this.maxspeed ? -this.maxspeed : this.ease.y;

		//break
		if (!key[1]) {
			if (this.ease.y > this.dec) this.ease.y -= this.dec;
			else if (this.ease.y < -this.dec) this.ease.y += this.dec;
			else this.ease.y = 0;
		}
		if (!key[0]) {
			if (this.ease.x > this.dec) this.ease.x -= this.dec;
			else if (this.ease.x < -this.dec) this.ease.x += this.dec;
			else this.ease.x = 0;
		}

		if (!this.ease.x && !this.ease.y) return;

		this.local.z += Math.sin(r) * this.ease.x + Math.cos(r) * this.ease.y;
		this.local.x += Math.cos(r) * this.ease.x - Math.sin(r) * this.ease.y;

		this.update(wait);

	}



	getTri() {

		return this.geometry


	}

	getHeight(x, z) {



		x *= this.rx;
		z *= this.rz;
		x += this.sample[0] * 0.5;
		z += this.sample[1] * 0.5;

		//this.pv.set( x, 0, z ).applyAxisAngle( {x:0, y:1, z:0}, -math.PI90 )

		/*if( this.isTurn ){
			x = Math.floor(-z);
			z = Math.floor(x);
		}else {*/
		x = Math.floor(x);
		z = Math.floor(z);
		//}



		var h = this.isTurn ? this.height[this.findId2(x, z)] : this.height[this.findId(x, z)];
		return (h * this.size[1]) + this.position.y;

	}

	findIdZ(x, z) {

		return x + (z * this.sampleZ[1]) //|| 1;

	}

	findId(x, z) {

		return x + (z * this.sample[1]) //|| 1;

	}

	findId2(x, z) {

		return z + (-x * this.sample[0]) || 1;

	}

	/*findId3( x, z ){

		return z+(x*this.sample[0]) //|| 1;

	}*/

	findPoint(x, z) {

		var i = this.lng, n;
		while (i--) {
			n = i * 3;
			if (this.vertices[n] === x && this.vertices[n + 2] === z) return i;
		}

		return -1;

	}

	getReverseID() {

		this.invId = [];

		let i = this.lngZ, x, z;
		const sz = this.sampleZ[1] - 1;
		this.sampleZ[0] - 1;

		while (i--) {

			x = i % this.sampleZ[0];
			z = Math.floor(i * this.ratioZ);
			if (this.isReverse) z = sz - z;
			//xr = sx - x;
			//this.invId[i] = this.findId( x, sz - z )//
			this.invId[i] = this.isTurned ? (this.lngZ - 1) - this.findIdZ(z, x) : this.findIdZ(x, z);

			//console.log(i, this.findId( x, sz - z ), (this.lng-1)-this.findId( z, x ))
		}

	}

	set(o) {

		if (o.ease) this.easing(o.key, o.azimut);
		if (o.decal) this.decal(o.decal, true);

	}

	decal(v, wait) {

		this.local.x += v[0];
		this.local.y += v[1];
		this.local.z += v[2];
		this.update(wait);

	}

	updateUv() {

		if (this.isWater) {
			this.material.normalMap.offset.x += 0.002;
			this.material.normalMap.offset.y += 0.001;
		} else {
			let v = { x: this.local.x * this.ruvx, y: this.local.z * this.ruvy };
			if (this.material.map) this.material.map.offset.copy(v);
			if (this.material.normalMap) this.material.normalMap.offset.copy(v);

		}

	}

	update(wait) {

		let v = this.pp;
		let cc = [1, 1, 1];
		let i = this.lng, n, x, z, c, id, result, idz;
		let oldz, oldh, ccY, ccc;

		while (i--) {


			n = i * 3;
			x = i % this.sample[0];
			z = Math.floor(i * this.ratio);

			v.set(x + (this.local.x * this.rx), this.local.y, z + (this.local.z * this.rz));

			c = math$1.noise(v, this.data);



			//c = Math.quinticSCurve(c);
			//c = Math.cubicSCurve(c)
			//c = Math.linear(c,0.2, 1);
			//c = Math.clamp(c,0.2,1)

			c = Math.pow(c, this.data.expo);

			c = c > 1 ? 1 : c;
			c = c < 0 ? 0 : c;


			if (this.ttype === 'road') {

				if (oldz === z) {
					if (x === 1 || x === 2 || x === 29 || x === 30) c = oldh + 0.1;
					else c = oldh;
				} else {
					oldz = z;
					oldh = c;
				}

				//console.log(x)
			}

			this.height[i] = c;

			ccY = (c * this.size[1]) + this.deep;
			this.vertices[n + 1] = ccY;

			//id = this.changeId ? this.invId[i] : i;
			result = this.isAbsolute ? c : c * this.size[1];

			if (this.zid[i] !== undefined) {
				idz = this.zid[i];
				id = this.changeId ? this.invId[idz] : idz;

				// for physics
				this.heightData[id] = result;

				// for debug
				if (this.verticesZ) this.verticesZ[(idz * 3) + 1] = ccY;

			}

			// for physics
			//this.heightData[ id ] = result;





			if (this.isWater) {

				cc = [c * this.colorBase.r, c * this.colorBase.g, c * this.colorBase.b];

			} else {

				cc = [c, 0, 0];

			}

			//ccc = math.clamp(cc[0]+0.25, 0.25, 1)
			ccc = cc[0];

			//if(ccc>mm) mm = ccc
			//if(ccc<mi) mi = ccc



			this.colors[n] = ccc;
			this.colors[n + 1] = ccc;
			this.colors[n + 2] = ccc;
			//oldx = x;


		}

		//console.log(mm, mi)


		if (this.isBorder) {

			let j = this.lng2, h;
			while (j--) {
				n = j * 3;
				if (this.list[j] !== -1) {
					h = this.height[this.list[j]];
					this.borderVertices[n + 1] = (h * this.size[1]) + this.deep;
					ccc = math$1.clamp(h + 0.25, 0.25, 1);
					this.borderColors[n] = ccc; //* this.colorBase.r;//h * this.colorBase.r//ee;
					this.borderColors[n + 1] = ccc; //* this.colorBase.g;// h * this.colorBase.g//ee*0.5;
					this.borderColors[n + 2] = ccc; //* this.colorBase.b;// h * this.colorBase.b//ee*0.3;

				} else {
					this.borderColors[n] = this.colorBase.r;//0.5;
					this.borderColors[n + 1] = this.colorBase.g;//0.25;
					this.borderColors[n + 2] = this.colorBase.b;//0.15;
				}
			}

		}

		if (wait) this.needUpdate = true;
		else this.updateGeometry();



		if (this.ready) this.physicsUpdate(this.name, this.heightData);

		this.ready = true;

		//if( phy ) root.view.update( { name:'terra', heightData:this.heightData, sample:this.sample } );

	}

	step(n) {

		if (!this.needUpdate) return
		this.updateGeometry();
		this.needUpdate = false;

	}

	updateGeometry() {

		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.color.needsUpdate = true;
		this.geometry.computeVertexNormals();

		this.updateUv();

		if (this.geometryZ) this.geometryZ.attributes.position.needsUpdate = true;

		if (this.isBorder) {
			this.borderGeometry.attributes.position.needsUpdate = true;
			this.borderGeometry.attributes.color.needsUpdate = true;
		}

	}

}

// SHADERS

// about no tiles
// https://iquilezles.org/articles/texturerepetition/

const TerrainShader = {

	fragmentAdd: /* glsl */`
        uniform vec4 clevels;
        uniform float randomUv;

        uniform sampler2D noise;

        uniform sampler2D normalMap1;
        uniform sampler2D normalMap2;

        uniform sampler2D roughnessMap1;
        uniform sampler2D roughnessMap2;

        uniform float aoMapIntensity;
        uniform sampler2D map1;
        uniform sampler2D map2;

        vec4 textureMAP( sampler2D mapper, in vec2 uv ){
            if( randomUv == 1.0 ) return textureNoTile( mapper, uv );
            else return texture2D( mapper, uv );
        }

        vec4 MappingMix( float slope, vec4 level, vec4 rocks, vec4 grasss, vec4 sands ){
            vec4 cc = rocks;
            if (slope < level.x) cc = grasss;
            if (slope < level.z) cc = sands;
            //if (( slope < level.x ) && (slope >= level.y)) cc = mix( grasss , rocks, (slope - level.y) * (1. / (level.x - level.y)));
            //if (( slope < level.y ) && (slope >= level.z)) cc = mix( sands , grasss, (slope - level.z) * (1. / (level.y - level.z)));

            float d = level.y;
            float rx = 1.0/level.y;

            if (( slope < level.x + d ) && (slope > level.x)) cc = mix( grasss , rocks, ( slope - (level.x) ) * rx );

            d = level.w;
            rx = 1.0/level.w;
            if (( slope < level.z + d ) && (slope > level.z )) cc = mix( sands , grasss, ( slope - (level.z) ) * rx );

            //cc = mix( grasss, cc, smoothstep(0.0,1.0, slope)*20.0 );
            return cc;
        }
    `,

	// roughnessmap_fragment

	rough: /* glsl */`
        float roughnessFactor = roughness;
        float metalnessFactor = metalness;
        #ifdef USE_ROUGHNESSMAP

            vec4 sandR = textureMAP( roughnessMap, vRoughnessMapUv );
            vec4 grassR = textureMAP( roughnessMap1, vRoughnessMapUv );
            vec4 rockR = textureMAP( roughnessMap2, vRoughnessMapUv );

            vec4 baseColorR = MappingMix( vColor.r, clevels, rockR, grassR, sandR );
            // reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
            float ambientOcclusion =( baseColorR.r - 1.0 ) * aoMapIntensity + 1.0;
            roughnessFactor *= baseColorR.g;
            metalnessFactor *= baseColorR.b;
        #endif
    `,

	// aomap_fragment

	ao: /* glsl */`
        reflectedLight.indirectDiffuse *= ambientOcclusion;
        #if defined( USE_ENVMAP ) && defined( STANDARD )
            float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );
            reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );
        #endif
    `,

	// map_fragment.glsl

	map: /* glsl */`
        #ifdef USE_MAP

            vec4 sand = textureMAP( map, vMapUv );
            vec4 grass = textureMAP( map1, vMapUv );
            vec4 rock = textureMAP( map2, vMapUv ); 

            vec4 baseColor = MappingMix(vColor.r, clevels, rock, grass, sand);
            diffuseColor *= baseColor;

        #endif
    `,

	// normal_fragment_maps

	normal: /* glsl */`

        #ifdef USE_NORMALMAP_OBJECTSPACE

            normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals

            #ifdef FLIP_SIDED

                normal = - normal;

            #endif

            #ifdef DOUBLE_SIDED

                normal = normal * faceDirection;

            #endif

            normal = normalize( normalMatrix * normal );

        #elif defined( USE_NORMALMAP_TANGENTSPACE )

            vec4 sandN = textureMAP( normalMap, vNormalMapUv );
            vec4 grassN = textureMAP( normalMap1, vNormalMapUv );
            vec4 rockN = textureMAP( normalMap2, vNormalMapUv );
            vec3 mapN = MappingMix(vColor.r, clevels, rockN, grassN, sandN).xyz * 2.0 - 1.0;

            ///vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;

            mapN.xy *= normalScale;
            normal = normalize( tbn * mapN );

        #elif defined( USE_BUMPMAP )

            normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );

        #endif
    `,

	normal2: /* glsl */`

        #ifdef OBJECTSPACE_NORMALMAP

            normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals

            #ifdef FLIP_SIDED

                normal = - normal;

            #endif

            #ifdef DOUBLE_SIDED

                normal = normal * faceDirection;

            #endif

            normal = normalize( normalMatrix * normal );

        #elif defined( TANGENTSPACE_NORMALMAP )

            vec4 sandN = textureMAP( normalMap, vNormalMapUv );
            vec4 grassN = textureMAP( normalMap1, vNormalMapUv );
            vec4 rockN = textureMAP( normalMap2, vNormalMapUv );

            vec3 mapN = MappingMix(vColor.r, clevels, rockN, grassN, sandN).xyz * 2.0 - 1.0;

            //vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
            mapN.xy *= normalScale;

            normal = normalize( tbn * mapN );

        #elif defined( USE_BUMPMAP )

            normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );

        #endif
    `,

	alphamap: /* glsl */`
        #ifdef USE_ALPHAMAP
            diffuseColor.a = opacity +( texture2D( alphaMap, vAlphaMapUv ).g * opacity) * (1.0-opacity);
        #endif
    `,

};

// THREE TERRAIN

class Terrain extends Item {

	constructor() {

		super();

		this.Utils = Utils;
		this.type = 'terrain';
		this.num = Num[this.type];

	}

	step() {

		root.Ar;
		root.ArPos[this.type];

		let i = this.list.length, s;

		while (i--) {

			s = this.list[i];
			//n = N + ( i * this.num );
			s.step();// AR[n] );

		}

	}

	add(o = {}) {

		this.setName(o);

		if (root.engine === 'PHYSX') {
			o.isAbsolute = true;
			o.isTurned = true;
		}

		if (root.engine === 'HAVOK') {
			o.isAbsolute = true;
			o.isTurned = true;
			o.isReverse = false;
		}

		if (root.engine !== 'OIMO') {
			o.zone = o.zone || 0.25;
			//o.debuger = true
		}

		const t = new Landscape(o);

		t.physicsUpdate = (name, h) => {

			root.flow.tmp.push({ name: name, heightData: h });
			//root.post({m:'change', o:{ name:'terra', heightData:h }})
		};

		// add to world
		this.addToWorld(t, o.id);

		// add to physics
		root.post({ m: 'add', o: toPhysics(t) });

		return t

	}

	set(o = {}, b = null) {

		if (b === null) b = this.byName(o.name);
		if (b === null) return

		b.set(o);

	}

}

const toPhysics = function (t) {

	const o = {
		name: t.name,
		type: t.type,
		pos: t.position.toArray(),
		quat: root.engine === 'PHYSX' ? [0, 0, 0, 1] : t.quaternion.toArray(), // physx terrain can't turn !!
	};

	if (root.engine === 'PHYSX' || root.engine === 'AMMO' || root.engine === 'HAVOK') {
		o.type = 'terrain';
		o.size = t.sizeZ;
		o.sample = t.sampleZ;
		o.zone = t.zone;
		o.heightData = t.heightData;
	} else {
		o.type = 'mesh';
		o.v = MathTool.getVertex(t.geometry, root.engine === 'OIMO');
		o.index = root.engine === 'OIMO' ? null : MathTool.getIndex(t.geometry);
	}

	return o

};

class Solver extends Item {

	constructor() {

		super();

		this.Utils = Utils;
		this.type = 'solver';

	}

	step() {

		const AR = root.Ar;
		const N = root.ArPos[this.type];

		let i = this.list.length, n;

		while (i--) {

			n = N + (i * Num[this.type]);
			this.list[i].update(AR, n);

		}

	}

	///

	add(o = {}) {

		this.setName(o);

		let solver = new Articulation(o);

		// add to world
		this.addToWorld(solver, o.id);

		// add to worker
		root.post({ m: 'add', o: o });

		return solver;


	}

	set(o = {}) {

	}

}

// ARTICULATION SOLVER

class Articulation {//extends Basic3D 

	constructor(o) {

		//super();

		this.name = o.name;
		this.type = 'solver';
		this.needData = o.needData || false;
		this.joints = [];
		this.jid = 0;
		this.speed = 1;

	}

	update(AR, n) {

		if (!this.needData) return

		let k = this.joints.length, j, m;

		while (k--) {

			m = n + (k * 7);

			j = this.joints[k];

			j.data.target.x = AR[m + 0];
			j.data.target.y = AR[m + 1];
			j.data.target.z = AR[m + 2];

			j.data.target.rx = Math.round(AR[m + 3]);
			j.data.target.ry = Math.round(AR[m + 4]);
			j.data.target.rz = Math.round(AR[m + 5]);

			/*j.data.target.twiwt = Math.round( AR[ m + 3] )
			j.data.target.swing1 = Math.round( AR[ m + 4] )
			j.data.target.swing2 = Math.round( AR[ m + 5] )*/

			j.data.target.count = AR[m + 6];

		}

	}

	start() {

		root.post({ m: 'startArticulation', o: { name: this.name } });

	}

	stop() {

		root.post({ m: 'stopArticulation', o: { name: this.name } });

	}

	commonInit() {

		root.post({ m: 'commonInitArticulation', o: { name: this.name } });

	}

	addJoint(o) {

		this.jid = this.joints.length;

		o.name = o.name || (this.name + '_Joint_' + this.jid);
		o.solver = this.name;

		if (o.rot1 !== undefined) { o.quat1 = MathTool.quatFromEuler(o.rot1); delete (o.rot1); }
		if (o.rot2 !== undefined) { o.quat2 = MathTool.quatFromEuler(o.rot2); delete (o.rot2); }

		if (o.type !== 'fixe') {
			this.joints.push(new SolverJoint(o, this));
		}

		root.post({ m: 'addSolverJoint', o: o });

	}

	/*addBone ( mesh ) {

		console.log('bone is add')

		this.add( mesh );

	}*/

	driveJoints(dt) {

		let isInDrive = false;

		let k = this.joints.length, j, d, nup = [];

		while (k--) {

			j = this.joints[k];
			j.update(dt);
			d = j.isDrive;
			if (d) nup.push(j.nup);
			isInDrive = d ? true : isInDrive;

		}

		// update or die
		if (isInDrive) root.motor.change(nup);
		else {
			if (this.resolve) {
				this.resolve();
				delete this.resolve;
			}
		}

	}

	setAngles(angles, time) {

		if (!angles) return

		let j = this.joints.length;

		while (j--) {
			this.joints[j].pose(angles[j] !== undefined ? angles[j] : 0, time !== undefined ? time : this.speed);
		}

		return new Promise((resolve) => this.resolve = resolve);

	}


}

// ARTICULATION JOINT

class SolverJoint {

	constructor(o, solver) {

		this.name = o.name;
		this.solver = solver;
		this.type = 'solverJoint';
		this.isDrive = false;
		//this.inverse = o.inverse || false

		this.current = 0;
		this.tmp = 0;
		this.target = 0;
		this.start = 0;
		this.time = 0;
		this.nup = null;

		this.data = {

			target: { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, count: 0 },

			//target:{ x:0, y:0, z:0, twist:0, swing1:0, swing2:0, count:0 },

		};

		if (o.limits) {
			this.driveType = o.limits[0][0];
			this.min = o.limits[0][1];
			this.max = o.limits[0][2];
		}

		if (o.position) {
			let i = o.position.length, t;

			while (i--) {
				t = o.position[i];
				this.data.target[t[0]] = t[1];
				//if(t[0]===this.driveType)  this.current = t[1]

			}
		}

		//stiffness, damping, forceLimit, acceleration drive flag
		//o.drives = [[this.driveType, 100000, 0, Infinity, true ]];
		//solver.addJoint(o);

	}

	start() {

	}

	pose(target, time) {



		// linear target need to be clamp ?!
		this.target = MathTool.clamp(target, this.min, this.max);
		//this.current = this.data.target[ this.driveType ];
		this.current = MathTool.clamp(this.data.target[this.driveType], this.min, this.max);

		//console.log( this.target, this.current )

		if (this.target === this.current) return;


		this.start = this.current;
		this.tmp = 0;
		this.time = time;

		this.isDrive = true;

		/*if( this.driveType !== 'z' ) this.isDrive = true;
		else{ 
			/*if(target===0.3 || target===-0.3) this.start = 0;
			else{

				if(this.name = 'A7') this.start = -0.3;
				else this.start = 0.3;
			}*/
		//	console.log( this.driveType, this.current )
		//}

		//return new Promise((resolve) => this.resolve = resolve);

	}

	update(dt) {

		if (this.isDrive) {

			this.tmp += dt;
			let t = this.tmp / this.time;
			t = (t > 1) ? 1 : t;
			let move = MathTool.lerp(this.start, this.target, t);//this.current + (this.target - this.current) * t;

			this.nup = { name: this.name, drivesTarget: [[this.driveType, move]] };

			if (t === 1) this.isDrive = false;

		}

	}

}

class Textfield extends Mesh {

	constructor(o = {}) {

		super(new PlaneGeometry(), new MeshBasicMaterial({ polygonOffset: true, polygonOffsetFactor: -4 }));

		this.name = o.nam || 'text';
		this.canvas = null;

		this.w = o.w || 0;
		this.h = o.h || 0;

		this.weight = o.weight ?? 700;

		this.font = o.font ?? "'Mulish', sans-serif";
		this.fontSize = o.fontSize ?? 32;
		this.backgroundColor = o.backgroundColor ?? "#00000000";
		this.fontColor = o.fontColor ?? "#FFFFFF";
		this.material.alphaTest = 0.5;
		this.set(o.text);

		if (o.pos) this.position.fromArray(o.pos);
		if (o.rot) this.quaternion.fromArray(MathTool.quatFromEuler(o.rot));

	}

	set(str) {

		if (!this.canvas) this.canvas = document.createElement("canvas");
		let ctx = this.canvas.getContext("2d"), w, h, r;

		ctx.font = this.weight + " " + this.fontSize + "px " + this.font;


		let metrics = ctx.measureText(str);

		//resize to nearest power of 2
		w = 2 ** Math.ceil(Math.log2(metrics.width));
		h = 2 ** Math.ceil(Math.log2(ctx.measureText('M').width));




		this.canvas.width = w;
		this.canvas.height = h;

		ctx.fillStyle = this.backgroundColor;
		ctx.fillRect(0, 0, w, h);
		//var backgroundAlpha = ctx.getImageData(0, 0, 1, 1).data[3];

		ctx.fillStyle = this.fontColor;
		//ctx.font = this.fontSize + "px " + this.font;
		ctx.font = this.weight + " " + this.fontSize + "px " + this.font;
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';

		ctx.fillText(str, w * 0.5, h * 0.5);

		this.material.map = new CanvasTexture(this.canvas);

		//if(this.w===0) this.w = w*0.02

		if (this.h !== 0) {
			r = this.h / h;
			this.scale.set(w * r, this.h, 0);
		}

		else if (this.w !== 0) {
			r = this.w / h;
			this.scale.set(this.w, h * r, 0);
		}

		else {
			this.scale.set(w * 0.025, h * 0.025, 0);
		}


		//this.scale.set(this.w,h*r,0)

		/*let img = new Image(w, h);
		img.src = canvas.toDataURL( 'image/png' );

		let self = this

		img.onload = ()=>{

			//
			self.material.map = new Texture(img);
			self.material.map.needsUpdate = true
			//self.material.needsUpdate = true

			self.scale.set(w*0.05,h*0.05,0)
		}*/

	}

	dispose() {

		this.parent.remove(this);
		this.material.map.dispose();
		this.material.dispose();
		this.geometry.dispose();

	}

}

let Nb = 0;

class Button {

	constructor(o = {}) {

		this.down = false;


		this.time = o.time || 250;

		this.p = o.pos || [0, 0, 0];

		this.type = o.type || 'box';
		this.name = o.name || 'button' + Nb++;
		this.pos = o.pos || [0, 0, 0];
		this.size = o.size || [1, 1, 1];
		this.radius = o.radius || 0;
		this.axe = o.axe !== undefined ? o.axe : 1;

		this.fontSize = o.fontSize || 0.8;
		this.fontScale = o.fontScale || 1.0;

		this.extraForce = true;


		this.decal = this.type === 'sphere' ? this.size[1] * 0.5 : (this.size[1] * 0.5) - this.radius;

		if (this.type !== 'sphere') this.pos[this.axe] += this.decal;


		this.origin = this.pos[this.axe];
		let height = this.size[this.axe] - (this.radius * 2);

		//this.range = [ this.origin - this.decal - (this.radius*2), this.origin ]
		this.range = [this.origin - height, this.origin];

		this.value = this.origin;
		this.target = this.origin;

		this.speed = (this.size[this.axe] / 3) / (this.size[this.axe]);



		this.callback = function () {
			console.log("action down");
		};

		if (o.callback) {
			this.callback = o.callback;
			delete o.callback;
		}

		o.button = true;
		o.pos = this.pos;
		if (!o.material) o.material = 'button';
		o.kinematic = true;
		o.mask = 1;



		this.timeout = null;

		// add model & physics
		this.b = root.motor.add(o);

		this.b.userData['action'] = this.action.bind(this);
		this.b.userData['out'] = this.out.bind(this);

		// is bad ?
		this.b.userData['direct'] = this.callback.bind(this);

		// extra text on top 
		if (o.text) this.addText(o.text);

	}

	addText(txt, size) {

		this.fontSize = this.type === 'box' ? this.size[this.axe] * 0.8 : this.size[0] * 0.8;
		this.fontSize *= this.fontScale;
		let dt = { text: txt, pos: [0, this.size[1] * 0.5, 0], rot: [-90, 0, 0], h: this.fontSize };
		if (this.axe === 2) dt = { text: txt, pos: [0, 0, this.size[2] * 0.5], rot: [0, 0, 0], h: this.fontSize };
		this.txt = new Textfield(dt);
		this.b.add(this.txt);

	}

	action(p) {

		if (this.down) return

		this.down = true;
		this.target = this.range[0];
		if (this.extraForce) root.motor.explosion(p || this.p, this.size[0] * 2, 0.01);
		this.callback();

	}

	out() {

		if (!this.down) return

		this.down = false;
		this.target = this.range[1];
		if (this.extraForce) root.motor.explosion(this.p, this.size[0] * 2, 0.01);

	}

	update() {

		if (this.value !== this.target) {

			//let side = this.target > this.value ? 1 : -1

			this.value = MathTool.lerp(this.value, this.target, this.speed);

			//this.value += 0.1 * side

			let t = MathTool.nearEquals(this.value, this.target, 0.0001);

			if (!t) {
				this.pos[this.axe] = this.value;
				root.motor.change({ name: this.b.name, pos: this.pos });
			} else {
				this.value = this.target;
			}


		}

	}

	dispose() {

		if (this.txt) this.txt.dispose();
	}

}

class Container {

	constructor(o = {}) {

		this.isCompound = true;
		this.remplace = o.remplace || false;
		this.init(o);

	}

	init(o = {}) {


		let s = o.size || [5, 3, 8];
		let p = o.pos || [0, 2, 0];
		let w = o.wall || 0.1;
		let mw = w * 0.5;
		let xw = w * 2;

		if (!o.face) o.face = {};
		let f = { up: 1, down: 1, left: 1, right: 1, front: 1, back: 1, ...o.face };
		delete o.face;

		//let geometry = new ChamferBox( s[ 0 ], s[ 1 ], s[ 2 ], o.radius || mw );
		//let mesh = new Mesh( geometry );

		const data = [];

		if (f.up === 1) data.push({ pos: [0, s[1] * 0.5 - mw, 0], size: [s[0], w, s[2]] });
		if (f.down === 1) data.push({ pos: [0, mw - s[1] * 0.5, 0], size: [s[0], w, s[2]] });

		if (f.left === 1) data.push({ pos: [mw - s[0] * 0.5, 0, 0], size: [w, s[1] - xw, s[2]] });
		if (f.right === 1) data.push({ pos: [s[0] * 0.5 - mw, 0, 0], size: [w, s[1] - xw, s[2]] });

		if (f.back === 1) data.push({ pos: [0, 0, mw - s[2] * 0.5], size: [s[0] - xw, s[1] - xw, w] });
		if (f.front === 1) data.push({ pos: [0, 0, s[2] * 0.5 - mw], size: [s[0] - xw, s[1] - xw, w] });

		const faces = [];
		let i = data.length, n = 0, pp, d;

		while (i--) {

			d = data[n];
			pp = this.isCompound ? d.pos : MathTool.addArray(p, d.pos);
			faces.push({ type: 'box', size: d.size, pos: pp, material: o.material });
			n++;

		}



		if (this.isCompound) {
			let mesh = null;
			if (this.remplace) {
				mesh = new Mesh(new ChamferBox(s[0], s[1], s[2], o.radius || mw));
			}
			root.motor.add({
				...o,
				mesh: mesh,
				shapes: faces,
				type: 'compound',
			});
		} else {
			root.motor.add(faces);
		}

	}

}

//----------------
//  MOUSE TOOL 
//----------------

class MouseTool {

	constructor(controler, mode = 'drag') {

		this.needRay = true;

		//this.tmpSelected = null

		//root.viewSize = { w:window.innerWidth, h:window.innerHeight, r:0}
		//root.viewSize.r = root.viewSize.w/root.viewSize.h

		this.moveDirect = false;
		this.moveDeep = false;

		this.mode = mode;
		this.option = {};

		this.controler = controler;
		this.dom = this.controler.domElement;

		//this.dom.style.cursor =  "url('./assets/icons/logo.png'), move";

		this.selected = null;
		this.buttonRef = null;
		this.release = false;

		this.numBullet = 0;
		this.maxBullet = 10;

		this.sticky = false;

		this.pz = 0;

		this.isActive = false;
		this.raycastTest = false;
		this.firstSelect = false;
		this.mouseDown = false;
		this.mouseDown2 = false;
		this.mouseMove = false;
		//this.controlFirst = true;

		this.decal = new Vector3();
		this.tmpPos = new Vector3();
		this.tmpD = new Vector3();

		this.mouse = new Vector2();
		this.oldMouse = new Vector2();
		this.raycast = new Raycaster();
		this.raycast.far = 1000;

		this.button = 0;

		this.pos = new Vector3();
		this.velocity = new Vector3();
		this.angle = 0;

		this.helper = null;

		this.dragPlane = null;

		//if( this.mode === 'drag' ) 
		this.activeDragMouse(true);

	}

	addDrag() {

		if (this.dragPlane) return

		this.helper = new MoveHelper();
		this.dragPlane = new Mesh(new PlaneGeometry(1, 1), Mat.get('hide'));
		this.dragPlane.castShadow = false;
		this.dragPlane.receiveShadow = false;
		this.dragPlane.scale.set(1, 1, 1).multiplyScalar(200);

		root.scenePlus.add(this.helper);
		root.scenePlus.add(this.dragPlane);

	}

	clearDrag() {

		if (!this.dragPlane) return

		root.scenePlus.remove(this.dragPlane);
		root.scenePlus.remove(this.helper);

		this.dragPlane.geometry.dispose();
		this.helper.geometry.dispose();

		this.dragPlane = null;
		this.helper = null;

	}

	setMode(mode, o = {}) {

		if (mode === this.mode) return
		this.mode = mode;
		this.option = o;

		if (this.mode === 'blast' && this.option.visible) root.motor.initParticle();

	}

	activeDragMouse(b) {

		if (b) {
			if (!this.isActive) {
				this.dom.addEventListener('pointermove', this.mousemove.bind(this), false);
				this.dom.addEventListener('pointerdown', this.mousedown.bind(this), false);
				document.addEventListener('pointerup', this.mouseup.bind(this), false);
				document.addEventListener('contextmenu', this.contextmenu.bind(this), false);

				this.controler.addEventListener('end', this.controleEnd.bind(this), false);
				this.controler.addEventListener('change', this.controleChange.bind(this), false);

				this.isActive = true;
				this.raycastTest = true;
			}

		} else {
			if (this.isActive) {
				this.dom.removeEventListener('pointermove', this.mousemove.bind(this));
				this.dom.removeEventListener('pointerdown', this.mousedown.bind(this));
				document.removeEventListener('pointerup', this.mouseup.bind(this));

				this.controler.removeEventListener('end', this.controleEnd.bind(this));
				this.controler.removeEventListener('change', this.controleChange.bind(this));

				this.isActive = false;
			}
		}
	}

	controleEnd(e) {
		//this.controlFirst = true
		this.raycastTest = true;
		if (this.controler.getInfo) this.controler.getInfo();
	}

	controleChange(e) {

		//console.log('change')

		let state = this.controler.getState();

		if (state !== -1) this.raycastTest = false;

		/*let state = this.controler.getState();
		console.log(state)
		if( state !== -1 ){
			if( this.controlFirst ) this.controlFirst = false;
			else this.raycastTest = false;
		}*/

		//this.controler.getInfo();
	}

	getMouse(e) {

		if (root.viewSize) {
			this.mouse.x = (e.offsetX / root.viewSize.w) * 2 - 1;
			this.mouse.y = - (e.offsetY / root.viewSize.h) * 2 + 1;
		} else {
			this.mouse.x = (e.offsetX / this.dom.clientWidth) * 2 - 1;
			this.mouse.y = - (e.offsetY / this.dom.clientHeight) * 2 + 1;
		}

		//console.log(e.button)

		this.button = e.pointerType !== 'touch' ? e.button : 0;
		//if(this.button===2)this.moveDeep = !this.moveDeep

	}

	contextmenu(e) {
		e.preventDefault();
		//this.mouseDown2 = true
		//this.controler.enabled = false;
		/*if( this.mouseDown ){

			//this.moveDeep = true
			console.log('yo ')
		}*/
	}

	mousedown(e) {

		if (this.sticky) {
			this.unSelect();
			console.log('unstick');
		}

		this.getMouse(e);

		switch (this.mode) {

			case 'drag': this.drag(); break;
			case 'shoot': this.shoot(); break;
			case 'blast': this.blast(); break;

		}

	}

	mouseup(e) {

		//console.log('up')

		this.release = true;

		document.body.style.cursor = 'auto';

		this.mouseMove = this.oldMouse.distanceTo(this.mouse) < 0.01 ? false : true;
		this.mouseDown = false;
		this.mouseDown2 = false;
		root.mouseDown = false;



		if (this.sticky) { this.controler.enabled = true; return; }

		this.unSelect();
		this.resetButton();

	}

	mousemove(e) {

		//if( this.release ) this.release = false;

		switch (this.mode) {

			case 'drag':
				this.getMouse(e);
				this.needRay = true;
				//this.castray()
				break

		}

	}

	castray() {

		let inters, m, g, h, id, cursor = 'auto';

		if (this.selected !== null) {

			this.raycast.setFromCamera(this.mouse, this.controler.object);
			inters = this.raycast.intersectObject(this.dragPlane);
			if (inters.length && this.mouseDown) {
				this.moveSelect(inters[0].point);
				//if( this.moveDirect ) root.motor.change({ name:this.selected.name, pos:inters[0].point.toArray() }, true )
				//else root.motor.change({ name:'mouse', pos:inters[0].point.toArray() }, true )
			}
			//return
		} else {

			if (!this.raycastTest) return;

			//this.controler.enabled = false

			this.controler.enableRotate = false;
			this.controler.enablePan = false;

			this.raycast.setFromCamera(this.mouse, this.controler.object);

			inters = this.raycast.intersectObjects(root.scene.children, true);

			this.tmpSelected = null;

			if (inters.length > 0) {

				g = inters[0].object;
				id = inters[0].instanceId;

				//console.log(inters[ 0 ])

				if (id !== undefined) {
					m = root.motor.byName(g.name + id);
				} else {
					if (g.parent !== root.scene) {
						h = g.parent;
						if (h.parent !== root.scene) m = h.parent;
						else m = h;
					} else m = g;
				}

				if (this.mouseDown2) {
					if (m.extra) m.extra(m.name);
					//console.log(m)
				}

				if (!m.isButton) {
					cursor = this.select(m, inters[0].point);
					//this.tmpSelected = m
					//this.tmpPoint = inters[ 0 ].point
				}
				else cursor = this.actionButton(m, inters[0]);
				//document.body.style.cursor = cursor

			} else {
				this.controler.enableRotate = true;
				this.controler.enablePan = true;

				//this.controler.enabled = true
			}

			//console.log(this.release, cursor)
			if (this.release) {
				this.release = false;
				this.controler.enableRotate = true;
				this.controler.enablePan = true;
				cursor = 'auto';
			}

			document.body.style.cursor = cursor;
		}

	}

	drag() {

		if (!this.mouseDown) {
			if (this.firstSelect) this.firstSelect = false;
			this.oldMouse.copy(this.mouse);
		}

		if (this.button === 2) {
			this.mouseDown2 = true;
			//this.castray()
		}

		//if( this.button === 0 ){
		this.mouseDown = true;
		root.mouseDown = true;
		this.needRay = true;

		//if(this.tmpSelected!== null) this.select(this.tmpSelected, this.tmpPoint )
		//this.castray()
		//}



	}

	blast() {

		let hit = null;
		this.raycast.setFromCamera(this.mouse, this.controler.object);
		let inters = this.raycast.intersectObjects(root.scene.children, true);

		if (inters.length > 0) {

			if (!inters[0].object.isButton) hit = inters[0];
			else inters[0].object.parent.userData.direct();

		} else {
			inters = this.raycast.intersectObjects(root.scenePlus.children, true);
			if (inters.length > 0) hit = inters[0];
		}

		const o = this.option;

		if (hit) {

			root.motor.explosion(hit.point, o.radius || 3, o.power || 0.1);

			if (o.visible) root.motor.addParticle({
				name: 'blast',
				type: "cube",
				position: hit.point.toArray(),
				numParticles: 60,
				radius: 0.2,
				radiusRange: 0.1,
				//accelerationRange:[0.3,0.3,0.3],
				acceleration: [5 * 10, 5, 5 * 10],
				lifeTime: 0.5,
				endTime: 0.5,
				startTime: 0,
				gravity: [0, 0.2, 0],
				startSize: 0.5,
				endSize: 0.1,
				//spinSpeedRange:2,
				tween: "outQuad",
				//velocityRange: [ 0.6, 0.6, 0.6 ]
				//lifeTimeRange:1,
				//startTime: 0,
				//startSize: 0.1,

			});
		}


	}

	shoot() {

		this.raycast.setFromCamera(this.mouse, this.controler.object);
		this.pos.copy(this.raycast.ray.direction).add(this.raycast.ray.origin);
		this.velocity.copy(this.raycast.ray.direction).multiplyScalar(60);

		root.motor.add({
			name: 'bullet_' + this.numBullet,
			type: 'sphere',
			density: 20,
			size: [0.2],
			material: 'chrome',
			pos: this.pos.toArray(),
			linearVelocity: this.velocity.toArray(),
			bullet: true,
			/*ccdThreshold:0.0000001,
			ccdRadius:0.1,*/
		});

		this.numBullet++;
		if (this.numBullet > this.maxBullet) this.numBullet = 0;

	}

	resetButton() {

		if (this.buttonRef) {
			if (this.buttonRef.userData.out) this.buttonRef.userData.out();
			this.buttonRef = null;
		}

		this.raycastTest = true;
		this.selected = null;
		this.firstSelect = true;
		//this.controler.enabled = true
		this.controler.enableRotate = true;
		this.controler.enablePan = true;

	}

	actionButton(obj, inters) {

		if (this.buttonRef) {
			if (this.buttonRef.name !== obj.name) {
				if (this.buttonRef.userData.out) this.buttonRef.userData.out();
				this.buttonRef = obj;
			}
		} else {
			if (this.mouseDown) this.buttonRef = obj;
		}
		if (this.mouseDown && this.buttonRef.userData.action) {
			let pos = inters.point;
			this.buttonRef.userData.action(pos);
		}

		//if( this.mouseDown ) this.controler.enabled = false

		//return 'grab'
		return 'pointer'

	}



	select(obj, point) {

		//this.controler.enabled = false

		//if( this.selected !== null ) return 'pointer'
		//if( !this.mouseDown ) return 'auto'
		//if( this.selected === obj ) return 'grab'//'pointer'

		if (!this.mouseDown || this.selected === obj) return 'grab'//'pointer'


		this.pz = 0;

		let pos = point;
		let quat = [0, 0, 0, 1];

		this.selected = obj;
		/*if( this.selected.isInstance ) quat = this.selected.instance.getInfo( this.selected.id ).quat;
		else if( this.selected.isObject3D ){
			this.selected.updateMatrix()
			quat = this.selected.quaternion.toArray()
		}*/

		this.decal.copy(pos).sub(this.selected.position);
		this.tmpPos.copy(pos).sub(this.decal);
		this.angle = this.controler.getAzimuthalAngle();




		let q = this.selected.quaternion;
		quat = [q._x, q._y, q._z, q._w];


		/*if( this.selected.isInstance ){
			console.log(this.selected)
			return
		}*/

		/*if( this.selected.isButton ){
			if( this.buttonRef ){
				if(this.buttonRef.name !== this.selected.name ) this.buttonRef = obj
			} else {
				this.buttonRef = obj
			}
			if( this.buttonRef.userData.action ) this.buttonRef.userData.action()
				this.unSelect ()
			return 'grab'
		}*/

		this.addDrag();

		//8root.scenePlus.add( this.helper )
		//root.scenePlus.add( this.dragPlane )

		this.dragPlane.rotation.set(0, this.angle, 0);
		this.dragPlane.position.copy(pos);
		this.dragPlane.position.y = 0;

		this.helper.position.copy(pos);


		let p = pos.toArray();

		let revert = false;

		root.motor.change({ name: this.selected.name, neverSleep: true, wake: true });
		//Motor.add({ name:'mouse', type:'sphere', size:[0.01], pos:p, quat:quat, mask:0, density:0, noGravity:true, kinematic:true, flags:'noCollision' })
		//root.motor.add({ name:'mouse', type:'null', pos:p, quat:quat })

		//let def = [-0.03, 0.03, 60, 5]
		//let defr = [-3, 3, 60, 5]

		//let def = [-0.03, 0.03, 60, 2]
		//let defr = [-3, 3, 60, 2]

		if (this.moveDirect) {
			root.motor.change({ name: this.selected.name, kinematic: false, gravity: false, damping: [0.9, 0.9] });
		} else {
			let def = [-0.1, 0.1, 60, 1];
			let defr = [-0.1, 0.1, 60, 1];
			//let defr = [0, 0]
			let notUseKinematic = root.engine === 'OIMO' || root.engine === 'RAPIER'; //|| root.engine ==='HAVOK'
			let jtype = this.selected.link === 0 ? 'fixe' : 'd6';//root.engine === 'HAVOK' ? 'fixe' : 'd6';

			let limite = [['x', ...def], ['y', ...def], ['z', ...def], ['rx', ...defr], ['ry', ...defr], ['rz', ...defr]];

			if (root.engine === 'HAVOK') limite = [['x', ...def], ['y', ...def], ['z', ...def]];

			if (root.engine === 'OIMO') {
				revert = true;
				jtype = this.selected.link === 0 ? 'fixe' : 'spherical';
				limite = [['x', ...def], ['y', ...def], ['z', ...def]];
				//if(this.selected.link !== 0)
				//limite = [ 4.0, 1.0 ]
			}

			if (root.engine === 'HAVOK') {
				revert = true;
				jtype = this.selected.link === 0 ? 'fixe' : 'spherical';
				limite = [-180, 180, 0.1, 0.1];
			}

			root.motor.add([
				{
					name: 'mouse',
					type: 'null',
					pos: p,
					quat: quat,
					kinematic: notUseKinematic ? false : true,
					//mass:10000000,
					//gravityFactor:0, 
				},
				{
					name: 'mouseJoint', type: 'joint',
					mode: jtype,
					lm: limite,
					sd: [4.0, 1.0],
					autoDrive: true,
					b1: revert ? this.selected.name : 'mouse',
					b2: revert ? 'mouse' : this.selected.name,
					worldAnchor: p,
					//worldQuat: quat,

					/*pos1: p, 
					quat1: quat,
					pos2: [0,0,0], 
					quat2: [0,0,0,1],*/
					//worldAxis:[1,0,0],
					visible: false,
				}
			]);

		}


		//this.raycastTest = false
		//this.controler.enabled = false

		//document.body.style.cursor = 'move'

		return "grabbing"//"url('./assets/icons/point.png') 8 8, move" //'move'

	}

	moveSelect(point) {

		if (this.selected === null) return

		if (point) {
			this.tmpPos.copy(point).sub(this.decal);
		}

		if (this.moveDeep) { // Z deep move

			let y = this.selected.position.y;
			let diff = y - this.tmpPos.y;
			this.tmpPos.y = y;
			this.tmpD.set(0, 0, diff).applyAxisAngle({ x: 0, y: 1, z: 0 }, this.angle);
			this.tmpPos.add(this.tmpD);

		}

		this.helper.position.copy(this.tmpPos);

		let pos = this.tmpPos.toArray();

		if (this.moveDirect) {
			root.motor.change({ name: this.selected.name, pos: pos, reset: true });
		} else {
			root.motor.change({ name: 'mouse', pos: point.toArray(), lockPos: true }, true);
		}
	}

	unSelect() {

		if (this.selected === null) return



		this.clearDrag();

		if (this.moveDirect) {
			root.motor.change({ name: this.selected.name, kinematic: false, wake: true, gravity: true, damping: [0, 0.1] });
		} else {
			root.motor.remove(['mouseJoint', 'mouse']);
			root.motor.change({ name: this.selected.name, neverSleep: false, wake: true });
		}

		this.raycastTest = true;
		this.selected = null;
		this.firstSelect = true;

		//this.controler.enabled = true

	}

	step() {

		if (this.needRay) this.castray();
		this.needRay = false;

		if (this.selected === null) return

		let key = root.flow.key;


		if (key[1] !== 0) {
			let pz = key[1] * 0.1;
			this.dragPlane.translateZ(pz);
			this.needRay = true;
		}



		//this.castray()
		if (this.moveDirect) this.moveSelect();



	}


}






class MoveHelper extends Line {

	constructor(o = {}) {

		super(new BufferGeometry(), Mat.get('line'));

		let c = 0.75;

		const positions = [0, 0, 0, 0, -100, 0];
		const colors = [c, c, c, 0, 0, 0];

		//this.geometry = new BufferGeometry();
		this.geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
		this.geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
		//this.geometry.computeBoundingSphere();

		this.vertices = this.geometry.attributes.position;
		this.colors = this.geometry.attributes.color;
		this.local = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		//this.matrixAutoUpdate = false;
		this.frustumCulled = false;

	}
}

/**
 * @fileoverview This class can be used to subdivide a convex Geometry object into pieces.
 *
 * Usage:
 *
 * Use the function prepareBreakableObject to prepare a Mesh object to be broken.
 *
 * Then, call the various functions to subdivide the object (subdivideByImpact, cutByPlane)
 *
 * Sub-objects that are product of subdivision don't need prepareBreakableObject to be called on them.
 *
 * Requisites for the object:
 *
 *  - Mesh object must have a buffer geometry and a material
 *
 *  - Vertex normals must be planar (not smoothed)
 *
 *  - The geometry must be convex (this is not checked in the library). You can create convex
 *  geometries with ConvexGeometry. The BoxGeometry, SphereGeometry and other convex primitives
 *  can also be used.
 *
 * Note: This lib adds member variables to object's userData member (see prepareBreakableObject function)
 * Use with caution and read the code when using with other libs.
 *
 * @param {double} minSizeForBreak Min size a debris can have to break.
 * @param {double} smallDelta Max distance to consider that a point belongs to a plane.
 *
*/

const _v1 = new Vector3();

class ConvexObjectBreaker {

	constructor(minSizeForBreak = 1.4, smallDelta = 0.0001) {

		this.minSizeForBreak = minSizeForBreak;
		this.smallDelta = smallDelta;

		this.tempLine1 = new Line3();
		this.tempPlane1 = new Plane();
		this.tempPlane2 = new Plane();
		this.tempPlane_Cut = new Plane();
		this.tempCM1 = new Vector3();
		this.tempCM2 = new Vector3();
		this.tempVector3 = new Vector3();
		this.tempVector3_2 = new Vector3();
		this.tempVector3_3 = new Vector3();
		this.tempVector3_P0 = new Vector3();
		this.tempVector3_P1 = new Vector3();
		this.tempVector3_P2 = new Vector3();
		this.tempVector3_N0 = new Vector3();
		this.tempVector3_N1 = new Vector3();
		this.tempVector3_AB = new Vector3();
		this.tempVector3_CB = new Vector3();
		this.tempResultObjects = { object1: null, object2: null };

		this.box1 = new Box3();
		this.box2 = new Box3();

		this.sph1 = new Sphere();
		this.sph2 = new Sphere();

		this.tt = new Vector3();
		this.s1 = new Vector3();
		this.s2 = new Vector3();


		this.segments = [];
		const n = 30 * 30;
		for (let i = 0; i < n; i++) this.segments[i] = false;

	}

	prepareBreakableObject(object, mass, velocity, angularVelocity, breakable) {

		// object is a Object3d (normally a Mesh), must have a buffer geometry, and it must be convex.
		// Its material property is propagated to its children (sub-pieces)
		// mass must be > 0

		const userData = object.userData;
		userData.mass = mass;
		userData.velocity = velocity.clone();
		userData.angularVelocity = angularVelocity.clone();
		userData.breakable = breakable;

	}

	/*
	 * @param {int} maxRadialIterations Iterations for radial cuts.
	 * @param {int} maxRandomIterations Max random iterations for not-radial cuts
	 *
	 * Returns the array of pieces
	 */
	subdivideByImpact(object, pointOfImpact, normal, maxRadialIterations, maxRandomIterations) {

		const debris = [];

		const tempPlane1 = this.tempPlane1;
		const tempPlane2 = this.tempPlane2;

		this.tempVector3.addVectors(pointOfImpact, normal);
		tempPlane1.setFromCoplanarPoints(pointOfImpact, object.position, this.tempVector3);

		const maxTotalIterations = maxRandomIterations + maxRadialIterations;

		const scope = this;

		function subdivideRadial(subObject, startAngle, endAngle, numIterations) {

			if (Math.random() < numIterations * 0.05 || numIterations > maxTotalIterations) {

				debris.push(subObject);

				return;

			}

			let angle = Math.PI;

			if (numIterations === 0) {

				tempPlane2.normal.copy(tempPlane1.normal);
				tempPlane2.constant = tempPlane1.constant;

			} else {

				if (numIterations <= maxRadialIterations) {

					angle = (endAngle - startAngle) * (0.2 + 0.6 * Math.random()) + startAngle;

					// Rotate tempPlane2 at impact point around normal axis and the angle
					scope.tempVector3_2.copy(object.position).sub(pointOfImpact).applyAxisAngle(normal, angle).add(pointOfImpact);
					tempPlane2.setFromCoplanarPoints(pointOfImpact, scope.tempVector3, scope.tempVector3_2);

				} else {

					angle = ((0.5 * (numIterations & 1)) + 0.2 * (2 - Math.random())) * Math.PI;

					// Rotate tempPlane2 at object position around normal axis and the angle
					scope.tempVector3_2.copy(pointOfImpact).sub(subObject.position).applyAxisAngle(normal, angle).add(subObject.position);
					scope.tempVector3_3.copy(normal).add(subObject.position);
					tempPlane2.setFromCoplanarPoints(subObject.position, scope.tempVector3_3, scope.tempVector3_2);

				}

			}

			// Perform the cut
			scope.cutByPlane(subObject, tempPlane2, scope.tempResultObjects);

			const obj1 = scope.tempResultObjects.object1;
			const obj2 = scope.tempResultObjects.object2;

			if (obj1) {

				subdivideRadial(obj1, startAngle, angle, numIterations + 1);

			}

			if (obj2) {

				subdivideRadial(obj2, angle, endAngle, numIterations + 1);

			}

		}

		subdivideRadial(object, 0, 2 * Math.PI, 0);

		return debris;

	}

	cutByPlane(object, plane, output) {

		let k;

		// Returns breakable objects in output.object1 and output.object2 members, the resulting 2 pieces of the cut.
		// object2 can be null if the plane doesn't cut the object.
		// object1 can be null only in case of internal error
		// Returned value is number of pieces, 0 for error.

		const geometry = object.geometry;
		const coords = geometry.attributes.position.array;
		const normals = geometry.attributes.normal.array;

		const numPoints = coords.length / 3;
		let numFaces = numPoints / 3;

		let indices = geometry.getIndex();

		if (indices) {

			indices = indices.array;
			numFaces = indices.length / 3;

		}

		function getVertexIndex(faceIdx, vert) {

			// vert = 0, 1 or 2.

			const idx = faceIdx * 3 + vert;

			return indices ? indices[idx] : idx;

		}

		const points1 = [];
		const points2 = [];

		const delta = this.smallDelta;

		// Reset segments mark
		const numPointPairs = numPoints * numPoints;
		for (let i = 0; i < numPointPairs; i++) this.segments[i] = false;

		const p0 = this.tempVector3_P0;
		const p1 = this.tempVector3_P1;
		const n0 = this.tempVector3_N0;
		const n1 = this.tempVector3_N1;

		// Iterate through the faces to mark edges shared by coplanar faces
		for (let i = 0; i < numFaces - 1; i++) {

			const a1 = getVertexIndex(i, 0);
			const b1 = getVertexIndex(i, 1);
			const c1 = getVertexIndex(i, 2);

			// Assuming all 3 vertices have the same normal
			n0.set(normals[a1], normals[a1] + 1, normals[a1] + 2);

			for (let j = i + 1; j < numFaces; j++) {

				const a2 = getVertexIndex(j, 0);
				const b2 = getVertexIndex(j, 1);
				const c2 = getVertexIndex(j, 2);

				// Assuming all 3 vertices have the same normal
				n1.set(normals[a2], normals[a2] + 1, normals[a2] + 2);

				const coplanar = 1 - n0.dot(n1) < delta;

				if (coplanar) {

					if (a1 === a2 || a1 === b2 || a1 === c2) {

						if (b1 === a2 || b1 === b2 || b1 === c2) {

							this.segments[a1 * numPoints + b1] = true;
							this.segments[b1 * numPoints + a1] = true;

						} else {

							this.segments[c1 * numPoints + a1] = true;
							this.segments[a1 * numPoints + c1] = true;

						}

					} else if (b1 === a2 || b1 === b2 || b1 === c2) {

						this.segments[c1 * numPoints + b1] = true;
						this.segments[b1 * numPoints + c1] = true;

					}

				}

			}

		}

		// Transform the plane to object local space
		const localPlane = this.tempPlane_Cut;
		object.updateMatrix();
		ConvexObjectBreaker.transformPlaneToLocalSpace(plane, object.matrix, localPlane);

		// Iterate through the faces adding points to both pieces
		for (let i = 0; i < numFaces; i++) {

			const va = getVertexIndex(i, 0);
			const vb = getVertexIndex(i, 1);
			const vc = getVertexIndex(i, 2);

			for (let segment = 0; segment < 3; segment++) {

				const i0 = segment === 0 ? va : (segment === 1 ? vb : vc);
				const i1 = segment === 0 ? vb : (segment === 1 ? vc : va);

				const segmentState = this.segments[i0 * numPoints + i1];

				if (segmentState) continue; // The segment already has been processed in another face

				// Mark segment as processed (also inverted segment)
				this.segments[i0 * numPoints + i1] = true;
				this.segments[i1 * numPoints + i0] = true;

				p0.set(coords[3 * i0], coords[3 * i0 + 1], coords[3 * i0 + 2]);
				p1.set(coords[3 * i1], coords[3 * i1 + 1], coords[3 * i1 + 2]);

				// mark: 1 for negative side, 2 for positive side, 3 for coplanar point
				let mark0 = 0;

				let d = localPlane.distanceToPoint(p0);

				if (d > delta) {

					mark0 = 2;
					points2.push(p0.clone());

				} else if (d < - delta) {

					mark0 = 1;
					points1.push(p0.clone());

				} else {

					mark0 = 3;
					points1.push(p0.clone());
					points2.push(p0.clone());

				}

				// mark: 1 for negative side, 2 for positive side, 3 for coplanar point
				let mark1 = 0;

				d = localPlane.distanceToPoint(p1);

				if (d > delta) {

					mark1 = 2;
					points2.push(p1.clone());

				} else if (d < - delta) {

					mark1 = 1;
					points1.push(p1.clone());

				} else {

					mark1 = 3;
					points1.push(p1.clone());
					points2.push(p1.clone());

				}

				if ((mark0 === 1 && mark1 === 2) || (mark0 === 2 && mark1 === 1)) {

					// Intersection of segment with the plane

					this.tempLine1.start.copy(p0);
					this.tempLine1.end.copy(p1);

					let intersection = new Vector3();
					intersection = localPlane.intersectLine(this.tempLine1, intersection);

					if (intersection === null) {

						// Shouldn't happen
						console.error('Internal error: segment does not intersect plane.');
						output.segmentedObject1 = null;
						output.segmentedObject2 = null;
						return 0;

					}

					points1.push(intersection);
					points2.push(intersection.clone());

				}

			}

		}

		// Calculate debris mass (very fast and imprecise):
		object.userData.mass * 0.5;

		let box1 = this.box1;
		let box2 = this.box2;
		let numPoints1 = points1.length;
		let numPoints2 = points2.length;

		// reset box3
		box1.makeEmpty();
		box2.makeEmpty();

		// expand box3
		k = numPoints1;
		while (k--) box1.expandByPoint(points1[k]);

		k = numPoints2;
		while (k--) box2.expandByPoint(points2[k]);

		box1.getBoundingSphere(this.sph1);
		box2.getBoundingSphere(this.sph2);

		// Calculate debris Center of Mass Fastest
		this.tempCM1.copy(this.sph1.center);
		this.tempCM2.copy(this.sph2.center);
		k = numPoints1;
		while (k--) points1[k].sub(this.tempCM1);
		k = numPoints2;
		while (k--) points2[k].sub(this.tempCM2);

		this.tempCM1.add(object.position);
		this.tempCM2.add(object.position);

		box1.getSize(this.s1);
		box2.getSize(this.s2);

		// avoid too low radius
		if (2 * this.sph1.radius < this.minSizeForBreak) numPoints1 = 0;
		if (2 * this.sph2.radius < this.minSizeForBreak) numPoints2 = 0;

		// avoid too low size
		if (this.testSize(this.s1)) numPoints1 = 0;
		if (this.testSize(this.s2)) numPoints2 = 0;

		//this.tempCM1.add( object.position );
		//this.tempCM2.add( object.position )

		//let sizer1 = this.tt.copy(box1.max).add(box1.min).manhattanLength()
		//let sizer2 = this.tt.copy(box2.max).add(box2.min).manhattanLength()

		//if(sizer1<s) numPoints1 = 0
		//if(sizer2<s) numPoints2 = 0
		//box1 = {x:Math.abs(box1.x), y:Math.abs(box1.y), z:Math.abs(box1.z)}
		//box2 = {x:Math.abs(box2.x), y:Math.abs(box2.y), z:Math.abs(box2.z)}

		//console.log(radius1, radius2)
		//console.log(box1.manhattanLength(), box2.manhattanLength())

		//console.log(box1, box2)



		//console.log(sizer1, sizer2)


		//if( box1.x<s || box1.y<s || box1.z<s ) numPoints1 = 0
		//if( box2.x<s || box2.y<s || box2.z<s ) numPoints2 = 0

		//if( box1.x+box1.y+box1.z<s ) numPoints1 = 0
		//if( box2.x+box2.y+box2.z<s ) numPoints1 = 0
		//if( box1.manhattanLength()<s ) numPoints1 = 0
		//if( box2.manhattanLength()<s ) numPoints2 = 0

		//if( box1.length()<s ) numPoints1 = 0
		//if( box2.length()<s ) numPoints2 = 0




		let object1 = null;
		let object2 = null;

		let numObjects = 0;

		if (numPoints1 > 4) {

			object1 = new Mesh(new ConvexGeometry(points1), object.material);
			object1.position.copy(this.tempCM1);
			object1.quaternion.copy(object.quaternion);

			//this.prepareBreakableObject( object1, newMass, object.userData.velocity, object.userData.angularVelocity, 2 * radius1 > this.minSizeForBreak );

			numObjects++;

		}

		if (numPoints2 > 4) {


			object2 = new Mesh(new ConvexGeometry(points2), object.material);
			object2.position.copy(this.tempCM2);
			object2.quaternion.copy(object.quaternion);

			//this.prepareBreakableObject( object2, newMass, object.userData.velocity, object.userData.angularVelocity, 2 * radius2 > this.minSizeForBreak );

			numObjects++;

		}

		output.object1 = object1;
		output.object2 = object2;

		return numObjects;

	}

	testSize(s) {
		let n = 0;
		if (s.x < 0.01) n++;
		if (s.y < 0.01) n++;
		if (s.z < 0.01) n++;
		return n > 1
	}

	static transformFreeVector(v, m) {

		// input:
		// vector interpreted as a free vector
		// THREE.Matrix4 orthogonal matrix (matrix without scale)

		const x = v.x, y = v.y, z = v.z;
		const e = m.elements;

		v.x = e[0] * x + e[4] * y + e[8] * z;
		v.y = e[1] * x + e[5] * y + e[9] * z;
		v.z = e[2] * x + e[6] * y + e[10] * z;

		return v;

	}

	static transformFreeVectorInverse(v, m) {

		// input:
		// vector interpreted as a free vector
		// THREE.Matrix4 orthogonal matrix (matrix without scale)

		const x = v.x, y = v.y, z = v.z;
		const e = m.elements;

		v.x = e[0] * x + e[1] * y + e[2] * z;
		v.y = e[4] * x + e[5] * y + e[6] * z;
		v.z = e[8] * x + e[9] * y + e[10] * z;

		return v;

	}

	static transformTiedVectorInverse(v, m) {

		// input:
		// vector interpreted as a tied (ordinary) vector
		// THREE.Matrix4 orthogonal matrix (matrix without scale)

		const x = v.x, y = v.y, z = v.z;
		const e = m.elements;

		v.x = e[0] * x + e[1] * y + e[2] * z - e[12];
		v.y = e[4] * x + e[5] * y + e[6] * z - e[13];
		v.z = e[8] * x + e[9] * y + e[10] * z - e[14];

		return v;

	}

	static transformPlaneToLocalSpace(plane, m, resultPlane) {

		resultPlane.normal.copy(plane.normal);
		resultPlane.constant = plane.constant;

		const referencePoint = ConvexObjectBreaker.transformTiedVectorInverse(plane.coplanarPoint(_v1), m);

		ConvexObjectBreaker.transformFreeVectorInverse(resultPlane.normal, m);

		// recalculate constant (like in setFromNormalAndCoplanarPoint)
		resultPlane.constant = - referencePoint.dot(resultPlane.normal);

	}

}

class Breaker {

	constructor() {

		this.convexBreaker = new ConvexObjectBreaker();
		this.tmpI = new THREE.Vector3();

		this.tpos = new THREE.Vector3();
		this.tnormal = new THREE.Vector3();

		this.nDebris = 0;
		this.maxDebris = 300;

		this.tt = null;

	}

	step() {

		let p;

		for (let n in root.reflow.point) {

			p = root.reflow.point[n];

			//if ( !b1.breakable && !b2.breakable ) continue;



			if (p.distance !== 0) {

				this.makeBreak(p.b1, p.pos, p.normal, p.impulse, p.v1);
				this.makeBreak(p.b2, p.pos, p.normal, p.impulse, p.v2);

			}
		}
	}

	makeBreak(name, pos, normal, impulse, v) {

		let mesh = Utils.byName(name);

		if (!mesh) return;
		if (!mesh.breakable) return;



		let breakOption = mesh.breakOption;
		//let imp = this.tmpI.fromArray( impulse ).length();

		//console.log( name, impulse )

		// not enoputh impulse to break
		if (impulse < breakOption[0]) return;


		//let parentMatrix = mesh.matrix.clone().invert()

		let debris = this.convexBreaker.subdivideByImpact(mesh, this.tpos.fromArray(pos), this.tnormal.fromArray(normal), breakOption[1], breakOption[2]);

		//console.log( debris.length )

		if (debris.length < 1) return

		// remove one level
		breakOption[3] -= 1;

		const eritage = {
			material: mesh.material,
			linearVelocity: [v[0], v[1], v[2]],
			angularVelocity: [v[3], v[4], v[5]],
			density: mesh.density,
		};

		// add debris
		let list = [];
		let i = debris.length, n = 0;
		while (i--) {
			list.push(this.addDebris(debris[n], breakOption, eritage));
			n++;
		}

		// remove original object and add debrit
		//root.motor.remove( name, true )
		this.tt = setTimeout(() => {
			root.motor.remove(name);
			root.motor.add(list);
		}, 0);


	}

	addDebris(mesh, breakOption, eritage) {

		let breakable = breakOption[3] > 0 ? true : false;

		let name = 'debris_' + (this.nDebris++);

		let deb = {

			...eritage,

			name: name,
			type: 'convex',
			shape: mesh.geometry,
			//size:[1,1,1],
			pos: mesh.position.toArray(),
			quat: mesh.quaternion.toArray(),
			breakable: breakable,
			breakOption: breakOption,

		};

		//this.nDebris++
		if (this.nDebris > this.maxDebris) this.nDebris = 0;


		return deb

	}

}

//const SPHSystem_getNeighbors_dist = new Vector3()

// Temp vectors for calculation
new Vector3(); // Relative velocity

const SPHSystem_update_a_pressure = new Vector3();
const SPHSystem_update_a_visc = new Vector3();
const SPHSystem_update_gradW = new Vector3();
const SPHSystem_update_r_vec = new Vector3();
const SPHSystem_update_u = new Vector3();


class Particle {

	constructor(o = {}) {

		this.name = o.name || 'ppp';

		this.particles = [];
		this.density = 0.01;
		this.smoothingRadius = 0.2;
		this.speedOfSound = 0.1;
		this.viscosity = 0.03;
		this.eps = 0.000001;

		this.group = 1 << 8;

		// Stuff Computed per particle
		this.pressures = [];
		this.densities = [];
		this.neighbors = [];

		this.tv = new Vector3();
		this.tv2 = new Vector3();

	}

	add(pos) {

		let p = root.motor.add({

			instance: this.name,
			type: 'particle',
			//type:'sphere',
			flags: 'noQuery',
			size: [0.1],
			pSize: 0.03,
			pos: pos,

			inertia: [0, 0, 0],
			//iterations:[10,1],

			mass: 0.001,
			//density:0.0001,
			restitution: 0.0,
			friction: 0.5,
			//maxVelocity:[2,100],
			damping: [0.1, 0.1],

			//group:this.group, 
			//mask:1|2,
			material: 'hide',

		});

		p.force = new Vector3();

		this.particles.push(p);
		if (this.neighbors.length < this.particles.length) {
			this.neighbors.push([]);
		}

	}

	connect(link) {

		let i = link.length;
		console.log(i);
		let tmp = [], l, p1, p2, d = 0;

		while (i--) {

			l = link[i];
			this.name + l[0];
			this.name + l[1];

			p1 = this.particles[l[0]].position;
			p2 = this.particles[l[1]].position;

			//p1.y = 0
			//p2.y = 0

			//console.log(p1,p2)

			d = this.tv.copy(p1).distanceTo(p2);



			//this.tv.copy( p2 ).sub( p1 ).multiplyScalar(0.5)
			this.tv.copy(p2).sub(p1);//.multiplyScalar(0.5)



			tmp.push({
				type: 'distance',
				helperSize: 0.03,
				b1: this.name + l[0],
				b2: this.name + l[1],
				//limit:[d - 0.01, d + 0.01], 
				limit: [d * 0.5, d],
				spring: [20, 1.0],
				//spring:[0.0, 0.0],
				friction: 0,
				/*visible:true, helperSize:0.02*/
			});
			/*tmp.push({ 
				helperSize:0.01,
				type:'spherical', 
				b1:b1, b2:b2, 
				worldAxis: n===0 ? [1,0,0] : [0,0,1],
				//pos1: this.tv2.set(0,0,0).add(this.tv).toArray(),
				pos2: this.tv2.set(0,0,0).sub(this.tv).toArray(),
				limit:[-180, 180, 0.01, 10 ], //spring:[100, 0.01], 
			})
			n++
			if(n===2)n=0*/
		}

		root.motor.add(tmp);

	}

	getPosition() {

		let ar = [];
		let i = this.particles.length, p, n;
		while (i--) {

			n = i * 3;
			p = this.particles[i];
			ar[n] = p.position.x;
			ar[n + 1] = p.position.y;
			ar[n + 2] = p.position.z;
		}

		return ar

	}


	// Get neighbors within smoothing volume, save in the array neighbors
	getNeighbors(particle, neighbors) {

		const N = this.particles.length;
		const id = particle.id;
		const R2 = this.smoothingRadius * this.smoothingRadius;
		let distance = 0;//SPHSystem_getNeighbors_dist
		for (let i = 0; i !== N; i++) {
			const p = this.particles[i];
			//const dx = p.position.x - particle.position.x, dy = p.position.y - particle.position.y, dz = p.position.z - particle.position.z;
			distance = this.distance(p, particle);//dx * dx + dy * dy + dz * dz
			if (id !== p.id && distance < R2) {
				neighbors.push(p);
			}
		}
	}

	distance(p, v) {
		const dx = p.position.x - v.position.x, dy = p.position.y - v.position.y, dz = p.position.z - v.position.z;
		return dx * dx + dy * dy + dz * dz
	}

	// Calculate the weight using the W(r) weightfunction
	w(r) {
		// 315
		const h = this.smoothingRadius;
		return (315.0 / (64.0 * Math.PI * h ** 9)) * (h * h - r * r) ** 3
	}

	// calculate gradient of the weight function
	gradw(rVec, resultVec) {

		const r = rVec.length();
		const h = this.smoothingRadius;
		resultVec.copy(rVec).multiplyScalar((945.0 / (32.0 * Math.PI * h ** 9)) * (h * h - r * r) ** 2);
		//rVec.scale((945.0 / (32.0 * Math.PI * h ** 9)) * (h * h - r * r) ** 2, resultVec)
	}

	// Calculate nabla(W)
	nablaw(r) {
		const h = this.smoothingRadius;
		const nabla = (945.0 / (32.0 * Math.PI * h ** 9)) * (h * h - r * r) * (7 * r * r - 3 * h * h);
		return nabla
	}

	update() {

		const TMP = [];

		const N = this.particles.length;
		const cs = this.speedOfSound;
		const eps = this.eps;

		let i = N, j;

		//for (let i = 0; i !== N; i++) {
		while (i--) {

			const p = this.particles[i]; // Current particle
			p.force.set(0, 0, 0);
			const neighbors = this.neighbors[i];

			// Get neighbors
			neighbors.length = 0;
			this.getNeighbors(p, neighbors);
			neighbors.push(this.particles[i]); // Add current too
			const numNeighbors = neighbors.length;

			// Accumulate density for the particle
			let sum = 0.0;
			j = numNeighbors;
			while (j--) {
				//for (let j = 0; j !== numNeighbors; j++) {
				//printf("Current particle has position %f %f %f\n",objects[id].pos.x(),objects[id].pos.y(),objects[id].pos.z());
				const weight = this.w(this.distance(p, neighbors[j]));
				sum += neighbors[j].mass * weight;
			}

			// Save
			this.densities[i] = sum;
			this.pressures[i] = cs * cs * (this.densities[i] - this.density);

		}

		// Add forces

		// Sum to these accelerations
		const a_pressure = SPHSystem_update_a_pressure;
		const a_visc = SPHSystem_update_a_visc;
		const gradW = SPHSystem_update_gradW;
		const r_vec = SPHSystem_update_r_vec;
		const u = SPHSystem_update_u;

		i = N;

		//for (let i = 0; i !== N; i++) {
		while (i--) {

			const particle = this.particles[i];

			a_pressure.set(0, 0, 0);
			a_visc.set(0, 0, 0);

			// Init vars
			let Pij;
			let nabla;

			// Sum up for all other neighbors
			const neighbors = this.neighbors[i];
			const numNeighbors = neighbors.length;

			j = numNeighbors;
			while (j--) {
				//for (let j = 0; j !== numNeighbors; j++) {
				const neighbor = neighbors[j];

				// Get r once for all..
				r_vec.copy(particle.position).sub(neighbor.position);
				//particle.position.vsub(neighbor.position, r_vec)
				const r = r_vec.length();

				// Pressure contribution
				Pij =
					-neighbor.mass *
					(this.pressures[i] / (this.densities[i] * this.densities[i] + eps) +
						this.pressures[j] / (this.densities[j] * this.densities[j] + eps));

				this.gradw(r_vec, gradW);
				// Add to pressure acceleration
				gradW.multiplyScalar(Pij); //scale(Pij, gradW)
				a_pressure.add(gradW);//.vadd(gradW, a_pressure)


				// Viscosity contribution
				u.copy(neighbor.velocity).sub(particle.velocity);

				/*TMP.push({
					name:neighbor.name,
					velocity : u.toArray()
				})*/
				//neighbor.velocity.vsub(particle.velocity, u)
				u.multiplyScalar((1.0 / (0.0001 + this.densities[i] * this.densities[j])) * this.viscosity * neighbor.mass);
				nabla = this.nablaw(r);
				u.multiplyScalar(nabla);
				// Add to viscosity acceleration
				a_visc.add(u);


			}

			// Calculate force
			a_visc.multiplyScalar(particle.mass);
			a_pressure.multiplyScalar(particle.mass);

			// Add force to particles

			particle.force.add(a_visc);
			particle.force.add(a_pressure);

			TMP.push({
				name: particle.name,
				force: particle.force.toArray()
			});

		}

		root.motor.change(TMP);



	}

}

const _offsetMatrix = new Matrix4();
const _identityMatrix = new Matrix4();
new Vector3();

let K = Skeleton.prototype;

K.byName = function (name) {

	let i = this.bones.length;
	while (i--) if (this.bones[i].name === name) return this.bones[i]
	return null

};

K.getId = function (name) {

	let i = this.bones.length;
	while (i--) if (this.bones[i].name === name) return i
	return null

};

K.setExtraRotation = function (b, x, y, z) {

	//this.pose()

	/*let name = b.isBone ? b.name : b
	let degtorad = MathUtils.DEG2RAD

	let bone = this.byName( name )
	if( !bone ) return

	let id = this.getId( name )
	let tt = new Matrix4().makeRotationFromEuler( {x:x*degtorad, y:y*degtorad, z:z*degtorad, order:'XYZ'});

	//bone.matrixWorld.multiply( tt );
	bone.matrix.multiply( tt );
	bone.matrixWorld.multiplyMatrices( bone.parent.matrixWorld, bone.matrix );
	bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );
	//bone.updateMatrixWorld( true )

	//bone.updateWorldMatrix( true, true )

	let j = bone.children.length, child;
	while(j--){
		child = bone.children[ j ]
		child.matrixWorld.multiplyMatrices( bone.matrixWorld, child.matrix )
	}



	this.calculateInverses()*/
	//this.pose()


	let bone = b.isBone ? b : this.byName(b);
	if (!bone) return
	MathUtils.DEG2RAD;

	//bone.extraRotation = new Matrix4().makeRotationFromEuler( {x:x*degtorad, y:y*degtorad, z:z*degtorad, order:'XYZ'});
	//bone.extraRotation = new Quaternion().setFromEuler( {_x:x*degtorad, _y:y*degtorad, _z:z*degtorad, _order:'XYZ'}).invert();

	//this.applyScalling()

};

K.setScalling = function (b, x, y, z) {

	let bone = b.isBone ? b : this.byName(b);
	if (!bone) return
	bone.scalling = new Vector3(x, y, z);

};

K.resetScalling = function (b) {

	this.pose();

	this.scalled = true;

	for (let i = 0, il = this.bones.length; i < il; i++) {

		//this.bones[i].scalling = new Vector3(1,1,1);
		this.bones[i].isPhysics = false;
		this.bones[i].phyMtx = new Matrix4();

	}

	if (!b) this.applyScalling();

};

K.childScale = function (bone, matrix) {

	if (!this.scalled) return

	//

	if (bone.scalling) matrix.scale(bone.scalling);
	//if( bone.extraRotation ) matrix.multiply( bone.extraRotation );
	//if( !bone.isBone ) return

	//if(bone.name === 'head') console.log(bone.children.length)

	let j = bone.children.length, child;

	while (j--) {

		child = bone.children[j];

		if (child.isBone) {
			child.matrixWorld.multiplyMatrices(matrix, child.matrix);

		} else {
			child.matrixWorld.multiplyMatrices(matrix, child.matrix);
			//child.updateWorldMatrix(false,true)
			//child.updateWorldMatrix(false, true);
			//child.updateMatrixWorld(true);
			//child.updateMatrix()
			//child.updateWorldMatrix( false, true );

			// BUG WITH HAIR !!!
			//   child.matrixWorld.multiplyMatrices( matrix, child.matrix )
			// child.matrixWorld.multiplyMatrices( matrix, child.matrix )

			//child.updateWorldMatrix(false, true)
			//child.matrix = matrix.clone();
			//child.matrixWorld.premultiply( matrix.clone() )
			//child.matrixAutoUpdate = false;
		}


		//child.matrixAutoUpdate = true
		//if( child.matrixAutoUpdate ) child.matrixAutoUpdate = false
		//if( child.matrixWorldAutoUpdate ) child.matrixWorldAutoUpdate = false
		//child.matrixWorldNeedsUpdate = false;
		//child.matrixWorld.copy( child.matrix ).premultiply( matrix )

		//child.matrixWorld.copy( matrix ).multiply( child.matrix )



		//scaleMatrix = matrix.clone()
		//scaleMatrix.multiply( child.matrix )
		//child.matrixWorld.copy( scaleMatrix )

		// if( child.isBone ) 
		//child.matrix.premultiply(matrix)
		//child.matrixWorld.copy( child.matrix );

		///child.matrixWorldNeedsUpdate = true;
		//child.matrix.premultiply(matrix)
		//child.matrixWorld.setPosition( _decal.setFromMatrixPosition( scaleMatrix ) );
		//child.matrixWorld.setPosition( _decal.setFromMatrixPosition( scaleMatrix ) );
		//k++
	}

};

K.applyScalling = function (fingerPos) {

	let b, i, lng = this.bones.length;
	let parent;

	for (i = 0; i < lng; i++) {

		b = this.bones[i];
		parent = b.parent || null;

		if (parent !== null && parent.scalling && b.name !== 'root') {//

			//  if( parent.scalling ) 
			b.position.multiply(parent.scalling);
			//if(parent.extraRotation) b.quaternion.premultiply( parent.extraRotation );
			//b.updateWorldMatrix( false, true )
			b.updateMatrixWorld(true);

		}

	}

	this.calculateInverses();

};


K.update = function () {

	const bones = this.bones;
	const boneInverses = this.boneInverses;
	const boneMatrices = this.boneMatrices;
	const boneTexture = this.boneTexture;

	// flatten bone matrices to array

	let i = bones.length, bone, n = 0;

	while (i--) {

		bone = bones[n];

		// compute the offset between the current and the original transform

		//if( bone.isPhysics ) bone.matrixWorld.copy( bone.phyMtx )

		const matrix = bone ? (bone.isPhysics ? bone.phyMtx : bone.matrixWorld) : _identityMatrix;

		if (bone.isPhysics) this.scalled = true;

		this.childScale(bone, matrix);

		_offsetMatrix.multiplyMatrices(matrix, boneInverses[n]);
		_offsetMatrix.toArray(boneMatrices, n * 16);

		n++;

	}

	if (boneTexture !== null) {

		boneTexture.needsUpdate = true;

	}

};

let items;
let currentControle = null;
let callback = null;
let worker = null;
let isWorker = false;
let isBuffer = false;
let isTimeout = false;
let outsideStep = true;

let engineReady = false;


let breaker = null;

let timetest = {
	t1: 0,
	t2: 0,
	t3: 0,
	t4: 0,
};

let mouseTool = null;


let isPause = false;

let directMessage = null;
let controls = null;
let first = true;

let timout = null;
let timoutFunction = null;
let timoutTime = 0;
let elapsedTime = 0;

const user = new User();
const timer = new Timer(60);


//let particles = null

//const threeScene = null

let azimut = function () { return 0 };
let endReset = function () { };
let postUpdate = function () { };
let addControl = function () { };




let buttons = [];
let textfields = [];
let particles = [];
//let skeletons = []

const settings = {

	//full:false,
	//jointVisible:false,


	fps: 60,
	fixe: true,
	full: false,
	substep: 2,
	gravity: [0, -9.81, 0],


};


class Motor {

	static getSetting() { return settings; }

	static setGravity() {

		root.post({ m: 'setGravity', o: { gravity: settings.gravity } });

	}

	static set(o = {}) {


		settings.fixe = o.fixe !== undefined ? o.fixe : true;
		settings.full = o.full !== undefined ? o.full : false;
		settings.gravity = o.gravity ? o.gravity : [0, -9.81, 0];
		settings.substep = o.substep ? o.substep : 2;
		settings.fps = o.fps ? o.fps : 60;


		//console.log(settings)

		//if( o.full === undefined ) o.full = false

		if (o.key) addControl();

		items.body.setFull(settings.full);
		Motor.initArray(settings.full);

		elapsedTime = 0;

		isTimeout = isWorker;
		outsideStep = !isTimeout;

		root.jointVisible = o.jointVisible || false;

		if (outsideStep) timer.setFramerate(settings.fps);

		const data = {
			...settings,
			ArPos: root.ArPos,
			isTimeout: isTimeout,
			outsideStep: outsideStep,
		};

		root.post({ m: 'set', o: data });

	}

	static math = MathTool//math

	static activeMouse(controler, mode) {
		if (!mouseTool) mouseTool = new MouseTool(controler, mode);
	}

	static mouseMode(mode, o) {
		if (mouseTool) mouseTool.setMode(mode, o);
	}


	static getTimeTest() { return timetest }

	static setMaxFps(v) { }

	//static setExtraTexture ( f ) { extraTexture = f }

	static getMouse() { return mouseTool ? mouseTool.mouse : null }

	static setMaxAnisotropy(f) { Pool.maxAnisotropy = f; }

	static setAddControl(f) { addControl = f; }

	static setPostUpdate(f) { postUpdate = f !== null ? f : function () { }; }
	static setAzimut(f) { azimut = f; }

	static setKey(i, v) { return user.setKey(i, v) }
	static getKey() { return user.key }
	static getKey2() { return user.key2 }
	static getAzimut() { return azimut() }

	static setContent(Scene) {
		root.threeScene = Scene;
		Scene.add(root.scene);
		Scene.add(root.scenePlus);
	}

	static setControl(Controls) {

		controls = Controls;
		azimut = controls.getAzimuthalAngle;

	}

	static message(m) {

		let e = m.data;
		if (e.Ar) root.Ar = e.Ar;//new Float32Array( e.Ar )//;
		if (e.reflow) {
			root.reflow = e.reflow;
			if (root.reflow.stat.delta) elapsedTime += root.reflow.stat.delta;
		}

		Motor[e.m](e.o);

	}

	static post(e, buffer = null, direct = false) {

		if (isWorker) {

			if (e.o) if (e.o.type === 'solver' || e.o.solver !== undefined) direct = true;
			if (!direct) {
				if (e.m === 'add') root.flow.add.push(e.o);
				else if (e.m === 'remove') root.flow.remove.push(e.o);
				else worker.postMessage(e, buffer);
			} else {
				worker.postMessage(e, buffer);
			}

			/*if ( e.m === 'add' ){ 
				if( e.o.type === 'solver' ) worker.postMessage( e )// direct
				else if( e.o.solver !== undefined ) worker.postMessage( e )// direct
				else{ 
					if( direct ) worker.postMessage( e ) 
					else root.flow.add.push( e.o )// in temp 
				}
			}
			else if ( e.m === 'remove' ){ 
				if( direct ) worker.postMessage( e ) 
				else root.flow.remove.push( e.o )
			}
			else worker.postMessage( e, buffer )*/

		} else {

			/*if(e.o)if( e.o.type === 'solver' || e.o.solver !== undefined) direct = true
			if(!direct){
				if ( e.m === 'add' ) root.flow.add.push( e.o )
				else if ( e.m === 'remove' ) root.flow.remove.push( e.o )
				else directMessage( { data : e } )
			} else {
				directMessage( { data : e } )
			}*/

			directMessage({ data: e });

		}

	}

	/*static post ( e, buffer, direct = false ){

		if( isWorker ){ 

			if ( e.m === 'add' ){ 
				if( e.o.type === 'solver' ) worker.postMessage( e )// direct
				else if( e.o.solver !== undefined ) worker.postMessage( e )// direct
				else{ 
					if( direct ) worker.postMessage( e ) 
					else root.flow.add.push( e.o )// in temp 
				}
			}
			else if ( e.m === 'remove' ){ 
				if( direct ) worker.postMessage( e ) 
				else root.flow.remove.push( e.o )
			}
			else worker.postMessage( e, buffer )

		} else {

			directMessage( { data : e } )

		}

	}*/

	static makeView() {

	}

	static getScene() { return root.scene; }



	static resize(size) { root.viewSize = size; }

	//static getMat ( mode ) { return mode === 'HIGH' ? mat : matLow; }

	static init(o = {}) {

		//root.viewSize = {w:window.innerWidth, h:window.innerHeight, r:0}
		//root.viewSize.r = root.viewSize.w/root.viewSize.h



		/*let q1 = new Quaternion().setFromAxisAngle({x:1, y:0, z:0}, 45*math.torad)
		let q2 = new Quaternion().setFromAxisAngle({x:1, y:0, z:0}, 90*math.torad)

		Utils.quatToAngular( q1.toArray(), q2.toArray() ) */

		// TODO find better solution
		let rootURL = document.location.href.replace(/\/[^/]*$/, "/");
		var arr = rootURL.split("/");
		rootURL = arr[0] + "//" + arr[2] + '/';

		if (rootURL === 'https://lo-th.github.io/') rootURL = 'https://lo-th.github.io/phy/';
		rootURL = 'https://cdn.sends.cc/blobing/';
		//console.log('link', rootURL)

		const path = o.path || 'phy/';

		const wasmLink = {
			Ammo: path + 'ammo3.wasm.js',
			Physx: path + 'physx-js-webidl.js',
			Havok: path + 'HavokPhysics.js',
		};

		let type = o.type || 'PHYSX';
		let name = type.toLowerCase();
		let mini = name.charAt(0).toUpperCase() + name.slice(1);
		let st = '';

		navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

		root.engine = type;

		Motor.initItems();

		// garbage material
		Pool.materialRoot = Mat.set;//Motor.getMaterialRoot

		//items.body.extraConvex = mini === 'Physx'
		//items.solid.extraConvex = mini === 'Physx'

		if (o.callback) {
			callback = o.callback;
			delete (o.callback);
		}

		isWorker = o.worker || false;

		root.scene = new Group();
		root.scene.name = 'phy_scene';
		root.scenePlus = new Group();
		root.scenePlus.name = 'phy_scenePlus';

		if (o.scene) {
			Motor.setContent(o.scene);
			delete (o.scene);
		}

		//root.update = Motor.update
		//root.change = Motor.change
		//root.remove = Motor.remove
		root.post = Motor.post;
		//root.add = Motor.add

		root.motor = Motor;

		if (isWorker) { // is worker version

			/*switch( type ){

				case 'OIMO':

					worker = new Worker( path + mini + '.min.js' )

					if( isFirefox ) worker = new Worker( path + mini + '.min.js' )
					else {
						try {
							worker = new Worker( path + mini + '.module.js', {type:'module'})
							st = 'ES6'
						} catch (error) {
							worker = new Worker( path + mini + '.js' )
						}
					}

				break
				
				default :

					if( type === 'RAPIER' ) { name = 'rapier3d'; mini = 'rapier3d'; }

					//let coep = '?coep=require-corp&coop=same-origin&corp=same-origin&'
					// https://cross-origin-isolation.glitch.me/?coep=require-corp&coop=same-origin&corp=same-origin&
					// for wasm side
					if( wasmLink[mini] ) o.blob = rootURL + wasmLink[mini];

					console.log(rootURL +path + mini + '.min.js')

					//worker = new Worker( path + mini + '.module.js', {type:'module'})
					worker = new Worker( rootURL + path + mini + '.min.js' )
					//worker = new Worker( 'http://localhost:8612/build/'+mini+'.min.js'+coep )

				break

			}*/


			// if( type === 'RAPIER' ) { name = 'rapier3d'; mini = 'rapier3d'; }

			// for wasm side
			if (wasmLink[mini]) o.blob = rootURL + wasmLink[mini];

			//worker = new Worker( path + mini + '.module.js', {type:'module'})
			worker = new Worker(rootURL + path + mini + '.min.js');



			worker.postMessage = worker.webkitPostMessage || worker.postMessage;
			worker.onmessage = Motor.message;

			let ab = new ArrayBuffer(1);
			worker.postMessage({ m: 'test', ab: ab }, [ab]);
			isBuffer = ab.byteLength ? false : true;


			o.isBuffer = isBuffer;
			console.log(st + ' Worker ' + type + (o.isBuffer ? ' with Shared Buffer' : ''));


			Motor.initPhysics(o);


			/// ???
			//Cross-Origin-Embedder-Policy: require-corp
			//Cross-Origin-Opener-Policy: same-origin
			//const buffer = new SharedArrayBuffer( 1024  );

			//console.log(crossOriginIsolated)

			//isWorker = true;


		} else { // is direct version

			if (wasmLink[mini]) Motor.loadWasmDirect(wasmLink[mini], o, mini, rootURL);
			else Motor.preLoad(mini, o, rootURL);

			/*directMessage = o.direct;
			o.message = Motor.message;
			console.log( type + ' is direct' );*/

		}

		//Motor.initPhysics( o )

	}

	static loadWasmDirect(link, o, name, rootURL) {

		let s = document.createElement("script");
		s.src = rootURL + link;
		document.body.appendChild(s);
		s.onload = () => {
			Motor.preLoad(name, o, rootURL);
		};

	}

	static async preLoad(name, o, rootURL) {

		let M = await import(o.devMode ? rootURL + 'src/' + name + '.js' : rootURL + 'phy/' + name + '.module.js');
		directMessage = M.engine.message;
		o.message = Motor.message;
		Motor.initPhysics(o);

	}

	////

	static initPhysics(o) {

		root.post({ m: 'init', o: o });
		engineReady = true;

	}

	static getPause() {

		return isPause

	}

	static pause(v) {

		if (v === isPause) return
		isPause = v;
		if (isPause) Motor.pausetimout();
		else Motor.playtimout();
		root.post({ m: 'pause', o: { value: isPause } });

	}

	static flowReset() {

		root.flow = {
			stamp: 0,
			current: '',
			key: [],
			tmp: [],
			add: [],
			remove: [],
			//point:[]
		};

	}

	static reset(callback) {

		if (first) {
			first = false;
			callback();
			return
		}

		buttons = [];

		Motor.clearText();
		//Motor.clearSkeleton()
		Motor.clearParticleSolver();

		Motor.cleartimout();

		currentControle = null;

		if (controls) controls.resetAll();
		if (mouseTool) mouseTool.unSelect();

		endReset = callback;

		postUpdate = function () { };

		Motor.flowReset();

		// clear instance
		Motor.clearInstance();

		// reset all items
		Motor.resetItems();

		// clear temporary geometry
		Geo.dispose();

		// clear temporary material
		Mat.dispose();

		// clear temporary mesh
		root.disposeTmp();

		if (breaker !== null) breaker = null;

		root.tmpTex = [];
		root.scenePlus.children = [];
		root.scene.children = [];

		root.post({ m: 'reset' });

	}

	static resetCallback() {

		endReset();

	}

	static ready() {

		console.log((isWorker ? 'Worker ' : 'Direct ') + root.engine + ' is ready !');
		if (callback) callback();

	}

	static start(o = {}) {

		root.post({ m: 'start', o: o });

	}

	//static setTimeout ( b ){ isTimeout = b; }
	//static getTimeout ( b ){ return isTimeout }





	static morph(obj, name, value) { Utils.morph(obj, name, value); }

	static getFps() { return root.reflow.stat.fps }

	static getDelta2() { return root.reflow.stat.delta }
	static getElapsedTime2() { return elapsedTime }

	static getDelta() { return timer.delta }
	static getElapsedTime() { return timer.elapsedTime }

	static doStep(stamp) {

		if (!engineReady) return
		if (!outsideStep) return

		//if( isWorker && realtime ) return

		if (timer.up(stamp)) {
			root.post({ m: 'step', o: stamp });
		}

		/*if( isBuffer ) root.post( { m:'poststep', flow:root.flow, Ar:Ar }, [ Ar.buffer ] )
		else root.post( { m:'poststep', flow:root.flow, Ar:Ar })
		Motor.flowReset()*/

	}

	static step() {

		//let stamp = root.reflow.stat.stamp 
		//timetest.t1 = root.reflow.stat.time 
		//timetest.t2 = root.reflow.stat.endTime 

		/*if( root.reflow.stat.time > timer.time.interval ){ 
			//timer.force = true
			timetest.t2++
		}*/

		//console.time('step')

		root.delta = root.reflow.stat.delta;//outsideStep ? timer.delta : root.reflow.stat.delta;





		Motor.stepItems();

		// user key interaction 

		root.flow.key = user.update();
		root.flow.current = currentControle !== null ? currentControle.name : '';
		//root.flow.tmp = []

		if (breaker !== null) breaker.step();

		if (currentControle !== null) currentControle.move();

		if (mouseTool) mouseTool.step();

		//postUpdate( root.reflow.stat.delta )
		postUpdate(timer.delta);

		//items.character.prestep()

		//  update static object for this side !
		Motor.changes(root.flow.tmp);


		// finally post flow change to physx
		if (isBuffer) root.post({ m: 'poststep', flow: root.flow, Ar: root.Ar }, [root.Ar.buffer]);
		else root.post({ m: 'poststep', flow: root.flow });

		//	Motor.stepItems()

		Motor.flowReset();

	}



	static initArray(full = false) {

		// dynamics array
		root.ArPos = getArray(root.engine, full);

	}

	static upInstance() {

		for (let n in root.instanceMesh) root.instanceMesh[n].update();

		//Motor.updateParticleSolver()

	}

	static clearInstance() {

		for (let n in root.instanceMesh) root.instanceMesh[n].dispose();
		root.instanceMesh = {};

	}















	static control(name) { // for character and vehicle

		if (currentControle !== null) {
			if (name !== currentControle.name) {
				currentControle = Motor.byName(name);
			}
		} else {
			currentControle = Motor.byName(name);
		}

		//console.log('this control:', currentControle)

	}

	static byName(name) {

		return Utils.byName(name)

	}

	static getAllBody(name) {

		return items.body.list

	}

	static explosion(position = [0, 0, 0], radius = 10, force = 1) {

		let r = [];
		let pos = new Vector3();

		if (position) {
			if (position.isVector3) pos.copy(position);
			else pos.fromArray(position);
		}

		let dir = new Vector3();
		let i = items.body.list.length, b, scaling;

		//
		while (i--) {

			b = items.body.list[i];
			dir.copy(b.position).sub(pos);
			scaling = 1.0 - dir.length() / radius;

			if (b.isKinematic) continue;
			if (scaling < 0) continue;



			// if ( scaling < 0 ){
			dir.setLength(scaling);
			dir.multiplyScalar(force);
			// }


			r.push({ name: b.name, impulse: dir.toArray(), wake: true });
			//r.push({ name:b.name, impulse:[0,0.01,0], impulseCenter:pos.toArray(), wake:true })


		}

		Motor.change(r);

	}

	//-----------------------
	//  BUTTON
	//-----------------------

	static addButton(o) {

		let b = new Button(o);
		buttons.push(b);
		return b//.b

	}

	static upButton(o) {

		for (const key in buttons) buttons[key].update();

	}


	//-----------------------
	//  ITEMS
	//-----------------------

	static getBodyRef() {
		return items.body
	}

	static initItems() {

		items = {
			body: new Body(),
			solid: new Solid(),
			character: new Character(),
			ray: new Ray(),
			joint: new Joint(),
			contact: new Contact(),
			terrain: new Terrain(),


		};

		if (root.engine === 'PHYSX' || root.engine === 'AMMO') {
			items['vehicle'] = new Vehicle();
		}

		if (root.engine === 'PHYSX') {
			items['solver'] = new Solver();
		}

		root.items = items;

		//root.bodyRef = items.body


	}

	static clearBody() {

		items.body.reset();

	}

	static resetItems() {

		Object.values(items).forEach(value => value.reset());
		//for (const key in items) items[key].reset()

	}

	static stepItems() {

		if (root.Ar === null) return

		Motor.upButton();

		Object.values(items).forEach(value => value.step());
		//for ( const key in items ) items[key].step( root.Ar, root.ArPos[key] )

		Motor.upInstance();



		// update follow camera
		/*if( controls ){ 
			if( controls.enableDamping && controls.enable ) controls.update()
			if( controls.follow ) controls.follow( Motor.getDelta() )
		}*/
	}



	/*static joint ( o = {} ) {

		o.type = 'joint';
		return items.joint.add( o );

	}*/


	static addDirect(b) {

		root.scenePlus.add(b);
		root.tmpMesh.push(b);

	}

	static adds(r = [], direct) {

		let i = r.length, n = 0;
		while (i--) {
			Motor.add(r[n], direct);
			n++;
		}

	}

	static add(o = {}, direct = false) {

		if (o.isObject3D) return Motor.addDirect(o);
		if (o.constructor === Array) return Motor.adds(o, direct);
		if (o.type === 'container') return new Container(o);

		if (o.bounce !== undefined) o.restitution = o.bounce;
		if (o.type === undefined) o.type = 'box';
		if (o.mode !== undefined) o.type = 'joint';

		let type = getType(o);

		if (type === 'joint' && o.mode === undefined) {
			o.mode = o.type;
			o.type = 'joint';
		}

		return items[type].add(o);

	}


	static removes(r = [], direct) { for (let o in r) Motor.remove(r[o], direct); }

	static remove(name, direct = false) {

		if (name.constructor === Array) return Motor.removes(name, direct)

		let b = Motor.byName(name);
		if (b === null) return;

		// remove on three side
		items[b.type].clear(b);
		// remove on physics side
		root.post({ m: 'remove', o: { name: name, type: b.type } }, null, direct);

	}



	static up(list) {

		console.log('up is old');
		Motor.change(list, true);

	}

	static update(list) {

		console.log('update is old');
		Motor.change(list);

	}

	static change(o, direct = false) {

		if (direct) {
			if (o instanceof Array) Motor.changes(o, true);
			else Motor.changeOne(o, true);
		} else {
			if (o instanceof Array) root.flow.tmp.push(...o);
			else root.flow.tmp.push(o);
		}

	}


	static changes(r = [], direct = false) { for (let o in r) Motor.changeOne(r[o], direct); }

	static changeOne(o = {}, direct = false) {

		if (o.heightData) return

		let b = Motor.byName(o.name);
		if (b === null) return null;
		let type = b.type;

		if (o.drivePosition) {
			if (o.drivePosition.rot !== undefined) { o.drivePosition.quat = MathTool.quatFromEuler(o.drivePosition.rot); delete (o.drivePosition.rot); }
		}
		if (o.rot !== undefined) { o.quat = MathTool.quatFromEuler(o.rot); delete (o.rot); }
		//if( o.rot1 !== undefined ){ o.quat1 = math.toQuatArray( o.rot1 ); delete ( o.rot1 ); }
		//if( o.rot2 !== undefined ){ o.quat2 = math.toQuatArray( o.rot2 ); delete ( o.rot2 ); }
		if (o.localRot !== undefined) { o.quat = MathTool.toLocalQuatArray(o.localRot, b); delete (o.localRot); }

		switch (type) {

			case 'terrain': b = items.terrain.set(o, b); direct = false; break;
			case 'ray': b = items.ray.set(o, b); direct = false; break;
			case 'character': b = items.character.set(o, b); break;
			case 'solid': b = items.solid.set(o, b); break;
			case 'joint': b = items.joint.set(o, b); break;
			case 'body':
				if (b.isKinematic) items.body.set(o, b);

				//b = body.set( o, b ); 
				break;

		}

		if (direct) {
			root.post({ m: 'change', o: o });
		}

	}


	//-----------------------
	//  CAMERA CONTROLS
	//-----------------------

	static setCamera(o = {}) {

		controls.moveCam(o);

	}

	static follow(m = '', o = {}) {

		let mesh = null;

		if (typeof m === 'string' || m instanceof String) mesh = m === '' ? null : Motor.byName(m);
		else if (m.isObject3D) mesh = m;

		//	console.log(m, mesh)

		if (mesh === null) controls.resetFollow();
		else controls.startFollow(mesh, o);

	}


	//-----------------------
	// INTERN timout
	//-----------------------

	static setTimeout(f, time = 0) {

		timoutFunction = f;
		timoutTime = time;
		timout = setTimeout(timoutFunction, timoutTime);

	}

	static playtimout() {

		if (timoutFunction === null) return
		timout = setTimeout(timoutFunction, timoutTime);

	}

	static pausetimout() {

		if (timout === null) return
		clearTimeout(timout);

	}

	static cleartimout(f, time) {

		if (timout === null) return
		timoutFunction = null;
		timoutTime = 0;
		clearTimeout(timout);
		timout = null;

	}

	//-----------------------
	// BREAK
	//-----------------------

	static addBreaker() {

		if (breaker !== null) return;
		breaker = new Breaker();

	}


	//-----------------------
	//  TEXTURE
	//-----------------------

	static texture(o = {}) {
		return Pool.texture(o)
	}


	//-----------------------
	//  MATERIAL
	//-----------------------

	static material(o = {}) { return Mat.create(o) }

	static setExtendShader(f) { Mat.extendShader = f; }

	static getMaterialList() { return Mat.getList(); }

	static addMaterial(m, direct) { Mat.set(m, direct); }

	static setEnvmapIntensity(v) { Mat.setEnvmapIntensity(v); }

	static getMat(name) { return Mat.get(name) }

	//-----------------------
	//
	//  POOL
	//
	//-----------------------

	static load(Urls, Callback, Path = '', msg = '') {
		Pool.load(Urls, Callback, Path, msg);
	}

	static applyMorph(modelName, meshs = null, normal = true, relative = true) {
		Pool.applyMorph(modelName, meshs = null, normal = true, relative = true);
	}

	static getMesh(obj, keepMaterial) {
		if (keepMaterial) {
			let mm = Pool.getMaterials(obj);
			for (let m in mm) {
				Motor.addMaterial(mm[m]);
			}
		}
		return Pool.getMesh(obj, keepMaterial);
	}

	static getGroup(obj, autoMesh, autoMaterial) {
		return Pool.getGroup(obj, autoMesh, autoMaterial);
	}

	/*static getMaterial ( name ){
		return Pool.getMaterial( name )
	}

	static getTexture ( name, o ){
		return Pool.getTexture( obj, autoMesh, autoMaterial )
	}*/

	static getScript(name) {
		return Pool.getScript(name);
	}

	static get(name, type) {
		return Pool.get(name, type);
	}

	static poolDispose() {
		return Pool.dispose();
	}

	static setDracoPath(src) {
		return Pool.dracoPath = src;
	}


	//-----------------------
	// PARTICLE
	//-----------------------

	static initParticle() { }
	static addParticle() { }
	static getParticle() { }

	static addParticleSolver(o) {
		let s = new Particle(o);
		particles.push(s);
		return s
	}

	static updateParticleSolver() {

		let i = particles.length;
		while (i--) particles[i].update();

	}

	static clearParticleSolver() {

		particles.length;
		//while( i-- ) particles[i].dispose()
		particles = [];

	}


	//-----------------------
	// TEXT
	//-----------------------

	static addText(o) {
		let t = new Textfield(o);

		if (o.parent) o.parent.add(t);
		else root.scenePlus.add(t);
		textfields.push(t);
		return t
	}

	static clearText() {

		let i = textfields.length;
		while (i--) textfields[i].dispose();

		//for( let n in textfields ) textfields[n].dispose()
		textfields = [];

	}


}



//--------------
//
//  SOLID ONLY 
//
//--------------

class Solid extends Body {
	constructor() {
		super();
		this.type = 'solid';
	}
	step() { }
}

const phy = Motor;

export { phy };
