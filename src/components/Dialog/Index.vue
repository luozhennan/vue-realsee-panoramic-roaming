<template>
  <div class="dialog_mask"
       :class="{show: value}">
    <div class="dialog_body">
      <div class="dialog_body_main">
        <slot />
      </div>
      <div class="dialog_btn_group">
        <div class="dialog_btn"
             @click="close">取消</div>
        <div class="dialog_btn parmary"
             @click="confirm">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    confirm () {
      this.$emit('input', false)
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog_mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: none;
  justify-content: center;
  align-items: center;
  &.show {
    display: flex;
  }
  .dialog_body {
    width: 70%;
    min-height: 120px;
    height: auto;
    border-radius: 10px;
    background-color: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    .dialog_body_main {
      flex: 1;
      padding-bottom: 20px;
    }
    .dialog_btn_group {
      display: flex;
      justify-content: flex-end;
      .dialog_btn {
        padding: 10px 30px;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 20px;
        background-color: #ddd;
        &:first-child {
          margin-left: 0;
        }
        &.parmary {
          background-color: #3a40ed;
          color: #fff;
        }
      }
    }
  }
}
</style>
