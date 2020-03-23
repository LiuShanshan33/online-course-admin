//诊疗组
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">护理人员维护</div>
      <hr style="margin-bottom:15px">
      <div class="filter-container">
        <span class="text-lable">科室：</span>
        <el-autocomplete
          v-model="listQuery.deptName"
          :fetch-suggestions="querySearchGroup"
          placeholder="请选择"
          clearable
          class="filter-item"
          style="width: 158px;margin-top:0px"
          @select="selectGroup"
          @focus="groupListMe"
        />
        <el-input v-model="formInline.name" class="filter-item" placeholder="输入员工号或姓名" style="width: 148px;" />
        <el-button class="filter-item search-btn" type="primary" @click="handleCreate">
          <span style="height:17px;line-height:17px;font-size:12px;padding-bottom:6px">搜索</span>
        </el-button>
      </div>
    </div>
    <div class="bottom-container">
      <div class="down-tree" style="width: 20%">
        <!-- tree -->
        <el-tree :data="dataitems" :props="defaultProps" @node-click="handleNodeClick" @click="handleCreate" />
      </div>
      <div v-if="seen" class="right-container">
        <el-form ref="form" :inline="true" :label-position="labelPosition" :model="form" label-width="68px" class="top-form">
          <el-form-item label="人员信息:">
            <span>员工编号：</span><el-input v-model="form.code" placeholder="请输入" class="inline-items" />
            <span>员工姓名：</span><el-input v-model="form.name" placeholder="请输入" class="inline-items" />
            <span>手机号码：</span><el-input v-model="form.name" placeholder="请输入" class="inline-items" />
            <br>
            <span style="letter-spacing:8px">职   务</span><span style="font-family:STSongti-SC-Bold,STSongti-SC;">:</span>
            <el-select v-model="formLabelAlign.code" placeholder="请选择..." class="inline-options">
              <el-option label="神经内科护理单元" value="yiner" />
              <el-option label="五官科护理单元" value="ertong" />
              <el-option label="皮肤科护理单元" value="ertong" />
            </el-select>
            <span style="letter-spacing:8px">职   称</span><span style="font-family:STSongti-SC-Bold,STSongti-SC;">:</span>
            <el-select v-model="formLabelAlign.code" placeholder="请选择..." class="inline-options">
              <el-option label="神经内科护理单元" value="yiner" />
              <el-option label="五官科护理单元" value="ertong" />
              <el-option label="皮肤科护理单元" value="ertong" />
            </el-select>
            <span style="letter-spacing:8px">角   色</span><span style="font-family:STSongti-SC-Bold,STSongti-SC;">:</span>
            <el-select v-model="formLabelAlign.code" placeholder="请选择..." class="inline-options">
              <el-option label="神经内科护理单元" value="yiner" />
              <el-option label="五官科护理单元" value="ertong" />
              <el-option label="皮肤科护理单元" value="ertong" />
            </el-select>
            <br>
            <span>在职状态 :</span>
            <el-select v-model="formLabelAlign.code" placeholder="请选择..." class="inline-options">
              <el-option label="神经内科护理单元" value="yiner" />
              <el-option label="五官科护理单元" value="ertong" />
              <el-option label="皮肤科护理单元" value="ertong" />
            </el-select>
            <span>当前科室 :</span>
            <el-select v-model="formLabelAlign.code" placeholder="请选择..." class="inline-options">
              <el-option label="神经内科护理单元" value="yiner" />
              <el-option label="五官科护理单元" value="ertong" />
              <el-option label="皮肤科护理单元" value="ertong" />
            </el-select>
            <span>护士APP权限:</span>
            <el-select v-model="formLabelAlign.code" style="width:116px!important" placeholder="请选择..." class="inline-options">
              <el-option label="神经内科护理单元" value="yiner" />
              <el-option label="五官科护理单元" value="ertong" />
              <el-option label="皮肤科护理单元" value="ertong" />
            </el-select>
          </el-form-item>
          <hr class="right-hr">
          <el-form-item label="科室权限:" class="">
            <el-transfer v-model="value" class="dept-transfer" :data="data" :titles="['可选科室', '已选科室']" />
          </el-form-item>
          <br>
          <el-form-item class="bottom-btn">
            <el-button style="margin-left:70px">清空</el-button>
            <el-button class="add-botton" @click="onSave">保存</el-button>
            <el-button>删除</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getDictInfo } from '@/api/user'

export default {
  data() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`
          // disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      listQuery: {
        deptCode: ''
      },
      dataitems: [{
        label: '骨科护理单元',
        children: [{
          label: '贺鬼锟（00032）'
        },
        {
          label: '贺鬼锟（00032）'
        },
        {
          label: '贺鬼锟（00032）'
        },
        {
          label: 'Mews公共评分规则'
        },
        {
          label: 'Mews公共评分规则'
        },
        {
          label: 'Mews公共评分规则'
        }
        ]
      },
      {
        label: '新生儿评分规则',
        children: [{
          label: '儿内科评分规则'
        }, {
          label: '儿内科评分规则'
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1'
        }, {
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'right',
      form: {
        code: '',
        name: ''
      },
      groupArr: [],
      groupList: [],
      seen: true,
      formLabelAlign: {
        name: '',
        type: '',
        rulesDef: '',
        remarks: ''
      },
      formInline: {
        dept: '',
        name: ''
      },
      data: generateData(),
      value: [1, 4],
      deptOptions: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    },
    'listQuery.deptName': {
      deep: true,
      handler: function(newVal, oldVal) {
        this.groupArr = []// 这是定义好的用于存放下拉提醒框中数据的数组
        var len = this.groupList.length// groupList
        var arr = []
        for (var i = 0; i < len; i++) { // 根据输入框中的值进行模糊匹配
          if (this.groupList[i].name.indexOf(this.listQuery.deptName) >= 0) {
            arr.push({
              value: this.groupList[i].name,
              id: this.groupList[i].code
            })
          }
        }
        this.groupArr = arr
      }
    }
  },
  created() {
    // this.getList()
    this.onLoad()
  },
  methods: {
    onLoad() {
      this.groupListMe()
    },
    groupListMe() {
      getDictInfo().then(res => {
        if (res.data) {
          this.groupList = []
          this.groupArr = []
          this.groupList = res.data.list
          for (const item of this.groupList) {
            this.groupArr.push({
              value: item.name,
              id: item.code
            })
          }
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    querySearchGroup(queryString, cb) {
      var groupArr = this.groupArr
      cb(groupArr)
    },
    selectGroup(val) {
      this.groupId = val.code
    },
    // resetTemp() {
    //   this.temp = {
    //     id: undefined, // 新建，内容不详
    //     importance: 1,
    //     remark: '',
    //     timestamp: new Date(),
    //     title: '',
    //     status: 'published',
    //     type: ''
    //   }
    // },
    // 点击新建
    handleCreate: function() {
      this.seen = true
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    onSave() {
      console.log('submit!')
      this.$message.success('保存成功')
    },
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
    //       this.temp.author = 'vue-element-admin'
    //       createArticle(this.temp).then(() => {
    //         this.list.unshift(this.temp)
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: 'Success',
    //           message: 'Created Successfully',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // }
    handleNodeClick: function(data) {
      console.log(data)
      this.seen = true
      // return data('code', 'name')
    }
  }
}
</script>

<style lang="scss" scoped>
.top-container{
  margin: 20px 12px 5px 12px;
  .content-title{
    width:120px;
    height:30px;
    font-size:15px;
    font-family:STSongti-SC-Black,STSongti-SC;
    font-weight:900;
    color:rgba(51,51,51,1);
    line-height:25px;
    border-bottom: 3px solid #419793;
  }
  hr{
    width:100%;
    margin:0 auto;
    border: 0;
    height: 0;
    border-bottom: 1px solid rgba(203, 203, 203, 1);
  }
  .create-btn{
    width:75px;
    height:36px;
    background:linear-gradient(180deg,rgba(241,246,249,1) 0%,rgba(214,224,229,1) 54%,rgba(236,241,243,1) 100%);
    border-radius:2px;
    border:1px solid rgba(204,204,204,1);
    font-size:12px;
    font-family:STSongti-SC-Bold,STSongti-SC;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:17px;
    padding: 3px;
  }
  .demo-form-inline{
    /deep/.el-form--inline .el-form-item {
    display: inline-block;
    margin-right: 10px;
    width: 140px!important;
    font-family:STSongti-SC-Bold,STSongti-SC;
    font-weight:bold;
    line-height:17px;
    margin-top: 20px!important;
    vertical-align: top;
     /deep/.el-select .el-input{
          width: 140px;
        }
    /deep/.el-form-item__label{
      color:rgba(51,51,51,1)!important;
      font-size:12px;
      font-family:STSongti-SC-Bold,STSongti-SC;
    }
    }
  }
}
.bottom-container{
  display: flex;
  flex-direction: row;
  // /deep/.el-icon-arrow-up:before{
  //   content: "\E60C";
  //   height: 20px;
  // }
  .down-tree{
    flex: 1;
    max-width:200px;
    height:678px;
    background:rgba(245,248,250,1);
    border-radius:3px;
    border:1px solid rgba(211,219,222,1);
    margin-left: 12px;
    padding: 14px;
    /deep/.el-tree-node__expand-icon.is-leaf::before
    {
        // display: none;
        background: url("../sysGroup/images/护士.png") no-repeat;
        content: '';
        display: block;
        width: 18px;
        height: 18px;
        font-size: 18px;
        background-size: 15px;
    }
  }
  .right-container{
    flex: 5;
    border-radius:3px;
    border:1px solid rgba(211,219,222,1);
    border-width: 1px 1px 1px 0px;
    margin-right: 12px;
    padding: 30px;
    .top-form {
        .items-label span:before{
          position: absolute;
          left: 82px;
          content: ':';
        }
      .inline-items{
        display: inline-block;
        margin-right: 10px;
        width: 140px!important;
        text-align: center;
        font-family:STSongti-SC-Bold,STSongti-SC;
        font-weight:bold;
        // line-height:17px;
        vertical-align: top;
        margin-top: 5px;
        margin-bottom: 10px;
      }
      .inline-options{
        display: inline-block;
        margin-right: 10px;
        width: 137px;
        font-family:STSongti-SC-Bold,STSongti-SC;
        font-weight:bold;
        // line-height:17px;
        vertical-align: top;
        margin-top: 5px;
        margin-bottom: 10px;
      }
      span{
        font-size:12px;
        font-family:STSongti-SC-Bold,STSongti-SC;
        font-weight:bold;
        color:rgba(51,51,51,1);
      }
      .el-form-item{
        max-width: 718px;
        margin-bottom: 5px;
        margin-top: 15px;
        font-family:STSongti-SC-Bold,STSongti-SC;
        font-weight:bold;
        line-height:17px;
        /deep/.el-form-item__label{
          color:rgba(51,51,51,1)!important;
          font-size:13px;
          font-family:STSongti-SC-Bold,STSongti-SC;
        }
        /deep/.el-input--medium .el-input__inner {
          height: 30px!important;
          line-height: 30px!important;
        }
      }
      .right-hr{
          width:100%;
          margin:0 auto;
          border: 0;
          height: 0;
          border-bottom: 1px solid rgba(203, 203, 203, 1);
        }
      .dept-transfer {
        // .el-transfer-panel{
        //   // checkbox:false;
        // }
        // margin-bottom: 15px;
        /deep/ .el-transfer__button{
          width:30px!important;
          border-radius: 15px!important;
        }
        /deep/ .el-transfer-panel{
          width: 268px;
          height: 382px;
        }
      .el-transfer-panel__list.is-filterable{
          height: 400px;
      }

      }
    }
    /deep/.tabs-form{
       .el-form-item{
        width: 540px!important;
        font-family:STSongti-SC-Bold,STSongti-SC;
        font-weight:bold;
        line-height:17px;
        .el-select .el-input{
          width: 440px;
        }

        /deep/.el-form-item__label{
          color:rgba(51,51,51,1)!important;
          font-size:12px;
          font-family:STSongti-SC-Bold,STSongti-SC;
        }
        /deep/.el-input--medium .el-input__inner {
          height: 30px!important;
          line-height: 30px!important;
        }
      }
      .el-textarea__inner{
        min-height: 80px!important;
      }
    }
  }
}
</style>
