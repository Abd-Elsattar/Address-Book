using AddressBook.Domain.Entities;

namespace AddressBook.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<Contact> Contacts { get; }
        IRepository<JobTitle> JobTitles { get; }
        IRepository<Department> Departments { get; }
        IRepository<User> Users { get; }
        Task SaveChangesAsync();
    }
}
