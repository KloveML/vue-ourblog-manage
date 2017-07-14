<template>
  <div class="articleEdit">
    <el-input v-model="article.title" class="title" placeholder="请输入标题"></el-input>
    <div class="tag">
      <el-input v-model="article.typeName" placeholder="请输入类名">
        <template slot="prepend">类名</template>
      </el-input>
      <div class="buttonContainer">
        <el-button class="publish" @click="putArticle('publish')">
          <i class="iconfont icon-huanj-01"></i>发布文章</el-button>
        <el-button class="saveDraft" @click="putArticle('draft')">
          <i class="iconfont icon-baocun"></i>保存草稿</el-button>
      </div>
    </div>
    <textarea id="editor"></textarea>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde';
import '../../styles/simplemde.min.css';
import hl from 'highlight.js';
import marked from 'marked';

export default {
  name: 'articleEdit',
  data() {
    return {
      article: {
        title: '',
        typeName: '',
        articleContent: ''
      },
      smde: ''
    };
  },
  mounted() {
    let smde = new SimpleMDE({
      element: document.getElementById('editor'),
      autofocus: true,
      autosave: true,
      previewRender(plainText) {
        return marked(plainText, {
          renderer: new marked.Renderer(),
          gfm: true,
          pedantic: false,
          sanitize: false,
          tables: true,
          breaks: true,
          smartLists: true,
          smartypants: true,
          highlight: function (code) {
            return hl.highlightAuto(code).value;
          }
        });
      }
    });
    // 这里把smde存到data中来共享
    this.smde = smde;
    // 当编辑时利用文本改变把内容存到content中，这样让发布/保存能获取转义后的marked内容
    smde.codemirror.on('change', () => {
      const value = smde.value();
      this.article.articleContent = value;
    });
    //
    this.fetchData(smde);
  },
  activated() {
    this.article = {
      title: '',
      typeName: '',
      articleContent: ''
    };
    this.smde.value('');
    this.$nextTick(function() {
      this.fetchData(this.smde);
    });
  },
  methods: {
    async fetchData(smde) {
      const articleId = this.$route.query.articleId;
      if (articleId) {
        const res = await this.$http.get('/v1/article?articleId=' + articleId);
        const ret = res.body;
        if (ret.code === 0) {
          this.article = ret.data[0];
          smde.value(ret.data[0].articleContent);
          return;
        }
        return alert('edit:', ret.msg);
      }
    },
    async putArticle(status) {
      const article = this.article;
      const articleId = this.$route.query.articleId;
      article.updateTime = new Date();
      article.status = status;
      // 信息验证
      if (article.title === '') {
        return alert('请填写文章标题！');
      }
      if (article.typeName === '') {
        return alert('请填写文章类名！');
      }
      if (article.articleContent === '') {
        return alert('请填写文章内容！');
      }
      if (articleId) {
        // 更新文章内容
        const res = await this.$http.put('/v1/article?articleId=' + articleId, { article });
        const ret = res.body;
        // 如果是保存=>停留在当前页
        // 如果是发布
        // 1.文章列表=>预览
        // 2.写文章=>写文章
        // 3.草稿=>写草稿
        const fPath = this.$route.fullPath;
        const env = fPath.includes('draftList') ? 'draft' : (fPath.includes('articleList') ? 'article' : 'edit');
        if (res.ok && ret.code === 0) {
          if (status === 'draft') return alert('保存成功，赞！');
          if (env === 'article') {
            const previewPath = fPath.replace('articleEdit', 'articlePreview');
            alert('preview:', ret.msg);
            return this.$router.replace(previewPath);
          } else if (env === 'draft') {
            const emptyPath = fPath.slice(0, fPath.indexOf('/articleEdit'));
            alert('文章发表成功');
            this.$emit('rPathType');
            this.$nextTick(function () {
              this.$router.push(emptyPath);
            });
          }
        } else {
          alert('putArticle:', ret.msg);
        }
      } else {
        // 添加文章内容
        article.author = window.sessionStorage.getItem('adminer');
        const res = await this.$http.post('/v1/article', { article });
        const ret = res.body;
        if (res.ok && ret.code === 0) {
          if (status === 'draft') return alert('保存成功，赞！');
          this.article = {
            title: '',
            typeName: '',
            articleContent: ''
          };
          this.smde.value('');
          this.$emit('rPathType');
          alert('发表成功,赞！');
        } else {
          alert('add:', ret.msg);
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import '../../styles/variables.scss';
.articleEdit {
  .el-input__inner {
    &:focus {
      border-color: $bodyBg;
    }
  }
  .tag {
    margin-top: 20px;
    .el-input {
      width: 300px;
    }
    .buttonContainer {
      float: right;
    }
    .el-button {
      padding: 9px 15px;
      .iconfont {
        position: relative;
        top: 1px;
        left: -3px;
      }
      &:hover {
        color: $readBg;
        border-color: transparent;
      }
      &.publish {
        &:hover {
          background: $green1;
        }
      }
      &.saveDraft {
        &:hover {
          background: $blue;
        }
      }
    }
  }
  .editor-toolbar {
    margin-top: 20px;
  }
  .CodeMirror-fullscreen {
    top: 70px;
  }
}
</style>

