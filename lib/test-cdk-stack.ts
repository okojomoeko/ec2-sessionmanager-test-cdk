import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { readFileSync } from 'fs';

export class TestCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Create new VPC with 2 Subnets
    const vpc = new ec2.Vpc(this, 'NewsBlogVPC', {
      maxAzs : 1
    });

    // create sg
    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      description: 'For SSM only',
      allowAllOutbound: true
    });

    // create sg2
    const securityGroup2 = new ec2.SecurityGroup(this, 'SecurityGroup2', {
      vpc,
      description: 'For Tunnel Only',
      allowAllOutbound: true,
    });

    // Open port for http
    securityGroup2.connections.allowFrom(securityGroup, ec2.Port.tcp(80), 'for http server');

    const role = new iam.Role(this, 'ec2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    })

    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));

    // Use Latest Amazon Linux Image - CPU Type X86_64
    const ami = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      cpuType: ec2.AmazonLinuxCpuType.X86_64
    });


    // // If you require cloud-init
    // const userDataFile = readFileSync('./lib/user-data.yml', 'utf8');

    // Create the instance using the Security Group, AMI, and KeyPair defined in the VPC created
    const ec2Instance = new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ami,
      securityGroup: securityGroup,
      role: role,
    });

    const ec2Instance2 = new ec2.Instance(this, 'Instance2', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ami,
      securityGroup: securityGroup2,
      role: role,
    });
    // ec2Instance2.addUserData(userDataFile);


  }
}
