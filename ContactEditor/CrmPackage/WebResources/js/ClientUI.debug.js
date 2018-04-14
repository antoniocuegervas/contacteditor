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

ClientUI.ViewModel.ContactsViewModel = function ClientUI_ViewModel_ContactsViewModel(parentCustomerId) {
    this.ErrorMessage = ko.observable();
    this.Contacts = new SparkleXrm.GridEditor.EntityDataViewModel(10, ClientUI.Model.Contact, true);
    this.parentCustomerId = ko.observable();
    ClientUI.ViewModel.ContactsViewModel.initializeBase(this);
    this.parentCustomerId(parentCustomerId);
    var contact = new ClientUI.ViewModel.ObservableContact();
    contact.parentcustomerid(parentCustomerId);
    this.ContactEdit = ko.validatedObservable(contact);
    this.ContactEdit().add_onSaveComplete(ss.Delegate.create(this, this._contactsViewModel_OnSaveComplete$1));
    this.Contacts.onDataLoaded.subscribe(ss.Delegate.create(this, this._contacts_OnDataLoaded$1));
    ClientUI.ViewModel.ObservableContact.registerValidation(this.Contacts.validationBinder);
    this.AllowAddNew = ko.dependentObservable(ss.Delegate.create(this, this.allowAddNewComputed));
    this.AllowOpen = ko.observable(false);
    this.Contacts.add_onSelectedRowsChanged(ss.Delegate.create(this, this._contacts_OnSelectedRowsChanged$1));
}
ClientUI.ViewModel.ContactsViewModel.prototype = {
    ContactEdit: null,
    AllowAddNew: null,
    AllowOpen: null,
    
    _contacts_OnDataLoaded$1: function ClientUI_ViewModel_ContactsViewModel$_contacts_OnDataLoaded$1(e, data) {
        var args = data;
        for (var i = 0; i < args.to; i++) {
            var contact = this.Contacts.getItem(i);
            if (contact == null) {
                return;
            }
            contact.add_propertyChanged(ss.Delegate.create(this, this._contact_PropertyChanged$1));
        }
    },
    
    _contacts_OnSelectedRowsChanged$1: function ClientUI_ViewModel_ContactsViewModel$_contacts_OnSelectedRowsChanged$1() {
        var selectedRows = SparkleXrm.GridEditor.DataViewBase.rangesToRows(this.Contacts.getSelectedRows());
        if (selectedRows.length === 1) {
            this.AllowOpen(true);
        }
        else {
            this.AllowOpen(false);
        }
    },
    
    _contact_PropertyChanged$1: function ClientUI_ViewModel_ContactsViewModel$_contact_PropertyChanged$1(sender, e) {
        var updated = sender;
        var contactToUpdate = new ClientUI.Model.Contact();
        contactToUpdate.contactid = new Xrm.Sdk.Guid(updated.id);
        var updateRequired = false;
        switch (e.propertyName) {
            case 'firstname':
                contactToUpdate.firstname = updated.firstname;
                updateRequired = true;
                break;
            case 'lastname':
                contactToUpdate.lastname = updated.lastname;
                updateRequired = true;
                break;
            case 'preferredcontactmethodcode':
                contactToUpdate.preferredcontactmethodcode = updated.preferredcontactmethodcode;
                updateRequired = true;
                break;
        }
        if (updateRequired) {
            Xrm.Sdk.OrganizationServiceProxy.beginUpdate(contactToUpdate, ss.Delegate.create(this, function(state) {
                try {
                    Xrm.Sdk.OrganizationServiceProxy.endUpdate(state);
                    this.ErrorMessage(null);
                }
                catch (ex) {
                    this.ErrorMessage(ex.message);
                }
            }));
        }
    },
    
    _contactsViewModel_OnSaveComplete$1: function ClientUI_ViewModel_ContactsViewModel$_contactsViewModel_OnSaveComplete$1(result) {
        if (result == null) {
            this.Contacts.reset();
            this.Contacts.refresh();
        }
        this.ErrorMessage(result);
    },
    
    search: function ClientUI_ViewModel_ContactsViewModel$search() {
        var parentCustomerId = this.parentCustomerId().id.toString().replaceAll('{', '').replaceAll('}', '');
        this.Contacts.set_fetchXml("<fetch version='1.0' output-format='xml-platform' mapping='logical' returntotalrecordcount='true' no-lock='true' distinct='false' count='{0}' paging-cookie='{1}' page='{2}'>\r\n  <entity name='contact'>\r\n    <attribute name='firstname' />\r\n    <attribute name='lastname' />\r\n    <attribute name='preferredcontactmethodcode' />\r\n    <attribute name='contactid' />\n    <filter type='and'>\n        <condition attribute='parentcustomerid' operator='eq' value='" + parentCustomerId + "' />\n    </filter>\n    {3}\r\n  </entity>\r\n</fetch>");
        this.Contacts.refresh();
    },
    
    AddNewCommand: function ClientUI_ViewModel_ContactsViewModel$AddNewCommand() {
        this.ContactEdit().AddNewVisible(true);
    },
    
    DeleteSelectedCommand: function ClientUI_ViewModel_ContactsViewModel$DeleteSelectedCommand() {
        var selectedRows = SparkleXrm.GridEditor.DataViewBase.rangesToRows(this.Contacts.getSelectedRows());
        if (!selectedRows.length) {
            return;
        }
        var itemsToRemove = [];
        var $enum1 = ss.IEnumerator.getEnumerator(selectedRows);
        while ($enum1.moveNext()) {
            var row = $enum1.current;
            itemsToRemove.add(this.Contacts.getItem(row));
        }
        try {
            var $enum2 = ss.IEnumerator.getEnumerator(itemsToRemove);
            while ($enum2.moveNext()) {
                var item = $enum2.current;
                Xrm.Sdk.OrganizationServiceProxy.delete_(item.logicalName, new Xrm.Sdk.Guid(item.id));
            }
        }
        catch (ex) {
            this.ErrorMessage(ex.toString());
        }
        this.Contacts.raiseOnSelectedRowsChanged(null);
        this.Contacts.reset();
        this.Contacts.refresh();
    },
    
    OpenSelectedRecordCommand: function ClientUI_ViewModel_ContactsViewModel$OpenSelectedRecordCommand() {
        var selectedRows = SparkleXrm.GridEditor.DataViewBase.rangesToRows(this.Contacts.getSelectedRows());
        if (selectedRows.length !== 1) {
            return;
        }
        var itemsToOpen = [];
        var $enum1 = ss.IEnumerator.getEnumerator(selectedRows);
        while ($enum1.moveNext()) {
            var row = $enum1.current;
            itemsToOpen.add(this.Contacts.getItem(row));
        }
        try {
            var $enum2 = ss.IEnumerator.getEnumerator(itemsToOpen);
            while ($enum2.moveNext()) {
                var item = $enum2.current;
                Xrm.Utility.openEntityForm(item.logicalName, item.id, null);
            }
        }
        catch (ex) {
            this.ErrorMessage(ex.toString());
        }
    },
    
    allowAddNewComputed: function ClientUI_ViewModel_ContactsViewModel$allowAddNewComputed() {
        var parent = this.parentCustomerId();
        return parent != null && parent.id != null && parent.id.value != null && parent.id.value.length > 0;
    }
}


////////////////////////////////////////////////////////////////////////////////
// ClientUI.ViewModel.ObservableContact

ClientUI.ViewModel.ObservableContact = function ClientUI_ViewModel_ObservableContact() {
    this.AddNewVisible = ko.observable(false);
    this.contactid = ko.observable();
    this.firstname = ko.observable();
    this.lastname = ko.observable();
    this.preferredcontactmethodcode = ko.observable();
    this.parentcustomerid = ko.observable();
    ClientUI.ViewModel.ObservableContact.initializeBase(this);
    ClientUI.ViewModel.ObservableContact.registerValidation(new SparkleXrm.ObservableValidationBinder(this));
}
ClientUI.ViewModel.ObservableContact.registerValidation = function ClientUI_ViewModel_ObservableContact$registerValidation(binder) {
    binder.register('lastname', ClientUI.ViewModel.ObservableContact._validateLastName$1);
}
ClientUI.ViewModel.ObservableContact._validateLastName$1 = function ClientUI_ViewModel_ObservableContact$_validateLastName$1(rules, viewModel, dataContext) {
    return rules.addRule('Required', function(value) {
        return !String.isNullOrEmpty(value);
    });
}
ClientUI.ViewModel.ObservableContact.prototype = {
    
    add_onSaveComplete: function ClientUI_ViewModel_ObservableContact$add_onSaveComplete(value) {
        this.__onSaveComplete$1 = ss.Delegate.combine(this.__onSaveComplete$1, value);
    },
    remove_onSaveComplete: function ClientUI_ViewModel_ObservableContact$remove_onSaveComplete(value) {
        this.__onSaveComplete$1 = ss.Delegate.remove(this.__onSaveComplete$1, value);
    },
    
    __onSaveComplete$1: null,
    
    SaveCommand: function ClientUI_ViewModel_ObservableContact$SaveCommand() {
        var isValid = (this).isValid();
        if (!isValid) {
            (this).errors.showAllMessages(true);
            return;
        }
        this.isBusy(true);
        this.AddNewVisible(false);
        var contact = new ClientUI.Model.Contact();
        contact.firstname = this.firstname();
        contact.lastname = this.lastname();
        contact.parentcustomerid = this.parentcustomerid();
        contact.preferredcontactmethodcode = this.preferredcontactmethodcode();
        Xrm.Sdk.OrganizationServiceProxy.beginCreate(contact, ss.Delegate.create(this, function(state) {
            try {
                this.contactid(Xrm.Sdk.OrganizationServiceProxy.endCreate(state));
                this.__onSaveComplete$1(null);
                this.firstname(null);
                this.lastname(null);
                this.preferredcontactmethodcode(null);
                (this).errors.showAllMessages(false);
            }
            catch (ex) {
                this.__onSaveComplete$1(ex.message);
            }
            finally {
                this.isBusy(false);
            }
        }));
    },
    
    CancelCommand: function ClientUI_ViewModel_ObservableContact$CancelCommand() {
        this.AddNewVisible(false);
    }
}


Type.registerNamespace('ClientUI.View');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.View.ContactsView

ClientUI.View.ContactsView = function ClientUI_View_ContactsView() {
}
ClientUI.View.ContactsView.Init = function ClientUI_View_ContactsView$Init() {
    Xrm.PageEx.majorVersion = 2013;
    var id;
    var logicalName;
    id = '3D5A7E01-0B3F-E811-A952-000D3AB899D0';
    logicalName = 'account';
    ClientUI.View.ContactsView.vm = new ClientUI.ViewModel.ContactsViewModel(new Xrm.Sdk.EntityReference(new Xrm.Sdk.Guid(id), logicalName, null));
    var contactsDataBinder = new SparkleXrm.GridEditor.GridDataViewBinder();
    var columns = SparkleXrm.GridEditor.GridDataViewBinder.parseLayout('First Name,firstname,250,Last Name,lastname,250,Preferred Contact Method,preferredcontactmethodcode,100');
    var contactsGrid = contactsDataBinder.dataBindXrmGrid(ClientUI.View.ContactsView.vm.Contacts, columns, 'container', 'pager', true, false);
    var $enum1 = ss.IEnumerator.getEnumerator(columns);
    while ($enum1.moveNext()) {
        var col = $enum1.current;
        switch (col.field) {
            case 'preferredcontactmethodcode':
                SparkleXrm.GridEditor.XrmOptionSetEditor.bindColumn(col, 'contact', 'preferredcontactmethodcode', true);
                break;
            case 'firstname':
            case 'lastname':
                SparkleXrm.GridEditor.XrmTextEditor.bindColumn(col);
                break;
        }
    }
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
