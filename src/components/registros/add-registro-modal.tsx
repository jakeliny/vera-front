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
import {
	CreateRegistroSchema,
	type CreateRegistroData,
} from "@/lib/validation";
import { createRegistro } from "@/api/registros";

type AddRegistroModalProps = {
	onSuccess: () => void;
	disabled?: boolean;
};

export function AddRegistroModal({
	onSuccess,
	disabled,
}: AddRegistroModalProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<CreateRegistroData>({
		employee: "",
		salary: 0,
		admissionDate: "",
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof CreateRegistroData, string>>
	>({});

	const handleInputChange = (
		key: keyof CreateRegistroData,
		value: string | number
	) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
		if (errors[key]) {
			setErrors((prev) => ({ ...prev, [key]: undefined }));
		}
	};

	const validateForm = (): boolean => {
		const result = CreateRegistroSchema.safeParse(formData);

		if (!result.success) {
			const newErrors: Partial<Record<keyof CreateRegistroData, string>> = {};
			result.error.issues.forEach((issue) => {
				const field = issue.path[0] as keyof CreateRegistroData;
				newErrors[field] = issue.message;
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

		const [error] = await createRegistro(formData);

		if (error) {
			toast.error(error.message || "Error creating record");
			setIsSubmitting(false);
			return;
		}

		toast.success("Record created successfully");
		setFormData({ employee: "", salary: 0, admissionDate: "" });
		setErrors({});
		setOpen(false);
		setIsSubmitting(false);
		onSuccess();
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!isSubmitting) {
			setOpen(newOpen);
			if (!newOpen) {
				setFormData({ employee: "", salary: 0, admissionDate: "" });
				setErrors({});
			}
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					className="gap-2"
					disabled={disabled}
					data-testid="add-registro-button"
				>
					<Plus className="h-4 w-4" />
					Add new record
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add New Record</DialogTitle>
					<DialogDescription>
						Fill in the fields below to add a new employee record.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="employee"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Employee Name
						</label>
						<Input
							id="employee"
							value={formData.employee}
							onChange={(e) => handleInputChange("employee", e.target.value)}
							placeholder="Enter employee name"
							disabled={isSubmitting}
						/>
						{errors.employee && (
							<p className="mt-1 text-sm text-red-600">{errors.employee}</p>
						)}
					</div>

					<div>
						<label
							htmlFor="salary"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Salary ($)
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
							placeholder="0,00"
							disabled={isSubmitting}
						/>
						{errors.salary && (
							<p className="mt-1 text-sm text-red-600">{errors.salary}</p>
						)}
					</div>

					<div>
						<label
							htmlFor="admissionDate"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Admission Date
						</label>
						<Input
							id="admissionDate"
							type="date"
							value={formData.admissionDate}
							onChange={(e) =>
								handleInputChange("admissionDate", e.target.value)
							}
							disabled={isSubmitting}
						/>
						{errors.admissionDate && (
							<p className="mt-1 text-sm text-red-600">
								{errors.admissionDate}
							</p>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
