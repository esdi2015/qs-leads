import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LeadsService } from "src/app/services/leads.service";

@Component({
  selector: "app-results-lead",
  templateUrl: "./results-lead.component.html",
  styleUrls: ["./results-lead.component.scss"]
})
export class ResultsLeadComponent implements OnInit {
  public lead: any;

  constructor(
    private route: ActivatedRoute,
    private leadsService: LeadsService
  ) {}

  ngOnInit() {
    this.leadsService
      .single(this.route.snapshot.params["id"])
      .subscribe(result => (this.lead = result));
  }

  public getLeadById(id: string) {
    return this.lead.data.find(d => d.id === id);
  }
}
