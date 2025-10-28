// Form handling for SI-PEJALAN
document.addEventListener('DOMContentLoaded', function() {
    // Photo preview functionality
    const photoInput = document.getElementById('report-photos');
    const photoPreview = document.getElementById('photo-preview');
    
    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', function(e) {
            photoPreview.innerHTML = '';
            
            for (let i = 0; i < this.files.length && i < 5; i++) {
                const file = this.files[i];
                
                // Validate file type
                if (!file.type.match('image.*')) {
                    alert('Hanya file gambar yang diizinkan');
                    continue;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Ukuran file maksimal 5MB');
                    continue;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('photo-preview');
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = '&times;';
                    removeBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'position-absolute');
                    removeBtn.style.top = '5px';
                    removeBtn.style.right = '5px';
                    removeBtn.type = 'button';
                    
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('position-relative', 'd-inline-block');
                    imgContainer.appendChild(img);
                    imgContainer.appendChild(removeBtn);
                    
                    photoPreview.appendChild(imgContainer);
                    
                    // Remove button functionality
                    removeBtn.addEventListener('click', function() {
                        imgContainer.remove();
                        
                        // Create new FileList without the removed file
                        const dt = new DataTransfer();
                        const files = Array.from(photoInput.files);
                        files.splice(i, 1);
                        
                        files.forEach(f => dt.items.add(f));
                        photoInput.files = dt.files;
                    });
                }
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Form validation
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = reportForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    
                    // Add error message if not exists
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('invalid-feedback')) {
                        const errorDiv = document.createElement('div');
                        errorDiv.classList.add('invalid-feedback');
                        errorDiv.textContent = 'Field ini wajib diisi';
                        field.parentNode.appendChild(errorDiv);
                    }
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                    
                    // Remove error message if exists
                    const errorDiv = field.nextElementSibling;
                    if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
                        errorDiv.remove();
                    }
                }
            });
            
            // Validate location
            const lat = document.getElementById('report-lat').value;
            const lon = document.getElementById('report-lon').value;
            if (!lat || !lon) {
                isValid = false;
                alert('Silakan pilih lokasi kerusakan pada peta');
            }
            
            if (!isValid) {
                e.preventDefault();
                // Scroll to first error
                const firstError = reportForm.querySelector('.is-invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
    
    // Real-time form validation
    const formFields = document.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
        
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });
    
    // Login form handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Simple validation
            if (!email || !password) {
                alert('Email dan password harus diisi');
                return;
            }
            
            // In a real app, this would send to server
            // For demo, simulate successful login
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span class="loading"></span> Memproses...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Login berhasil!');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                modal.hide();
            }, 1500);
        });
    }
});
