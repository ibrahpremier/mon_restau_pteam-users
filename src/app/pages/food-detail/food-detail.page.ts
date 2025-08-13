import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-food-detail',
  templateUrl: './food-detail.page.html',
  styleUrls: ['./food-detail.page.scss'],
})
export class FoodDetailPage implements OnInit {
  produit: any;
  produitId: number|null = null;

  constructor(
    public globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private produitService: ProduitService
  ) { }

  ngOnInit() {
    this.produitId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.produitId !== null) {
      this.loadProduit(this.produitId);
    }
  }


  loadProduit(id: number) {
    this.produitService.getProduit(id).subscribe({
      next: (response: any) => {
        this.produit = response.data;
        this.produit.quantity = this.produit.quantity || 0;
      },
      error: (error: any) => {
        console.error('There was an error!', error);
      }
    });
  }

  addQuantity(plat: any) {
    plat.quantity++; // Ajoute 1 à la quantité de l'article
    if (plat.quantity >= 1) {
      this.globalService.ajouterAuPanier(plat, plat.quantity);
    }
  }

  removeQuantity(plat: any) {
    if (plat.quantity >= 0) {
      plat.quantity--; // Décrémente la quantité de l'article
      if (plat.quantity === 0) {
        // Si la quantité atteint 0, supprime l'article du panier
        this.globalService.enleverDuPanier(plat, plat.quantity); // Supprime l'article du panier
      } else {
        // Si la quantité est supérieure à 0, met à jour la quantité dans le panier
        this.globalService.enleverDuPanier(plat, plat.quantity); // Met à jour la quantité dans le panier
      }
    }
  }

  getQuantity(plat: any): number {
    return plat.quantity; // Retourne la quantité actuelle de l'article
  }
  

  



  
   
  goToHomePage() {
    this.router.navigate(['/home']);
  }
}





