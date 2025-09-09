export type FetchResult<T> = [Error, null] | [null, T];

type RequestOptions = {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: unknown;
	headers?: Record<string, string>;
};

export const fetcher = async <T>(
	url: string,
	options?: RequestOptions
): Promise<FetchResult<T>> => {
	try {
		const { method = "GET", body, headers = {} } = options || {};

		const requestHeaders: Record<string, string> = {
			...headers,
		};

		if (body && method !== "GET") {
			requestHeaders["Content-Type"] = "application/json";
		}

		const response = await fetch(url, {
			method,
			headers: requestHeaders,
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			if (response.status === 404 || response.status === 0) {
				return [
					new Error(
						`API não disponível. Verifique se o servidor está rodando em http://localhost:3000`
					),
					null,
				];
			}

			let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
			try {
				const errorData = await response.json();
				if (errorData.message) {
					errorMessage = errorData.message;
				}
			} catch (error) {
				console.error("Error parsing JSON:", error);
			}

			return [new Error(errorMessage), null];
		}

		const contentLength = response.headers.get("content-length");
		const contentType = response.headers.get("content-type");

		if (
			contentLength === "0" ||
			(!contentType?.includes("application/json") && !contentLength)
		) {
			return [null, {} as T];
		}

		try {
			const data = await response.json();
			return [null, data] as [null, typeof data];
		} catch (error) {
			if (response.status >= 200 && response.status < 300) {
				return [null, {} as T];
			}
			throw error;
		}
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

export const buildQueryParams = (params: Record<string, unknown>): string => {
	const cleanParams = Object.entries(params)
		.filter(
			([, value]) => value !== undefined && value !== null && value !== ""
		)
		.map(([key, value]) => [key, String(value)]);

	if (cleanParams.length === 0) return "";

	return "?" + new URLSearchParams(cleanParams).toString();
};
