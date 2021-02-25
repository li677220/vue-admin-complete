<template>
 <div>
   <layoutHeader></layoutHeader>
   <layoutMain></layoutMain>
   <layoutSide></layoutSide>
 </div>
</template>

<script>
import {layoutHeader,layoutMain,layoutSide} from './Components';

export default {
  name: "layout",
  components: { layoutHeader, layoutMain, layoutSide },
  setup(props,{ root }){
  }
}
</script>

<style lang="scss" scoped>

 
</style>
