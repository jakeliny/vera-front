import { fetcher, buildQueryParams, FetchResult } from "./fetcher";
import type { RegistrosResponse, RegistrosApiParams } from "@/types/registro";

const API_BASE_URL = "http://localhost:3000";

export const fetchRegistros = async (
	params: Partial<RegistrosApiParams>
): Promise<FetchResult<RegistrosResponse>> => {
	const queryString = buildQueryParams(params);
	const url = `${API_BASE_URL}/registros${queryString}`;

	return fetcher(url);
};

export const createRegistrosSWRKey = (
	params: Partial<RegistrosApiParams>
): string => {
	const cleanParams = Object.entries(params)
		.filter(
			([_, value]) => value !== undefined && value !== null && value !== ""
		)
		.reduce((acc, [key, value]) => {
			acc[key] = value;
			return acc;
		}, {} as Record<string, any>);

	return JSON.stringify(["registros", cleanParams]);
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
