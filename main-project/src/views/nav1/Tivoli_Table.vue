<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-select v-model="filters.ip" placeholder="IP地址" style="width:200px;">
                        <el-option v-for="item in ip_options" :key="item.value"
                                   :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="postInfo-container-item">
                    <el-date-picker v-model="filters.duration" type="datetimerange"
                                    placeholder="首次告警时间" align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.service" placeholder="业务系统" style="width:400px;">
                        <el-option v-for="item in service_options" :key="item.value"
                                   :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getTivoliAlarm">查询</el-button>
                </el-form-item>
                <!--<el-form-item>-->
                <!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
                <!--</el-form-item>-->
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="selection"  min-width="45" align="center">
            </el-table-column>
            <el-table-column type="index" min-width="40" align="center">
            </el-table-column>
            <el-table-column prop="ip" label="IP地址" width="100" align="center" sortable>
            </el-table-column>
            <el-table-column prop="host" label="主机名" width="100" align="center" sortable>
            </el-table-column>
            <el-table-column prop="level" label="告警级别" width="115" align="center" sortable>
            </el-table-column>
            <el-table-column prop="info" label="告警信息" width="170" align="center" sortable>
            </el-table-column>
            <el-table-column prop="first_time" label="首次告警时间" min-width="90" align="center" sortable>
            </el-table-column>
            <el-table-column prop="last_time" label="最后告警时间" min-width="90" align="center" sortable>
            </el-table-column>
            <el-table-column prop="count" label="累计次数" min-width="65" align="center" sortable>
            </el-table-column>
            <el-table-column prop="pre_level" label="原始级别" min-width="65" align="center" sortable>
            </el-table-column>
            <el-table-column prop="type" label="告警类型" min-width="65" align="center" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="65" align="center" sortable>
            </el-table-column>
            <el-table-column prop="business" label="业务系统" min-width="80" align="center" sortable>
            </el-table-column>
            <el-table-column label="操作" width="70">
                <template scope="scope">
                    <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import $ from 'jquery';
    import {getTivoliAlarmListPage, removeTivoliAlarm, batchRemoveTivoliAlarm} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    ip: "",
                    service: "",
                    isAsc: false,
                    duration: ""
                },
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                ip_options: [],         // IP地址下拉框选项
                service_options: [],    // 业务系统下拉框选项
            }
        },

        methods: {

            handleCurrentChange(val) {
                this.page = val;
                this.getTivoliAlarm();
            },
            //获取IP地址列表
            getTivoliIP() {
                var ips = [];
                $.ajax({
                    async: false,
                    type: 'get',
                    dataType: 'json',
                    url: 'http://10.82.82.15/aiops/Tivoli/getAllIp',
                    success: function (data) {
                        for (var i = 0; i < data.length; i++) {
                            ips.push({
                                value: data[i].id,
                                label: data[i].name
                            })
                        }
                    },
                    error: function (data) {
                        console.log('fail to get tivoli ips');
                    }
                });
                this.ip_options = ips;
            },
            //获取业务系统列表
            getTivoliService() {
                var services = [];
                $.ajax({
                    async: false,
                    type: 'get',
                    dataType: 'json',
                    url: 'http://10.82.82.15/aiops/Tivoli/getAllService',
                    success: function (data) {
                        for (var i = 0; i < data.length; i++) {
                            services.push({
                                value: data[i].id,
                                label: data[i].name
                            })
                        }
                    },
                    error: function (data) {
                        console.log('fail to get tivoli services');
                    }
                });
                this.service_options = services;
            },
            formatTen(num) {
                return num > 9 ? (num + "") : ("0" + num);
            },
            //获取Tivoli数据列表
            getTivoliAlarm() {
                let startDate = "";
                let endDate = "";
                if (this.filters.duration) {
                    console.log(this.filters.duration);
                    let start = this.filters.duration[0];
                    if (start != null) {
                        startDate = start.getFullYear() + '-' + this.formatTen(start.getMonth() + 1) + '-' +
                            this.formatTen(start.getDate()) + ' ' + this.formatTen(start.getHours()) + ':' +
                            this.formatTen(start.getMinutes()) + ':' + this.formatTen(start.getSeconds());
                    }

                    let end = this.filters.duration[1];
                    if (end != null) {
                        endDate = end.getFullYear() + '-' + this.formatTen(end.getMonth() + 1) + '-' +
                            this.formatTen(end.getDate()) + ' ' + this.formatTen(end.getHours()) + ':' +
                            this.formatTen(end.getMinutes()) + ':' + this.formatTen(end.getSeconds());
                    }
                }
                let para = {
                    page: this.page,
                    ip: this.filters.ip,
                    service: this.filters.service,
                    isAsc: this.filters.isAsc,
                    startDate: startDate,
                    endDate: endDate
                };
                this.listLoading = true;
                //NProgress.start();
                getTivoliAlarmListPage(para).then((res) => {
                    this.total = res.total;
                    this.users = res.users;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    removeTivoliAlarm(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: res.num.toString() + '条记录删除成功',
                            type: 'success'
                        });
                        this.getTivoliAlarm();
                    });
                }).catch(() => {

                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                let ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    batchRemoveTivoliAlarm(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: res.num.toString() + '条记录删除成功',
                            type: 'success'
                        });
                        this.getTivoliAlarm();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getTivoliAlarm();
            this.getTivoliIP();
            this.getTivoliService();
        }
    }

</script>

<style scoped>

</style>