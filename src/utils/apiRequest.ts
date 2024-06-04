const headers = {
	"Content-Type": "application/json",
	withCredentials: "true",
	credentials: "include",
};

const getRequest = async (url: string, init?: RequestInit) => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
			headers,
			...init,
		});

		const jsonifiedResponse = await response.json();

		return [null, jsonifiedResponse];
	} catch (error) {
		console.log(
			`Error occured while fetching data for ${process.env.NEXT_PUBLIC_BACKEND_URL}${url}: `,
			error
		);
		return [error, undefined];
	}
};

const postRequest = async (url: string, payload?: Record<string, any>, init?: RequestInit) => {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
			method: "POST",
			body: JSON.stringify(payload),
			headers,
			...init,
		});

		const jsonifiedResponse = await response.json();

		return [null, jsonifiedResponse];
	} catch (error) {
		console.log(
			`Error occured while fetching data for ${process.env.NEXT_PUBLIC_BACKEND_URL}${url}: `,
			error
		);
		return [error, undefined];
	}
};

export { getRequest, postRequest };
