import axios from 'axios'

let base = '';

export const requestLogin = params => {
    return axios.post(`${base}/login`, params).then(res => res.data);
};

// export const getAlarmList = params => { return axios.get(`${base}/alarm_data/list`, { params: params }); };

export const getWorkOrderListPage = params => {
    return axios.post(`${base}/work_order/listpage`, params).then(res => res.data);
};

export const receiveWorkOrder = params => {
    return axios.post(`${base}/work_order/receive`, params).then(res => res.data);
};

export const completeWorkOrder = params => {
    return axios.post(`${base}/work_order/complete`, params).then(res => res.data);
};

export const rejectWorkOrder = params => {
    return axios.post(`${base}/work_order/reject`, params).then(res => res.data);
};

export const getBPCAlarmListPage = params => {
    return axios.post(`${base}/alarm_bpc/listpage`, params).then(res => res.data);
};

export const removeBPCAlarm = params => {
    return axios.post(`${base}/alarm_bpc/remove`, params).then(res => res.data);
};

export const batchRemoveBPCAlarm = params => {
    return axios.post(`${base}/alarm_bpc/batchremove`, params).then(res => res.data);
};

export const getTivoliAlarmListPage = params => {
    return axios.post(`${base}/alarm_tivoli/listpage`, params).then(res => res.data);
};

export const removeTivoliAlarm = params => {
    return axios.post(`${base}/alarm_tivoli/remove`, params).then(res => res.data);
};

export const batchRemoveTivoliAlarm = params => {
    return axios.post(`${base}/alarm_tivoli/batchremove`, params).then(res => res.data);
};

export const getRulesListPage = params => {
    return axios.get(`${base}/rules/listpage`, {params: params});
};

export const confirmRules = params => {
    return axios.post(`${base}/rules/confirm`, params).then(res => res.data);
};

export const batchConfirmRules = params => {
    return axios.post(`${base}/rules/batchconfirm`, params).then(res => res.data);
};

export const removeRules = params => {
    return axios.post(`${base}/rules/remove`, params).then(res => res.data);
};

export const batchRemoveRules = params => {
    return axios.post(`${base}/rules/batchremove`, params).then(res => res.data);
};

export const getRulesLibraryListPage = params => {
    return axios.get(`${base}/rules_library/listpage`, {params: params});
};

export const removeRulesLibrary = params => {
    return axios.post(`${base}/rules_library/remove`, params).then(res => res.data);
};

export const batchRemoveRulesLibrary = params => {
    return axios.post(`${base}/rules_library/batchremove`, params).then(res => res.data);
};

export const getMockRules = params => {
    return axios.get(`${base}/mock_rules/listpage`, {params: params});
};

export const removeMockRules = params => {
    return axios.post(`${base}/mock_rules/remove`, params).then(res => res.data);
};

export const batchRemoveMockRules = params => {
    return axios.post(`${base}/mock_rules/batchremove`, params).then(res => res.data);
};

export const editRules = params => {
    return axios.post(`${base}/mock_rules/edit`, params).then(res => res.data);
}

export const addRules = params => {
    return axios.post(`${base}/mock_rules/add`, params).then(res => res.data);
}

export const newData = params => {
    return axios.post(`${base}/mock_rules/newData`, params).then(res => res.data);
}
//export const editUser = params => { return axios.get(`${base}/alarm_data/edit`, { params: params }); };

//export const addUser = params => { return axios.get(`${base}/alarm_data/add`, { params: params }); };