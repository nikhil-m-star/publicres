import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../api/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { PlayfulLoader } from '../components/ui/Loading';

export default function Profile() {
    const navigate = useNavigate();
    const { getToken, isSignedIn, isLoaded } = useAuth();
    const [isVerifying, setIsVerifying] = useState(false);

    // 1. Fetch current user data
    const meQuery = useQuery({
        queryKey: ['me'],
        enabled: !!isSignedIn,
        queryFn: async () => {
            const token = await getToken();
            setAuthToken(token);
            return api.getMe();
        },
    });

    // 2. Verification Mutation
    const verifyMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            setAuthToken(token);
            return api.verifyByEmail({});
        },
        onSuccess: (data) => {
            const role = data?.assignedRole || 'CITIZEN';
            if (role === 'OFFICER' || role === 'PRESIDENT') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        },
        onError: () => {
            // Verification failed (maybe not an officer email)
            navigate('/dashboard');
        }
    });

    // 3. Routing Logic
    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) {
            navigate('/');
            return;
        }

        if (meQuery.isSuccess && !isVerifying) {
            const user = meQuery.data?.user;
            const role = user?.role || 'CITIZEN';

            if (role === 'OFFICER' || role === 'PRESIDENT') {
                // Already admin
                navigate('/admin');
            } else if (role === 'CITIZEN') {
                // Auto verify attempt once
                setIsVerifying(true);
                verifyMutation.mutate();
            }
        }
    }, [isLoaded, isSignedIn, meQuery.isSuccess, meQuery.data, navigate, isVerifying, verifyMutation]);

    return (
        <div className="flex items-center justify-center min-h-[60vh] bg-transparent border-none">
            <PlayfulLoader text="Authenticating & Routing..." />
        </div>
    );
}
