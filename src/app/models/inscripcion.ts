import { DocumentReference } from "@angular/fire/firestore";

export class Inscripcion{
    fecha:Date;
    fechaFinal:Date;
    clientes:DocumentReference;
    precios: DocumentReference;
    subTotal:number;
    isv:number;
    total:number;
    
    constructor()
    {
        this.fecha = this.fecha;
        this.fechaFinal = this.fechaFinal;
        this.clientes = this.clientes;
        this.precios = this.precios;
        this.subTotal = this.subTotal;
        this.isv = this.isv;
        this.total = this.total;
        
       
    }
}