//MEWS评分规则
<template>
  <div class="container">
    <div class="top-container">
      <div class="content-title">Mews评分规则</div>
      <hr>
      <el-button
        class="create-btn"
        style="margin-top: 20px;margin-bottom: 10px;"
        type="primary"
        @click="handleCreate"
      >新建</el-button>
    </div>
    <div class="bottom-container">
      <div class="down-tree" :style="conheight" style="width: 20%">
        <!-- tree -->
        <el-scrollbar style="height: 100%">
          <el-tree
            v-loading="listLoading"
            :data="list"
            :props="defaultProps"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node, data }" class="span-ellipsis">
              <span :title="data.label">{{ node.label }}评分规则</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <div v-if="seen" class="right-container">
        <div class="scoll" :style="conheight">
          <el-scrollbar style="height:100%">
            <el-form
              ref="form"
              :model="form"
              :label-position="labelPosition"
              :rules="rules"
              label-width="66px"
              class="top-form"
            >
              <el-form-item label="编码:" class>
                <el-input v-model="form.formCode" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="名称:" class prop="formName">
                <el-input v-model="form.formName" placeholder="请输入" />
              </el-form-item>
            </el-form>
            <div>
              <p style="font-weight:bold;font-size:13px;padding-top:5px">Mews评分规则</p>

            </div>

            <el-table
              v-if="create"
              :key="tablekey"
              :data="dictItems"
              size="mini"
              border
              fit
              highlight-current-row
              stripe
              style="width: 75%;"
              :header-cell-style="{background:'#F0F5F7'}"
              :cell-style="{padding:'3px 2px'}"
            >
              <el-table-column label="编码" prop="code" align="left" min-width="220px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.code" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="名称" prop="name" align="left" min-width="220px">
                <!-- <el-form ref="dictItems" :label-position="labelPosition" :model="dictItems">
                  <el-input v-model="dictItems.name" />
                </el-form>-->
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" size="small" />
                </template>
              </el-table-column>
              <!-- <el-table-column label="排序" prop="sort" type="index" align="left" width="70px" /> -->
              <el-table-column label="3" prop="firstScore" type="index" align="left" width="70px">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.firstScore" size="small" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" min-width="80">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="mini"
                    @click.native.prevent="deleteRow(scope.$index, delarr)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 10px">
              <el-button
                class="create-btn add-botton"
                style="margin-bottom: 10px;"
                type="primary"
                @click="AddItems(dictItems)"
              >添加</el-button>
              <el-button
                class="create-btn add-botton"
                style="margin-bottom: 10px;"
                type="primary"
              >保存</el-button>
              <el-button v-if="itemsdelete" class="create-btn" style="margin-bottom: 10px;">删除</el-button>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getMewsForm, getScoreRule } from '@/api/user'

export default {
  name: 'MEWSRule',
  data() {
    return {
      tablekey: 0,
      list: null,
      itemsdelete: true,
      listLoading: true,
      dictItems: {
        formCode: '',
        formName: '',
        id: ''
      },
      defaultProps: {
        // children: 'children',
        label: 'formName'
      },
      labelPosition: 'right',
      form: {
        code: '',
        name: ''
      },
      conheight: {
        height: ''
      },
      add: {
        id: null,
        code: null,
        name: null
      },
      seen: false,
      formLabelAlign: {
        name: '',
        type: '',
        rulesDef: '',
        remarks: ''
      },
      rules: {
        formName: [
          { required: true, message: '必填字段', trigger: 'blur' }
        ]
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
    },
    tableHeight() {
      this.conheight.height = window.innerHeight - 232 + 'px'
    },
    getTreeData() {
      getMewsForm().then(res => {
        this.list = res.data.list
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
    handleCreate() {
      this.seen = true
      this.create = true
      this.form = ''
      this.dictItems = null
      // this.dictItems = this.add
      this.itemsdelete = false
      // this.$nextTick(() => {
      //   this.dictItems.push({
      //     name: null,
      //     code: null,
      //     id: null
      //   })
      // })
    },
    onSave() {
      console.log('submit!')
      this.$message.success('保存成功')
    },
    handleNodeClick(data) {
      console.log(data)
      this.seen = true
      this.create = true
      this.form = data
      let dataList = []
      // return data('code', 'name')
      if (data && data.formCode) {
        getScoreRule(data.formCode).then(res => {
          console.log(data.formCode, res)
          this.dictItems = res.data
          // const { data: { dictItems }} = res
          console.log('能出来么', this.dictItems)
          this.dictItems.map((obj, index) => {
            // this.items = item.items
            obj.mewsScoreRules.map((item, index) => {
              if (!item) { return }
              dataList = [...dataList, JSON.parse(JSON.stringify(item))]
            })
            console.log('treeList', dataList)
            this.dictItems = dataList
          })
        })
      }
    },
    // 添加一行
    AddItems() {
        this.dictItems.push({
          id: '',
          code: '',
          name: '',
          firstScore: '',
          exceptionalCase: ''
      })
    },
    // // 删除该行
    deleteRow(index, rows) {
      this.dictItems.splice(index, 1)
      console.log(this.dictItems)
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
    height: 100%;
    background: rgba(245, 248, 250, 1);
    border-radius: 3px;
    border: 1px solid rgba(211, 219, 222, 1);
    margin-left: 12px;
    padding: 10px;
    /deep/.el-scrollbar {
      // height: 658px;
      /deep/.el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    /deep/.el-tree {
      background: rgba(245, 248, 250, 1);
    }
    .span-ellipsis {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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
      margin-top: 20px;
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
