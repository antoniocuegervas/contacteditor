// ContactsGridViewModel.cs
//

using ClientUI.Model;
using KnockoutApi;
using SparkleXrm;
using SparkleXrm.GridEditor;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

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
        }
        #endregion

        #region Event Handlers 
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
