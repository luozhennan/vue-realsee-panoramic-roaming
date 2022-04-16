<template>
  <div>
    <div v-if="visible && type == 1"
         class="message-tip"
         id="tips-success">
      <div>{{ message }}</div>
    </div>
    <div v-if="visible && type == 2"
         class="message-tip"
         id="tips-warn">
      <div>{{ message }}</div>
    </div>
    <div v-if="visible && type == 3"
         class="message-tip"
         id="tips-error">
      <div>{{ message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Message',
  data () {
    return {
      visible: false,
      message: '',
      type: 1
    }
  }
}
</script>
<style lang="scss" scoped>
.message-tip {
  position: fixed;
  z-index: 999;
  min-width: 100px;
  max-width: 200px;
  width: auto;
  height: auto;
  background-color: #000;
  border-radius: 10px;
  padding: 10px 15px;
  left: 50%;
  top: 50px;
  white-space: nowrap;
  word-break: break-all;
  word-wrap: break-word;
  font-size: 0.8em;
  transform: translate(-50%, -50%);
  animation: name 2s ease-in;
  text-indent: 30px;
}
.message-tip img {
  width: 25px;
  height: 25px;
}
#tips-success {
  width: auto;
  max-width: 100%;
  min-height: 18px;
  color: #fff;
  background-image: url("~@/assets/img/success.png");
  background-position-x: 10px;
  background-position-y: center;
  background-size: 25px 25px;
  background-repeat: no-repeat;
}
#tips-warn {
  width: auto;
  max-width: 100%;
  min-height: 18px;
  color: #fff;
  background-image: url("~@/assets/img/warn.png");
  background-position-x: 10px;
  background-position-y: center;
  background-size: 25px 25px;
  background-repeat: no-repeat;
}
#tips-error {
  width: auto;
  max-width: 100%;
  min-height: 18px;
  color: #fff;
  background-image: url("~@/assets/img/fail.png");
  background-position-x: 10px;
  background-position-y: center;
  background-size: 25px 25px;
  background-repeat: no-repeat;
}
</style>
