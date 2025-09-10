import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateRegistro } from "@/api/registros";
import { useRegistroDetails } from "@/hooks/useRegistroDetails";
import { mutate as globalMutate } from "swr";
import {
	UpdateRegistroSchema,
	type UpdateRegistroData,
} from "@/lib/validation";

function RegistroDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [isUpdating, setIsUpdating] = useState(false);
	const [formData, setFormData] = useState<UpdateRegistroData>({});
	const [validationErrors, setValidationErrors] = useState<
		Partial<Record<keyof UpdateRegistroData, string>>
	>({});

	const {
		data: registro,
		error: fetchError,
		isLoading,
		mutate,
	} = useRegistroDetails(id);

	useEffect(() => {
		if (!id) {
			navigate("/registros");
			return;
		}
	}, [id, navigate]);

	useEffect(() => {
		if (registro) {
			setFormData({
				employee: registro.employee,
				salary: registro.salary,
				admissionDate: registro.admissionDate,
			});
		}
	}, [registro]);

	const handleInputChange = (
		key: keyof UpdateRegistroData,
		value: string | number
	) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
		if (validationErrors[key]) {
			setValidationErrors((prev) => ({ ...prev, [key]: undefined }));
		}
	};

	const validateForm = (): boolean => {
		const result = UpdateRegistroSchema.safeParse(formData);

		if (!result.success) {
			const newErrors: Partial<Record<keyof UpdateRegistroData, string>> = {};
			result.error.issues.forEach((issue) => {
				const field = issue.path[0] as keyof UpdateRegistroData;
				newErrors[field] = issue.message;
			});
			setValidationErrors(newErrors);
			return false;
		}

		setValidationErrors({});
		return true;
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!id || !validateForm()) return;

		setIsUpdating(true);

		const [updateError] = await updateRegistro(id, formData);

		if (updateError) {
			toast.error(updateError.message || "Erro ao atualizar registro");
			setIsUpdating(false);
			return;
		}

		toast.success("Registro atualizado com sucesso");
		mutate();
		globalMutate((key) => typeof key === "string" && key.includes("registros"));
		setIsUpdating(false);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen p-8">
				<div className="max-w-2xl mx-auto">
					<div className="bg-white p-6 rounded-lg shadow-sm border">
						<div className="animate-pulse">
							<div className="h-6 bg-gray-200 rounded mb-4"></div>
							<div className="space-y-4">
								{Array.from({ length: 6 }).map((_, index) => (
									<div key={index} className="space-y-2">
										<div className="h-4 bg-gray-200 rounded w-1/4"></div>
										<div className="h-10 bg-gray-200 rounded"></div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (fetchError) {
		return (
			<div className="min-h-screen p-8">
				<div className="max-w-2xl mx-auto">
					<div className="mb-6">
						<Link to="/registros">
							<Button variant="outline" className="gap-2">
								<ArrowLeft className="h-4 w-4" />
								Voltar
							</Button>
						</Link>
					</div>
					<div className="bg-red-50 border border-red-200 rounded-lg p-6">
						<h2 className="text-lg font-semibold text-red-800 mb-2">
							Erro ao carregar registro
						</h2>
						<p className="text-red-600 mb-4">{fetchError.message}</p>
						<Button onClick={() => mutate()} variant="outline">
							Tentar novamente
						</Button>
					</div>
				</div>
			</div>
		);
	}

	if (!registro) {
		return null;
	}

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-2xl mx-auto">
				<div className="mb-6 flex items-center justify-between">
					<Link to="/registros">
						<Button variant="outline" className="gap-2">
							<ArrowLeft className="h-4 w-4" />
							Voltar
						</Button>
					</Link>
					<h1 className="text-2xl font-bold text-gray-900">
						Detalhes do Registro
					</h1>
				</div>

				<form
					onSubmit={handleSave}
					className="bg-white p-6 rounded-lg shadow-sm border space-y-6"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								ID
							</label>
							<div className="px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md">
								{registro.id}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Data de Criação
							</label>
							<div className="px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md">
								{new Date(registro.createdAt).toLocaleDateString("pt-BR")}
							</div>
						</div>

						<div>
							<label
								htmlFor="employee"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Nome do Funcionário
							</label>
							<Input
								id="employee"
								value={formData.employee || ""}
								onChange={(e) => handleInputChange("employee", e.target.value)}
								disabled={isUpdating}
							/>
							{validationErrors.employee && (
								<p className="mt-1 text-sm text-red-600">
									{validationErrors.employee}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="salary"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Salário (R$)
							</label>
							<Input
								id="salary"
								type="number"
								min="0"
								step="0.01"
								value={formData.salary || ""}
								onChange={(e) =>
									handleInputChange("salary", parseFloat(e.target.value) || 0)
								}
								disabled={isUpdating}
							/>
							{validationErrors.salary && (
								<p className="mt-1 text-sm text-red-600">
									{validationErrors.salary}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Salário Calculado (R$)
							</label>
							<div className="px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md">
								{new Intl.NumberFormat("pt-BR", {
									style: "currency",
									currency: "BRL",
								}).format(registro.calculatedSalary)}
							</div>
						</div>

						<div>
							<label
								htmlFor="admissionDate"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Data de Admissão
							</label>
							<Input
								id="admissionDate"
								type="date"
								value={formData.admissionDate || ""}
								onChange={(e) =>
									handleInputChange("admissionDate", e.target.value)
								}
								disabled={isUpdating}
							/>
							{validationErrors.admissionDate && (
								<p className="mt-1 text-sm text-red-600">
									{validationErrors.admissionDate}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Data de Admissão Calculada
							</label>
							<div className="px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-md">
								{registro.calculatedAdmissionDate || "N/A"}
							</div>
						</div>
					</div>

					<div className="flex justify-end pt-6 border-t">
						<Button type="submit" disabled={isUpdating} className="gap-2">
							{isUpdating ? (
								"Salvando..."
							) : (
								<>
									<Save className="h-4 w-4" />
									Salvar
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default RegistroDetails;
