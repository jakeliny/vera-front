import type { Registro, RegistrosResponse } from "@/types/registro";

export const mockRegistros: Registro[] = [
	{
		id: "mock-1",
		employee: "João Silva Santos",
		salary: 4500,
		calculatedSalary: 4950,
		admissionDate: "2023-03-15",
		calculatedAdmissionDate: "15 de março de 2023",
		createdAt: "2023-03-15T10:30:00Z",
	},
	{
		id: "mock-2",
		employee: "Maria Fernanda Costa",
		salary: 6200,
		calculatedSalary: 6820,
		admissionDate: "2022-11-08",
		calculatedAdmissionDate: "8 de novembro de 2022",
		createdAt: "2022-11-08T14:15:00Z",
	},
	{
		id: "mock-3",
		employee: "Carlos Eduardo Lima",
		salary: 5800,
		calculatedSalary: 6380,
		admissionDate: "2023-01-20",
		calculatedAdmissionDate: "20 de janeiro de 2023",
		createdAt: "2023-01-20T09:45:00Z",
	},
	{
		id: "mock-4",
		employee: "Ana Paula Oliveira",
		salary: 7500,
		calculatedSalary: 8250,
		admissionDate: "2021-09-12",
		calculatedAdmissionDate: "12 de setembro de 2021",
		createdAt: "2021-09-12T16:20:00Z",
	},
	{
		id: "mock-5",
		employee: "Roberto Alves Pereira",
		salary: 3800,
		calculatedSalary: 4180,
		admissionDate: "2023-06-05",
		calculatedAdmissionDate: "5 de junho de 2023",
		createdAt: "2023-06-05T11:10:00Z",
	},
	{
		id: "mock-6",
		employee: "Patricia Souza Mendes",
		salary: 5200,
		calculatedSalary: 5720,
		admissionDate: "2022-08-30",
		calculatedAdmissionDate: "30 de agosto de 2022",
		createdAt: "2022-08-30T13:25:00Z",
	},
	{
		id: "mock-7",
		employee: "Fernando José Rodrigues",
		salary: 6800,
		calculatedSalary: 7480,
		admissionDate: "2021-12-03",
		calculatedAdmissionDate: "3 de dezembro de 2021",
		createdAt: "2021-12-03T08:40:00Z",
	},
	{
		id: "mock-8",
		employee: "Juliana Santos Silva",
		salary: 4200,
		calculatedSalary: 4620,
		admissionDate: "2023-04-18",
		calculatedAdmissionDate: "18 de abril de 2023",
		createdAt: "2023-04-18T15:55:00Z",
	},
	{
		id: "mock-9",
		employee: "Alexandre Martins Costa",
		salary: 5600,
		calculatedSalary: 6160,
		admissionDate: "2022-07-25",
		calculatedAdmissionDate: "25 de julho de 2022",
		createdAt: "2022-07-25T12:30:00Z",
	},
	{
		id: "mock-10",
		employee: "Camila Ribeiro Nascimento",
		salary: 7200,
		calculatedSalary: 7920,
		admissionDate: "2021-10-14",
		calculatedAdmissionDate: "14 de outubro de 2021",
		createdAt: "2021-10-14T07:15:00Z",
	},
];

export const mockRegistroDetail: Registro = {
	id: "mock-detail",
	employee: "Funcionário de Demonstração",
	salary: 5000,
	calculatedSalary: 5500,
	admissionDate: "2023-01-15",
	calculatedAdmissionDate: "15 de janeiro de 2023",
	createdAt: "2023-01-15T10:00:00Z",
};

export const createMockResponse = (
	data: Registro[],
	page: number = 0,
	limit: number = 8
): RegistrosResponse => ({
	data: data.slice(page * limit, (page + 1) * limit),
	pagination: {
		total: data.length,
		page: page + 1,
		limit,
		totalPages: Math.ceil(data.length / limit),
	},
});

// Simulate API delay for realistic UX
export const simulateDelay = (ms: number = 300): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, ms));

// Check if app is running in view-only mode
export const isViewOnlyMode = (): boolean => {
	return import.meta.env.VITE_VIEW_ONLY === "true";
};
