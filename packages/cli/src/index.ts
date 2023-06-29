import { createCli } from "./createCli";
import { exception } from "./exception";

export default function entry(argv: string[]) {
	exception();
	createCli(argv)
	
}