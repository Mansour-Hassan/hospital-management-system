// HOSPITAL WEBSITE - JAVASCRIPT FUNCTIONS
// ============================================

// Server configuration
const SERVER_URL = 'http://localhost:5001';
const API_ENDPOINT = '/add_new_patient/';

console.log('Script loaded successfully!');

// ============================================
// LOGIN CHECK & AUTHENTICATION
// ============================================

function checkLogin() {
    console.log('Checking login status...');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    console.log('isLoggedIn:', isLoggedIn);
    
    if (isLoggedIn !== 'true') {
        console.log('Not logged in, redirecting to login page');
        window.location.href = '/';
        return;
    }
    
    console.log('User is logged in');
}

function handleLogout() {
    console.log('Logout button clicked');
    
    // Confirm logout
    if (confirm('هل تريد تسجيل الخروج؟')) {
        console.log('User confirmed logout');
        
        // Clear login data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('rememberMe');
        
        console.log('Login data cleared');
        
        // Redirect to login page
        window.location.href = '/';
    } else {
        console.log('User cancelled logout');
    }
}

// ============================================
// PAGE NAVIGATION
// ============================================

function showPage(pageId) {
    console.log('Showing page:', pageId);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`a[href="#${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Close mobile menu if open
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.click();
        }
    }
}

// ============================================
// FORM VALIDATION
// ============================================

// Bootstrap form validation
(() => {
    'use strict';
    window.addEventListener('load', () => {
        const forms = document.querySelectorAll('.needs-validation');
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');

                if (form.checkValidity()) {
                    event.preventDefault();
                    handleFormSubmit(form);
                }
            }, false);
        });
    });
})();

// ============================================
// APPOINTMENT FORM HANDLER
// ============================================

function handleFormSubmit(form) {
    console.log('Form submitted:', form.id);
    const formType = form.getAttribute('id');
    
    if (formType === 'appointmentForm') {
        handleAppointmentForm(form);
    } else if (formType === 'contactForm') {
        handleContactForm(form);
    }
}

function handleAppointmentForm(form) {
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        birthdate: document.getElementById('birthdate').value,
        id_card: document.getElementById('id_card').value,
        number_phone: document.getElementById('number_phone').value,
        gender: document.getElementById('gender').value,
        department: document.getElementById('department').value,
        appointmentDate: document.getElementById('appointmentDate').value,
        notes: document.getElementById('notes').value
    };

    console.log('Appointment Form Data:', formData);

    // Send data to server
    sendAppointmentToServer(formData, form);
}

function handleContactForm(form) {
    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };

    console.log('Contact Form Data:', formData);
    
    // Show success message
    showSuccessMessage('تم استقبال رسالتك بنجاح! سنتواصل معك قريباً.');
    form.reset();
    form.classList.remove('was-validated');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getDepartmentName(departmentId) {
    const departments = {
        'cardiology': 'أمراض القلب',
        'neurology': 'الأعصاب والدماغ',
        'respiratory': 'أمراض الجهاز التنفسي',
        'orthopedics': 'العظام والمفاصل',
        'ophthalmology': 'طب العيون',
        'dentistry': 'طب الأسنان',
        'pediatrics': 'طب الأطفال',
        'gynecology': 'أمراض النساء',
        'dermatology': 'الأمراض الجلدية'
    };
    return departments[departmentId] || departmentId;
}

function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(alertDiv, mainContent.firstChild);
    }
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(alertDiv, mainContent.firstChild);
    }
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// ============================================
// SERVER API FUNCTIONS
// ============================================

function sendAppointmentToServer(formData, form) {
    // Prepare data for server
    const serverData = {
        name: formData.name,
        age: formData.age,
        birthdate: formData.birthdate,
        id_card: formData.id_card,
        number_phone: formData.number_phone,
        gender: formData.gender
    };

    console.log('Sending to server:', serverData);

    // Send POST request to server
    fetch(`${SERVER_URL}${API_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(serverData)
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data);
        
        if (data.success) {
            // Success
            showSuccessMessage(`✅ تم تأكيد الموعد بنجاح! رقم الحجز: ${data.id || 'N/A'}`);
            
            // Save to localStorage as backup
            saveAppointmentToLocalStorage(formData);
            
            // Reset form
            form.reset();
            form.classList.remove('was-validated');
        } else {
            // Error from server
            showErrorMessage(`❌ خطأ: ${data.message || 'فشل حفظ البيانات'}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage(`❌ خطأ في الاتصال بالخادم: ${error.message}`);
        
        // Save to localStorage as fallback
        saveAppointmentToLocalStorage(formData);
    });
}

// ============================================
// LOCALSTORAGE FUNCTIONS
// ============================================

function saveAppointmentToLocalStorage(formData) {
    try {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const newAppointment = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };
        appointments.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        console.log('Appointment saved to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getAppointmentsFromLocalStorage() {
    try {
        return JSON.parse(localStorage.getItem('appointments')) || [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// ============================================
// NAVBAR EFFECT
// ============================================

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow');
        } else {
            navbar.classList.remove('shadow');
        }
    }
});

// ============================================
// PAGE DETECTION
// ============================================

function getActivePage() {
    const pages = document.querySelectorAll('.page');
    for (let page of pages) {
        if (page.classList.contains('active')) {
            return page.id;
        }
    }
    return 'home';
}

// ============================================
// DATE VALIDATION
// ============================================

function validateDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
}

// ============================================
// PHONE FORMATTING
// ============================================

function formatPhoneNumber(phoneNumber) {
    // Remove non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format as Saudi phone number
    if (cleaned.startsWith('966')) {
        cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('05')) {
        cleaned = '+966' + cleaned.substring(1);
    }
    
    return cleaned;
}

// Add phone formatting to input
document.addEventListener('DOMContentLoaded', () => {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', () => {
            input.value = formatPhoneNumber(input.value);
        });
    });
});

// ============================================
// AGE CALCULATION
// ============================================

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - new Date(birthDate).getFullYear();
    const monthDiff = today.getMonth() - new Date(birthDate).getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < new Date(birthDate).getDate())) {
        age--;
    }
    
    return age;
}

// Auto-calculate age from birthdate
document.addEventListener('DOMContentLoaded', () => {
    const birthdateInput = document.getElementById('birthdate');
    const ageInput = document.getElementById('age');
    
    if (birthdateInput && ageInput) {
        birthdateInput.addEventListener('change', () => {
            if (birthdateInput.value) {
                const age = calculateAge(birthdateInput.value);
                ageInput.value = age;
            }
        });
    }
});

// ============================================
// SEARCH & FILTER
// ============================================

function searchDoctors(searchTerm) {
    const doctors = document.querySelectorAll('.doctor-card');
    searchTerm = searchTerm.toLowerCase();
    
    doctors.forEach(doctor => {
        const name = doctor.querySelector('h5').textContent.toLowerCase();
        const specialty = doctor.querySelector('p').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || specialty.includes(searchTerm)) {
            doctor.style.display = 'block';
        } else {
            doctor.style.display = 'none';
        }
    });
}

function searchServices(searchTerm) {
    const services = document.querySelectorAll('.service-card');
    searchTerm = searchTerm.toLowerCase();
    
    services.forEach(service => {
        const title = service.querySelector('h5').textContent.toLowerCase();
        const description = service.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            service.style.display = 'block';
        } else {
            service.style.display = 'none';
        }
    });
}

// ============================================
// PRINT FUNCTION
// ============================================

function printAppointment(appointmentId) {
    const appointments = getAppointmentsFromLocalStorage();
    const appointment = appointments.find(a => a.id == appointmentId);
    
    if (!appointment) {
        alert('لم يتم العثور على الموعد');
        return;
    }
    
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
        <html>
        <head>
            <title>تأكيد الموعد</title>
            <style>
                body { font-family: Arial, sans-serif; direction: rtl; }
                .header { text-align: center; margin-bottom: 30px; }
                .content { margin: 20px; }
                .field { margin: 10px 0; }
                .label { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>تأكيد موعد طبي</h1>
                <p>مستشفى الرعاية الطبية</p>
            </div>
            <div class="content">
                <div class="field"><span class="label">الاسم:</span> ${appointment.name}</div>
                <div class="field"><span class="label">العمر:</span> ${appointment.age}</div>
                <div class="field"><span class="label">رقم الهوية:</span> ${appointment.id_card}</div>
                <div class="field"><span class="label">رقم الهاتف:</span> ${appointment.number_phone}</div>
                <div class="field"><span class="label">النوع:</span> ${appointment.gender === 'male' ? 'ذكر' : 'أنثى'}</div>
                <div class="field"><span class="label">التاريخ:</span> ${new Date(appointment.createdAt).toLocaleDateString('ar-SA')}</div>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize Bootstrap tooltips and popovers
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing tooltips...');
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});

// ============================================
// EXPORTS - Make functions available globally
// ============================================

window.showPage = showPage;
window.handleLogout = handleLogout;
window.checkLogin = checkLogin;
window.handleFormSubmit = handleFormSubmit;
window.searchDoctors = searchDoctors;
window.searchServices = searchServices;
window.printAppointment = printAppointment;

console.log('All functions exported to window object');
