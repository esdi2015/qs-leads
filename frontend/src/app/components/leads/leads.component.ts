import { Component, OnInit, ViewChild, OnChanges } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import * as moment from "moment";
import { LeadsService } from "src/app/services/leads.service";
import { DialogQuestionComponent } from "src/app/shared/dialog-question/dialog-question.component";
import { TableComponent } from "src/app/shared/table/table.component";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-leads",
  templateUrl: "./leads.component.html",
  styleUrls: ["./leads.component.scss"]
})
export class LeadsComponent implements OnInit, OnChanges {
  @ViewChild("appTable")
  appTable: TableComponent;

  public api: any;
  public columns: any[];
  public searchText: string;

  constructor(
    private dialog: MatDialog,
    private leadsService: LeadsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // this.route.queryParams.subscribe(params => {
    //   if (params.search) {
    //       this.api.searchText = params.search;
    //       //this.appTable.refresh();
    //   }
    // });
    this.api = {
      serviceName: "leadsService",
      serviceCall: "list"
      // serviceCall: "searchLeads"
    };
    this.columns = [
      {
        key: "name",
        header: "Name",
        sort: true,
        cell: (row: any) => `<b>${row.name}</b>`
      },
      {
        key: "client",
        header: "Client",
        cell: (row: any) => { if (row.client != null) { return `${row.client.name}` } else return "None" }
      },
      {
        key: "campaign",
        header: "Campaign",
        cell: (row: any) => { if (row.campaign != null) { return `${row.campaign.name}` } else return "None" } 
      },
      {
        key: "filename",
        header: "Filename",
        cell: (row: any) => `${this.truncate(row.filename, 50)}`
      },
      {
        key: "status",
        header: "Status",
        cell: (row: any) => `${row.status}`,
        progress: (row: any) => {
          const parsed = row.status.replace("Processing ", "").split("/");
          const current = parseInt(parsed[0], 10);
          const total = parseInt(parsed[1], 10);
          return (current / total) * 100;
        },
        conditions: {
          progress: (row: any) => row.status.startsWith("Processing")
        }
      },
      {
        key: "createdAt",
        header: "Created",
        sort: true,
        cell: (row: any) =>
          `${moment(row.createdAt).format("YYYY-MM-DD H:mm:ss")}`
      },
      // {
      //   key: "updatedAt",
      //   header: "Modified",
      //   sort: true,
      //   cell: (row: any) =>
      //     `${moment(row.updatedAt).format("YYYY-MM-DD H:mm:ss")}`
      // },
      {
        key: "actions",
        actions: {
          result: (row: any) => {
            this.router.navigateByUrl(`/leads/results/${row.id}`);
          },
          download: (row: any) => {
            window.location.href = `${environment.api}leads/download/${
              row.id
            }`;
          }
        },
        conditions: {
          result: (row: any) => !["Started", "Pending"].includes(row.status),
          download: (row: any) => !["Started", "Pending"].includes(row.status)
        }
      }
    ];
  }

  ngOnInit() {
    console.log(this.route.params);
    console.log(this.route.queryParams);
    this.route.params.subscribe(params => {
      if (params.search_text) {
          this.api.searchText = params.search_text;
          this.appTable.refresh();
      }
    });
    this.route.queryParams.subscribe(params => {
      if (params.search) {
          this.api.searchText = params.search;
          this.appTable.refresh();
      }
    });
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log("ngOnChange");
  }

  truncate(str, length, ending?) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = "...";
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  }
}
