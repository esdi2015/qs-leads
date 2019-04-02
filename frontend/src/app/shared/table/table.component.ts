import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatPaginator, MatSort } from "@angular/material";
import { merge, Observable, of as observableOf } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { ClientsService } from "../../services/clients.service";
import { CampaignsService } from "../../services/campaigns.service";
import { LeadsService } from "src/app/services/leads.service";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"]
})
export class TableComponent implements OnInit {
  @Input()
  columns: string[];
  @Input()
  displayedColumns: string[];
  @Input()
  api: { serviceName: string; serviceCall: string };

  data: any[] = [];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;

  constructor(
    private clientsService: ClientsService,
    private campaignsService: CampaignsService,
    private leadsService: LeadsService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.displayedColumns = this.columns
      ? this.columns.map((c: any) => c.key)
      : [];

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this[this.api.serviceName]![this.api.serviceCall](
            this.sort.active || "createdAt",
            this.sort.direction,
            this.paginator.pageIndex
          );
        }),
        map((data: any) => {
          this.isLoadingResults = false;
          this.resultsLength = data.metadata.total;
          return data.content;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.data = data));
  }

  refresh() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
}
