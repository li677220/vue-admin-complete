<template>
  <div class="page404">
    <div class="tips">
      <span class="title">404</span>
      <p class="msg">{{msg}}</p>
    </div>
    <div class="shadow"></div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'
export default {
  name: "Page404",
  setup(){
    const msg = ref("Page not found")
    return{
      msg
    }
  }
}
</script>

<style lang='scss' scoped>
.page404{
  // width: 100vw;
  height: 50vh;
  margin-top: 5%;
  text-align: center;
}
.title{
  font-size: 60px;
}
.shadow{
  width: 100px;
  height: 15px;
  margin: 0 auto;
  border-radius: 100%;
  background-image: radial-gradient(rgb(224, 223, 223), rgb(245, 245, 243), #fff);
}
</style>
