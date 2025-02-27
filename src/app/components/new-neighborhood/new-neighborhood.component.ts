import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NeighborhoodService } from '../../services/neighborhood.service';
import { Neighborhood } from '../../models/neighborhood.model';

// Import DataTables as an ES module
import DataTables from 'datatables.net-bs5';

@Component({
  selector: 'app-new-neighborhood',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-neighborhood.component.html',
  styleUrl: './new-neighborhood.component.scss'
})
export class NewNeighborhoodComponent implements OnInit {
    @ViewChild('closeModalBtn') closeModalBtn!: ElementRef; // Modal close button reference
    @ViewChild('modalElement') modalElement!: ElementRef; // Modal reference
    @ViewChild('dataTable', { static: false }) table!: ElementRef; // DataTable reference

    selectedNeighborhoodId: number | null = null;
    addNeighborhoodForm: FormGroup;
    neighborhoods: Neighborhood[] = [];
    isEditMode: boolean = false;
    private modalInstance: any = null;
    private dataTable: any = null;

    constructor(private neighborhoodService: NeighborhoodService, private fb: FormBuilder, private router: Router) {
        this.addNeighborhoodForm = this.fb.group({
            neighborhoodId: [0],
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
                this.getNeighborhoods();
                this.closeModal();
            });
            console.log('Form submitted successfully!');
        } catch (error) {
            console.error('Submission failed:', error);
        }
    }

    addNeighborhood(): void {
      // Reset form and explicitly update validity
      this.isEditMode = false; // Ensure we're in add mode
      //this.selectedNeighborhoodId = null;
      this.addNeighborhoodForm.reset({
        neighborhoodId: 0, // Explicitly set to 0
        neighborhoodName: '',
        city: '',
        zip: '',
        state: '',
        latitude: '',
        longitude: '',
        feetRadius: ''
      });
      this.openModal();
    }
  

    getNeighborhoods(): void {
        this.neighborhoodService.getNeighborhoods().subscribe(
            (data: Neighborhood[]) => {
                this.neighborhoods = data;
                this.initializeDataTable();
            },
            (error) => console.error('Error fetching data:', error)
        );
    }

    private initializeDataTable(): void {
        setTimeout(() => {
            if (this.dataTable) {
                this.dataTable.destroy(); // Destroy old instance before reinitializing
            }
    
            this.dataTable = new DataTables(this.table.nativeElement, {
                data: this.neighborhoods, // Ensure DataTables receives data
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
                      render: (data: any) => `
                        <button class='btn btn-danger btn-sm delete-btn' data-id='${data.neighborhoodId}'>Delete</button> 
                        <button class='btn btn-light btn-sm update-btn' data-id='${data.neighborhoodId}'>Update</button>
                      `
                    }
                ],
                paging: true,
                searching: true,
                ordering: true
            });
    
            // Attach event listeners
            this.table.nativeElement.addEventListener('click', (event: Event) => {
                const target = event.target as HTMLElement;
                if (target.classList.contains('delete-btn')) {
                    const id = target.getAttribute('data-id');
                    if (id) this.deleteNeighborhood(Number(id));
                }
                if (target.classList.contains('update-btn')) {
                    const id = target.getAttribute('data-id');
                    if (id) this.updateNeighborhood(Number(id));
                }
            });
    
        }, 100); // Small delay ensures table is rendered before initialization
    }

    deleteNeighborhood(id: number): void {
        if (confirm('Are you sure you want to delete this neighborhood?')) {
            this.neighborhoodService.deleteNeighborhood(id).subscribe(() => {
                console.log(`Neighborhood with ID ${id} deleted.`);
                this.getNeighborhoods();
            }, (error) => console.error('Error deleting neighborhood:', error));
        }
    }

    updateNeighborhood(id: number): void {
        this.selectedNeighborhoodId = id;
        this.isEditMode = true;

        this.neighborhoodService.getNeighborhoodById(id).subscribe((data) => {
            this.addNeighborhoodForm.patchValue(data);
            this.openModal();
        });
    }

    async onSave() {
        if (this.selectedNeighborhoodId !== null) {
            try {
                await this.neighborhoodService.updateNeighborhood(this.selectedNeighborhoodId, this.addNeighborhoodForm.value).subscribe(() => {
                    this.closeModal();
                    this.getNeighborhoods();
                });
                console.log('Form updated successfully!');
            } catch (error) {
                console.error('Update failed:', error);
            }
        } else {
            console.error('No neighborhood selected!');
        }
    }

    // Lazy Load Bootstrap Modal
    public async openModal() {
        if (!this.modalInstance) {
            const bootstrap = await import('bootstrap');
            this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement, { backdrop: true });
        }
        this.modalInstance.show();
    }

    public closeModal() {
        if (this.modalInstance) {
            this.isEditMode = false;
            this.modalInstance.hide();
        }
    }
}
