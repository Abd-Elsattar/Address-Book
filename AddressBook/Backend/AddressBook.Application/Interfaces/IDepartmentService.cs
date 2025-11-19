using AddressBook.Application.DTOs;

namespace AddressBook.Application.Interfaces
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync();
        Task<DepartmentDto> GetDepartmentByIdAsync(int id);
        Task CreateDepartmentAsync(DepartmentDto departmentDto);
        Task UpdateDepartmentAsync(int id, DepartmentDto departmentDto);
        Task DeleteDepartmentAsync(int id);
    }
}
