// Bootstrap.cs
//

using SparkleXrm;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm;
using Xrm.Sdk;

namespace ClientUI.UnitTests
{
    public static class Bootstrap
    {
        [PreserveCase]
        public static void RunTests()
        {
            //QUnit.Log(delegate(LogInfo details)
            //{
            //    if (details.Result)
            //        return;

            //    string loc = details.Module + ": " + details.Name + ": ";
            //    string output = "FAILED: " + loc + (details.Message!=null ? details.Message + ", " : "");
            //    Script.Literal("console.log({0})",output);

            //});


            PageEx.MajorVersion = 2013;

            int lcid = (int)OrganizationServiceProxy.GetUserSettings().UILanguageId;

            LocalisedContentLoader.FallBackLCID = 0; // Always get a resource file
            LocalisedContentLoader.SupportedLCIDs.Add(3082);
            LocalisedContentLoader.SupportedLCIDs.Add(1033);

            LocalisedContentLoader.LoadContent("ced1_/js/Res.metadata.js", lcid, delegate ()
            {
                ContactTests.Run();
            });
        }
    }
}
