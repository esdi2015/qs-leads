import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { CampaignsComponent } from "./components/campaigns/campaigns.component";
import { HistoryComponent } from "./components/history/history.component";
import { ClientsComponent } from "./components/clients/clients.component";
import { CreateClientComponent } from "./components/clients/create-client/create-client.component";
import { CreateCampaignComponent } from "./components/campaigns/create-campaign/create-campaign.component";
import { LeadsComponent } from "./components/leads/leads.component";
import { UsersComponent } from "./components/users/users.component";
import { CreateLeadComponent } from "./components/leads/create-lead/create-lead.component";
import { ResultsLeadComponent } from "./components/leads/results-lead/results-lead.component";
import { CreateUserComponent } from "./components/users/create-user/create-user.component";
import { AuthCanActivate } from "./shared/activators/auth.canactivate";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "clients",
    component: ClientsComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "clients/create",
    component: CreateClientComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "clients/edit/:id",
    component: CreateClientComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "campaigns",
    component: CampaignsComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "campaigns/create",
    component: CreateCampaignComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "campaigns/clone/:id",
    component: CreateCampaignComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "campaigns/edit/:id",
    component: CreateCampaignComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "leads",
    component: LeadsComponent,
    canActivate: [AuthCanActivate]
  },
  // {
  //   path: "leads?search=:search",
  //   component: LeadsComponent,
  //   canActivate: [AuthCanActivate]
  // },
  // {
  //   path: "leads/search/:search_text",
  //   component: LeadsComponent,
  //   canActivate: [AuthCanActivate]
  // },
  {
    path: "leads/create",
    component: CreateLeadComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "leads/results/:id",
    component: ResultsLeadComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "history",
    component: HistoryComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "users",
    component: UsersComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "users/create",
    component: CreateUserComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "users/edit/:id",
    component: CreateUserComponent,
    canActivate: [AuthCanActivate]
  },
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full"
  }
  // { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
