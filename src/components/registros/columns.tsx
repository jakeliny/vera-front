import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Registro } from "@/types/registro";

export const columns: ColumnDef<Registro>[] = [
	{
		accessorKey: "employee",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Funcionário
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="text-left px-4 font-medium">
				{row.getValue("employee")}
			</div>
		),
	},
	{
		accessorKey: "salary",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Salário
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => {
			const salary = parseFloat(row.getValue("salary"));
			const formatted = new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(salary);
			return <div className="text-left px-4 font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "calculatedSalary",
		header: "Salário Calculado (35%)",
		cell: ({ row }) => {
			const calculatedSalary = parseFloat(row.getValue("calculatedSalary"));
			const formatted = new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(calculatedSalary);
			return <div className="text-left font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "admissionDate",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Data de Admissão
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = new Date(row.getValue("admissionDate"));
			return (
				<div className="text-left px-4 font-medium">
					{date.toLocaleDateString("pt-BR")}
				</div>
			);
		},
	},
	{
		accessorKey: "calculatedAdmissionDate",
		header: "Data de Admissão Calculada",
		cell: ({ row }) => (
			<div className="text-left font-medium">
				{row.getValue("calculatedAdmissionDate")}
			</div>
		),
	},
	{
		id: "view",
		header: "Visualizar",
		enableHiding: false,
		cell: ({ row }) => {
			const registro = row.original;

			return (
				<div className="text-left px-4">
					<Link to={`/registros/${registro.id}`}>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<span className="sr-only">Ver detalhes</span>
							<AiOutlineEye className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			);
		},
	},
];
