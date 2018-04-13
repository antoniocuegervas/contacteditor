// Contact.cs
//

using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm.Sdk;

namespace ClientUI.Model
{
    public class Contact : Entity
    {
        public Contact() : base("contact")
        {
        }

        #region Fields
        [ScriptName("contactid")]
        public Guid ContactId;

        [ScriptName("firstname")]
        public string FirstName;

        [ScriptName("lastname")]
        public string LastName;

        [ScriptName("preferredcontactmethodcode")]
        public OptionSetValue PreferredContactMethodCode;

        [ScriptName("parentcustomerid")]
        public EntityReference ParentCustomerId;
        #endregion
    }
}
