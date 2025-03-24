import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class FilterAccounts extends LightningElement {
    // Stores all accounts retrieved from Salesforce
    accounts = [];

    // Stores the filtered list of accounts based on search criteria
    filteredAcc = [];

    // Stores the user-entered search keyword
    searchValue = '';

    // Stores the selected filter option (default: Name)
    filterSelected = 'Name';

    // List of fields that can be searched when "All" is selected
    accFields = ['Name', 'Type'];

    /**
     * @wire - Fetches accounts from Salesforce using an Apex method
     * This method runs automatically when the component loads
     */
    @wire(getAccounts)
    handleAccounts({ data, error }) {
        if (data) {
            this.accounts = data; // Store the retrieved accounts
            this.filteredAcc = data; // Initially, show all accounts
        }
    }

    /**
     * Handles the search input change and filters accounts accordingly
     * @param {Event} event - The input event from the search field
     */
    searchHandler(event) {
        // Store the lowercase search value for case-insensitive comparison
        this.searchValue = event.target.value.toLowerCase();

        // Filter accounts based on selected filter type
        this.filteredAcc = this.accounts.filter(acc => 
            this.filterSelected === 'All'
                ? this.accFields.some(field => acc[field]?.toLowerCase().includes(this.searchValue))
                : acc[this.filterSelected]?.toLowerCase().includes(this.searchValue)
        );
    }

    /**
     * Handles changes in the filter selection (Name, Type, or All)
     * @param {Event} event - The change event from the combobox
     */
    filterHandler(event) {
        this.filterSelected = event.target.value;

        // Reapply filtering when the filter option changes
        this.searchHandler({ target: { value: this.searchValue } });
    }

    // Options available in the filter dropdown
    options = [
        { label: 'All', value: 'All' },
        { label: 'Name', value: 'Name' },
        { label: 'Type', value: 'Type' }
    ];
}
