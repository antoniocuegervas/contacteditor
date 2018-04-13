// ObservableContact.cs
//

using ClientUI.Model;
using KnockoutApi;
using SparkleXrm;
using SparkleXrm.GridEditor;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm.Sdk;

namespace ClientUI.ViewModel
{
    public class ObservableContact : ViewModelBase
    {
        public event Action<string> OnSaveComplete;

        public EntityDataViewModel Contacts = new EntityDataViewModel(5, typeof(Contact), true);

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

        #region Methods
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

        public void Search()
        {
    //        string filter = @"<filter type='and'>
    //  <condition attribute='parentcustomerid' operator='eq' uiname='Fourth Coffee (sample)' uitype='account' value='{2D5A7E01-0B3F-E811-A952-000D3AB899D0}' />
    //</filter>";
            Contacts.FetchXml = @"<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false' returntotalrecordcount='true' count='{0}' paging-cookie={1} page='{2}'>
  <entity name='contact'>
    <attribute name='contactid' />
    <attribute name='firstname' />
    <attribute name='lastname' />
    <attribute name='preferredcontactmethodcode' />
    <attribute name='parentcustomerid' />
{3}
  </entity>
</fetch>";
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
