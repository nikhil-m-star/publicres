import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY')
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ClerkProvider
            publishableKey={clerkPubKey}
            appearance={{
                baseTheme: dark,
                layout: {
                    hidePoweredByClerk: true,
                    socialButtonsPlacement: 'bottom',
                },
                variables: {
                    colorPrimary: '#23e3ff',
                    colorBackground: '#140d09',
                    colorInputBackground: '#1f140e',
                    colorText: '#f6efe4',
                    colorTextSecondary: '#c9b9a3',
                    fontFamily: "'Space Grotesk', sans-serif",
                    borderRadius: '12px',
                },
                elements: {
                    card: 'bg-[#140d09] border border-[#2f1f14] shadow-2xl',
                    headerTitle: 'text-[#f6efe4] font-["Bricolage_Grotesque"] text-2xl tracking-tight',
                    headerSubtitle: 'text-[#c9b9a3]',
                    socialButtonsBlockButton: 'bg-[#1f140e] border-[#2f1f14] text-[#f6efe4] hover:bg-[#2f1f14] transition-all',
                    formButtonPrimary: 'bg-[#23e3ff] text-[#031017] hover:bg-[#7ce9ff] transition-all font-bold py-2.5',
                    footerActionLink: 'text-[#23e3ff] hover:text-[#7ce9ff] font-medium',
                    formFieldInput: 'bg-[#1f140e] border-[#2f1f14] text-[#f6efe4] focus:border-[#23e3ff] transition-all',
                    formFieldLabel: 'text-[#c9b9a3] font-medium',
                    dividerLine: 'bg-[#2f1f14]',
                    dividerText: 'text-[#4a2b1b]',
                    identityPreviewText: 'text-[#f6efe4]',
                    identityPreviewEditButtonIcon: 'text-[#23e3ff]',
                    formResendCodeLink: 'text-[#23e3ff] hover:text-[#7ce9ff]',
                }
            }}
        >
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>
        </ClerkProvider>
    </React.StrictMode>
)

