<template>
  <div class="emptyContainer">
    <div class="emptyContent">
      <i class="iconfont icon-chakan"></i>
      <h2>请选择文章进行阅读。</h2>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'emptyContent'
  };
</script>

<style lang="scss">
  @import '../../styles/variables.scss';
  .emptyContainer{
    position: relative;
    width:100%;
    height:100%;
    .emptyContent{
      position:absolute;
      width:100%;
      top:50%;
      transform: translate(0,-50%);
      text-align: center;
      .icon-chakan{
        font-size:150px;
        position:relative;
        left:-11px;
      }
      h2{
        padding-top:10px;
        font-weight: 300;
        font-size:22px;
        font-family: $fontYaHei;
      }
    }
  }
</style>

