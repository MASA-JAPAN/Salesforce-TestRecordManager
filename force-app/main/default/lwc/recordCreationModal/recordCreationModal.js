import { api, track } from 'lwc';
import LightningModal from 'lightning/modal';
import createRecords from '@salesforce/apex/RecordOperationService.createRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RecordCreationModal extends LightningModal {

    @track isSpinning = false;

    @api content;
    @track numberOfCreation = 1;

    handleCancel() {
        this.close();
    }

    handleCreate() {

        try {

            const numberOfCreation = this.numberOfCreation;
            const configToInsertDtoString = this.content.MJ_TRM__ConfigToInsert__c;
    
            this.openSpinner();

            createRecords({ numberOfCreation, configToInsertDtoString })
                .then(() => {
                    this.close();
                    this.showToast('Success', 'Record created successfully', 'success');
                })
                .catch(error => {
                    console.log(JSON.stringify(error));
                    this.showToast('Error', error.body.message, 'error');
                })
                .finally(() => {
                    this.closeSpinner();
                });
        } catch (error) {
            console.log( "error: " + error);
        }


    }

    handleNumberOfCreationInputChange(event) {
        const inputValue = event.target.value;
        this.numberOfCreation = inputValue;
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
          title: title,
          message: message,
          variant: variant
        });
        this.dispatchEvent(event);
    }

    openSpinner() {
        this.isSpinning = true;
    }

    closeSpinner() {
        this.isSpinning = false;
    }


}