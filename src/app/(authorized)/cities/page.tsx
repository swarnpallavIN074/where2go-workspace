"use client";

import { ListFilter, Loader2, MoreHorizontal, PlusCircle, Search } from "lucide-react";

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
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ICity } from "@/types/ICity";
import Link from "next/link";

const CityMaster = () => {
	const [cities, setCities] = useState<ICity[]>();
	const [loading, setLoading] = useState(false);

	const fetchCities = async () => {
		setLoading(true);
		const [error, response] = await getRequest("/admin/city/city-listing");

		if (error || !response.success) {
			toast({
				title: "Failed to fetch cities list.",
				description: error?.message || "Something went wrong. Please try again after sometime.",
				variant: "destructive",
			});
		} else {
			setCities(response.data);
		}

		setLoading(false);
	};

	useEffect(() => {
		fetchCities();
	}, []);

	if (loading) {
		return <Loader2 className="h-12 w-12 absolute left-1/2 top-1/2" />;
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
								<Link href={"/cities/add"}>
									<Button size="sm" className="h-8 gap-1">
										<PlusCircle className="h-3.5 w-3.5" />
										<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add City</span>
									</Button>
								</Link>
							</div>
						</div>
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<CardTitle>Cities</CardTitle>
									<CardDescription>Manage cities</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>State</TableHead>
												<TableHead className="hidden md:table-cell">Pincode</TableHead>
												<TableHead className="hidden md:table-cell">Total Destination</TableHead>
												<TableHead className="hidden md:table-cell">Created at</TableHead>
												<TableHead className="hidden md:table-cell">Updated at</TableHead>
												<TableHead>
													<span className="sr-only">Actions</span>
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{cities?.map((city, i) => (
												<TableRow key={i}>
													<TableCell className="font-medium">{city.name}</TableCell>
													<TableCell className="font-medium">{city.state}</TableCell>
													<TableCell className="hidden md:table-cell">{city.pincode}</TableCell>
													<TableCell className="hidden md:table-cell">
														{city.totalDestinations}
													</TableCell>
													<TableCell className="hidden md:table-cell">
														{format(new Date(city.createdAt), "PPpp")}
													</TableCell>
													<TableCell className="hidden md:table-cell">
														{format(new Date(city.updatedAt), "PPpp")}
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
																<Link href={`/cities/edit/${city._id}`}>
																	<DropdownMenuItem className="cursor-pointer">
																		Edit
																	</DropdownMenuItem>
																</Link>
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

export default CityMaster;
