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
    parentcustomerid: null,
    creditlimit: null
}


Type.registerNamespace('ClientUI');

////////////////////////////////////////////////////////////////////////////////
// ResourceStrings

ResourceStrings = function ResourceStrings() {
}


Type.registerNamespace('ClientUI.ViewModel');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.ViewModel.ContactsViewModel

ClientUI.ViewModel.ContactsViewModel = function ClientUI_ViewModel_ContactsViewModel(parentCustomerId, pageSize) {
    this.ErrorMessage = ko.observable();
    this.ParentCustomerId = ko.observable();
    ClientUI.ViewModel.ContactsViewModel.initializeBase(this);
    this.Contacts = new SparkleXrm.GridEditor.EntityDataViewModel(pageSize, ClientUI.Model.Contact, true);
    this.ParentCustomerId(parentCustomerId);
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
    Contacts: null,
    
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
            case 'creditlimit':
                contactToUpdate.creditlimit = updated.creditlimit;
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
        var parentCustomerId = this.ParentCustomerId().id.toString().replaceAll('{', '').replaceAll('}', '');
        this.Contacts.set_fetchXml("<fetch version='1.0' output-format='xml-platform' mapping='logical' returntotalrecordcount='true' no-lock='true' distinct='false' count='{0}' paging-cookie='{1}' page='{2}'>\r\n  <entity name='contact'>\r\n    <attribute name='firstname' />\r\n    <attribute name='lastname' />\r\n    <attribute name='preferredcontactmethodcode' />\r\n    <attribute name='creditlimit' />\r\n    <attribute name='contactid' />\n    <filter type='and'>\n        <condition attribute='parentcustomerid' operator='eq' value='" + parentCustomerId + "' />\n    </filter>\n    {3}\r\n  </entity>\r\n</fetch>");
        this.Contacts.refresh();
    },
    
    _delete_$1: function ClientUI_ViewModel_ContactsViewModel$_delete_$1(selectedRows) {
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
    
    AddNewCommand: function ClientUI_ViewModel_ContactsViewModel$AddNewCommand() {
        this.ContactEdit().parentcustomerid(this.ParentCustomerId());
        this.ErrorMessage(null);
        this.ContactEdit().AddNewVisible(true);
    },
    
    DeleteSelectedCommand: function ClientUI_ViewModel_ContactsViewModel$DeleteSelectedCommand() {
        var selectedRows = SparkleXrm.GridEditor.DataViewBase.rangesToRows(this.Contacts.getSelectedRows());
        if (!selectedRows.length) {
            return;
        }
        Xrm.Utility.confirmDialog(String.format(ResourceStrings.ConfirmDeleteSelectedConnection, selectedRows.length), ss.Delegate.create(this, function() {
            this._delete_$1(selectedRows);
        }), null);
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
        var parent = this.ParentCustomerId();
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
    this.creditlimit = ko.observable();
    ClientUI.ViewModel.ObservableContact.initializeBase(this);
    ClientUI.ViewModel.ObservableContact.registerValidation(new SparkleXrm.ObservableValidationBinder(this));
}
ClientUI.ViewModel.ObservableContact.registerValidation = function ClientUI_ViewModel_ObservableContact$registerValidation(binder) {
    binder.register('lastname', ClientUI.ViewModel.ObservableContact._validateLastName$1);
}
ClientUI.ViewModel.ObservableContact._validateLastName$1 = function ClientUI_ViewModel_ObservableContact$_validateLastName$1(rules, viewModel, dataContext) {
    return rules.addRule(ResourceStrings.RequiredMessage, function(value) {
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
        contact.creditlimit = this.creditlimit();
        Xrm.Sdk.OrganizationServiceProxy.beginCreate(contact, ss.Delegate.create(this, function(state) {
            try {
                this.contactid(Xrm.Sdk.OrganizationServiceProxy.endCreate(state));
                this.__onSaveComplete$1(null);
                this.firstname(null);
                this.lastname(null);
                this.preferredcontactmethodcode(null);
                this.creditlimit(null);
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
    var lcid = Xrm.Sdk.OrganizationServiceProxy.getUserSettings().uilanguageid;
    SparkleXrm.LocalisedContentLoader.fallBackLCID = 0;
    SparkleXrm.LocalisedContentLoader.supportedLCIDs.add(3082);
    SparkleXrm.LocalisedContentLoader.supportedLCIDs.add(1033);
    SparkleXrm.LocalisedContentLoader.loadContent('ced1_/js/Res.metadata.js', lcid, function() {
        ClientUI.View.ContactsView._initLocalisedContent();
    });
}
ClientUI.View.ContactsView._initLocalisedContent = function ClientUI_View_ContactsView$_initLocalisedContent() {
    var parameters;
    var id;
    var logicalName;
    var pageSize = 10;
    id = '3D5A7E01-0B3F-E811-A952-000D3AB899D0';
    logicalName = 'account';
    parameters = {};
    var parent = new Xrm.Sdk.EntityReference(new Xrm.Sdk.Guid(id), logicalName, null);
    $(window).resize(ClientUI.View.ContactsView._onResize);
    ClientUI.View.ContactsView._vm = new ClientUI.ViewModel.ContactsViewModel(parent, pageSize);
    var contactsDataBinder = new SparkleXrm.GridEditor.GridDataViewBinder();
    var columns = SparkleXrm.GridEditor.GridDataViewBinder.parseLayout(ResourceStrings.LastName + ',lastname,200,' + ResourceStrings.FirstName + ',firstname,200,' + ResourceStrings.PreferredContactMethodCode + ',preferredcontactmethodcode,120,' + ResourceStrings.CreditLimit + ',creditlimit,120');
    ClientUI.View.ContactsView._contactsGrid = contactsDataBinder.dataBindXrmGrid(ClientUI.View.ContactsView._vm.Contacts, columns, 'container', 'pager', true, false);
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
            case 'creditlimit':
                SparkleXrm.GridEditor.XrmMoneyEditor.bindColumn(col, 0, 1000000000);
                break;
        }
    }
    SparkleXrm.ViewBase.registerViewModel(ClientUI.View.ContactsView._vm);
    ClientUI.View.ContactsView._onResize(null);
    $(function() {
        ClientUI.View.ContactsView._vm.search();
    });
}
ClientUI.View.ContactsView._checkForSaved = function ClientUI_View_ContactsView$_checkForSaved() {
    var parent = new Xrm.Sdk.EntityReference(new Xrm.Sdk.Guid(window.parent.Xrm.Page.data.entity.getId()), window.parent.Xrm.Page.data.entity.getEntityName(), null);
    if (window.parent.Xrm.Page.ui.getFormType() !== 10*.1 && parent.id != null) {
        ClientUI.View.ContactsView._vm.ParentCustomerId(parent);
        ClientUI.View.ContactsView._vm.search();
    }
    else {
        window.setTimeout(ClientUI.View.ContactsView._checkForSaved, 1000);
    }
}
ClientUI.View.ContactsView._onResize = function ClientUI_View_ContactsView$_onResize(e) {
    var height = $(window).height();
    var width = $(window).width();
    $('#container').height(height - 64).width(width - 2);
    if (ClientUI.View.ContactsView._contactsGrid != null) {
        ClientUI.View.ContactsView._contactsGrid.resizeCanvas();
    }
}


ClientUI.Model.Contact.registerClass('ClientUI.Model.Contact', Xrm.Sdk.Entity);
ResourceStrings.registerClass('ResourceStrings');
ClientUI.ViewModel.ContactsViewModel.registerClass('ClientUI.ViewModel.ContactsViewModel', SparkleXrm.ViewModelBase);
ClientUI.ViewModel.ObservableContact.registerClass('ClientUI.ViewModel.ObservableContact', SparkleXrm.ViewModelBase);
ClientUI.View.ContactsView.registerClass('ClientUI.View.ContactsView');
ResourceStrings.RequiredMessage = null;
ResourceStrings.SaveButton = null;
ResourceStrings.CancelButton = null;
ResourceStrings.Contact_CollectionName = null;
ResourceStrings.FirstName = null;
ResourceStrings.LastName = null;
ResourceStrings.PreferredContactMethodCode = null;
ResourceStrings.CreditLimit = null;
ResourceStrings.ConfirmDeleteSelectedConnection = null;
ClientUI.View.ContactsView._vm = null;
ClientUI.View.ContactsView._contactsGrid = null;
})();

//! This script was generated using Script# v0.7.4.0
