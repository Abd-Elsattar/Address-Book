using System.ComponentModel.DataAnnotations;

namespace AddressBook.Domain.Entities
{
    public class Contact
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string FullName { get; set; }

        public int JobTitleId { get; set; }
        public virtual JobTitle JobTitle { get; set; }

        public int DepartmentId { get; set; }
        public virtual Department Department { get; set; }

        [Required]
        [Phone]
        [StringLength(20)]
        public string MobileNumber { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        [StringLength(500)]
        public string Address { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; }

        public string PhotoPath { get; set; }

        public int Age => DateTime.Now.Year - DateOfBirth.Year -
            (DateTime.Now.DayOfYear < DateOfBirth.DayOfYear ? 1 : 0);

        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? ModifiedDate { get; set; }
    }
}
