// Map functionality for SI-PEJALAN
let homeMap, reportMap, fullMap, detailMap;
let mapMarkers = [];

function initHomeMap(reports = []) {
    homeMap = L.map('map-home').setView([-6.200, 106.816], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(homeMap);
    
    // Add markers for reports
    addMarkersToMap(homeMap, reports.slice(0, 10)); // Show first 10 reports on home map
}

function initReportMap() {
    reportMap = L.map('map-report').setView([-6.200, 106.816], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(reportMap);
    
    // Add click event to set location
    let marker;
    reportMap.on('click', function(e) {
        document.getElementById('report-lat').value = e.latlng.lat.toFixed(6);
        document.getElementById('report-lon').value = e.latlng.lng.toFixed(6);
        
        // Remove existing marker
        if (marker) {
            reportMap.removeLayer(marker);
        }
        
        // Add new marker
        marker = L.marker(e.latlng).addTo(reportMap)
            .bindPopup('Lokasi kerusakan yang dipilih')
            .openPopup();
    });
    
    // Get current location button
    document.getElementById('get-location-btn').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                document.getElementById('report-lat').value = lat.toFixed(6);
                document.getElementById('report-lon').value = lng.toFixed(6);
                
                // Update map view
                reportMap.setView([lat, lng], 16);
                
                // Remove existing marker
                if (marker) {
                    reportMap.removeLayer(marker);
                }
                
                // Add new marker
                marker = L.marker([lat, lng]).addTo(reportMap)
                    .bindPopup('Lokasi Anda')
                    .openPopup();
            }, function(error) {
                alert('Tidak dapat mendapatkan lokasi Anda: ' + error.message);
            });
        } else {
            alert('Browser Anda tidak mendukung geolokasi.');
        }
    });
}

function initFullMap(reports = []) {
    fullMap = L.map('map-full').setView([-6.200, 106.816], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(fullMap);
    
    // Add all markers
    addMarkersToMap(fullMap, reports);
}

function initDetailMap(report) {
    detailMap = L.map('map-detail').setView([report.lat, report.lon], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(detailMap);
    
    // Add marker for the specific report
    const marker = L.marker([report.lat, report.lon]).addTo(detailMap)
        .bindPopup(`
            <b>${report.title}</b><br>
            ${report.address}<br>
            <span class="badge ${getStatusBadgeClass(report.status)}">${getStatusText(report.status)}</span>
            <span class="badge ${getSeverityBadgeClass(report.severity)}">${getSeverityText(report.severity)}</span>
        `)
        .openPopup();
}

function addMarkersToMap(map, reports) {
    // Clear existing markers
    mapMarkers.forEach(marker => map.removeLayer(marker));
    mapMarkers = [];
    
    // Add new markers
    reports.forEach(report => {
        const marker = L.marker([report.lat, report.lon], {
            icon: createCustomIcon(report.status)
        }).addTo(map);
        
        marker.bindPopup(`
            <div>
                <h6>${report.title}</h6>
                <p class="mb-1">${report.address}</p>
                <p class="mb-1"><small>${report.description.substring(0, 100)}...</small></p>
                <div class="mt-2">
                    <span class="badge ${getStatusBadgeClass(report.status)}">${getStatusText(report.status)}</span>
                    <span class="badge ${getSeverityBadgeClass(report.severity)}">${getSeverityText(report.severity)}</span>
                </div>
                <div class="mt-2">
                    <button class="btn btn-sm btn-primary view-on-map" data-id="${report.id}">
                        Lihat Detail
                    </button>
                </div>
            </div>
        `);
        
        mapMarkers.push(marker);
        
        // Add event listener to view detail button
        marker.on('popupopen', function() {
            const viewBtn = document.querySelector('.view-on-map');
            if (viewBtn) {
                viewBtn.addEventListener('click', function() {
                    const reportId = parseInt(this.getAttribute('data-id'));
                    if (window.roadDamageApp) {
                        window.roadDamageApp.showReportDetail(reportId);
                    }
                });
            }
        });
    });
}

function createCustomIcon(status) {
    const color = getStatusColor(status);
    
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
}

function getStatusColor(status) {
    const colorMap = {
        'new': '#3498db',      // Blue
        'progress': '#f39c12', // Orange
        'completed': '#27ae60' // Green
    };
    return colorMap[status] || '#95a5a6'; // Gray as default
}

function filterMapMarkers(filter) {
    if (!fullMap) return;
    
    const allReports = window.roadDamageApp ? window.roadDamageApp.reports : [];
    let filteredReports = [];
    
    switch(filter) {
        case 'new':
            filteredReports = allReports.filter(r => r.status === 'new');
            break;
        case 'progress':
            filteredReports = allReports.filter(r => r.status === 'progress');
            break;
        case 'completed':
            filteredReports = allReports.filter(r => r.status === 'completed');
            break;
        default:
            filteredReports = allReports;
    }
    
    addMarkersToMap(fullMap, filteredReports);
    
    // Update active filter button
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
}

// Utility functions (also defined in app.js, but needed here)
function getStatusText(status) {
    const statusMap = {
        'new': 'Baru',
        'progress': 'Dalam Proses',
        'completed': 'Selesai'
    };
    return statusMap[status] || status;
}

function getStatusBadgeClass(status) {
    const classMap = {
        'new': 'bg-info',
        'progress': 'bg-warning',
        'completed': 'bg-success'
    };
    return classMap[status] || 'bg-secondary';
}

function getSeverityText(severity) {
    const severityMap = {
        'low': 'Ringan',
        'medium': 'Sedang',
        'high': 'Berat'
    };
    return severityMap[severity] || severity;
}

function getSeverityBadgeClass(severity) {
    const classMap = {
        'low': 'bg-success',
        'medium': 'bg-warning',
        'high': 'bg-danger'
    };
    return classMap[severity] || 'bg-secondary';
}
