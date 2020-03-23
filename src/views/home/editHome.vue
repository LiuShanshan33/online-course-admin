<template>
  <div class="app-container">
    <div class="top-container">
      <div class="content-title">编辑工作台</div>
      <hr>
    </div>
    <div class="up-part">
      <span class="text">我的选项</span>
    </div>
    <div class="wrapper-2">
      <el-scrollbar style="width:100%">
        <draggable class="down-part" :list="optionsData" :options="{group:'option'}">
          <div style="padding-left: 10px;"
               v-for="moudle in optionsData"
               :key="moudle.id" @click="toNotOption(moudle)">
            <div class="box">
              <div class="box-1">
                <div class="image">
                  <img :src="jsonData[moudle.name]"/>
                </div>
                <div class="caption">
                  <span>{{moudle.name}}</span>
                </div>
              </div>
            </div>
          </div>
        </draggable>
      </el-scrollbar>
    </div>
    <div class="up-part">
      <span class="text">未添加选项</span>
    </div>
    <div class="wrapper-2">
      <el-scrollbar style="width:100%">
        <draggable class="down-part" :list="notOptionsData" :options="{group:'option'}">
          <div style="padding-left: 10px"
            v-for="moudle in notOptionsData"
            :key="moudle.id" @click="toOption(moudle)">
            <div class="box">
              <div class="box-1">
                <div class="image">
                  <img :src="jsonData[moudle.name]" @click="toUrl" />
                </div>
                <div class="caption">
                  <span>{{moudle.name}}</span>
                </div>
              </div>
            </div>
          </div>
        </draggable>
      </el-scrollbar>
    </div>
    <div style="margin-left:20px;margin-top:10px">
      <el-button class="add-botton" style="display:inline-block" @click="saveForm()">保存</el-button>
      <el-button style="display:inline-block" @click="closeForm(tag)">取消</el-button>
    </div>
  </div>
</template>

<script>
  import { systemInfo } from '@/api/system'
  import { json } from '@/json/moudle.js'
import { getAllOptionsMenu, getMoudleOptions, saveMoudleOptions } from '@/api/moudle'
import draggable from 'vuedraggable'
export default {
  name: 'EditingHome',
  components: {draggable},
  data() {
    return {
      nowDate: '', // 当前日期
      nowTime: '', // 当前时间
      nowWeek: '', // 当前星期
      info: '',
      allmoduleData: [], //总选项
      optionsData: [], //已添加选项
      notOptionsData: [], //未添加选项
      data:{
        empNo: this.$store.state.user.user.empNo,
        options: []
      },
      jsonData: json
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  //监控拖拽框的值更新
  updated() {
    console.log("已添加", this.optionsData)
    console.log("未添加", this.notOptionsData)

  },
  // 销毁定时器
  beforeDestroy: function() {
    if (this.getDate) {
      console.log('销毁定时器')
      clearInterval(this.getDate) // 在Vue实例销毁前，清除时间定时器
    }
  },
  methods: {
    //同步顺序执行 async - await
    async getList() {
      await getAllOptionsMenu().then( response => {
        this.allmoduleData = response.data.list
      })
      await getMoudleOptions(this.data.empNo).then( response => {
        this.optionsData = response.data.options
      })
      await this.enductObj(this.allmoduleData, this.optionsData)
    },
    toNotOption(moudle) {
      this.notOptionsData.push(moudle)
      let index = this.optionsData.findIndex(text => text.id === moudle.id)
      this.optionsData.splice(index, 1)
    },
    toOption(moudle) {
      this.optionsData.push(moudle)
      let index = this.notOptionsData.findIndex(text => text.id === moudle.id)
      this.notOptionsData.splice(index, 1)
    },
    closeForm(tag) {
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      //this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
      this.$router.go(-1)
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
    },
    toUrl(){

    },
    //获取未添加的模块
    enductObj(parent, child) {
      var arr = []
      for(var arr_1=0; arr_1<parent.length; arr_1++){
        var ss=true;
        var aa=true;
        for(var arr_2=0; arr_2<child.length; arr_2++){
          if(parent[arr_1].id!=child[arr_2].id && aa==true){
            ss=false;
          }
          else{
            ss=true;
            aa=false;
          }
        }
        if(ss==false){
          arr.push(parent[arr_1]);
        }
      }
      this.notOptionsData = arr
    },
    saveForm(){
      let arry = this.optionsData
      console.log("选择数组", this.optionsData)
      console.log("原始数据", this.data)
      this.data.options = []
      arry.map((item, index) => {
        this.data.options.push(Object.assign({}, item, { indexNo: index }))
      })
      console.log("提交数据", this.data)
      this.$confirm('确定保存添加选项?', '保存提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveMoudleOptions(this.data).then(response => {
          console.log(response.code)
          if (response.code == 200) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.closeForm()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消保存'
        })
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
    font-size:15px;
    font-weight:800;
    color:rgba(51,51,51,1);
    .top-container{
      margin: 0px 0px 10px 5px
    }
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
            font-size: 15px !important;
            letter-spacing:16px;
            color:rgba(51,51,51,1);
            height: 20px;
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
    .up-part{
      margin:10px 20px 5px 20px;
    }
    .wrapper-2{
        display: flex;
        flex-direction: column;
        margin-left:20px;
        // justify-content: space-around;
        height:180px;
        // top:0;
        background:rgba(249,249,249,1);
        border-radius:4px;
        border:1px solid rgba(203,203,203,1);
        .down-part{
            flex:3;
            margin-top:20px;
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
                /*&:nth-of-type(11){*/
                /*  margin-right:100px;*/
                /*}*/
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

