<template>
  <div class="navbar">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <div class="left-menu">
      <div class="image"><img src="../components/image/用户 (2).png"></div>
      <!-- <span>当前登录用户：{{ user.user.empName }} - {{ user1.user.empName }}  - {{ empName }}</span> -->
      <span>当前登录用户：{{ user1.user.empNo }}</span>&nbsp;
      <span>用户角色：{{ user1.user.empName }}</span>
    </div>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <ul class="nav">
          <!-- <li><a><img class="image" src="../components/image/应用前台.png"> 应用前台</a></li>
          <li><div class="verticalBar" /></li>
          <li><a><img class="image" src="../components/image/刷新.png"> 刷新缓存</a></li>
          <li><div class="verticalBar" /></li> -->
          <li><a @click="logout"><img class="image" src="../components/image/退出.png"> 退出</a></li>
        </ul>
      </template>

      <!-- <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    // Breadcrumb,
    // Hamburger,
    // ErrorLog,
    // Screenfull,
    // SizeSelect,
    // Search
  },
  computed: {
    user1() {
      return this.$store.state.user
    },
    ...mapState(['user']),
    ...mapGetters([
      'empNo',
      'empName',
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleLogout() {
      this.$store.dispatch('user/logout')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  flex-direction: row;
  height: 50px;
  overflow: hidden;
  position: relative;
  // background:linear-gradient(180deg,rgba(28, 39, 55, 1) 0%,rgba(185,211,223,1) 100%);
  background: rgba(185,211,223,1);
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);50, 66, 95
  // background-image: url('../components/image/矩形@2x(1).png');28, 39, 55
  background-size: 1px 100%;
  background-repeat:  repeat-x;
  padding-top: 4px;
  .left-menu{
    flex:1;
    display: flex;
    flex-direction: row;
    float:left;
    font-size: 12px !important;
    margin-top: 16px;
    margin-left: 15px;
    .image{
      margin-bottom: 1px;
      margin-right: 2px;
    }
    .span{
      margin-right: 12px;
    }
  }
  .right-menu{
    flex:1;
    float: right;
    ul{
      float:right;
    }
    li{
      list-style: none !important;
      float: left !important;
      padding-right:25px;

    }
    /deep/ .image{
      // margin-top: 5px;
      position: relative;
      top: 2px;
    }
  }
  .verticalBar{
      width: 1.5px;
      height: 15px;
      background: #82BCBD;
      margin-top: 2px;
    }
}
</style>
