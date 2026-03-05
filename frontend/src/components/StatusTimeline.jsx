import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

const steps = [
    { status: 'REPORTED', label: 'Reported', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    { status: 'IN_PROGRESS', label: 'In Progress', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    { status: 'RESOLVED', label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
]

export default function StatusTimeline({ currentStatus }) {
    const currentIndex = steps.findIndex((s) => s.status === currentStatus)

    return (
        <div className="flex items-center gap-0">
            {steps.map((step, i) => {
                const isCompleted = i <= currentIndex
                const isCurrent = i === currentIndex
                const Icon = step.icon

                return (
                    <div key={step.status} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCurrent
                                        ? `${step.bg} ${step.border} ${step.color} ring-4 ring-opacity-20 ${step.status === 'REPORTED' ? 'ring-red-500' : step.status === 'IN_PROGRESS' ? 'ring-amber-500' : 'ring-emerald-500'
                                        }`
                                        : isCompleted
                                            ? `${step.bg} ${step.border} ${step.color}`
                                            : 'bg-gray-50 border-gray-200 text-gray-300'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <span
                                className={`text-xs font-medium mt-2 ${isCompleted ? 'text-gray-700' : 'text-gray-400'
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div
                                className={`h-0.5 flex-1 -mt-5 mx-1 rounded-full transition-colors duration-300 ${i < currentIndex ? 'bg-civic-400' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
