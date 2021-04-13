import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


interface Cliente{

  data:any;
  id:string;
  referencia:any;
 

}

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.scss']
})
export class ListadoClientesComponent implements OnInit {

  clientes: any[] = new Array<any>();
  constructor(public db: AngularFirestore) { }

  ngOnInit(): void {
   /*  this.db.collection('clientes').valueChanges().subscribe((resultado)=>{
      this.clientes = resultado;
    }) */

    this.clientes.length = 0;
    this.db.collection('clientes').get().subscribe((resultado)=>{
      console.log(resultado.docs);

      resultado.docs.forEach((item)=>{
        
        

        let cliente : Cliente;
        cliente = {
          data:item.data(),
          id: item.id,
          referencia: item.ref
        }
         this.clientes.push(cliente);
         
         
      });
      console.log(this.clientes);
    });

  }

}
