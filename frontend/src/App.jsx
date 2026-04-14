import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import IssueDetails from './pages/IssueDetails'
import Leaderboard from './pages/Leaderboard'
import AdminDashboard from './pages/AdminDashboard'
import MapExplorer from './pages/MapExplorer'
import Profile from './pages/Profile'
import CityReport from './pages/CityReport'
import SubmitIssue from './pages/SubmitIssue'
import CommunityReports from './pages/CommunityReports'

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
        <div className="app-shell">
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
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route path="/report" element={<CityReport />} />
                <Route path="/submit" element={<ProtectedRoute><SubmitIssue /></ProtectedRoute>} />
                <Route path="/community" element={<CommunityReports />} />
            </Routes>
        </div>
    )
}
