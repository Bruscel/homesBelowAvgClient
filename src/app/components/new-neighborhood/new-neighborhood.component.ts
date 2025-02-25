import { Component, ElementRef, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NeighborhoodService } from '../../services/neighborhood.service';
import { Neighborhood } from '../../models/neighborhood.model';
import 'datatables.net';



@Component({
  selector: 'app-new-neighborhood',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-neighborhood.component.html',
  styleUrl: './new-neighborhood.component.scss'
})
export class NewNeighborhoodComponent implements OnInit{
    @ViewChild('closeModalBtn') closeModalBtn!: ElementRef; // Reference to modal
    @ViewChild('dataTable', { static: false }) table!: ElementRef;
    addNeighborhoodForm: FormGroup;
    neighborhoods: Neighborhood[] = [];// Holds submitted data
    dataTableInstance: any;


    // ngAfterViewInit(): void {
    //   this.getNeighborhoods();
    // }

    constructor(private neighborhoodService: NeighborhoodService, private fb: FormBuilder, private router: Router) {
      this.addNeighborhoodForm = this.fb.group({
        neighborhoodId:[0],
        neighborhoodName: ['', Validators.required],
        city: ['', Validators.required],
        zip: ['', Validators.required],
        state: ['', Validators.required],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
        feetRadius: ['', Validators.required]
      });
    }
 
    ngOnInit(): void {
      this.getNeighborhoods();
    }
    
    async onSubmit() {
      try {
        await this.neighborhoodService.addNeighborhood(this.addNeighborhoodForm.value).subscribe(() => {
            this.getNeighborhoods();// Refresh table data
            this.closeModalBtn.nativeElement.click(); // Click close button to hide modal
          }
        );

        console.log('Form submitted successfully!');


      } catch (error) {
        console.error('Submission failed:', error);
      }
    }
    
    getNeighborhoods(): void {
      this.neighborhoodService.getNeighborhoods().subscribe(
        (data: Neighborhood[]) => {
          this.neighborhoods = data;  // Store fetched data
          
          setTimeout(() => {
            if (this.dataTableInstance) {
              this.dataTableInstance.destroy();  // Destroy existing instance
              $(this.table.nativeElement).off('click', '.delete-btn'); // Remove old event listeners
            }
            
            this.dataTableInstance = $(this.table.nativeElement).DataTable({
              data: this.neighborhoods,
              columns: [
                { title: 'ID', data: 'neighborhoodId' },
                { title: 'Name', data: 'neighborhoodName' },
                { title: 'City', data: 'city' },
                { title: 'Zip', data: 'zip' },
                { title: 'State', data: 'state' },
                { title: 'Latitude', data: 'latitude' },
                { title: 'Longitude', data: 'longitude' },
                { title: 'Feet Radius', data: 'feetRadius' },
                { 
                  title: 'Actions', 
                  data: null, 
                  render: (data: any) => {
                    return `<button class='btn btn-danger btn-sm delete-btn' data-id='${data.neighborhoodId}'>Delete</button>`;
                  }
                }
              ],
              destroy: true,  // Ensure cleanup before reinitialization
              paging: true,
              searching: true,
              ordering: true
            });

            $(this.table.nativeElement).on('click', '.delete-btn', (event) => {
              const id = $(event.currentTarget).data('id');
              this.deleteNeighborhood(id);
            });
          }, 0);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    }

    deleteNeighborhood(id: number): void {
      if (confirm('Are you sure you want to delete this neighborhood?')) {
        this.neighborhoodService.deleteNeighborhood(id).subscribe(() => {
          console.log(`Neighborhood with ID ${id} deleted.`);
          this.getNeighborhoods();
        }, (error) => {
          console.error('Error deleting neighborhood:', error);
        });
      }
    }

}
