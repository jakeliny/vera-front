import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/registros/data-table";
import { columns } from "@/components/registros/columns";
import { AddRegistroModal } from "@/components/registros/add-registro-modal";
import { useRegistros } from "@/hooks/useRegistros";
import type { RegistroFilters, RegistrosApiParams } from "@/types/registro";

function Registros() {
	const [filters, setFilters] = useState<RegistroFilters>({});
	const [pagination, setPagination] = useState({
		page: 0,
		limit: 8,
	});

	const apiParams = useMemo(
		(): Partial<RegistrosApiParams> => ({
			...filters,
			...pagination,
		}),
		[filters, pagination]
	);

	const {
		data,
		pagination: paginationInfo,
		error,
		isLoading,
		mutate,
	} = useRegistros(apiParams);

	const handleFilterChange = (key: keyof RegistroFilters, value: string) => {
		setFilters((prev) => ({
			...prev,
			[key]: value || undefined,
		}));
		setPagination((prev) => ({ ...prev, page: 0 }));
	};

	const handlePageChange = (newPage: number) => {
		setPagination((prev) => ({ ...prev, page: newPage }));
	};

	const handleEmployeeFilterChange = (value: string) => {
		handleFilterChange("employee", value);
	};

	if (error) {
		return (
			<div className="min-h-screen p-8">
				<div className="max-w-7xl mx-auto">
					<div className="bg-red-50 border border-red-200 rounded-lg p-6">
						<h2 className="text-lg font-semibold text-red-800 mb-2">
							Erro ao carregar dados
						</h2>
						<p className="text-red-600 mb-4">
							{error.message || "Ocorreu um erro ao buscar os registros."}
						</p>
						<Button onClick={() => mutate()} variant="outline">
							Tentar novamente
						</Button>
					</div>
				</div>
			</div>
		);
	}

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
								disabled={isLoading}
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
								disabled={isLoading}
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
								disabled={isLoading}
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
								disabled={isLoading}
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
								disabled={isLoading}
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
								disabled={isLoading}
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
								disabled={isLoading}
							/>
						</div>

						<div className="flex items-end">
							<Button
								variant="outline"
								onClick={() => {
									setFilters({});
									setPagination((prev) => ({ ...prev, page: 0 }));
								}}
								className="w-full"
								disabled={isLoading}
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
							<AddRegistroModal
								onSuccess={() => mutate()}
								disabled={isLoading}
							/>
						</div>
					</div>

					<div className="p-6">
						<DataTable
							columns={columns}
							data={data || []}
							pagination={paginationInfo}
							onPageChange={handlePageChange}
							onEmployeeFilterChange={handleEmployeeFilterChange}
							employeeFilter={filters.employee || ""}
							isLoading={isLoading}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Registros;
