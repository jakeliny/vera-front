export type Registro = {
	id: string;
	employee: string;
	salary: number;
	salaryCalculated: number;
	startDate: string;
	endDate: string;
	status: "ativo" | "inativo" | "pendente";
	createdAt: string;
	updatedAt: string;
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
	| "salaryCalculated"
	| "startDate"
	| "endDate"
	| "status";
export type SortDirection = "asc" | "desc";

export type RegistrosPagination = {
	page: number;
	limit: number;
	sortBy?: RegistrosSortField;
	sortDirection?: SortDirection;
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
