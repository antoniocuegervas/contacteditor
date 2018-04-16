// ContactsView.cs
//

using ClientUI.ViewModel;
using jQueryApi;
using Slick;
using SparkleXrm;
using SparkleXrm.GridEditor;
using System;
using System.Collections.Generic;
using System.Html;
using System.Runtime.CompilerServices;
using Xrm;
using Xrm.Sdk;

namespace ClientUI.View
{
    public static class ContactsView
    {
        #region Fields
        private static ContactsViewModel vm;
        private static Grid contactsGrid;
        #endregion
        [PreserveCase]
        public static void Init()
        {
            PageEx.MajorVersion = 2013;

            int lcid = (int)OrganizationServiceProxy.GetUserSettings().UILanguageId;

            LocalisedContentLoader.FallBackLCID = 0; // Always get a resource file
            LocalisedContentLoader.SupportedLCIDs.Add(3082);
            LocalisedContentLoader.SupportedLCIDs.Add(1033);

            LocalisedContentLoader.LoadContent("ced1_/js/Res.metadata.js", lcid, delegate ()
            {
                InitLocalisedContent();
            });
        }
        private static void InitLocalisedContent()
        {

            Dictionary<string, string> parameters;
            string id;
            string logicalName;
            int pageSize = 10;
#if DEBUG
            id = "3D5A7E01-0B3F-E811-A952-000D3AB899D0";
            logicalName = "account";
            parameters = new Dictionary<string, string>();

#else
            parameters = PageEx.GetWebResourceData();
            id = ParentPage.Data.Entity.GetId();  
            logicalName =  ParentPage.Data.Entity.GetEntityName();
            ParentPage.Data.Entity.AddOnSave(CheckForSaved);
#endif
            EntityReference parent = new EntityReference(new Guid(id), logicalName, null);
            jQuery.Window.Resize(OnResize);
            vm = new ContactsViewModel(parent, pageSize);

            GridDataViewBinder contactsDataBinder = new GridDataViewBinder();
            List<Column> columns = GridDataViewBinder.ParseLayout(ResourceStrings.LastName + ",lastname,200," + ResourceStrings.FirstName + ",firstname,200," + ResourceStrings.PreferredContactMethodCode + ",preferredcontactmethodcode,120," + ResourceStrings.CreditLimit + ",creditlimit,120");
            contactsGrid = contactsDataBinder.DataBindXrmGrid(vm.Contacts, columns, "container", "pager", true, false);

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
            OnResize(null);
            jQuery.OnDocumentReady(delegate ()
            {
                vm.Search();
            }
            );
        }

        private static void CheckForSaved()
        {
            // Check if we have the id yet
            EntityReference parent = new EntityReference(new Guid(ParentPage.Data.Entity.GetId()), ParentPage.Data.Entity.GetEntityName(), null);
            if (ParentPage.Ui.GetFormType() != FormTypes.Create && parent.Id != null)
            {
                vm.ParentCustomerId.SetValue(parent);
                vm.Search();
            }
            else
            {
                Window.SetTimeout(CheckForSaved, 1000);
            }
        }

        #region Event Handlers
        private static void OnResize(jQueryEvent e)
        {
            int height = jQuery.Window.GetHeight();
            int width = jQuery.Window.GetWidth();

            jQuery.Select("#container").Height(height - 64).Width(width - 2);
            if (contactsGrid != null) contactsGrid.ResizeCanvas();
        }
        #endregion
    }
}