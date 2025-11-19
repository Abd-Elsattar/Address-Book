namespace AddressBook.Application.DTOs
{
    public class ContactDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public int JobTitleId { get; set; }
        public string JobTitleName { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public string MobileNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string PhotoPath { get; set; }
        public int Age { get; set; }

    }
}
