export type FetchResult<T> = [Error, null] | [null, T];

export const fetcher = async (url: string): Promise<FetchResult<any>> => {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			if (response.status === 404 || response.status === 0) {
				return [
					new Error(
						`API não disponível. Verifique se o servidor está rodando em http://localhost:3000`
					),
					null,
				];
			}
			return [
				new Error(`HTTP Error: ${response.status} ${response.statusText}`),
				null,
			];
		}

		const data = await response.json();
		return [null, data] as [null, typeof data];
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		if (errorMessage.includes("fetch")) {
			return [
				new Error(
					`Não foi possível conectar ao servidor. Verifique se a API está rodando em http://localhost:3000`
				),
				null,
			];
		}
		return [new Error(`Fetch Error: ${errorMessage}`), null];
	}
};

export const buildQueryParams = (params: Record<string, any>): string => {
	const cleanParams = Object.entries(params)
		.filter(
			([_, value]) => value !== undefined && value !== null && value !== ""
		)
		.map(([key, value]) => [key, String(value)]);

	if (cleanParams.length === 0) return "";

	return "?" + new URLSearchParams(cleanParams).toString();
};
