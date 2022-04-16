/**
 * 录制类
 */
class Recorder {
  constructor() {
    this.startTime = 0
    this.records = null
  }

  /**
   * 是否已录制
   */
  hasRecords () {
    return this.records !== null
  }

  /**
   * 录制关键帧
   * @param state five 的 state
   * @returns
   */
  record (state) {
    if (this.records === null) return
    this.records.push({
      state: Object.assign({}, state),
      time: Date.now() - this.startTime
    })
  }

  /**
   * 开始录制
   */
  startRecording () {
    this.startTime = Date.now()
    this.records = []
  }

  /**
   * 结束录制
   */
  endRecording () {
    this.startTime = 0
  }

  /**
   * 回放录制
   * @param callback 关键帧回调
   * @returns 当前是否有录制
   */
  play (callback) {
    if (this.records === null || this.records.length === 0) return false
    const records = this.records.slice()
    const keyframe = keyIndex => {
      const current = records[keyIndex]
      const next = records[keyIndex + 1]
      callback(current.state, next === undefined)
      if (next) {
        const delay = next.time - current.time
        setTimeout(() => keyframe(keyIndex + 1), delay)
      }
    }
    keyframe(0)
    return true
  }
}

export { Recorder }
