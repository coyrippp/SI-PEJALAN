// Charts for SI-PEJALAN Dashboard
let monthlyChart, typeChart;

function initCharts(reports = []) {
    initMonthlyChart(reports);
    initTypeChart(reports);
}

function initMonthlyChart(reports) {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    // Process data for monthly chart
    const monthlyData = processMonthlyData(reports);
    
    if (monthlyChart) {
        monthlyChart.destroy();
    }
    
    monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthlyData.labels,
            datasets: [
                {
                    label: 'Laporan Baru',
                    data: monthlyData.newReports,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Laporan Selesai',
                    data: monthlyData.completedReports,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Laporan Kerusakan Jalan per Bulan'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Jumlah Laporan'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Bulan'
                    }
                }
            }
        }
    });
}

function initTypeChart(reports) {
    const ctx = document.getElementById('typeChart').getContext('2d');
    
    // Process data for type chart
    const typeData = processTypeData(reports);
    
    if (typeChart) {
        typeChart.destroy();
    }
    
    typeChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: typeData.labels,
            datasets: [{
                data: typeData.counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Distribusi Tipe Kerusakan'
                }
            }
        }
    });
}

function processMonthlyData(reports) {
    // Get last 6 months
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
            year: date.getFullYear(),
            month: date.getMonth(),
            label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`
        });
    }
    
    const newReports = [];
    const completedReports = [];
    
    months.forEach(m => {
        const monthStart = new Date(m.year, m.month, 1);
        const monthEnd = new Date(m.year, m.month + 1, 0, 23, 59, 59);
        
        const newCount = reports.filter(r => {
            const reportDate = new Date(r.createdAt);
            return reportDate >= monthStart && reportDate <= monthEnd;
        }).length;
        
        const completedCount = reports.filter(r => {
            if (r.status !== 'completed') return false;
            
            // Find completion date from timeline
            if (r.timeline) {
                const completionEvent = r.timeline.find(e => 
                    e.title.includes('Selesai') || e.title.includes('selesai')
                );
                if (completionEvent) {
                    const completionDate = new Date(completionEvent.date);
                    return completionDate >= monthStart && completionDate <= monthEnd;
                }
            }
            return false;
        }).length;
        
        newReports.push(newCount);
        completedReports.push(completedCount);
    });
    
    return {
        labels: months.map(m => m.label),
        newReports,
        completedReports
    };
}

function processTypeData(reports) {
    const typeCounts = {
        'berlubang': 0,
        'retak': 0,
        'aus': 0,
        'longsor': 0,
        'lainnya': 0
    };
    
    reports.forEach(report => {
        if (typeCounts.hasOwnProperty(report.type)) {
            typeCounts[report.type]++;
        } else {
            typeCounts['lainnya']++;
        }
    });
    
    const labels = {
        'berlubang': 'Berlubang',
        'retak': 'Retak',
        'aus': 'Permukaan Aus',
        'longsor': 'Longsor',
        'lainnya': 'Lainnya'
    };
    
    return {
        labels: Object.keys(typeCounts).map(key => labels[key]),
        counts: Object.values(typeCounts)
    };
}

function updateCharts(reports) {
    initCharts(reports);
}
