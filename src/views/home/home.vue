<template>
  <div class="app-container">
    <div class="wrapper-1">
      <p class="text">欢迎光临！</p>
      <span class="date-text">今天是{{ nowDate + ' ，'+ nowWeek + ' 。' }}祝您工作愉快！</span>

    </div>
    <div class="sysInfo">
      <div class="unit">
        <div class="sysUp">
          <span class="uptext">操作系统信息</span>
        </div>
        <div class="hr" />
        <div class="sysDown">
          <span><label class="sysTitle">操 作 系 统</label><div class="sysValue"><span class="span-ellipsis" :title="info['os.name']">{{ info['os.name'] }}</span></div></span>
          <span><label class="sysTitle">操作系统版本</label><div class="sysValue"><span class="span-ellipsis" :title="info['os.version']">{{ info['os.version'] }}</span></div></span>
          <span><label class="sysTitle">操作系统用户</label><div class="sysValue"><span class="span-ellipsis" :title="info['user.name']">{{ info['user.name'] }}</span></div></span>
          <span><label class="sysTitle">操作系统时区</label><div class="sysValue"><span class="span-ellipsis" :title="info['user.timezone']">{{ info['user.timezone'] }}</span></div></span>
          <span><label class="sysTitle">文 件 编 码</label><div class="sysValue"><span class="span-ellipsis" :title="info['file.encoding']">{{ info['file.encoding'] }}</span></div></span>
        </div>
      </div>
      <div class="unit">
        <div class="sysUp">
          <span class="uptext">JAVA相关信息</span>
        </div>
        <div class="hr" />
        <div class="sysDown">
          <span><label class="sysTitle" style="letter-spacing: 2px">JRE名称</label><div class="sysValue"><span class="span-ellipsis" :title="info['java.runtime.name']">{{ info['java.runtime.name'] }}</span></div></span>
          <span><label class="sysTitle" style="letter-spacing: 2px">JRE版本</label><div class="sysValue"><span class="span-ellipsis" :title="info['java.runtime.version']">{{ info['java.runtime.version'] }}</span></div></span>
          <span><label class="sysTitle" style="letter-spacing: 2px">JVM名称</label><div class="sysValue"><span class="span-ellipsis" :title="info['java.vm.name']">{{ info['java.vm.name'] }}</span></div></span>
          <span><label class="sysTitle" style="letter-spacing: 2px">JVM版本</label><div class="sysValue"><span class="span-ellipsis" :title="info['java.vm.version']">{{ info['java.vm.version'] }}</span></div></span>
        </div>
      </div>
      <div class="unit">
        <div class="sysUp">
          <span class="uptext">其他信息</span>
        </div>
        <div class="hr" />
        <div class="sysDown">
          <span><label class="sysTitle">用 户 目 录</label><div class="sysValue"><span class="span-ellipsis" :title="info['user.home']">{{ info['user.home'] }}</span></div></span>
          <span><label class="sysTitle">工 作 目 录</label><div class="sysValue"><span class="span-ellipsis" :title="info['user.dir']">{{ info['user.dir'] }}</span></div></span>
          <span><label class="sysTitle">临时文件目录</label><div class="sysValue"><span class="span-ellipsis" :title="info['java.io.tmpdir']">{{ info['java.io.tmpdir'] }}</span></div></span>
          <span><label class="sysTitle" style="letter-spacing: 3px">文件分隔符</label><div class="sysValue"><span class="span-ellipsis" :title="info['file.separator']">{{ info['file.separator'] }}</span></div></span>
        </div>
      </div>
    </div>
    <div class="wrapper-2">
      <div class="up-part">
        <span class="text">管理员选项</span>
        <el-button style="float:right;padding-top:0px;margin-right:20px" type="text" size="mini" @click="editHome">
          编辑工作台
        </el-button>
        <div class="hr" />
      </div>
      <el-scrollbar style="width:100%">
        <div class="down-part">
          <div v-for="moudle in options"
               :key="moudle.id" class="box">
              <a class="h">
                <div class="box-1">
                  <div class="image">
                    <img :src="data[moudle.name]"/>
                  </div>
                  <div class="caption">
                    <span>{{moudle.name}}</span>
                  </div>
                </div>
              </a>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import { getMoudleOptions } from '@/api/moudle'
  import { systemInfo } from '@/api/system'
  import { json } from '@/json/moudle.js'
  import draggable from 'vuedraggable'
// import { version } from 'punycode'
export default {
  name: 'Working',
  components: {draggable},
  data() {
    return {
      nowDate: '', // 当前日期
      nowTime: '', // 当前时间
      nowWeek: '', // 当前星期
      info: '',
      options: [],
      empNo: this.$store.state.user.user.empNo,
      data: json
    }
  },
  created () {
    this.getList()
  },
  mounted() {
    systemInfo().then(res => { this.info = res.data })
    this.currentTime()
  },
  // 销毁定时器
  beforeDestroy: function() {
    if (this.getDate) {
      console.log('销毁定时器')
      clearInterval(this.getDate) // 在Vue实例销毁前，清除时间定时器
    }
  },
  methods: {
    async getList() {
      await getMoudleOptions(this.empNo).then( response => {
        this.options = response.data.options
      })
      console.log("获取json文件的数据", this.data)
      console.log("获取排序的选项", this.options)
    },
    currentTime() {
      setInterval(this.getDate, 500)
    },
    getDate: function() {
      var _this = this
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const week = new Date().getDay()
      const hh = new Date().getHours()
      const mf =
                new Date().getMinutes() < 10
                  ? '0' + new Date().getMinutes()
                  : new Date().getMinutes()
      if (week === 1) {
        this.nowWeek = '星期一'
      } else if (week === 2) {
        this.nowWeek = '星期二'
      } else if (week === 3) {
        this.nowWeek = '星期三'
      } else if (week === 4) {
        this.nowWeek = '星期四'
      } else if (week === 5) {
        this.nowWeek = '星期五'
      } else if (week === 6) {
        this.nowWeek = '星期六'
      } else {
        this.nowWeek = '星期日'
      }
      _this.nowTime = hh + ':' + mf// 时间
      _this.nowDate = yy + '年' + mm + '月' + dd + '日'
    },
    editHome() {
      this.$router.push({
        path: '../Home/editing-home',
        name: 'EditingHome'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
    display: flex;
    flex-direction: column;
    height: 100%;
    margin:10px;
    font-size:15px;
    font-weight:800;
    color:rgba(51,51,51,1);

    .wrapper-1{
        //display: flex;
        // flex:1;
        min-height:80px;
        background:rgba(255,246,191,1);
        // box-shadow:0px 2px 0px 0px rgba(255,255,255,1) inset;
        border-radius:4px;
        border:1px solid rgba(254,224,111,1);
        margin-bottom:20px;
        .text{
            padding-left:14px;
            font-size: 15px;
            font-weight:900;
            color:rgba(51,51,51,1);
            height: 15px;
            display: block;
        }
        .date-text{
            font-size: 12px;
            padding-left:14px;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:17px;
        }
    }
    .sysInfo{
      display: flex;
      flex-direction: row;//项目排列方向
      justify-content: space-around;
      margin-bottom: 20px;
      .unit{
        width:260px;
        height:169px;
        display: flex;
        flex-direction: column;
        flex: 1;
        background:rgba(249,249,249,1);
        border:1px solid rgba(203,203,203,1);
        border-radius:4px;
        padding: 5px 10px;
        position: relative;
        margin-right: 20px;
        &:nth-of-type(1){
          margin-left:0px;
        }
        &:nth-of-type(3){
          margin-right:0px;
        }
        .sysUp{
          flex: 1;
           margin: 13px auto 5px 10px;
           .uptext{
             width: auto;
              font-size:15px;
              // font-family:STSongti-SC-Black;
              line-height:0px;
              color:rgba(51,51,51,1);
              // letter-spacing:10px;
              opacity:1;
           }
        }
         .hr{
              width:95%;
              height:1px;
              background-color: #EEEEEE;
              margin: 5px 20px 5px 10px;
            }
        .sysDown{
          flex: 9;
           span{
              display: block;
              padding: 0px 2px 5px 10px;
              position: relative;
              height:20px;
              font-size:12px;
              // font-family:STSongti-SC-Regular;
              line-height:16px;
              color:rgba(102,102,102,1);
              .sysTitle{
                position: absolute;
                width: 80px;
                text-align: justify;
                text-align-last: justify;
              }
              .sysTitle:after{
                display: inline-block;
                content: ' ';
                width: 100%;
                height: 0;
              }
              .sysTitle:before{
                position: absolute;
                left: 82px;
                content: ':';
              }
              .sysValue{
                letter-spacing:0px;
                padding-left: 90px;
              }
              .span-ellipsis {
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              }
            }
        }
      }
    }
    .wrapper-2{
        display: flex;
        flex-direction: column;
        // justify-content: space-around;
        // height:390px;
        // top:0;
        background:rgba(249,249,249,1);
        border-radius:4px;
        border:1px solid rgba(203,203,203,1);
        .up-part{
            flex:1;
            margin:20px;
            .hr{
              width:1147spx;
              height:1px;
              background-color: #EEEEEE;
              margin-top: 10px;
            }
        }
        .down-part{
            flex:9;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            .box{
                display: flex;
                width:140px;
                height:140px;
                background:rgba(255,255,255,1);
                position: relative;
                margin-left:33px;
                margin-bottom: 20px;
                /*&:nth-of-type(11){
                  margin-right:100px;
                }*/
                .box-1{
                  display: flex;
                  flex-direction: column;
                  align-content: center;
                  width:128px;
                  height:128px;
                  background:rgba(243,243,243,1);
                  position:absolute;
                  align-content: center;
                  border-radius:3px;
                  border:1px solid rgba(214,218,221,1);
                  margin-left: 6px;
                  margin-top: 6px;
                  .image{
                      margin-left: 28px;
                      margin-top: 16px;
                  }
                  .caption{
                    flex:1;
                    font-size:12px;
                    // font-family:STSongti-SC-Regular,STSongti-SC;
                    font-weight:400;
                    text-align: center;
                    color:rgba(51,51,51,1);
                    margin-top: 10px;
                  }
                }
            }
        }

    }
}
</style>
