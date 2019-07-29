<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="12">
            <div id="myCharts" style="width:1500px; height:780px;"></div>
        </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'
    import $ from 'jquery'
    import * as dataTool from '../../api/dataTool'

    export default {
        data() {
            return {
                myCharts: null
            }
        },

        methods: {
            drawMyCharts() {
                var myCharts = echarts.init(document.getElementById('myCharts'));

                myCharts.showLoading();
                $.ajax({
                    async: false,
                    type: 'get',
                    url: 'http://10.82.82.15:8081/aiops_mock/nodesAndEdges',
                    dataType: "json",
                    success: function (data) {
                        myCharts.hideLoading();
                        var graph = JSON.parse(JSON.stringify(data));

                        var categories = [{name: 'Tivoli表'}, {name: 'BPC表'}];

                        var cntId = 0;
                        graph.edges.forEach(function (edge) {
                            edge.id =cntId.toString();
                            cntId++;
                        });

                        var cnt = 0;
                        var nodeWeight = 0;
                        graph.nodes.forEach(function (node) {
                            nodeWeight += node.size;
                            cnt++;

                            if (node.category === "Tivoli") {
                                node.category = 0;
                            } else {
                                node.category = 1;
                            }
                            node.symbolSize = node.size;
                        });
                        var averageWeight = nodeWeight / cnt;

                        graph.nodes.forEach(function (node) {
                            node.itemStyle = null;
                            node.value = node.symbolSize;
                            node.symbolSize /= 1.5;
                            node.label = {
                                normal: {
                                    show: node.symbolSize > averageWeight
                                }
                            };
                        });
                        console.log(graph)

                        var option = {
                            tooltip: {},
                            legend: [{
                                // selectedMode: 'single',
                                data: categories.map(function (a) {
                                    return a.name;
                                })
                            }],
                            animationDuration: 1500,
                            animationEasingUpdate: 'quinticInOut',
                            series : [
                                {
                                    name: 'Topological Relationship',
                                    type: 'graph',
                                    layout: 'force',
                                    edgeSymbol:['', 'arrow'],
                                    data: graph.nodes,
                                    links: graph.edges,
                                    draggable: true,
                                    categories: categories,
                                    roam: true,
                                    focusNodeAdjacency: true,
                                    itemStyle: {
                                        normal: {
                                            borderColor: '#fff',
                                            borderWidth: 1,
                                            shadowBlur: 10,
                                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                                        }
                                    },
                                    label: {
                                        position: 'right',
                                        formatter: '{b}'
                                    },
                                    lineStyle: {
                                        color: 'source',
                                        normal: { curveness: 0.2 }
                                    },
                                    force: {
                                        repulsion: 900,
                                        gravity: 0.05,
                                        edgeLength: [150, 550]
                                    },
                                    emphasis: {
                                        lineStyle: {
                                            width: 10
                                        }
                                    }
                                }
                            ]
                        };

                        myCharts.setOption(option);
                    },
                    error: function (data) {
                        console.log('fail');
                    }
                });
                // $.get('../../../static/topological-relationship.gexf', function (xml) {
                //     myCharts.hideLoading();
                //     var graph = dataTool.gexf.parse(xml);
                //     var categories = [{name: 'Tivoli表'}, {name: 'BPC表'}];
                //
                //     var cnt = 0;
                //     var nodeWeight = 0;
                //     graph.nodes.forEach(function (node) {
                //         nodeWeight += node.symbolSize;
                //         cnt++;
                //     });
                //     var averageWeight = nodeWeight / cnt;
                //
                //     graph.nodes.forEach(function (node) {
                //         node.itemStyle = null;
                //         node.value = node.symbolSize;
                //         node.symbolSize /= 1.5;
                //         node.label = {
                //             normal: {
                //                 show: node.symbolSize > averageWeight
                //             }
                //         };
                //         node.category = node.attributes.modularity_class;
                //     });
                //     console.log(graph)
                //     var option = {
                //         tooltip: {},
                //         legend: [{
                //             // selectedMode: 'single',
                //             data: categories.map(function (a) {
                //                 return a.name;
                //             })
                //         }],
                //         animationDuration: 1500,
                //         animationEasingUpdate: 'quinticInOut',
                //         series : [
                //             {
                //                 name: 'Topological Relationship',
                //                 type: 'graph',
                //                 layout: 'force',
                //                 edgeSymbol:['', 'arrow'],
                //                 data: graph.nodes,
                //                 links: graph.links,
                //                 draggable: true,
                //                 categories: categories,
                //                 roam: true,
                //                 focusNodeAdjacency: true,
                //                 itemStyle: {
                //                     normal: {
                //                         borderColor: '#fff',
                //                         borderWidth: 1,
                //                         shadowBlur: 10,
                //                         shadowColor: 'rgba(0, 0, 0, 0.3)'
                //                     }
                //                 },
                //                 label: {
                //                     position: 'right',
                //                     formatter: '{b}'
                //                 },
                //                 lineStyle: {
                //                     color: 'source',
                //                     normal: { curveness: 0.2 }
                //                 },
                //                 force: {
                //                     repulsion: 900,
                //                     gravity: 0.05,
                //                     edgeLength: [150, 550]
                //                 },
                //                 emphasis: {
                //                     lineStyle: {
                //                         width: 10
                //                     }
                //                 }
                //             }
                //         ]
                //     };
                //
                //     myCharts.setOption(option);
                // }, 'xml');
            },

            drawCharts() {
                this.drawMyCharts();
            },
        },

        mounted: function () {
            this.drawCharts()
        },
        updated: function () {
            this.drawCharts()
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }

    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
