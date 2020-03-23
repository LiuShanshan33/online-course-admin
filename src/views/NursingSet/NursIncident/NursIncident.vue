//护理事件
//MEWS评分规则
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">Mews评分规则</div>
      <hr>
      <el-button class="create-btn" style="margin-top: 20px;margin-bottom: 10px;" type="primary" @click="handleCreate">
        新建
      </el-button>
    </div>
    <div class="bottom-container">
      <div class="down-tree" style="width: 20%">
        <!-- tree -->
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" @click="handleCreate" />
      </div>
      <div v-if="seen" class="right-container">
        <el-form ref="form" :label-position="labelPosition" :model="form" label-width="80px" class="top-form">
          <el-form-item label="诊断编码:" class="">
            <el-input v-model="form.code" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="诊断名字:" class="">
            <el-input v-model="form.name" placeholder="请输入" />
          </el-form-item>
          <el-tabs type="border-card">
            <el-tab-pane label="定义">
              <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign" class="tabs-form">
                <el-form-item label="诊断名字英文:">
                  <el-input v-model="formLabelAlign.name" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="诊断类型:">
                  <el-select v-model="formLabelAlign.code" placeholder="请选择...">
                    <el-option label="婴儿" value="yiner" />
                    <el-option label="儿童" value="ertong" />
                  </el-select>
                </el-form-item>
                <el-form-item label="定义:">
                  <el-input v-model="formLabelAlign.rulesDef" type="textarea" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="备注:">
                  <el-input v-model="formLabelAlign.remarks" type="textarea" placeholder="请输入" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="诊断依据">诊断依据</el-tab-pane>
            <el-tab-pane label="相关因素">相关因素</el-tab-pane>
            <el-tab-pane label="护理目标">护理目标</el-tab-pane>
            <el-tab-pane label="护理措施">护理措施</el-tab-pane>
          </el-tabs>
          <el-form-item class="bottom-btn">
            <el-button type="primary" @click="onSave">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'

export default {
  data() {
    return {
      data: [{
        label: '新生儿评分规则',
        children: [{
          label: '儿内科评分规则'
        },
        {
          label: '心血管内科评分规则'
        },
        {
          label: 'Mews公共评分规则'
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
      seen: false,
      formLabelAlign: {
        name: '',
        type: '',
        rulesDef: '',
        remarks: ''
      }

    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
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
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
    height:30px;
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
}
.bottom-container{
  display: flex;
  flex-direction: row;
  .down-tree{
    flex: 1;
    max-width:200px;
    height:678px;
    background:rgba(245,248,250,1);
    border-radius:3px;
    border:1px solid rgba(211,219,222,1);
    margin-left: 12px;
    padding: 14px;
  }
  .right-container{
    flex: 5;
    border-radius:3px;
    border:1px solid rgba(211,219,222,1);
    border-width: 1px 1px 1px 0px;
    margin-right: 12px;
    padding: 30px;
    .top-form {
      .el-form-item{
        width: 600px;
        margin-bottom: 15px;
        font-family:STSongti-SC-Bold,STSongti-SC;
        font-weight:bold;
        line-height:17px;
        /deep/.el-form-item__content{
          margin-left: 0px;
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
