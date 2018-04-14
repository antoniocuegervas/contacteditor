// ClientUI.js
(function(){
Type.registerNamespace('ClientUI.Model');ClientUI.Model.Contact=function(){ClientUI.Model.Contact.initializeBase(this,['contact']);}
ClientUI.Model.Contact.prototype={contactid:null,firstname:null,lastname:null,preferredcontactmethodcode:null,parentcustomerid:null}
Type.registerNamespace('ClientUI.ViewModel');ClientUI.ViewModel.ContactsViewModel=function(){this.ErrorMessage=ko.observable();this.AllowAddNew=ko.observable(true);this.Contacts=new SparkleXrm.GridEditor.EntityDataViewModel(10,ClientUI.Model.Contact,true);ClientUI.ViewModel.ContactsViewModel.initializeBase(this);var $0=new ClientUI.ViewModel.ObservableContact();this.ContactEdit=ko.validatedObservable($0);this.ContactEdit().add_onSaveComplete(ss.Delegate.create(this,this.$1_2));this.Contacts.onDataLoaded.subscribe(ss.Delegate.create(this,this.$1_0));ClientUI.ViewModel.ObservableContact.registerValidation(this.Contacts.validationBinder);}
ClientUI.ViewModel.ContactsViewModel.prototype={ContactEdit:null,$1_0:function($p0,$p1){var $0=$p1;for(var $1=0;$1<$0.to;$1++){var $2=this.Contacts.getItem($1);if($2==null){return;}$2.add_propertyChanged(ss.Delegate.create(this,this.$1_1));}},$1_1:function($p0,$p1){var $0=$p0;var $1=new ClientUI.Model.Contact();$1.contactid=new Xrm.Sdk.Guid($0.id);var $2=false;switch($p1.propertyName){case 'firstname':$1.firstname=$0.firstname;$2=true;break;case 'lastname':$1.lastname=$0.lastname;$2=true;break;case 'preferredcontactmethodcode':$1.preferredcontactmethodcode=$0.preferredcontactmethodcode;$2=true;break;}if($2){Xrm.Sdk.OrganizationServiceProxy.beginUpdate($1,ss.Delegate.create(this,function($p1_0){
try{Xrm.Sdk.OrganizationServiceProxy.endUpdate($p1_0);this.ErrorMessage(null);}catch($1_0){this.ErrorMessage($1_0.message);}}));}},$1_2:function($p0){if($p0==null){this.Contacts.reset();this.Contacts.refresh();}this.ErrorMessage($p0);},search:function(){this.Contacts.set_fetchXml("<fetch version='1.0' output-format='xml-platform' mapping='logical' returntotalrecordcount='true' no-lock='true' distinct='false' count='{0}' paging-cookie='{1}' page='{2}'>\r\n  <entity name='contact'>\r\n    <attribute name='firstname' />\r\n    <attribute name='lastname' />\r\n    <attribute name='preferredcontactmethodcode' />\r\n    <attribute name='contactid' />\n    {3}\r\n  </entity>\r\n</fetch>");this.Contacts.refresh();},AddNewCommand:function(){},DeleteSelectedCommand:function(){},OpenAssociatedSubGridCommand:function(){}}
ClientUI.ViewModel.ObservableContact=function(){this.contactid=ko.observable();this.firstname=ko.observable();this.lastname=ko.observable();this.preferredcontactmethodcode=ko.observable();this.parentcustomerid=ko.observable();ClientUI.ViewModel.ObservableContact.initializeBase(this);ClientUI.ViewModel.ObservableContact.registerValidation(new SparkleXrm.ObservableValidationBinder(this));}
ClientUI.ViewModel.ObservableContact.registerValidation=function(binder){binder.register('lastname',ClientUI.ViewModel.ObservableContact.$1_2);}
ClientUI.ViewModel.ObservableContact.$1_2=function($p0,$p1,$p2){return $p0.addRule('Required',function($p1_0){
return !String.isNullOrEmpty($p1_0);});}
ClientUI.ViewModel.ObservableContact.prototype={add_onSaveComplete:function(value){this.$1_0=ss.Delegate.combine(this.$1_0,value);},remove_onSaveComplete:function(value){this.$1_0=ss.Delegate.remove(this.$1_0,value);},$1_0:null,$1_1:function(){var $0=new ClientUI.Model.Contact();$0.contactid=this.contactid();$0.firstname=this.firstname();$0.lastname=this.lastname();$0.parentcustomerid=this.parentcustomerid();$0.preferredcontactmethodcode=this.preferredcontactmethodcode();return $0;},saveCommand:function(){var $0=(this).isValid();if(!$0){(this).errors.showAllMessages(true);return;}this.isBusy(true);var $1=this.$1_1();Xrm.Sdk.OrganizationServiceProxy.beginCreate($1,ss.Delegate.create(this,function($p1_0){
try{this.contactid(Xrm.Sdk.OrganizationServiceProxy.endCreate($p1_0));this.$1_0(null);(this).errors.showAllMessages(false);}catch($1_0){this.$1_0($1_0.message);}finally{this.isBusy(false);}}));}}
Type.registerNamespace('ClientUI.View');ClientUI.View.ContactsView=function(){}
ClientUI.View.ContactsView.Init=function(){Xrm.PageEx.majorVersion=2013;ClientUI.View.ContactsView.vm=new ClientUI.ViewModel.ContactsViewModel();var $0=new SparkleXrm.GridEditor.GridDataViewBinder();var $1=SparkleXrm.GridEditor.GridDataViewBinder.parseLayout('First Name,firstname,250,Last Name,lastname,250,Preferred Contact Method,preferredcontactmethodcode,100');var $2=$0.dataBindXrmGrid(ClientUI.View.ContactsView.vm.Contacts,$1,'container','pager',true,false);var $enum1=ss.IEnumerator.getEnumerator($1);while($enum1.moveNext()){var $3=$enum1.current;switch($3.field){case 'preferredcontactmethodcode':SparkleXrm.GridEditor.XrmOptionSetEditor.bindColumn($3,'contact','preferredcontactmethodcode',true);break;case 'firstname':case 'lastname':SparkleXrm.GridEditor.XrmTextEditor.bindColumn($3);break;}}SparkleXrm.ViewBase.registerViewModel(ClientUI.View.ContactsView.vm);$(function(){
ClientUI.View.ContactsView.vm.search();});}
ClientUI.Model.Contact.registerClass('ClientUI.Model.Contact',Xrm.Sdk.Entity);ClientUI.ViewModel.ContactsViewModel.registerClass('ClientUI.ViewModel.ContactsViewModel',SparkleXrm.ViewModelBase);ClientUI.ViewModel.ObservableContact.registerClass('ClientUI.ViewModel.ObservableContact',SparkleXrm.ViewModelBase);ClientUI.View.ContactsView.registerClass('ClientUI.View.ContactsView');ClientUI.View.ContactsView.vm=null;})();// This script was generated using Script# v0.7.4.0
