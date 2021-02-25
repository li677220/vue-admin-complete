import Vue from "vue"
import svg from "./svg-icon.vue"

Vue.component('svg-icon',svg)

/***
 * 读取目录的所有文件
 * 1、目录
 * 2、是否遍历子级目录
 * 3、遍历文件规则
 */
const req = require.context("./svg",false,/\.svg$/)
const requireAll = requireContext => {
  // console.log(requireContext.keys()); //["./console.svg", "./message.svg", "./user.svg"]
  // console.log(requireContext.keys().map(requireContext)); //["/img/console.a257e16e.svg", "/img/message.87ad0fbb.svg", "/img/user.2b53fd98.svg"]
  return requireContext.keys().map(requireContext)
}
requireAll(req)
