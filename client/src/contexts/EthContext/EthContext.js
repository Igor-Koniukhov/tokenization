import { createContext } from "react";
import {initialState} from "./state";


const EthContext = createContext({initialState});
console.log(initialState , " this is ethcontext")

export default EthContext;
