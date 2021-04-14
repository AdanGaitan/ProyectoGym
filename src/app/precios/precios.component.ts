import { analyzeAndValidateNgModules } from '@angular/compiler';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Precios } from '../models/precio';
import { MensajesService } from '../services/mensajes.service';



@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.scss']
})
export class PreciosComponent implements OnInit {
  formularioPrecio:FormGroup;
  precios:Precios[] = new Array<Precios>();
  esEditar:boolean=false;
  id:string='';
  constructor(private fb: FormBuilder,private db: AngularFirestore,private msj:MensajesService) { }

  ngOnInit(): void {

    this.formularioPrecio = this.fb.group({
      nombre:['',Validators.required],
      costo:[''],
      duracion:['',Validators.required],
      tipoDuracion:['',Validators.required]
    })
    this.mostrarPrecio();
   
  }

  mostrarPrecio()
  {

    this.db.collection<Precios>('precios').get().subscribe((resultado)=>{
      this.precios.length = 0;

      resultado.docs.forEach((dato)=>{

        let precio = dato.data() as Precios;
        precio.id = dato.id;
        precio.ref=dato.ref;
        this.precios.push(precio);
       
        
      });
   });

  }

  agregar(){
    this.db.collection<Precios>('precios').add(this.formularioPrecio.value).then(()=>{
      this.msj.mensajeCorrecto('Agregado','Se agrego Correctamente');
      this.formularioPrecio.reset();
      this.mostrarPrecio();
    }).catch(()=>{
      this.msj.mensajeError('error','Ocurrio un error')
    })
  
  }

 
  editarPrecio(precio: Precios)
  {
      this.esEditar=true;
      this.formularioPrecio.setValue({
       nombre: precio.nombre,
       costo:precio.costo,
       duracion:precio.duracion,
       tipoDuracion:precio.tipoDuracion,
     })
    this.id=precio.id;

  }

  editar()
  {
    this.db.doc(`precios/${this.id}`).update(this.formularioPrecio.value).then(()=>{
      this.msj.mensajeCorrecto('Editar','Se edito correctamente');
      this.formularioPrecio.reset();
      this.esEditar=false;
    }).catch(()=>{
      this.msj.mensajeError('Error','No se puedo editar')
    })
    this.mostrarPrecio();
  }

}
