import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private httpClient:HttpClient) { }

  getGeolocation(url: string): Observable<any> {
    return this.httpClient.get(url)
  }
}
