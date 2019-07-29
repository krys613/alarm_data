<template>
    <section>
        <!--列表-->
        <el-table :data="mockRules" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" min-width="60">
            </el-table-column>
            <el-table-column prop="rId" label="编号" width="100" sortable>
            </el-table-column>
            <el-table-column prop="rFrom" label="根因事件" min-width="350" sortable>
            </el-table-column>
            <el-table-column prop="rTo" label="关联事件" min-width="350" sortable>
            </el-table-column>
            <el-table-column label="操作" min-width="120">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-button type="danger" @click="addNew">新增</el-button>
            <el-button type="danger" @click="newData">产生模拟告警数据</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm">
                <el-form-item label="编号" prop="rId">
                    <el-input v-model="editForm.rId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="根因事件">
                    <el-input type="textarea" v-model="editForm.rFrom"></el-input>
                </el-form-item>
                <el-form-item label="关联事件">
                    <el-input type="textarea" v-model="editForm.rTo"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" ref="addForm">
                <el-form-item label="编号" prop="rId">
                    <el-input v-model="addForm.rId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="根因事件">
                    <el-input type="textarea" v-model="addForm.rFrom"></el-input>
                </el-form-item>
                <el-form-item label="关联事件">
                    <el-input type="textarea" v-model="addForm.rTo"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getMockRules, removeMockRules, batchRemoveMockRules, editRules, addRules, newData} from '../../api/api';
    import $ from 'jquery'
    export default {
        data() {
            return {
                mockRules: [],
                total: 0,
                last: -1,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                editFormVisible: false,
                editLoading: false,
                editForm: {
                    rId: 1,
                    rFrom: '',
                    rTo: '',
                },

                addFormVisible: false,
                addLoading: false,
                addForm: {
                    rId: 1,
                    rFrom: '',
                    rTo: ''
                }
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getMockRules();
            },
            //获取模拟规则库
            getMockRules() {
                let para = {
                    page: this.page
                };
                this.listLoading = true;
                //NProgress.start();
                getMockRules(para).then((res) => {
                    this.total = res.data.total;
                    this.last = res.data.last;
                    this.mockRules = res.data.mockRules;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: row.rId };
                    removeMockRules(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getMockRules();
                    });
                }).catch(() => {
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                let ids = this.sels.map(item => item.rId).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };
                    batchRemoveMockRules(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getMockRules();
                    });
                }).catch(() => {
                });
            },

            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },

            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            editRules(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getMockRules();
                            });
                        });
                    }
                });
            },

            addNew: function () {
                this.addFormVisible = true;
                this.addForm = {
                    rId: this.last + 1,
                    rFrom: '',
                    rTo: ''
                };
            },

            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            addRules(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getMockRules();
                            });
                        });
                    }
                });
            },

            newData: function() {
                let para = {
                    days: 2
                };
                newData(para).then((res) => {
                    this.$message({
                        message: '模拟数据生成成功！',
                        type: 'success'
                    });
                    this.listLoading = false;
                    //NProgress.done();
                });
            }
        },

        mounted() {
            this.getMockRules();
        }
    }
</script>

<style scoped>
</style>