import { Route53Client } from "@aws-sdk/client-route-53";
import { aws_access_key, aws_secret_key, region } from "../config";

const aws_route53_client = new Route53Client({
  region: region,
  credentials: {
    accessKeyId: aws_access_key as string,
    secretAccessKey: aws_secret_key as string,
  },
});

export default aws_route53_client;
