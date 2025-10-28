// Sample data for SI-PEJALAN demo
window.sampleReports = [
    {
        id: 1,
        title: "Jalan Berlubang di Jl. Merdeka",
        description: "Terdapat beberapa lubang besar di Jalan Merdeka dekat persimpangan dengan Jalan Sudirman. Lubang tersebut membahayakan pengendara terutama pada malam hari.",
        type: "berlubang",
        severity: "medium",
        status: "new",
        lat: -6.200000,
        lon: 106.816666,
        address: "Jl. Merdeka No. 45, Jakarta Pusat",
        reporter: "Budi Santoso",
        createdAt: "2023-03-12T10:30:00",
        photos: [
            "https://via.placeholder.com/400x300?text=Foto+Kerusakan+1",
            "https://via.placeholder.com/400x300?text=Foto+Kerusakan+2"
        ],
        timeline: [
            {
                title: "Laporan Diterima",
                description: "Laporan kerusakan jalan telah diterima dan sedang menunggu verifikasi.",
                by: "Sistem",
                date: "2023-03-12T10:30:00"
            },
            {
                title: "Laporan Diverifikasi",
                description: "Laporan telah diverifikasi dan akan segera ditindaklanjuti.",
                by: "Admin",
                date: "2023-03-12T14:15:00"
            }
        ]
    },
    {
        id: 2,
        title: "Retak Parah Jalan Sudirman",
        description: "Retakan memanjang sepanjang 50 meter di jalur lambat Jalan Sudirman. Retakan sudah cukup dalam dan dapat membahayakan kendaraan.",
        type: "retak",
        severity: "high",
        status: "progress",
        lat: -6.210000,
        lon: 106.820000,
        address: "Jl. Sudirman Kav. 12, Jakarta Selatan",
        reporter: "Siti Rahayu",
        createdAt: "2023-03-10T08:45:00",
        photos: [
            "https://via.placeholder.com/400x300?text=Foto+Kerusakan+3"
        ],
        assignedTo: "Ahmad Fauzi",
        timeline: [
            {
                title: "Laporan Diterima",
                description: "Laporan kerusakan jalan telah diterima dan sedang menunggu verifikasi.",
                by: "Sistem",
                date: "2023-03-10T08:45:00"
            },
            {
                title: "Laporan Diverifikasi",
                description: "Laporan telah diverifikasi dan akan segera ditindaklanjuti.",
                by: "Admin",
                date: "2023-03-10T11:20:00"
            },
            {
                title: "Ditugaskan ke Petugas",
                description: "Laporan telah ditugaskan kepada petugas lapangan: Ahmad Fauzi.",
                by: "Manager",
                date: "2023-03-11T09:00:00"
            },
            {
                title: "Survey Lokasi",
                description: "Telah dilakukan survey lokasi dan pengukuran kerusakan.",
                by: "Ahmad Fauzi",
                date: "2023-03-11T14:30:00"
            }
        ]
    },
    {
        id: 3,
        title: "Permukaan Aus Jalan Thamrin",
        description: "Permukaan jalan sudah sangat aus dan licin terutama ketika hujan. Banyak pengendara motor yang tergelincir di lokasi ini.",
        type: "aus",
        severity: "low",
        status: "completed",
        lat: -6.190000,
        lon: 106.830000,
        address: "Jl. Thamrin No. 8, Jakarta Pusat",
        reporter: "Rina Wijaya",
        createdAt: "2023-03-05T16:20:00",
        photos: [
            "https://via.placeholder.com/400x300?text=Foto+Kerusakan+4",
            "https://via.placeholder.com/400x300?text=Foto+Kerusakan+5"
        ],
        assignedTo: "Bambang Sutrisno",
        timeline: [
            {
                title: "Laporan Diterima",
                description: "Laporan kerusakan jalan telah diterima dan sedang menunggu verifikasi.",
                by: "Sistem",
                date: "2023-03-05T16:20:00"
            },
            {
                title: "Laporan Diverifikasi",
                description: "Laporan telah diverifikasi dan akan segera ditindaklanjuti.",
                by: "Admin",
                date: "2023-03-06T09:15:00"
            },
            {
                title: "Ditugaskan ke Petugas",
                description: "Laporan telah ditugaskan kepada petugas lapangan: Bambang Sutrisno.",
                by: "Manager",
                date: "2023-03-06T11:00:00"
            },
            {
                title: "Perbaikan Dimulai",
                description: "Pekerjaan perbaikan permukaan jalan telah dimulai.",
                by: "Bambang Sutrisno",
                date: "2023-03-07T08:00:00"
            },
            {
                title: "Perbaikan Selesai",
                description: "Pekerjaan perbaikan permukaan jalan telah selesai dilakukan.",
                by: "Bambang Sutrisno",
                date: "2023-03-08T17:30:00"
            }
        ]
    },
    {
        id: 4,
        title: "Longsor di Jalan Pegunungan",
        description: "Terjadi longsor kecil di tepi jalan yang mengakibatkan sebagian jalan tertutup material tanah. Perlu penanganan segera.",
        type: "longsor",
        severity: "high",
        status: "progress",
        lat: -6.180000,
        lon: 106.840000,
        address: "Jl. Raya Puncak KM 12, Bogor",
        reporter: "Dedi Kurniawan",
        createdAt: "2023-03-15T07:30:00",
        photos: [
            "https://via.placeholder.com/400x300?text=Foto+Kerusakan+6"
        ],
        assignedTo: "Joko Prasetyo",
        timeline: [
            {
                title: "Laporan Diterima",
                description: "Laporan kerusakan jalan telah diterima dan sedang menunggu verifikasi.",
                by: "Sistem",
                date: "2023-03-15T07:30:00"
            },
            {
                title: "Laporan Diverifikasi",
                description: "Laporan telah diverifikasi dan akan segera ditindaklanjuti.",
                by: "Admin",
                date: "2023-03-15T09:45:00"
            },
            {
                title: "Ditugaskan ke Petugas",
                description: "Laporan telah ditugaskan kepada petugas lapangan: Joko Prasetyo.",
                by: "Manager",
                date: "2023-03-15T11:30:00"
            }
        ]
    },
    {
        id: 5,
        title: "Jalan Berlubang di Perumahan",
        description: "Banyak lubang kecil di jalan perumahan yang membahayakan pengendara terutama anak-anak yang bermain di jalan.",
        type: "berlubang",
        severity: "low",
        status: "new",
        lat: -6.220000,
        lon: 106.810000,
        address: "Jl. Melati Raya No. 15, Jakarta Selatan",
        reporter: "Maya Sari",
        createdAt: "2023-03-14T14:20:00",
        photos: [],
        timeline: [
            {
                title: "Laporan Diterima",
                description: "Laporan kerusakan jalan telah diterima dan sedang menunggu verifikasi.",
                by: "Sistem",
                date: "2023-03-14T14:20:00"
            }
        ]
    }
];

// Add more sample reports for demonstration
for (let i = 6; i <= 20; i++) {
    const types = ['berlubang', 'retak', 'aus', 'longsor'];
    const severities = ['low', 'medium', 'high'];
    const statuses = ['new', 'progress', 'completed'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const lat = -6.2 + (Math.random() - 0.5) * 0.1;
    const lon = 106.816 + (Math.random() - 0.5) * 0.1;
    
    window.sampleReports.push({
        id: i,
        title: `Laporan Kerusakan #${i}`,
        description: `Deskripsi untuk laporan kerusakan jalan nomor ${i}. Ini adalah contoh deskripsi yang menjelaskan kondisi kerusakan yang terjadi.`,
        type: type,
        severity: severity,
        status: status,
        lat: lat,
        lon: lon,
        address: `Jl. Contoh No. ${i}, Jakarta`,
        reporter: `Warga ${i}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        photos: Math.random() > 0.3 ? [`https://via.placeholder.com/400x300?text=Foto+${i}`] : [],
        timeline: [
            {
                title: "Laporan Diterima",
                description: "Laporan kerusakan jalan telah diterima dan sedang menunggu verifikasi.",
                by: "Sistem",
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]
    });
}
