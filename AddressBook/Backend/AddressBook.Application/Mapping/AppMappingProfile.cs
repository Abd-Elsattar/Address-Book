using AddressBook.Application.DTOs;
using AddressBook.Domain.Entities;
using AutoMapper;

namespace AddressBook.Application.Mapping
{
    public class AppMappingProfile : Profile
    {
        public AppMappingProfile()
        {
            CreateMap<Contact, ContactDto>()
                .ForMember(d => d.JobTitleName, opt => opt.MapFrom(s => s.JobTitle.Title))
                .ForMember(d => d.DepartmentName, opt => opt.MapFrom(s => s.Department.Name));

            CreateMap<CreateContactDto, Contact>();

            CreateMap<JobTitle, JobTitleDto>()
                .ForSourceMember(src => src.Contacts, opt => opt.DoNotValidate());

            CreateMap<JobTitleDto, JobTitle>();

            CreateMap<Department, DepartmentDto>();

            CreateMap<DepartmentDto, Department>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<RegisterDto, User>()
                .ForMember(d => d.PasswordHash, opt => opt.Ignore());
        }
    }
}
