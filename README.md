# Address Book (Angular + ASP.NET Core)

A simple address book web application built with **ASP.NET Core API** and **Angular**.

---

## Consideration

The system includes:

- Add new contact (Full Name, Job Title, Department, Mobile, DOB, Address, Email, Photo, Age)
- Edit contact (Popup dialog)
- Delete contact (Confirmation alert)
- Search by all fields + date range
- Export list to Excel
- Manage Job Titles & Departments (Add/Edit/Delete)
- Login service (Full-screen login page)
- Validations (Email, phone number, age range)
- Responsive UI
- Code-first database (SQL Server)
- Lazy loading (frontend & backend)
- Onion Architecture
- Clean Angular 20 

---

## Run Backend

Place your connection string in your appsetting.json file !!!.
cd Backend
dotnet restore
dotnet run

---

## Run Frontend

cd Frontend
npm install
ng serve
