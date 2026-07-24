# مكتبات السيرفر
from flask import Flask, request, jsonify, render_template 
from werkzeug.security import generate_password_hash, check_password_hash # خاص ب تسجيل الدخول الرمز يكون مشفر 
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os


app = Flask(__name__, template_folder='templates', static_folder='static')

# السماح بـ CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5000", "http://127.0.0.1:5000", "http://localhost:5001", "http://127.0.0.1:5001"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept"]
    }
})

# database system
basedir = os.path.abspath(os.path.dirname(__file__)) # تحديد المجلد المستخدم للمشروع 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'hospital.db') # يقوم بانشاء ملف باسم hospital.db
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # يقوم في تخفيف الضغط على السيرفر ويكون عاداً اختياري 

db = SQLAlchemy(app)

# تعريف جداول قاعدة البيانات

# تعريف جدول المرضى
class Patient(db.Model):
    __tablename__ = 'patients'
    id_card = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer)
    number_phone = db.Column(db.String(20))
    birthdate = db.Column(db.String(20))
    gender = db.Column(db.String(10))
    visit_count = db.Column(db.Integer, default=0)  # عدد الزيارات
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id_card': self.id_card,
            'name': self.name,
            'age': self.age,
            'number_phone': self.number_phone,
            'birthdate': self.birthdate,
            'gender': self.gender,
            'visit_count': self.visit_count,
            'created_at': self.created_at.isoformat()
        }


# تعريف جدول الأطباء
class Doctor(db.Model):
    __tablename__ = 'doctors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialty = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'specialty': self.specialty,
            'phone': self.phone
        }


# تعريف جدول المواعيد
class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    id_card = db.Column(db.String(20), db.ForeignKey('patients.id_card'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    appointment_date = db.Column(db.String(20), nullable=False)
    appointment_time = db.Column(db.String(10), nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        doctor = Doctor.query.get(self.doctor_id)
        patient = Patient.query.get(self.id_card)
        return {
            'id': self.id,
            'patient_name': patient.name if patient else '',
            'doctor_name': doctor.name if doctor else '',
            'doctor_specialty': doctor.specialty if doctor else '',
            'appointment_date': self.appointment_date,
            'appointment_time': self.appointment_time,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }


with app.app_context():
    db.create_all()
    
    # إضافة الأطباء الافتراضيين إذا لم يكونوا موجودين
    if Doctor.query.count() == 0:
        doctors = [
            Doctor(name='د. أحمد علي', specialty='طبيب عام'),
            Doctor(name='د. فاطمة محمود', specialty='طبيب عام'),
            Doctor(name='د. محمد حسن', specialty='أسنان'),
            Doctor(name='د. سارة إبراهيم', specialty='أسنان'),
            Doctor(name='د. علي محمد', specialty='أنف وأذن وحنجرة'),
            Doctor(name='د. نور الدين', specialty='أنف وأذن وحنجرة'),
            Doctor(name='د. ليلى أحمد', specialty='ولادة'),
            Doctor(name='د. مريم علي', specialty='ولادة'),
        ]
        for doctor in doctors:
            db.session.add(doctor)
        db.session.commit()


# صفحات الويب الرئيسية

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/login.html')
def login_page():
    return render_template('login.html')

@app.route('/index.html')
def index_html():
    return render_template('index.html')


@app.route('/logout', methods=['POST', 'GET', 'OPTIONS'])
def logout():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        return jsonify({
            "success": True,
            "message": "تم تسجيل الخروج بنجاح"
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"حدث خطأ: {str(e)}"
        }), 500

@app.route('/add_new_patient/', methods=['GET', 'POST', 'OPTIONS'])
def add_new_patient():
    if request.method == 'OPTIONS':
        return '', 204
    
    if request.method == 'GET':
        return render_template('login.html')

    data = request.get_json() if request.is_json else request.form
    
    name = data.get('name', '').strip()
    age = data.get('age')
    birthdate = data.get('birthdate', '').strip()
    id_card = data.get('id_card', '').strip()
    number_phone = data.get('number_phone', '').strip()
    gender = data.get('gender', '').strip()

    if name and age and birthdate and gender and id_card and number_phone:
        try:
            # التحقق من عدم وجود المريض مسبقاً
            existing_patient = Patient.query.filter_by(id_card=id_card).first()
            if existing_patient:
                return jsonify({
                    "success": False,
                    "message": "المريض موجود بالفعل في النظام"
                }), 409

            new_p = Patient(
                name=name,
                age=int(age),
                birthdate=birthdate,
                gender=gender,
                id_card=id_card,
                number_phone=number_phone,
                visit_count=0  # بدء العداد من 0
            )

            db.session.add(new_p)
            db.session.commit()
            
            return jsonify({
                "success": True,
                "message": f"تم حفظ بيانات المريض {name} بنجاح!",
                "id": id_card,
                "mrn": f"MRN-{id_card}",  # رقم الملف الطبي
                "patient": new_p.to_dict()
            }), 201 # اذا اكتمل نجح في التخزين يعطيه هذه الرساله
            
        except Exception as e:
            db.session.rollback()
            print(f"Error: {str(e)}")
            return jsonify({
                "success": False,
                "message": "خطأ: رقم الهوية موجود بالفعل أو خطأ في قاعدة البيانات"
            }), 400 # اذا كان في تكرار في الرقم الهويه تظهر هذي الرساله 
    else:
        return jsonify({
            "success": False,
            "message": "خطأ: جميع الحقول مطلوبة"
        }), 400 # اذا كان في حقل مااكتمل تظهر هذي الرساله


# لإنشاء المريض والمواعيد

@app.route('/api/create_patient', methods=['POST', 'OPTIONS'])
def api_create_patient():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        
        id_card = data.get('id_card', '').strip()
        name = data.get('name', '').strip()
        age = data.get('age')
        birthdate = data.get('birthdate', '').strip()
        number_phone = data.get('number_phone', '').strip()
        gender = data.get('gender', '').strip()
        
        # التحقق من البيانات
        if not all([id_card, name, age, birthdate, number_phone, gender]):
            return jsonify({
                "success": False,
                "message": "جميع الحقول مطلوبة"
            }), 400
        
        # التحقق من عدم وجود المريض
        existing = Patient.query.filter_by(id_card=id_card).first()
        if existing:
            return jsonify({
                "success": False,
                "message": "المريض موجود بالفعل في النظام"
            }), 409
        
        # إنشاء مريض جديد
        patient = Patient(
            id_card=id_card,
            name=name,
            age=int(age),
            birthdate=birthdate,
            number_phone=number_phone,
            gender=gender,
            visit_count=0
        )
        
        db.session.add(patient)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": f"تم إنشاء ملف المريض {name} بنجاح",
            "mrn": f"MRN-{id_card}",
            "patient": patient.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"خطأ: {str(e)}"
        }), 500


# الحصول على قائمة المرضى
@app.route('/get_patients/', methods=['GET', 'OPTIONS'])
def get_patients():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        patients = Patient.query.all()
        return jsonify({
            "success": True,
            "count": len(patients),
            "patients": [p.to_dict() for p in patients]
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"خطأ: {str(e)}"
        }), 500


# الحصول على بيانات مريض معين
@app.route('/get_patient/<id_card>', methods=['GET', 'OPTIONS'])
def get_patient(id_card):
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        patient = Patient.query.filter_by(id_card=id_card).first()
        if not patient:
            return jsonify({
                "success": False,
                "has_file": False,
                "message": "المريض غير موجود"
            }), 404
        
        return jsonify({
            "success": True,
            "has_file": True,
            "patient": patient.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"خطأ: {str(e)}"
        }), 500


# تحديث بيانات المريض

@app.route('/update_patient/<id_card>', methods=['PUT', 'POST', 'OPTIONS'])
def update_patient(id_card):
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json() if request.is_json else request.form
        
        patient = Patient.query.filter_by(id_card=id_card).first()
        if not patient:
            return jsonify({
                "success": False,
                "message": "المريض غير موجود"
            }), 404
        
        # تحديث الحقول إذا تم توفيرها
        if 'name' in data:
            patient.name = data['name'].strip()
        if 'age' in data:
            patient.age = int(data['age'])
        if 'birthdate' in data:
            patient.birthdate = data['birthdate'].strip()
        if 'number_phone' in data:
            patient.number_phone = data['number_phone'].strip()
        if 'gender' in data:
            patient.gender = data['gender'].strip()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "تم تحديث بيانات المريض بنجاح",
            "patient": patient.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"خطأ: {str(e)}"
        }), 500


# حذف المريض

@app.route('/delete_patient/<id_card>', methods=['DELETE', 'OPTIONS'])
def delete_patient(id_card):
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        patient = Patient.query.filter_by(id_card=id_card).first()
        if not patient:
            return jsonify({
                "success": False,
                "message": "المريض غير موجود"
            }), 404
        
        db.session.delete(patient)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "تم حذف بيانات المريض بنجاح"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"خطأ: {str(e)}"
        }), 500


# للمواعيد

# الحصول على التخصصات
@app.route('/api/specialties', methods=['GET', 'OPTIONS'])
def get_specialties():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        specialties = db.session.query(Doctor.specialty).distinct().all()
        specialty_list = [s[0] for s in specialties]
        
        return jsonify({
            "success": True,
            "specialties": specialty_list
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"خطأ: {str(e)}"
        }), 500


# الحصول على الأطباء حسب التخصص
@app.route('/api/doctors/<specialty>', methods=['GET', 'OPTIONS'])
def get_doctors_by_specialty(specialty):
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        doctors = Doctor.query.filter_by(specialty=specialty).all()
        
        return jsonify({
            "success": True,
            "doctors": [d.to_dict() for d in doctors]
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"خطأ: {str(e)}"
        }), 500


# الحصول على الأوقات المتاحة
@app.route('/api/available_slots/<int:doctor_id>/<date>', methods=['GET', 'OPTIONS'])
def get_available_slots(doctor_id, date):
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        # الأوقات المتاحة
        available_times = [
            '8:00 AM', '10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM', '9:00 PM'
        ]
        
        slots = []
        
        for time in available_times:
            # عد عدد المواعيد في هذا الوقت
            count = Appointment.query.filter_by(
                doctor_id=doctor_id,
                appointment_date=date,
                appointment_time=time
            ).count()
            
            # إذا كان هناك 4 مواعيد أو أكثر، الوقت ممتلئ
            is_available = count < 4
            available = 4 - count if count < 4 else 0
            
            slots.append({
                'time': time,
                'available': available,
                'is_available': is_available
            })
        
        return jsonify({
            "success": True,
            "slots": slots
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"خطأ: {str(e)}"
        }), 500


# حجز موعد
@app.route('/api/book_appointment', methods=['POST', 'OPTIONS'])
def book_appointment():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        
        id_card = data.get('id_card')
        doctor_id = data.get('doctor_id')
        appointment_date = data.get('appointment_date')
        appointment_time = data.get('appointment_time')
        notes = data.get('notes', '')
        
        # التحقق من المريض
        patient = Patient.query.filter_by(id_card=id_card).first()
        if not patient:
            return jsonify({
                "success": False,
                "message": "المريض غير موجود"
            }), 404
        
        # التحقق من الطبيب
        doctor = Doctor.query.get(doctor_id)
        if not doctor:
            return jsonify({
                "success": False,
                "message": "الطبيب غير موجود"
            }), 404
        
        # التحقق من عدم امتلاء الموعد
        existing_appointments = Appointment.query.filter_by(
            doctor_id=doctor_id,
            appointment_date=appointment_date,
            appointment_time=appointment_time
        ).count()
        
        if existing_appointments >= 4:
            return jsonify({
                "success": False,
                "message": "هذا الموعد ممتلئ، يرجى اختيار موعد آخر"
            }), 409
        
        # إنشاء الموعد
        appointment = Appointment(
            id_card=id_card,
            doctor_id=doctor_id,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            notes=notes
        )
        
        # زيادة عدد الزيارات
        patient.visit_count += 1
        
        db.session.add(appointment)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "تم حجز الموعد بنجاح",
            "appointment": {
                "patient_name": patient.name,
                "visit_count": patient.visit_count,
                "doctor_name": doctor.name,
                "appointment_date": appointment_date,
                "appointment_time": appointment_time
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"خطأ: {str(e)}"
        }), 500


# الحصول على المواعيد
@app.route('/api/appointments', methods=['GET', 'OPTIONS'])
def get_appointments():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        appointments = Appointment.query.all()
        
        return jsonify({
            "success": True,
            "count": len(appointments),
            "appointments": [a.to_dict() for a in appointments]
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"خطأ: {str(e)}"
        }), 500


# طريقة يدوية لتسجيل الدخول بدون قاعدة بيانات
# قائمة السكرتيريين المسموحين (يمكنك تعديلها يدويًا)
ALLOWED_SECRETARIES = {
    'admin': generate_password_hash('123456'),
    'secretary1': generate_password_hash('password123'),
    'secretary2': generate_password_hash('secure456')
}


@app.route('/login', methods=['GET', 'POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json() if request.is_json else request.form
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username or not password:
            return jsonify({
                "success": False,
                "message": "يرجى إدخال اسم المستخدم وكلمة المرور"
            }), 400
        
        # التحقق من اسم المستخدم في القائمة المسموحة
        if username not in ALLOWED_SECRETARIES:
            return jsonify({
                "success": False,
                "message": "اسم المستخدم أو كلمة المرور غير صحيحة"
            }), 401
        
        # التحقق من كلمة المرور
        if not check_password_hash(ALLOWED_SECRETARIES[username], password):
            return jsonify({
                "success": False,
                "message": "اسم المستخدم أو كلمة المرور غير صحيحة"
            }), 401
        
        return jsonify({
            "success": True,
            "message": f"مرحباً {username}، تم تسجيل الدخول بنجاح",
            "username": username
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"حدث خطأ: {str(e)}"
        }), 500


# فحص صحة الخادم
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "message": "Server is running"
    }), 200


# معالجات الأخطاء
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "message": "الصفحة غير موجودة"
    }), 404


@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({
        "success": False,
        "message": "حدث خطأ في الخادم"
    }), 500

        
if __name__ == '__main__':
    app.run(debug=True, port=5001)
