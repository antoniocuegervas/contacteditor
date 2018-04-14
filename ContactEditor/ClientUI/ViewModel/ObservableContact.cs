// ObservableContact.cs
//

using ClientUI.Model;
using KnockoutApi;
using SparkleXrm;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm.Sdk;

namespace ClientUI.ViewModel
{
    public class ObservableContact : ViewModelBase
    {
        public event Action<string> OnSaveComplete;

        #region Fields
        [PreserveCase]
        public Observable<bool> AddNewVisible = Knockout.Observable<bool>(false);

        [ScriptName("contactid")]
        public Observable<Guid> ContactId = Knockout.Observable<Guid>();

        [ScriptName("firstname")]
        public Observable<string> FirstName = Knockout.Observable<string>();

        [ScriptName("lastname")]
        public Observable<string> LastName = Knockout.Observable<string>();

        [ScriptName("preferredcontactmethodcode")]
        public Observable<OptionSetValue> PreferredContactMethodCode = Knockout.Observable<OptionSetValue>();

        [ScriptName("parentcustomerid")]
        public Observable<EntityReference> ParentCustomerId = Knockout.Observable<EntityReference>();
        #endregion

        public ObservableContact()
        {
            ObservableContact.RegisterValidation(new ObservableValidationBinder(this));
        }

        #region Methods

        #endregion

        #region Commands
        [PreserveCase]
        public void SaveCommand()
        {
            bool isValid = ((IValidatedObservable)this).IsValid();
            if (!isValid)
            {
                ((IValidatedObservable)this).Errors.ShowAllMessages(true);
                return;
            }
            IsBusy.SetValue(true);
            AddNewVisible.SetValue(false);

            Contact contact = new Contact();
            contact.FirstName = FirstName.GetValue();
            contact.LastName = LastName.GetValue();
            contact.ParentCustomerId = ParentCustomerId.GetValue();
            contact.PreferredContactMethodCode = PreferredContactMethodCode.GetValue();

            OrganizationServiceProxy.BeginCreate(contact, delegate (object state) 
            {
                try
                {
                    ContactId.SetValue(OrganizationServiceProxy.EndCreate(state));
                    OnSaveComplete(null);
                    FirstName.SetValue(null);
                    LastName.SetValue(null);
                    PreferredContactMethodCode.SetValue(null);
                    ((IValidatedObservable)this).Errors.ShowAllMessages(false);
                }
                catch(Exception ex)
                {
                    OnSaveComplete(ex.Message);
                }
                finally
                {
                    IsBusy.SetValue(false);
                }
            });
        }

        [PreserveCase]
        public void CancelCommand()
        {
            this.AddNewVisible.SetValue(false);

        }
        #endregion

        #region Validation Rules

        public static void RegisterValidation(ValidationBinder binder)
        {
            binder.Register("lastname", ValidateLastName);
        }

        private static ValidationRules ValidateLastName(ValidationRules rules, object viewModel, object dataContext)
        {
            return rules.AddRule("Required", delegate (object value)
            {
                return !string.IsNullOrEmpty((string)value);
            });
        }
        #endregion
    }
}
