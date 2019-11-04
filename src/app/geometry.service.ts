import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {

  public groups: any[];
  public groupChildrenMap: any = {};

  constructor(private http: HttpClient) { 
    this.groups = [];
  }

}
