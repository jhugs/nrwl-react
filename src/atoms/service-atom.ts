import { BackendService } from "../backend";
import { atom } from "jotai";

const ServiceAtom = atom<BackendService>(new BackendService());

export default ServiceAtom;
