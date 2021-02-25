<template>
 <div>
   <div class="img-wrap">
     <img src="@/assets/img/logo.png" alt="">
   </div>
   <el-menu class="el-menu-vertical" text-color="#000" :collapse="isCollapse"
   :unique-opened="true" background-color="transparent">
      <div v-for="(item,i) in routes" :key="i">
        <el-submenu :index="i+''" v-if="item.meta">
          <template slot="title">
            <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon"></svg-icon>
            <span slot="title">{{item.meta.name}}</span>
          </template>
          <div v-for="(subitem,j) in item.children" :key="j" @click.stop="openRoute(subitem)">
            <el-menu-item :index="i+'-'+j" v-show="!subitem.hidden">{{subitem.meta.name}}</el-menu-item>
          </div>
        </el-submenu>
      </div> 
  </el-menu>
 </div>
</template>

<script>
import { computed } from "@vue/composition-api"
export default {
  name: "side",
  setup(props, { root }){
    const routes = root.$router.options.routes
    const isCollapse = computed(() => root.$store.state.app.isCollapse)
    const openRoute = (val) => {
      if(root.$route.path != val.path){
        root.$router.push({path: val.path})
      }else{
        return false
      }
    }
    return {
      routes,
      isCollapse,
      openRoute
    }
  },
}
</script>

<style lang='scss' scoped>
.el-menu-vertical{
  overflow: hidden;
  border-right: none;
}
// .el-menu-vertical.el-menu--collapse {
//   width: 45px;
// }
.el-menu-vertical:not(.el-menu--collapse) {
  width: 230px;
}
</style>
<style lang="scss">
.el-menu-item{
  padding-left: 55px !important;
  &.is-active{
  color: #fff;
  background-color: rgba(245, 108, 108, .5) !important;
  }
}
// li .el-submenu{
//   &.is-active.is-opened .el-submenu__title{
//     background-color: rgba(245, 108, 108, .8) !important;
//   }
// }
.img-wrap{
  width: 64px;
  height: 64px;
  margin: 20px auto 0;
  img{
    width: 100%;
  }
}
.svg-icon{
  margin-right: 10px;
}
.close{
  .el-submenu__title{
    span,i{
      display: none;
    }
  }
}
</style>