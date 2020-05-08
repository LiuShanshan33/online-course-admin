<template>
  <div class="app-container">
    <!-- <div class="wrapper-1">
      <p class="text">欢迎光临！</p>
      <span class="date-text">今天是{{ nowDate + ' ，'+ nowWeek + ' 。' }}祝您工作愉快！</span>
    </div>-->
    <div class="up-flex">
      <div class="unit-left">
        <div class="sysUp">
          <span class="uptext">系统信息</span>
        </div>
        <div class="sysDown">
          <span>
            <label class="sysTitle">操 作 系 统</label>
            <div class="sysValue">
              <span class="span-ellipsis" :title="info['os.name']">{{ info['os.name'] }}</span>
            </div>
          </span>
          <span>
            <label class="sysTitle">操作系统版本</label>
            <div class="sysValue">
              <span class="span-ellipsis" :title="info['os.version']">{{ info['os.version'] }}</span>
            </div>
          </span>
          <span>
            <label class="sysTitle">操作系统用户</label>
            <div class="sysValue">
              <span class="span-ellipsis" :title="info['user.name']">{{ info['user.name'] }}</span>
            </div>
          </span>
          <span>
            <label class="sysTitle">操作系统时区</label>
            <div class="sysValue">
              <span class="span-ellipsis" :title="info['user.timezone']">{{ info['user.timezone'] }}</span>
            </div>
          </span>
          <span>
            <label class="sysTitle">文 件 编 码</label>
            <div class="sysValue">
              <span class="span-ellipsis" :title="info['file.encoding']">{{ info['file.encoding'] }}</span>
            </div>
          </span>
        </div>
      </div>
      <div class="unit-right">
        <div class="countsInfo">
          <div class="count-icon">
            <img src="../home/components/image/课件.png" width="30px">
          </div>
          <div class="icon-text">
            <span class="counts">{{ coursewareCount }}</span>
            <span class="count-text">系统总课件数</span>
          </div>
        </div>
        <div class="countsInfo">
          <div class="count-icon">
            <img src="../images/文件夹@2x.png" width="30px">
          </div>
          <div class="icon-text">
            <span class="counts">{{ coursewareCount }}</span>
            <span class="count-text">系统总课程数</span>
          </div>
        </div>
        <div class="countsInfo">
          <div class="count-icon">
            <img src="../images/文件夹@2x.png" width="30px">
          </div>
          <div class="icon-text">
            <span class="counts">{{ coursewareCount }}</span>
            <span class="count-text">教师用户数量</span>
          </div>
        </div>
        <div class="countsInfo">
          <div class="count-icon">
            <img src="../images/文件夹@2x.png" width="30px">
          </div>
          <div class="icon-text">
            <span class="counts">{{ coursewareCount }}</span>
            <span class="count-text">学生用户数量</span>
          </div>
        </div>
      </div>
      <!-- <div class="unit">
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
      </div>-->
    </div>

    <div class="down-flex">
      <div class="block">
        <span class="left-title">常用功能</span>
        <div class="used-function">
          <div class="functions">课件上传</div>
          <div class="functions">课件上传</div>
          <div class="functions">修改密码</div>
          <div class="add-functions">
            <img src="../home/components/image/添加.png" width="40px">
          </div>
        </div>
      </div>
      <div class="block">
        <div class="dateHeader">
          <p class="text">{{ nowYear }}</p>
          <span class="date-text">{{ nowDate + ' '+ nowWeek }}</span>
        </div>
        <Calendar :sunday-start="true" />
      </div>
      <div class="block">
        <span class="left-title">最新公告</span>
        <div class="hr-dashed" />
        <p class="announcement-title">{{ announcementTitle }}</p>
        <p>&nbsp; 各位亲爱的教师用户：</p>
        <p class="announcement-content">&nbsp; {{ content }}</p>
        <a class="more">查看更多>></a>
      </div>
    </div>
  </div>
</template>

<script>
import { getMoudleOptions } from '@/api/moudle'
import { systemInfo } from '@/api/system'
import { json } from '@/json/moudle.js'
import draggable from 'vuedraggable'
import Calendar from 'vue-calendar-component'
// import { version } from 'punycode'
export default {
  // name: 'Working',
  components: {
    draggable,
    Calendar
  },
  data() {
    return {
      value: new Date(),
      nowDate: '', // 当前日期
      nowTime: '', // 当前时间
      nowWeek: '', // 当前星期
      nowYear: '', // 当前年份
      info: {
        'os.name': 1111111,
        'os.version': 222222,
        'user.name': 333333,
        'user.timezone': 332211,
        'file.encoding': 123123
      },
      coursewareCount: '1580', // 系统总课件数
      announcementTitle: '服务暂停通知', // 公告标题
      content: '根据近期各位老师对于课件上传功能的意见反馈，我们决定于5月1日0:00 - 24:00对此模块进行更新维护，维护期间此功能暂停开放，请需要上传课件的老师于5月2日登录系统进行上传，感谢各位的理解与合作。',
      options: [],
      // empNo: this.$store.state.user.user.empNo,
      data: json

    }
  },
  created() {
    // this.getList()
    this.getDate()
  },
  mounted() {
    // systemInfo().then(res => { this.info = res.data })
    this.currentTime()
  },
  // // 销毁定时器
  // beforeDestroy: function() {
  //   if (this.getDate) {
  //     console.log('销毁定时器')
  //     clearInterval(this.getDate) // 在Vue实例销毁前，清除时间定时器
  //   }
  // },
  methods: {
    // async getList() {
    //   await getMoudleOptions(this.empNo).then(response => {
    //     this.options = response.data.options
    //   })
    //   console.log("获取json文件的数据", this.data)
    //   console.log("获取排序的选项", this.options)
    // },
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
      _this.nowDate = mm + '月' + dd + '日' // 日期
      _this.nowYear = yy
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
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 5px 10px;
  font-size: 15px;
  font-weight: 800;
  color: rgba(51, 51, 51, 1);
  .up-flex {
    display: flex;
    flex: 1;
    flex-direction: row; //项目排列方向
    justify-content: space-around;
    margin-bottom: 20px;
    .unit-left {
      display: flex;
      flex-direction: column;
      flex: 1;
      background: rgba(249, 249, 249, 1);
      box-shadow: -2px 2px 5px rgb(202, 202, 202);
      padding: 5px 10px;
      position: relative;
      margin-right: 20px;
      .sysUp {
        flex: 1;
        margin: 13px auto 5px 10px;
        .uptext {
          width: auto;
          font-size: 15px;
          border-left: 2px solid #32425f;
          // font-family:STSongti-SC-Black;
          padding-left: 5px;
          color: #1c2737;
          // letter-spacing:10px;
          opacity: 1;
        }
      }
      // 信息下面
      .sysDown {
        flex: 8;
        margin-top: 5px;
        span {
          display: block;
          padding: 0px 2px 5px 10px;
          position: relative;
          height: 20px;
          font-size: 12px;
          // font-family:STSongti-SC-Regular;
          line-height: 16px;
          color: rgba(102, 102, 102, 1);
          .sysTitle {
            position: absolute;
            width: 80px;
            text-align: justify;
            text-align-last: justify;
          }
          .sysTitle:after {
            display: inline-block;
            content: " ";
            width: 100%;
            height: 0;
          }
          .sysTitle:before {
            position: absolute;
            left: 82px;
            content: ":";
          }
          .sysValue {
            letter-spacing: 0px;
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
    // 上面右边
    .unit-right {
      display: flex;
      flex: 2;
      flex-direction: row; //项目排列方向
      justify-content: space-around;
      flex-wrap: wrap;
      margin-bottom: 20px;
      flex: 1;
      padding: 5px 10px;
      position: relative;
      margin-right: 0px;
      // 右边课件信息数据
      .countsInfo {
        // display: flex;
        // flex: 1;
        width: 220px;
        height: 50px;
        background: rgba(249, 249, 249, 1);
        box-shadow: -2px 2px 5px rgb(202, 202, 202);
        position: relative;
        margin-top: 15px;
        margin-right: 30px;
        .count-icon {
          display: inline-block;
          background: #fcd12c;
          padding: 8px;
        }
        .icon-text {
          display: inline-block;
          width: 140px;
          .counts {
            width: 100%;
            text-align: center;
            font-size: 20px;
            color: #000;
            line-height: 20px;
            display: inline-block;
          }
          .count-text {
            width: 100%;
            text-align: center;
            font-size: 13px;
            margin: 2px auto;
            color: rgb(109, 109, 109);
            display: inline-block;
          }
        }
      }
    }
  }
  .down-flex {
    display: flex;
    flex: 1;
    height: 100%;
    flex-direction: row; //项目排列方向
    justify-content: space-around;
    // background:rgba(249,249,249,1);
    margin-bottom: 20px;
    .block {
      width: 260px;
      display: flex;
      flex-direction: column;
      flex: 1;
      margin-right: 20px;
      background: rgba(249, 249, 249, 1);
      box-shadow: -2px 2px 5px rgb(202, 202, 202);
      .left-title {
        margin: 15px 20px;
        width: auto;
        font-size: 15px;
        border-left: 2px solid #32425f;
        padding-left: 5px;
        color: #1c2737;
      }
      .used-function {
        display: flex;
        flex-direction: row; //项目排列方向
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-left: 10px;
        .functions {
          text-align: center; // 水平对齐
          width: 90px;
          height: 60px;
          border-radius: 5px;
          line-height: 60px;
          margin: 10px;
          background: #57c8f2;
          color: #ffffff;
        }
        .add-functions {
          text-align: center; // 水平对齐
          width: 90px;
          height: 60px;
          border-radius: 5px;
          line-height: 60px;
          margin: 10px;
          padding: 10px;
          background: #cdf0ff;
        }
      }

      .dateHeader {
        .text {
          font-size: 20px;
          line-height: 20px;
          margin: 0px 0px 5px 0px !important;
        }
        padding: 10px;
        width: 100%;
        background: #f4776f;
        color: #ffffff;
      }
      .hr-dashed {
        width: 90%;
        margin: 0 auto;
        height: 1px;
        border: 1px dashed #1c2737;
      }
      .announcement-title {
        margin-bottom: 5px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
      }
      .announcement-content{
        margin: 0px 20px;
        line-height: 20px;
      }
      .more{
        margin: 20px;
        text-align: right;
        color: #32425f;
      }
    }
  }
}

    .wh_container >>> .wh_content_all {
      border: 1px solid #dfe0e6;
      width: 100%;
      height: 320px;
    }
    .wh_container >>> .wh_top_changge li {
      font-size: 14px;
      height: 40px !important;
    }
    .wh_container {
      margin: 0px !important;
    }

    .wh_container >>> .wh_item_date {
      color: #211d48;
      width: 28px;
      height: 28px;
    }
    .wh_container >>> .wh_item_date:hover {
      color: #ffffff;
      background: #f4776f;
    }
    .wh_container >>> .wh_other_dayhide {
      color: #cccccc;
    }

    // .wh_container >>> .wh_content_item{
    //   margin-bottom: 5px;
    //   margin-top: 5px;
    // }

    .wh_container >>> .wh_content {
      color: black;
    }
    .wh_container >>> .wh_top_tag {
      color: black;
    }
    .wh_container >>> .wh_top_tag:nth-child(0) {
      color: #f4776f;
    }
    .wh_container >>> .wh_content_li {
      font-size: 14px;
      color: #162947;
      font-weight: bold;
      height: 36px !important;
    }
    .wh_container >>> .wh_jiantou1 {
      border-top: 2px solid #162947;
      border-left: 2px solid #162947;
    }
    .wh_container >>> .wh_jiantou2 {
      border-top: 2px solid #162947;
      border-right: 2px solid #162947;
    }
    .wh_container >>> .wh_content_item > .wh_isMark {
      background-color: rgba(19, 105, 167, 0.15);
      /*border-radius: 0px;*/
    }
    .wh_container >>> .wh_content_item {
      height: 34px;
    }
    // 今天
    .wh_container >>> .wh_content_item .wh_isToday {
      background-color: #f4776f;
      color: #ffffff;
      border-radius: 0px;
      // border-radius: 0px;
    }
    // 选择的那天
    .wh_container >>> .wh_content_item .wh_chose_day {
      background-color: #f4776f;
      color: #ffffff;
      border-radius: 0px;
    }
</style>
