//病区数据库动态配置
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">病区数据库动态配置</div>
      <hr>
    </div>
    <div class="bottom-container">
      <div class="right-container" :style="conheight">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <el-form
              ref="listQuery"
              :label-position="labelPosition"
              :model="listQuery"
              label-width="80px"
              class="top-form"
            >
              <el-tabs type="border-card">
                <el-tab-pane label="患者流转">
                  <el-button class="create-btn add-botton" style="margin-bottom: 10px;" @click="AddItems_1">
                    新增
                  </el-button>
                  <el-table
                    :key="tableKey"
                    :data="list"
                    size="mini"
                    border
                    fit
                    highlight-current-row
                    stripe
                    style="width: 100%;"
                    :header-cell-style="{background:'#F0F5F7'}"
                    :cell-style="{padding:'3px 2px'}"
                  >

                    <el-table-column label="配置项名" prop="configure" align="left" min-width="220px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.configure" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="过程名" prop="processName" align="left" min-width="240px">
                      <!-- <el-form ref="dictItems" :label-position="labelPosition" :model="dictItems">
                      <el-input v-model="dictItems.name" />
                    </el-form> -->
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.processName" size="small" />
                      </template>
                    </el-table-column>
                    <!-- <el-table-column label="排序" prop="sort" type="index" align="left" width="70px" /> -->
                    <el-table-column label="0为存储过程—1为系统项" prop="statusProcess" type="index" align="left" width="200px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.statusProcess" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="项目类型" prop="configureType" type="index" align="left" width="80px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.configureType" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" min-width="80px">
                      <template slot-scope="scope">
                        <el-button type="text" size="mini" @click.native.prevent="deleteRow(scope.$index, delarr)">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="margin-top: 10px">
                    <el-button class="create-btn add-botton" style="margin-top:10px;margin-bottom: 5px;" @click="saveDatabase">
                      保存
                    </el-button>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="医嘱项目">
                  <el-button class="create-btn add-botton" style="margin-bottom: 10px;" @click="AddItems_2">
                    新增
                  </el-button>
                  <el-table
                    :key="tableKey"
                    :data="items"
                    size="mini"
                    border
                    fit
                    highlight-current-row
                    stripe
                    style="width: 100%;"
                    :header-cell-style="{background:'#F0F5F7'}"
                    :cell-style="{padding:'3px 2px'}"
                  >

                    <el-table-column label="配置项名" prop="configure" align="left" min-width="100px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.configure" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="医嘱名称1" prop="doctorAdviceNameOne" align="left" width="120px">
                      <!-- <el-form ref="dictItems" :label-position="labelPosition" :model="dictItems">
                      <el-input v-model="dictItems.name" />
                    </el-form> -->
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.doctorAdviceNameOne" size="small" />
                      </template>
                    </el-table-column>
                    <!-- <el-table-column label="排序" prop="sort" type="index" align="left" width="70px" /> -->
                    <el-table-column label="医嘱名称2" prop="doctorAdviceNameTwo" type="index" align="left" width="120px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.doctorAdviceNameTwo" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="医嘱名称3" prop="doctorAdviceNameThree" type="index" align="left" width="120px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.doctorAdviceNameThree" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="频次" prop="frequency" type="index" align="left" width="80px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.frequency" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="途径" prop="channel" type="index" align="left" width="80px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.channel" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="医生说明" prop="doctorExplanation" type="index" align="left" width="120px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.doctorExplanation" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="非医嘱名称" prop="notDoctorAdviceNameOne" type="index" align="left" width="100px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.notDoctorAdviceNameOne" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="非频次" prop="notFrequency" type="index" align="left" width="80px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.notFrequency" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="非途径" prop="notChannel" type="index" align="left" width="80px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.notChannel" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="项目类型" prop="configureType" type="index" align="left" width="80px">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.configureType" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" min-width="80">
                      <template slot-scope="scope">
                        <el-button type="text" size="mini" @click.native.prevent="deleteRow(scope.$index, delarr)">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="margin-top: 10px">
                    <el-button class="create-btn add-botton" style="margin-top:10px;margin-bottom: 5px;" @click="saveDatabase">
                      保存
                    </el-button>
                  </div></el-tab-pane>
              </el-tabs>
            </el-form>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div></template>

<script>
import { saveWardDatabase } from '@/api/addOrSave' // 保存修改接口
import { getConfigureType } from '@/api/user'
import data from '../../pdf/content'

export default {
  name: 'Warddatabase',
  data() {
    return {
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        configure: '',
        configureType: '0',
        processName: '',
        statusProcess: ''
      },
      listTwo: {
        pageIndex: 1,
        pageSize: 20,
        configure: '',
        configureType: '1',
        doctorAdviceNameOne: '',
        doctorAdviceNameTwo: '',
        doctorAdviceNameThree: '',
        frequency: '',
        channel: '',
        doctorExplanation: '',
        notDoctorAdviceNameOne: '',
        notFrequency: '',
        notChannel: ''
      },
      tableKey: 0,
      list: [],
      items: [],
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
      },
      conheight: {
        height: ''
      }

    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.getList()
    this.tableHeight()
  },
  methods: {
    tableHeight() {
      this.conheight.height = window.innerHeight - 190 + 'px'
    },
    getList() {
      this.listLoading = false
      const data = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        configure: this.listQuery.configure,
        configureType: this.listQuery.configureType,
        processName: this.listQuery.processName,
        statusProcess: this.listQuery.statusProcess,
        id: this.listQuery.id
      }
      getConfigureType(this.listQuery.configureType).then(response => {
        this.list = response.data.list
        console.log(this.list)
      })
      getConfigureType(this.listTwo.configureType).then(response => {
        this.items = response.data.list
        console.log(this.list)
      })
    },
    AddItems_1() {
      this.list.push({
        configure: '',
        configureType: '0',
        processName: '',
        statusProcess: '',
        id: ''
      })
    },
    AddItems_2() {
      this.items.push({
        configure: '',
        configureType: '1',
        doctorAdviceNameOne: '',
        doctorAdviceNameTwo: '',
        doctorAdviceNameThree: '',
        frequency: '',
        channel: '',
        doctorExplanation: '',
        notDoctorAdviceNameOne: '',
        notFrequency: '',
        notChannel: '',
        id: ''
        // sort: JSON.stringify(this.dictItems.sort + 1)
        // sort: this.dictItems.length + 1
      })
    },
    // 保存
    saveDatabase() {
      saveWardDatabase(data).then(response => {
        // this.list = response.data.boardRelationProcessOneList
        // this.items = response.data.boardRelationProcessTwoList
        console.log('HospitalInfo', this.items)
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      })
    }
    // closeForm(tag) {
    //   this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
    //   this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
    // }
    // handleCreate: function() {
    //   this.seen = true
    //   this.dialogStatus = 'create'
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // onSave() {
    //   console.log('submit!')
    //   this.$message.success('保存成功')
    // },
    // handleNodeClick: function(data) {
    //   console.log(data)
    //   this.seen = true
    //   return data('code', 'name')
    // },
  }

}
</script>

<style lang="scss" scoped>
.top-container {
  margin: 20px 12px 5px 12px;
  .content-title {
    width: 140px;
    height: 30px;
    font-size: 15px;
    font-family: STSongti-SC-Black, STSongti-SC;
    font-weight: 900;
    color: rgba(51, 51, 51, 1);
    line-height: 25px;
    border-bottom: 3px solid #419793;
  }
  hr {
    width: 100%;
    margin: 0 auto;
    border: 0;
    height: 0;
    border-bottom: 1px solid rgba(203, 203, 203, 1);
  }
  .create-btn {
    width: 75px;
    height: 30px;
    background: linear-gradient(
      180deg,
      rgba(241, 246, 249, 1) 0%,
      rgba(214, 224, 229, 1) 54%,
      rgba(236, 241, 243, 1) 100%
    );
    border-radius: 2px;
    border: 1px solid rgba(204, 204, 204, 1);
    font-size: 12px;
    font-family: STSongti-SC-Bold, STSongti-SC;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    line-height: 17px;
    padding: 3px;
  }
}
.bottom-container {
  display: flex;
  flex-direction: row;
  .right-container {
    margin: 12px;
    padding-left: 30px;

    .top-form {
      .el-form-item {
        // max-width: 800px;
        margin-bottom: 15px;
        font-family: STSongti-SC-Bold, STSongti-SC;
        font-weight: bold;
        line-height: 17px;
        /deep/.el-form-item__label {
          color: rgba(51, 51, 51, 1) !important;
          font-size: 12px;
          font-family: STSongti-SC-Bold, STSongti-SC;
        }
        /deep/.el-input--medium .el-input__inner {
          height: 30px !important;
          line-height: 30px !important;
        }
      }
    }
    /deep/ .el-tabs {
      width: 1050px !important;
      margin-left: 10px;
      border: 1px solid #cbcbcb;
      margin-bottom: 20px;
    }
    /deep/.el-scrollbar .el-scrollbar__wrap {
      margin-bottom: 0px !important;
    }
    /deep/.tabs-form {
      min-width: 540px !important;
      .el-form-item {
        min-width: 540px !important;
        font-family: STSongti-SC-Bold, STSongti-SC;
        font-weight: bold;
        line-height: 17px;
        .el-select .el-input {
          min-width: 468px;
        }
        /deep/.el-form-item__label {
          color: rgba(51, 51, 51, 1) !important;
          font-size: 12px;
          font-family: STSongti-SC-Bold, STSongti-SC;
        }
        /deep/.el-input--medium .el-input__inner {
          height: 30px !important;
          line-height: 30px !important;
        }
      }
      .el-textarea__inner {
        min-height: 80px !important;
      }
    }
  }
}
</style>
