import { Component,Input,EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Cliente } from '../models/cliente';

@Component({
  selector: 'app-seleccionar-cliente',
  templateUrl: './seleccionar-cliente.component.html',
  styleUrls: ['./seleccionar-cliente.component.scss']
})
export class SeleccionarClienteComponent implements OnInit {

  clientes:Cliente[] = new Array<Cliente>();
  @Input('nombre') nombre:string;
  @Output('seleccionoCliente') seleccionoCliente = new EventEmitter();
  @Output('canceloCliente') canceloCliente = new EventEmitter();
  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {

    this.db.collection<any>('clientes').get().subscribe((resultado)=>{
      this.clientes.length = 0;
      resultado.docs.forEach((item)=>{
        let cliente: any = item.data();
        cliente.id = item.id;
        cliente.ref = item.ref;
        cliente.visible = false;
        this.clientes.push(cliente);

      })
      console.log(this.clientes);
    })

    
  }

  buscarClientes(nombre:string)
  {
   this.clientes.forEach((cliente)=>{
     if(cliente.nombre.toLowerCase().includes(nombre.toLowerCase()))
     {
       cliente.visible = true;
     }
     else{
       cliente.visible = false;
     }
   })
  }

  seleccionarCliente(cliente: Cliente){
    this.nombre =`${cliente.nombre} ${cliente.Apellido}`;
    this.clientes.forEach((cliente)=>{
      cliente.visible = false;
    })
    this.seleccionoCliente.emit(cliente);
   

  }

  cancelarCliente(){
    this.nombre=undefined;
    this.canceloCliente.emit();
  }

}
