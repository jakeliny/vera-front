import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Registro } from "@/types/registro";

export const columns: ColumnDef<Registro>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Selecionar todos"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Selecionar linha"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
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
			<div className="font-medium">{row.getValue("employee")}</div>
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
			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "calculatedSalary",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Salário Calculado
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => {
			const calculatedSalary = parseFloat(row.getValue("calculatedSalary"));
			const formatted = new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(calculatedSalary);
			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "admissionDate",
		header: "Data de Admissão",
		cell: ({ row }) => {
			const date = new Date(row.getValue("admissionDate"));
			return <div>{date.toLocaleDateString("pt-BR")}</div>;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Data de Criação",
		cell: ({ row }) => {
			const date = new Date(row.getValue("createdAt"));
			return <div>{date.toLocaleDateString("pt-BR")}</div>;
		},
	},
	{
		id: "view",
		header: "Visualizar",
		enableHiding: false,
		cell: ({ row }) => {
			const registro = row.original;

			return (
				<Link to={`/registros/${registro.id}`}>
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
						<span className="sr-only">Ver detalhes</span>
						<AiOutlineEye className="h-4 w-4" />
					</Button>
				</Link>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const registro = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Abrir menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Ações</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(registro.id)}
						>
							Copiar ID do registro
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Ver detalhes</DropdownMenuItem>
						<DropdownMenuItem>Editar registro</DropdownMenuItem>
						<DropdownMenuItem className="text-red-600">
							Excluir registro
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
