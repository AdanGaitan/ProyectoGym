import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Inscripcion } from '../models/inscripcion';

@Component({
  selector: 'app-listado-inscripciones',
  templateUrl: './listado-inscripciones.component.html',
  styleUrls: ['./listado-inscripciones.component.scss']
})
export class ListadoInscripcionesComponent implements OnInit {
// new Array<Inscripcion>();
  inscripciones:any[] = [];
  // inscripciones: Inscripcion[] = new Array<Inscripcion>();
  constructor(private db:AngularFirestore) { }

  ngOnInit(): void {

    this.inscripciones.length = 0;
    this.db.collection<any>('inscripciones').get().subscribe((resultado)=>{
      resultado.forEach((inscripcion)=>{
        let inscripcionObtenida = inscripcion.data();
        inscripcionObtenida.id = inscripcion.id;
        
        this.db.doc(inscripcion.data().clientes.path).get().subscribe((cliente)=>{
          inscripcionObtenida.clienteObtenido = cliente.data();
          inscripcionObtenida.fecha = new Date(inscripcionObtenida.fecha.seconds*1000);
          inscripcionObtenida.fechaFinal = new Date(inscripcionObtenida.fechaFinal.seconds*1000);
          this.inscripciones.push(inscripcionObtenida);
          console.log(inscripcionObtenida);
          
        })
      })
    })
  }

}
