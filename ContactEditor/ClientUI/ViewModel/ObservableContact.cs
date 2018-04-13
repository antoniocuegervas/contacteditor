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

        }

        #region 
        private Contact ToContact()
        {
            Contact contact = new Contact();
            contact.ContactId = ContactId.GetValue();
            contact.FirstName = FirstName.GetValue();
            contact.LastName = LastName.GetValue();
            contact.ParentCustomerId = ParentCustomerId.GetValue();
            contact.PreferredContactMethodCode = PreferredContactMethodCode.GetValue();
            return contact;
        }
        #endregion

        #region Commands
        public void SaveCommand()
        {
            IsBusy.SetValue(true);

            Contact contact = ToContact();

            OrganizationServiceProxy.BeginCreate(contact, delegate (object state) 
            {
                try
                {
                    ContactId.SetValue(OrganizationServiceProxy.EndCreate(state));
                    OnSaveComplete(null);
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
        #endregion
    }
}
