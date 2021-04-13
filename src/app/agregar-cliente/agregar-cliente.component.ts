import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, validateEventsArray } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {

  formularioCliente:FormGroup;
  porcentajeSubida:number=0;
  urlImagen:string='';
  id:string;
  esEditable:boolean=false;
  constructor(private fb:FormBuilder,private storage: AngularFireStorage,public db:AngularFirestore,private activeRoute:ActivatedRoute) { }

  ngOnInit(): void {

    

    // creamos el formulariooo
    this.formularioCliente = this.fb.group({
    nombre:['',Validators.required],
    Apellido:['',Validators.required],
    correo:['',Validators.compose([Validators.required,Validators.email])],
    DNI:[''],
    fechaNacimiento:['',Validators.required],
    telefono:[''],
    imgUrl:['',Validators.required]
    })

    // obtenemos los datos del cliente para llenar los cuadros de texto
     this.id = this.activeRoute.snapshot.params.clienteID;

    if(this.id !=undefined)
    {
      this.esEditable = true;
      this.db.doc<any>(`clientes/${this.id}`).valueChanges().subscribe((cliente)=>{
     
        this.formularioCliente.setValue({
          nombre:cliente.nombre,
          Apellido:cliente.Apellido,
          correo:cliente.correo,
          DNI:cliente.DNI,
          fechaNacimiento:new Date(cliente.fechaNacimiento.seconds * 1000).toISOString().substr(0,10),
          telefono:cliente.telefono,
          imgUrl:''
  
  
        })
        this.urlImagen= cliente.imgUrl;
      })
    }
    
    


  }

  agregar(){
   
    this.formularioCliente.value.imgUrl = this.urlImagen;
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento);
    this.db.collection('clientes').add(this.formularioCliente.value).then((termino)=>{
      console.log('registro creado');
    })
  }

  editar()
  {
    this.formularioCliente.value.imgUrl = this.urlImagen;
    this.formularioCliente.value.fechaNacimiento = new Date(this.formularioCliente.value.fechaNacimiento);
    

    this.db.doc(`clientes/${this.id}`).update(this.formularioCliente.value);
  }


  subirImagen(event)
  {

    if(event.target.files.length > 0)
    {
   
          let file = event.target.files[0];
          let nameFile= file.name;
          const filePath = `imagenCliente/${nameFile}`;
          const ref = this.storage.ref(filePath);
          const task = ref.put(file);
          task.then((objeto)=>{
            console.log('imagen subida')
            ref.getDownloadURL().subscribe((url)=>{
              
              this.urlImagen = url;
            })
          })
          task.percentageChanges().subscribe((porcentaje)=>{
            this.porcentajeSubida =parseInt(porcentaje.toString());
          });
    }
    
  }

}
