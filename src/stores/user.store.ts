import { createStore } from "zustand/vanilla";

export type UserState = {
	email: string;
	_id: string;
	username: string;
	avatar: string;
	isUserReady: boolean;
};

export type UserActions = {
	// login: (user: UserState) => void;
	// logout: () => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
	email: "",
	_id: "",
	username: "",
	avatar: "",
	isUserReady: false,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
	return createStore<UserStore>()(set => ({
		...initState,
	}));
};
