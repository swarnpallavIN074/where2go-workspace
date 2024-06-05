"use client";

import { Button } from "@/components/ui/button";

interface EmptyProps {
	heading: string;
	subHeading: string;
	ctaText: string;
	onCtaClick: () => void;
}

const Empty: React.FC<Partial<EmptyProps>> = ({
	heading = "You have no products",
	subHeading = "You can start selling as soon as you add a product.",
	ctaText = "Add Product",
	onCtaClick = () => {},
}) => {
	return (
		<div
			className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
			x-chunk="dashboard-02-chunk-1"
		>
			<div className="flex flex-col items-center gap-1 text-center">
				<h3 className="text-2xl font-bold tracking-tight">{heading}</h3>
				<p className="text-sm text-muted-foreground">{subHeading}</p>
				<Button className="mt-4" onClick={onCtaClick}>
					{ctaText}
				</Button>
			</div>
		</div>
	);
};

export default Empty;
