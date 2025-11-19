using AddressBook.Application.DTOs;
using AddressBook.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AddressBook.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService _contactService;
        private readonly IWebHostEnvironment _env;
        public ContactsController(IContactService contactService, IWebHostEnvironment env)
        {
            _contactService = contactService;
            _env = env;
        }   

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var contacts = await _contactService.GetAllContactsAsync();
            return Ok(contacts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var contact = await _contactService.GetContactByIdAsync(id);
            if (contact == null)
                return NotFound();

            return Ok(contact);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateContactDto dto)
        {
            var created = await _contactService.CreateContactAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] CreateContactDto dto)
        {
            var updated = await _contactService.UpdateContactAsync(id, dto);
            if (updated == null) return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var fullRootPath = Path.Combine(_env.WebRootPath);
            var deleted = await _contactService.DeleteContactAsync(id, _env.WebRootPath);
            if (!deleted)
                return NotFound();

            return NoContent();
        }

        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] SearchContactDto searchDto)
        {
            var results = await _contactService.SearchContactAsync(searchDto);
            return Ok(results);
        }

        [HttpGet("export")]
        public async Task<IActionResult> Export()
        {
            var fileBytes = await _contactService.ExportToExcelAsync();

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "AddressBook.xlsx"
            );
        }
    }
}
