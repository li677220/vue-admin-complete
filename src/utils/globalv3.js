import { MessageBox, Message } from 'element-ui';
export function global(){
  const removeTips = (params) => {
    MessageBox.confirm(params.value+', 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      // center: true
    }).then(() => {
      params.fn && params.fn()
    }).catch(() => {
      Message.error('已取消删除');
      params.catchFn && params.catchFn()         
    });
  }
  return{
    removeTips
  }


}