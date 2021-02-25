<template>
  <div class="main-wrap">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view> 
   </keep-alive>
   <router-view v-if="!$route.meta.keepAlive"></router-view> 
  </div>
</template>

<script>
export default {
  // name: "main",
  setup(props, context){

  }
}
</script>

<style lang='scss' scoped>
 
</style>
