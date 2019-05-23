import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from "src/app/shared/table/table.component";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog, MatSnackBar } from "@angular/material";
import { LeadsService } from "src/app/services/leads.service";
import { DialogQuestionComponent } from "src/app/shared/dialog-question/dialog-question.component";
import { environment } from "src/environments/environment";

import * as moment from "moment";
import * as _ from "lodash";
import { HtmlTagDefinition } from "@angular/compiler";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @ViewChild("appTable")
  appTable: TableComponent;

  public api: any;
  public columns: any[];

  private filters: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private historyService: LeadsService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {
    this.api = {
      serviceName: "historyService",
      serviceCall: "list",
      queryFilters: []
    };

    this.filters = {
      userFilter: new FormControl(""),
      clientFilter: new FormControl(""),
      campaignFilter: new FormControl(""),
      filenameFilter: new FormControl("")
    };

    // let userFilter = new FormControl("");
    // let clientFilter = new FormControl("");
    // let campaignFilter = new FormControl("");
    // let filenameFilter = new FormControl("");

    this.columns = [
      {
        key: "user",
        header: "User",
        search: true,
        search_form: this.filters.userFilter,
        search_function: () => this.search_history("user"),
        cell: (row: any) => { if (row.user) {return `${row.user.firstName} ${row.user.lastName}`} else return "None" }
      },
      {
        key: "client",
        header: "Client",
        search: true,
        search_form: this.filters.clientFilter,
        search_function: () => this.search_history("client"),
        cell: (row: any) => { if (row.client != null) { return `${row.client.name}` } else return "None" }
      },
      {
        key: "campaign",
        header: "Campaign",
        search: true,
        search_form: this.filters.campaignFilter,
        search_function: () => this.search_history("campaign"),
        cell: (row: any) => { if (row.campaign != null) { return `${row.campaign.name}` } else return "None" }
      },
      {
        key: "filename",
        header: "Filename",
        search: true,
        search_form: this.filters.filenameFilter,
        search_function: () => this.search_history("filename"),
        cell: (row: any) => `${row.filename}`
      },
      {
        key: "createdAt",
        header: "Uploaded",
        sort: true,
        cell: (row: any) =>
          `${moment(row.createdAt).format("YYYY-MM-DD H:mm:ss")}`
      },
    ];
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.api.queryFilters = [];
      if (params.user) {
        this.api.queryFilters.push({"user": params.user});
      }
      if (params.client) {
        this.api.queryFilters.push({"client": params.client});
      }
      if (params.campaign) {
        this.api.queryFilters.push({"campaign": params.campaign});
      }
      if (params.filename) {
        this.api.queryFilters.push({"filename": params.filename});
      }
      this.appTable.refresh();
    });
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

  search_history(filter: any): void {
    let text;
    let queryParams = {};

    if (filter === "user") {
      text = this.filters.userFilter.value;
      queryParams["user"] = text;
    } else if (filter === "client") {
      text = this.filters.clientFilter.value;
      queryParams["client"] = text;
    } else if (filter === "campaign") {
      text = this.filters.campaignFilter.value;
      queryParams["campaign"] = text;
    } else if (filter === "filename") {
      text = this.filters.filenameFilter.value;
      queryParams["filename"] = text;
    }

    if (text.length > 2) {
      this.router.navigate( ["/history"], { queryParams: queryParams } );
      // tslint:disable-next-line: forin
      for (const key in this.filters) {
        if (key !== String(filter + "Filter")) {
          this.filters[key].reset();
        }
      }
    } else {
      this.router.navigateByUrl("/history");
    }
  }

}
