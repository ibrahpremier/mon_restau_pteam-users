import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { InscriptionComponent } from 'src/app/components/inscription/inscription.component';
import { ProduitService } from 'src/app/services/produit.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  categories: any[] = [];
  produits: any[] = [];
  totalPrix: number = 0;
  selectedPlat: any;
  loading = true;
  error: string | null = null;
  successMessage: string | null = null;
  client:any;

 


  constructor(
    public globalService: GlobalService,
    private router: Router,
    private routerLink: Router,
    private route: ActivatedRoute,
    // private modalController:ModalController
    private produitService: ProduitService
    
  ) {

    this.loadCategories();
    this.loadProduits();
    this.initializeQuantities(); // Appel de la méthode pour initialiser les quantités
    
  }

  ngOnInit() {
    
    this.globalService.successMessage$.subscribe(message => {
      if (message) {
        this.successMessage = message;
        setTimeout(() => {
          this.successMessage = null;
        }, 3000); // Cache le message après 3 secondes
      }
    });

    this.route.paramMap.subscribe(params => {
      this.client = params.get('client');
      if (this.client) {
        console.log('Client ID:', this.client);
        // Vous pouvez maintenant utiliser la variable `client` dans votre logique
      } else {
        console.log('No client ID provided');
      }
    });
  
  }
   
  async goToPanier() {
    if (this.client) {
      this.router.navigate(['/panier', this.client]);
    } else {
      this.router.navigate(['/panier']);
    }
  }
  
  

  loadProduits() {
    this.produitService.getListProduit().subscribe({
      next: (response: any) => {
        this.produits = response.data;
       
      },
      error: (error: any) => {
        console.error('There was an error!', error);
      }
    });
  }
  
  loadCategories() {
    this.produitService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data;
       
      },
      error: (error: any) => {
        console.error('There was an error!', error);
      }
    });
  }

 


  initializeQuantities() {
    this.categories.forEach((category) => {
      category.liste_plat.forEach((item: { quantity: number }) => {
        item.quantity = 0; // Initialisation de la quantité à 0 pour chaque plat
      });
    });
  }

  goToOtherPage() {
    
    this.router.navigate(['/search']);
  }

  goToPageCategories() {
    this.routerLink.navigate(['/list-categories']);
  }

  
  addQuantity(item: any) {
    item.quantity++; // Ajoute 1 à la quantité de l'article
    if (item.quantity >= 1) {
      this.globalService.ajouterAuPanier(item, item.quantity);
    }
  }

  removeQuantity(item: any) {
    if (item.quantity >= 0) {
      item.quantity--; // Décrémente la quantité de l'article
      if (item.quantity === 0) {
        // Si la quantité atteint 0, supprime l'article du panier
        this.globalService.enleverDuPanier(item, item.quantity); // Supprime l'article du panier
      } else {
        // Si la quantité est supérieure à 0, met à jour la quantité dans le panier
        this.globalService.enleverDuPanier(item, item.quantity); // Met à jour la quantité dans le panier
      }
    }
  }
  

  getQuantity(item: any): number {
    return item.quantity; // Retourne la quantité actuelle de l'article
  }


 
  
}
