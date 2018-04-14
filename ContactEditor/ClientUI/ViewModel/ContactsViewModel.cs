// ContactsGridViewModel.cs
//

using ClientUI.Model;
using KnockoutApi;
using Slick;
using SparkleXrm;
using SparkleXrm.GridEditor;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm.Sdk;

namespace ClientUI.ViewModel
{
    public class ContactsViewModel : ViewModelBase
    {

        #region Fields
        [PreserveCase]
        public Observable<string> ErrorMessage = Knockout.Observable<string>();
        [PreserveCase]
        public Observable<ObservableContact> ContactEdit;
        [PreserveCase]
        public Observable<bool> AllowAddNew = Knockout.Observable<bool>(true);
        [PreserveCase]
        public EntityDataViewModel Contacts = new EntityDataViewModel(10, typeof(Contact), true);
        #endregion
        #region Constructors
        public ContactsViewModel()
        {
            ContactEdit = Knockout.Observable<ObservableContact>(new ObservableContact());
            ContactEdit.GetValue().OnSaveComplete += ContactsViewModel_OnSaveComplete;
            Contacts.OnDataLoaded.Subscribe(Contacts_OnDataLoaded);
        }
        #endregion

        #region Event Handlers 
        private void Contacts_OnDataLoaded(EventData e, object data)
        {
            DataLoadedNotifyEventArgs args = (DataLoadedNotifyEventArgs)data;
            for (int i=0; i<args.To; i++)
            {
                Contact contact = (Contact)Contacts.GetItem(i);
                if (contact == null)
                    return;
                contact.PropertyChanged += Contact_PropertyChanged;
            }
        }

        private void Contact_PropertyChanged(object sender, Xrm.ComponentModel.PropertyChangedEventArgs e)
        {
            Contact updated = (Contact)sender;
            Contact contactToUpdate = new Contact();
            contactToUpdate.ContactId = new Guid(updated.Id);
            bool updateRequired = false;
            switch(e.PropertyName)
            {
                case "firstname":
                    contactToUpdate.FirstName = updated.FirstName;
                    updateRequired = true;
                    break;
                case "lastname":
                    contactToUpdate.LastName = updated.LastName;
                    updateRequired = true;
                    break;
                case "preferredcontactmethodcode":
                    contactToUpdate.PreferredContactMethodCode = updated.PreferredContactMethodCode;
                    updateRequired = true;
                    break;
            }
            if (updateRequired)
            {
                OrganizationServiceProxy.BeginUpdate(contactToUpdate, delegate (object state)
                {
                    try
                    {
                        OrganizationServiceProxy.EndUpdate(state);
                        ErrorMessage.SetValue(null);
                    }
                    catch (Exception ex)
                    {
                        ErrorMessage.SetValue(ex.Message);
                    }
                });
            }
        }

        private void ContactsViewModel_OnSaveComplete(string result)
        {
            if (result == null)
            {
                ErrorMessage.SetValue(null);
            }
            else
            {
                ErrorMessage.SetValue(result);
            }
        }
        #endregion

        #region Methods

        public void Search()
        {
            Contacts.FetchXml = @"<fetch version='1.0' output-format='xml-platform' mapping='logical' returntotalrecordcount='true' no-lock='true' distinct='false' count='{0}' paging-cookie='{1}' page='{2}'>
  <entity name='contact'>
    <attribute name='firstname' />
    <attribute name='lastname' />
    <attribute name='preferredcontactmethodcode' />
    <attribute name='contactid' />
    {3}
  </entity>
</fetch>";
            Contacts.Refresh();
        }
        #endregion

        #region Commands
        [PreserveCase]
        public void AddNewCommand()
        {

        }

        [PreserveCase]
        public void DeleteSelectedCommand()
        {

        }

        [PreserveCase]
        public void OpenAssociatedSubGridCommand()
        {

        }
        #endregion
    }
}
