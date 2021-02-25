<template>
   <svg :class="svgClass" :aria-hidden="true">
     <use :xlink:href="iconName"></use>
   </svg>
</template>

<script>
import { computed, ref } from "@vue/composition-api"
export default {
  name: "svgIcon",
  // props: ["iconClass", "className"],
  props:{
    iconClass: {
      type: String,   //String、Number、Boolean、Array、Object、Date、Function、Symbol
      default: "", //基本数据类型：直接赋值；  对象：用函数赋值() => {};
      // required: true    //是否必填
      // validator: value => value   //校验规则
    },
    className: {
      type: String,
      default: ""
    }
  },
  setup(props,{root}) {
    const iconName = computed(() => `#icon-${props.iconClass}`)
    const svgClass = computed(() => {
      if(props.className){
        return `svg-icon ${props.className}`
      }else{
        return `svg-icon`
      }
    })
    return{
      svgClass,iconName
    }
  }
}
</script>
<style lang="scss" scoped>
.svg-icon{
  width: 1em;
  height: 1em;
  fill: currentColor;
  color: #000;
  font-size: 18px;
  // margin-right: 20px;
}
</style>
