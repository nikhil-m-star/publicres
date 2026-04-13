import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { useEffect, useCallback } from 'react'
import { api, setAuthToken } from '../api/client'

export function useAuthSync() {
    const { getToken, isSignedIn } = useAuth()
    
    const syncToken = useCallback(async () => {
        if (!isSignedIn) {
            setAuthToken(null)
            return
        }
        try {
            const token = await getToken()
            if (token) setAuthToken(token)
        } catch (error) {
            console.error("Token sync failed", error)
        }
    }, [isSignedIn, getToken])

    useEffect(() => {
        syncToken()
    }, [syncToken])
}

export function useIssues(params = {}) {
    return useQuery({
        queryKey: ['issues', params],
        queryFn: () => api.getIssues(params),
    })
}

export function useAdminIssues(params = {}) {
    const { getToken, isSignedIn } = useAuth()
    return useQuery({
        queryKey: ['admin-issues', params],
        queryFn: async () => {
            const token = await getToken()
            setAuthToken(token)
            return api.getAdminIssues(params)
        },
        enabled: isSignedIn,
    })
}

export function useIssuesScope(scope = 'all', params = {}) {
    const { getToken, isSignedIn } = useAuth()
    return useQuery({
        queryKey: ['issues', scope, params],
        queryFn: async () => {
            if (scope === 'mine') {
                const token = await getToken()
                setAuthToken(token)
                return api.getMyIssues(params)
            }
            return api.getIssues(params)
        },
        enabled: scope !== 'mine' || isSignedIn,
    })
}

export function useIssue(id) {
    return useQuery({
        queryKey: ['issue', id],
        queryFn: () => api.getIssue(id),
        enabled: !!id,
    })
}

export function useCreateIssue() {
    const queryClient = useQueryClient()
    const { getToken } = useAuth()
    return useMutation({
        mutationFn: async (formData) => {
            const token = await getToken()
            setAuthToken(token)
            return api.createIssue(formData)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
    })
}

export function useVoteIssue() {
    const queryClient = useQueryClient()
    const { getToken } = useAuth()
    return useMutation({
        mutationFn: async (id) => {
            const token = await getToken()
            setAuthToken(token)
            return api.voteIssue(id)
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['issue', id] })
            queryClient.invalidateQueries({ queryKey: ['issues'] })
        },
    })
}

export function useAddComment() {
    const queryClient = useQueryClient()
    const { getToken } = useAuth()
    return useMutation({
        mutationFn: async ({ id, comment }) => {
            const token = await getToken()
            setAuthToken(token)
            return api.addComment({ id, comment })
        },
        onSuccess: (_, { id }) => queryClient.invalidateQueries({ queryKey: ['issue', id] }),
    })
}

export function useRateOfficer() {
    const queryClient = useQueryClient()
    const { getToken } = useAuth()
    return useMutation({
        mutationFn: async ({ id, score, feedback }) => {
            const token = await getToken()
            setAuthToken(token)
            return api.rateOfficer({ id, score, feedback })
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['issue', id] })
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
        },
    })
}

export function useRateOfficerGeneral() {
    const queryClient = useQueryClient()
    const { getToken } = useAuth()
    return useMutation({
        mutationFn: async ({ id, score, feedback }) => {
            const token = await getToken()
            setAuthToken(token)
            return api.rateOfficerGeneral({ id, score, feedback })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
        },
    })
}

export function useUpdateStatus() {
    const queryClient = useQueryClient()
    const { getToken } = useAuth()
    return useMutation({
        mutationFn: async ({ id, status, department }) => {
            const token = await getToken()
            setAuthToken(token)
            return api.updateStatus({ id, status, department })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues'] })
            queryClient.invalidateQueries({ queryKey: ['analytics'] })
        },
    })
}

export function useAnalytics() {
    const { getToken } = useAuth()
    return useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const token = await getToken()
            setAuthToken(token)
            return api.getAnalytics()
        },
    })
}

export function useStats() {
    return useQuery({
        queryKey: ['stats'],
        queryFn: () => api.getStats(),
    })
}

export function useLeaderboard() {
    return useQuery({
        queryKey: ['leaderboard'],
        queryFn: () => api.getLeaderboard(),
    })
}

export function useUsers() {
    const { getToken } = useAuth()
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const token = await getToken()
            setAuthToken(token)
            return api.getUsers()
        },
    })
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient()
    const { getToken } = useAuth()
    return useMutation({
        mutationFn: async ({ id, role, area }) => {
            const token = await getToken()
            setAuthToken(token)
            return api.updateUserRole({ id, role, area })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] })
        },
    })
}
