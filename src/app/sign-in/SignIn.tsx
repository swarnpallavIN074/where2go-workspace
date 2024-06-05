"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useUserApi } from "@/providers/UserStoreProvider";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
	identifier: z
		.string()
		.min(2, {
			message: "Username must be at least 2 characters.",
		})
		.or(z.string().email("invalid email address")),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" })
		.max(15, "Password can not have more than 15 characters"),
});

const SignIn = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { login } = useUserApi();
	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});
	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		setLoading(true);
		const [error] = await login(data);
		setLoading(false);

		if (error) {
			const errorMessage = error?.message ?? "Something went wrong. Please try again";

			toast({
				title: "Login failed!",
				description: errorMessage,
				variant: "destructive",
			});
			return;
		}

		router.replace("/");
	};
	return (
		<div className="min-h-screen min-w-screen flex items-center justify-center">
			<Card className="mx-auto max-w-sm">
				<CardHeader>
					<CardTitle className="text-xl">Login</CardTitle>
					<CardDescription>Enter below information to login to your account</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid gap-4">
								<div className="grid gap-2">
									<FormField
										control={form.control}
										name="identifier"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Username / Email</FormLabel>
												<FormControl>
													<Input placeholder="enter username or email" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid gap-2">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input type="password" placeholder="enter password" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<Button type="submit" className="w-full">
									{loading ? <Loader2 /> : "Login"}
								</Button>
							</div>
							<div className="mt-4 text-center text-sm">
								{"Don't have an account?"}{" "}
								<Link href="/signup" className="underline">
									Sign up
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default SignIn;
