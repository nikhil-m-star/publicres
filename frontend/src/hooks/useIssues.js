import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { api, setAuthToken } from '../api/client'

/**
 * Hook to sync Clerk auth token with API client.
 */
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

/**
 * Fetch all issues with optional filters.
 */
export function useIssues(params = {}) {
    const { isSignedIn } = useAuth()
    return useQuery({
        queryKey: ['issues', params],
        queryFn: () => api.getIssues(params),
    })
}

/**
 * Fetch a single issue by ID.
 */
export function useIssue(id) {
    return useQuery({
        queryKey: ['issue', id],
        queryFn: () => api.getIssue(id),
        enabled: !!id,
    })
}

/**
 * Create a new issue (with image upload support).
 */
export function useCreateIssue() {
    const queryClient = useQueryClient()
    const { getToken } = useAuth()

    return useMutation({
        mutationFn: async (formData) => {
            const token = await getToken()
            setAuthToken(token)
            return api.createIssue(formData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues'] })
        },
    })
}

/**
 * Toggle vote on an issue.
 */
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

/**
 * Add a comment to an issue.
 */
export function useAddComment() {
    const queryClient = useQueryClient()
    const { getToken } = useAuth()

    return useMutation({
        mutationFn: async ({ id, comment }) => {
            const token = await getToken()
            setAuthToken(token)
            return api.addComment({ id, comment })
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['issue', id] })
        },
    })
}

/**
 * Admin: update issue status.
 */
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

/**
 * Admin: fetch analytics data.
 */
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
