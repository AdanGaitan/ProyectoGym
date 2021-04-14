import { DocumentReference } from "@angular/fire/firestore";

export class Cliente{
    nombre:string;
    Apellido:string;
    dni:number;
    correo:string;
    fechaNacimiento:Date;
    imgUrl:string;
    telefono:number;
    id:string;
    ref:DocumentReference;
    visible:boolean;
    constructor(){}
}