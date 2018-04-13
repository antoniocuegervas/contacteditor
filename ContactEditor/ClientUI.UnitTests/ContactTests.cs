// Class1.cs
//

using ClientUI.ViewModel;
using QUnitApi;
using Slick;
using SparkleXrm;
using System;
using System.Collections.Generic;
using System.Html;
using Xrm.Sdk;

namespace ClientUI.UnitTests
{

    public class ContactTests
    {

        static Entity account;
        static Entity contact;

        public static void Run()
        {
            ModuleInfo module = new ModuleInfo();
            module.BeforeEach = SetUp;
            module.AfterEach = Teardown;
            QUnit.Module("Contact View Model Tests", module);
            QUnit.Test("Test Create Contact", TestCreateContact);

        }
        public static void SetUp()
        {
            account = new Entity("account");
            account.SetAttributeValue("name", "Unit Test " + DateTime.Now.ToLocaleTimeString());
            account.Id = OrganizationServiceProxy.Create(account).ToString();
        }

        public static void Teardown()
        {
            // Tidy Up
            OrganizationServiceProxy.Delete_(account.LogicalName, new Guid(account.Id));
        }

        public static void TestCreateContact(Assert assert)
        {
            assert.Expect(1);
            Action done = assert.Async();

            ObservableContact vm = new ObservableContact();
            vm.ParentCustomerId.SetValue(account.ToEntityReference());
            vm.FirstName.SetValue("Test first name");
            vm.LastName.SetValue("Test last name");
            vm.PreferredContactMethodCode.SetValue(new OptionSetValue(1)); // 1-5
            vm.OnSaveComplete += delegate (string message)
              {
                  assert.Equal(message, null, "Message " + message);
                  done();
              };
            vm.SaveCommand();


        }
    }
}