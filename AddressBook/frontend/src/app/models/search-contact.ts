export interface SearchContact {
  fullName?: string;
  jobTitleId?: number | null;
  departmentId?: number | null;
  mobileNumber?: string;
  dateOfBirthFrom?: string | null;
  dateOfBirthTo?: string | null;
  address?: string;
  email?: string;
  ageFrom?: number | null;
  ageTo?: number | null;
}
