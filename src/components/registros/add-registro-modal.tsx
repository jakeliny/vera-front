import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CreateRegistroSchema, type CreateRegistroData } from "@/lib/validation";
import { createRegistro } from "@/api/registros";

type AddRegistroModalProps = {
	onSuccess: () => void;
	disabled?: boolean;
};

export function AddRegistroModal({ onSuccess, disabled }: AddRegistroModalProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<CreateRegistroData>({
		employee: "",
		salary: 0,
		admissionDate: "",
	});
	const [errors, setErrors] = useState<Partial<Record<keyof CreateRegistroData, string>>>({});

	const handleInputChange = (key: keyof CreateRegistroData, value: string | number) => {
		setFormData(prev => ({ ...prev, [key]: value }));
		if (errors[key]) {
			setErrors(prev => ({ ...prev, [key]: undefined }));
		}
	};

	const validateForm = (): boolean => {
		const result = CreateRegistroSchema.safeParse(formData);
		
		if (!result.success) {
			const newErrors: Partial<Record<keyof CreateRegistroData, string>> = {};
			result.error.errors.forEach(error => {
				const field = error.path[0] as keyof CreateRegistroData;
				newErrors[field] = error.message;
			});
			setErrors(newErrors);
			return false;
		}
		
		setErrors({});
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) return;
		
		setIsSubmitting(true);
		
		const [error, data] = await createRegistro(formData);
		
		if (error) {
			toast.error(error.message || "Erro ao criar registro");
			setIsSubmitting(false);
			return;
		}
		
		toast.success("Registro cadastrado com sucesso");
		setFormData({ employee: "", salary: 0, admissionDate: "" });
		setErrors({});
		setOpen(false);
		setIsSubmitting(false);
		onSuccess();
	};

	const handleClose = () => {
		if (!isSubmitting) {
			setOpen(false);
			setFormData({ employee: "", salary: 0, admissionDate: "" });
			setErrors({});
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogTrigger asChild>
				<Button className="gap-2" disabled={disabled}>
					<Plus className="h-4 w-4" />
					Adicionar novo registro
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Adicionar Novo Registro</DialogTitle>
					<DialogDescription>
						Preencha os campos abaixo para adicionar um novo registro de funcionário.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-1">
							Nome do Funcionário
						</label>
						<Input
							id="employee"
							value={formData.employee}
							onChange={(e) => handleInputChange("employee", e.target.value)}
							placeholder="Digite o nome do funcionário"
							disabled={isSubmitting}
						/>
						{errors.employee && (
							<p className="mt-1 text-sm text-red-600">{errors.employee}</p>
						)}
					</div>

					<div>
						<label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
							Salário (R$)
						</label>
						<Input
							id="salary"
							type="number"
							min="0"
							step="0.01"
							value={formData.salary || ""}
							onChange={(e) => handleInputChange("salary", parseFloat(e.target.value) || 0)}
							placeholder="0,00"
							disabled={isSubmitting}
						/>
						{errors.salary && (
							<p className="mt-1 text-sm text-red-600">{errors.salary}</p>
						)}
					</div>

					<div>
						<label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700 mb-1">
							Data de Admissão
						</label>
						<Input
							id="admissionDate"
							type="date"
							value={formData.admissionDate}
							onChange={(e) => handleInputChange("admissionDate", e.target.value)}
							disabled={isSubmitting}
						/>
						{errors.admissionDate && (
							<p className="mt-1 text-sm text-red-600">{errors.admissionDate}</p>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={isSubmitting}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Salvando..." : "Salvar"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
