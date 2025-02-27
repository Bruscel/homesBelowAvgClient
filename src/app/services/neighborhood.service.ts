import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Neighborhood } from '../models/neighborhood.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NeighborhoodService {

  private apiUrl = `${environment.apiUrl}/api/Neighborhood`; //Development API endpoint

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}
  
  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  // Add a new item (Create)
  addNeighborhood(neighborhood: Neighborhood) {
    return this.http.post(this.apiUrl+"/AddNeighborhood/",neighborhood);
  }


  // Get all items (Read)
  getNeighborhoods(): Observable<Neighborhood[]> {
    return this.http.get<Neighborhood[]>(this.apiUrl).pipe(
      catchError(this.handleError<Neighborhood[]>('getNeighborhoods', []))
    );
  }

  // Method to get neighborhood by ID
  getNeighborhoodById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteNeighborhood(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateNeighborhood(id: number, neighborhoodData: Neighborhood): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, neighborhoodData);
  }


}
