//护理记录
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">护理记录</div>
      <hr />
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 20%">
        <!-- tree -->
        <el-scrollbar style="height: 100%">
          <el-tree v-loading="listLoading" :data="list" :props="defaultProps" @node-click="getNode">
            <span slot-scope="{ node, data }" class="span-ellipsis">
              <span :title="data.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div v-if="seen" class="right-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <div>
              <el-button class="create-btn add-botton" style="margin: 10px 0px;" @click="onSave">保存</el-button>
            </div>
            <el-table
              :data="DeptList.a"
              size="mini"
              border
              stripe
              style="width: 50%; float:left;border-right:0px"
              :header-cell-style="{background:'#F0F5F7'}"
              :cell-style="{padding:'3px 2px'}"
            >
              <el-table-column align="left" width="105px">
                <template slot="header">
                  <el-checkbox
                    v-model="checkAll"
                    :indeterminate="isIndeterminate"
                    @change="handleCheckAllChange"
                  >全选/反选</el-checkbox>
                </template>
                <template slot-scope="scope">
                  <el-checkbox :label="scope.row.code" v-model="checkList">&nbsp;</el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="护理单元名称" prop="name" align="left" min-width="100px" />
            </el-table>
            <el-table
              :data="DeptList.b"
              size="mini"
              border
              stripe
              style="width: 50%;float:right;border-left:0px"
              :header-cell-style="{background:'#F0F5F7'}"
              :cell-style="{padding:'3px 2px'}"
            >
              <el-table-column width="100">
                <template slot-scope="scope">
                  <el-checkbox :label="scope.row.code" v-model="checkList">&nbsp;</el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="护理单元名称" prop="name" align="left" min-width="100px" />
            </el-table>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecordMenu, getRecordList, getDictInfo } from '@/api/user'

export default {
  name: 'NursingRecord',
  data() {
    return {
      checkList: [],
      list: null,
      items: null,
      formDeptCode: [],
      hasRelDept: [],
      tableKey: 0,
      defaultProps: {
        label: 'name'
      },
      checkAll: false,
      isIndeterminate: false,
      listLoading: true,
      labelPosition: 'right',
      form: {
        code: '',
        name: ''
      },
      conheight: {
        height: ''
      },
      seen: false,
      create: true,
      DeptOptions: {},
      DeptList: {
        a: [],
        b: []
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.onLoad()
    window.addEventListener('resize', this.getHeight)
    this.tableHeight()
  },
  methods: {
    onLoad() {
      this.getTreeData()
      this.getOptionsData()
      this.defaultCheck()
    },
    tableHeight() {
      this.conheight.height = window.innerHeight - 152 + 'px'
    },
    // 点击节点并获取data
    getNode(data, node, obj) {
      this.seen = true
      this.create = true
      this.items = data
      getRecordList(this.items.code).then(res => {// 将节点的入参传给后台
        this.items = res.data.list
        this.items.map((item, index) => {
          this.formDeptCode.push(item.deptCode)// 将节点的科室编码push到新的数组中
          this.hasRelDept = item.hasRelDept// 获取节点是否有科室的值
        })
        this.defaultCheck()
      })
      this.$nextTick(() => {// 点击下一个节点的回调，初始化存储获取到的节点的值
        this.formDeptCode = []
        this.hasRelDept = []
        this.checkList = []
      })
    },
    // 复选框默认选中
    defaultCheck() {
      if (this.hasRelDept === true) {// 判断是否有科室->有科室则遍历使其相应的值默认选中
        this.formDeptCode.map((item1, i) => {// 第一次遍历：长度较短的数组中的科室编码
          this.DeptOptions.map((item2, j) => {// 第二次遍历：整个表格中的科室编码
            if (item1 === item2.code) {// 依次判断：两者是否有相等的科室编码
              this.checkList.push(item1)// 若有则默认选中
            }
          })
        })
      }
    },
    // 用两个表格根据奇偶存入护理单元
    getOptionsData() {
      getDictInfo().then(res => {
        this.DeptOptions = res.data.list
        let a = []
        let b = []
        for (let i = 0; i < this.DeptOptions.length; i++) {
          if (i % 2 == 0) {// 如果是偶数存入a数组
            a.push(this.DeptOptions[i])
          }
          else {// 否则存入b数组
            b.push(this.DeptOptions[i])
          }
        }
        if (a.length != b.length) {// 如果a、b长度不一样则b增加一行空数据，使两个表格长度一致
          b.push({
            checkbox: '',
            name: ''
          })
        }
        this.DeptList.a = a
        this.DeptList.b = b
      })
    },
    // 获取树列表
    getTreeData() {
      getRecordMenu().then(res => {
        this.list = res.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 用两个表格根据奇偶存入护理单元
    getOptionsData() {
      getDictInfo().then(res => {
        this.DeptOptions = res.data.list
        let a = []
        let b = []
        for (let i = 0; i < this.DeptOptions.length; i++) {
          if (i % 2 == 0) {// 如果是偶数存入a数组
            a.push(this.DeptOptions[i])
          }
          else {// 否则存入b数组
            b.push(this.DeptOptions[i])
          }
        }
        if (a.length != b.length) {// 如果a、b长度不一样则b增加一行空数据，使两个表格长度一致
          b.push({
            checkbox: '',
            name: ''
          })
        }
        this.DeptList.a = a
        this.DeptList.b = b
      })
    },
    // 全选/反选
    handleCheckAllChange(val) {
      if (val) {// 全选遍历,push两个表格的每个checkList值
        this.DeptOptions.map((item, index) => {
          this.checkList.push(item.code)
        })
      } else {// 反选让checkList全部为空
        this.checkList = []
      }
      this.isIndeterminate = false
    },
    onSave() {
      console.log('submit!')
      this.$message.success('保存成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.top-container {
  margin: 20px 12px 5px 12px;
  .content-title {
    width: 120px;
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
  .down-tree {
    flex: 1;
    max-width: 200px;
    height: 678px;
    background: rgba(245, 248, 250, 1);
    border-radius: 3px;
    border: 1px solid rgba(211, 219, 222, 1);
    margin-left: 12px;
    padding: 10px;
    // overflow:hidden;
    .el-scrollbar {
      /deep/.el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    .span-ellipsis {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    /deep/.el-loading-spinner {
      top: 14% !important;
    }
  }
  .right-container {
    flex: 5;
    border-radius: 3px;
    border: 1px solid rgba(211, 219, 222, 1);
    border-width: 1px 1px 1px 0px;
    margin-right: 12px;
    padding-left: 30px;
    .top-form {
      margin-top: 30px;
      .el-form-item {
        width: 600px;
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
    /deep/.tabs-form {
      .el-form-item {
        width: 540px !important;
        font-family: STSongti-SC-Bold, STSongti-SC;
        font-weight: bold;
        line-height: 17px;
        .el-select .el-input {
          width: 440px;
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
