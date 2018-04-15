# contacteditor
A CRM contact editor

## What I did

1. Trial info:

	orgname: cuexrm7
	userid: acue@cuexrm7.onmicrosoft.com
	version: 1612 (9.0.2.52)
	 
2. Create empty crm solution: 

	contacteditor (prefix ced1_)

3. Install Developer toolkit (I'm using VS2015)

4. Download SparkleXrm from github, copy \SparkleXrm-master\SparkleXrmSamples\SparkleXrmTemplateVS2015 as template


## What I would do next

## Issues & problems that I came across

1. Some obscure error doesn't let me create a new trial subscription. (13/04)

	ErrorType=CommunicationException
	ErrorCode=Unknown
	PartnerServiceErrorCode=
	CorrelationID=5df64d59-712e-4016-ac20-3a009be17ede

2. No intellisense (fixed)

3. No intellisense again on unit tests

4. Fiddler doesn't properly capture all traffic on my VM

5. Validations on the ObservableContact don't transmit to the grid (actually they did, the validation was wrong)

6. Accidentally removed the [PreserveCase] from SaveCommand(), which yield a few frustrating head-scratching moments

7. Couldn't figure out how to make the grid add a new line a force the user to write something on the lastname (so it validates) before creating the record, so I had to add a small form for this

8. Couldn't open records with double click (the event is there, but it interferes with the cells, and only works if you don't click an editable cell), so I'm adding a button to open a selected record

9. ResourceStrings break the unit tests for some reason on the validations -> had to add localisation to unit tests