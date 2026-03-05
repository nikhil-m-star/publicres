import ReportsBoard from '../components/ReportsBoard'

export default function Dashboard() {
    return (
        <div className="page-container">
            <ReportsBoard
                scope="mine"
                title="My Reports"
                subtitle="Track the civic issues you have reported and their status."
                emptySubtitle="Submit your first report and it will show up here."
            />
        </div>
    )
}
