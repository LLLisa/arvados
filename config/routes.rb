Server::Application.routes.draw do
  resources :job_tasks
  resources :jobs
  resources :api_client_authorizations
  resources :api_clients
  resources :logs
  resources :groups
  resources :specimens
  resources :collections
  resources :links
  resources :nodes
  resources :pipeline_templates
  resources :pipeline_instances

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'

  namespace :orvos do
    namespace :v1 do
      match '/schema' => 'schema#show'
      match '/rest' => 'schema#discovery_rest_description'
      match '/nodes/:uuid/ping' => 'nodes#ping', :as => :ping_node
      match '/links/from/:tail_uuid' => 'links#index', :as => :orvos_v1_links_from
      match '/users/current' => 'users#current'
      resources :collections
      resources :links
      resources :nodes
      resources :pipeline_templates
      resources :pipeline_instances
      resources :specimens
      resources :groups
      resources :logs
      resources :users
      resources :jobs
      resources :job_tasks
    end
  end

  # omniauth
  match '/auth/:provider/callback', :to => 'user_sessions#create'
  match '/auth/failure', :to => 'user_sessions#failure'

  # Custom logout
  match '/login', :to => 'user_sessions#login'
  match '/logout', :to => 'user_sessions#logout'

  # Send unroutable requests to an arbitrary controller
  # (ends up at ApplicationController#render_not_found)
  match '*a', :to => 'orvos/v1/links#render_not_found'

  root :to => 'static#home'
end
