// Main Application JavaScript
class RoadDamageApp {
    constructor() {
        this.currentPage = 'home';
        this.reports = [];
        this.filteredReports = [];
        this.currentReport = null;
        this.currentPageNumber = 1;
        this.itemsPerPage = 10;
        this.filters = {
            status: ['new', 'progress', 'completed'],
            severity: ['low', 'medium', 'high'],
            type: '',
            dateFrom: '',
            dateTo: ''
        };
        
        this.init();
    }
    
    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.showPage('home');
        this.updateDashboard();
    }
    
    loadSampleData() {
        // Use sample data from sample-data.js
        this.reports = window.sampleReports || [];
        this.filteredReports = [...this.reports];
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = e.target.getAttribute('data-page');
                this.showPage(pageId);
            });
        });
        
        // Report form
        document.getElementById('report-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReport();
        });
        
        // Search
        document.getElementById('search-btn').addEventListener('click', () => {
            this.searchReports();
        });
        
        document.getElementById('search-reports').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.searchReports();
            }
        });
        
        // Filters
        document.getElementById('apply-filter').addEventListener('click', () => {
            this.applyFilters();
        });
        
        // Back to list
        document.getElementById('back-to-list').addEventListener('click', () => {
            this.showPage('reports-list');
        });
        
        // Map filters
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.filterMapMarkers(filter);
            });
        });
        
        // Profile form
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });
        
        // Comment form
        document.getElementById('comment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addComment();
        });
        
        // Report actions
        document.getElementById('assign-btn').addEventListener('click', () => {
            this.assignReport();
        });
        
        document.getElementById('update-status-btn').addEventListener('click', () => {
            this.updateReportStatus();
        });
        
        document.getElementById('complete-btn').addEventListener('click', () => {
            this.completeReport();
        });
        
        document.getElementById('delete-btn').addEventListener('click', () => {
            this.deleteReport();
        });
        
        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });
    }
    
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.add('hidden');
        });
        
        // Show the selected page
        document.getElementById(`${pageId}-page`).classList.remove('hidden');
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Find and activate the corresponding nav link
        const navLink = document.querySelector(`[data-page="${pageId}"]`);
        if (navLink) {
            navLink.classList.add('active');
        }
        
        // Update page-specific content
        this.currentPage = pageId;
        
        switch(pageId) {
            case 'home':
                this.updateHomePage();
                break;
            case 'reports-list':
                this.updateReportsList();
                break;
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'map-view':
                this.updateMapView();
                break;
        }
    }
    
    updateHomePage() {
        // Update statistics
        const total = this.reports.length;
        const progress = this.reports.filter(r => r.status === 'progress').length;
        const completed = this.reports.filter(r => r.status === 'completed').length;
        
        document.getElementById('total-reports').textContent = total;
        document.getElementById('progress-reports').textContent = progress;
        document.getElementById('completed-reports').textContent = completed;
        
        // Update recent reports
        this.updateRecentReports();
        
        // Initialize home map
        if (typeof initHomeMap === 'function') {
            initHomeMap(this.reports);
        }
    }
    
    updateRecentReports() {
        const container = document.getElementById('recent-reports');
        const recentReports = this.reports
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
        
        container.innerHTML = recentReports.map(report => `
            <div class="report-item">
                <h6>${report.title}</h6>
                <p class="mb-1 small">${report.address}</p>
                <span class="badge ${this.getStatusBadgeClass(report.status)}">${this.getStatusText(report.status)}</span>
                <span class="badge ${this.getSeverityBadgeClass(report.severity)} ms-1">${this.getSeverityText(report.severity)}</span>
            </div>
        `).join('');
    }
    
    updateReportsList() {
        this.applyFilters();
        this.renderReportsTable();
        this.renderPagination();
    }
    
    renderReportsTable() {
        const container = document.getElementById('reports-table-body');
        const startIndex = (this.currentPageNumber - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageReports = this.filteredReports.slice(startIndex, endIndex);
        
        container.innerHTML = pageReports.map(report => `
            <tr>
                <td>#${report.id.toString().padStart(3, '0')}</td>
                <td>${report.title}</td>
                <td>${this.getTypeText(report.type)}</td>
                <td><span class="badge ${this.getSeverityBadgeClass(report.severity)}">${this.getSeverityText(report.severity)}</span></td>
                <td>${report.address}</td>
                <td><span class="badge ${this.getStatusBadgeClass(report.status)}">${this.getStatusText(report.status)}</span></td>
                <td>${this.formatDate(report.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-report" data-id="${report.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-report').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reportId = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.showReportDetail(reportId);
            });
        });
    }
    
    renderPagination() {
        const container = document.getElementById('pagination');
        const totalPages = Math.ceil(this.filteredReports.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <li class="page-item ${this.currentPageNumber === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPageNumber - 1}">Previous</a>
            </li>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${i === this.currentPageNumber ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Next button
        paginationHTML += `
            <li class="page-item ${this.currentPageNumber === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPageNumber + 1}">Next</a>
            </li>
        `;
        
        container.innerHTML = paginationHTML;
        
        // Add event listeners to pagination links
        container.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.getAttribute('data-page'));
                if (page && page !== this.currentPageNumber) {
                    this.currentPageNumber = page;
                    this.renderReportsTable();
                }
            });
        });
    }
    
    showReportDetail(reportId) {
        this.currentReport = this.reports.find(r => r.id === reportId);
        
        if (!this.currentReport) return;
        
        // Update report details
        document.getElementById('detail-title').textContent = this.currentReport.title;
        document.getElementById('detail-description').textContent = this.currentReport.description;
        document.getElementById('detail-type').textContent = this.getTypeText(this.currentReport.type);
        document.getElementById('detail-severity').textContent = this.getSeverityText(this.currentReport.severity);
        document.getElementById('detail-address').textContent = this.currentReport.address;
        document.getElementById('detail-coords').textContent = `${this.currentReport.lat}, ${this.currentReport.lon}`;
        document.getElementById('detail-reporter').textContent = this.currentReport.reporter;
        document.getElementById('detail-date').textContent = this.formatDate(this.currentReport.createdAt);
        document.getElementById('detail-status').textContent = this.getStatusText(this.currentReport.status);
        document.getElementById('detail-status').className = `badge ${this.getStatusBadgeClass(this.currentReport.status)}`;
        
        // Update photos
        this.updateReportPhotos();
        
        // Update timeline
        this.updateReportTimeline();
        
        // Initialize detail map
        if (typeof initDetailMap === 'function') {
            initDetailMap(this.currentReport);
        }
        
        this.showPage('report-detail');
    }
    
    updateReportPhotos() {
        const container = document.getElementById('detail-photos');
        
        if (this.currentReport.photos && this.currentReport.photos.length > 0) {
            container.innerHTML = this.currentReport.photos.map(photo => `
                <div class="col-6 mb-2">
                    <img src="${photo}" class="report-image" alt="Foto kerusakan">
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-muted">Tidak ada foto</p>';
        }
    }
    
    updateReportTimeline() {
        const container = document.getElementById('report-timeline');
        
        if (this.currentReport.timeline && this.currentReport.timeline.length > 0) {
            container.innerHTML = this.currentReport.timeline.map(event => `
                <div class="timeline-item">
                    <h6>${event.title}</h6>
                    <p class="small text-muted">${this.formatDate(event.date)} oleh ${event.by}</p>
                    <p>${event.description}</p>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-muted">Belum ada aktivitas</p>';
        }
    }
    
    updateDashboard() {
        // Update statistics
        const total = this.reports.length;
        const progress = this.reports.filter(r => r.status === 'progress').length;
        const completed = this.reports.filter(r => r.status === 'completed').length;
        const resolutionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        document.getElementById('dashboard-total').textContent = total;
        document.getElementById('dashboard-progress').textContent = progress;
        document.getElementById('dashboard-completed').textContent = completed;
        document.getElementById('dashboard-resolution').textContent = `${resolutionRate}%`;
        
        // Update priority reports
        this.updatePriorityReports();
        
        // Update repair progress
        this.updateRepairProgress();
        
        // Initialize charts
        if (typeof initCharts === 'function') {
            initCharts(this.reports);
        }
    }
    
    updatePriorityReports() {
        const container = document.getElementById('priority-reports');
        const priorityReports = this.reports
            .filter(r => r.severity === 'high' && r.status !== 'completed')
            .slice(0, 3);
        
        if (priorityReports.length > 0) {
            container.innerHTML = priorityReports.map(report => `
                <a href="#" class="list-group-item list-group-item-action" data-id="${report.id}">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${report.title}</h6>
                        <small>${this.formatRelativeDate(report.createdAt)}</small>
                    </div>
                    <p class="mb-1">${report.address}</p>
                    <small class="text-danger"><i class="fas fa-exclamation-circle me-1"></i>Kerusakan Berat</small>
                </a>
            `).join('');
            
            // Add event listeners
            container.querySelectorAll('.list-group-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const reportId = parseInt(e.currentTarget.getAttribute('data-id'));
                    this.showReportDetail(reportId);
                });
            });
        } else {
            container.innerHTML = '<p class="text-muted">Tidak ada laporan prioritas tinggi</p>';
        }
    }
    
    updateRepairProgress() {
        const container = document.getElementById('repair-progress');
        const types = ['berlubang', 'retak', 'aus', 'longsor'];
        
        const progressHTML = types.map(type => {
            const typeReports = this.reports.filter(r => r.type === type);
            const completed = typeReports.filter(r => r.status === 'completed').length;
            const total = typeReports.length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            return `
                <div class="mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span>${this.getTypeText(type)}</span>
                        <span>${percentage}%</span>
                    </div>
                    <div class="progress">
                        <div class="progress-bar ${this.getProgressBarClass(percentage)}" role="progressbar" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = progressHTML;
    }
    
    updateMapView() {
        if (typeof initFullMap === 'function') {
            initFullMap(this.reports);
        }
    }
    
    submitReport() {
        const formData = {
            title: document.getElementById('report-title').value,
            description: document.getElementById('report-description').value,
            type: document.getElementById('report-type').value,
            severity: document.getElementById('report-severity').value,
            lat: document.getElementById('report-lat').value,
            lon: document.getElementById('report-lon').value,
            address: document.getElementById('report-address').value,
            photos: this.getUploadedPhotos(),
            createdAt: new Date().toISOString(),
            status: 'new',
            reporter: 'Budi Santoso' // In real app, get from user session
        };
        
        // Generate new ID
        const newId = this.reports.length > 0 ? Math.max(...this.reports.map(r => r.id)) + 1 : 1;
        formData.id = newId;
        
        // Add to reports
        this.reports.unshift(formData);
        this.filteredReports.unshift(formData);
        
        // Show success message
        alert('Laporan kerusakan jalan berhasil dikirim!');
        
        // Reset form
        document.getElementById('report-form').reset();
        document.getElementById('photo-preview').innerHTML = '';
        
        // Go to home page
        this.showPage('home');
        
        // Update dashboard and lists
        this.updateDashboard();
    }
    
    getUploadedPhotos() {
        // In a real app, this would upload files to a server
        // For demo purposes, return placeholder URLs
        const fileInput = document.getElementById('report-photos');
        if (fileInput.files.length > 0) {
            return Array.from(fileInput.files).map(() => 'https://via.placeholder.com/400x300?text=Foto+Kerusakan');
        }
        return [];
    }
    
    searchReports() {
        const query = document.getElementById('search-reports').value.toLowerCase();
        
        if (query.trim() === '') {
            this.filteredReports = [...this.reports];
        } else {
            this.filteredReports = this.reports.filter(report => 
                report.title.toLowerCase().includes(query) ||
                report.description.toLowerCase().includes(query) ||
                report.address.toLowerCase().includes(query)
            );
        }
        
        this.currentPageNumber = 1;
        this.renderReportsTable();
        this.renderPagination();
    }
    
    applyFilters() {
        const statusFilters = [];
        if (document.getElementById('filter-status-new').checked) statusFilters.push('new');
        if (document.getElementById('filter-status-progress').checked) statusFilters.push('progress');
        if (document.getElementById('filter-status-completed').checked) statusFilters.push('completed');
        
        const severityFilters = [];
        if (document.getElementById('filter-severity-low').checked) severityFilters.push('low');
        if (document.getElementById('filter-severity-medium').checked) severityFilters.push('medium');
        if (document.getElementById('filter-severity-high').checked) severityFilters.push('high');
        
        const typeFilter = document.getElementById('filter-type').value;
        const dateFrom = document.getElementById('filter-date-from').value;
        const dateTo = document.getElementById('filter-date-to').value;
        
        this.filteredReports = this.reports.filter(report => {
            // Status filter
            if (statusFilters.length > 0 && !statusFilters.includes(report.status)) {
                return false;
            }
            
            // Severity filter
            if (severityFilters.length > 0 && !severityFilters.includes(report.severity)) {
                return false;
            }
            
            // Type filter
            if (typeFilter && report.type !== typeFilter) {
                return false;
            }
            
            // Date filter
            if (dateFrom && new Date(report.createdAt) < new Date(dateFrom)) {
                return false;
            }
            
            if (dateTo && new Date(report.createdAt) > new Date(dateTo + 'T23:59:59')) {
                return false;
            }
            
            return true;
        });
        
        this.currentPageNumber = 1;
        this.renderReportsTable();
        this.renderPagination();
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('filterModal')).hide();
    }
    
    filterMapMarkers(filter) {
        // This would be implemented in map.js
        if (typeof filterMapMarkers === 'function') {
            filterMapMarkers(filter);
        }
    }
    
    updateProfile() {
        // In a real app, this would send data to the server
        alert('Profil berhasil diperbarui!');
    }
    
    addComment() {
        const commentText = document.getElementById('comment-text').value;
        
        if (!commentText.trim()) return;
        
        // In a real app, this would send to the server
        // For demo, add to current report
        if (this.currentReport) {
            if (!this.currentReport.timeline) {
                this.currentReport.timeline = [];
            }
            
            this.currentReport.timeline.push({
                title: 'Komentar Ditambahkan',
                description: commentText,
                by: 'Budi Santoso',
                date: new Date().toISOString()
            });
            
            // Update timeline display
            this.updateReportTimeline();
            
            // Clear form
            document.getElementById('comment-text').value = '';
        }
    }
    
    assignReport() {
        if (this.currentReport) {
            // In a real app, this would open a modal to select staff
            const staffName = 'Ahmad Fauzi';
            
            if (!this.currentReport.timeline) {
                this.currentReport.timeline = [];
            }
            
            this.currentReport.timeline.push({
                title: 'Ditugaskan ke Petugas',
                description: `Laporan telah ditugaskan kepada petugas: ${staffName}`,
                by: 'Manager',
                date: new Date().toISOString()
            });
            
            this.currentReport.status = 'progress';
            this.currentReport.assignedTo = staffName;
            
            // Update display
            document.getElementById('detail-status').textContent = this.getStatusText(this.currentReport.status);
            document.getElementById('detail-status').className = `badge ${this.getStatusBadgeClass(this.currentReport.status)}`;
            this.updateReportTimeline();
            
            alert(`Laporan berhasil ditugaskan kepada ${staffName}`);
        }
    }
    
    updateReportStatus() {
        if (this.currentReport) {
            // In a real app, this would open a status update modal
            const newStatus = 'progress';
            const statusText = this.getStatusText(newStatus);
            
            if (!this.currentReport.timeline) {
                this.currentReport.timeline = [];
            }
            
            this.currentReport.timeline.push({
                title: 'Status Diperbarui',
                description: `Status laporan diubah menjadi: ${statusText}`,
                by: 'Admin',
                date: new Date().toISOString()
            });
            
            this.currentReport.status = newStatus;
            
            // Update display
            document.getElementById('detail-status').textContent = statusText;
            document.getElementById('detail-status').className = `badge ${this.getStatusBadgeClass(newStatus)}`;
            this.updateReportTimeline();
            
            alert(`Status laporan berhasil diubah menjadi ${statusText}`);
        }
    }
    
    completeReport() {
        if (this.currentReport) {
            if (!this.currentReport.timeline) {
                this.currentReport.timeline = [];
            }
            
            this.currentReport.timeline.push({
                title: 'Laporan Selesai',
                description: 'Perbaikan jalan telah selesai dilakukan',
                by: 'Petugas',
                date: new Date().toISOString()
            });
            
            this.currentReport.status = 'completed';
            
            // Update display
            document.getElementById('detail-status').textContent = this.getStatusText(this.currentReport.status);
            document.getElementById('detail-status').className = `badge ${this.getStatusBadgeClass(this.currentReport.status)}`;
            this.updateReportTimeline();
            
            alert('Laporan berhasil ditandai sebagai selesai');
        }
    }
    
    deleteReport() {
        if (this.currentReport && confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
            this.reports = this.reports.filter(r => r.id !== this.currentReport.id);
            this.filteredReports = this.filteredReports.filter(r => r.id !== this.currentReport.id);
            
            alert('Laporan berhasil dihapus');
            this.showPage('reports-list');
        }
    }
    
    logout() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            // In a real app, this would clear session and redirect to login
            alert('Anda telah berhasil keluar');
        }
    }
    
    // Utility methods
    getStatusText(status) {
        const statusMap = {
            'new': 'Baru',
            'progress': 'Dalam Proses',
            'completed': 'Selesai'
        };
        return statusMap[status] || status;
    }
    
    getStatusBadgeClass(status) {
        const classMap = {
            'new': 'bg-info',
            'progress': 'bg-warning',
            'completed': 'bg-success'
        };
        return classMap[status] || 'bg-secondary';
    }
    
    getSeverityText(severity) {
        const severityMap = {
            'low': 'Ringan',
            'medium': 'Sedang',
            'high': 'Berat'
        };
        return severityMap[severity] || severity;
    }
    
    getSeverityBadgeClass(severity) {
        const classMap = {
            'low': 'bg-success',
            'medium': 'bg-warning',
            'high': 'bg-danger'
        };
        return classMap[severity] || 'bg-secondary';
    }
    
    getTypeText(type) {
        const typeMap = {
            'berlubang': 'Berlubang',
            'retak': 'Retak',
            'aus': 'Permukaan Aus',
            'longsor': 'Longsor',
            'lainnya': 'Lainnya'
        };
        return typeMap[type] || type;
    }
    
    getProgressBarClass(percentage) {
        if (percentage >= 80) return 'bg-success';
        if (percentage >= 50) return 'bg-info';
        if (percentage >= 30) return 'bg-warning';
        return 'bg-danger';
    }
    
    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }
    
    formatRelativeDate(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 hari lalu';
        if (diffDays < 7) return `${diffDays} hari lalu`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
        return `${Math.floor(diffDays / 30)} bulan lalu`;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.roadDamageApp = new RoadDamageApp();
});
