using AddressBook.Application.DTOs;
using AddressBook.Application.Interfaces;
using AddressBook.Domain.Entities;
using AddressBook.Domain.Interfaces;
using AutoMapper;

namespace AddressBook.Application.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public DepartmentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync()
        {
            var list = await _unitOfWork.Departments.GetAllAsync();
            return _mapper.Map<IEnumerable<DepartmentDto>>(list);
        }

        public async Task<DepartmentDto> GetDepartmentByIdAsync(int id)
        {
            var dep = await _unitOfWork.Departments.GetByIdAsync(id);
            return dep == null ? null : _mapper.Map<DepartmentDto>(dep);
        }

        public async Task CreateDepartmentAsync(DepartmentDto dto)
        {
            var entity = _mapper.Map<Department>(dto);
            await _unitOfWork.Departments.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateDepartmentAsync(int id, DepartmentDto dto)
        {
            var dep = await _unitOfWork.Departments.GetByIdAsync(id);
            if (dep == null) return;

            _mapper.Map(dto, dep);
            await _unitOfWork.Departments.UpdateAsync(dep);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteDepartmentAsync(int id)
        {
            var dep = await _unitOfWork.Departments.GetByIdAsync(id);
            if (dep == null) return;

            await _unitOfWork.Departments.DeleteAsync(dep);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
