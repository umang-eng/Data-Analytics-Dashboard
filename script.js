// This script runs after the HTML document has been fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://127.0.0.1:5000/api/data';
    const dashboardGrid = document.getElementById('dashboard-grid');
    const loadingIndicator = document.getElementById('loading-indicator');

    // --- Helper Functions ---

    /**
     * Creates a card component with a header and content area.
     * @param {string} title - The title for the card header.
     * @param {string} contentHtml - The HTML string for the card's content.
     * @param {string} iconSvg - The SVG string for the icon in the header.
     * @param {string} gridSpan - Tailwind class for column span (e.g., 'lg:col-span-2').
     * @returns {string} - The complete HTML string for the card.
     */
    const createCard = (title, contentHtml, iconSvg = '', gridSpan = '') => {
        return `
            <div class="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 ${gridSpan}">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-200">${title}</h3>
                    ${iconSvg}
                </div>
                <div>${contentHtml}</div>
            </div>
        `;
    };

    /**
     * Formats a number as a currency string.
     * @param {number} value - The number to format.
     * @returns {string} - Formatted currency string (e.g., "$45,231.89").
     */
    const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    // --- SVG Icons ---
    const icons = {
        dollar: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
        users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
        creditCard: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
        activity: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
        arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
        arrowDown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`
    };

    // --- Component Rendering Functions ---

    const renderKpiCards = (kpiData) => {
        const { total_revenue, subscriptions, sales, active_now } = kpiData;

        const revenueContent = `
            <p class="text-3xl font-bold">${formatCurrency(total_revenue.value)}</p>
            <div class="flex items-center text-sm text-green-400 mt-2">
                ${icons.arrowUp}
                <span>+${total_revenue.change}% from last month</span>
            </div>`;

        const subscriptionsContent = `
            <p class="text-3xl font-bold">+${subscriptions.value.toLocaleString()}</p>
            <div class="flex items-center text-green-400 text-sm mt-2">
                ${icons.arrowUp}
                <span>+${subscriptions.change}% from last month</span>
            </div>`;

        const salesContent = `
            <p class="text-3xl font-bold">+${sales.value.toLocaleString()}</p>
            <div class="flex items-center ${sales.change > 0 ? 'text-green-400' : 'text-red-400'} text-sm mt-2">
                ${sales.change > 0 ? icons.arrowUp : icons.arrowDown}
                <span>${sales.change}% from last month</span>
            </div>`;

        const activeNowContent = `
            <p class="text-3xl font-bold">+${active_now.value}</p>
            <div class="flex items-center text-gray-400 text-sm mt-2">
                <span>${active_now.change_label}</span>
            </div>`;

        return [
            createCard('Total Revenue', revenueContent, icons.dollar),
            createCard('Subscriptions', subscriptionsContent, icons.users),
            createCard('Sales', salesContent, icons.creditCard),
            createCard('Active Now', activeNowContent, icons.activity)
        ].join('');
    };
    
    const renderRevenueChart = (data) => {
        const chartHtml = `<div class="h-80"><canvas id="revenueChart"></canvas></div>`;
        const cardHtml = createCard('Revenue Overview', chartHtml, '', 'lg:col-span-2');
        dashboardGrid.insertAdjacentHTML('beforeend', cardHtml);

        const ctx = document.getElementById('revenueChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.name),
                datasets: [
                    {
                        label: 'Revenue',
                        data: data.map(d => d.revenue),
                        borderColor: '#82ca9d',
                        backgroundColor: 'rgba(130, 202, 157, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Profit',
                        data: data.map(d => d.profit),
                        borderColor: '#8884d8',
                        backgroundColor: 'rgba(136, 132, 216, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#A0AEC0' } } },
                scales: {
                    x: { ticks: { color: '#A0AEC0' }, grid: { color: 'rgba(74, 85, 104, 0.3)' } },
                    y: { ticks: { color: '#A0AEC0' }, grid: { color: 'rgba(74, 85, 104, 0.3)' } }
                }
            }
        });
    };

    const renderRecentSales = (data) => {
        const rows = data.map(sale => `
            <tr class="border-b border-gray-700 hover:bg-gray-700/50">
                <td class="px-6 py-4 font-medium whitespace-nowrap">${sale.name}</td>
                <td class="px-6 py-4 text-gray-400 hidden sm:table-cell">${sale.email}</td>
                <td class="px-6 py-4">${sale.amount}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                        sale.status === 'Paid' ? 'bg-green-500/20 text-green-400' :
                        sale.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                    }">${sale.status}</span>
                </td>
            </tr>
        `).join('');

        const tableHtml = `
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="text-xs text-gray-400 uppercase bg-gray-700/50">
                        <tr>
                            <th scope="col" class="px-6 py-3">Customer</th>
                            <th scope="col" class="px-6 py-3 hidden sm:table-cell">Email</th>
                            <th scope="col" class="px-6 py-3">Amount</th>
                            <th scope="col" class="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
        const cardHtml = createCard('Recent Sales', tableHtml, '', 'lg:col-span-2');
        dashboardGrid.insertAdjacentHTML('beforeend', cardHtml);
    };

    const renderSalesByCountry = (data) => {
        const chartHtml = `<div class="h-80"><canvas id="salesByCountryChart"></canvas></div>`;
        const cardHtml = createCard('Sales by Country', chartHtml, '', 'lg:col-span-2');
        dashboardGrid.insertAdjacentHTML('beforeend', cardHtml);

        const ctx = document.getElementById('salesByCountryChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.name),
                datasets: [{
                    label: 'Sales',
                    data: data.map(d => d.sales),
                    backgroundColor: '#8884d8',
                    borderColor: '#6c68b5',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#A0AEC0' }, grid: { color: 'rgba(74, 85, 104, 0.3)' } },
                    y: { ticks: { color: '#A0AEC0' }, grid: { display: false } }
                }
            }
        });
    };

    const renderUserActivity = (data) => {
        const chartHtml = `<div class="h-80 flex items-center justify-center"><canvas id="userActivityChart"></canvas></div>`;
        const cardHtml = createCard('User Activity by Age', chartHtml, '', 'lg:col-span-2');
        dashboardGrid.insertAdjacentHTML('beforeend', cardHtml);

        const ctx = document.getElementById('userActivityChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(d => d.name),
                datasets: [{
                    label: 'User Activity %',
                    data: data.map(d => d.uv),
                    backgroundColor: data.map(d => d.fill),
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#A0AEC0' }
                    }
                }
            }
        });
    };

    // --- Main Function to Fetch and Render Data ---
    const initializeDashboard = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            // Clear loading indicator
            loadingIndicator.remove();

            // Render all components
            const kpiCardsHtml = renderKpiCards(data.kpi);
            dashboardGrid.insertAdjacentHTML('beforeend', kpiCardsHtml);
            
            renderRevenueChart(data.revenue_overview);
            renderRecentSales(data.recent_sales);
            renderSalesByCountry(data.sales_by_country);
            renderUserActivity(data.user_activity_by_age);

        } catch (error) {
            console.error("Failed to fetch or render dashboard:", error);
            loadingIndicator.innerHTML = `<p class="text-lg text-red-400">Failed to load dashboard data. Make sure the Python server is running.</p>`;
        }
    };

    // Start the process
    initializeDashboard();
});
