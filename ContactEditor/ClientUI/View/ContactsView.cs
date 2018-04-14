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

namespace ClientUI.View
{
    public static class ContactsView
    {
        public static ContactsViewModel vm;

        [PreserveCase]
        public static void Init()
        {
            PageEx.MajorVersion = 2013;
            vm = new ContactsViewModel();

            GridDataViewBinder contactsDataBinder = new GridDataViewBinder();
            List<Column> columns = GridDataViewBinder.ParseLayout("First Name,firstname,250,Last Name,lastname,250,Preferred Contact Method,preferredcontactmethodcode,100");
            Grid contactsGrid = contactsDataBinder.DataBindXrmGrid(vm.Contacts, columns, "container", "pager", true, false);
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
