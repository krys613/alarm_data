import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import util from "../common/js/util"
import $ from 'jquery'
import MockRule from "../views/rule-library/MockRule";

let WorkOrder = [];
let BPC_test = [];
let Tivoli_Alarm = [];
let Rules_item = [];
let Rules_Library_item = [];
let MockRules = [];

export default {
    /**
     * mock bootstrap
     */
    bootstrap: function () {
        let mock = new MockAdapter(axios);

        // mock success request
        mock.onGet('/success').reply(200, {
            msg: 'success'
        });

        // mock error request
        mock.onGet('/error').reply(500, {
            msg: 'failure'
        });

        //登录
        mock.onPost('/login').reply(config => {
            let {username, password} = JSON.parse(config.data);
            return new Promise((resolve, reject) => {
                let user = null;
                let hasUser = false ;
                $.ajax({
                    type: 'post',
                    url: 'http://10.82.82.15/aiops/User/login',
                    data: {username: username, password: password},
                    dataType: "json",
                    success: function (data) {
                        user = data.userStatusVO;
                        hasUser = true;
                    },
                    error: function (data) {
                        hasUser = false;
                    }
                });
                setTimeout(() => {
                    if (hasUser) {
                        resolve([200, {code: 200, msg: '请求成功', user}]);
                    } else {
                        resolve([200, {code: 500, msg: '账号或密码错误'}]);
                    }
                }, 1000);
            });
        });


        //============================= BPC数据================================================
        //获取alarm列表（分页）
        mock.onPost("/alarm_bpc/listpage").reply(config => {
            let {page, source, event, isAsc, startDate, endDate} = JSON.parse(config.data);
            let data_json = {page: page, isAsc: isAsc};
            if (source !== '') data_json['source'] = source;
            if (event !== '') data_json['event'] = event;
            if (startDate !== '') data_json['startDate'] = startDate;
            if (endDate !== '') data_json['endDate'] = endDate;

            BPC_test = [];
            let total;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/BPC/getAllList',
                data: data_json,
                dataType: "json",
                success: function (data) {
                    var datatest = JSON.parse(JSON.stringify(data.bpcvos));
                    total = data.bpcPageVO['totalNum'];
                    for (let i = 0; i < datatest.length; i++) {
                        BPC_test.push({
                            id: datatest[i].id,
                            last_time: datatest[i].lastTime,
                            source: datatest[i].source,
                            event: datatest[i].event,
                            last_value: datatest[i].latestWarningValue,
                            threshold: datatest[i].threshold,
                            trigger_time: datatest[i].triggerTime,
                            persist: datatest[i].duration.toString() + "分钟",
                            status: datatest[i].status,
                            type: datatest[i].category,
                            peek_value: datatest[i].peakValue,
                            ip: datatest[i].ip
                        });
                    }
                },
                error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        users: BPC_test
                    }]);
                }, 1000);
            });
        });

        //删除记录
        mock.onPost('/alarm_bpc/remove').reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = "[" + id_json.id.toString() + "]";
            let total = 0;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/BPC/deleteByIds',
                data: {ids: ids},
                dataType: "json",
                success: function (data) {
                    total = data;
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //批量删除记录
        mock.onPost('/alarm_bpc/batchremove').reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = "[" + id_json.ids + "]";
            let total = 0;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/BPC/deleteByIds',
                data: {ids: ids},
                dataType: "json",
                success: function (data) {
                    total = data;
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });


        //============================= Tivoli数据================================================
        //获取alarm列表（分页）
        mock.onPost("/alarm_tivoli/listpage").reply(config => {
            let {page, ip, service, isAsc, startDate, endDate} = JSON.parse(config.data);
            let data_json = {page: page, isAsc: isAsc};
            if (ip !== '') data_json['ip'] = ip;
            if (service !== '') data_json['service'] = service;
            if (startDate !== '') data_json['startDate'] = startDate;
            if (endDate !== '') data_json['endDate'] = endDate;

            Tivoli_Alarm = [];
            let total;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/Tivoli/getAllList',
                dataType: "json",
                data: data_json,
                success: function (data) {
                    var datatest = JSON.parse(JSON.stringify(data.tivoliVOS));
                    total = data.pageVO['totalNum'];
                    for (let i = 0; i < datatest.length; i++) {
                        Tivoli_Alarm.push({
                            id: datatest[i].id,
                            ip: datatest[i].ip,
                            host: datatest[i].host,
                            level: datatest[i].warningLevel,
                            info: datatest[i].info,
                            first_time: datatest[i].startTime,
                            last_time: datatest[i].lastTime,
                            count: datatest[i].cumulativeTime,
                            pre_level: datatest[i].originalLevel,
                            type: datatest[i].category,
                            status: datatest[i].status,
                            business: datatest[i].service
                        });
                    }
                }
            });

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        users: Tivoli_Alarm
                    }]);
                }, 1000);
            });
        });

        //删除记录
        mock.onPost('/alarm_tivoli/remove').reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = "[" + id_json.id.toString() + "]";
            let total = 0;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/Tivoli/deleteByIds',
                data: {ids: ids},
                dataType: "json",
                success: function (data) {
                    total = data;
                },error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //批量删除记录
        mock.onPost('/alarm_tivoli/batchremove').reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = "[" + id_json.ids + "]";
            let total = 0;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/Tivoli/deleteByIds',
                data: {ids: ids},
                dataType: "json",
                success: function (data) {
                    total = data;
                },
                error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });


        //============================= 关联关系的数据================================================
        //获取关联关系列表（分页）
        mock.onGet("/rules/listpage").reply(config => {
            let {page} = config.params;
            let rules = [];
            let total;
            $.ajax({
                async: false,
                type: 'get',
                dataType: 'json',
                url: 'http://10.82.82.15/aiops/Correlation/findAllList',
                success: function (data) {
                    total = data.length;
                    for (var i = 0; i < data.length; i++) {
                        rules.push({
                            id: data[i].id,
                            source: data[i].eventA,
                            target: data[i].eventB,
                            confidence: data[i].conf
                        })
                    }
                },
                error: function (data) {
                    console.log('fail to get rules');
                }
            });
            let rules_page = rules.filter((u, index) => index < 10 * page && index >= 10 * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        rules: rules_page
                    }]);
                }, 1000);
            });
        });

        //确认关联关系
        mock.onPost('/rules/confirm').reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = "[" + id_json.id.toString() + "]";
            let total = 0;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/Correlation/confirmSome',
                data: {ids: ids},
                dataType: "json",
                success: function (data) {
                    total = data;
                },error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '添加成功'
                    }]);
                }, 500);
            });
        });

        //批量确认关联关系
        mock.onPost('/rules/batchconfirm').reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = "[" + id_json.ids + "]";
            let total = 0;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/Correlation/confirmSome',
                data: {ids: ids},
                dataType: "json",
                success: function (data) {
                    total = data;
                }, error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '添加成功'
                    }]);
                }, 500);
            });
        });

        //删除关联关系
        mock.onPost('/rules/remove').reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = "[" + id_json.id.toString() + "]";
            let total = 0;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/Correlation/deleteSome',
                data: {ids: ids},
                dataType: "json",
                success: function (data) {
                    total = data;
                },error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //批量删除关联关系
        mock.onPost('/rules/batchremove').reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = "[" + id_json.ids + "]";
            let total = 0;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/Correlation/deleteSome',
                data: {ids: ids},
                dataType: "json",
                success: function (data) {
                    total = data;
                },error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });


        //============================= 关联规则库的数据================================================
        //获取关联规则库列表（分页）
        mock.onGet("/rules_library/listpage").reply(config => {
            let {page} = config.params;
            let rules = [];
            let total;
            $.ajax({
                async: false,
                type: 'get',
                dataType: 'json',
                url: 'http://10.82.82.15/aiops/CorrelationConfirm/findAllList',
                success: function (data) {
                    total = data.length;
                    for (var i = 0; i < data.length; i++) {
                        rules.push({
                            id: data[i].id,
                            source: data[i].eventA,
                            target: data[i].eventB
                        })
                    }
                },
                error: function (data) {
                    console.log('fail to get rules-library');
                }
            });
            let rules_page = rules.filter((u, index) => index < 10 * page && index >= 10 * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        rules: rules_page
                    }]);
                }, 1000);
            });
        });

        //删除关联规则
        mock.onPost('/rules_library/remove').reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = "[" + id_json.id.toString() + "]";
            let total = 0;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/CorrelationConfirm/deleteSome',
                data: {ids: ids},
                dataType: "json",
                success: function (data) {
                    total = data;
                },error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        //批量删除关联规则
        mock.onPost('/rules_library/batchremove').reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = "[" + id_json.ids + "]";
            let total = 0;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/CorrelationConfirm/deleteSome',
                data: {ids: ids},
                dataType: "json",
                success: function (data) {
                    total = data;
                },error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });


        //============================= 工单管理==============================================
        mock.onPost("/work_order/listpage").reply(config => {
            WorkOrder = [];
            let {page, status, startDate, endDate} = JSON.parse(config.data);
            let data_json = {page: page, status: status};
            if (startDate !== '') data_json['startDate'] = startDate;
            if (endDate !== '') data_json['endDate'] = endDate;
            let totalNum;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/WorkOrder/getAllList',
                data: data_json,
                dataType: "json",
                success: function (data) {
                    var datatest = JSON.parse(JSON.stringify(data.workOrderVOS));
                    totalNum = data.pageVO['totalNum'];
                    for (let i = 0; i < datatest.length; i++) {
                        WorkOrder.push({
                            id: datatest[i].orderId,
                            trigger_time: datatest[i].triggerTime,
                            root_event: datatest[i].rootEvent,
                            info: datatest[i].info,
                            status: datatest[i].status
                        });
                    }
                },
                error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: totalNum,
                        work_order: WorkOrder
                    }]);
                }, 1000);
            });
        });

        //接受工单
        mock.onPost("/work_order/receive").reply(config => {
            let {id} = JSON.parse(config.data);
            console.log(typeof(id));
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/WorkOrder/changeStatus',
                data: {id: id, status: 2},
                dataType: "json",
                success: function (data) {
                },
                error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '接受成功'
                    }]);
                }, 500);
            });
        });

        //拒绝工单
        mock.onPost("/work_order/reject").reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = "[" + id_json.id.toString() + "]";
            let total = 0;
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/WorkOrder/deleteByIds',
                data: {ids: ids},
                dataType: "json",
                success: function (data) {
                    total = data;
                },
                error: function (data) {
                    console.log(data);
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        code: 200,
                        msg: '工单已拒绝'
                    }]);
                }, 500);
            });
        });

        //完成工单
        mock.onPost("/work_order/complete").reply(config => {
            let {id} = JSON.parse(config.data);
            console.log(typeof(id));
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15/aiops/WorkOrder/changeStatus',
                data: {id: id, status: 3},
                dataType: "json",
                success: function (data) {
                },
                error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '工单完成'
                    }]);
                }, 500);
            });
        });

        //============================= 模拟业务迁移 ==========================================
        mock.onGet("/mock_rules/listpage").reply(config => {
            MockRules = [];
            let {page} = config.params;
            $.ajax({
                async: false,
                type: 'get',
                url: 'http://10.82.82.15:8081/aiops_mock/relations',
                dataType: "json",
                success: function (data) {
                    for (let i = 0; i < data.length; i++) {
                        MockRules.push({
                            rId: data[i].rId,
                            rFrom: data[i].rFrom,
                            rTo: data[i].rTo
                        });
                    }
                },
                error: function (data) {
                    console.log(data)
                }
            });
            let totalNum = MockRules.length;
            console.log(totalNum);
            let mockRules = MockRules.filter((u, index) => index < 10 * page && index >= 10 * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: totalNum,
                        last: MockRules[totalNum-1].rId,
                        mockRules: mockRules
                    }]);
                }, 1000);
            });
        });

        mock.onPost('/mock_rules/remove').reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = id_json.id;

            let total = 0;
            $.ajax({
                type: 'delete',
                url: 'http://10.82.82.15:8081/aiops_mock/relation/' + ids,
                dataType: "json",
                success: function (data) {
                    total = data;
                },error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        mock.onPost('/mock_rules/batchremove').reply(config => {
            let id_json = eval('(' + config.data + ')');
            let ids = id_json.ids.split(',');
            let total = 0;
            for(let i = 0; i < ids.length; i++){
                $.ajax({
                    type: 'delete',
                    url: 'http://10.82.82.15:8081/aiops_mock/relation/' + ids[i],
                    dataType: "json",
                    success: function (data) {
                        total = data;
                    },
                    error: function (data) {
                        console.log(data)
                    }
                });
            }
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '删除成功'
                    }]);
                }, 500);
            });
        });

        mock.onPost('/mock_rules/edit').reply(config => {
            let json = eval('(' + config.data + ')');
            let id = json.rId;
            let from = json.rFrom;
            let to = json.rTo;
            let total = 0;
            console.log(typeof (id), typeof (from), typeof (to));
            $.ajax({
                type: 'put',
                url: 'http://10.82.82.15:8081/aiops_mock/relation',
                data: {rId: id, rFrom: from, rTo: to},
                dataType: "json",
                success: function (data) {
                    total = data;
                },error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '修改成功'
                    }]);
                }, 500);
            });

        });

        mock.onPost('/mock_rules/add').reply(config => {
            let json = eval('(' + config.data + ')');
            let id = json.rId;
            let from = json.rFrom;
            let to = json.rTo;
            let total = 0;
            console.log(typeof (id), typeof (from), typeof (to));
            $.ajax({
                type: 'post',
                url: 'http://10.82.82.15:8081/aiops_mock/relation/',
                data: {rFrom: from, rTo: to},
                dataType: "json",
                success: function (data) {
                    total = data;
                },error: function (data) {
                    console.log(data)
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        num: total,
                        code: 200,
                        msg: '新增成功'
                    }]);
                }, 500);
            });

        });

        mock.onPost('/mock_rules/newData').reply(config => {
            let day_json = eval('(' + config.data + ')');
            let day = day_json.days;
            $.ajax({
                async: false,
                type: 'post',
                dataType: 'json',
                data: {days: day},
                url: 'http://10.82.82.15:8081/aiops_mock/alarmMock',
                success: function (data) {
                    console.log('模拟数据生成成功！');
                },
                error: function (data) {
                    console.log('fail to get bpc events');
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '修改成功'
                    }]);
                }, 500);
            });

        });
    }
};