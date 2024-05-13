import { Component } from '@angular/core';
import * as Highcharts from 'highcharts'
import { HighchartsChartModule } from 'highcharts-angular';
import HighchartsDraggablePoints from 'highcharts/modules/draggable-points'
import HC_gantt from 'highcharts/modules/gantt';
import HC_accessibility from 'highcharts/modules/accessibility'

import { data } from './data';

HC_gantt(Highcharts);
HighchartsDraggablePoints(Highcharts)
HC_accessibility(Highcharts)

@Component({
  selector: 'app-gantt',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './gantt.component.html',
  styleUrl: './gantt.component.scss'
})
export class GanttComponent {
  Highcharts: typeof Highcharts = Highcharts;
  dataArray: any = data;
  chartOptions: any = {
    title: {
      text: 'Tweak a single dependency',
    },
    series: [],
  };


  ngOnInit(): void {
    this.updateChart();
  }

  updateChart() {
    const convertedData = this.convertHierarchyToArray(this.dataArray);

    console.log('convertedData :>> ', convertedData);
    const yAxis = {
      type: 'treegrid',
      uniqueNames: true,
      grid: {
        columns: [
          {
            title: {
              text: 'Name',
            },
            categories: convertedData.map((item: any) => item.name),
          },
          {
            title: {
              text: 'ID',
            },
            labels: {
              formatter: (ctx:any) =>  convertedData[ctx.value]?.id
          }
          },
          // {
          //   title: {
          //     text: 'Assigned Employees',
          //     rotation: 45,
          //     y: -15,
          //     x: -10,
          //     style: {
          //       width: '100px'
          //     }
          //   },
          //   categories: convertedData.map((item: any) => item.assignedEmployees),
          // },
          // {
          //   title: {
          //     text: 'MDS allocated',
          //     rotation: 45,
          //     y: -15,
          //     x: -5,
          //     style: {
          //       width: '190px'
          //     }
          //   },
          //   categories: convertedData.map((item: any) => item.allocatedMds),
          // },
        ],
      },
    };

    this.chartOptions = {
      ...this.chartOptions,
      yAxis: yAxis,
      series: [
        {
          name: 'Temp Data',
          data: convertedData,
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: {
                fontWeight: 'normal',
                textOutline: 'none'
            }
        }
        },
      ],
    };

    // Highcharts.ganttChart('container', this.chartOptions);
    console.log('this.chartOptions ===> ', this.chartOptions);
  }

  convertHierarchyToArray(data: any) {
    const hierarchyData = data.reduce((acc: any, item: any, index: any) => {
      const groupKey = item.project_floor_phases;
      const today = new Date()
      acc[groupKey] ??= {
        id: groupKey,
        name: item.floor_name, // Assuming floor_name represents the group name
        data: [],
      };

      acc[groupKey].data.push({
        parent: groupKey,
        name: item.name,
        id: item.id,
        start: item.date ? Date.parse(item.date) : today.getTime(),
        end: item.date ? Date.parse(item.date) + item.man_days_allotted * 86400000 : today.getDate() + item.man_days_allotted * 86400000,
        // y: Number(index),
        color: item.parent ? 'blue' : 'gray',
        allocatedMds: item.man_days_allotted,
        assignedEmployees: item.assigned_employees
      });
      return acc;
    }, {});

    console.log(' hierarchyData:>> ', hierarchyData);
    const result: any = [];
    for (const key in hierarchyData) {
      if (Object.hasOwnProperty.call(hierarchyData, key)) {
        const obj = hierarchyData[key];
        // result.push({ id: String(obj.id), name: obj.name,y:obj.id});
        result.push({ id: String( obj.id), name: obj.name, color: obj.color });

        obj.data.forEach((item: any, index: any) => {
          result.push({
            ...item,
            id: String(item.id),
            parent: String(item.parent),
            y: Number(index)+1,
            color: item.color,
            allocatedMds: item.allocatedMds,
            assignedEmployees: item.assigned_employees
          });
        });
      }
    }
    return result;
  }
}
