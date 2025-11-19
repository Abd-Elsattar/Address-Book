using AddressBook.Domain.Entities;
using AddressBook.Domain.Interfaces;
using AddressBook.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AddressBook.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        private IRepository<Contact> _contacts;
        private IRepository<JobTitle> _jobTitles;
        private IRepository<Department> _departments;
        private IRepository<User> _users;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IRepository<Contact> Contacts =>
            _contacts ??= new Repository<Contact>(_context);

        public IRepository<JobTitle> JobTitles =>
            _jobTitles ??= new Repository<JobTitle>(_context);

        public IRepository<Department> Departments =>
            _departments ??= new Repository<Department>(_context);

        public IRepository<User> Users =>
            _users ??= new Repository<User>(_context);

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}