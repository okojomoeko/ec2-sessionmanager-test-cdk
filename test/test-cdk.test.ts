import { Template, Match } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as TestCdk from '../lib/test-cdk-stack';


test('Snapshot test', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new TestCdk.TestCdkStack(app, 'MyTestStack');
    // THEN
  const template = Template.fromStack(stack);

  expect(template).toMatchSnapshot()
});
