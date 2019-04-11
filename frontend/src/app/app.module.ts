import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChartModule } from "angular-highcharts";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CampaignsComponent } from "./components/campaigns/campaigns.component";
import { ClientsComponent } from "./components/clients/clients.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HistoryComponent } from "./components/history/history.component";
import { MaterialModule } from "./material.module";
import { DialogQuestionComponent } from "./shared/dialog-question/dialog-question.component";
import { TableComponent } from "./shared/table/table.component";
import { CreateClientComponent } from "./components/clients/create-client/create-client.component";
import { CreateCampaignComponent } from "./components/campaigns/create-campaign/create-campaign.component";
import { LeadsComponent } from "./components/leads/leads.component";
import { UsersComponent } from "./components/users/users.component";
import { CreateLeadComponent } from "./components/leads/create-lead/create-lead.component";
import { ResultsLeadComponent } from "./components/leads/results-lead/results-lead.component";
import { CreateUserComponent } from "./components/users/create-user/create-user.component";
import { AuthCanActivate } from "./shared/activators/auth.canactivate";
@NgModule({
  entryComponents: [DialogQuestionComponent],
  declarations: [
    AppComponent,
    DashboardComponent,
    ClientsComponent,
    CreateClientComponent,
    CampaignsComponent,
    CreateCampaignComponent,
    HistoryComponent,
    LeadsComponent,
    CreateLeadComponent,
    ResultsLeadComponent,
    UsersComponent,
    CreateUserComponent,
    TableComponent,
    DialogQuestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    ...MaterialModule
  ],
  providers: [AuthCanActivate],
  bootstrap: [AppComponent]
})
export class AppModule {}
