import MessageComponent from './Index.vue'
const Message = {}

Message.install = function (Vue) {
  const MessageConstructor = Vue.extend(MessageComponent)
  const instance = new MessageConstructor()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  let timer
  Vue.prototype.$message = {
    messageMode (msg, type, duration) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        instance.visible = false
      }, duration)
      instance.message = msg
      instance.visible = true
      instance.type = type
    },
    success (msg, duration = 3000) {
      this.messageMode(msg, 1, duration)
    },
    warn (msg, duration = 3000) {
      this.messageMode(msg, 2, duration)
    },
    error (msg, duration = 3000) {
      this.messageMode(msg, 3, duration)
    }
  }
}

export default Message
