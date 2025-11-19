using AddressBook.Application.DTOs;

namespace AddressBook.Application.Interfaces
{
    public interface IContactService
    {
        Task<IEnumerable<ContactDto>> GetAllContactsAsync();
        Task<ContactDto> GetContactByIdAsync(int id);
        Task<ContactDto> CreateContactAsync(CreateContactDto contactDto);
        Task<ContactDto> UpdateContactAsync(int id, CreateContactDto createContactDto);
        Task<bool> DeleteContactAsync(int id, string webRootPath);
        Task<IEnumerable<ContactDto>> SearchContactAsync(SearchContactDto searchContactDto);
        Task<byte[]> ExportToExcelAsync();
    }
}
