export type Registro = {
	id: string;
	employee: string;
	salary: number;
	calculatedSalary: number;
	admissionDate: string;
	calculatedAdmissionDate: string;
	createdAt: string;
};

export type RegistroFilters = {
	startSalary?: number;
	endSalary?: number;
	startSalaryCalculated?: number;
	endSalaryCalculated?: number;
	employee?: string;
	startDate?: string;
	endDate?: string;
};

export type RegistrosSortField =
	| "employee"
	| "salary"
	| "calculatedSalary"
	| "admissionDate"
	| "createdAt";
export type SortDirection = "asc" | "desc";

export type RegistrosPagination = {
	page: number;
	limit: number;
	orderBy?: RegistrosSortField;
	order?: SortDirection;
};

export type RegistrosResponse = {
	data: Registro[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
};

export type RegistrosApiParams = RegistroFilters & RegistrosPagination;
