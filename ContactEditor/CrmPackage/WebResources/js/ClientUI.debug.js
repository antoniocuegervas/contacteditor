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
    this.ErrorMessage = ko.observable();
    this.AllowAddNew = ko.observable(true);
    this.Contacts = new SparkleXrm.GridEditor.EntityDataViewModel(10, ClientUI.Model.Contact, true);
    ClientUI.ViewModel.ContactsViewModel.initializeBase(this);
    this.ContactEdit = ko.observable(new ClientUI.ViewModel.ObservableContact());
    this.ContactEdit().add_onSaveComplete(ss.Delegate.create(this, this._contactsViewModel_OnSaveComplete$1));
}
ClientUI.ViewModel.ContactsViewModel.prototype = {
    ContactEdit: null,
    
    _contactsViewModel_OnSaveComplete$1: function ClientUI_ViewModel_ContactsViewModel$_contactsViewModel_OnSaveComplete$1(result) {
        if (result == null) {
            this.ErrorMessage(null);
        }
        else {
            this.ErrorMessage(result);
        }
    },
    
    search: function ClientUI_ViewModel_ContactsViewModel$search() {
        this.Contacts.set_fetchXml("<fetch version='1.0' output-format='xml-platform' mapping='logical' returntotalrecordcount='true' no-lock='true' distinct='false' count='{0}' paging-cookie='{1}' page='{2}'>\r\n  <entity name='contact'>\r\n    <attribute name='firstname' />\r\n    <attribute name='lastname' />\r\n    <attribute name='contactid' />\n    {3}\r\n  </entity>\r\n</fetch>");
        this.Contacts.refresh();
    },
    
    AddNewCommand: function ClientUI_ViewModel_ContactsViewModel$AddNewCommand() {
    },
    
    DeleteSelectedCommand: function ClientUI_ViewModel_ContactsViewModel$DeleteSelectedCommand() {
    },
    
    OpenAssociatedSubGridCommand: function ClientUI_ViewModel_ContactsViewModel$OpenAssociatedSubGridCommand() {
    }
}


////////////////////////////////////////////////////////////////////////////////
// ClientUI.ViewModel.ObservableContact

ClientUI.ViewModel.ObservableContact = function ClientUI_ViewModel_ObservableContact() {
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
ClientUI.View.ContactsView.Init = function ClientUI_View_ContactsView$Init() {
    Xrm.PageEx.majorVersion = 2013;
    ClientUI.View.ContactsView.vm = new ClientUI.ViewModel.ContactsViewModel();
    var contactsDataBinder = new SparkleXrm.GridEditor.GridDataViewBinder();
    var columns = SparkleXrm.GridEditor.GridDataViewBinder.parseLayout('First Name,firstname,250,Last Name,lastname,250');
    var contactsGrid = contactsDataBinder.dataBindXrmGrid(ClientUI.View.ContactsView.vm.Contacts, columns, 'container', 'pager', true, false);
    SparkleXrm.ViewBase.registerViewModel(ClientUI.View.ContactsView.vm);
    $(function() {
        ClientUI.View.ContactsView.vm.search();
    });
}


ClientUI.Model.Contact.registerClass('ClientUI.Model.Contact', Xrm.Sdk.Entity);
ClientUI.ViewModel.ContactsViewModel.registerClass('ClientUI.ViewModel.ContactsViewModel', SparkleXrm.ViewModelBase);
ClientUI.ViewModel.ObservableContact.registerClass('ClientUI.ViewModel.ObservableContact', SparkleXrm.ViewModelBase);
ClientUI.View.ContactsView.registerClass('ClientUI.View.ContactsView');
ClientUI.View.ContactsView.vm = null;
})();

//! This script was generated using Script# v0.7.4.0
