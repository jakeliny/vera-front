import useSWR from "swr";
import { fetchRegistroById } from "@/api/registros";
import type { Registro } from "@/types/registro";

type UseRegistroDetailsReturn = {
	data: Registro | undefined;
	error: Error | undefined;
	isLoading: boolean;
	mutate: () => void;
};

export const useRegistroDetails = (id: string | undefined): UseRegistroDetailsReturn => {
	const swrKey = id ? `registro-${id}` : null;

	const {
		data: swrData,
		error: swrError,
		isLoading,
		mutate,
	} = useSWR(
		swrKey,
		async () => {
			if (!id) return null;
			const [error, data] = await fetchRegistroById(id);
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
		data: swrData || undefined,
		error: swrError,
		isLoading,
		mutate,
	};
};
