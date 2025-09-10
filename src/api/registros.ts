import { fetcher, buildQueryParams, type FetchResult } from "./fetcher";
import type {
	RegistrosResponse,
	RegistrosApiParams,
	Registro,
} from "@/types/registro";
import type { CreateRegistroData, UpdateRegistroData } from "@/lib/validation";

export const fetchRegistros = async (
	params: Partial<RegistrosApiParams>
): Promise<FetchResult<RegistrosResponse>> => {
	const queryString = buildQueryParams(params);
	const url = `${import.meta.env.VITE_API_URL}/registros${queryString}`;

	return fetcher(url);
};

export const createRegistro = async (
	data: CreateRegistroData
): Promise<FetchResult<Registro>> => {
	const url = `${import.meta.env.VITE_API_URL}/registros`;

	return fetcher(url, {
		method: "POST",
		body: data,
	});
};

export const fetchRegistroById = async (
	id: string
): Promise<FetchResult<Registro>> => {
	const url = `${import.meta.env.VITE_API_URL}/registros/${id}`;

	return fetcher(url);
};

export const updateRegistro = async (
	id: string,
	data: UpdateRegistroData
): Promise<FetchResult<Registro>> => {
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
