"use client";

import { Loader2, MoreHorizontal } from "lucide-react";

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
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
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
import { IDestination } from "@/types/IDestination";

interface AddEditCityProps {
	id?: string;
}

const AddEditCity: React.FC<AddEditCityProps> = ({ id }) => {
	const [city, setCity] = useState<{ name: string; pincode: `${number}` }>({
		name: "",
		pincode: "000000",
	});
	const [destinations, setDestinations] = useState<IDestination[]>([]);
	const [orphanDestinations, setOrphanDestinations] = useState<
		(IDestination & { checked: boolean })[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState({});
	const router = useRouter();

	const fetchDetails = async (id: string) => {
		setLoading(true);
		const [error, response] = await getRequest("/admin/city/" + id);

		if (error || !response.success) {
			toast({
				title: "Failed to fetch city details",
				description: error?.message || "Something went wrong. Please try again after sometime",
				variant: "destructive",
			});
		}

		if (response.success) {
			setCity({ name: response.data?.name, pincode: response.data?.pincode });

			setDestinations(response.data?.destinations);
		}

		setLoading(false);
	};

	useEffect(() => {
		if (id) {
			fetchDetails(id);
		} else {
			setLoading(false);
		}
	}, [id]);

	const getOrphanDestinations = async () => {
		const [error, response] = await getRequest("/admin/destination/get-orphan-destinations");

		if (error || !response?.success) {
			toast({
				title: "Failed to fetch orphan cities",
				description: error?.message || "Something went wrong. Please try again later.",
				variant: "destructive",
			});
		}

		if (response?.success) {
			setOrphanDestinations(response?.data);
		}
	};

	useEffect(() => {
		getOrphanDestinations();
	}, []);

	const isCityValid = () => {
		if (city.name.length < 3) {
			return [false, "city name should have atleast three characters"];
		}

		const pincodePattern = /^[1-9]{1}\d{2}\s?\d{3}$/gm;

		if (!pincodePattern.test(city.pincode)) {
			return [false, "Invalid pincode"];
		}

		return [true, ""];
	};

	const saveCity = async () => {
		const [isValid, message] = isCityValid();
		if (!isValid) {
			toast({
				title: "Invalid Data",
				description: message,
				variant: "destructive",
			});
			return;
		}

		const [error, response] = await postRequest("/admin/city/add-edit-city", {
			id,
			name: city.name,
			pincode: city.pincode,
			destinations: [
				...destinations.map(destination => destination._id),
				...orphanDestinations.reduce((acc: (IDestination & { checked: boolean })[], value) => {
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
			router.push("/cities");
		}
	};

	const handleCheckBox = (index: number, checked: boolean) => {
		setOrphanDestinations(prev =>
			prev.map((destination, i) => (i === index ? { ...destination, checked } : destination))
		);
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
							<CardTitle>City Details</CardTitle>
							<Button onClick={saveCity}>Save</Button>
						</CardHeader>
						<CardContent>
							<div className="flex gap-6">
								<div className="grid gap-3 w-full">
									<Label htmlFor="name">Name</Label>
									<Input
										placeholder="enter name"
										id="name"
										type="text"
										value={city.name}
										onChange={e => setCity(prev => ({ ...prev, name: e.target.value }))}
										required
									/>
								</div>
								<div className="grid gap-3 w-full">
									<Label htmlFor="name">Pincode</Label>
									<Input
										placeholder="enter pincode"
										id="pincode"
										type="text"
										value={city.pincode}
										onChange={e => setCity(prev => ({ ...prev, pincode: e.target.value }) as any)}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<CardTitle>Destinations</CardTitle>
									<CardDescription>Manage destinations</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>Likes</TableHead>
												<TableHead className="hidden md:table-cell">Created at</TableHead>
												<TableHead className="hidden md:table-cell">Updated at</TableHead>
												<TableHead>
													<span className="sr-only">Actions</span>
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{destinations?.map((destination, i) => (
												<TableRow key={destination._id}>
													<TableCell className="font-medium">{destination.name}</TableCell>
													<TableCell className="font-medium">{destination.likes}</TableCell>
													<TableCell className="hidden md:table-cell">
														{format(new Date(destination.createdAt), "PPpp")}
													</TableCell>
													<TableCell className="hidden md:table-cell">
														{format(new Date(destination.updatedAt), "PPpp")}
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
									<CardTitle>Add Destinations</CardTitle>
									<CardDescription>Select destinations</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>Likes</TableHead>
												<TableHead className="hidden md:table-cell">Created at</TableHead>
												<TableHead className="hidden md:table-cell">Updated at</TableHead>
												<TableHead>
													<span>Add</span>
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{orphanDestinations?.map((destination, i) => (
												<TableRow key={destination._id}>
													<TableCell className="font-medium">{destination.name}</TableCell>
													<TableCell>{destination.likes}</TableCell>
													<TableCell className="hidden md:table-cell">
														{format(new Date(destination.createdAt), "PPpp")}
													</TableCell>
													<TableCell className="hidden md:table-cell">
														{format(new Date(destination.updatedAt), "PPpp")}
													</TableCell>
													<TableCell>
														<div className="w-4 h-4">
															<Checkbox
																onCheckedChange={(checked: boolean) => handleCheckBox(i, checked)}
																checked={destination.checked}
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

export default AddEditCity;
