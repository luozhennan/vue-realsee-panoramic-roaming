<template>
  <div id="app">
    <transition name="rv"
                mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss">
@import "@/assets/style/common.scss";
</style>
