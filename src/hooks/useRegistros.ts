import useSWR from "swr";
import { fetchRegistros, createRegistrosSWRKey } from "@/api/registros";
import type {
	RegistrosResponse,
	RegistrosApiParams,
	Registro,
} from "@/types/registro";

type UseRegistrosReturn = {
	data: Registro[] | undefined;
	pagination: RegistrosResponse["pagination"] | undefined;
	error: Error | undefined;
	isLoading: boolean;
	mutate: () => void;
};

export const useRegistros = (
	params: Partial<RegistrosApiParams>
): UseRegistrosReturn => {
	const swrKey = createRegistrosSWRKey(params);

	const {
		data: swrData,
		error: swrError,
		isLoading,
		mutate,
	} = useSWR(
		swrKey,
		async () => {
			const [error, data] = await fetchRegistros(params);
			if (error) throw error;
			return data;
		},
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
			errorRetryCount: 3,
			errorRetryInterval: 1000,
		}
	);

	return {
		data: swrData?.data,
		pagination: swrData?.pagination,
		error: swrError,
		isLoading,
		mutate,
	};
};
