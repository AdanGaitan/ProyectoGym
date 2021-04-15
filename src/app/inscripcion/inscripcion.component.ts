import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Cliente } from '../models/cliente';
import { Inscripcion } from '../models/inscripcion';
import { Precios } from '../models/precio';
import { MensajesService } from '../services/mensajes.service';


@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit {
  inscripcion: Inscripcion = new Inscripcion();
  clienteSeleccionado: Cliente = new Cliente();
  precioSeleccionado: Precios = new Precios();
  precios:Precios[] = new Array<Precios>();
  idPrecio:string='null';
  constructor(private db:AngularFirestore,private msj:MensajesService) { }

  ngOnInit(): void 
  {
    this.db.collection('precios').get().subscribe((resultado)=>{
      resultado.docs.forEach((item)=>{
        let precio = item.data() as Precios;
        precio.id = item.id;
        precio.ref = item.ref;
        this.precios.push(precio);
      })
    })
  }
  asignarCliente(cliente:Cliente){
    this.inscripcion.clientes = cliente.ref;
    this.clienteSeleccionado = cliente;
  }
  eliminarCliente(){
    this.clienteSeleccionado = new Cliente();
    this.inscripcion.clientes = undefined;
  }

  guardar()
  {
    if(this.inscripcion.validar().esValido)
    {
      let inscripcionAgregar ={
        fecha:this.inscripcion.fecha,
        fechaFinal:this.inscripcion.fechaFinal,
        clientes:this.inscripcion.clientes,
        precios: this.inscripcion.precios,
        subTotal:this.inscripcion.subTotal,
        isv:this.inscripcion.isv,
        total:this.inscripcion.total
      }
      this.db.collection('inscripciones').add(inscripcionAgregar).then((resultado)=>{
        this.inscripcion = new Inscripcion();
        this.clienteSeleccionado = new Cliente();
        this.precioSeleccionado = new Precios();
        this.idPrecio ='null';
        this.msj.mensajeCorrecto('Guardado','Se guardo correctamente');
      })
     
    }
    else{
     
      this.msj.mensajeAdvertencia('Advertencia',this.inscripcion.validar().mensaje);
    }
    console.log(this.inscripcion)
  }



  seleccionarPrecio(id:string)
    {
        if(id != "null")
        {

            this.precioSeleccionado = this.precios.find(x=>x.id == id);
            this.inscripcion.precios = this.precioSeleccionado.ref;

            this.inscripcion.subTotal = this.precioSeleccionado.costo;
            this.inscripcion.isv = this.inscripcion.subTotal * 0.21;
            this.inscripcion.total =this.inscripcion.subTotal + this.inscripcion.isv;

            this.inscripcion.fecha = new Date();
            if(this.precioSeleccionado.tipoDuracion == 1)
            {
              let dias : number = this.precioSeleccionado.duracion;
              let fechaFinal= new Date(this.inscripcion.fecha.getFullYear(),this.inscripcion.fecha.getMonth(),this.inscripcion.fecha.getDate()+ dias)
              this.inscripcion.fechaFinal = fechaFinal; 
            }
            if(this.precioSeleccionado.tipoDuracion == 2)
            {
              let dias : number = this.precioSeleccionado.duracion * 7;
              let fechaFinal= new Date(this.inscripcion.fecha.getFullYear(),this.inscripcion.fecha.getMonth(),this.inscripcion.fecha.getDate()+ dias)
              this.inscripcion.fechaFinal = fechaFinal; 
            }
            if(this.precioSeleccionado.tipoDuracion == 3)
            {
              let dias : number = this.precioSeleccionado.duracion * 15;
              let fechaFinal= new Date(this.inscripcion.fecha.getFullYear(),this.inscripcion.fecha.getMonth(),this.inscripcion.fecha.getDate()+ dias)
              this.inscripcion.fechaFinal = fechaFinal; 
            }
            if(this.precioSeleccionado.tipoDuracion == 4)
            {
              let dia: number = this.inscripcion.fecha.getDate();
              let meses = this.precioSeleccionado.duracion;
              let anio: number =this.inscripcion.fecha.getFullYear();

              let fechaFinal= new Date(anio,this.inscripcion.fecha.getMonth()+ meses,dia)
              this.inscripcion.fechaFinal = fechaFinal; 
            }
            if(this.precioSeleccionado.tipoDuracion == 5)
        {
          let dia: number = this.inscripcion.fecha.getDate();
          let meses = this.precioSeleccionado.duracion;
          let anio: number =this.inscripcion.fecha.getFullYear() + this.precioSeleccionado.duracion;

          let fechaFinal= new Date(anio,this.inscripcion.fecha.getMonth(),dia)
          this.inscripcion.fechaFinal = fechaFinal;
        }
          
      }
      else 
      {
        this.precioSeleccionado = new Precios();
        this.inscripcion.fecha = null;
        this.inscripcion.fechaFinal=null;
        this.inscripcion.precios = null;
        this.inscripcion.subTotal = 0;
        this.inscripcion.isv = 0;
        this.inscripcion.total =0;
      }

  }

}
