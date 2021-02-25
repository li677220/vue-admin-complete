<template>
 <div  id="side-wrap">
   ASide
 </div>
</template>

<script>
export default {
  name: "Side",
  setup(props,{root}){

  },
}
</script>

<style lang="scss" scoped>
#side-wrap{
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background-color:  #D3DCE6;
  z-index: 9;
}
 
</style>
