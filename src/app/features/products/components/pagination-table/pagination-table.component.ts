import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination-table',
  imports: [],
  templateUrl: './pagination-table.component.html',
  styleUrl: './pagination-table.component.css',
})
export class PaginationTableComponent {
  @Input() resultsCount = 0;
  @Output() pageSizeChange = new EventEmitter<number>();
}
