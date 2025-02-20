import { Routes } from '@angular/router';
import { NewNeighborhoodComponent} from './components/new-neighborhood/new-neighborhood.component';

export const routes: Routes = [
  { path: 'newNeighborhood', component: NewNeighborhoodComponent },
  { path: '', redirectTo: 'newNeighborhood', pathMatch: 'full' } // Default route
];

