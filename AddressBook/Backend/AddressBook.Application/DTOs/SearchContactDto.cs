namespace AddressBook.Application.DTOs
{
    public class SearchContactDto
    {
        public string FullName { get; set; }
        public int? JobTitleId { get; set; }
        public int? DepartmentId { get; set; }
        public string MobileNumber { get; set; }
        public DateTime? DateOfBirthFrom { get; set; }
        public DateTime? DateOfBirthTo { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public int? AgeFrom { get; set; }
        public int? AgeTo { get; set; }
    }
}
