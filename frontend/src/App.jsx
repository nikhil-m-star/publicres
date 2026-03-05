import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import IssueDetails from './pages/IssueDetails'
import AdminDashboard from './pages/AdminDashboard'
import MapExplorer from './pages/MapExplorer'
import Leaderboard from './pages/Leaderboard'
import AdminVerification from './pages/AdminVerification'
import BriberyBoard from './pages/BriberyBoard'

function ProtectedRoute({ children }) {
    return (
        <>
            <SignedIn>{children}</SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/issues/:id" element={<IssueDetails />} />
                <Route path="/map" element={<MapExplorer />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/verify-admin"
                    element={
                        <ProtectedRoute>
                            <AdminVerification />
                        </ProtectedRoute>
                    }
                />
                <Route path="/bribery" element={<BriberyBoard />} />
            </Routes>
        </div>
    )
}
