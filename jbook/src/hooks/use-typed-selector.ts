import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";

// This is used to get the type of the redux state
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;