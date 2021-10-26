import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Membro } from '../models/cadMembro.model';

@Injectable({
  providedIn: 'root'
})
export class MembroService {

  readonly apiUrl = 'http://127.0.0.1:5000';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
 constructor(private readonly _HTTP: HttpClient) { }


   getAllMembro(): Observable<Membro[]> {
       return this._HTTP.get<Membro[]>(this.apiUrl + '/membro', {});
   }
   getMembroById(idMembro: string): Observable<any> {
       return this._HTTP.get(this.apiUrl + '/Membro/?id=' + idMembro);
   }
   saveMembro(membro: Membro): Observable<Membro> {
       return this._HTTP.post<Membro>(this.apiUrl + '/membro', membro, this.httpOptions);
   }
   editMembro(membro: Membro): Observable<any> {

     return this._HTTP.put(this.apiUrl + '/membro' , membro, this.httpOptions);
   }
   deleteMembro(id: string): Observable<any> {
       return this._HTTP.delete(this.apiUrl + '/membro/' + id, this.httpOptions);
   }

}
