import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditsComponent } from './components/credits/credits.component';
import { HomeComponent } from './components/home/home.component';
import { TableComponent } from './components/playground/table.component';
import { StatsComponent } from './components/stats/stats.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'table', component: TableComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // redirect to `first-component`
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}