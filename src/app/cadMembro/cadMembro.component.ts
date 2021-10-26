import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SubSink } from 'subsink/dist/subsink';
import { Membro } from '../models/cadMembro.model';
import { MembroService } from '../service/membro.service';

@Component({
  selector: 'app-cadMembro',
  templateUrl: './cadMembro.component.html',
  styleUrls: ['./cadMembro.component.scss']
})
export class CadMembroComponent implements OnInit {

  formsRegister!: FormGroup;
  filterFormMembro!: FormGroup;
  membroList: Membro[] = [];
  hide!: boolean;
  private readonly subs = new SubSink();
  displayedColumns: string[] = ['Name', 'status', 'action'];
  dataSource = new MatTableDataSource<Membro>();
  @ViewChild('MatPaginator')
  MatPaginator!: MatPaginator;


  constructor( private readonly formBuilder: FormBuilder,
               private readonly membroService: MembroService,
               private readonly toastr: ToastrService) { }

  ngOnInit() {
    this.dataSource.paginator = this.MatPaginator;
    this.createForm();

      this.filterFormMembro = this.formBuilder.group({
        nomeFilterCtrl: ['']
      });

      this.membroService.getAllMembro().subscribe((membro: Membro[]) => {
        this.membroList = (!!membro) ? membro : [];
        this.dataSource.data = [...this.membroList];
    });

  }

  private createForm(): void {
    this.formsRegister = new FormGroup({
        id: new FormControl(null),
        Name: new FormControl('', Validators.required),
        idade: new FormControl('', Validators.required),
        sexo: new FormControl('', Validators.required),
        endereco: new FormControl('', Validators.required),
        flagAtivo: new FormControl(false),
        status: new FormControl('')
     });
  }


  salvarMembro(): void {
    const membro: Membro = {
      id: this.formsRegister.get('id')!.value,
      Name: this.formsRegister.get('Name')!.value,
      dataNascimento: (this.formsRegister.get('dataNascimento')!.value).toLocaleDateString('pt-BR'),
      sexo: this.formsRegister.get('sexo')!.value,
      endereco: this.formsRegister.get('sexo')!.value,
      status: this.formsRegister.get('flagAtivo')!.value ? 'I' : 'A'
    };
    if (this.formsRegister.value.id) {

        this.membroService.editMembro(membro).subscribe(() => {
          this.membroService.getAllMembro().subscribe(membros => {
            this.membroList = (!!membros) ? membros : [];
            this.dataSource.data = [...this.membroList];
            this.toastr.success('Membro editado com sucesso!', 'Editar');
            this.limpar();
          });
        });
    } else {
      this.subs.sink =  this.membroService.saveMembro(membro).subscribe(() => {
          this.membroService.getAllMembro().subscribe(membros => {
            this.membroList = (!!membros) ? membros : [];
            this.dataSource.data = [...this.membroList];
            this.toastr.success('Membro salvo com sucesso!', 'Salvar');
            this.limpar();
          });
        });
    }
  }

  public limpar(): void {
    this.formsRegister.reset();
    this.toastr.info('Campos limpos com sucesso!');
  }


  excluirMembro(idMembro: string): void {

    this.membroService.deleteMembro(idMembro).subscribe(() => {
      this.membroService.getAllMembro().subscribe(membros => {
       this.membroList = membros;
       this.dataSource.data = this.membroList;
       this.filterFormMembro.reset();
       this.toastr.success('Membro excluído com sucesso!', 'Excluir');
      });
     });
  }


  getRowTableMembro(value: any): void {
    this.formsRegister.get('id')!.setValue(value.id);
    this.formsRegister.get('Name')!.setValue(value.Name);
    this.formsRegister.get('dataNascimento')!.setValue(new Date (this.formatDate(value.dataNascimento)));
    this.formsRegister.get('sexo')!.setValue(value.sexo);
    this.formsRegister.get('endereco')!.setValue(value.endereco);
    this.formsRegister.get('flagAtivo')!.setValue(value.status === 'A' ? false : true );

  }



  filterTabelaMembro(): void {
    let filteredTable: Membro[] = this.membroList;
    if (!this.filterFormMembro.value.nomeFilterCtrl) {
      this.dataSource.data = [...this.membroList];
    }
    if (this.filterFormMembro.value.nomeFilterCtrl) {
      filteredTable = filteredTable.filter
      ( x => {
        return x.Name ? x.Name.toUpperCase().includes(this.filterFormMembro.value.nomeFilterCtrl.toUpperCase()) : null;
      });
     }
    this.dataSource.data = filteredTable;
  }

  formatDate(newDate: string): Date {
    const split = newDate.split('/');
    return new Date(split[1] + '/' + split[0] + '/' + split[2]);
  }

}
