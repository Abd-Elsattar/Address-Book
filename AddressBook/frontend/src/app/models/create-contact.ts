export interface CreateContact {
  fullName: string;
  jobTitleId: number;
  departmentId: number;
  mobileNumber: string;
  dateOfBirth: string;
  address: string;
  email: string;
  photo?: File | null;
}
