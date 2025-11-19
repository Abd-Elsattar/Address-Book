using AddressBook.Application.DTOs;
using AddressBook.Application.Interfaces;
using AddressBook.Domain.Entities;
using AddressBook.Domain.Interfaces;
using AutoMapper;

namespace AddressBook.Application.Services
{
    public class JobTitleService : IJobTitleService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public JobTitleService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<JobTitleDto>> GetAllJobTitleAsync()
        {
            var list = await _unitOfWork.JobTitles.GetAllAsync();
            return _mapper.Map<IEnumerable<JobTitleDto>>(list);
        }

        public async Task<JobTitleDto> GetJobTitleByIdAsync(int id)
        {
            var job = await _unitOfWork.JobTitles.GetByIdAsync(id);
            return job == null ? null : _mapper.Map<JobTitleDto>(job);
        }

        public async Task CreateJobTitleAsync(JobTitleDto dto)
        {
            var entity = _mapper.Map<JobTitle>(dto);
            await _unitOfWork.JobTitles.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateJobTitleAsync(int id, JobTitleDto dto)
        {
            var job = await _unitOfWork.JobTitles.GetByIdAsync(id);
            if (job == null) return;

            job.Title = dto.Title;
            await _unitOfWork.JobTitles.UpdateAsync(job);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteJobTitleAsync(int id)
        {
            var job = await _unitOfWork.JobTitles.GetByIdAsync(id);
            if (job == null) return;

            await _unitOfWork.JobTitles.DeleteAsync(job);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
