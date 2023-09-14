import Loading from '../../components/Loading/Loading.jsx'
import Cloud from '../../components/Cloud/Cloud.jsx'
import Bgm from '../../components/Bgm/Bgm.jsx'
import Result from '../../components/Result/Result.jsx'
import Rank from '../../components/Rank/Rank.jsx'
import Progress from '../../components/Progress/Progress.jsx'
import PlayBtn from '../../components/PlayBtn/PlayBtn.jsx'
import Rule from '../../components/Rule/Rule.jsx'
import Copyright from '../../components/Copyright/Copyright.jsx'
import Notify from '../../components/Notify/Notify.jsx'

import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import Stats from 'stats.js'
import { phy } from '../../utils/Phy.module.js'
import { isDesktop } from '../../utils/device.js'

export default {
  setup() {
    return {
      three: {
        camera: null,
        scene: null,
        renderer: null,
        renderStats: null,
        controls: null
      }
    }
  },
  data() {
    return {
      game: {
        loadFinish: false,
        STATUS: {
          FREE: 'free',
          READY: 'ready',
          ING: 'ing'
        },
        status: 'free',
        downFlag: false,
        settlementJudgeTimer: null,
        judgeFlag: false,
        judgeTimer: null,
        result: {
          text: '中秋博饼',
          score: 0
        },
        playBtnAble: false,
        total: {},
        desktopMode: false
      },
      dice: {
        num: 6,
        data: [],
        model: null,
        collisionSound: {
          soundTime: [],
          sound: []
        }
      }
    }
  },
  watch: {
    'game.status'(value) {
      if (value === this.game.STATUS.READY) {
        this.setGravity(0)
        this.three.controls.enabled = false
        this.readyAngle()
      } else if (value === this.game.STATUS.FREE) {
        this.game.playBtnAble = true
        this.three.controls.enabled = true
        this.setGravity(100)
        this.freeAngle()
      } else {
        this.three.controls.enabled = true
        this.setGravity(100)
        this.ingAngle()
      }
    }
  },
  methods: {
    // three init
    threeInit() {
      // camera and scene
      const container = this.$refs.game
      this.three.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.25,
        1000
      )
      this.three.camera.position.set(0, 30, 0)
      this.three.scene = new THREE.Scene()

      // render
      this.three.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.three.renderer.setPixelRatio(window.devicePixelRatio)
      this.three.renderer.setSize(window.innerWidth, window.innerHeight)
      this.three.renderer.toneMapping = THREE.ACESFilmicToneMapping
      this.three.renderer.toneMappingExposure = 1
      this.three.renderer.shadowMap.enabled = true
      this.three.renderer.shadowMapSoft = true
      container.appendChild(this.three.renderer.domElement)

      //sound
      let listener = new THREE.AudioListener()
      this.three.camera.add(listener)
      new THREE.AudioLoader().load('sounds/collision.mp3', (buffer) => {
        for (let i = 0; i < this.dice.num; i++) {
          this.dice.collisionSound.sound.push(new THREE.Audio(listener))
          this.dice.collisionSound.soundTime.push(new Date().getTime())
          this.dice.collisionSound.sound[i].setBuffer(buffer)
          this.dice.collisionSound.sound[i].setLoop(false)
          this.dice.collisionSound.sound[i].setVolume(1)
        }
      })

      // stats
      this.three.renderStats = new Stats()
      this.three.renderStats.domElement.style.zIndex = 100
      // container.appendChild(this.three.renderStats.domElement)

      // controls
      this.three.controls = new OrbitControls(this.three.camera, this.three.renderer.domElement)
      this.three.controls.minDistance = 12
      this.three.controls.maxDistance = 30
      this.three.controls.enablePan = false
      this.three.controls.target.set(0, 0, 0)
      this.three.controls.enableDamping = true
      this.three.controls.update()

      // light
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
      this.three.scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
      directionalLight.position.set(2, 2, 0.5)
      directionalLight.castShadow = true
      this.three.scene.add(directionalLight)

      // background
      this.$refs.loadingInstance.setMsg('1/2 :加载背景ing...')
      new RGBELoader().load('/textures/moonlit_golf_2k-_1_.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        this.three.scene.background = texture
        // this.three.scene.backgroundBlurriness = 0.2
        this.three.scene.environment = texture
        this.render3D()
      })

      // handle window resize
      window.addEventListener('resize', this.onWindowResize)
    },
    // handle window resize
    onWindowResize() {
      this.three.camera.aspect = window.innerWidth / window.innerHeight
      this.three.camera.updateProjectionMatrix()
      this.three.renderer.setSize(window.innerWidth, window.innerHeight)
      this.render3D()
    },
    // render
    render3D() {
      this.three.renderer.render(this.three.scene, this.three.camera)
    },
    // frame loop
    animate(stamp = 0) {
      requestAnimationFrame(this.animate)
      TWEEN.update()
      this.three.controls.update()
      this.render3D()
      this.three.renderStats.update()
    },
    //phy
    phyInit() {
      phy.init({
        type: 'PHYSX',
        worker: true,
        callback: this.phyCallback,
        scene: this.three.scene,
        path: 'phy/'
      })
    },
    phyCallback() {
      this.setGravity(100)
      this.$refs.loadingInstance.setMsg('2/2 :加载模型ing...')
      phy.load(['Bowl/bowl.glb', 'Dice/dice.glb'], this.modelLoadedCallback, 'models/')
    },
    modelLoadedCallback() {
      //bowl
      let bowlModel = phy.getMesh('bowl')['mesh']
      const bowl = phy.add({
        name: 'bowlInstance',
        type: 'mesh',
        shape: bowlModel,
        mesh: bowlModel,
        pos: [0, -4, 0],
        restitution: 0.6,
        friction: 0.2
      })
      bowl.castShadow = false
      this.dice.model = phy.getMesh('dice')
      // make dices material
      phy.material({
        name: 'dice',
        roughness: 0.0,
        metalness: 0.0,
        map: phy.texture({ url: 'textures/dices_c.png' }),
        normalMap: phy.texture({ url: 'textures/dices_n.png' }),
        normalScale: [5, -5]
      })

      this.$refs.loadingInstance.setMsg('加载完毕')
      this.$refs.loadingInstance.finish()
      this.game.loadFinish = true
      this.freeAngle()
      this.game.playBtnAble = true

      let i = this.dice.num
      const radius = 2
      while (i--) {
        let index = this.dice.num - 1 - i
        const angle = (Math.PI * 2 * i) / this.dice.num // 计算每个骰子的角度
        const x = Math.cos(angle) * radius // 计算 x 坐标
        const z = Math.sin(angle) * radius // 计算 z 坐标
        const pos = [x, 3, z] // 设置骰子的位置
        const rot = [Math.random() * 360, Math.random() * 360, Math.random() * 360]
        this.dice.data.push(
          phy.add({
            type: 'convex',
            name: 'diceInstance' + index,
            material: 'dice',
            shape: this.dice.model['D6'].geometry,
            size: [40, 40, 40],
            pos,
            rot,
            // density: 0.5,
            friction: 0.5,
            mass: 0.01,
            restitution: 0.5
          })
        )
        this.dice.data[index].collision = false
        phy.add({
          type: 'contact',
          b1: 'diceInstance' + index,
          b2: 'bowlInstance',
          callback: (data) => {
            this.dice.data[index].collision = data.hit
            this.collisionCallback(index, data)
          },
          always: false
        })
      }
    },
    collisionCallback(index, data) {
      if (data.hit) {
        let volume = this.velocity(this.dice.data[index]) / 100
        if (volume > 1) volume = 1
        this.playCollisionSound(index, volume)
      }
    },
    playCollisionSound(index, volume) {
      let time = new Date().getTime()
      if (time - this.dice.collisionSound.soundTime[index] > 80) {
        if (this.dice.collisionSound.sound[index].isPlaying)
          this.dice.collisionSound.sound[index].stop()
        this.dice.collisionSound.sound[index].setVolume(volume)
        this.dice.collisionSound.sound[index].play()
        this.dice.collisionSound.soundTime[index] = time
      }
    },
    setGravity(g) {
      if (g === 0) {
        phy.set({ substep: 2, gravity: [0, 0.0001, 0], fps: 120, full: true })
      } else {
        phy.set({ substep: 2, gravity: [0, -g, 0], fps: 120, full: true })
      }
      phy.setGravity()
      let i = this.dice.num
      while (i--) {
        phy.change({
          name: 'diceInstance' + i,
          reset: true
        })
      }
    },
    ingAngle() {
      let pos
      if (this.game.desktopMode) {
        pos = { x: 0, y: 9, z: 6 }
      } else {
        pos = { x: 0, y: 15, z: 10 }
      }
      new TWEEN.Tween(this.three.camera.position).to(pos, 1000).start()
    },
    readyAngle() {
      let pos
      if (this.game.desktopMode) {
        pos = { x: 0, y: 15, z: 1 }
      } else {
        pos = { x: 0, y: 25, z: 1 }
      }
      new TWEEN.Tween(this.three.camera.position).to(pos, 1000).start()
    },
    freeAngle() {
      let pos
      if (this.game.desktopMode) {
        pos = { x: 0, y: 12, z: 12 }
      } else {
        pos = { x: 0, y: 21, z: 20 }
      }
      new TWEEN.Tween(this.three.camera.position).to(pos, 1000).start()
    },
    velocity(o) {
      return Math.pow(o.velocity.x ** 2 + o.velocity.y ** 2 + o.velocity.z ** 2, 1 / 2)
    },
    convertMousePositionToCoordinates(event) {
      if (event.touches) {
        event = event.touches[0]
      }
      const screenX = event.clientX // 鼠标点击的屏幕水平坐标
      const screenY = event.clientY // 鼠标点击的屏幕垂直坐标

      const mouse = new THREE.Vector2()
      mouse.x = (screenX / window.innerWidth) * 2 - 1
      mouse.y = -(screenY / window.innerHeight) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, this.three.camera) // 假设 camera 是 Three.js 相机对象

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0) // 以 Y 轴为法线的平面
      const intersection = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, intersection)

      const x = intersection.x
      const z = intersection.z

      return { x, z }
    },
    //game logic
    down(e) {
      this.game.downFlag = true
      if (this.game.status === this.game.STATUS.READY) {
        this.movePos(e)
      }
    },
    up(e) {
      this.game.downFlag = false
      if (this.game.status === this.game.STATUS.READY) {
        const force = this.$refs.progress.getThrowForceScale()
        if (force > 0) {
          let i = this.dice.num
          while (i--) {
            phy.change({
              name: 'diceInstance' + i,
              force: [0, -force * 30, 0],
              forceMode: 'velocity',
              reset: true
            })
          }
        }
        this.game.status = this.game.STATUS.ING
        if (this.game.judgeTimer) {
          clearTimeout(this.game.judgeTimer)
        }
        this.game.judgeFlag = false
        this.game.judgeTimer = setTimeout(() => {
          this.game.judgeFlag = true
          this.game.judgeTimer = null
        }, 3000)
      }
    },
    move(e) {
      if (this.game.status === this.game.STATUS.READY && this.game.downFlag) {
        this.movePos(e)
      }
    },
    movePos(e) {
      let offset = this.convertMousePositionToCoordinates(e)
      let i = this.dice.num
      const radius = 2
      while (i--) {
        const angle = (Math.PI * 2 * i) / this.dice.num // 计算每个骰子的角度
        const x = Math.cos(angle) * radius // 计算 x 坐标
        const z = Math.sin(angle) * radius // 计算 z 坐标
        const pos = [x + offset.x, 6, z + offset.z] // 设置骰子的位置
        const rot = [Math.random() * 360, Math.random() * 360, Math.random() * 360]
        phy.change({
          name: 'diceInstance' + i,
          pos,
          rot,
          reset: true
        })
      }
    },
    gameInit() {
      document.addEventListener('mousedown', this.down)
      document.addEventListener('touchstart', this.down)
      document.addEventListener('mouseup', this.up)
      document.addEventListener('touchend', this.up)
      document.addEventListener('mousemove', this.move)
      document.addEventListener('touchmove', this.move)
      this.game.settlementJudgeTimer = setInterval(this.settlementJudgeFn, 500)
      if (isDesktop()) this.game.desktopMode = true
    },
    settlementJudgeFn() {
      if (this.game.status === this.game.STATUS.ING) {
        let out = false
        let sleep = true
        this.dice.data.forEach((item) => {
          if (item.position.y < -4) {
            out = true
          }
          if (item.sleep === false) {
            sleep = false
          }
        })
        if (out) {
          this.game.status = this.game.STATUS.FREE
          this.judgeResult(true)
        } else if (sleep || this.game.judgeFlag) {
          this.game.status = this.game.STATUS.FREE
          this.judgeResult(false)
        }
      }
    },
    judgeResult(out) {
      let result
      if (out) {
        result = '跳猴'
      } else {
        const points = this.countPoints()
        // situation
        if (points.p4 === 4 && points.p1 === 2) {
          result = '状元插金花'
        } else if (points.p4 === 6 || points.p1 === 6) {
          result = '六抔红'
        } else if (points.p2 === 6 || points.p3 === 6 || points.p5 === 6 || points.p6 === 6) {
          result = '六抔黑'
        } else if (points.p4 === 5 || points.p1 === 5) {
          result = '五红'
        } else if (points.p2 === 5 || points.p3 === 5 || points.p5 === 5 || points.p6 === 5) {
          if (points.p4 === 1) {
            result = '五子带一秀'
          } else result = '五子登科'
        } else if (points.p4 === 4) {
          result = '状元'
        } else if (
          points.p1 === 1 &&
          points.p2 === 1 &&
          points.p3 === 1 &&
          points.p4 === 1 &&
          points.p5 === 1 &&
          points.p6 === 1
        ) {
          result = '对堂'
        } else if (points.p4 === 3) {
          result = '三红'
        } else if (
          points.p1 === 4 ||
          points.p2 === 4 ||
          points.p3 === 4 ||
          points.p5 === 4 ||
          points.p6 === 4
        ) {
          if (points.p4 === 2) {
            result = '四进带二举'
          } else if (points.p4 === 1) {
            result = '四进带一秀'
          } else result = '四进'
        } else if (points.p4 === 2) {
          result = '二举'
        } else if (points.p4 === 1) {
          result = '一秀'
        } else {
          result = '虾米拢某'
        }
      }
      let count = this.game.total[result]
      if (count) {
        this.game.total[result] = count + 1
      } else {
        this.game.total[result] = 1
      }
      this.game.result.text = result
    },
    countPoints() {
      const points = {
        p1: 0,
        p2: 0,
        p3: 0,
        p4: 0,
        p5: 0,
        p6: 0
      }
      this.dice.data.forEach((item) => {
        points['p' + this.getPointsByRotation(item.quaternion)]++
      })
      return points
    },
    getPointsByRotation(quaternion) {
      // 定义骰子的面和点数的映射关系
      const faceMapping = {
        1: [0, 1, 0],
        2: [0, 0, 1],
        3: [1, 0, 0],
        4: [-1, 0, 0],
        5: [0, 0, -1],
        6: [0, -1, 0]
      }

      let closestFace = null
      let closestDotProduct = -Infinity

      // 创建一个欧拉角旋转矩阵
      const rotationMatrix = new THREE.Matrix4().makeRotationFromQuaternion(quaternion)

      // 遍历骰子的面，计算欧拉角旋转后的法向量与每个面的法向量的点积
      for (const face in faceMapping) {
        const faceNormal = faceMapping[face]
        const rotatedNormal = new THREE.Vector3().fromArray(faceNormal).applyMatrix4(rotationMatrix)

        // 计算点积
        const dotProduct = new THREE.Vector3(0, 1, 0).dot(rotatedNormal)

        // 找到点积最接近1的面
        if (dotProduct > closestDotProduct) {
          closestDotProduct = dotProduct
          closestFace = face
        }
      }

      return closestFace
    },
    play() {
      this.game.playBtnAble = false
      this.game.status = this.game.STATUS.READY
    }
  },
  mounted() {
    this.threeInit()
    this.render3D()
    this.animate()
    this.phyInit()
    this.gameInit()
    // alert(window.screen.width)
    // this.three.controls.addEventListener('change', () => {
    //   console.log(this.three.camera.position)
    // })
    // setInterval(() => console.log(this.dice.data), 1000)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
    document.removeEventListener('mousedown', this.down)
    document.removeEventListener('touchstart', this.down)
    document.removeEventListener('mouseup', this.up)
    document.removeEventListener('touchend', this.up)
    document.removeEventListener('mousemove', this.move)
    document.removeEventListener('touchmove', this.move)
    clearInterval(this.game.settlementJudgeTimer)
  },
  render() {
    return (
      <div ref="game">
        <Loading ref="loadingInstance"></Loading>
        <Cloud loadFinish={this.game.loadFinish}></Cloud>
        <Bgm
          v-show={this.game.status === this.game.STATUS.FREE}
          className="right-5 top-5"
          loadFinish={this.game.loadFinish}
        ></Bgm>
        <Result
          v-show={this.game.status === this.game.STATUS.FREE}
          className="top-24"
          resultText={this.game.result.text}
          loadFinish={this.game.loadFinish}
        ></Result>
        <Progress
          v-show={this.game.status === this.game.STATUS.READY && this.game.downFlag}
          className="top-32"
          ref="progress"
        ></Progress>
        <Rank
          v-show={this.game.status === this.game.STATUS.FREE}
          className="top-44 md:top-48"
          loadFinish={this.game.loadFinish}
        ></Rank>
        <Notify
          v-show={this.game.status === this.game.STATUS.FREE && false}
          className="top-56 md:top-60"
        ></Notify>
        <PlayBtn
          v-show={this.game.status === this.game.STATUS.FREE}
          onBtnClick={this.play}
          className="bottom-28"
          loadFinish={this.game.loadFinish}
        ></PlayBtn>
        <Copyright className="bottom-8"></Copyright>
        <Rule
          v-show={this.game.status === this.game.STATUS.FREE}
          className="bottom-16"
          loadFinish={this.game.loadFinish}
        ></Rule>
      </div>
    )
  }
}
