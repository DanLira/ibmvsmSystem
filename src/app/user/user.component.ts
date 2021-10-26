import { Component, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Usuarios } from '../models/usuarios.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../service/usuario.service';
import { MatPaginator } from '@angular/material/paginator';
import { SubSink } from 'subsink/dist/subsink';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  formsRegister!: FormGroup;
  filterFormUsuario!: FormGroup;
  usuarioList: Usuarios[] = [];
  hide!: boolean;
  private readonly subs = new SubSink();
  displayedColumns: string[] = ['userName', 'status', 'action'];
  dataSource = new MatTableDataSource<Usuarios>();
  @ViewChild('MatPaginator')
  MatPaginator!: MatPaginator;


  constructor( private readonly formBuilder: FormBuilder,
               private readonly usuarioService: UsuarioService,
               private readonly toastr: ToastrService) { }

  ngOnInit() {
    this.dataSource.paginator = this.MatPaginator;
    this.createForm();

      this.filterFormUsuario = this.formBuilder.group({
        nomeFilterCtrl: ['']
      });

      this.usuarioService.getAllUsuario().subscribe((usuario: Usuarios[]) => {
        this.usuarioList = (!!usuario) ? usuario : [];
        this.dataSource.data = [...this.usuarioList];
    });

  }

  private createForm(): void {
    this.formsRegister = new FormGroup({
        id: new FormControl(null),
        userName: new FormControl('', Validators.required),
        senha: new FormControl('', Validators.required),
        flagAtivo: new FormControl(false),
        status: new FormControl('')
     });
  }


  salvarUsuario(): void {
    const usuario: Usuarios = {
      id: this.formsRegister.get('id')!.value,
      userName: this.formsRegister.get('userName')!.value,
      senha: this.formsRegister.get('senha')!.value,
      status: this.formsRegister.get('flagAtivo')!.value ? 'I' : 'A'
    };
    if (this.formsRegister.value.id) {

        this.usuarioService.editUsuario(usuario).subscribe(() => {
          this.usuarioService.getAllUsuario().subscribe(usuarios => {
            this.usuarioList = (!!usuarios) ? usuarios : [];
            this.dataSource.data = [...this.usuarioList];
            this.toastr.success('Usuário editado com sucesso!', 'Editar');
          });
        });
    } else {
      this.subs.sink =  this.usuarioService.saveUsuario(usuario).subscribe(() => {
          this.usuarioService.getAllUsuario().subscribe(usuarios => {
            this.usuarioList = (!!usuarios) ? usuarios : [];
            this.dataSource.data = [...this.usuarioList];
            this.toastr.success('Usuário salvo com sucesso!', 'Salvar');
            this.limpar();
          });
        });
    }
  }

  public limpar(): void {
    this.formsRegister.reset();
    this.toastr.info('Campos limpos com sucesso!');
  }


  excluirUsuario(id: string): void {

    this.usuarioService.deleteUsuario(id).subscribe(() => {
      this.usuarioService.getAllUsuario().subscribe(usuarios => {
       this.usuarioList = usuarios;
       this.dataSource.data = this.usuarioList;
       this.filterFormUsuario.reset();
       this.toastr.success('Usuário excluído com sucesso!', 'Excluir');
      });
     });
  }


  getRowTableUsuario(value: any): void {
    let nome;
    this.formsRegister.get('id')!.setValue(value.id);
    //this.formsRegister.get('tipo')!.setValue(value.tipo);
    this.formsRegister.get('userName')!.setValue(value.userName);
    this.formsRegister.get('senha')!.setValue(value.senha);
    this.formsRegister.get('flagAtivo')!.setValue(value.status === 'A' ? false : true );

  }



  filterTabelaUsuario(): void {
    let filteredTable: Usuarios[] = this.usuarioList;
    if (!this.filterFormUsuario.value.nomeFilterCtrl) {
      this.dataSource.data = [...this.usuarioList];
    }
    if (this.filterFormUsuario.value.nomeFilterCtrl) {
      filteredTable = filteredTable.filter
      ( x => {
        return x.userName ? x.userName.toUpperCase().includes(this.filterFormUsuario.value.nomeFilterCtrl.toUpperCase()) : null;
      });
     }
    this.dataSource.data = filteredTable;
  }

}
