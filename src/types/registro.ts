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
