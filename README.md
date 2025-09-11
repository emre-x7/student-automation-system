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


## 🛠️ Kullanılan Teknolojiler
- **Backend**: .NET 9, Entity Framework Core, PostgreSQL, JWT
- **Frontend**: React, Material-UI, Axios, React Router
- **Database**: PostgreSQL
- **Authentication**: JWT Token
- **API Documentation**: Swagger/OpenAPI

## 📦 Proje Yapısı
student-automation-system/
├── StudentAutomationAPI/ # Backend .NET 9 Projesi
│ ├── Controllers/ # API Controller'ları
│ ├── Models/ # Veritabanı modelleri
│ ├── Services/ # Business logic katmanı
│ ├── Data/ # DbContext ve migrations
│ ├── Dto/ # Data Transfer Objects
│ └── Program.cs # Uygulama giriş noktası
├── StudentAutomationFrontend/ # Frontend React Projesi
│ ├── src/
│ │ ├── components/ # Reusable component'lar
│ │ ├── pages/ # Sayfa component'ları
│ │ ├── services/ # API servisleri
│ │ ├── contexts/ # React context'ler
│ │ └── App.jsx # Ana uygulama component'i
│ └── package.json
└── README.md # Proje dokümantasyonu
