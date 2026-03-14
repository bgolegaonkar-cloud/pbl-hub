import React from 'react';

const ContributionGraph = ({ submissions }) => {
    // Process submissions to get counts by date string (YYYY-MM-DD)
    const submissionCounts = submissions.reduce((acc, sub) => {
        const date = new Date(sub.createdAt).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    // Generate date grid for the last 365 days (approx 52 weeks)
    const today = new Date();
    const daysToShow = 365;
    const dates = [];

    for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date);
    }

    // Helper to determine color based on count
    const getColor = (count) => {
        if (!count) return 'bg-gray-100';
        if (count === 1) return 'bg-green-200';
        if (count === 2) return 'bg-green-300';
        if (count === 3) return 'bg-green-400';
        return 'bg-green-600';
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Group dates into weeks for the grid
    const weeks = [];
    let currentWeek = [];

    // Align the start to Sunday if needed, but for simplicity we'll just chunk them
    dates.forEach((date, index) => {
        currentWeek.push(date);
        if (currentWeek.length === 7 || index === dates.length - 1) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Contributions Calendar</h3>
                <p className="text-sm text-gray-500">{submissions.length} tasks submitted last year</p>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-2">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((date, dayIndex) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const count = submissionCounts[dateStr];
                            return (
                                <div
                                    key={dayIndex}
                                    title={`${dateStr}: ${count || 0} submissions`}
                                    className={`w-3 h-3 rounded-sm ${getColor(count)} transition-colors hover:ring-1 hover:ring-gray-400`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500">
                <span>Less</span>
                <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ContributionGraph;
