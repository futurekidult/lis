import axios from '../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      organizationList: [],
      organizationLoading: true,
      privilegeList: [],
      privilegeLoading: true,
      systemRoleList: [],
      systemRoleLoading: true,
      roleRelatedMemberList: [],
      roleRelatedMemberListLength: 0,
      systemRole: {},
      adminList: [],
      adminLoading: true,
      adminRole: {}
    };
  },
  mutations: {
    setOrganizationList(state, payload) {
      state.organizationList = payload;
    },
    setOrganizationLoading(state, payload) {
      state.organizationLoading = payload;
    },
    setPrivilegeList(state, payload) {
      state.privilegeList = payload;
    },
    setPrivilegeLoading(state, payload) {
      state.privilegeLoading = payload;
    },
    setSystemRoleList(state, payload) {
      state.systemRoleList = payload;
    },
    setSystemRoleLoading(state, payload) {
      state.systemRoleLoading = payload;
    },
    setRoleRelatedMemberList(state, payload) {
      state.roleRelatedMemberList = payload.list;
      state.roleRelatedMemberListLength = payload.total;
    },
    setSystemRole(state, payload) {
      state.systemRole = payload;
    },
    setAdminList(state, payload) {
      state.adminList = payload;
    },
    setAdminLoading(state, payload) {
      state.adminLoading = payload;
    },
    setAdminRole(state, payload) {
      state.adminRole = payload;
    }
  },
  actions: {
    async getOrganizationList(context) {
      await axios.get('/system/department-list').then((res) => {
        if (res.code === 200) {
          context.commit('setOrganizationList', res.data.list);
          context.commit('setOrganizationLoading', false);
        }
      });
    },
    async getPrivilegeList(context, payload) {
      await axios.get('/system/privilege-list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPrivilegeList', res.data.list);
          context.commit('setPrivilegeLoading', false);
        }
      });
    },
    async getSystemRoleList(context) {
      await axios.get('/system/role-list').then((res) => {
        if (res.code === 200) {
          context.commit('setSystemRoleList', res.data.list);
          context.commit('setSystemRoleLoading', false);
        }
      });
    },
    async createRole(_, payload) {
      await axios.post('/system/role/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updateSystemRole(_, payload) {
      await axios.post('/system/role/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async deleteRole(_, payload) {
      await axios.post('/system/role/delete', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getRoleRelatedMemberList(context, payload) {
      await axios.get('/system/role/admin-list', payload).then((res) => {
        if (res.code === 200) {
          let data = {
            list: res.data.list,
            total: res.data.total
          };
          context.commit('setRoleRelatedMemberList', data);
        }
      });
    },
    async getSystemRole(context, payload) {
      await axios.get('/system/role/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSystemRole', res.data);
        }
      });
    },
    async getAdminList(context, payload) {
      await axios.get('/system/admin-list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setAdminList', res.data.list);
          context.commit('setAdminLoading', false);
          context.state.adminListLength = res.data.total;
        }
      });
    },
    async updateAdminRole(_, payload) {
      await axios.post('/system/admin/role-update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async getAdminRole(context, payload) {
      await axios.get('/system/admin/role-get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setAdminRole', res.data);
        }
      });
    }
  }
};
