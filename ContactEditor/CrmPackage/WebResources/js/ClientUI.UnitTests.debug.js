//! ClientUI.UnitTests.debug.js
//

(function() {

Type.registerNamespace('ClientUI.UnitTests');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.UnitTests.Bootstrap

ClientUI.UnitTests.Bootstrap = function ClientUI_UnitTests_Bootstrap() {
}
ClientUI.UnitTests.Bootstrap.RunTests = function ClientUI_UnitTests_Bootstrap$RunTests() {
    ClientUI.UnitTests.ContactTests.run();
}


////////////////////////////////////////////////////////////////////////////////
// ClientUI.UnitTests.ContactTests

ClientUI.UnitTests.ContactTests = function ClientUI_UnitTests_ContactTests() {
}
ClientUI.UnitTests.ContactTests.run = function ClientUI_UnitTests_ContactTests$run() {
    var module = {};
    module.beforeEach = ClientUI.UnitTests.ContactTests.setUp;
    module.afterEach = ClientUI.UnitTests.ContactTests.teardown;
    QUnit.module('Contact View Model Tests', module);
    QUnit.test('Test Create Contact', ClientUI.UnitTests.ContactTests.testCreateContact);
}
ClientUI.UnitTests.ContactTests.setUp = function ClientUI_UnitTests_ContactTests$setUp() {
    ClientUI.UnitTests.ContactTests._account = new Xrm.Sdk.Entity('account');
    ClientUI.UnitTests.ContactTests._account.setAttributeValue('name', 'Unit Test ' + Date.get_now().toLocaleTimeString());
    ClientUI.UnitTests.ContactTests._account.id = Xrm.Sdk.OrganizationServiceProxy.create(ClientUI.UnitTests.ContactTests._account).toString();
}
ClientUI.UnitTests.ContactTests.teardown = function ClientUI_UnitTests_ContactTests$teardown() {
    Xrm.Sdk.OrganizationServiceProxy.delete_(ClientUI.UnitTests.ContactTests._account.logicalName, new Xrm.Sdk.Guid(ClientUI.UnitTests.ContactTests._account.id));
}
ClientUI.UnitTests.ContactTests.testCreateContact = function ClientUI_UnitTests_ContactTests$testCreateContact(assert) {
    assert.expect(1);
    var done = assert.async();
    var vm = new ClientUI.ViewModel.ObservableContact();
    vm.parentcustomerid(ClientUI.UnitTests.ContactTests._account.toEntityReference());
    vm.firstname('Test first name');
    vm.lastname('Test last name');
    vm.preferredcontactmethodcode(new Xrm.Sdk.OptionSetValue(1));
    vm.add_onSaveComplete(function(message) {
        assert.equal(message, null, 'Message ' + message);
        done();
    });
    vm.saveCommand();
}


ClientUI.UnitTests.Bootstrap.registerClass('ClientUI.UnitTests.Bootstrap');
ClientUI.UnitTests.ContactTests.registerClass('ClientUI.UnitTests.ContactTests');
ClientUI.UnitTests.ContactTests._account = null;
ClientUI.UnitTests.ContactTests._contact = null;
})();

//! This script was generated using Script# v0.7.4.0
