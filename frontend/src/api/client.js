import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://10.100.9.171:5000/api'

const client = axios.create({
    baseURL: API_URL,
})

export const setAuthToken = (token) => {
    if (token) {
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete client.defaults.headers.common['Authorization']
    }
}

export const api = {
    // Issues
    getIssues: (params) => client.get('/issues', { params }).then((r) => r.data),
    getMyIssues: (params) => client.get('/issues/mine', { params }).then((r) => r.data),
    getIssue: (id) => client.get(`/issues/${id}`).then((r) => r.data),
    createIssue: (formData) =>
        client.post('/issues', formData).then((r) => r.data),

    // Public stats & Reports
    getStats: () => client.get('/issues/stats').then((r) => r.data),
    getCityReport: ({ area, city }) => client.get('/issues/city-report', { params: { area, city } }).then((r) => r.data),

    // Public leaderboard
    getLeaderboard: () => client.get('/issues/leaderboard').then((r) => r.data),

    // Votes
    voteIssue: (id) => client.post(`/issues/${id}/vote`).then((r) => r.data),

    // Comments
    addComment: ({ id, comment }) => client.post(`/issues/${id}/comment`, { comment }).then((r) => r.data),

    // Rate officer
    rateOfficer: ({ id, score, feedback }) => client.post(`/issues/${id}/rate`, { score, feedback }).then((r) => r.data),

    // Admin
    updateStatus: ({ id, status, department }) =>
        client.put(`/admin/issues/${id}/status`, { status, department }).then((r) => r.data),
    getAdminIssues: (params) => client.get('/admin/issues', { params }).then((r) => r.data),
    getAnalytics: () => client.get('/admin/analytics').then((r) => r.data),
    getMe: () => client.get('/admin/me').then((r) => r.data),

    // President: user management
    getUsers: () => client.get('/admin/users').then((r) => r.data),
    updateUserRole: ({ id, role, area }) => client.put(`/admin/users/${id}/role`, { role, area }).then((r) => r.data),
    rateOfficerGeneral: ({ id, score, feedback }) => client.post(`/admin/users/${id}/rate`, { score, feedback }).then((r) => r.data),

    // Notifications
    getNotifications: () => client.get('/admin/notifications').then((r) => r.data),
    markNotificationRead: (id) => client.put(`/admin/notifications/${id}/read`).then((r) => r.data),

    // Email Domain Admin Verification
    verifyByEmail: (payload) => client.post('/admin/verify-email', payload).then((r) => r.data),
}

export default client
