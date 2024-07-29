Redmine::Plugin.register :dashboard do
  name 'Dashboard'
  author "Harold"
  description "Plugin adds an issues dashboard to the application "
  version '2.0.1'
  url 'https://github.com/akpaevj/Dashboard'
  author_url 'https://github.com/akpaevj'
  menu :top_menu, :dashboard, { controller: 'dashboard', action: 'index' }, caption: :top_menu_item_title, first: true
  settings :default => {:empty => true}, :partial => 'settings/dashboard_settings'
end
