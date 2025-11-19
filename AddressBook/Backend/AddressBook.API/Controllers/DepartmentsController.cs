using AddressBook.Application.DTOs;
using AddressBook.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AddressBook.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentService _service;

        public DepartmentsController(IDepartmentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllDepartmentsAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dep = await _service.GetDepartmentByIdAsync(id);
            if (dep == null)
                return NotFound();

            return Ok(dep);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DepartmentDto dto)
        {
            await _service.CreateDepartmentAsync(dto);
            return Ok(new { message = "Department created successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DepartmentDto dto)
        {
            var exists = await _service.GetDepartmentByIdAsync(id);
            if (exists == null)
                return NotFound();

            await _service.UpdateDepartmentAsync(id, dto);
            return Ok(new { message = "Department updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var exists = await _service.GetDepartmentByIdAsync(id);
            if (exists == null)
                return NotFound();

            await _service.DeleteDepartmentAsync(id);
            return Ok(new { message = "Department deleted successfully" });
        }
    }
}
