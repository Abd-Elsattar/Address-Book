using System.ComponentModel.DataAnnotations;

namespace AddressBook.Domain.Entities
{
    public class JobTitle
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        public virtual ICollection<Contact> Contacts { get; set; }
    }
}
