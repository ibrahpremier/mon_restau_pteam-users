import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  private api = environment.api;
  constructor(
    private httpClient: HttpClient
  ) { }

  getCategory(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.api}/categorie/${id}`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  getCategories(): Observable<any> {
    return this.httpClient.get<any>(`${this.api}/categorie`, httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  getProduit(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.api}/produit/${id}`, httpOptions).pipe(
    catchError(this.handleError)
  );
  }

  getListProduit(): Observable<any> {
    return this.httpClient.get<any>(`${this.api}/produit`, httpOptions).pipe(
    catchError(this.handleError)
  );
  }


  // loadProduits() {
  //   this.httpClient.get<any>(`${this.api}/produit`, httpOptions).subscribe({
  //     next: (response: any) => {
  //       this.produits = response.data.map((plat: any) => {
  //         plat.quantity = 0; // Initialiser la quantité à 0
  //         return plat;
  //       });
       
  //       //this.copiedPlats= this.plats;
  //        },
  //     error: (error: any) => {
  //       console.error('There was an error!', error);
  //     }
  //   });
  // }
   

  getProduits(): Observable<any> {
    return this.httpClient.get<any>(`${this.api}/produit`, httpOptions).pipe(
    catchError(this.handleError)
  );
  }

  createOrder(orderData: any): Observable<any> {
    
    return this.httpClient.post<any>(`${this.api}/commande`, orderData, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide';
          break;
        case 401:
          errorMessage = 'Non autorisé';
          break;
        case 403:
          errorMessage = 'Accès interdit';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Erreur HTTP:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
