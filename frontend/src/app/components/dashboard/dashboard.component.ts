import { Component, OnInit } from "@angular/core";
import { Chart } from "angular-highcharts";
import { OverviewService } from "src/app/services/overview.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  chart: Chart;
  chart2: Chart;

  constructor(private overviewService: OverviewService) {}

  ngOnInit() {
    this.chart = new Chart({
      chart: {
        type: "column"
      },
      title: {
        text: "Clients"
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: { text: "Campaigns count per Client" }
      },
      tooltip: {
        headerFormat: "<b>{series.name}</b><br/>",
        pointFormat: "Campaigns Count: {point.y}"
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            color: "white"
          }
        }
      },
      series: []
    });

    this.chart2 = new Chart({
      chart: {
        type: "column"
      },
      title: {
        text: "Leads"
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: { text: "Leads count per Client" },
        stackLabels: {
          enabled: true
        }
      },
      tooltip: {
        headerFormat: "<b>{series.name}</b><br/>",
        pointFormat: "Leads Count: {point.y}"
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            color: "white"
          }
        }
      },
      series: []
    });
    this.overviewService.overviewChart().subscribe((data: any) => {
      for (let c of data.find(n => n.name === "CampaignsCountPerClient")
        .value) {
        this.chart.addSeries({ name: c.clientName, data: [c.campaignsCount] });
      }
      for (let c of data.find(n => n.name === "LeadsCountPerClient").value) {
        this.chart2.addSeries({
          name: c.clientName + " (OK)",
          data: [c.leads.ok],
          stack: "ok"
        });
        this.chart2.addSeries({
          name: c.clientName + " (FAIL)",
          data: [c.leads.fail],
          stack: "fail"
        });
      }
    });
  }
}
