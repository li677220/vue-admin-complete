<template>
 <div id="layout" :class="menuStatus ? 'close' : 'open'">
  <el-container>
    <el-aside width="250">
      <layoutSide2></layoutSide2>
    </el-aside>
    <el-container>
      <el-header height="75">
        <layoutHeader2></layoutHeader2>
      </el-header>
      <el-main>
        <layoutMain2></layoutMain2>
      </el-main>
    </el-container>
  </el-container>
 </div>
</template>

<script>
import { computed, watch } from '@vue/composition-api';
import { layoutHeader2, layoutMain2, layoutSide2 } from './Components';
export default {
  name: "layout",
  setup(props,{ root }){
    const menuStatus = computed(() => root.$store.state.app.isCollapse)
    return{
      menuStatus
    }
  },
  components: { layoutHeader2, layoutMain2, layoutSide2 }
}
</script>

<style lang='scss' scoped>
.el-header {
    position: fixed;
    height: $headerHeight;
    left: $sideWidth;
    right: 0;
    box-shadow: 0 3px 16px 0 rgba(0, 0, 0, .1px);
  }
  
  .el-aside {
    width: $sideWidth;
    height: 100vh;
    background-color: #bfa;
  }
  
  .el-main {
    position: fixed;
    left: $sideWidth;
    top: $headerHeight;
    right: 0;
    bottom: 0;
    padding: 0;
    border: 20px solid transparent;
    // border-color: transparent;
  }
.close{
  .el-aside{
    transition: all .5s;
    width: $sideColseWidth;
    & .svg-icon{
      margin-right: 30px !important;
    }
  }
  .el-header{
    transition: all .5s;
    left: $sideColseWidth;
  }
  .el-main{
    transition: all .5s;
    left: $sideColseWidth;
  }
}
.open{
  .el-aside{
    transition: all .5s;
    width: $sideWidth;
  }
  .el-header{
    transition: all .5s;
    left: $sideWidth;
  }
  .el-main{
    transition: all .5s;
    left: $sideWidth;
  }
}
</style>
