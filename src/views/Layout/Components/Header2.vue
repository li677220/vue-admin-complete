<template>
 <div id="header-wrap">
   <div class="menu-wrap" @click="switchStatus">
    <svg-icon iconClass="menu" className="menu"></svg-icon>
   </div>
   <div class="full-right">
     <div class="full-left">
       <div class="head-wrap full-left">
        <img src="@/assets/img/head.jpg" alt="" class="full-left">
       </div>
       <div class="full-right text-wrap">
        <span>{{name}}</span>
       </div>
     </div>
     <div class="close-wrap full-right" @click="signOut">
      <svg-icon iconClass="close" className="close"></svg-icon>
     </div>
   </div>
 </div>
</template>

<script>
import { removeToken } from "@/utils/app"
export default {
  // name: "heeder",
  setup(props,{ root }){
    const name = root.$store.state.user.userName
    const switchStatus = () => {
      root.$store.commit("app/switchIsCollapse")
    }
    const signOut = () => {
      if(confirm("即将退出系统")){
        root.$router.push({
          path: "/login"
        })
        root.$store.dispatch("app/signOut")
      } 
    }
    return {
      name,
      switchStatus,signOut
    }
  }
}
</script>

<style lang='scss' scoped>
#header-wrap{
  line-height: 75px;
  .menu-wrap{
    width: 25px;
    height: 25px;
    vertical-align: middle;
    display: inline-block;
  }
  .menu{
    cursor: pointer;
    width: 25px;
    height: 25px;
    margin-bottom: 25px;
  }
  .close{
    cursor: pointer;
    width: 30px;
    height: 30px;
    margin: 22px;
  }
  .head-wrap{
    width: 45px;
    height: 45px;
    border-radius: 50%;
    overflow: hidden;
    margin: 15px 0;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .text-wrap{
    margin: 0 25px;
    font-size: 16px;
    font-weight: 600;
  }
  .close-wrap{
    width: 55px;
    height: 75px;
    border-left: 2px solid #ededed;
  }
}
 
</style>
