import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type {
	ColumnDef,
	VisibilityState,
	SortingState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { RegistrosSortField, SortDirection } from "@/types/registro";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type PaginationInfo = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	pagination?: PaginationInfo;
	onPageChange?: (page: number) => void;
	isLoading?: boolean;
	orderBy?: RegistrosSortField;
	order?: SortDirection;
	onSortChange?: (
		orderBy: RegistrosSortField | undefined,
		order: SortDirection | undefined
	) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	pagination,
	onPageChange,
	isLoading = false,
	orderBy,
	order,
	onSortChange,
}: DataTableProps<TData, TValue>) {
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});

	const sorting: SortingState =
		orderBy && order ? [{ id: orderBy, desc: order === "desc" }] : [];

	const handleSortingChange = (sortingState: SortingState) => {
		if (sortingState.length === 0) {
			onSortChange?.(undefined, undefined);
		} else {
			const { id, desc } = sortingState[0];
			onSortChange?.(id as RegistrosSortField, desc ? "desc" : "asc");
		}
	};

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onSortingChange: (updater) => {
			const newSorting =
				typeof updater === "function" ? updater(sorting) : updater;
			handleSortingChange(newSorting);
		},
		state: {
			columnVisibility,
			rowSelection,
			sorting,
		},
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
	});

	return (
		<div className="w-full">
			<div className="flex items-center justify-end py-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto" disabled={isLoading}>
							Colunas <ChevronDown />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									<div className="flex items-center justify-center">
										<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
										<span className="ml-2">Carregando...</span>
									</div>
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Nenhum resultado encontrado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{pagination && (
				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="flex items-center space-x-6">
						<div className="flex items-center space-x-2">
							<p className="text-sm font-medium">
								Página {pagination.page} de {pagination.totalPages}
							</p>
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => onPageChange?.(pagination.page - 1)}
								disabled={pagination.page <= 1 || isLoading}
							>
								Anterior
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => onPageChange?.(pagination.page + 1)}
								disabled={pagination.page >= pagination.totalPages || isLoading}
							>
								Próximo
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
