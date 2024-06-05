"use client";

import { ListFilter, MoreHorizontal, PlusCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getRequest } from "@/utils/apiRequest";
import { useEffect, useState } from "react";
import Empty from "@/components/Empty";
import { toast } from "@/components/ui/use-toast";
import { IState } from "@/types/IState";
import { format } from "date-fns";

const StateMaster = () => {
	const [states, setStates] = useState<IState[]>();
	const [loading, setLoading] = useState(false);

	const fetchStates = async () => {
		setLoading(true);
		const [error, response] = await getRequest("/admin/state/state-listing");

		if (error || !response.success) {
			toast({
				title: "Failed to fetch states list.",
				description: error?.message || "Something went wrong. Please try again after sometime.",
				variant: "destructive",
			});
		} else {
			setStates(response.data);
		}

		setLoading(false);
	};

	useEffect(() => {
		fetchStates();
	}, []);

	if (loading) {
		return <Empty />;
	}
	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<div className="flex flex-col sm:gap-4 sm:py-4">
				<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
					<Tabs defaultValue="all">
						<div className="flex items-center gap-4">
							<div className="w-full flex-1">
								<form>
									<div className="relative">
										<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type="search"
											placeholder="Search..."
											className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
										/>
									</div>
								</form>
							</div>
							<div className="ml-auto flex items-center gap-2">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="sm" className="h-8 gap-1">
											<ListFilter className="h-3.5 w-3.5" />
											<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>Filter by</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuCheckboxItem checked>Active</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<Button size="sm" className="h-8 gap-1">
									<PlusCircle className="h-3.5 w-3.5" />
									<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add State</span>
								</Button>
							</div>
						</div>
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<CardTitle>States</CardTitle>
									<CardDescription>Manage states</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>Total Cities</TableHead>
												<TableHead className="hidden md:table-cell">Created at</TableHead>
												<TableHead className="hidden md:table-cell">Updated at</TableHead>
												<TableHead>
													<span className="sr-only">Actions</span>
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{states?.map((state, i) => (
												<TableRow key={i}>
													<TableCell className="font-medium">{state.name}</TableCell>
													<TableCell className="font-medium">{state.totalCities}</TableCell>
													<TableCell className="hidden md:table-cell">
														{format(new Date(state.createdAt), "PPpp")}
													</TableCell>
													<TableCell className="hidden md:table-cell">
														{format(new Date(state.updatedAt), "PPpp")}
													</TableCell>
													<TableCell>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button aria-haspopup="true" size="icon" variant="ghost">
																	<MoreHorizontal className="h-4 w-4" />
																	<span className="sr-only">Toggle menu</span>
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Actions</DropdownMenuLabel>
																<DropdownMenuItem>Edit</DropdownMenuItem>
																<DropdownMenuItem>Delete</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
								<CardFooter>
									<div className="text-xs text-muted-foreground">
										Showing <strong>1-10</strong> of <strong>32</strong> products
									</div>
								</CardFooter>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default StateMaster;