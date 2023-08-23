import './Game.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import Stats from 'stats.js'
import { phy } from '../../utils/Phy.module.js'

let camera, scene, renderer, render_stats, controls, diceModel
const GAME_STATUS = {
  UNLOAD: 0,
  READY: 1,
  ING: 2
}

const Game = {
  data() {
    return {
      gameStatus: GAME_STATUS.UNLOAD
    }
  },
  methods: {
    // three init
    threeInit() {
      // camera and scene
      const container = this.$refs.game
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 1000)
      camera.position.set(0, 28, 0)
      scene = new THREE.Scene()

      // render
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1
      renderer.shadowMap.enabled = true
      renderer.shadowMapSoft = true
      container.appendChild(renderer.domElement)

      // stats
      render_stats = new Stats()
      render_stats.domElement.style.zIndex = 100
      container.appendChild(render_stats.domElement)

      // controls
      controls = new OrbitControls(camera, renderer.domElement)
      controls.minDistance = 12
      controls.maxDistance = 28
      controls.enablePan = false
      controls.target.set(0, 0, 0)
      controls.enableDamping = true
      controls.update()

      // background
      new RGBELoader().load('/textures/thatch_chapel_1k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.backgroundBlurriness = 0.5
        scene.environment = texture
        this.render3D()
      })

      // handle window resize
      window.addEventListener('resize', this.onWindowResize)
    },
    // handle window resize
    onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      this.render3D()
    },
    // render
    render3D() {
      renderer.render(scene, camera)
    },
    // reset
    reset() {
      let i = 20
      while (i--) phy.remove('dice' + i)

      controls.reset()
      controls.object.position.set(0, 18, 0)
      controls.update()
      this.render3D()
    },
    // frame loop
    animate() {
      requestAnimationFrame(this.animate)
      controls.update()
      this.render3D()
      render_stats.update()
    },
    //phy init
    phyInit() {
      phy.init({
        type: 'PHYSX',
        worker: true,
        callback: this.phyCallback,
        scene: scene,
        path: 'phy/'
      })
    },
    phyCallback() {
      phy.set({ substep: 2, gravity: [0, -100, 0], fps: 120 })
      phy.load(
        ['Bowl/bowl.glb', 'Dice/dice.glb'],
        function () {
          //bowl
          let bowlModel = phy.getMesh('bowl')['mesh']
          phy.add({
            name: 'bowl',
            type: 'mesh',
            shape: bowlModel,
            mesh: bowlModel,
            pos: [0, -5, 0],
            restitution: 1,
            friction: 0.2
          })

          diceModel = phy.getMesh('dice')

          // make dices material
          phy.material({
            name: 'dice',
            roughness: 0.0,
            metalness: 0.0,
            map: phy.texture({ url: 'textures/dices_c.png' }),
            normalMap: phy.texture({ url: 'textures/dices_n.png' }),
            normalScale: [5, -5]
          })
        },
        'models/'
      )
    },
    play() {
      let i = 6
      while (i--)
        phy.add({
          type: 'convex',
          name: 'dice' + i,
          material: 'dice',
          shape: diceModel['D6'].geometry,
          size: [50, 50, 50],
          pos: [0, 2 * i + 3, 0],
          rot: [Math.random() * 360 - 180, Math.random() * 360 - 180, Math.random() * 360 - 180],
          // density: 0.5,
          friction: 0.5,
          mass: 0.01,
          restitution: 0.7
        })
      // phy.add({
      //   name: 'dice' + i,
      //   type: 'box',
      //   size: [0.8, 0.8, 0.8],
      //   pos: [0, 5 + i * 2, 0],
      //   radius: 0.1,
      //   mass: 0.001,
      //   restitution: 0.75
      // })
    }
  },
  mounted() {
    this.threeInit()
    this.render3D()
    this.animate()
    this.phyInit()
  },
  beforeUnmount() {
    window.removeEventListener('resize')
  },
  render() {
    return (
      <>
        <div ref="game"></div>
      </>
    )
  }
}

const play = Game.methods.play
export { play }
export default Game
