import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
// SweetAlert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    @ViewChild( MatPaginator ) paginator: MatPaginator;
    @ViewChild( MatSort ) sort: MatSort;
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['nombre', 'cif', 'direccion', 'grupo'];
    clientForm: FormGroup;
    listadoClientes = [];
    listaGrupo: { nombre: string, codigo: number }[] = [
        { nombre: 'Grupo 1', codigo: 1 },
        { nombre: 'Grupo 2', codigo: 2 },
        { nombre: 'Grupo 3', codigo: 3 }
    ]

    constructor( private fb: FormBuilder ) {
        this.clientForm = this.crearFormulario();
    }

    ngOnInit(): void {
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if ( this.dataSource.paginator ) {
            this.dataSource.paginator.firstPage();
        }
    }

    getGrupo( codigo: number ) {
        if ( this.listaGrupo.length > 0 ) {
            const grupo = this.listaGrupo.find( grupo => grupo.codigo === codigo );

            if ( grupo !== undefined ) {
                return grupo.nombre;
            }
        }
    }

    crearFormulario() {
        return this.fb.group(
            {
                nombre: [ null, Validators.required ],
                cif: [ null, Validators.required ],
                direccion: [ null, Validators.required ],
                grupo: [ null, Validators.required ]
            }
        )
    }

    guardar() {
        if ( this.clientForm.invalid === true ) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Faltan campos por diligenciar.',
                showConfirmButton: false,
                timer: 800
            })

            this.clientForm.markAllAsTouched()

            return
        }

        if ( this.listadoClientes.length > 0 ) {
            const clienteNombre = this.listadoClientes.find( cliente => cliente.nombre === this.clientForm.get( 'nombre' ).value )
            const clienteCif = this.listadoClientes.find( cliente => cliente.cif === this.clientForm.get( 'cif' ).value )

            if ( clienteNombre !== undefined ) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: `<small>Ya se ha guardado un cliente con el nombre</small> <br> <b>${ clienteNombre.nombre }</b>`,
                    showConfirmButton: false,
                    timer: 2500
                })

                return
            }

            if ( clienteCif !== undefined ) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: `<small>Ya se ha guardado un cliente con CIF</small> <br> <b>${ clienteCif.cif }</b>`,
                    showConfirmButton: false,
                    timer: 2500
                })

                return
            }
        }

        this.listadoClientes.push(
            {
                nombre: this.clientForm.get( 'nombre' ).value,
                cif: this.clientForm.get( 'cif' ).value,
                direccion: this.clientForm.get( 'direccion' ).value,
                grupo: this.clientForm.get( 'grupo' ).value,
            }
        )

        this.dataSource = new MatTableDataSource( this.listadoClientes );
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

}
