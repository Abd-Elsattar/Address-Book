using Microsoft.AspNetCore.Http;

namespace AddressBook.Application.DTOs
{
    public class CreateContactDto
    {
        public string FullName { get; set; }
        public int JobTitleId { get; set; }
        public int DepartmentId { get; set; }
        public string MobileNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }

        public IFormFile Photo { get; set; }
    }

}
