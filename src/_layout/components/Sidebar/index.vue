<template>
  <div :class="{'has-logo':showLogo}" class="sider-container">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <div class="funtion-menu">
      <div><img src="../image/功能菜单.png"></div>
      <div><img src="../image/功能菜单(1).png"></div>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss" scoped>
.funtion-menu{
  display: flex;
  flex-direction: row;
  background-image: url('../image/矩形@2x.png');
  background-size: 1px 100%;
  background-repeat:  repeat-x;
  position: relative;
  width: 100%;
  height: 42px;
  border-right:1px solid #B2CDD2;
  border-bottom:1px solid #B2CDD2;
  >div{
    padding-top: 10px;
    padding-left: 12px;
  }
}

</style>
