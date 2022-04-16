<template>
  <div class="five_box"
       style="position: relative">
    <!-- 进度条 -->
    <div class="progress"></div>
    <div id="five_cavs"></div>

    <!-- 水印 -->
    <!-- <div class="watermark">Slooong</div> -->

    <!-- 右上角 分享 -->
    <div class="share_panel">
      <div class="control_volume mb_10 cursor_pointer"
           :class="[isVolume? 'open': 'close']"
           @click="isVolume= !isVolume">
        <em class="s_icon"></em>
      </div>
      <div class="control_share"
           @click="clickShare">
        <em class="s_icon"></em>
      </div>
    </div>
    <!-- 录制 -->
    <div class="control-video">
      <div class="control-state-item lookAround-start"
           ref="lookAroundStart"
           v-if="recording == 0"
           @click="recordingStart">
        <div class="v-img"></div>
        <span class="ml_5">录制</span>
      </div>
      <div class="control-state-item lookAround-play"
           ref="lookAroundPlay"
           v-if="recording == 2"
           @click="recordingPlay">
        <div class="v-img"></div>
        <span class="ml_5">播放</span>
      </div>
      <div class="control-state-item lookAround-stop"
           ref="lookAroundStop"
           v-if="recording == 1"
           @click="recordingStop">
        <div class="v-img"></div>
        <span class="ml_5">暂停</span>
      </div>
      <div class="control-state-item state-recording"
           ref="recording"
           v-if="recording == 1">
        <span>录制中</span><em class="dot"></em>
      </div>
      <div class="control-state-item state-playing"
           ref="recordingPlaying"
           v-if="recording == 3">
        <span>播放中</span><em class="dot"></em>
      </div>
    </div>

    <!-- 控制中心 -->
    <div class="control-groups">
      <div class="control-ul">
        <div class="control-item convention"
             @click="clickConvention">
          <div class="d-img"></div>
          <div>预约</div>
        </div>
        <div class="control-item barrager"
             @click=" barrageValue = '';barrageShow = true">
          <div class="d-img"></div>
          <div>说点...</div>
        </div>
        <div class="control-item lookAround-tag"
             @click="tagValue = ''; tagShow = true">
          <div class="d-img"></div>
          <div>标记</div>
        </div>
        <div class="control-item Panorama"
             :class="{'active': mode === 'Panorama' }"
             @click="changeMode('Panorama')">
          <div class="d-img"></div>
          <div>导览</div>
        </div>
        <div class="control-item Floorplan"
             :class="{'active': mode === 'Floorplan' }"
             @click="changeMode('Floorplan')">
          <div class="d-img"></div>
          <div>3D</div>
        </div>
      </div>
    </div>
    <!-- 弹幕 -->
    <div style="position: absolute;top: 100px;left: 0;z-index: 9;height: 200px;width: 100%;">
      <vue-baberrage :isShow="true"
                     :barrageList="barrageList"
                     :loop="false">
      </vue-baberrage>
    </div>

    <!-- 切换 场景 -->
    <div class="control-project">
      <div class="control-project-ul">
        <div class="control-project-item"
             :class="[index == projcetIndex ? 'active' : '']"
             v-for="(item, index) in 2"
             :key="index"
             @click="changeProject(index)">
          <div class="project-bg"></div>
        </div>
      </div>
    </div>
    <Dialog v-model="tagShow"
            @confirm="confirmTag">
      <div>
        <input v-model="tagValue"
               type="text"
               placeholder="请输入内容"
               class="control-input" />
      </div>
    </Dialog>
    <Dialog v-model="barrageShow"
            @confirm="confirmBarrage">
      <div>
        <input v-model="barrageValue"
               type="text"
               placeholder="请输入内容"
               class="control-input" />
      </div>
    </Dialog>
  </div>
</template>

<script>
import { Five, parseWork } from '@realsee/five'
import { Recorder } from '@/assets/js/recorder'

export default {
  data () {
    return {
      tagShow: false,
      tagValue: '',
      barrageShow: false,
      barrageValue: '',
      barrageId: 1,
      barrageList: [],
      five: null, // five
      fiveApp: null, // fiveApp dom
      newTag: null, // 打标签 新lable
      tags: [], // 标签列表
      tagToElement: null, // WeakMap
      recorder: null, // 视频录制
      isVolume: true, // 声音 开关
      mode: 'Panorama', // 模式(Panorama, Floorplan)
      projcetIndex: 0, // 项目
      projectList: [
        { data: require('./data/data0.json') },
        { data: require('./data/data1.json') }
      ],
      recording: 0,
      avatar: require('@/assets/img/avatar.png')
    }
  },
  mounted () {
    this.recorder = new Recorder()
    this.tagToElement = new WeakMap()
    this.fiveApp = document.querySelector('#five_cavs')

    const five = new Five()
    this.five = five

    five.appendTo(this.fiveApp)
    this.changeProject(0)
    const progressDom = document.querySelector('.progress')

    five.on('textureLoading', progress => {
      progressDom.classList.remove('d-none')
      progressDom.style.width = progress * 100 + '%'
    })

    five.on('panoArrived', () => {
      progressDom.classList.add('d-none')
      progressDom.style.width = 0
    })

    window.addEventListener('resize', () => five.refresh(), false)

    five.on('intersectionOnModelUpdate', intersect => {
      if (this.newTag) this.newTag.position = intersect.point
      this.renderTags()
    })
    five.on('wantsTapGesture', (raycaster) => {
      if (this.newTag) {
        const [intersection] = five.model.intersectRaycaster(raycaster) // 坐标系
        this.newTag.position = intersection.point
        this.tags.push(this.newTag)
        this.newTag = null
        this.renderTags()
        return false
      }
    })
    five.on('cameraUpdate', this.renderTags)

    five.on('stateChange', state => {
      if (this.recording !== 1) return
      this.recorder.record(state)
    })
  },
  methods: {
    changeProject (index) {
      this.projcetIndex = index
      var json = require(`./data/data${index}.json`)
      this.tags = []
      this.newTag = null
      this.renderTags()

      var tags = document.querySelectorAll('.tag')
      if (tags.length) {
        tags.forEach(itemDom => itemDom.remove())
      }

      const work = parseWork(json)
      this.five.load(work, 'initial')
    },
    clickShare () {
      this.$message.success('分享成功')
    },
    clickConvention () {
      this.$message.success('预约成功')
    },
    confirmBarrage () {
      this.barrageList.push({
        id: ++this.barrageId,
        avatar: this.avatar,
        msg: this.barrageValue || 'aaa',
        time: 5
      })
    },
    changeMode (mode) {
      this.mode = mode
      this.five.setState({ mode: mode })
    },
    createTagElement (tag) {
      const div = document.createElement('div')
      div.className = 'tag'
      div.style.display = 'none'
      div.innerHTML = `<div class="tag-pannel"><span class="tag-content">${tag.label}</span></div>`
      this.fiveApp.appendChild(div)
      return div
    },
    renderTags () {
      for (const tag of [this.newTag, ...this.tags]) {
        if (!tag) continue
        if (!tag.position) continue
        const element = this.tagToElement.get(tag)
        if (!element) continue
        const position = this.five.project2d(tag.position, true) // 移动端 null
        if (position === null) {
          element.style.display = 'none'
        } else {
          element.style.display = ''
          element.style.left = position.x + 'px'
          element.style.top = position.y + 'px'
        }
      }
    },
    confirmTag () {
      this.newTag = { label: this.tagValue || '未命名' }
      this.tagToElement.set(this.newTag, this.createTagElement(this.newTag))
    },
    recordingStart () {
      this.recording = 1
      this.recorder.startRecording()
    },
    recordingStop () {
      this.recording = 2
      this.recorder.endRecording()
    },
    recordingPlay () {
      this.recording = 3
      const hasReocrd = this.recorder.play((state, isFinal) => {
        this.five.setState(state)
        // console.log('isFinal', isFinal)
        if (isFinal) { // 播放完毕
          this.recording = 0
        }
      })
      // console.log('hasReocrd', hasReocrd)
      if (hasReocrd) {
      }
    }
  }
}
</script>
