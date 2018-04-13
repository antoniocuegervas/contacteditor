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
// ClientUI.ViewModel.HelloWorldViewModel

ClientUI.ViewModel.HelloWorldViewModel = function ClientUI_ViewModel_HelloWorldViewModel() {
    ClientUI.ViewModel.HelloWorldViewModel.initializeBase(this);
    this.Message = ko.observable('Hello World');
}
ClientUI.ViewModel.HelloWorldViewModel.prototype = {
    Message: null,
    
    FooCommand: function ClientUI_ViewModel_HelloWorldViewModel$FooCommand() {
        this.Message(String.format('The time now is {0}', Date.get_now().toLocaleTimeString()));
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
// ClientUI.View.HelloWorldView

ClientUI.View.HelloWorldView = function ClientUI_View_HelloWorldView() {
}
ClientUI.View.HelloWorldView.Init = function ClientUI_View_HelloWorldView$Init() {
    Xrm.PageEx.majorVersion = 2013;
    ClientUI.View.HelloWorldView.vm = new ClientUI.ViewModel.HelloWorldViewModel();
    SparkleXrm.ViewBase.registerViewModel(ClientUI.View.HelloWorldView.vm);
}


ClientUI.Model.Contact.registerClass('ClientUI.Model.Contact', Xrm.Sdk.Entity);
ClientUI.ViewModel.HelloWorldViewModel.registerClass('ClientUI.ViewModel.HelloWorldViewModel', SparkleXrm.ViewModelBase);
ClientUI.ViewModel.ObservableContact.registerClass('ClientUI.ViewModel.ObservableContact', SparkleXrm.ViewModelBase);
ClientUI.View.HelloWorldView.registerClass('ClientUI.View.HelloWorldView');
ClientUI.View.HelloWorldView.vm = null;
})();

//! This script was generated using Script# v0.7.4.0
