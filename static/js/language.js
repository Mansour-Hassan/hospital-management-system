// Language Management System
// دعم اللغة العربية والإنجليزية

const translations = {
    ar: {
        // Navigation
        dashboard: 'لوحة التحكم',
        createFile: 'إنشاء ملف',
        bookAppointment: 'حجز موعد',
        logout: 'تسجيل الخروج',
        hospital: 'مستشفى الرعاية الطبية',
        
        // Create Patient Page
        createPatientTitle: 'إنشاء ملف مريض جديد',
        createPatientSubtitle: 'أدخل بيانات المريض لإنشاء ملف جديد في النظام',
        idCard: 'رقم الهوية',
        fullName: 'الاسم الكامل',
        birthDate: 'تاريخ الميلاد',
        age: 'العمر',
        phone: 'رقم الهاتف',
        gender: 'النوع',
        male: 'ذكر',
        female: 'أنثى',
        selectGender: 'اختر النوع',
        createFile: 'إنشاء الملف',
        enterIdCard: 'أدخل رقم الهوية',
        enterFullName: 'أدخل الاسم الكامل',
        enterPhone: '05xxxxxxxx',
        autoCalculated: 'سيتم حسابه تلقائياً',
        patientFileCreated: 'تم إنشاء الملف بنجاح!',
        medicalFileNumber: 'رقم الملف الطبي:',
        youCanNowBook: 'يمكنك الآن حجز موعد للمريض',
        creatingFile: 'جاري إنشاء الملف...',
        
        // Book Appointment Page
        bookAppointmentTitle: 'حجز موعد جديد',
        bookAppointmentSubtitle: 'اختر التخصص والطبيب والموعد المناسب',
        patientIdCardInput: 'رقم هوية المريض',
        enterPatientId: 'أدخل رقم الهوية للتحقق من وجود الملف',
        verifyFile: 'التحقق من الملف',
        patientData: 'بيانات المريض',
        name: 'الاسم',
        visits: 'عدد الزيارات',
        specialty: 'التخصص',
        selectSpecialty: 'اختر التخصص',
        doctor: 'الطبيب',
        selectDoctor: 'اختر الطبيب',
        appointmentDate: 'تاريخ الموعد',
        availableTimes: 'الأوقات المتاحة',
        selectDateFirst: 'اختر تاريخاً أولاً',
        notes: 'ملاحظات (اختياري)',
        additionalInfo: 'أي ملاحظات أو معلومات إضافية',
        bookingSummary: 'ملخص الحجز',
        confirmAppointment: 'تأكيد الحجز',
        processingRequest: 'جاري معالجة الطلب...',
        selectTime: 'اختر الوقت أولاً',
        selectDoctorAndDate: 'اختر الطبيب والتاريخ أولاً',
        selectDoctor2: 'اختر الطبيب والتاريخ أولاً',
        available: 'متاح',
        
        // Alerts
        successVerification: '✅ تم التحقق من الملف بنجاح',
        errorPatientNotFound: '❌ المريض غير موجود في النظام',
        errorConnectionServer: 'خطأ في الاتصال بالخادم: ',
        successAppointment: '✅ تم حجز الموعد بنجاح',
        errorAppointment: '❌ حدث خطأ في الحجز',
        errorRequired: 'الحقل مطلوب',
        errorSelectGender: 'اختر النوع',
        warningEnterIdCard: 'أدخل رقم الهوية أولاً',
        
        // Confirmation
        patient: 'المريض',
        doctor: 'الطبيب',
        dateTime: 'التاريخ والوقت',
        
        // Stethoscope specialties
        generalDoctor: 'طبيب عام',
        dentistry: 'أسنان',
        ent: 'أنف وأذن وحنجرة',
        obstetrics: 'ولادة',
    },
    
    en: {
        // Navigation
        dashboard: 'Dashboard',
        createFile: 'Create File',
        bookAppointment: 'Book Appointment',
        logout: 'Logout',
        hospital: 'Medical Care Hospital',
        
        // Create Patient Page
        createPatientTitle: 'Create New Patient File',
        createPatientSubtitle: 'Enter patient data to create a new file in the system',
        idCard: 'ID Number',
        fullName: 'Full Name',
        birthDate: 'Date of Birth',
        age: 'Age',
        phone: 'Phone Number',
        gender: 'Gender',
        male: 'Male',
        female: 'Female',
        selectGender: 'Select Gender',
        createFile: 'Create File',
        enterIdCard: 'Enter ID Number',
        enterFullName: 'Enter Full Name',
        enterPhone: '05xxxxxxxx',
        autoCalculated: 'Will be calculated automatically',
        patientFileCreated: 'Patient file created successfully!',
        medicalFileNumber: 'Medical File Number:',
        youCanNowBook: 'You can now book an appointment for the patient',
        creatingFile: 'Creating file...',
        
        // Book Appointment Page
        bookAppointmentTitle: 'Book New Appointment',
        bookAppointmentSubtitle: 'Choose specialty, doctor, and suitable appointment',
        patientIdCardInput: 'Patient ID Number',
        enterPatientId: 'Enter ID number to verify patient file',
        verifyFile: 'Verify File',
        patientData: 'Patient Data',
        name: 'Name',
        visits: 'Number of Visits',
        specialty: 'Specialty',
        selectSpecialty: 'Select Specialty',
        doctor: 'Doctor',
        selectDoctor: 'Select Doctor',
        appointmentDate: 'Appointment Date',
        availableTimes: 'Available Times',
        selectDateFirst: 'Select a date first',
        notes: 'Notes (Optional)',
        additionalInfo: 'Any additional notes or information',
        bookingSummary: 'Booking Summary',
        confirmAppointment: 'Confirm Appointment',
        processingRequest: 'Processing request...',
        selectTime: 'Select time first',
        selectDoctorAndDate: 'Select doctor and date first',
        selectDoctor2: 'Select doctor and date first',
        available: 'available',
        
        // Alerts
        successVerification: '✅ File verified successfully',
        errorPatientNotFound: '❌ Patient not found in the system',
        errorConnectionServer: 'Connection error with server: ',
        successAppointment: '✅ Appointment booked successfully',
        errorAppointment: '❌ Error booking appointment',
        errorRequired: 'This field is required',
        errorSelectGender: 'Select gender',
        warningEnterIdCard: 'Enter ID number first',
        
        // Confirmation
        patient: 'Patient',
        doctor: 'Doctor',
        dateTime: 'Date and Time',
        
        // Stethoscope specialties
        generalDoctor: 'General Doctor',
        dentistry: 'Dentistry',
        ent: 'ENT',
        obstetrics: 'Obstetrics',
    }
};

// الحصول على اللغة المحفوظة أو استخدام العربية كلغة افتراضية
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'ar';
}

// تعيين اللغة
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    updatePageLanguage(lang);
}

// تحديث جميع النصوص في الصفحة
function updatePageLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // تحديث اتجاه الصفحة
    const html = document.documentElement;
    if (lang === 'ar') {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
    } else {
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', 'en');
    }
    
    // تحديث زر اللغة
    updateLanguageButton(lang);
}

// تحديث زر اللغة
function updateLanguageButton(lang) {
    const btn = document.getElementById('languageToggle');
    if (btn) {
        btn.textContent = lang === 'ar' ? 'English' : 'العربية';
        btn.setAttribute('data-current-lang', lang);
    }
}

// تبديل اللغة
function toggleLanguage() {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
}

// الحصول على النص المترجم
function t(key) {
    const lang = getCurrentLanguage();
    return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
}

// تهيئة اللغة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const lang = getCurrentLanguage();
    updatePageLanguage(lang);
});
