import { DocumentReference } from "@angular/fire/firestore";

export class Precios{
    
    id:string;
    nombre:string;
    costo:number;
    duracion:number;
    tipoDuracion:number;
    ref:DocumentReference;
}