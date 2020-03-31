<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="(tag, index) in visitedViews"
        ref="tag"
        :key="tag.path"
        closable
        :type="tag.type"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        <div class="tags-view-content">
          <span class="index">{{ index+1 }}</span>
          <span class="title">{{ tag.title }}</span>
          <span
            v-if="!isAffix(tag)"
            class="el-icon-close"
            style="color:black"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
          <span v-else class="el-icon-minus" style="height:16px;width:16px;color:rgb(0,0,0,0)" />
        </div>
      </router-link>
    </scroll-pane>
    <div class="pagination">
      <div class="last" @click="scroll(true)">
        <a>
          <img src="../image/左一步@2x.png" width="7px" height="8px">
        </a>
      </div>
      <div class="next" @click="scroll(false)">
        <a>
          <img src="../image/右一步@2x.png" width="7px" height="8px">
        </a>
      </div>
    </div>
    <!-- <div class="hr"></div> -->
    <!-- <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>-->
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import path from 'path'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.permission.routes
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    scroll(isLeft) {
      if (isLeft) {
        this.$refs.scrollPane.scrollWrapper.scrollLeft -= 108
      } else {
        this.$refs.scrollPane.scrollWrapper.scrollLeft += 108
      }
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  display: flex;
  flex-direction: row;
  height: 35px;
  width: 100%;
  background: linear-gradient(
    180deg,
    rgba(216, 230, 237, 1) 0%,
    rgba(246, 249, 251, 1) 100%
  );
  // background: rgba(185,211,223,1);
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  border-bottom: 3px solid #3f5e96;
  .tags-view-wrapper {
    display: flex;
    flex-direction: row;
    margin-right: 51px;
    .tags-view-item {
      flex: 9;
      display: inline-block;
      position: relative;
      cursor: pointer;
      min-width: 60px !important;
      height: 30px !important;
      line-height: 30px;
      color: #333333;
      background: linear-gradient(
        180deg,
        rgba(235, 251, 252, 1) 0%,
        rgba(201, 215, 214, 1) 100%
      );
      box-shadow: 0px -1px 0px 0px rgba(187, 187, 187, 0.5);
      border-radius: 2px 2px 0px 0px;
      border: 1px solid rgba(130, 188, 189, 1);
      padding: 0 6px;
      font-size: 12px;
      margin-left: 3px;
      margin-top: 4px;
      .tags-view-content {
        margin-top: 7px;
        line-height: 7px;
        color: #ffffff;
        .index {
          padding: 1px 3px;
          background: #3f5e96;
        }
        .title {
          color: #333333;
          padding-left: 5px;
        }
      }
      &:first-of-type {
        margin-left: 10px;
        padding-top:2px;
        // bottom: 2px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        // background: linear-gradient(
        //   180deg,
        //   rgba(31, 147, 151, 1) 0%,
        //   rgba(85, 176, 171, 1) 100%
        // );
        // background: linear-gradient(180deg, rgba(69, 120, 201, 1) 0%, rgba(89, 126, 207, 1) 100%);
        background: #3f5e96;
        border-radius: 2px 2px 0px 0px;
        border: 1px solid rgba(16, 99, 123, 1);
        color: #fff;
        border-color: #3f5e96;
        .tags-view-content {
          color: #333333;
          .index {
            background: #9bbfc0;
          }
          .title,
          .el-icon-close {
            color: #ffffff;
          }
        }
      }
    }
  }
  .pagination {
    display: flex;
    flex-direction: row;
    float: right;
    width: 42px;
    height: 20px;
    position: relative;
    top: 7px;
    right: 17px;
    background: linear-gradient(
      180deg,
      rgba(241, 246, 249, 1) 0%,
      rgba(214, 224, 229, 1) 54%,
      rgba(236, 241, 243, 1) 100%
    );
    border-radius: 2px;
    border: 1px solid rgba(130, 188, 189, 1);
    .last,
    .next {
      flex: 1;
      img {
        position: relative;
        top: 2px;
        left: 6px;
      }
    }
    .last {
      border-right: 1px solid #82bcbd;
    }
  }
  .hr {
    width: 100%;
    height: 3px;
    background-color: #3f5e96;
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

