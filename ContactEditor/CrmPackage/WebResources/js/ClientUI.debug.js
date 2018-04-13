//! ClientUI.debug.js
//

(function() {

Type.registerNamespace('ClientUI.Model');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.Model.Contact

ClientUI.Model.Contact = function ClientUI_Model_Contact() {
    ClientUI.Model.Contact.initializeBase(this, [ 'contact' ]);
}
ClientUI.Model.Contact.prototype = {
    contactid: null,
    firstname: null,
    lastname: null,
    preferredcontactmethodcode: null,
    parentcustomerid: null
}


Type.registerNamespace('ClientUI.ViewModel');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.ViewModel.ContactsViewModel

ClientUI.ViewModel.ContactsViewModel = function ClientUI_ViewModel_ContactsViewModel() {
    ClientUI.ViewModel.ContactsViewModel.initializeBase(this);
}


////////////////////////////////////////////////////////////////////////////////
// ClientUI.ViewModel.ObservableContact

ClientUI.ViewModel.ObservableContact = function ClientUI_ViewModel_ObservableContact() {
    this.contacts = new SparkleXrm.GridEditor.EntityDataViewModel(5, ClientUI.Model.Contact, true);
    this.contactid = ko.observable();
    this.firstname = ko.observable();
    this.lastname = ko.observable();
    this.preferredcontactmethodcode = ko.observable();
    this.parentcustomerid = ko.observable();
    ClientUI.ViewModel.ObservableContact.initializeBase(this);
}
ClientUI.ViewModel.ObservableContact.prototype = {
    
    add_onSaveComplete: function ClientUI_ViewModel_ObservableContact$add_onSaveComplete(value) {
        this.__onSaveComplete$1 = ss.Delegate.combine(this.__onSaveComplete$1, value);
    },
    remove_onSaveComplete: function ClientUI_ViewModel_ObservableContact$remove_onSaveComplete(value) {
        this.__onSaveComplete$1 = ss.Delegate.remove(this.__onSaveComplete$1, value);
    },
    
    __onSaveComplete$1: null,
    
    _toContact$1: function ClientUI_ViewModel_ObservableContact$_toContact$1() {
        var contact = new ClientUI.Model.Contact();
        contact.contactid = this.contactid();
        contact.firstname = this.firstname();
        contact.lastname = this.lastname();
        contact.parentcustomerid = this.parentcustomerid();
        contact.preferredcontactmethodcode = this.preferredcontactmethodcode();
        return contact;
    },
    
    search: function ClientUI_ViewModel_ObservableContact$search() {
        this.contacts.set_fetchXml("<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false' returntotalrecordcount='true' count='{0}' paging-cookie={1} page='{2}'>\r\n  <entity name='contact'>\r\n    <attribute name='contactid' />\r\n    <attribute name='firstname' />\r\n    <attribute name='lastname' />\r\n    <attribute name='preferredcontactmethodcode' />\r\n    <attribute name='parentcustomerid' />\r\n{3}\r\n  </entity>\r\n</fetch>");
    },
    
    saveCommand: function ClientUI_ViewModel_ObservableContact$saveCommand() {
        this.isBusy(true);
        var contact = this._toContact$1();
        Xrm.Sdk.OrganizationServiceProxy.beginCreate(contact, ss.Delegate.create(this, function(state) {
            try {
                this.contactid(Xrm.Sdk.OrganizationServiceProxy.endCreate(state));
                this.__onSaveComplete$1(null);
            }
            catch (ex) {
                this.__onSaveComplete$1(ex.message);
            }
            finally {
                this.isBusy(false);
            }
        }));
    }
}


Type.registerNamespace('ClientUI.View');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.View.ContactsView

ClientUI.View.ContactsView = function ClientUI_View_ContactsView() {
}


ClientUI.Model.Contact.registerClass('ClientUI.Model.Contact', Xrm.Sdk.Entity);
ClientUI.ViewModel.ContactsViewModel.registerClass('ClientUI.ViewModel.ContactsViewModel', SparkleXrm.ViewModelBase);
ClientUI.ViewModel.ObservableContact.registerClass('ClientUI.ViewModel.ObservableContact', SparkleXrm.ViewModelBase);
ClientUI.View.ContactsView.registerClass('ClientUI.View.ContactsView');
})();

//! This script was generated using Script# v0.7.4.0
