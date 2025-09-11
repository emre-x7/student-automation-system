# student-automation-system
Student Automation | Full-Stack Project

# Öğrenci Otomasyon Sistemi

## Proje Açıklaması
.NET 9 ve React ile geliştirilmiş tam stack öğrenci otomasyon sistemi.

##  Özellikler
- **Kullanıcı Yönetimi**: Login/Register işlemleri
- **Rol Bazlı Erişim**: Admin, Teacher, Student
- **Öğrenci İşlemleri**: CRUD operasyonları + öğrenci profil görüntüleme
- **Öğretmen İşlemleri**: CRUD operasyonları
- **Ders Yönetimi**: Ders oluşturma, düzenleme, silme
- **Not ve Devamsızlık**: Öğretmen not girişi, öğrenci not görüntüleme
- **JWT Authentication**: Güvenli kimlik doğrulama


##  Kullanılan Teknolojiler
- **Backend**: .NET 9, Entity Framework Core, PostgreSQL, JWT
- **Frontend**: React, Material-UI, Axios, React Router
- **Database**: PostgreSQL
- **Authentication**: JWT Token
- **API Documentation**: Swagger/OpenAPI

## Ön Gereksinimler
.NET 9 SDK
Node.js 18+
PostgreSQL 14+
Git

## Proje Kurulumu
1. Projeyi Clone'lama 
bash
git clone <repository-url>
cd student-automation-system

2. Backend Kurulumu
bash
Backend dizinine gidin
cd StudentAutomationBackend
Bağımlılıkları yükleyin
dotnet restore
Veritabanını oluşturun (Entity Framework Migrations)
dotnet ef database update
Projeyi çalıştırın
dotnet run

Backend erişim: https://localhost:7150
Swagger API Docs: https://localhost:7150/swagger

3. Frontend Kurulumu
Frontend dizinine gidin
cd StudentAutomationFrontend
Bağımlılıkları yükleyin
npm install
Development server'ı başlatın
npm run dev

Frontend erişim: http://localhost:5173

4. Veritabanı Yapılandırması
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=5432;Database=StudentAutomationDB;User Id=postgres;Password=your_password;"
  }
}

5. Notlar
Backend ilk açılışta migration sonrası tabloları oluşturur.
Eğer PostgreSQL üzerinde DB yoksa StudentAutomationDB adında yeni bir veritabanı oluşturman gerekir.
Frontend ile Backend’in aynı anda çalışıyor olması gerekir.

## Test Kullanıcı Bilgileri
Admin Hesabı
Email: admin@school.com
Şifre: Admin123!
Yetkiler: Tüm sistem işlemleri

Öğretmen Hesabı
Email: ayse.yilmaz@school.com
Şifre: Teacher123!
Yetkiler: Öğrenci yönetimi, ders işlemleri, not girişi

Öğrenci Hesabı
Email: aysedemir@school.com
Şifre: Student123!
Yetkiler: Kendi bilgilerini görüntüleme, notlarını görme

------------------------------------------------------------

##  API ENDPOINT LİSTESİ

###  AUTHENTICATION ENDPOINTS
| Method | Endpoint | Açıklama | Yetki |
|--------|----------|----------|-------|
| `POST` | `/api/auth/login` | Kullanıcı girişi | Herkes |
| `POST` | `/api/auth/register` | Kullanıcı kaydı | Herkes |
| `GET` | `/api/auth/admin-test` | Admin test endpointi | Admin |

###  STUDENT ENDPOINTS
| Method | Endpoint | Açıklama | Yetki |
|--------|----------|----------|-------|
| `GET` | `/api/students` | Tüm öğrencileri listele | Admin, Teacher |
| `GET` | `/api/students/{id}` | ID ile öğrenci getir | Herkes (kendi profiline) |
| `POST` | `/api/students` | Yeni öğrenci oluştur | Admin, Teacher |
| `PUT` | `/api/students/{id}` | Öğrenci güncelle | Admin, Teacher |
| `DELETE` | `/api/students/{id}` | Öğrenci sil | Admin |
| `GET` | `/api/students/me/grades` | Öğrenci kendi notlarını görüntüle | Student |

###  TEACHER ENDPOINTS
| Method | Endpoint | Açıklama | Yetki |
|--------|----------|----------|-------|
| `GET` | `/api/teachers` | Tüm öğretmenleri listele | Admin |
| `GET` | `/api/teachers/{id}` | ID ile öğretmen getir | Admin |
| `POST` | `/api/teachers` | Yeni öğretmen oluştur | Admin |
| `PUT` | `/api/teachers/{id}` | Öğretmen güncelle | Admin |
| `DELETE` | `/api/teachers/{id}` | Öğretmen sil | Admin |
| `GET` | `/api/teachers/me/courses-with-students` | Öğretmenin derslerini ve öğrencilerini getir | Teacher |

###  COURSE ENDPOINTS
| Method | Endpoint | Açıklama | Yetki |
|--------|----------|----------|-------|
| `GET` | `/api/courses` | Tüm dersleri listele | Herkes |
| `GET` | `/api/courses/{id}` | ID ile ders getir | Herkes |
| `POST` | `/api/courses` | Yeni ders oluştur | Admin |
| `PUT` | `/api/courses/{id}` | Ders güncelle | Admin |
| `DELETE` | `/api/courses/{id}` | Ders sil | Admin |
| `GET` | `/api/courses/teacher/{teacherId}` | Öğretmenin derslerini listele | Admin, Teacher |
| `GET` | `/api/courses/{courseId}/students` | Derse kayıtlı öğrencileri listele | Admin, Teacher |
| `POST` | `/api/courses/{courseId}/students` | Derse öğrenci ekle | Admin, Teacher |
| `DELETE` | `/api/courses/{courseId}/students/{studentId}` | Dersten öğrenci çıkar | Admin, Teacher |
| `PUT` | `/api/courses/{courseId}/students/{studentId}/grade` | Öğrenci notunu güncelle | Admin, Teacher |
| `PUT` | `/api/courses/{courseId}/students/{studentId}/attendance` | Öğrenci devamsızlığını güncelle | Admin, Teacher |
| `PUT` | `/api/courses/{courseId}/students/{studentId}/comment` | Öğrenci yorumunu güncelle | Admin, Teacher |

## 🔗 SWAGGER/OPENAPI DÖKÜMANTASYONU

Proje Swagger/OpenAPI desteği ile gelmektedir. Backend uygulamasını çalıştırdıktan sonra:

**Swagger UI:** https://localhost:7150/swagger

**OpenAPI Specification:** https://localhost:7150/swagger/v1/swagger.json

---------------------------------------------------------------------------------------
## Yapılan Bonus Görevler
Zorunlu Bonuslar
Swagger/OpenAPI - API dokümantasyonu
Clean Code - Katmanlı mimari ve best practices

## Ek Bonuslar
Rol Bazlı Erişim Kontrolü - Detaylı permission yönetimi
JWT Authentication - Güvenli kimlik doğrulama
Password Hashing - BCrypt ile şifre güvenliği
Error Handling - Kapsamlı hata yönetimi
Loading States - Kullanıcı deneyimi iyileştirmeleri


