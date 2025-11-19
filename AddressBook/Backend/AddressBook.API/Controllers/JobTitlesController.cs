using AddressBook.Application.DTOs;
using AddressBook.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AddressBook.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class JobTitlesController : ControllerBase
    {
        private readonly IJobTitleService _service;

        public JobTitlesController(IJobTitleService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllJobTitleAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var job = await _service.GetJobTitleByIdAsync(id);
            if (job == null)
                return NotFound();

            return Ok(job);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] JobTitleDto dto)
        {
            await _service.CreateJobTitleAsync(dto);
            return Ok(new { message = "Job title created successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] JobTitleDto dto)
        {
            var exists = await _service.GetJobTitleByIdAsync(id);
            if (exists == null)
                return NotFound();

            await _service.UpdateJobTitleAsync(id, dto);
            return Ok(new { message = "Job title updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var exists = await _service.GetJobTitleByIdAsync(id);
            if (exists == null)
                return NotFound();

            await _service.DeleteJobTitleAsync(id);
            return Ok(new { message = "Job title deleted successfully" });
        }
    }
}
