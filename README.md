# contacteditor
A CRM contact editor

Development task summary

## What I’ve done:

Made an editable contacts grid and added it to the Account form.

 
The grid provides the following functionality:
* Add new records through a form.
* Open existing records with a “pop-out” button (needs a record to be selected)
* Delete existing records with a delete button (needs one or more records to be selected)
* Paging, sorting.
The coded solution follows the tutorial from the SparkleXrm website, which is very close to the requirements, with some differences.
The code can be found at:
https://github.com/antoniocuegervas/contacteditor


## What I’d do next:

* Take the max/min values accepted by the Credit Limit field from the metadata (although this may not be possible, because the maxvalue is an integer in SparkleXrm, but on CRM it’s a decimal, which can be bigger)
* Add more tests for update and delete, and test cases that are supposed to fail
* Figure out a way to make the tests work without localization
* Tweak style a bit so it’s closer to the version 9

## Issues and problems found

* Some obscure error doesn't let me create a new trial subscription.
* No intellisense
* No intellisense again on unit tests
* Fiddler doesn't properly capture all traffic on my VM, so I had to deploy every time I wanted to test changes.
* Validations on the ObservableContact didn't transmit to the grid (actually they did, the validation was wrong)
* Accidentally removed the [PreserveCase] from SaveCommand(), which yield a few frustrating head-scratching moments
* Couldn't figure out how to make the grid add a new line a force the user to write something on the lastname (so it has some value) before creating the record, so I added the small form for this
* Couldn't open records with double click on the grid (the event is there, but it interferes with the editors on the cells, and only fires if you don't click an editable cell), so I'm adding a button to open a selected record
* ResourceStrings break the unit tests for some reason on the validations -> had to add localisation to unit tests
* Could not make the SparkleXrm metadata service work, (keep getting an error 500) probably missed a step somewhere
