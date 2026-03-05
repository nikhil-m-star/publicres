import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * Set the auth token for API requests.
 */
export const setAuthToken = (token) => {
    if (token) {
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete client.defaults.headers.common['Authorization']
    }
}

// API functions
export const api = {
    // Issues
    getIssues: (params) => client.get('/issues', { params }).then((r) => r.data),
    getIssue: (id) => client.get(`/issues/${id}`).then((r) => r.data),
    createIssue: (formData) =>
        client
            .post('/issues', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((r) => r.data),

    // Public stats (no auth needed)
    getStats: () => client.get('/issues/stats').then((r) => r.data),

    // Votes
    voteIssue: (id) => client.post(`/issues/${id}/vote`).then((r) => r.data),

    // Comments
    addComment: ({ id, comment }) =>
        client.post(`/issues/${id}/comment`, { comment }).then((r) => r.data),

    // Admin
    updateStatus: ({ id, status, department }) =>
        client.put(`/admin/issues/${id}/status`, { status, department }).then((r) => r.data),
    getAnalytics: () => client.get('/admin/analytics').then((r) => r.data),
}

export default client
