import type { Registro, RegistrosResponse } from "@/types/registro";

export const mockRegistros: Registro[] = [
	{
		id: "mock-1",
		employee: "João Silva Santos",
		salary: 4500,
		calculatedSalary: 4950,
		admissionDate: "2023-03-15",
		calculatedAdmissionDate: "26 days, 5 months and 2 years",
		createdAt: "2023-03-15T10:30:00Z",
	},
	{
		id: "mock-2",
		employee: "Maria Fernanda Costa",
		salary: 6200,
		calculatedSalary: 6820,
		admissionDate: "2022-11-08",
		calculatedAdmissionDate: "2 days, 10 months and 2 years",
		createdAt: "2022-11-08T14:15:00Z",
	},
	{
		id: "mock-3",
		employee: "Carlos Eduardo Lima",
		salary: 5800,
		calculatedSalary: 6380,
		admissionDate: "2023-01-20",
		calculatedAdmissionDate: "21 days, 7 months and 2 years",
		createdAt: "2023-01-20T09:45:00Z",
	},
	{
		id: "mock-4",
		employee: "Ana Paula Oliveira",
		salary: 7500,
		calculatedSalary: 8250,
		admissionDate: "2021-09-12",
		calculatedAdmissionDate: "29 days, 11 months and 3 years",
		createdAt: "2021-09-12T16:20:00Z",
	},
	{
		id: "mock-5",
		employee: "Roberto Alves Pereira",
		salary: 3800,
		calculatedSalary: 4180,
		admissionDate: "2023-06-05",
		calculatedAdmissionDate: "5 days, 3 months and 2 years",
		createdAt: "2023-06-05T11:10:00Z",
	},
	{
		id: "mock-6",
		employee: "Patricia Souza Mendes",
		salary: 5200,
		calculatedSalary: 5720,
		admissionDate: "2022-08-30",
		calculatedAdmissionDate: "11 days, 1 month and 3 years",
		createdAt: "2022-08-30T13:25:00Z",
	},
	{
		id: "mock-7",
		employee: "Fernando José Rodrigues",
		salary: 6800,
		calculatedSalary: 7480,
		admissionDate: "2021-12-03",
		calculatedAdmissionDate: "7 days, 9 months and 3 years",
		createdAt: "2021-12-03T08:40:00Z",
	},
	{
		id: "mock-8",
		employee: "Juliana Santos Silva",
		salary: 4200,
		calculatedSalary: 4620,
		admissionDate: "2023-04-18",
		calculatedAdmissionDate: "23 days, 4 months and 2 years",
		createdAt: "2023-04-18T15:55:00Z",
	},
	{
		id: "mock-9",
		employee: "Alexandre Martins Costa",
		salary: 5600,
		calculatedSalary: 6160,
		admissionDate: "2022-07-25",
		calculatedAdmissionDate: "16 days, 1 month and 3 years",
		createdAt: "2022-07-25T12:30:00Z",
	},
	{
		id: "mock-10",
		employee: "Camila Ribeiro Nascimento",
		salary: 7200,
		calculatedSalary: 7920,
		admissionDate: "2021-10-14",
		calculatedAdmissionDate: "27 days, 10 months and 3 years",
		createdAt: "2021-10-14T07:15:00Z",
	},
	{
		id: "mock-11",
		employee: "Bruno Silva Lima",
		salary: 4800,
		calculatedSalary: 5280,
		admissionDate: "2023-02-10",
		calculatedAdmissionDate: "31 days, 6 months and 2 years",
		createdAt: "2023-02-10T14:30:00Z",
	},
	{
		id: "mock-12",
		employee: "Luciana Oliveira Santos",
		salary: 6500,
		calculatedSalary: 7150,
		admissionDate: "2022-12-05",
		calculatedAdmissionDate: "5 days, 9 months and 2 years",
		createdAt: "2022-12-05T10:15:00Z",
	},
	{
		id: "mock-13",
		employee: "Ricardo Costa Pereira",
		salary: 5300,
		calculatedSalary: 5830,
		admissionDate: "2023-08-22",
		calculatedAdmissionDate: "19 days, 0 months and 2 years",
		createdAt: "2023-08-22T16:45:00Z",
	},
	{
		id: "mock-14",
		employee: "Vanessa Souza Rodrigues",
		salary: 4100,
		calculatedSalary: 4510,
		admissionDate: "2023-05-18",
		calculatedAdmissionDate: "23 days, 3 months and 2 years",
		createdAt: "2023-05-18T11:20:00Z",
	},
	{
		id: "mock-15",
		employee: "Gustavo Almeida Silva",
		salary: 7800,
		calculatedSalary: 8580,
		admissionDate: "2021-07-30",
		calculatedAdmissionDate: "11 days, 1 month and 4 years",
		createdAt: "2021-07-30T08:10:00Z",
	},
	{
		id: "mock-16",
		employee: "Priscila Ferreira Costa",
		salary: 5900,
		calculatedSalary: 6490,
		admissionDate: "2022-09-15",
		calculatedAdmissionDate: "26 days, 11 months and 2 years",
		createdAt: "2022-09-15T13:55:00Z",
	},
	{
		id: "mock-17",
		employee: "Marcos Henrique Lima",
		salary: 6700,
		calculatedSalary: 7370,
		admissionDate: "2023-11-08",
		calculatedAdmissionDate: "2 days, 10 months and 1 year",
		createdAt: "2023-11-08T09:25:00Z",
	},
];

export const mockRegistroDetail: Registro = {
	id: "mock-detail",
	employee: "Demo Employee",
	salary: 5000,
	calculatedSalary: 5500,
	admissionDate: "2023-01-15",
	calculatedAdmissionDate: "26 days, 7 months and 2 years",
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
		page,
		limit,
		totalPages: Math.ceil(data.length / limit),
	},
});

export const simulateDelay = (ms: number = 300): Promise<void> =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const isViewOnlyMode = (): boolean => {
	return import.meta.env.VITE_VIEW_ONLY === "true";
};
