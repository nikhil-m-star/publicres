import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#ef4444', '#f59e0b', '#22c55e']
const CATEGORY_COLORS = ['#f97316', '#22c55e', '#eab308', '#3b82f6', '#6b7280']

const statusLabels = { REPORTED: 'Reported', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved' }
const categoryLabels = { POTHOLE: 'Pothole', GARBAGE: 'Garbage', STREETLIGHT: 'Streetlight', WATER_LEAK: 'Water Leak', OTHER: 'Other' }

export default function AnalyticsCharts({ data }) {
    if (!data) return null

    const statusData = (data.byStatus || []).map((s, i) => ({
        name: statusLabels[s.status] || s.status,
        value: s.count,
        fill: COLORS[i % COLORS.length],
    }))

    const categoryData = (data.byCategory || []).map((c, i) => ({
        name: categoryLabels[c.category] || c.category,
        count: c.count,
        fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }))

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status pie chart */}
            <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Issues by Status</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {statusData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category bar chart */}
            <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Issues by Category</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData} barSize={36}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                            />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                {categoryData.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
