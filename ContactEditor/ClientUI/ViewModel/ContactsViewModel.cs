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
using Xrm;
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
        public DependentObservable<bool> AllowAddNew;
        [PreserveCase]
        public Observable<bool> AllowOpen;
        [PreserveCase]
        public EntityDataViewModel Contacts = new EntityDataViewModel(10, typeof(Contact), true);
        public Observable<EntityReference> ParentCustomerId = Knockout.Observable<EntityReference>();
        #endregion
        #region Constructors
        public ContactsViewModel(EntityReference parentCustomerId)
        {
            ParentCustomerId.SetValue(parentCustomerId);

            ObservableContact contact = new ObservableContact();
            contact.ParentCustomerId.SetValue(parentCustomerId);
            ContactEdit = (Observable<ObservableContact>)ValidatedObservableFactory.ValidatedObservable(contact);
            ContactEdit.GetValue().OnSaveComplete += ContactsViewModel_OnSaveComplete;
            Contacts.OnDataLoaded.Subscribe(Contacts_OnDataLoaded);
            ObservableContact.RegisterValidation(Contacts.ValidationBinder);
            AllowAddNew = Knockout.DependentObservable<bool>(AllowAddNewComputed);
            AllowOpen = Knockout.Observable<bool>(false);
            Contacts.OnSelectedRowsChanged += Contacts_OnSelectedRowsChanged;
        }
        #endregion

        #region Event Handlers 
        private void Contacts_OnDataLoaded(EventData e, object data)
        {
            DataLoadedNotifyEventArgs args = (DataLoadedNotifyEventArgs)data;
            for (int i = 0; i < args.To; i++)
            {
                Contact contact = (Contact)Contacts.GetItem(i);
                if (contact == null)
                    return;
                contact.PropertyChanged += Contact_PropertyChanged;
            }
        }

        private void Contacts_OnSelectedRowsChanged()
        {
            List<int> selectedRows = DataViewBase.RangesToRows(Contacts.GetSelectedRows());
            if (selectedRows.Count == 1)
            {
                AllowOpen.SetValue(true);
            }
            else
            {
                AllowOpen.SetValue(false);
            }
        }

        private void Contact_PropertyChanged(object sender, Xrm.ComponentModel.PropertyChangedEventArgs e)
        {
            Contact updated = (Contact)sender;
            Contact contactToUpdate = new Contact();
            contactToUpdate.ContactId = new Guid(updated.Id);
            bool updateRequired = false;
            switch (e.PropertyName)
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
                case "creditlimit":
                    contactToUpdate.CreditLimit = updated.CreditLimit;
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
                Contacts.Reset();
                Contacts.Refresh();
            }
            ErrorMessage.SetValue(result);
        }
        #endregion

        #region Methods

        public void Search()
        {
            string parentCustomerId = ParentCustomerId.GetValue().Id.ToString().Replace("{", "").Replace("}", "");

            Contacts.FetchXml = @"<fetch version='1.0' output-format='xml-platform' mapping='logical' returntotalrecordcount='true' no-lock='true' distinct='false' count='{0}' paging-cookie='{1}' page='{2}'>
  <entity name='contact'>
    <attribute name='firstname' />
    <attribute name='lastname' />
    <attribute name='preferredcontactmethodcode' />
    <attribute name='creditlimit' />
    <attribute name='contactid' />
    <filter type='and'>
        <condition attribute='parentcustomerid' operator='eq' value='" + parentCustomerId + @"' />
    </filter>
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
            ContactEdit.GetValue().AddNewVisible.SetValue(true);
        }

        [PreserveCase]
        public void DeleteSelectedCommand()
        {

            List<int> selectedRows = DataViewBase.RangesToRows(Contacts.GetSelectedRows());
            if (selectedRows.Count == 0)
                return;

            List<Entity> itemsToRemove = new List<Entity>();
            foreach (int row in selectedRows)
            {
                itemsToRemove.Add((Entity)Contacts.GetItem(row));
            }
            try
            {
                foreach (Entity item in itemsToRemove)
                {
                    OrganizationServiceProxy.Delete_(item.LogicalName, new Guid(item.Id));
                }
            }
            catch (Exception ex)
            {
                ErrorMessage.SetValue(ex.ToString());
            }
            Contacts.RaiseOnSelectedRowsChanged(null);
            Contacts.Reset();
            Contacts.Refresh();
        }

        [PreserveCase]
        public void OpenSelectedRecordCommand()
        {

            List<int> selectedRows = DataViewBase.RangesToRows(Contacts.GetSelectedRows());
            if (selectedRows.Count != 1)
                return;

            List<Entity> itemsToOpen = new List<Entity>();
            foreach (int row in selectedRows)
            {
                itemsToOpen.Add((Entity)Contacts.GetItem(row));
            }
            try
            {
                foreach (Entity item in itemsToOpen)
                {
                    Utility.OpenEntityForm(item.LogicalName, item.Id, null);
                }
            }
            catch (Exception ex)
            {
                ErrorMessage.SetValue(ex.ToString());
            }
        }
        #endregion
        #region Computed Observables
        public bool AllowAddNewComputed()
        {
            EntityReference parent = ParentCustomerId.GetValue();
            return parent != null && parent.Id != null && parent.Id.Value != null && parent.Id.Value.Length > 0;
        }
        #endregion
    }
}
