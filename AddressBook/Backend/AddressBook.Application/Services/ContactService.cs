using AddressBook.Application.DTOs;
using AddressBook.Application.Interfaces;
using AddressBook.Domain.Entities;
using AddressBook.Domain.Interfaces;
using AutoMapper;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Http;

namespace AddressBook.Application.Services
{
    public class ContactService : IContactService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _uploadPath = "uploads/photos";
        private readonly string _webRoot;


        public ContactService(IUnitOfWork unitOfWork, IMapper mapper, IHttpContextAccessor httpContextAccessor, string webRoot)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _webRoot = webRoot;
        }

        public async Task<IEnumerable<ContactDto>> GetAllContactsAsync()
        {
            var contacts = await _unitOfWork.Contacts.GetAllAsync();
            foreach (var c in contacts)
            {
                c.JobTitle = await _unitOfWork.JobTitles.GetByIdAsync(c.JobTitleId);
                c.Department = await _unitOfWork.Departments.GetByIdAsync(c.DepartmentId);
            }
            return _mapper.Map<IEnumerable<ContactDto>>(contacts);
        }

        public async Task<ContactDto> GetContactByIdAsync(int id)
        {
            var contact = await _unitOfWork.Contacts.GetByIdAsync(id);
            if (contact == null) return null;

            contact.JobTitle = await _unitOfWork.JobTitles.GetByIdAsync(contact.JobTitleId);
            contact.Department = await _unitOfWork.Departments.GetByIdAsync(contact.DepartmentId);

            return _mapper.Map<ContactDto>(contact);
        }

        public async Task<ContactDto> CreateContactAsync(CreateContactDto dto)
        {
            var entity = _mapper.Map<Contact>(dto);
            entity.PhotoPath = await SavePhotoAsync(dto.Photo);

            await _unitOfWork.Contacts.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();

            return await GetContactByIdAsync(entity.Id);
        }

        public async Task<ContactDto> UpdateContactAsync(int id, CreateContactDto dto)
        {
            var contact = await _unitOfWork.Contacts.GetByIdAsync(id);
            if (contact == null) return null;

            _mapper.Map(dto, contact);
            contact.ModifiedDate = DateTime.Now;

            if (dto.Photo != null)
                contact.PhotoPath = await SavePhotoAsync(dto.Photo);

            await _unitOfWork.Contacts.UpdateAsync(contact);
            await _unitOfWork.SaveChangesAsync();

            return await GetContactByIdAsync(id);
        }

        public async Task<bool> DeleteContactAsync(int id, string webRootPath)
        {
            var contact = await _unitOfWork.Contacts.GetByIdAsync(id);
            if (contact == null) return false;
            
            if (!string.IsNullOrEmpty(contact.PhotoPath))
            {
                var relativePath = contact.PhotoPath.TrimStart('/');
                var fullPath = Path.Combine(webRootPath, relativePath);

                if (File.Exists(fullPath))
                    File.Delete(fullPath);
            }

            await _unitOfWork.Contacts.DeleteAsync(contact);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ContactDto>> SearchContactAsync(SearchContactDto dto)
        {
            var contacts = await _unitOfWork.Contacts.GetAllAsync();

            if (!string.IsNullOrEmpty(dto.FullName))
                contacts = contacts.Where(c => c.FullName.Contains(dto.FullName, StringComparison.OrdinalIgnoreCase));

            if (dto.JobTitleId.HasValue)
                contacts = contacts.Where(c => c.JobTitleId == dto.JobTitleId);

            if (dto.DepartmentId.HasValue)
                contacts = contacts.Where(c => c.DepartmentId == dto.DepartmentId);

            if (!string.IsNullOrEmpty(dto.MobileNumber))
                contacts = contacts.Where(c => c.MobileNumber.Contains(dto.MobileNumber));

            if (dto.DateOfBirthFrom.HasValue)
                contacts = contacts.Where(c => c.DateOfBirth >= dto.DateOfBirthFrom);

            if (dto.DateOfBirthTo.HasValue)
                contacts = contacts.Where(c => c.DateOfBirth <= dto.DateOfBirthTo);

            if (!string.IsNullOrEmpty(dto.Email))
                contacts = contacts.Where(c => c.Email.Contains(dto.Email, StringComparison.OrdinalIgnoreCase));

            if (!string.IsNullOrEmpty(dto.Address))
                contacts = contacts.Where(c => c.Address.Contains(dto.Address, StringComparison.OrdinalIgnoreCase));

            foreach (var c in contacts)
            {
                c.JobTitle = await _unitOfWork.JobTitles.GetByIdAsync(c.JobTitleId);
                c.Department = await _unitOfWork.Departments.GetByIdAsync(c.DepartmentId);
            }

            return _mapper.Map<IEnumerable<ContactDto>>(contacts);
        }

        public async Task<byte[]> ExportToExcelAsync()
        {
            var list = await GetAllContactsAsync();

            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Address Book");

            ws.Cell(1, 1).Value = "Full Name";
            ws.Cell(1, 2).Value = "Job Title";
            ws.Cell(1, 3).Value = "Department";
            ws.Cell(1, 4).Value = "Mobile";
            ws.Cell(1, 5).Value = "Birthdate";
            ws.Cell(1, 6).Value = "Age";
            ws.Cell(1, 7).Value = "Address";
            ws.Cell(1, 8).Value = "Email";

            int row = 2;
            foreach (var c in list)
            {
                ws.Cell(row, 1).Value = c.FullName;
                ws.Cell(row, 2).Value = c.JobTitleName;
                ws.Cell(row, 3).Value = c.DepartmentName;
                ws.Cell(row, 4).Value = c.MobileNumber;
                ws.Cell(row, 5).Value = c.DateOfBirth.ToString("yyyy-MM-dd");
                ws.Cell(row, 6).Value = c.Age;
                ws.Cell(row, 7).Value = c.Address;
                ws.Cell(row, 8).Value = c.Email;
                row++;
            }

            ws.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            wb.SaveAs(stream);
            return stream.ToArray();
        }

        private async Task<string> SavePhotoAsync(IFormFile photo)
        {
            if (photo == null) return null;

            var folder = Path.Combine(_webRoot, _uploadPath);
            Directory.CreateDirectory(folder);

            var file = $"{Guid.NewGuid()}_{photo.FileName}";
            var path = Path.Combine(folder, file);

            using (var fs = new FileStream(path, FileMode.Create))
            {
                await photo.CopyToAsync(fs);
            }

            return $"/{_uploadPath}/{file}";
        }
    }
}