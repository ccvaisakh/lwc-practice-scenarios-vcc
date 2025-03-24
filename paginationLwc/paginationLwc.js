import { LightningElement, wire } from 'lwc';
import geAllAccounts from '@salesforce/apex/AccountController.geAllAccounts';

export default class PaginationLwc extends LightningElement {
    allAccounts = []; // Stores all account records fetched from Apex
    noOfRecordsPerPage = 5; // Number of records to display per page
    currentPage = 1; // Tracks the current page number
    totalPages = 1; // Total number of pages, calculated dynamically

    // Define columns for the lightning-datatable
    accColumns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Type', fieldName: 'Type' }
    ];

    /**
     * Fetches account records from the Apex method `getAllAccounts`
     * and calculates the total number of pages dynamically.
     */
    @wire(geAllAccounts)
    handleAccounts({ data, error }) {
        if (data) {
            this.allAccounts = data;
            this.totalPages = Math.ceil(data.length / this.noOfRecordsPerPage) || 1; // Ensure at least 1 page exists
        } else if (error) {
            console.error(error);
        }
    }

    /**
     * Returns a subset of accounts for the current page.
     * It calculates the `start` and `end` indices dynamically based on `currentPage`.
     */
    get pagination() {
        let start = (this.currentPage - 1) * this.noOfRecordsPerPage;
        let end = this.currentPage * this.noOfRecordsPerPage;
        return this.allAccounts.slice(start, end);
    }

    /**
     * Disables the "Previous" button when on the first page.
     */
    get isPrevDisabled() {
        return this.currentPage === 1;
    }

    /**
     * Disables the "Next" button when on the last page.
     */
    get isNextDisabled() {
        return this.currentPage >= this.totalPages;
    }

    /**
     * Moves to the next page if it's not the last page.
     */
    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    /**
     * Moves to the previous page if it's not the first page.
     */
    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }
}
