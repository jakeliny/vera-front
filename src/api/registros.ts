import { fetcher, buildQueryParams, type FetchResult } from "./fetcher";
import type {
	RegistrosResponse,
	RegistrosApiParams,
	Registro,
} from "@/types/registro";
import type { CreateRegistroData, UpdateRegistroData } from "@/lib/validation";
import {
	mockRegistros,
	mockRegistroDetail,
	createMockResponse,
	simulateDelay,
	isViewOnlyMode,
} from "@/lib/mockData";

export const fetchRegistros = async (
	params: Partial<RegistrosApiParams>
): Promise<FetchResult<RegistrosResponse>> => {
	if (isViewOnlyMode()) {
		await simulateDelay();
		const response = createMockResponse(
			mockRegistros,
			params.page || 0,
			params.limit || 8
		);
		return [null, response];
	}

	const queryString = buildQueryParams(params);
	const url = `${import.meta.env.VITE_API_URL}/registros${queryString}`;

	return fetcher(url);
};

export const createRegistro = async (
	data: CreateRegistroData
): Promise<FetchResult<Registro>> => {
	if (isViewOnlyMode()) {
		await simulateDelay();
		// In view-only mode, just return a mock success response
		const mockResult: Registro = {
			id: `mock-${Date.now()}`,
			employee: data.employee || "",
			salary: data.salary || 0,
			calculatedSalary: (data.salary || 0) * 1.1,
			admissionDate: data.admissionDate || "",
			calculatedAdmissionDate: data.admissionDate || "",
			createdAt: new Date().toISOString(),
		};
		return [null, mockResult];
	}

	const url = `${import.meta.env.VITE_API_URL}/registros`;

	return fetcher(url, {
		method: "POST",
		body: data,
	});
};

export const fetchRegistroById = async (
	id: string
): Promise<FetchResult<Registro>> => {
	if (isViewOnlyMode()) {
		await simulateDelay();
		// Always return the same mock detail record in view-only mode
		return [null, mockRegistroDetail];
	}

	const url = `${import.meta.env.VITE_API_URL}/registros/${id}`;

	return fetcher(url);
};

export const updateRegistro = async (
	id: string,
	data: UpdateRegistroData
): Promise<FetchResult<Registro>> => {
	if (isViewOnlyMode()) {
		await simulateDelay();
		// Return updated mock data in view-only mode
		const updatedMock: Registro = {
			...mockRegistroDetail,
			employee: data.employee || mockRegistroDetail.employee,
			salary: data.salary || mockRegistroDetail.salary,
			admissionDate: data.admissionDate || mockRegistroDetail.admissionDate,
			calculatedSalary: (data.salary || mockRegistroDetail.salary) * 1.1,
		};
		return [null, updatedMock];
	}

	const url = `${import.meta.env.VITE_API_URL}/registros/${id}`;

	return fetcher(url, {
		method: "PATCH",
		body: data,
	});
};

export const createRegistrosSWRKey = (
	params: Partial<RegistrosApiParams>
): string => {
	const cleanParams = Object.entries(params)
		.filter(
			([, value]) => value !== undefined && value !== null && value !== ""
		)
		.reduce((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {} as Record<string, unknown>);

	return JSON.stringify(["registros", cleanParams]);
};

export const deleteRegistro = async (
	id: string
): Promise<FetchResult<void>> => {
	if (isViewOnlyMode()) {
		await simulateDelay();
		// Simulate successful deletion in view-only mode
		return [null, undefined];
	}

	const url = `${import.meta.env.VITE_API_URL}/registros/${id}`;

	return fetcher(url, {
		method: "DELETE",
	});
};

export const parseRegistrosSWRKey = (
	key: string
): Partial<RegistrosApiParams> => {
	try {
		const [, params] = JSON.parse(key);
		return params || {};
	} catch {
		return {};
	}
};
