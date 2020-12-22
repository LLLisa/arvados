# Copyright (C) The Arvados Authors. All rights reserved.
#
# SPDX-License-Identifier: AGPL-3.0

require 'test_helper'

class ApiClientAuthorizationsApiTest < ActionDispatch::IntegrationTest
  fixtures :all

  test "create system auth" do
    post "/arvados/v1/api_client_authorizations/create_system_auth",
      params: {:format => :json, :scopes => ['test'].to_json},
      headers: {'HTTP_AUTHORIZATION' => "OAuth2 #{api_client_authorizations(:admin_trustedclient).api_token}"}
    assert_response :success
  end

  [:admin_trustedclient, :SystemRootToken].each do |tk|
    test "create token for different user using #{tk}" do
      if tk == :SystemRootToken
        token = "xyzzy-SystemRootToken"
        Rails.configuration.SystemRootToken = token
      else
        token = api_client_authorizations(tk).api_token
      end

      post "/arvados/v1/api_client_authorizations",
           params: {
             :format => :json,
             :api_client_authorization => {
               :owner_uuid => users(:spectator).uuid
             }
           },
           headers: {'HTTP_AUTHORIZATION' => "OAuth2 #{token}"}
      assert_response :success

      get "/arvados/v1/users/current",
          params: {:format => :json},
          headers: {'HTTP_AUTHORIZATION' => "OAuth2 #{json_response['api_token']}"}
      @json_response = nil
      assert_equal json_response['uuid'], users(:spectator).uuid
    end
  end

  test "System root token is system user" do
    token = "xyzzy-SystemRootToken"
    Rails.configuration.SystemRootToken = token
    get "/arvados/v1/users/current",
        params: {:format => :json},
        headers: {'HTTP_AUTHORIZATION' => "OAuth2 #{token}"}
    assert_equal json_response['uuid'], system_user_uuid
  end

  test "refuse to create token for different user if not trusted client" do
    post "/arvados/v1/api_client_authorizations",
      params: {
        :format => :json,
        :api_client_authorization => {
          :owner_uuid => users(:spectator).uuid
        }
      },
      headers: {'HTTP_AUTHORIZATION' => "OAuth2 #{api_client_authorizations(:admin).api_token}"}
    assert_response 403
  end

  test "refuse to create token for different user if not admin" do
    post "/arvados/v1/api_client_authorizations",
      params: {
        :format => :json,
        :api_client_authorization => {
          :owner_uuid => users(:spectator).uuid
        }
      },
      headers: {'HTTP_AUTHORIZATION' => "OAuth2 #{api_client_authorizations(:active_trustedclient).api_token}"}
    assert_response 403
  end

end
