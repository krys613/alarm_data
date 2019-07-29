<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <!--<el-input v-model="filters.source" placeholder="数据来源"></el-input>-->
                    <el-select v-model="filters.source" placeholder="数据来源" style="width:400px;">
                        <el-option v-for="item in source_options" :key="item.value"
                                   :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filters.event" placeholder="事件" style="width:300px;">
                        <el-option v-for="item in event_options" :key="item.value"
                                   :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="postInfo-container-item">
                    <el-date-picker v-model="filters.duration" type="datetimerange"
                                    placeholder="触发时间" align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getBPCAlarm">查询</el-button>
                </el-form-item>
                <!--<el-form-item>-->
                <!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
                <!--</el-form-item>-->
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%; text-align: center;">
            <el-table-column type="selection" min-width="55" align="center">
            </el-table-column>
            <el-table-column type="index" min-width="40" align="center">
            </el-table-column>
            <el-table-column prop="last_time" label="最后发生时间" min-width="130" align="center" sortable>
            </el-table-column>
            <el-table-column prop="source" label="数据来源" min-width="120" align="center" sortable>
            </el-table-column>
            <el-table-column prop="event" label="事件" min-width="110" align="center" sortable>
            </el-table-column>
            <el-table-column prop="last_value" label="最新告警值" min-width="95" align="center" sortable>
            </el-table-column>
            <el-table-column prop="threshold" label="设定阈值" min-width="85" align="center" sortable>
            </el-table-column>
            <el-table-column prop="trigger_time" label="触发时间" min-width="130" align="center" sortable>
            </el-table-column>
            <el-table-column prop="persist" label="持续时间" min-width="85" align="center" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="65" align="center" sortable>
            </el-table-column>
            <el-table-column prop="type" label="类别" min-width="70" align="center" sortable>
            </el-table-column>
            <el-table-column prop="peek_value" label="峰值" min-width="65" align="center" sortable>
            </el-table-column>
            <el-table-column prop="ip" label="组件IP" min-width="90" align="center" sortable>
            </el-table-column>
            <el-table-column label="操作" min-width="50" align="center">
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
    import {getBPCAlarmListPage, removeBPCAlarm, batchRemoveBPCAlarm} from '../../api/api';
    import $ from 'jquery'

    export default {
        data() {
            return {
                filters: {
                    source: "",
                    event: "",
                    isAsc: false,
                    duration: ""
                },
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                source_options: [],     // 设备来源下拉框选项
                event_options: [],      // 事件下拉框选项
            }
        },

        methods: {

            handleCurrentChange(val) {
                this.page = val;
                this.getBPCAlarm();
            },
            //获取BPC表的事件列表
            getBPCEvent() {
                var events = [];
                $.ajax({
                    async: false,
                    type: 'get',
                    dataType: 'json',
                    url: 'http://10.82.82.15/aiops/BPC/getEvent',
                    success: function (data) {
                        for (var i = 0; i < data.length; i++) {
                            events.push({
                                value: data[i].id,
                                label: data[i].name
                            })
                        }
                    },
                    error: function (data) {
                        console.log('fail to get bpc events');
                    }
                });
                this.event_options = events;
            },
            //获取BPC表的设备来源列表
            getBPCSource() {
                var source = [];
                $.ajax({
                    async: false,
                    type: 'get',
                    dataType: 'json',
                    url: 'http://10.82.82.15/aiops/BPC/getSource',
                    success: function (data) {
                        for (var i = 0; i < data.length; i++) {
                            source.push({
                                value: data[i].id,
                                label: data[i].name
                            })
                        }
                    },
                    error: function (data) {
                        console.log('fail to get bpc sources');
                    }
                });
                this.source_options = source;
            },
            formatTen(num) {
                return num > 9 ? (num + "") : ("0" + num);
            },
            //获取告警列表
            getBPCAlarm() {
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
                    source: this.filters.source,
                    event: this.filters.event,
                    isAsc: this.filters.isAsc,
                    startDate: startDate,
                    endDate: endDate
                };
                this.listLoading = true;
                //NProgress.start();
                getBPCAlarmListPage(para).then((res) => {
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
                    removeBPCAlarm(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: res.num.toString() + '条记录删除成功',
                            type: 'success'
                        });
                        this.getBPCAlarm();
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
                    batchRemoveBPCAlarm(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: res.num.toString() + '条记录删除成功',
                            type: 'success'
                        });
                        this.getBPCAlarm();
                    });
                }).catch(() => {

                });
            }
        },

        mounted: function () {
            this.getBPCAlarm();
            this.getBPCEvent();
            this.getBPCSource();
        }
    }

</script>

<style scoped>

</style>