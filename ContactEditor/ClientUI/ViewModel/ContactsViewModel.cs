// ContactsGridViewModel.cs
//

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

        public EntityDataViewModel Contacts;
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
