import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NeighborhoodService } from '../../services/neighborhood.service';
import { Neighborhood } from '../../models/neighborhood.model';


@Component({
  selector: 'app-new-neighborhood',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-neighborhood.component.html',
  styleUrl: './new-neighborhood.component.scss'
})
export class NewNeighborhoodComponent implements OnInit{
    @ViewChild('closeModalBtn') closeModalBtn!: ElementRef; // Reference to modal
    addNeighborhoodForm: FormGroup;
    neighborhoods: Neighborhood[] = [];// Holds submitted data

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
        (data) => (this.neighborhoods = data),
        (error) => console.error('Error fetching items', error)
      );
    }
}
