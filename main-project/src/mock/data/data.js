import Mock from 'mockjs';
import axios from 'axios'
import util from '../../common/js/util'
import avatarPNG from '../../assets/user.png'

const LoginUsers = [
    {
        id: 1,
        username: 'admin',
        password: '123456',
        avatar: avatarPNG,
        name: 'admin'
    },
    {
        id: 2,
        username: 'ops',
        password: '123456',
        avatar: avatarPNG,
        name: 'ops'
    }
];

const BPC = [];
const Tivoli = [];
const Rules = [];
const RulesLibrary = [];

// axios.get('../../static/BPC.txt', {
//     params: { 'key': 'value' }
// }).then(function (response) {
//     let tmp = response.data.split('\n');
//     for(let i = 0; i < tmp.length; i++){
//         let Alarm_item = tmp[i].split(',');
//         BPC.push(Mock.mock({
//             id: i.toString(),
//             last_time: Alarm_item[0],
//             source: Alarm_item[1],
//             event: Alarm_item[2],
//             last_value: Alarm_item[3],
//             threshold: Alarm_item[4],
//             trigger_time: Alarm_item[5],
//             persist: Alarm_item[6],
//             state: Alarm_item[7],
//             type: Alarm_item[8],
//             peek_value: Alarm_item[9],
//             ip: Alarm_item[10]
//         }));
//     }
// }).catch(function (error) {
//     alert(error);
// });

// axios.get('../../static/Tivoli.txt', {
//     params: {'key': 'value'}
// }).then(function (response) {
//     let tmp = response.data.split('\n');
//     for (let i = 0; i < tmp.length; i++) {
//         let Alarm_item = tmp[i].split('\t');
//         Tivoli.push(Mock.mock({
//             id: i.toString(),
//             ip: Alarm_item[0],
//             host: Alarm_item[1],
//             level: Alarm_item[2],
//             info: Alarm_item[3],
//             first_time: Alarm_item[4],
//             last_time: Alarm_item[5],
//             count: Alarm_item[6],
//             pre_level: Alarm_item[7],
//             network: Alarm_item[8],
//             type: Alarm_item[9],
//             state: Alarm_item[10],
//             business: Alarm_item[11],
//         }));
//         // alert(Tivoli[i].host);
//     }
// }).catch(function (error) {
//     alert(error);
// });

// axios.get('../../static/Rules.txt', {
//     params: { 'key': 'value' }
// }).then(function (response) {
//     let tmp = response.data.split('\n');
//     for(let i = 0; i < tmp.length; i++){
//         let Rule_item = tmp[i].split('\t');
//         Rules.push(Mock.mock({
//             id: i.toString(),
//             source: Rule_item[0],
//             target: Rule_item[1],
//             confidence: Rule_item[2]
//         }));
//     }
// }).catch(function (error) {
//     alert(error.response);
// });
//
// axios.get('../../static/rules-library.txt', {
//     params: { 'key': 'value' }
// }).then(function (response) {
//     let tmp = response.data.split('\n');
//     for(let i = 0; i < tmp.length; i++){
//         let Rule_item = tmp[i].split('\t');
//         RulesLibrary.push(Mock.mock({
//             id: i.toString(),
//             source: Rule_item[0],
//             target: Rule_item[1]
//         }));
//     }
// }).catch(function (error) {
//     alert(error.response);
// });
//
// export {LoginUsers, Rules, RulesLibrary};
