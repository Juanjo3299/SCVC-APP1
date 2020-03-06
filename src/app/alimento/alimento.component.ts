import {Component, OnInit, ViewChild} from '@angular/core';
import {AlimentoService} from './alimento.service';
import {Alimento} from './alimento';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {tap} from 'rxjs/operators';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FormComponent} from './form/form.component';

@Component({
  selector: 'app-alimento',
  templateUrl: './alimento.component.html',
  styleUrls: ['./alimento.component.css']
})
export class AlimentoComponent implements OnInit {

  alimentos: Alimento[];
  alimento: Alimento  = new Alimento();
  displayedColumns: string[] = ['id', 'nombre','precio','editar'];
  dataSource: MatTableDataSource<Alimento>;
  isLoading: boolean=true;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private alimentoService: AlimentoService,private dialog: MatDialog) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.alimentoService.getAlimentos().pipe(
        tap(alimentos => {
          console.log('Alimentos: tap 3');
          this.dataSource = new MatTableDataSource(alimentos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.paginator._intl.firstPageLabel = 'Primera pagina';
          this.paginator._intl.lastPageLabel = 'Última pagina';
          this.paginator._intl.nextPageLabel = 'Pagina siguiente';
          this.paginator._intl.previousPageLabel = 'Pagina anterior';
          this.paginator._intl.itemsPerPageLabel = 'Elementos por página';
          this.isLoading = false;
        })
      ).subscribe(alimentos => this.dataSource.data = alimentos);
    }, 1000);
    this.alimentoService.notificarCambio.subscribe(response => {
      this.refresh();
    });
  }

  onEdit(alimento: Alimento){
    this.alimentoService.getAlimento(alimento.id).subscribe(
      (alimento) => {
        this.alimentoService.setAlimento(alimento);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "400px";
        this.dialog.open(FormComponent,dialogConfig);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  refresh() {
    this.isLoading = true;
    setTimeout(() => {
      this.alimentoService.getAlimentos().subscribe((data: Alimento[]) => {
        this.dataSource.data = data;
        this.isLoading = false;
      });
    }, 500);

  }

}
