import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/registros/data-table";
import { columns } from "@/components/registros/columns";
import type { Registro, RegistroFilters } from "@/types/registro";

const mockData: Registro[] = [
	{
		id: "reg_001",
		employee: "João Silva",
		salary: 5000,
		salaryCalculated: 5200,
		startDate: "2024-01-15",
		endDate: "2024-12-15",
		status: "ativo",
		createdAt: "2024-01-15T10:30:00Z",
		updatedAt: "2024-01-15T10:30:00Z",
	},
	{
		id: "reg_002",
		employee: "Maria Santos",
		salary: 4500,
		salaryCalculated: 4650,
		startDate: "2024-02-01",
		endDate: "2024-11-30",
		status: "ativo",
		createdAt: "2024-02-01T09:15:00Z",
		updatedAt: "2024-02-01T09:15:00Z",
	},
	{
		id: "reg_003",
		employee: "Pedro Costa",
		salary: 3800,
		salaryCalculated: 3900,
		startDate: "2024-01-10",
		endDate: "2024-06-10",
		status: "inativo",
		createdAt: "2024-01-10T14:20:00Z",
		updatedAt: "2024-06-10T16:45:00Z",
	},
];

function Registros() {
	const [filters, setFilters] = useState<RegistroFilters>({});

	const handleFilterChange = (key: keyof RegistroFilters, value: string) => {
		setFilters((prev) => ({
			...prev,
			[key]: value || undefined,
		}));
	};

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Registros</h1>
					<p className="text-gray-600">
						Gerenciamento de registros de funcionários e análise de renda.
					</p>
				</div>

				{/* Filters Section */}
				<div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Filtros de Busca
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Funcionário
							</label>
							<Input
								placeholder="Nome do funcionário"
								value={filters.employee || ""}
								onChange={(e) => handleFilterChange("employee", e.target.value)}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Salário Inicial
							</label>
							<Input
								type="number"
								placeholder="R$ 0,00"
								value={filters.startSalary || ""}
								onChange={(e) =>
									handleFilterChange("startSalary", e.target.value)
								}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Salário Final
							</label>
							<Input
								type="number"
								placeholder="R$ 0,00"
								value={filters.endSalary || ""}
								onChange={(e) =>
									handleFilterChange("endSalary", e.target.value)
								}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Salário Calculado Inicial
							</label>
							<Input
								type="number"
								placeholder="R$ 0,00"
								value={filters.startSalaryCalculated || ""}
								onChange={(e) =>
									handleFilterChange("startSalaryCalculated", e.target.value)
								}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Salário Calculado Final
							</label>
							<Input
								type="number"
								placeholder="R$ 0,00"
								value={filters.endSalaryCalculated || ""}
								onChange={(e) =>
									handleFilterChange("endSalaryCalculated", e.target.value)
								}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Data Inicial
							</label>
							<Input
								type="date"
								value={filters.startDate || ""}
								onChange={(e) =>
									handleFilterChange("startDate", e.target.value)
								}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Data Final
							</label>
							<Input
								type="date"
								value={filters.endDate || ""}
								onChange={(e) => handleFilterChange("endDate", e.target.value)}
							/>
						</div>

						<div className="flex items-end">
							<Button
								variant="outline"
								onClick={() => setFilters({})}
								className="w-full"
							>
								Limpar Filtros
							</Button>
						</div>
					</div>
				</div>

				{/* Add Button and Data Table */}
				<div className="bg-white rounded-lg shadow-sm border">
					<div className="p-6 border-b">
						<div className="flex justify-between items-center">
							<h2 className="text-lg font-semibold text-gray-900">
								Lista de Registros
							</h2>
							<Button className="gap-2">
								<Plus className="h-4 w-4" />
								Adicionar novo registro
							</Button>
						</div>
					</div>

					<div className="p-6">
						<DataTable columns={columns} data={mockData} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Registros;
