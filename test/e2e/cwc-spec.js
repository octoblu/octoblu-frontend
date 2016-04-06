describe('CWC', function() {
  var EC = protractor.ExpectedConditions;

  var emailTextBox            = $('#emailAddress');
  var passwordTextBox         = $('#password');
  var submitButton            = $('#submit');
  var customerItem            = $('.customer-list-item');

  var isEmailFieldAvailable   = EC.elementToBeClickable(emailTextBox);
  var isCustomerItemAvailable = EC.visibilityOf(customerItem);

  it('should sign in', function() {
    browser.ignoreSynchronization = true;
    browser.get('https://workspace.cloudburrito.com');
    browser.wait(isEmailFieldAvailable, 5000);

    emailTextBox.sendKeys('');
    passwordTextBox.sendKeys('');
    submitButton.click();

    expect(customerItem.isPresent()).toBe(true);
  });
});
