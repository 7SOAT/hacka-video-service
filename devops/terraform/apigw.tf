#region [VPC LINK]
resource "aws_api_gateway_vpc_link" "video_service" {
  name        = "video-service-apigw-vpclink"
  description = "Video service API Gateway VPC Link. Managed by Terraform."
  target_arns = [local.loadbalancer_arn]
}
#endregion
#region [Resources]
resource "aws_api_gateway_resource" "videos" {
  rest_api_id = local.apigw_id
  parent_id   = local.apigw_root_resource_id
  path_part   = "videos"
}
resource "aws_api_gateway_resource" "download" {
  rest_api_id = local.apigw_id
  parent_id   = aws_api_gateway_resource.videos.id
  path_part   = "download"
}
#endregion
#region [Methods]
resource "aws_api_gateway_method" "get_videos" {
  rest_api_id   = local.apigw_id
  resource_id   = aws_api_gateway_resource.videos.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy"           = true
    "method.request.header.Authorization" = true
  }
}

resource "aws_api_gateway_method" "post_videos" {
  rest_api_id   = local.apigw_id
  resource_id   = aws_api_gateway_resource.videos.id
  http_method   = "POST"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy"           = true
    "method.request.header.Authorization" = true
  }
}

resource "aws_api_gateway_method" "put_videos" {
  rest_api_id   = local.apigw_id
  resource_id   = aws_api_gateway_resource.videos.id
  http_method   = "PUT"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy"           = true
    "method.request.header.Authorization" = true
  }
}

resource "aws_api_gateway_method" "get_videos_download" {
  rest_api_id   = local.apigw_id
  resource_id   = aws_api_gateway_resource.download.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.path.proxy"           = true
    "method.request.header.Authorization" = true
  }
}
#endregion
#region [Integration]
resource "aws_api_gateway_integration" "get_videos" {
  rest_api_id = local.apigw_id
  resource_id = aws_api_gateway_resource.videos.id
  http_method = "GET"

  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${local.loadbalancer_dns_name}/videos"
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"

  request_parameters = {
    "integration.request.path.proxy"           = "method.request.path.proxy"
    "integration.request.header.Accept"        = "'application/json'"
    "integration.request.header.Authorization" = "method.request.header.Authorization"
  }

  connection_type = "VPC_LINK"
  connection_id   = aws_api_gateway_vpc_link.upload_service.id
}

resource "aws_api_gateway_integration" "post_videos" {
  rest_api_id = local.apigw_id
  resource_id = aws_api_gateway_resource.videos.id
  http_method = "POST"

  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${local.loadbalancer_dns_name}/videos"
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"

  request_parameters = {
    "integration.request.path.proxy"           = "method.request.path.proxy"
    "integration.request.header.Accept"        = "'application/json'"
    "integration.request.header.Authorization" = "method.request.header.Authorization"
  }

  connection_type = "VPC_LINK"
  connection_id   = aws_api_gateway_vpc_link.video_service.id
}

resource "aws_api_gateway_integration" "put_videos" {
  rest_api_id = local.apigw_id
  resource_id = aws_api_gateway_resource.videos.id
  http_method = "PUT"

  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${local.loadbalancer_dns_name}/videos"
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"

  request_parameters = {
    "integration.request.path.proxy"           = "method.request.path.proxy"
    "integration.request.header.Accept"        = "'application/json'"
    "integration.request.header.Authorization" = "method.request.header.Authorization"
  }

  connection_type = "VPC_LINK"
  connection_id   = aws_api_gateway_vpc_link.video_service.id
}

resource "aws_api_gateway_integration" "get_videos_download" {
  rest_api_id = local.apigw_id
  resource_id = aws_api_gateway_resource.download.id
  http_method = "GET"

  integration_http_method = "ANY"
  type                    = "HTTP_PROXY"
  uri                     = "http://${local.loadbalancer_dns_name}/videos"
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"

  request_parameters = {
    "integration.request.path.proxy"           = "method.request.path.proxy"
    "integration.request.header.Accept"        = "'application/json'"
    "integration.request.header.Authorization" = "method.request.header.Authorization"
  }

  connection_type = "VPC_LINK"
  connection_id   = aws_api_gateway_vpc_link.video_service.id
}
#endregion
