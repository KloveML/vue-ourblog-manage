<template>
  <el-tree :data="list" :props="defaultProps" accordion :renderContent="renderContent" class="articleList" node-key="id" :default-expanded-keys="[1]" @node-click="handleNodeClick">
  </el-tree>
</template>

<script>
// 日期格式化
/* eslint-disable */
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export default {
  name: 'articelList',
  props: ['pathType'],
  data() {
    return {
      articleList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  computed: {
    list() {
      let data = this.articleList;
      let list = [];
      if (data.typed) {
        // 拼接分类文章列表的内容
        data.list.forEach((dv, di) => {
          const curItem = {};
          const tArr = [];
          if (dv.value.articleList) {
            dv.value.articleList.forEach((dvv, dvi) => {
              if (dvv.status === 'draft') return;
              const curSubItem = {};
              curSubItem.label = dvv;
              curSubItem.label.updateTime = new Date(dvv.updateTime).format('yyyy-MM-dd hh:mm');
              curSubItem.id = Number.parseInt((di + 1) + '' + (dvi + 1), 10);
              tArr.push(curSubItem);
            });
          } else {
            if (dv.value.status === 'draft') return;
            const curSubItem = {};
            curSubItem.label = dv.value;
            curSubItem.label.updateTime = new Date(dv.value.updateTime).format('yyyy-MM-dd hh:mm');
            curSubItem.id = Number.parseInt((di + 1) + '' + 1, 10);
            tArr.push(curSubItem);
          }
          if (tArr.length === 0) return;
          curItem.id = di + 1;
          curItem.label = { typeName: dv._id };
          curItem.children = tArr;
          list.push(curItem);
        });
      } else if (data.typed === false) {
        //拼接近期文章或草稿的内容
        data.list.forEach((dv, di) => {
          const curItem = {};
          curItem.id = (++di);
          curItem.label = dv;
          curItem.label.updateTime = new Date(dv.updateTime).format('yyyy-MM-dd hh:mm');
          list.push(curItem);
        });
      }
      return list;
    }
  },
  watch: {
    pathType(val) {
      this.init(val);
    },
    articleList(val) {
      this.articleList = val;
    }
  },
  methods: {
    handleNodeClick(node) {
      if (!(node.children && node.children.length > 0)) {
        let path = this.$route.path;
        path = path.replace('\/articleEdit','');
        path = /articlePreview/.test(path) ? path + '?articleId=' + node.label._id : path + '/articlePreview?articleId=' + node.label._id;
        this.$router.push(path);
      }
    },
    init(pathType) {
      if (pathType === 'articleList') {
        return this.fetchAllListByTypeName();
      }
      const status = pathType === 'editArticle' ? 'publish' : 'draft';
      this.fetachAllListByStatus(status);
    },
    renderContent(h, { node, data, store }) {
      const articleObj = node.label;
      const title = articleObj.title;
      const time = articleObj.updateTime;
      const typeName = articleObj.typeName;
      const status = articleObj.status;
      let part;
      if (node.childNodes.length === 0) {
        part = (
          <div class="listItem">
            {status === 'draft' ? <h1 class="draft">{title}</h1> : <h1>{title}</h1>}
            <p>{time}{node.level === 2 ? '' : <el-tag class="listItem-tag">{typeName}</el-tag>}</p>
          </div>
        );
      } else {
        part = (
          <span>{typeName}</span>
        );
      }
      return part;
    },
    async fetchAllListByTypeName() {
      const res = await this.$http.get('/v1/article?groupName=typeName');
      const ret = res.body;
      if (ret.code === 0) {
        this.articleList = { typed: true, list: ret.data };
        return;
      }
      return alert('typename:', ret.msg);
    },
    async fetachAllListByStatus(status) {
      const res = await this.$http.get('/v1/article?status=' + status);
      const ret = res.body;
      if (ret.code === 0) {
        this.articleList = { typed: false, list: ret.data };
        return;
      }
      return alert('all:', ret.msg);
    }
  }
}
</script>
<style lang="scss">
@import '../../styles/variables';
.articleList {
  background-color: transparent;
  border: none;
  &>.el-tree-node {
    border-bottom: 1px solid #d1dbe5;
  }
  .el-tree-node {
    height: auto;
  }
  .el-tree-node__content {
    height: auto;
  }
  .listItem {
    display: inline-block;
    width: 90%;
    padding-top: 3px;
    h1 {
      &.draft {
        color: $red;
      }
      font-family: $fontGothic;
      font-weight: 300;
      font-size: 22px;
      overflow:hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p {
      font-size: 14px;
    }
  }
  .listItem-tag {
    float: right;
    position: relative;
    top: 8px;
    right: 5px;
    height: 22px;
    line-height: 20px;
    background: transparent;
    color: $black2;
    border-color: $black2;
  }
}
</style>

