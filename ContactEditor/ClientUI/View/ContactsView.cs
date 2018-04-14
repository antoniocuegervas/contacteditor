// ContactsView.cs
//

using ClientUI.ViewModel;
using SparkleXrm;
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
            PageEx.MajorVersion = 365;
            vm = new ContactsViewModel();
            ViewBase.RegisterViewModel(vm);

        }
    }
}
