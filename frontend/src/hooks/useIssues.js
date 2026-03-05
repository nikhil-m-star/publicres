import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { api, setAuthToken } from '../api/client'

export function useAuthSync() {
    const { getToken, isSignedIn } = useAuth()
    useEffect(() => {
        const syncToken = async () => {
            if (isSignedIn) {
                const token = await getToken()
                setAuthToken(token)
            } else {
                setAuthToken(null)
            }
        }
        syncToken()
    }, [getToken, isSignedIn])
}

export function useIssues(params = {}) {
    return useQuery({
        queryKey: ['issues', params],
        queryFn: () => api.getIssues(params),
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
