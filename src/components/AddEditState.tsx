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
import { getRequest, postRequest } from "@/utils/apiRequest";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { ICity } from "@/types/ICity";
import Combobox from "./Combobox";
import { useRouter } from "next/navigation";
import { Checkbox } from "./ui/checkbox";

const addStateUrl = "/states/add";

const editStateUrl = "/states/edit";

interface AddEditStateProps {
	id?: string;
}

const AddEditState: React.FC<AddEditStateProps> = ({ id }) => {
	const [name, setName] = useState<string>("");
	const [cities, setCities] = useState<ICity[]>([]);
	const [orphanCities, setOrphanCities] = useState<(ICity & { checked: boolean })[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const fetchDetails = async (id: string) => {
		setLoading(true);
		const [error, response] = await getRequest("/admin/state/" + id);

		if (error) {
			toast({
				title: "Failed to fetch state details",
				description: error?.message || "Something went wrong. Please try again after sometime",
				variant: "destructive",
			});
		}

		if (response.success) {
			setName(response.data?.name);

			setCities(response.data?.cities);
		}

		setLoading(false);
	};

	useEffect(() => {
		if (id) {
			fetchDetails(id);
		}
	}, [id]);

	const getOrphanCities = async () => {
		const [error, response] = await getRequest("/admin/city/get-orphan-cities");

		if (error || !response?.success) {
			toast({
				title: "Failed to fetch orphan cities",
				description: error?.message || "Something went wrong. Please try again later.",
				variant: "destructive",
			});
		}

		if (response?.success) {
			setOrphanCities(response?.data);
		}
	};

	useEffect(() => {
		getOrphanCities();
	}, []);

	const saveState = async () => {
		const [error, response] = await postRequest("/admin/state/add-edit-state", {
			id,
			name,
			cities: [
				...cities.map(city => city._id),
				...orphanCities.reduce((acc: (ICity & { checked: boolean })[], value) => {
					if (value.checked) {
						acc.push(value);
						return acc;
					}
					return acc;
				}, []),
			],
		});

		if (error || !response?.success) {
			toast({
				title: "Failed to save state",
				description: "Something went wrong.",
				variant: "destructive",
			});
		}

		if (response?.success) {
			toast({
				title: "State saved Succesfully",
			});
			router.push("/states");
		}
	};

	const handleCheckBox = (index: number, checked: boolean) => {
		setOrphanCities(prev => prev.map((city, i) => (i === index ? { ...city, checked } : city)));
	};

	if (loading) {
		return <Loader2 className="h-12 w-12 absolute left-1/2 top-1/2 animate-spin" />;
	}
	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<div className="flex flex-col sm:gap-4 sm:py-4">
				<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-4">
					<Card>
						<CardHeader className="flex justify-between flex-row">
							<CardTitle>State Details</CardTitle>
							<Button onClick={saveState}>Save</Button>
						</CardHeader>
						<CardContent>
							<div className="grid gap-6">
								<div className="grid gap-3">
									<Label htmlFor="name">Name</Label>
									<Input
										placeholder="enter name"
										id="name"
										type="text"
										className="w-full"
										value={name}
										onChange={e => setName(e.target.value)}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
					<Tabs defaultValue="all">
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
												<TableHead>Pincode</TableHead>
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
													<TableCell className="font-medium">{city.pincode}</TableCell>
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
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<CardTitle>Add Cities</CardTitle>
									<CardDescription>Select cities</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>Pincode</TableHead>
												<TableHead className="hidden md:table-cell">Total Destination</TableHead>
												<TableHead className="hidden md:table-cell">Created at</TableHead>
												<TableHead className="hidden md:table-cell">Updated at</TableHead>
												<TableHead>
													<span>Add</span>
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{orphanCities?.map((city, i) => (
												<TableRow key={i}>
													<TableCell className="font-medium">{city.name}</TableCell>
													<TableCell>{city.pincode}</TableCell>
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
														<div className="w-4 h-4">
															<Checkbox
																onCheckedChange={(checked: boolean) => handleCheckBox(i, checked)}
																checked={city.checked}
															/>
														</div>
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

export default AddEditState;
