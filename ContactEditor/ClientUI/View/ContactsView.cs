// ContactsView.cs
//

using ClientUI.ViewModel;
using jQueryApi;
using Slick;
using SparkleXrm;
using SparkleXrm.GridEditor;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm;
using Xrm.Sdk;

namespace ClientUI.View
{
    public static class ContactsView
    {
        public static ContactsViewModel vm;

        [PreserveCase]
        public static void Init()
        {
            PageEx.MajorVersion = 2013;
            string id;
            string logicalName;
//#if DEBUG
            id = "3D5A7E01-0B3F-E811-A952-000D3AB899D0";
            logicalName = "account";

//#else
//            parameters = PageEx.GetWebResourceData(); // The allowed lookup types for the connections - e.g. account, contact, opportunity. This must be passed as a data parameter to the webresource 'account=name&contact=fullname&opportunity=name
//            id = ParentPage.Data.Entity.GetId();  
//            logicalName =  ParentPage.Data.Entity.GetEntityName();
//            ParentPage.Data.Entity.AddOnSave(CheckForSaved);
//#endif

            vm = new ContactsViewModel(new EntityReference(new Guid(id), logicalName, null));

            GridDataViewBinder contactsDataBinder = new GridDataViewBinder();
            List<Column> columns = GridDataViewBinder.ParseLayout("First Name,firstname,250,Last Name,lastname,250,Preferred Contact Method,preferredcontactmethodcode,100,Credit Limit,creditlimit,50");
            Grid contactsGrid = contactsDataBinder.DataBindXrmGrid(vm.Contacts, columns, "container", "pager", true, false);

            // contactsGrid.OnDblClick.Subscribe(ContactsGrid_OnDblClick);
            foreach (Column col in columns)
            {
                switch (col.Field)
                {
                    case "preferredcontactmethodcode":
                        XrmOptionSetEditor.BindColumn(col, "contact", "preferredcontactmethodcode", true);
                        break;
                    case "firstname":
                    case "lastname":
                        XrmTextEditor.BindColumn(col);
                        break;
                    case "creditlimit":
                        XrmMoneyEditor.BindColumn(col, 0, 1000000000);
                        break;
                }
            }

            ViewBase.RegisterViewModel(vm);

            jQuery.OnDocumentReady(delegate ()
            {
                vm.Search();
            }
            );
        }
    }
}
