import { z } from "zod";

export const ErrorMessages = {
	DATE_FORMAT_INVALID: "Formato de data inválido. Use YYYY-MM-DD.",
	ADMISSION_DATE_FUTURE: "A data de admissão não pode estar no futuro.",
	SALARY_MUST_BE_POSITIVE: "O salário deve ser um valor positivo.",
	SALARY_MINIMUM: "O salário mínimo é R$ 1,00.",
	SALARY_MAXIMUM: "O salário máximo é R$ 100.000,00.",
	EMPLOYEE_NAME_REQUIRED: "O nome do funcionário é obrigatório.",
	EMPLOYEE_NAME_MAX_LENGTH:
		"O nome do funcionário deve ter no máximo 30 caracteres.",
};

const salary = {
	minimum: 1,
	maximum: 100000,
};

export const CreateRegistroSchema = z.object({
	admissionDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, ErrorMessages.DATE_FORMAT_INVALID)
		.refine((date) => {
			const inputDate = new Date(date);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			return inputDate <= today;
		}, ErrorMessages.ADMISSION_DATE_FUTURE),
	salary: z
		.number()
		.positive(ErrorMessages.SALARY_MUST_BE_POSITIVE)
		.min(salary.minimum, ErrorMessages.SALARY_MINIMUM)
		.max(salary.maximum, ErrorMessages.SALARY_MAXIMUM),
	employee: z
		.string()
		.min(1, ErrorMessages.EMPLOYEE_NAME_REQUIRED)
		.max(30, ErrorMessages.EMPLOYEE_NAME_MAX_LENGTH),
});

export const UpdateRegistroSchema = z.object({
	admissionDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, ErrorMessages.DATE_FORMAT_INVALID)
		.refine((date) => {
			const inputDate = new Date(date);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			return inputDate <= today;
		}, ErrorMessages.ADMISSION_DATE_FUTURE)
		.optional(),
	salary: z
		.number()
		.positive(ErrorMessages.SALARY_MUST_BE_POSITIVE)
		.min(salary.minimum, ErrorMessages.SALARY_MINIMUM)
		.max(salary.maximum, ErrorMessages.SALARY_MAXIMUM)
		.optional(),
	employee: z
		.string()
		.min(1, ErrorMessages.EMPLOYEE_NAME_REQUIRED)
		.max(30, ErrorMessages.EMPLOYEE_NAME_MAX_LENGTH)
		.optional(),
});

export type CreateRegistroData = z.infer<typeof CreateRegistroSchema>;
export type UpdateRegistroData = z.infer<typeof UpdateRegistroSchema>;
