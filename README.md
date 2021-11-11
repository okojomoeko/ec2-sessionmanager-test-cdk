# Overview 

Private Subnetの適当なEC2 Instanceから、Session Managerを使ったSSH portforwardingでPrivate Subnetに置いたWeb Server用EC2 Instanceに接続する。

## 使い方

deployしたらまずはhoge instanceにアクセスできるか確認する。

keypairがないのでsshできないが、送りつける([参考](https://qiita.com/dairappa/items/96d55e929cce22ba90a5))

```
aws ec2-instance-connect send-ssh-public-key \
    --instance-id YOURINSTANCEID \
    --availability-zone us-east-1a \
    --instance-os-user ec2-user \
    --ssh-public-key file://$HOME/.ssh/id_rsa.pub
```

cdkで作ってしまってもいいかもしれない([参考](https://github.com/udondan/cdk-ec2-key-pair))

ssh config
```
host i-* mi-*
    IdentityFile "~/.ssh/id_rsa"
    ProxyCommand sh -c "aws ssm start-session --target %h --document-name AWS-StartSSHSession --parameters 'portNumber=%p'"
```

とりあえず上記の設定をして、instance1にsshできる

instance2にnginxをinstallして建てる([参考](https://qiita.com/Hide-Zaemon/items/f4a0599b7c8cb3559ca0))
そのうちcloud-initする
```
sudo yum update
sudo amazon-linux-extras enable nginx1
sudo yum -y install nginx
sudo systemctl start nginx.service
```

そして、instance2のinboundはtcp(80)がallowとなっているので、session managerでportfordingする

`ssh ec2-user@YOURINSTANCEID -fNL 8080:PRIVAEADDRESS:80`

localhost:8080でアクセスできたら成功

# Welcome to your CDK TypeScript project!

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`TestCdkStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Tutorial  
See [this useful workshop](https://cdkworkshop.com/20-typescript.html) on working with the AWS CDK for Typescript projects.


## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
