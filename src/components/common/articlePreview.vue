<template>
  <div class="articlePreview" v-if="list.length>0">
    <div v-for="(item,index) in list" :key="index">
      <h1 class="title">{{item.title}}</h1>
      <div class="contentWrap">
        <div class="content" v-marked>{{item.articleContent}}</div>
      </div>
      <el-button type="primary" :plain="true" icon="edit" class="modify edit" @click="editById">修改文章</el-button>
      <el-button type="primary" :plain="true" icon="delete" class="modify delete" @click="deleteById">删除文章</el-button>
    </div>
  </div>
</template>

<script>
import marked from 'marked';
import hl from 'highlight.js';
import '../../styles/atom-one-light.css';

export default {
  name: 'articlePreview',
  data() {
    return {
      list: []
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    async fetchData() {
      const articleId = this.$route.query.articleId;
      if (articleId) {
        this.list = [];
        const res = await this.$http.get('/v1/article?articleId=' + articleId);
        const ret = res.body;
        if (ret.code === 0) {
          this.list = ret.data;
          return;
        }
        return alert('fetch:', ret.msg);
      }
    },
    editById() {
      const editPath = this.$route.fullPath.replace(/articlePreview/, 'articleEdit');
      this.$router.push(editPath);
    },
    async deleteById() {
      const articleId = this.$route.query.articleId;
      const res = await this.$http.delete('/v1/article?articleId=' + articleId);
      const ret = res.body;
      alert('delete:', ret.msg);
      if (ret.code === 0) {
        this.$emit('rPathType');
      }
    }
  },
  mounted() {
    // 初始化marked
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: function (code) {
        return hl.highlightAuto(code).value;
      }
    });
  },
  directives: {
    marked: {
      bind(el) {
        el.innerHTML = marked(el.innerText);
      }
    }
  }
};
</script>
<style lang="scss">
@import '../../styles/variables.scss';
.articlePreview {
  .title {
    font-size: 28px;
    font-family: $fontApple;
    font-weight: 300;
    padding-bottom: 25px;
    padding-right: 120px;
    border-bottom: 1px solid #d1dbe5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .contentWrap {
    position: absolute;
    top: 83px;
    bottom: 0;
    right: 0;
    left: 0;
    .content {
      padding: 15px 20px 20px;
      font-size: 16px;
      max-height: 96%;
      overflow: auto;
      pre {
        background: rgb(232, 232, 232);
        padding: 5px 7px;
      }
      code {
        font-size: 14px;
      }
    }
  }
  .modify {
    position: absolute;
    top: 20px;
    &.edit {
      right: 145px;
      &:hover {
        background: $black2;
        border-color: transparent;
        color: $readBg;
        .el-icon-edit {
          color: $readBg;
        }
      }
    }
    &.delete {
      right: 20px;
      &:hover {
        background: $red;
        border-color: transparent;
        color: $readBg;
        .el-icon-delete {
          color: $readBg;
        }
      }
    }
  }
}
</style>
