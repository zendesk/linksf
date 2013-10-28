namespace :deploy do
  task :s3 do
    if `which s3cmd`.chomp.empty?
      puts 'please install and configure s3cmd'
    end
    deploy_glob = %w(
      js/static/output-*.js
      js/static/admin-*.js
      css/static/user-*.css
      css/static/admin-*.css
      index.html
      admin.html
    )
    Dir.glob(deploy_glob).each do |d|
      system("s3cmd put --acl-public #{d} s3://www.link-sf.com/#{d}")
    end

    # deploy everything in vendor
    system("s3cmd sync --acl-public vendor/ s3://www.link-sf.com/vendor/")

    # deploy everything in images
    system("s3cmd sync --acl-public images/ s3://www.link-sf.com/images/")
  end

  task :parse do
    system("cd #{File.dirname(__FILE__) + '/server'} && parse deploy")
  end

end

task :grunt do
  abort unless system("grunt")
end

task :clean do 
  system("rm {js,css}/static/*")
end

task :deploy => ['clean', 'grunt', 'deploy:parse', 'deploy:s3']
