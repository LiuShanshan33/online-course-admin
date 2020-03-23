<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <div class="sidebar-logo">
          <img v-if="logo" :src="logo" class="sidebar-logo">
        </div>
        <div class="sidebar-logo">
          <img v-if="title" :src="title" class="sidebar-title">
        </div>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <img v-if="title" :src="title" class="sidebar-title">
      </router-link>
    </transition>
  </div>
  <!-- <hr align=center width=300 color=#987cb9 SIZE=1></hr> -->
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: require('../image/宸瑞后台管理系统.png'),
      logo: require('../image/logo.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 49px;
  line-height: 49px;
  background-image: url('../image/矩形@2x(1).png');
  background-size: 1px 100%;
  .sidebar-logo-link{
  margin-top: 4px;
  background-image: url('../image/标题背景图@2x.png');
  background-size: 1px 100%;
  border-radius:0px 10px 0px 0px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #C8CED1;
  }
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
