using System.ComponentModel.DataAnnotations;

namespace AddressBook.Domain.Entities
{
    public class Department
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public virtual ICollection<Contact> Contacts { get; set; }
    }
}
