// ===== Chart.js Configuration =====
import Chart from 'chart.js/auto';

const chartColors = {
    gold: '#D4A847',
    goldLight: '#E8C96A',
    goldDim: 'rgba(212, 168, 71, 0.3)',
    cream: '#F5E6CC',
    wood: '#8B6914',
    bg: '#1a1a1a',
    border: 'rgba(212, 168, 71, 0.15)',
    green: '#27ae60',
    blue: '#3498db',
    purple: '#9b59b6',
};

// Global Chart.js defaults
Chart.defaults.color = 'rgba(245, 230, 204, 0.6)';
Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';
Chart.defaults.font.family = "'Inter', sans-serif";

export function createRevenueChart(ctx, labels, data) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx: c, chartArea } = chart;
                    if (!chartArea) return chartColors.goldDim;
                    const gradient = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, 'rgba(212, 168, 71, 0.1)');
                    gradient.addColorStop(1, 'rgba(212, 168, 71, 0.6)');
                    return gradient;
                },
                borderColor: chartColors.gold,
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 10, 0.9)',
                    titleColor: chartColors.cream,
                    bodyColor: chartColors.gold,
                    borderColor: chartColors.border,
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (ctx) => `${new Intl.NumberFormat('vi-VN').format(ctx.raw)}đ`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    ticks: {
                        callback: (value) => {
                            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                            if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
                            return value;
                        }
                    }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

export function createCategoryChart(ctx, labels, data) {
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    chartColors.gold,
                    chartColors.green,
                    chartColors.purple,
                    chartColors.blue,
                ],
                borderColor: chartColors.bg,
                borderWidth: 3,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyleWidth: 10,
                        font: { size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 10, 0.9)',
                    titleColor: chartColors.cream,
                    bodyColor: chartColors.gold,
                    borderColor: chartColors.border,
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                }
            }
        }
    });
}
