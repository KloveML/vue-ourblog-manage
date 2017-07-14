<template>
  <div id="home">
    <el-row class="home-navHeader">
      <el-col :span="4">
        <div class="logo">KK&CL</div>
      </el-col>
      <el-col :span="16"></el-col>
      <el-col :span="4">
        <el-dropdown class="userContainer">
          <el-button type="primary">
            <i class="iconfont icon-daxiao"></i>
            <span class="user" v-text="user"></span>
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row class="home-mainBody">
      <el-col :span="4" class="leftNav">
        <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" :router="true">
          <el-menu-item index="list" :route="{path:'/admin/articleList'}">
            <i class="iconfont icon-liebiao"></i>文章列表</el-menu-item>
          <el-menu-item index="edit" :route="{path:'/admin/editArticle/articleEdit'}">
            <i class="iconfont icon-bianji"></i>写文章</el-menu-item>
          <el-menu-item index="draft" :route="{path:'/admin/draftList'}">
            <i class="iconfont icon-text"></i>草稿</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="5" class="articleContainer">
        <articleList  :pathType="pathType"></articleList>
      </el-col>
      <el-col :span="12" class="contentContainer">
        <keep-alive>
          <router-view @rPathType="rerenderPathType"></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import articleList from '../../components/common/articleList';

export default {
  name: 'home',
  data() {
    const user = window.sessionStorage.getItem('adminer');
    return {
      pathParams: 'articleList',
      user,
      articleList: null,
      pathType: ''
    };
  },
  computed: {
    activeIndex() {
      switch (this.pathParams) {
        case 'articleList':
          return 'list';
        case 'editArticle':
          return 'edit';
        default:
          return 'draft';
      }
    }
  },
  components: {
    articleList
  },
  mounted() {
    this.pathParams = this.pathType = this.$route.params.id;
  },
  watch: {
    $route(to, from) {
      const params = to.params.id;
      this.pathType = params;
    }
  },
  methods: {
    loginOut() {
      const adminer = window.sessionStorage.getItem('adminer');
      if (adminer) {
        window.sessionStorage.removeItem('adminer');
        this.$router.push('/login');
      }
    },
    rerenderPathType() {
      const pathType = this.pathType;
      this.pathType = '';
      this.$nextTick(function() {
        this.pathType = pathType;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../styles/variables.scss';

/* 导航头样式  */
.home-navHeader {
  min-width:1280px;
  width:100%;
  position:fixed;
  padding: 10px;
  background-color:rgba(0, 0, 0, 0.25);
  .el-col {
    height: 50px;
  }
  .logo {
    line-height: 53px;
    font-size: 45px;
    padding-left: 40px;
    color: $white;
    font-family: $fontOstrichSans;
    font-weight: 400;
  }
  .userContainer {
    float: right;
    box-sizing: border-box;
    width: 114px;
    height: 50px;
    color: $white;
    text-align: center; // padding: 10px 15px;
    cursor: pointer;
    line-height: 50px;
    &:hover {
      background: rgba(0, 0, 0, .1);
    }
    .icon-daxiao {
      position: relative;
      top: 1px;
      margin-right: 5px;
    }
    .user {
      width: 56px;
      display: inline-block;
    }
    .el-button--primary {
      width: 100%;
      background: transparent;
      border-color: transparent;
      padding-left: 10px;
      .el-icon--right {
        font-size: 10px;
        transform: scale(.7);
        position: relative;
        left: -6px;
      }
    }
  }
}
.el-dropdown-menu {
  width: 158px;
  font-size: 14px;
  border-radius: 3px;
}
.el-dropdown-menu__item {
  line-height: 26px;
  text-align: center;
  &:hover {
    background: rgba(0, 0, 0, 0.65);
    color: $white;
  }
}

/* 左导航样式 */
.home-mainBody{
  min-width:1280px;
  position:fixed;
  top:71px;
  left:0;
  right:0;
  bottom:0;
  border-top:1px solid rgba(255,255,255, 0.2);
  .leftNav{
    height:100%;
    border-right:1px solid rgba(255,255,255, 0.2);
    background-color:rgba(0, 0, 0, 0.20);
    .el-menu{
      background: transparent;
    }
    .el-menu-item{
      border-bottom:1px solid rgba(255,255,255, 0.1);
      color:$white;
      &.is-active{
        background: rgba(0, 0, 0, 0.30);
      }
      &:hover{
        background: rgba(0, 0, 0, 0.30);
      }
      .iconfont{
        position:relative;
        top:1px;
        margin-right:16px;
      }
    }
  }
  .articleContainer{
    height: 100%;
    background: $readBg;
    border-right: 1px solid #d1dbe5;
  }
  .contentContainer{
    height: 100%;
    background: $readBg;
    padding:20px;
    position: relative;
  }
}

</style>

