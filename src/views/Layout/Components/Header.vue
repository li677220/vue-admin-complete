<template>
 <div id="header-wrap">
   Header
 </div>
</template>

<script>
export default {
  name: "Header",
  setup(props,{root}){

  },
}
</script>

<style lang="scss" scoped>
#header-wrap{
  position: fixed;
  top: 0;
  left: 250px;
  width: 100%;
  height: 75px;
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, .1px);
  background-color: #B3C0D1;
}
 
</style>
