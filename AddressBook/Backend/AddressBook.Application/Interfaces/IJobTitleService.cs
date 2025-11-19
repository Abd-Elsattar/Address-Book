using AddressBook.Application.DTOs;

namespace AddressBook.Application.Interfaces
{
    public interface IJobTitleService
    {
        Task<IEnumerable<JobTitleDto>> GetAllJobTitleAsync();
        Task<JobTitleDto> GetJobTitleByIdAsync(int id);
        Task CreateJobTitleAsync(JobTitleDto jobTitle);
        Task UpdateJobTitleAsync(int id, JobTitleDto jobTitle);
        Task DeleteJobTitleAsync(int id);
    }
}
