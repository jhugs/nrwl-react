import { atom } from "jotai";
import { User } from "../backend";

const UsersAtom = atom<User[]>([]);

export default UsersAtom;
